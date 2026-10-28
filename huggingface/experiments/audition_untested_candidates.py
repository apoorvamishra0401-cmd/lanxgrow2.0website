"""Audition only untested candidates permitted by voice_candidate_policy.json."""
import hashlib,json,os,shutil,subprocess,time
from pathlib import Path
import numpy as np,soundfile as sf
from gradio_client import Client,handle_file
root=Path("huggingface/voice-samples/untested-model-auditions")
root.mkdir(parents=True,exist_ok=True)
policy=json.loads(Path("huggingface/voice_candidate_policy.json").read_text())
token=os.environ["HF_TOKEN"]
text=("Take your time. What part felt difficult? You don't need to get every word right. "
      "Tell me one thing you wanted to say, and we'll work through it together.")
references={
 "male":policy["candidates"]["vibevoice_realtime_carter"]["reference"],
 "female":policy["benchmark_only"]["female_reference"]
}
reference_texts={
 "male":"Welcome to LanXgrow. Take your time, and tell me about your day. If a sentence feels difficult, we'll work through it together. For a past event, try saying, 'Yesterday, I went to the market.' Now, have another go in your own words.",
 "female":"Take your time. Tell me about something you enjoyed recently. What happened, and what made it memorable? You don't need perfect English. Start with the part you feel most comfortable sharing."
}
records=[];blocked=False
def save():
 (root/"results.json").write_text(json.dumps({
  "script":text,"selection_policy":"huggingface/voice_candidate_policy.json",
  "reference_provenance":"Synthetic historical liked references only. No real-person cloning.",
  "limitations":"First audition of these engines, not a measured improvement or accent qualification. No production integration or guaranteed free capacity.",
  "results":records},indent=2))
for key in ["cosyvoice3","miso"]:
 candidate=policy["candidates"][key]
 assert candidate["status"]=="audition_next"
 client=None
 for gender in ["male","female"]:
  item={"candidate":key,"model":candidate["model"],"host":candidate["host"],"gender":gender,"reference":references[gender]}
  if blocked:
   item.update(status="not_attempted",reason="Stopped after free quota/rate limit. No bypass or upgrade.")
   records.append(item);save();continue
  try:
   if client is None:client=Client(candidate["host"],token=token,verbose=False,analytics_enabled=False)
   ref=Path(references[gender]);item["reference_sha256"]=hashlib.sha256(ref.read_bytes()).hexdigest()
   # Lossless WAV transport for reference; no pitch, speed, echo or loudness effects.
   wav=Path("/tmp/lanx-audition-"+gender+".wav")
   subprocess.run(["ffmpeg","-v","error","-y","-i",str(ref),"-ac","1","-ar","24000",str(wav)],check=True)
   if key=="cosyvoice3":
    endpoint="/generate_audio"
    kwargs=dict(tts_text=text,mode_value="instruct",prompt_text="",prompt_wav_upload=handle_file(str(wav)),
      prompt_wav_record=None,instruct_text="You are a helpful assistant. Speak warmly and naturally in a relaxed one-to-one conversation.<|endofprompt|>",
      seed=42,stream=False,ui_lang="En")
   else:
    endpoint="/synthesize"
    kwargs=dict(text=text,ref_audio_path=handle_file(str(wav)),ref_text=reference_texts[gender],
      speaker_id=0,max_length_s=30,temperature=0.6,topk=50)
   item["endpoint"]=endpoint
   started=time.monotonic();job=client.submit(api_name=endpoint,**kwargs)
   try:result=job.result(timeout=180)
   except TimeoutError:job.cancel();raise
   source=result[0] if isinstance(result,(tuple,list)) else result
   if isinstance(source,dict):source=source.get("path")
   y,sr=sf.read(source)
   if not y.size or not np.isfinite(y).all() or np.max(np.abs(y))<.001:raise ValueError("Silent/default/invalid output")
   dest=root/(key+"-"+gender+Path(source).suffix);shutil.copyfile(source,dest)
   item.update(status="generated",file=dest.name,seconds=round(len(y)/sr,3),sample_rate=sr,
     sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),request_seconds=round(time.monotonic()-started,2))
   print("GENERATED",key,gender,flush=True)
  except Exception as exc:
   reason=str(exc).replace(token,"[REDACTED]")[:800]
   item.update(status="unavailable",error_type=type(exc).__name__,reason=reason)
   print("UNAVAILABLE",key,gender,type(exc).__name__,flush=True)
   if "quota" in reason.lower() or "rate limit" in reason.lower():blocked=True
  records.append(item);save()
(root/"README.md").write_text("""# Untested model auditions

Only CosyVoice3 and Miso are requested. No new Kokoro, VoxCPM2, Edge or Qwen generations.
Male reference: previously liked synthetic VibeVoice Carter clip.
Female reference: the explicitly liked first female question clip, retained as a benchmark rather than active engine.
References are converted to 24 kHz mono WAV without pitch, speed, denoising, reverb or loudness effects.
CosyVoice3 uses a short natural delivery instruction and fixed seed; Miso uses reference audio plus exact transcript.
No attempt to force three accents from one reference. Accent-specific speaker selection is a later gate.
Quota errors stop all remaining ZeroGPU requests. No paid upgrade, account switching or public-demo production routing.
A generated file is not a listening-quality pass or a confirmed commercial deployment licence.
""")
save()
