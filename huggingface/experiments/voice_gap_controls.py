"""Diagnostic controls: native locale catalogue and selected-voice transcript conditioning."""
import asyncio,hashlib,json,os,shutil,time
from pathlib import Path
import edge_tts,numpy as np,soundfile as sf
from gradio_client import Client,handle_file
root=Path("huggingface/voice-samples/voice-gap-controls")
root.mkdir(parents=True,exist_ok=True)
token=os.environ["HF_TOKEN"]
text=("After class, tell me what felt hard. Was it finding the right words, or starting the conversation? "
      "It's okay to pause. Let's work through one thought together.")
old_text=("Take your time. Tell me about something you enjoyed recently. What happened, and what made it memorable? "
          "You don't need perfect English. Start with the part you feel most comfortable sharing.")
records=[]
def save():
 (root/"results.json").write_text(json.dumps({
  "script":text,"purpose":"Separate native-accent catalogue control from chosen-speaker identity testing.",
  "not_production":"No frontend/backend deployment; no paid upgrade.",
  "limitations":"Catalogue locale is not a human rating of naturalness. Each locale uses a different stock speaker, not one voice changing accents. Continuity tests preserve chosen synthetic references but do not establish emotion or live reasoning.",
  "results":records},indent=2))
async def native_controls():
 try:voices=await asyncio.wait_for(edge_tts.list_voices(),timeout=40)
 except Exception as exc:
  records.append({"group":"native_locale","status":"unavailable","reason":str(exc).replace(token,"[REDACTED]")[:500]});save();return
 catalogue={v["ShortName"]:v for v in voices}
 chosen=[
  ("female","indian","en-IN",["en-IN-NeerjaNeural","en-IN-NeerjaExpressiveNeural"]),
  ("female","american","en-US",["en-US-AvaMultilingualNeural","en-US-JennyNeural"]),
  ("female","british","en-GB",["en-GB-SoniaNeural","en-GB-LibbyNeural"]),
  ("male","indian","en-IN",["en-IN-PrabhatNeural"]),
  ("male","american","en-US",["en-US-AndrewMultilingualNeural","en-US-GuyNeural"]),
  ("male","british","en-GB",["en-GB-RyanNeural","en-GB-ThomasNeural"])
 ]
 for gender,accent,locale,candidates in chosen:
  item={"group":"native_locale","gender":gender,"accent":accent,"locale":locale,
        "service":"Microsoft Edge online TTS via edge-tts; hosted proprietary voices, not open model weights."}
  try:
   voice=next(v for v in candidates if v in catalogue)
   meta=catalogue[voice]
   if meta["Locale"]!=locale or meta["Gender"].lower()!=gender:raise ValueError("Catalogue mismatch")
   item["voice"]=voice;item["catalogue_metadata"]=meta
   dest=root/("native-"+gender+"-"+accent+".mp3")
   started=time.monotonic()
   await asyncio.wait_for(edge_tts.Communicate(text,voice,rate="+0%",pitch="+0Hz",volume="+0%").save(str(dest)),timeout=45)
   y,sr=sf.read(dest)
   if not y.size or not np.isfinite(y).all() or np.max(np.abs(y))<.001:raise ValueError("Invalid output")
   item.update(status="generated",file=dest.name,seconds=round(len(y)/sr,3),
    sample_rate=sr,sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),
    request_seconds=round(time.monotonic()-started,2))
   print("GENERATED native "+gender+" "+accent,flush=True)
  except Exception as exc:
   item.update(status="unavailable",error_type=type(exc).__name__,reason=str(exc).replace(token,"[REDACTED]")[:600])
   print("UNAVAILABLE native "+gender+" "+accent+" "+type(exc).__name__,flush=True)
  records.append(item);save()
asyncio.run(native_controls())

client=None
for gender,accent in [("female","indian"),("male","british")]:
 item={"group":"identity_continuity","gender":gender,"reference_accent_label":accent,
       "model":"OpenBMB/VoxCPM2","mode":"Reference plus exact transcript; no accent transformation or style instruction."}
 try:
  if client is None:client=Client("openbmb/VoxCPM-Demo",token=token,verbose=False,analytics_enabled=False)
  reference=Path("huggingface/voice-samples/voxcpm2-primary-accents/lanx-"+gender+"-"+accent+".mp3")
  item["reference"]=str(reference)
  started=time.monotonic()
  job=client.submit(api_name="/generate",text_input=text,control_instruction="",
   reference_wav_path_input=handle_file(str(reference)),use_prompt_text=True,
   prompt_text_input=old_text,cfg_value_input=2.0,do_normalize=False,denoise=False)
  try:result=job.result(timeout=180)
  except TimeoutError:job.cancel();raise
  source=result[0] if isinstance(result,(tuple,list)) else result
  if isinstance(source,dict):source=source.get("path")
  y,sr=sf.read(source)
  if not y.size or not np.isfinite(y).all() or np.max(np.abs(y))<.001:raise ValueError("Invalid output")
  dest=root/("continuity-"+gender+Path(source).suffix);shutil.copyfile(source,dest)
  item.update(status="generated",file=dest.name,seconds=round(len(y)/sr,3),sample_rate=sr,
    sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),request_seconds=round(time.monotonic()-started,2))
  print("GENERATED continuity "+gender,flush=True)
 except Exception as exc:
  item.update(status="unavailable",error_type=type(exc).__name__,reason=str(exc).replace(token,"[REDACTED]")[:600])
  print("UNAVAILABLE continuity "+gender+" "+type(exc).__name__,flush=True)
 records.append(item);save()
(root/"README.md").write_text("""# Voice gap diagnostic controls

Native-locale group: Microsoft Edge catalogue voices for en-IN/en-US/en-GB, two genders.
Not our selected VoxCPM identity, not an open-weight TTS replacement, not a promise of free commercial production capacity.
Purpose: make regional differences testable without trying to override the same reference accent through text.
Catalogue checked against live ShortName, Locale and Gender before generation. No style SSML unsupported by edge-tts.
Rate, volume and pitch unchanged.

Selected-identity group: owner-preferred female Indian-labelled sample and male British-labelled sample, exact reference transcript supplied.
Ultimate/reference-continuation mode rather than controllable mode. It intentionally omits style control.
Purpose: test identity preservation separately from accent change and expression.
This mode does not guarantee the spoken output, stable identity or absence of reverb.

No source echo/reverb effect added by our pipeline. No claim that mono audio proves no reverb.
No live speech recognition/conversation model connected in these auditions.
""")
save()
