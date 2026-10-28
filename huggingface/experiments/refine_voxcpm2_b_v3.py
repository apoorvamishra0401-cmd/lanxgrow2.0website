"""Style B multi-turn voice auditions; synthetic scripts, no live AI integration."""
import hashlib,json,os,shutil,time
from pathlib import Path
import numpy as np
import soundfile as sf
from gradio_client import Client,handle_file

root=Path("huggingface/voice-samples/voxcpm2-style-b-v3")
root.mkdir(parents=True,exist_ok=True)
token=os.environ["HF_TOKEN"]
turns=[
 ("01-question","Take your time. Tell me about something you enjoyed recently. What happened, and what made it memorable? You don't need perfect English. Start with the part you feel most comfortable sharing.",
  "Ask with genuine, gentle curiosity. Reassure simply, then leave space for the learner."),
 ("02-clarification","When you say it was difficult, do you mean finding the right words, or saying them out loud? We can start with whichever feels harder.",
  "Thoughtful, attentive clarification. Light emphasis on the two alternatives; a natural question intonation."),
 ("03-feedback","For a past event, say, 'Yesterday I went to the market.' Use 'went' instead of 'go.' You don't need to change the whole sentence. Try it again, then tell me what happened next.",
  "Explain clearly and matter-of-factly. Make the contrast between went and go easy to hear. Encourage the next attempt with quiet confidence.")
]
core=("Speak naturally to one learner, with engaged, grounded confidence and understated warmth. "
      "Use clear, connected words, meaning-led emphasis, varied sentence melody and brief natural pauses. "
      "Keep an everyday pace and the reference speaker's identity. ")
records=[];montages=[];blocked=False
def save():
 (root/"results.json").write_text(json.dumps({
  "model":"OpenBMB/VoxCPM2","host":"openbmb/VoxCPM-Demo",
  "reference_provenance":"Our synthetic Style B male/female v2 outputs; no real person or commercial-service voice reference.",
  "design_goal":"Clear, natural, engaged, supportive, context-appropriate delivery; not a measured ElevenLabs or ChatGPT equivalence.",
  "turns":[{"name":n,"text":t,"direction":s} for n,t,s in turns],
  "core_direction":core,"cfg":2.0,"results":records,"montages":montages,
  "limitations":"Scripted voice-only audition, not live listening or reasoning. No model fine-tuning, identity-similarity metric, blind listening score or streaming benchmark. Review accent, words, naturalness and identity by listening.",
 },indent=2))
client=Client("openbmb/VoxCPM-Demo",token=token,verbose=False,analytics_enabled=False)
for gender in ["male","female"]:
 ref=Path("huggingface/voice-samples/voxcpm2-refined-v2/voxcpm2-"+gender+"-b.mp3")
 for name,text,direction in turns:
  item={"gender":gender,"turn":name,"text":text,"direction":core+direction,
        "reference":str(ref),"reference_sha256":hashlib.sha256(ref.read_bytes()).hexdigest()}
  if blocked:
   item.update(status="not_attempted",reason="Stopped after rate/quota limit, without bypass.")
   records.append(item);save();continue
  started=time.monotonic()
  try:
   job=client.submit(api_name="/generate",text_input=text,control_instruction=core+direction,
     reference_wav_path_input=handle_file(str(ref)),use_prompt_text=False,prompt_text_input="",
     cfg_value_input=2.0,do_normalize=False,denoise=False)
   try: result=job.result(timeout=180)
   except TimeoutError: job.cancel();raise
   source=result[0] if isinstance(result,(tuple,list)) else result
   if isinstance(source,dict):source=source.get("path")
   wave,rate=sf.read(source)
   if not wave.size or not np.isfinite(wave).all() or np.max(np.abs(wave))<.001:
    raise ValueError("Empty, silent or non-finite output")
   dest=root/(gender+"-"+name+Path(source).suffix)
   shutil.copyfile(source,dest)
   item.update(status="generated",file=dest.name,sample_rate=rate,seconds=round(len(wave)/rate,3),
      peak=float(np.max(np.abs(wave))),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),
      request_seconds=round(time.monotonic()-started,2))
   print("GENERATED "+gender+" "+name,flush=True)
  except Exception as exc:
   reason=str(exc).replace(token,"[REDACTED]")[:800]
   item.update(status="unavailable",error_type=type(exc).__name__,reason=reason)
   print("UNAVAILABLE "+gender+" "+name+" "+type(exc).__name__,flush=True)
   if "quota" in reason.lower() or "rate limit" in reason.lower():blocked=True
  records.append(item);save()
 # Preserve source files and offer a clearly labelled sequential preview.
 generated=[r for r in records if r["gender"]==gender and r["status"]=="generated"]
 if len(generated)==len(turns):
  try:
   audio=[];sr=None
   for r in generated:
    y,rate=sf.read(root/r["file"],always_2d=True)
    if sr is not None and rate!=sr:raise ValueError("Montage sample rates differ")
    sr=rate
    if audio:audio.append(np.zeros((round(.7*sr),y.shape[1])))
    audio.append(y)
   combined=np.concatenate(audio,axis=0)
   if np.max(np.abs(combined))>=1:raise ValueError("Avoid PCM clipping in combined preview")
   dest=root/("lanx-"+gender+"-style-b-v3.wav")
   sf.write(dest,combined,sr,subtype="PCM_24")
   montages.append({"gender":gender,"file":dest.name,"seconds":round(len(combined)/sr,3),
      "sha256":hashlib.sha256(dest.read_bytes()).hexdigest(),
      "editing":"Three unaltered speech clips in sequence; 0.7 seconds silence between clips. No learner audio, pitch or speed modification."})
  except Exception as exc:
   montages.append({"gender":gender,"status":"unavailable","reason":str(exc)[:300]})
  save()
(root/"README.md").write_text("""# Style B v3 conversational voice audition

Three scripted situations per voice: question, clarification, corrective feedback.
Every male turn uses the same previous synthetic male B reference. Every female turn uses the previous synthetic female B reference.
This aims to preserve the preferred identity; identity stability is not yet measured.
The question repeats the earlier script for direct comparison.
Turn-specific directions guide curiosity, attentive clarification and calm, honest correction.

The two combined WAVs are sequential listening previews with 0.7 seconds silence between the three clips.
They are not a recording of a live interaction. Individual original returned files are also preserved.
No customer data, real-person reference, paid hardware, voice training, fake learner score or live website change.
No fake laughs, added breaths, forced hesitation, speech speed/pitch effects or watermark removal.
ElevenLabs and ChatGPT are quality references, not measured equivalence claims.

Listen for exact wording, clear consonants, natural melody, appropriate pauses, supportive confidence and same-speaker identity across turns.
Technical decoding alone does not establish naturalness. A scripted sample does not establish live interviewer response speed or reasoning.
""")
save()
print("Generated "+str(sum(r.get("status")=="generated" for r in records))+" individual clips.")
