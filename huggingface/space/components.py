"""Bounded audio utilities. No learner scores or grammar correction here."""
from pathlib import Path
import math
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

MAX_AUDIO_SECONDS = 600
MAX_UPLOAD_BYTES = 60 * 1024 * 1024
TTS_SAMPLE_RATE = 24000
MAX_TEXT_CHARACTERS = 24000

def prepare_audio(path):
    if not path or not Path(path).is_file():
        raise ValueError('Please wait for your recording to finish uploading, then try again.')
    if Path(path).stat().st_size > MAX_UPLOAD_BYTES:
        raise ValueError('Please upload an audio file smaller than 60 MB.')
    info = sf.info(path)
    if info.samplerate < 8000 or info.samplerate > 192000 or info.channels > 8:
        raise ValueError('Please use a standard microphone recording or WAV file.')
    duration = info.frames / info.samplerate
    if not 0 < duration <= MAX_AUDIO_SECONDS + 0.05:
        raise ValueError('Please use an audio recording of up to 10 minutes.')
    audio, rate = sf.read(path, dtype='float32', always_2d=True)
    if not np.isfinite(audio).all():
        raise ValueError('The audio contains invalid samples. Please record again.')
    energies = np.mean(audio.astype(np.float64) ** 2, axis=0)
    audio = audio[:, int(np.argmax(energies))].copy()
    audio -= np.mean(audio)
    peak = float(np.max(np.abs(audio)))
    if peak < 1e-8:
        raise ValueError('No audio signal was captured. Please check your microphone.')
    rms = float(np.sqrt(np.mean(audio.astype(np.float64) ** 2)))
    audio *= min(20.0, 0.1 / max(rms, 1e-8), 0.95 / peak)
    if rate != 16000:
        divisor = math.gcd(int(rate), 16000)
        audio = resample_poly(audio, 16000 // divisor, int(rate) // divisor).astype(np.float32)
    return audio, duration

def audio_chunks(samples):
    # Each inference input is at most Whisper's 30-second window.
    width = 30 * 16000
    for offset in range(0, len(samples), width):
        yield offset / 16000, samples[offset:offset + width]

def validate_text(text):
    if not isinstance(text, str) or not text.strip():
        raise ValueError('Please enter some English text.')
    if len(text) > MAX_TEXT_CHARACTERS:
        raise ValueError('Please split this text into smaller requests (up to 24,000 characters).')
    return text.strip()
