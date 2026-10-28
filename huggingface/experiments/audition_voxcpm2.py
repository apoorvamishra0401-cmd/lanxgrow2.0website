"""Isolated synthetic auditions. No website/backend deployment or paid resources."""
import json, os, shutil, time, hashlib
from pathlib import Path
import numpy as np
import soundfile as sf
from gradio_client import Client, handle_file

root = Path("huggingface/voice-samples/voxcpm2-interviewer")
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
tests = []
for gender in ["male","female"]:
    instruction = ("An adult "+gender+" English communication coach with a natural American accent. "
                   "Warm, grounded, clear and conversational. Speak to one learner at an easy pace. "
                   "Let emphasis follow meaning, with gentle curiosity in the question and calm reassurance. "
                   "No announcer delivery, exaggerated emotion, whispering or forced laughter.")
    tests.append(("voxcpm2-"+gender+"-conversation","openbmb/VoxCPM-Demo","/generate",
                  "OpenBMB/VoxCPM2",dict(text_input=conversation,control_instruction=instruction,
                  reference_wav_path_input=None,use_prompt_text=False,prompt_text_input="",
                  cfg_value_input=2.0,do_normalize=False,denoise=False)))

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

(root/"README.md").write_text("""# VoxCPM2 interviewer voice auditions
Official OpenBMB demo, API served by its separate hosted backend, not the exhausted ZeroGPU pool.
Original male/female voice-design requests, American accent requested but not human-verified.
Synthetic scripts only. No live conversation, perceptual quality rating or time-to-first-audio benchmark.
No reference-person cloning. No paid resources enabled. Original generated files preserved.
The two first-choice report voices are still blocked by ZeroGPU quota; they are not replaced by this experiment.
""")
print("Generated "+str(sum(r.get("status")=="generated" for r in records))+" samples")
