import os
os.environ['GRADIO_ANALYTICS_ENABLED'] = 'False'
import gc
import logging
import tempfile
import threading
from pathlib import Path
import gradio as gr
import numpy as np
import soundfile as sf
import spaces
import torch
from kokoro import KModel, KPipeline
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
from components import prepare_audio, audio_chunks, validate_text, TTS_SAMPLE_RATE, MAX_AUDIO_SECONDS

# Shared scheduling group also serializes API calls across both GPU tasks.
GPU_GROUP = 'speech-models'
MODEL_ID = 'openai/whisper-large-v3-turbo'
print('Startup: loading speech recognition model', flush=True)
processor = AutoProcessor.from_pretrained(MODEL_ID)
whisper = AutoModelForSpeechSeq2Seq.from_pretrained(
    MODEL_ID, dtype=torch.float16, use_safetensors=True
).to('cuda').eval()
# Keep Kokoro in float32: blindly applying fp16 to every model can cause issues.
print('Startup: loading Kokoro model', flush=True)
kokoro_model = KModel(repo_id='hexgrad/Kokoro-82M').to('cuda').eval()
print('Startup: preparing Kokoro voices', flush=True)
voices = {'American': ('a', 'af_heart'), 'British': ('b', 'bf_emma')}
pipelines = {name: KPipeline(lang_code=language, model=kokoro_model,
    repo_id='hexgrad/Kokoro-82M') for name, (language, _) in voices.items()}
# Resolve voice files before entering quota-limited GPU work.
for name, (_, voice) in voices.items():
    pipelines[name].load_voice(voice)

@spaces.GPU(duration=120)
def transcribe_gpu(samples):
    parts = []
    with torch.inference_mode():
        for offset, chunk in audio_chunks(samples):
            # Skip only digital silence. Do not gate whispered speech by loudness.
            if float(np.max(np.abs(chunk))) < 1e-8:
                continue
            batch = processor(chunk, sampling_rate=16000, return_tensors='pt', return_attention_mask=True)
            features = batch.input_features.to('cuda', dtype=torch.float16)
            mask = batch.attention_mask.to('cuda')
            ids = whisper.generate(features, attention_mask=mask,
                language='en', task='transcribe', max_new_tokens=440,
                num_beams=1, do_sample=False)
            text = processor.batch_decode(ids, skip_special_tokens=True)[0].strip()
            if text:
                parts.append({'start_seconds': offset,
                    'end_seconds': offset + len(chunk) / 16000, 'text': text})
            del features, mask, ids, batch
    return parts

@spaces.GPU(duration=120)
def synthesize_gpu(text, voice_name):
    if voice_name not in voices:
        raise ValueError('Please choose an available voice.')
    _, voice = voices[voice_name]
    handle, path = tempfile.mkstemp(suffix='.wav')
    os.close(handle)
    count = 0
    try:
        with sf.SoundFile(path, mode='w', samplerate=TTS_SAMPLE_RATE,
                channels=1, subtype='PCM_16') as output, torch.inference_mode():
            for _, _, audio in pipelines[voice_name](text, voice=voice, speed=1):
                if audio is None:
                    continue
                wave = audio.detach().cpu().numpy().reshape(-1)
                if not np.isfinite(wave).all():
                    raise RuntimeError('Invalid generated audio')
                if count + len(wave) > MAX_AUDIO_SECONDS * TTS_SAMPLE_RATE:
                    raise ValueError('This text produces more than 10 minutes of speech. Please split it into two requests.')
                output.write(wave)
                count += len(wave)
        if count == 0:
            raise RuntimeError('No generated audio')
        # A separate timer bounds output retention even if the browser never fetches it.
        timer = threading.Timer(900, lambda: Path(path).unlink(missing_ok=True))
        timer.daemon = True
        timer.start()
        return path, {'provider': 'kokoro-82m', 'voice': voice_name,
            'duration_seconds': round(count / TTS_SAMPLE_RATE, 2)}
    except BaseException:
        Path(path).unlink(missing_ok=True)
        raise

def transcribe(path):
    try:
        samples, duration = prepare_audio(path)
        parts = transcribe_gpu(samples)
        text = ' '.join(part['text'] for part in parts)
        return text, {'status': 'complete' if text else 'no_clear_speech',
            'audio_duration_seconds': round(duration, 2),
            'segments': parts, 'timing_precision': '30-second processing windows; not word timestamps',
            'model': MODEL_ID}
    except ValueError as exc:
        raise gr.Error(str(exc))
    except Exception as exc:
        logging.error('Transcription failed: %s', type(exc).__name__)
        raise gr.Error('Transcription could not finish. Your recording was not assessed. Please retry shortly; check the runtime logs if this continues.')
    finally:
        if path:
            Path(path).unlink(missing_ok=True)
        gc.collect()

def synthesize(text, voice):
    try:
        return synthesize_gpu(validate_text(text), voice)
    except ValueError as exc:
        raise gr.Error(str(exc))
    except Exception as exc:
        logging.error('Speech synthesis failed: %s', type(exc).__name__)
        raise gr.Error('Voice generation could not finish. Please retry with a shorter passage; check the runtime logs if this continues.')

def ready(path):
    ok = bool(path and Path(path).is_file())
    return ('Recording received.' if ok else 'Record or upload audio first.', gr.Button(interactive=ok))

with gr.Blocks(title='LanXgrow speech workspace', delete_cache=(60, 900)) as demo:
    gr.Markdown('# LanXgrow speech workspace\nTest speech recognition and voice output using non-sensitive sample material.')
    with gr.Tab('Speech to text'):
        gr.Markdown('English audio up to 10 minutes. Stop recording and wait for **Recording received**. Audio is sent to this Space. Transcripts can contain mistakes.')
        recording = gr.Audio(sources=['microphone', 'upload'], type='filepath', format='wav', label='English recording')
        status = gr.Markdown('Record or upload audio first.')
        convert = gr.Button('Convert to text', variant='primary', interactive=False)
        transcript = gr.Textbox(label='What was heard', lines=8, interactive=False)
        details = gr.JSON(label='Processing information')
        recording.change(ready, recording, [status, convert], queue=False, api_name=False)
        convert.click(transcribe, recording, [transcript, details], api_name='transcribe',
            concurrency_id=GPU_GROUP, concurrency_limit=1).then(
                lambda: (None, 'Record or upload another sample.', gr.Button(interactive=False)),
                outputs=[recording, status, convert], api_name=False)
    with gr.Tab('Text to speech'):
        text = gr.Textbox(label='English text', value='Welcome to LanXgrow. Let us practise English together.', lines=5)
        voice = gr.Radio(list(voices), value='American', label='Kokoro voice')
        speak = gr.Button('Generate voice', variant='primary')
        output = gr.Audio(label='Generated speech', format='wav')
        speech_info = gr.JSON(label='Output information')
        speak.click(synthesize, [text, voice], [output, speech_info], api_name='synthesize',
            concurrency_id=GPU_GROUP, concurrency_limit=1)
    gr.Markdown('Kokoro voices here are American and British English. Original recordings are deleted after each processing attempt. Generated audio is kept temporarily for playback, up to 15 minutes while the process runs. No learner accounts, reports or conversation model are connected here yet.')

print('Startup: speech endpoints ready', flush=True)
demo.queue(max_size=8, default_concurrency_limit=1)
if __name__ == '__main__':
    demo.launch(server_name='0.0.0.0', server_port=7860, show_error=False, max_file_size='60mb')
