import { useCallback, useEffect, useRef, useState } from 'react';
import './LivingOrbDiagnostic.css';

type OrbState = 'idle' | 'listening' | 'processing';

export type CompletedDiagnostic = {
  audio: Blob;
  mimeType: string;
  durationSeconds: number;
  completedAt: string;
};

type Props = {
  /** Point to the approved, official LanXgrow logo asset; no replacement logo is generated. */
  logoSrc: string;
  onComplete: (result: CompletedDiagnostic) => Promise<void> | void;
  onError?: (message: string) => void;
};

const REQUESTED_DURATION_SECONDS = 60;
const MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/mp4',
  'audio/webm',
];

function getRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type));
}

export default function LivingOrbDiagnostic({ logoSrc, onComplete, onError }: Props) {
  const [started, setStarted] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [micPermissionMessage, setMicPermissionMessage] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [speechLevel, setSpeechLevel] = useState(0);
  const [hasAudio, setHasAudio] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const requestingRef = useRef(false);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const startWallClockRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishRequestedRef = useRef(false);
  const unmountedRef = useRef(false);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    animationFrameRef.current = null;
    intervalRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    analyserRef.current = null;
  }, []);

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      // Discard temporary recording on unmount; never persist to localStorage.
      recorderRef.current?.state === 'recording' && recorderRef.current.stop();
      cleanup();
    };
  }, [cleanup]);

  const monitorAudio = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const values = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(values);
    let sumSquares = 0;
    for (let i = 0; i < values.length; i++) {
      const centered = (values[i] - 128) / 128;
      sumSquares += centered * centered;
    }
    const rms = Math.sqrt(sumSquares / values.length);
    if (!unmountedRef.current) setSpeechLevel(Math.min(1, rms * 6));
    animationFrameRef.current = requestAnimationFrame(monitorAudio);
  }, []);

  const startRecording = async () => {
    if (requestingRef.current || processing || recorderRef.current?.state === 'recording') return;
    setMicPermissionMessage('');
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      const message = 'Microphone recording requires a supported browser on HTTPS or localhost.';
      setMicPermissionMessage(message);
      onError?.(message);
      return;
    }
    requestingRef.current = true;
    setRequesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false,
      });
      if (unmountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      streamRef.current = stream;
      const context = new AudioContext();
      audioContextRef.current = context;
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.82;
      source.connect(analyser); // Never connect mic to speakers.
      analyserRef.current = analyser;
      chunksRef.current = [];
      finishRequestedRef.current = false;
      const mimeType = getRecorderMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        const message = 'Recording failed. Please try again.';
        finishRequestedRef.current = false;
        if (recorder.state === 'recording') recorder.stop();
        cleanup();
        if (unmountedRef.current) return;
        setMicPermissionMessage(message);
        onError?.(message);
        setProcessing(false);
        setOrbState('idle');
      };
      recorder.onstop = async () => {
        cleanup();
        if (unmountedRef.current) return;
        setSpeechLevel(0);
        setOrbState('idle');
        if (!finishRequestedRef.current || unmountedRef.current) return;
        const audio = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const durationSeconds = Math.max(0, Math.round(((startTimeRef.current ? performance.now() - startTimeRef.current : 0) / 1000) * 10) / 10);
        if (audio.size === 0 || durationSeconds < 1) {
          const message = 'No usable recording was captured. Please try again.';
          setMicPermissionMessage(message);
          onError?.(message);
          setProcessing(false);
          return;
        }
        try {
          await onComplete({
            audio,
            mimeType: recorder.mimeType || audio.type,
            durationSeconds,
            completedAt: new Date().toISOString(),
          });
          if (!unmountedRef.current) setHasAudio(true);
        } catch {
          const message = 'Your recording could not be submitted. Please retry your interview.';
          if (!unmountedRef.current) setMicPermissionMessage(message);
          onError?.(message);
        } finally {
          chunksRef.current = [];
          if (!unmountedRef.current) setProcessing(false);
        }
      };
      recorder.start(250);
      startTimeRef.current = performance.now();
      startWallClockRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        if (!startWallClockRef.current) return;
        setElapsedSeconds(Math.round((Date.now() - startWallClockRef.current) / 1000));
      }, 500);
      setOrbState('listening');
      setStarted(true);
      setHasAudio(false);
      setElapsedSeconds(0);
      monitorAudio();
    } catch {
      cleanup();
      if (unmountedRef.current) return;
      const message = 'Microphone access was not granted. Check browser permissions and try again.';
      setMicPermissionMessage(message);
      onError?.(message);
    } finally {
      requestingRef.current = false;
      if (!unmountedRef.current) setRequesting(false);
    }
  };

  const completeRecording = () => {
    if (orbState !== 'listening' || recorderRef.current?.state !== 'recording') return;
    finishRequestedRef.current = true;
    setProcessing(true);
    setOrbState('processing');
    recorderRef.current.stop();
  };

  return (
    <section className="lx-diagnostic" aria-labelledby="lx-diagnostic-title">
      <div className="lx-diagnostic__wrap">
        {!started ? (
          <div className="lx-hero">
            <p className="lx-eyebrow">LANXGROW · PERSONAL COMMUNICATION DIAGNOSTIC</p>
            <h1 id="lx-diagnostic-title">Your voice is the beginning.</h1>
            <p>Start with a short, natural English conversation. No account is needed to begin.</p>
            <button className="lx-primary-button" type="button" onClick={() => setStarted(true)}>
              Take the Interview <span aria-hidden="true">↗</span>
            </button>
            <p className="lx-caption">Your microphone is requested only when you start recording.</p>
          </div>
        ) : (
          <div className="lx-chamber">
            <p className="lx-eyebrow">YOUR FIRST CONVERSATION</p>
            <h1 id="lx-diagnostic-title">Tell us about yourself.</h1>
            <p className="lx-prompt">Introduce yourself, where you're from, what you've done, and the interests you enjoy.</p>
            <div className={`lx-orb lx-orb--${orbState}`} style={{ '--lx-audio-level': speechLevel } as React.CSSProperties} aria-hidden="true">
              <div className="lx-orb__glow" />
              <div className="lx-orb__surface" />
              <img className="lx-orb__logo" src={logoSrc} alt="" draggable="false" />
            </div>
            <p className="lx-state" role="status" aria-live="polite">
              {processing ? 'Preparing your recording…' : orbState === 'listening' ? 'Listening to your voice' : hasAudio ? 'Recording captured' : 'Ready when you are'}
            </p>
            {micPermissionMessage && <p className="lx-error" role="alert">{micPermissionMessage}</p>}
            <div className="lx-controls">
              {orbState === 'listening' ? (
                <button className="lx-primary-button" type="button" onClick={completeRecording} disabled={processing}>
                  Complete Interview
                </button>
              ) : (
                <button className="lx-primary-button" type="button" onClick={startRecording} disabled={processing || requesting}>
                  {requesting ? 'Opening microphone…' : hasAudio ? 'Record again' : 'Start Speaking'}
                </button>
              )}
            </div>
            <p className="lx-caption">Aim for about 45–60 seconds, then tap Complete Interview.</p>
            <p className="lx-sr-only" aria-live="off">Internal recording duration: {elapsedSeconds} seconds. Suggested duration: {REQUESTED_DURATION_SECONDS} seconds.</p>
          </div>
        )}
      </div>
    </section>
  );
}
