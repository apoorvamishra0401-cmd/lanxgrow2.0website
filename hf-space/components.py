import os,tempfile
from pathlib import Path
VOICES={'Indian':'en-IN-NeerjaNeural','American':'en-US-JennyNeural','British':'en-GB-SoniaNeural'}
def validate(text,accent):
    if not isinstance(text,str) or not 1<=len(text.strip())<=500:raise ValueError('Please enter between 1 and 500 characters.')
    if accent not in VOICES:raise ValueError('Please choose an available accent.')
    return text.strip(),VOICES[accent]
async def speak(text,accent):
    text,voice=validate(text,accent)
    import edge_tts
    import asyncio
    fd,path=tempfile.mkstemp(suffix='.mp3');os.close(fd)
    try:
        await asyncio.wait_for(edge_tts.Communicate(text,voice).save(path),timeout=25)
        if not Path(path).stat().st_size:raise RuntimeError('No audio')
        return path
    except BaseException:
        Path(path).unlink(missing_ok=True)
        raise
_model=None
def transcribe_local(path):
    # Internal adapter only, deliberately no unauthenticated upload endpoint.
    if os.getenv('ENABLE_LOCAL_STT')!='true':raise RuntimeError('Local transcription is not enabled.')
    global _model
    from faster_whisper import WhisperModel
    if _model is None:_model=WhisperModel('base.en',device='cpu',compute_type='int8',num_workers=1,cpu_threads=2)
    segments,_=_model.transcribe(path,language='en',vad_filter=True)
    return [{'start':s.start,'end':s.end,'text':s.text} for s in segments]
