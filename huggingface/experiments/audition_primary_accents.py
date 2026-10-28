"""Audition three accents from the selected synthetic female identity and male counterpart."""
import hashlib,json,os,shutil,time
from pathlib import Path
import numpy as np
import soundfile as sf
from gradio_client import Client,handle_file

root=Path("huggingface/voice-samples/voxcpm2-primary-accents")
root.mkdir(parents=True,exist_ok=True)
token=os.environ["HF_TOKEN"]
text=("Take your time. Tell me about something you enjoyed recently. "
      "What happened, and what made it memorable? You don't need perfect English. "
      "Start with the part you feel most comfortable sharing.")
refs={
 "female":Path("huggingface/voice-samples/voxcpm2-style-b-v3/female-01-question.mp3"),
 "male":Path("huggingface/voice-samples/voxcpm2-style-b-v3/male-01-question.mp3")
}
accents={
 "indian":"Natural, clear Indian English accent.",
 "american":"Natural General American English accent.",
 "british":"Natural contemporary standard British English accent."
}
records=[];blocked=False
def save():
 (root/"results.json").write_text(json.dumps({
  "model":"OpenBMB/VoxCPM2","host":"openbmb/VoxCPM-Demo","script":text,
  "selected_primary_female":"First question clip (10.92 seconds) from Style B v3, corresponding to the preferred approximately 1-10 seconds of the combined preview.",
  "male_goal":"Match the selected female's approachable clarity, warmth, relaxed confidence and curious phrasing, using a separate original synthetic male reference. Not a female-to-male identity transformation.",
  "reference_provenance":"Only our synthetic prior outputs; no real-person recording.",
  "accent_status":"Requested through instructions, not independently verified.",
  "limitations":"Same reference aims to anchor identity but cannot guarantee it across accents. No model fine-tuning, perceptual naturalness score or production integration.",
  "results":records},indent=2))
client=Client("openbmb/VoxCPM-Demo",token=token,verbose=False,analytics_enabled=False)
for gender in ["female","male"]:
 ref=refs[gender]
 for accent,accent_direction in accents.items():
  instruction=(accent_direction+" Preserve the reference speaker's vocal identity. "
    "Warm, relaxed, engaged one-to-one conversation. Clear connected articulation, grounded confidence, "
    "gentle curiosity in the questions, natural pauses and easy sentence endings. "
    "Supportive and understated, with an everyday conversational pace.")
  item={"gender":gender,"accent_requested":accent,"reference":str(ref),
    "reference_sha256":hashlib.sha256(ref.read_bytes()).hexdigest(),"instruction":instruction,"cfg":2.0}
  if blocked:
   item.update(status="not_attempted",reason="Stopped after quota or rate limit, without bypass.")
   records.append(item);save();continue
  start=time.monotonic()
  try:
   job=client.submit(api_name="/generate",text_input=text,control_instruction=instruction,
     reference_wav_path_input=handle_file(str(ref)),use_prompt_text=False,prompt_text_input="",
     cfg_value_input=2.0,do_normalize=False,denoise=False)
   try:result=job.result(timeout=180)
   except TimeoutError:job.cancel();raise
   source=result[0] if isinstance(result,(tuple,list)) else result
   if isinstance(source,dict):source=source.get("path")
   y,rate=sf.read(source)
   if not y.size or not np.isfinite(y).all() or np.max(np.abs(y))<.001:
    raise ValueError("Empty, non-finite or silent output")
   dest=root/("lanx-"+gender+"-"+accent+Path(source).suffix)
   shutil.copyfile(source,dest)
   item.update(status="generated",file=dest.name,seconds=round(len(y)/rate,3),
      sample_rate=rate,peak=float(np.max(np.abs(y))),
      sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),
      request_seconds=round(time.monotonic()-start,2))
   print("GENERATED "+gender+" "+accent,flush=True)
  except Exception as exc:
   reason=str(exc).replace(token,"[REDACTED]")[:800]
   item.update(status="unavailable",error_type=type(exc).__name__,reason=reason)
   print("UNAVAILABLE "+gender+" "+accent+" "+type(exc).__name__,flush=True)
   if "quota" in reason.lower() or "rate limit" in reason.lower():blocked=True
  records.append(item);save()
(root/"README.md").write_text("""# Primary voice accent auditions

## Owner selection
Provisional primary female identity: first 10.92-second question clip from Style B v3, approximately 1-10 seconds in the combined preview.
The owner reported voice drift in the later clips. Do not treat those later clips as approved identity references.

## Controlled comparison
Female: that exact first clip is the reference for all three requested accents.
Male: original synthetic male question clip is a separate reference; aim for the same clear, warm, relaxed and engaged qualities, not a gender conversion.
Same text, same CFG, same reference within each gender, accent instruction is varied.
Reference conditioning is controllable mode (no transcript continuation) so accent directions remain active.
Indian, American and British are requested accents, not verified labels.
The model may retain its reference accent or shift identity. Listener review must reject those failures.

No real-person voice reference, paid upgrade, new infrastructure or live website change.
Files are original demo outputs, without pitch/speed processing or watermark removal.
These auditions do not establish live reasoning, stable cross-turn identity or production latency.
""")
save()
print("Generated "+str(sum(r.get("status")=="generated" for r in records))+" of 6")
