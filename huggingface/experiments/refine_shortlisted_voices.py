"""Isolated synthetic auditions. No website/backend deployment or paid resources."""
import json, os, shutil, time, hashlib
from pathlib import Path
import numpy as np
import soundfile as sf
from gradio_client import Client, handle_file

root = Path("huggingface/voice-samples/shortlist-refinement")
root.mkdir(parents=True, exist_ok=True)
token = os.environ["HF_TOKEN"]
report = ("Your meaning came through. Let's make the past tense clearer. "
          "Instead of 'Yesterday I go to the market,' say, 'Yesterday I went to the market.' "
          "Try it once more at your own pace. Focus on that one change, then build from there.")
conversation = ("Take your time. Tell me about something you enjoyed recently. "
                "What happened, and what made it memorable? You don't need perfect English. "
                "Start with the part you feel most comfortable sharing.")
reference = Path("huggingface/voice-samples/v2/01-american-male.wav")
refs = json.loads(Path("huggingface/voice-samples/v2/results.json").read_text())
reftext = " ".join(refs["paragraphs"])
records = []
blocked = False
clients = {}
tests = [
    ("01-vibevoice-carter-report-a", "anycoderapps/VibeVoice-Realtime-0.5B", "/generate",
     "microsoft/VibeVoice-Realtime-0.5B", dict(text=report,speaker_name="en-Carter_man",cfg_scale=1.3)),
    ("02-vibevoice-carter-report-b", "anycoderapps/VibeVoice-Realtime-0.5B", "/generate",
     "microsoft/VibeVoice-Realtime-0.5B", dict(text=report,speaker_name="en-Carter_man",cfg_scale=1.7)),
    ("03-chatterbox-male-report-a", "ResembleAI/chatterbox-turbo-demo", "/generate",
     "ResembleAI/chatterbox-turbo", dict(text=report,audio_prompt_path=handle_file(str(reference)),
      temperature=0.65,seed_num=42,min_p=0.0,top_p=0.95,top_k=1000,repetition_penalty=1.2,norm_loudness=True)),
    ("04-chatterbox-male-report-b", "ResembleAI/chatterbox-turbo-demo", "/generate",
     "ResembleAI/chatterbox-turbo", dict(text=report,audio_prompt_path=handle_file(str(reference)),
      temperature=0.9,seed_num=42,min_p=0.0,top_p=0.95,top_k=1000,repetition_penalty=1.2,norm_loudness=True)),
]
for gender in ["male","female"]:
    instruction = ("An adult "+gender+" English communication coach with a natural American accent. "
                   "Warm, grounded, clear and conversational. Speak to one learner at an easy pace. "
                   "Let emphasis follow meaning, with gentle curiosity in the question and calm reassurance. "
                   "No announcer delivery, exaggerated emotion, whispering or forced laughter.")
    tests.append(("05-voxcpm2-"+gender+"-conversation","openbmb/VoxCPM-Demo","/generate",
                  "OpenBMB/VoxCPM2",dict(text_input=conversation,control_instruction=instruction,
                  reference_wav_path_input=None,use_prompt_text=False,prompt_text_input="",
                  cfg_value_input=2.0,do_normalize=False,denoise=False)))
for gender in ["male","female"]:
    ref = Path("huggingface/voice-samples/v2/0"+("1-american-male.wav" if gender=="male" else "2-american-female.wav"))
    tests.append(("06-miso-"+gender+"-conversation","multimodalart/MisoTTS","/synthesize",
                  "MisoLabs/MisoTTS",dict(text=conversation,ref_audio_path=handle_file(str(ref)),
                  ref_text=reftext,speaker_id=0,max_length_s=35,temperature=0.6,topk=50)))

