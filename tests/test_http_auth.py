"""Run: python -m unittest discover -s tests -p 'test_http_auth.py' -v"""
import http.client
import json
import os
import tempfile
import threading
import unittest
from datetime import datetime, timedelta, timezone
import jwt
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from backend_dev.auth import make_verifier
from backend_dev.http_api import serve_local
from backend_dev.writing_api import WritingService

ISSUER = 'https://dev-project.supabase.co/auth/v1'

class IntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        pub = cls.key.public_key().public_bytes(serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo).decode()
        cls.verifier = staticmethod(make_verifier(issuer=ISSUER, audience='authenticated', public_key_pem=pub))
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db = os.path.join(self.tmp.name, 'reports.db')
        self.service = WritingService(self.db, self.verifier, lambda text: {'status':'completed', 'length':len(text)})
        self.server = serve_local(self.service, port=0)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.tmp.cleanup()
    def token(self, sub='alice', **changes):
        now = datetime.now(timezone.utc)
        claims = dict(sub=sub, iss=ISSUER, aud='authenticated', iat=now, exp=now+timedelta(minutes=10))
        claims.update(changes)
        return jwt.encode(claims, self.key, algorithm='RS256')
    def request(self, method, path, payload=None, token=None, content_type='application/json'):
        conn = http.client.HTTPConnection('127.0.0.1', self.server.server_port, timeout=3)
        headers = {'Content-Type':content_type}
        if token is not None: headers['Authorization'] = 'Bearer '+token
        conn.request(method, path, body=json.dumps(payload) if payload is not None else None, headers=headers)
        response = conn.getresponse()
        result = response.status, json.loads(response.read())
        conn.close()
        return result
    def test_submission_and_restart_readback(self):
        status, body = self.request('POST','/dev/v1/writing/submissions',{'text':'Hello world'},self.token())
        self.assertEqual(status,201)
        restarted = WritingService(self.db,self.verifier,lambda text:{'status':'completed'})
        self.assertEqual(restarted.get_report('Bearer '+self.token(),body['id']).status,200)
        status, report = self.request('GET','/dev/v1/writing/reports/'+body['id'],token=self.token())
        self.assertEqual((status,report['report']['length']),(200,11))
        self.assertEqual(self.request('GET','/dev/v1/writing/reports/'+body['id'],token=self.token('bob'))[0],404)
    def test_missing_expired_wrong_issuer_and_unsigned_denied(self):
        self.assertEqual(self.request('POST','/dev/v1/writing/submissions',{'text':'Hi'})[0],401)
        self.assertEqual(self.request('POST','/dev/v1/writing/submissions',{'text':'Hi'},self.token(exp=datetime.now(timezone.utc)-timedelta(seconds=1)))[0],401)
        self.assertEqual(self.request('POST','/dev/v1/writing/submissions',{'text':'Hi'},self.token(iss='https://wrong.supabase.co/auth/v1'))[0],401)
        self.assertEqual(self.request('POST','/dev/v1/writing/submissions',{'text':'Hi'},jwt.encode({'sub':'alice'},'x'*32,algorithm='HS256'))[0],401)
    def test_payload_validation(self):
        self.assertEqual(self.request('POST','/dev/v1/writing/submissions',{'text':''},self.token())[0],400)
        self.assertEqual(self.request('POST','/dev/v1/writing/submissions',{'text':'Hi','owner':'bob'},self.token())[0],400)
        self.assertEqual(self.request('POST','/dev/v1/writing/submissions',{'text':'Hi'},self.token(),'text/plain')[0],415)
        self.assertEqual(self.request('GET','/dev/v1/writing/reports/unknown',token=self.token())[0],404)
    def test_evaluator_error_is_nonpersistent(self):
        self.service.evaluate = lambda text: (_ for _ in ()).throw(RuntimeError('down'))
        self.assertEqual(self.request('POST','/dev/v1/writing/submissions',{'text':'Hi'},self.token())[0],503)
        import sqlite3
        with sqlite3.connect(self.db) as db:
            self.assertEqual(db.execute('SELECT COUNT(*) FROM reports').fetchone()[0],0)
if __name__ == '__main__': unittest.main()
