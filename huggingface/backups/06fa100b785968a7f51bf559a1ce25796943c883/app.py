import os
os.environ['GRADIO_ANALYTICS_ENABLED'] = 'False'
import logging
from pathlib import Path
import gradio as gr
import spaces
import torch
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
from components import prepare_audio, create_speech

MODEL_ID = 'openai/whisper-large-v3-turbo'
processor = AutoProcessor.from_pretrained(MODEL_ID)
# ZeroGPU requires CUDA placement outside the decorated inference function.
model = AutoModelForSpeechSeq2Seq.from_pretrained(
    MODEL_ID, dtype=torch.float16, use_safetensors=True
).to('cuda').eval()

@spaces.GPU(duration=45)
def recognise(samples):
    inputs = processor(samples, sampling_rate=16000, return_tensors='pt', return_attention_mask=True)
    features = inputs.input_features.to(device='cuda', dtype=torch.float16)
    mask = inputs.attention_mask.to('cuda')
    with torch.inference_mode():
        ids = model.generate(
            features, attention_mask=mask, language='en', task='transcribe',
            max_new_tokens=256, num_beams=3, do_sample=False,
        )
    return processor.batch_decode(ids, skip_special_tokens=True)[0].strip()

def ready(path):
    exists = bool(path and Path(path).is_file())
    return ('Recording received. You can convert it now.' if exists else 'Record or upload audio first.', gr.Button(interactive=exists))

def transcribe(path):
    if not path or not Path(path).is_file():
        raise gr.Error('The recording has not arrived yet. Wait for “Recording received” before converting.')
    try:
        samples = prepare_audio(path)
        result = recognise(samples)
        return result or 'No clear speech was recognised. Please try again.'
    except ValueError as error:
        raise gr.Error(str(error))
    except Exception as error:
        # Log the exception class only, never paths, recordings or transcripts.
        logging.error('Speech processing failed: %s', type(error).__name__)
        raise gr.Error('Speech processing could not complete. Please retry shortly; if it continues, check the Space runtime logs.')
    finally:
        # Source media is not needed after this analysis attempt.
        Path(path).unlink(missing_ok=True)

async def speak(text, accent):
    try:
        return await create_speech(text, accent)
    except ValueError as error:
        raise gr.Error(str(error))
    except Exception:
        raise gr.Error('Speech output is unavailable right now. Please try again shortly.')

with gr.Blocks(title='LanXgrow Speech', delete_cache=(60, 300)) as demo:
    gr.Markdown('# LanXgrow Speech\nSeparate development speech test. Use non-sensitive sample recordings.')
    with gr.Tab('Speech to text'):
        gr.Markdown('Speak normally in English, stop recording, then wait for **Recording received**. Maximum: **20 seconds**. Your audio is sent to this Space. The transcript can contain mistakes; it is not a pronunciation score.')
        recording = gr.Audio(sources=['microphone', 'upload'], type='filepath', format='wav', label='English recording')
        status = gr.Markdown('Record or upload audio first.')
        convert = gr.Button('Convert to text', variant='primary', interactive=False)
        transcript = gr.Textbox(label='What was heard', lines=6, interactive=False)
        recording.change(ready, inputs=recording, outputs=[status, convert], queue=False, api_name=False)
        convert.click(transcribe, inputs=recording, outputs=transcript, concurrency_limit=1, api_name=False).then(
            lambda: (None, 'Record or upload another sample.', gr.Button(interactive=False)),
            outputs=[recording, status, convert], api_name=False,
        )
    with gr.Tab('Text to speech'):
        text = gr.Textbox(label='Sample text', value='Every small step helps you find your voice.', lines=3)
        accent = gr.Radio(list(['Indian', 'American', 'British']), value='Indian', label='Listening voice')
        button = gr.Button('Listen', variant='primary')
        output = gr.Audio(label='Speech output', format='mp3')
        button.click(speak, [text, accent], output, concurrency_limit=1, api_name=False)
    gr.Markdown('ZeroGPU queues and daily quotas apply. This tool does not yet provide meaning interpretation or learner assessment. Source recordings are deleted after each processing attempt; unused temporary uploads are periodically cleaned while the app runs.')
demo.queue(max_size=8, default_concurrency_limit=1)
if __name__ == '__main__':
    demo.launch(server_name='0.0.0.0', server_port=7860, show_error=False)
