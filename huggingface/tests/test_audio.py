import sys
import tempfile
import unittest
from pathlib import Path
import numpy as np
import soundfile as sf
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'space'))
from components import prepare_audio, audio_chunks, validate_text

class AudioTests(unittest.TestCase):
    def write(self, root, audio, rate=16000):
        path = Path(root) / 'test.wav'
        sf.write(path, audio, rate, subtype='FLOAT')
        return path

    def test_quiet_and_opposite_phase_stereo(self):
        with tempfile.TemporaryDirectory() as root:
            x = 0.0001 * np.sin(2 * np.pi * 220 * np.arange(16000) / 16000)
            y, duration = prepare_audio(self.write(root, np.stack([x, -x], axis=1)))
            self.assertGreater(float(np.max(np.abs(y))), 0.001)
            self.assertLessEqual(float(np.max(np.abs(y))), 0.951)
            self.assertEqual(duration, 1)

    def test_ten_minutes_and_chunk_coverage(self):
        with tempfile.TemporaryDirectory() as root:
            x = np.tile(np.array([0.01, -0.01], dtype=np.float32), 600 * 8000)
            y, duration = prepare_audio(self.write(root, x))
            chunks = list(audio_chunks(y))
            self.assertEqual(duration, 600)
            self.assertEqual(len(chunks), 20)
            self.assertEqual(sum(len(chunk) for _, chunk in chunks), len(y))
            self.assertEqual(chunks[-1][0], 570)

    def test_reject_over_limit_and_silence(self):
        with tempfile.TemporaryDirectory() as root:
            with self.assertRaises(ValueError):
                prepare_audio(self.write(root, np.zeros(16000)))
            with self.assertRaises(ValueError):
                prepare_audio(self.write(root, np.zeros(601 * 16000)))

    def test_resampling_duration(self):
        with tempfile.TemporaryDirectory() as root:
            x = 0.01 * np.sin(2*np.pi*220*np.arange(48000)/48000)
            y, duration = prepare_audio(self.write(root, x, 48000))
            self.assertEqual(len(y), 16000)
            self.assertEqual(duration, 1)

    def test_text_bound(self):
        self.assertEqual(validate_text(' Hello '), 'Hello')
        for text in ['', None, 'a' * 24001]:
            with self.assertRaises(ValueError):
                validate_text(text)

if __name__ == '__main__':
    unittest.main()
