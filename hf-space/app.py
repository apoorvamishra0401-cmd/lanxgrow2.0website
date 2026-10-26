import os
os.environ['GRADIO_ANALYTICS_ENABLED']='False'
import gradio as gr
from components import speak
async def sample_audio(text,accent):
    try:return await speak(text,accent)
    except ValueError as exc:raise gr.Error(str(exc))
    except Exception:raise gr.Error('Audio is unavailable right now. Please try again later.')
with gr.Blocks(delete_cache=(30,60),title='LanXgrow component check') as demo:
    gr.Markdown('# LanXgrow · component check\nSample text only. This development utility is separate from the learner website. No account or learning report is created.')
    text=gr.Textbox(value='Every small step helps you find your voice.',label='Sample text',max_lines=5)
    accent=gr.Radio(['Indian','American','British'],value='Indian',label='Listening voice')
    button=gr.Button('Check speech output')
    audio=gr.Audio(label='Speech output',type='filepath')
    button.click(sample_audio,[text,accent],audio,concurrency_limit=1,api_name=False)
    gr.Markdown('Speech output uses an online service. Uploaded voice, video, learner data and model analysis are not enabled.')
demo.queue(max_size=8,default_concurrency_limit=1)
if __name__=='__main__':demo.launch(server_name='0.0.0.0',server_port=7860,show_error=False)
