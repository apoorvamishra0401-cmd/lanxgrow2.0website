"""Refine delivery using only our previously generated synthetic voices."""
import hashlib, json, os, shutil, time
from pathlib import Path
import numpy as np
import soundfile as sf
from gradio_client import Client, handle_file

root=Path("huggingface/voice-samples/voxcpm2-refined-v2")
root.mkdir(parents=True,exist_ok=True)
token=os.environ["HF_TOKEN"]
text=("Take your time. Tell me about something you enjoyed recently. "
      "What happened, and what made it memorable? You don't need perfect English. "
      "Start with the part you feel most comfortable sharing.")
styles={
 "a": "Warm, relaxed one-to-one conversation. Unhurried but flowing. Gentle curiosity in the questions, reassuring statements, clear articulation and natural sentence endings.",
 "b": "Engaged, thoughtful conversation with one learner. Grounded confidence, subtle warmth, varied emphasis following the meaning, small natural pauses and an easy everyday pace."
}
records=[]
blocked=False
client=Client("openbmb/VoxCPM-Demo",token=token,verbose=False,analytics_enabled=False)
def save():
    (root/"results.json").write_text(json.dumps({
      "model":"OpenBMB/VoxCPM2","host":"openbmb/VoxCPM-Demo","script":text,
      "reference_provenance":"Previous original synthetic VoxCPM2 male/female auditions; no real-person recording.",
      "reference_mode":"Controllable reference conditioning: use_prompt_text=False; style instructions active.",
      "changes":"Same script, original synthetic reference per gender, two delivery instructions; CFG held at 2.0.",
      "limitations":"No model training. Voice identity retention, accent, naturalness and wording require listening. Scripted TTS, not a working live interviewer. Request time is not streaming latency.",
      "results":records},indent=2))
for gender in ["male","female"]:
    reference=Path("huggingface/voice-samples/voxcpm2-interviewer/voxcpm2-"+gender+"-conversation.mp3")
    for variant,instruction in styles.items():
        name=gender+"-"+variant
        entry={"name":name,"gender":gender,"variant":variant,"reference":str(reference),
               "reference_sha256":hashlib.sha256(reference.read_bytes()).hexdigest(),
               "instruction":instruction,"cfg":2.0}
        if blocked:
            entry.update(status="not_attempted",reason="Stopped after quota/rate limit; no bypass.")
            records.append(entry); save(); continue
        started=time.monotonic()
        try:
            job=client.submit(api_name="/generate",text_input=text,control_instruction=instruction,
                reference_wav_path_input=handle_file(str(reference)),use_prompt_text=False,
                prompt_text_input="",cfg_value_input=2.0,do_normalize=False,denoise=False)
            try: result=job.result(timeout=180)
            except TimeoutError:
                job.cancel(); raise
            source=result[0] if isinstance(result,(tuple,list)) else result
            if isinstance(source,dict): source=source.get("path")
            wave,rate=sf.read(source)
            if not wave.size or not np.isfinite(wave).all() or np.max(np.abs(wave))<.001:
                raise ValueError("Empty, non-finite or silent output")
            dest=root/("voxcpm2-"+name+Path(source).suffix)
            shutil.copyfile(source,dest)
            entry.update(status="generated",file=dest.name,seconds=round(len(wave)/rate,3),
                sample_rate=rate,peak=float(np.max(np.abs(wave))),
                sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),
                request_seconds=round(time.monotonic()-started,2))
            print("GENERATED "+name,flush=True)
        except Exception as exc:
            reason=str(exc).replace(token,"[REDACTED]")[:800]
            entry.update(status="unavailable",error_type=type(exc).__name__,reason=reason)
            print("UNAVAILABLE "+name+" "+type(exc).__name__,flush=True)
            if "quota" in reason.lower() or "rate limit" in reason.lower(): blocked=True
        records.append(entry); save()
(root/"README.md").write_text("""# VoxCPM2 delivery refinement v2

A: relaxed, reassuring conversation. B: engaged, thoughtful conversation.
Both receive exactly the original script and a reference from the corresponding original synthetic VoxCPM2 audition.
Reference conditioning aims to retain the liked voice identity while adjusting expression; preservation is not guaranteed.
CFG stays at 2.0 to isolate the instruction change.
No real-person voice cloning, model training, pitch/speed effects, inserted laughs or watermark removal.
Original returned files are preserved.

Compare against the first audition at equal playback volume.
Review words against script, easy pacing, question intonation, sentence endings, warmth and lack of forced praise.
A successful audio decode is a technical pass only, not a naturalness rating.
Public demo timings include network, queue and download; production streaming remains untested.
No website, frontend, Hugging Face development Space or production integration changed.
""")
print("Generated "+str(sum(r.get("status")=="generated" for r in records))+" of 4")
