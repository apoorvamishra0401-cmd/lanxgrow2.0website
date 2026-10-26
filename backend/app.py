import os,json,uuid
from datetime import datetime,timezone,timedelta
from contextlib import contextmanager
import httpx,psycopg
from psycopg.rows import dict_row
from fastapi import FastAPI,HTTPException,Header,Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel,Field
from rules import entitlement
app=FastAPI(title='LanXgrow Learning API',docs_url=None,redoc_url=None)
app.add_middleware(CORSMiddleware,allow_origins=[v for v in os.getenv('ALLOWED_ORIGINS','').split(',') if v],allow_methods=['GET','POST'],allow_headers=['Authorization','Content-Type'])
@contextmanager
def db():
    if not os.getenv('DATABASE_URL'):raise HTTPException(503,'Learning storage is unavailable. Please try again later.')
    with psycopg.connect(os.environ['DATABASE_URL'],row_factory=dict_row) as conn:yield conn
async def identity(authorization:str=Header(default='')):
    base=os.getenv('SUPABASE_URL','');key=os.getenv('SUPABASE_PUBLISHABLE_KEY','')
    if not base or not key:raise HTTPException(503,'Sign-in service is not configured.')
    if not authorization.startswith('Bearer '):raise HTTPException(401,'Please sign in to continue.')
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            result=await client.get(base+'/auth/v1/user',headers={'Authorization':authorization,'apikey':key})
        if result.status_code!=200:raise HTTPException(401,'Please sign in again.')
        return str(uuid.UUID(result.json()['id']))
    except (httpx.HTTPError,ValueError,KeyError):raise HTTPException(503,'Sign-in could not be verified. Please try again.')
def learner(c,user):
    row=c.execute('select * from learning_private.learners where user_id=%s',(user,)).fetchone()
    if not row:raise HTTPException(409,'Please complete onboarding first.')
    return row
def limits(row):return entitlement(row['onboarding_completed_at'],row['paid_until'],datetime.now(timezone.utc))
@app.get('/health')
def health():return {'status':'ok','storage_configured':bool(os.getenv('DATABASE_URL')),'analysis_configured':bool(os.getenv('GROQ_API_KEY') and os.getenv('GROQ_MODEL'))}
@app.post('/v1/writing/start')
def start(user=Depends(identity)):
    with db() as c:
        p=learner(c,user);e=limits(p);now=datetime.now(timezone.utc)
        # Serialises simultaneous starts for this learner; unique index is a second safeguard.
        c.execute('select user_id from learning_private.learners where user_id=%s for update',(user,))
        existing=c.execute("select * from learning_private.writing_sessions where user_id=%s and day=%s and status<>'restored'",(user,e['day'])).fetchone()
        if existing:raise HTTPException(409,'Today’s writing session has already started. You can practise again tomorrow.')
        sid=uuid.uuid4();deadline=now+timedelta(seconds=e['seconds'])
        c.execute("insert into learning_private.writing_sessions(id,user_id,day,started_at,deadline,status) values(%s,%s,%s,%s,%s,'active')",(sid,user,e['day'],now,deadline))
        return {'id':str(sid),'deadline':deadline,'seconds':e['seconds'],'topic':'Describe a small change that made your everyday life better. What changed, and why did it matter?'}
class Response(BaseModel):text:str=Field(min_length=1,max_length=12000)
@app.post('/v1/writing/{sid}/draft')
def save_draft(sid:uuid.UUID,body:Response,user=Depends(identity)):
    with db() as c:
        row=c.execute("update learning_private.writing_sessions set response=%s where id=%s and user_id=%s and status='active' and deadline>clock_timestamp() returning id",(body.text,sid,user)).fetchone()
        if not row:raise HTTPException(409,'Writing time has ended or this session is no longer active.')
    return {'status':'saved'}
@app.post('/v1/writing/{sid}/submit')
def submit(sid:uuid.UUID,user=Depends(identity)):
    with db() as c:
        row=c.execute('select * from learning_private.writing_sessions where id=%s and user_id=%s for update',(sid,user)).fetchone()
        if not row:raise HTTPException(404,'Session not found.')
        if row['status']!='active':return {'id':str(sid),'status':row['status']}
        if not (row['response'] or '').strip():raise HTTPException(422,'Please save a response before submitting.')
        # After expiry, only the last server-saved snapshot can be submitted.
        c.execute("update learning_private.writing_sessions set status='submitted',submitted_at=now() where id=%s",(sid,))
        return {'id':str(sid),'status':'submitted'}
@app.post('/v1/writing/{sid}/discard')
def discard(sid:uuid.UUID,user=Depends(identity)):
    with db() as c:
        row=c.execute("update learning_private.writing_sessions set status='discarded',response=null where id=%s and user_id=%s and status='active' returning id",(sid,user)).fetchone()
        if not row:raise HTTPException(409,'This session cannot be discarded.')
    return {'status':'discarded'}
@app.get('/v1/reports')
def reports(user=Depends(identity)):
    with db() as c:
        if not limits(learner(c,user))['reports']:raise HTTPException(403,'A subscription is required to open your reports. Your progress remains saved.')
        return c.execute("select id,day,status,report from learning_private.writing_sessions where user_id=%s and status in ('submitted','complete') order by started_at desc limit 50",(user,)).fetchall()
