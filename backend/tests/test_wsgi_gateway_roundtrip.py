"""Actual RC2 gateway + WSGI transport and local durable readback; synthetic."""
import io
import json
import sqlite3
from backend.writing_wsgi import make_app
from backend.interview import InterviewService
from backend.writing_adapter import LocalWritingAdapter
from backend.soul import evaluation_boundary as soul
from backend.tests.test_writing_gateway import setup, ORIGIN, OWNER, OTHER

def http(app, method, path, *, body=b'', token='controlled-owner'):
    got=[]
    env={'REQUEST_METHOD':method,'PATH_INFO':path,'CONTENT_TYPE':'application/json',
         'CONTENT_LENGTH':str(len(body)),'wsgi.input':io.BytesIO(body),
         'HTTP_AUTHORIZATION':'Bearer '+token,'HTTP_ORIGIN':ORIGIN}
    wire=b''.join(app(env,lambda status,headers:got.append((status,dict(headers)))))
    return int(got[0][0].split()[0]),json.loads(wire),got[0][1]

def test_transport_to_rc2_gateway_to_saved_report_and_relogin(tmp_path):
    path,db,service,request,adapter,gateway,payload,_send,calls,_access=setup(tmp_path)
    app=make_app(gateway)
    wire=json.dumps(payload).encode()
    status,receipt,headers=http(app,'POST','/dev/v1/writing/submissions',body=wire)
    assert status==202 and receipt['recovery']['requires_transient_resubmission'] is True
    assert headers['Cache-Control']=='no-store'
    assert calls==[]
    result=adapter.process(request.request_id,owner=OWNER,
        transient_text=payload['text'],worker_id='integration-fixture',lease_seconds=30)
    assert result['outcome']['status']=='evaluated'
    url='/dev/v1/writing/requests/'+request.request_id
    assert http(app,'GET',url)[0]==200
    assert http(app,'GET',url,token='controlled-other')[0]==404
    assert http(app,'GET',url+'/recover')[0]==200
    assert http(app,'POST','/dev/v1/writing/submissions',body=wire)[0]==200
    db.close()
    assert payload['text'].encode() not in path.read_bytes()
    with sqlite3.connect(path) as new_db:
        resumed=LocalWritingAdapter(InterviewService(new_db,lambda:1900),soul_module=soul,evaluator=None)
        assert resumed.reread(request.request_id,owner=OWNER)==result

def test_transport_rejects_untrusted_browser_fields(tmp_path):
    _path,db,_service,_request,_adapter,gateway,payload,_send,_calls,_access=setup(tmp_path)
    body=json.dumps({**payload,'owner':OTHER}).encode()
    status,reply,_=http(make_app(gateway),'POST','/dev/v1/writing/submissions',body=body)
    assert status==400 and reply=={'error':'invalid_request'}
    assert db.execute('SELECT count(*) FROM interview_evaluations_v1').fetchone()[0]==0
    db.close()
