"""Audio preparation only: never rewrite a learner's grammar."""
import asyncio
from math import gcd
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

VOICES = {'Indian': 'en-IN-NeerjaNeural', 'American': 'en-US-JennyNeural', 'British': 'en-GB-SoniaNeural'}

def prepare_audio(path, max_seconds=20):
    info = sf.info(path)
    if info.samplerate <= 0 or info.frames <= 0:
        raise ValueError('The recording is empty. Please record again.')
    duration = info.frames / info.samplerate
    if duration > max_seconds + 0.25:
        raise ValueError(f'Please use a recording of {max_seconds} seconds or less. This one is {duration:.1f} seconds.')
    audio, rate = sf.read(path, dtype='float32', always_2d=True)
    if not np.isfinite(audio).all():
        raise ValueError('The audio could not be read. Please make a fresh recording.')
    # Choose the strongest channel: averaging can cancel phase-inverted microphones.
    channel = int(np.argmax(np.mean(audio.astype(np.float64) ** 2, axis=0)))
    audio = audio[:, channel].copy()
    audio -= np.mean(audio)
    peak = float(np.max(np.abs(audio)))
    if peak < 1e-8:
        raise ValueError('No audio signal was captured. Please check microphone access.')
    rms = float(np.sqrt(np.mean(audio.astype(np.float64) ** 2)))
    # Bounded gain for quiet speech. No aggressive noise gate or denoiser that
    # could remove whispers. Gain cannot recover speech absent from the capture.
    gain = min(20.0, 0.1 / max(rms, 1e-8), 0.95 / peak)
    audio = (audio * gain).astype(np.float32)
    if rate != 16000:
        divisor = gcd(int(rate), 16000)
        audio = resample_poly(audio, 16000 // divisor, int(rate) // divisor).astype(np.float32)
    return audio

async def create_speech(text, accent):
    import edge_tts
    text = (text or '').strip()
    if not 1 <= len(text) <= 500:
        raise ValueError('Please enter between 1 and 500 characters.')
    if accent not in VOICES:
        raise ValueError('Please choose an available voice.')
    async def generate():
        audio = bytearray()
        async for chunk in edge_tts.Communicate(text, VOICES[accent]).stream():
            if chunk['type'] == 'audio':
                audio.extend(chunk['data'])
        if not audio:
            raise RuntimeError('No speech output received.')
        return bytes(audio)
    return await asyncio.wait_for(generate(), timeout=30)
