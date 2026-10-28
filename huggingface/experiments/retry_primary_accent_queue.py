"""Retry only the single queue-full failure, never a quota failure."""
import hashlib,json,os,shutil,time
from pathlib import Path
import soundfile as sf
import numpy as np
from gradio_client import Client,handle_file
root=Path("huggingface/voice-samples/voxcpm2-primary-accents")
p=root/"results.json"
d=json.loads(p.read_text());token=os.environ["HF_TOKEN"]
matches=[r for r in d["results"] if r["gender"]=="male" and r["accent_requested"]=="american" and r.get("status")=="unavailable" and "queue is full" in r.get("reason","").lower()]
if len(matches)!=1:raise RuntimeError("Expected exactly one queue-full retry candidate")
item=matches[0]
item["previous_attempt"]={k:item[k] for k in ["status","error_type","reason"] if k in item}
start=time.monotonic()
try:
 client=Client("openbmb/VoxCPM-Demo",token=token,verbose=False,analytics_enabled=False)
 job=client.submit(api_name="/generate",text_input=d["script"],control_instruction=item["instruction"],
   reference_wav_path_input=handle_file(item["reference"]),use_prompt_text=False,prompt_text_input="",
   cfg_value_input=2.0,do_normalize=False,denoise=False)
 try:result=job.result(timeout=180)
 except TimeoutError:job.cancel();raise
 source=result[0] if isinstance(result,(tuple,list)) else result
 if isinstance(source,dict):source=source.get("path")
 y,rate=sf.read(source)
 if not y.size or not np.isfinite(y).all() or np.max(np.abs(y))<.001:raise ValueError("Invalid audio")
 dest=root/("lanx-male-american"+Path(source).suffix);shutil.copyfile(source,dest)
 item.pop("reason",None);item.pop("error_type",None)
 item.update(status="generated",file=dest.name,seconds=round(len(y)/rate,3),sample_rate=rate,
   peak=float(np.max(np.abs(y))),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),
   request_seconds=round(time.monotonic()-start,2),queue_retry_count=1)
 print("GENERATED male american after one queue-full retry")
except Exception as exc:
 item.update(status="unavailable",error_type=type(exc).__name__,reason=str(exc).replace(token,"[REDACTED]")[:800],queue_retry_count=1)
 print("UNAVAILABLE male american",type(exc).__name__)
p.write_text(json.dumps(d,indent=2))