for name,space,endpoint,model,kwargs in tests:
    entry = dict(name=name,model=model,host=space,endpoint=endpoint,
                 parameters={k:v for k,v in kwargs.items() if k not in ["audio_prompt_path","ref_audio_path"]})
    start=time.monotonic()
    try:
        if blocked:
            entry.update(status="not_attempted",reason="Stopped after quota/rate-limit response. No quota bypass.")
            records.append(entry)
            continue
        if space not in clients:
            clients[space]=Client(space,token=token,verbose=False,analytics_enabled=False)
        job=clients[space].submit(api_name=endpoint,**kwargs)
        try:
            result=job.result(timeout=180)
        except TimeoutError:
            job.cancel()
            raise
        source=result[0] if isinstance(result,(tuple,list)) else result
        if isinstance(source,dict): source=source.get("path")
        wave,rate=sf.read(source)
        if wave.size==0 or not np.isfinite(wave).all() or np.max(np.abs(wave))<0.001:
            raise ValueError("Empty, non-finite or silent output")
        # Keep original file format, including watermark/provenance.
        suffix=Path(source).suffix.lower()
        if suffix not in [".wav",".mp3",".flac",".ogg"]: suffix=".audio"
        destination=root/(name+suffix)
        shutil.copyfile(source,destination)
        entry.update(status="generated",file=destination.name,sample_rate=rate,
                     seconds=round(len(wave)/rate,3),peak=float(np.max(np.abs(wave))),
                     sha256=hashlib.sha256(destination.read_bytes()).hexdigest(),
                     request_seconds=round(time.monotonic()-start,2))
        print("GENERATED "+name,flush=True)
    except Exception as exc:
        reason=str(exc).replace(token,"[REDACTED]")[:900]
        entry.update(status="unavailable",error_type=type(exc).__name__,reason=reason)
        print("UNAVAILABLE "+name+" "+type(exc).__name__,flush=True)
        if "quota" in reason.lower() or "rate limit" in reason.lower(): blocked=True
    records.append(entry)
    (root/"results.json").write_text(json.dumps(dict(
        report_script=report,conversation_script=conversation,results=records,
        reference_provenance="Our synthetic Kokoro Michael/Bella samples, not real-person recordings.",
        limitations="Scripted auditions only; no live conversation, first-audio latency measurement or human quality score. Parameter changes are candidates, not proven improvements."
    ),indent=2))

(root/"results.json").write_text(json.dumps(dict(
    report_script=report,conversation_script=conversation,results=records,
    reference_provenance="Our synthetic Kokoro Michael/Bella samples, not real-person recordings.",
    limitations="Scripted auditions; no live conversation, first-audio latency or human quality score. Variants are not proven improvements."
),indent=2))

(root/"README.md").write_text("""# LanXgrow shortlisted male report voices and interviewer auditions

Owner shortlist: VibeVoice Realtime Carter male and Chatterbox Turbo male.
Qwen and other previously rated voices remain unused. Existing files are preserved.

## Report variants
Both models receive exactly the same illustrative feedback, not a real learner report.
Carter A/B: CFG 1.3 / 1.7. Chatterbox A/B: temperature 0.65 / 0.9, same seed and synthetic Michael reference.
These are delivery candidates. No claim of a model fine-tune or proven quality improvement.
No audio speed manipulation, inserted laughter, or watermark removal.

## Interviewer candidates
VoxCPM official demo currently serves VoxCPM2, not the old 0.5B model.
Male/female are original voice-design requests; American accent needs listener review.
Miso uses the prior synthetic male/female references; commercial licence review remains pending.
No demo is connected to customer traffic. No paid resources enabled.

## Review each sample
Rate clarity, natural phrasing, warm authority, supportive correction and grounded encouragement.
Reject forced excitement, condescension, awkward pauses and swallowed words.
Check the exact spoken wording against results.json; finite audio alone is not a quality pass.
Compare A/B blind where possible, using the same playback volume.
Full request time includes public queue and download; it is not streaming latency.
Report narration approval does not approve a voice for live interviewing.
""")
print("Generated "+str(sum(r.get("status")=="generated" for r in records))+" samples")
