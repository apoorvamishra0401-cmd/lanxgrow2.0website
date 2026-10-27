# Future Vercel preview integration

Development Space: `Apoorva-Mishra/lanxgrow-learning-dev`.

## API contract

Use Gradio's generated API schema after the Space reaches RUNNING. Server-side Python examples:

```python
from gradio_client import Client, handle_file

client = Client('Apoorva-Mishra/lanxgrow-learning-dev')
transcript, metadata = client.predict(
    handle_file('/path/to/recording.wav'), api_name='/transcribe')
audio_path, metadata = client.predict(
    'Let us practise a short introduction.', 'American', api_name='/synthesize')
```

These are development interfaces, not production customer endpoints. For a frontend use a separate Vercel server-side adapter/worker: verify Supabase identity first, validate media and allowed activity, consume the session atomically, submit a queued job, return a job ID, then poll/stream status and deliver the result. Use `@gradio/client` server-side if using JavaScript and consult the running Space's generated schema. Do not hardcode private credentials into React or browser requests. Avoid tying a long GPU job to a short HTTP timeout.

Keep app quotas in the authenticated backend; the Hugging Face demo has no application-level daily cap. Plan for verified-failure session restoration and provider queue/quota errors. Daily business rules and report locks are not implemented by this speech Space.

The UI must not label transcription metadata as an assessment or pronunciation score. Segment timestamps are coarse processing windows. Kokoro voices here are American and British, not Indian English.

## Pending integrations

1. Speech-to-speech conversation model and short-turn history.
2. Vision model, observable coaching rubric, frame timestamps and video upload validation.
3. Supabase-authenticated application gateway and persistent job state.
4. Separate Vercel preview UI and full mobile microphone flow verification.
5. Real 10-minute runtime and throughput benchmarks; 1,000 minutes/day remains a target.

Never attach these changes to lanxgrow.com without explicit approval.
