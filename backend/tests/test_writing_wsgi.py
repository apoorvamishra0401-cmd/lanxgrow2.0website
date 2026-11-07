"""Synthetic RC2 HTTP transport tests; no provider or hosted environment."""
import io
import json
from backend.writing_wsgi import make_app
from backend.writing_gateway import GatewayReply

class Gateway:
    def __init__(self): self.calls = []
    def submit(self, **kw):
        self.calls.append(('submit', kw))
        return GatewayReply(202, {'status': 'queued'})
    def read(self, request_id, **kw):
        self.calls.append(('read', request_id, kw))
        return GatewayReply(200, {'status': 'complete'})
    def recover(self, request_id, **kw):
        self.calls.append(('recover', request_id, kw))
        return GatewayReply(200, {'status': 'recovered'})

def call(app, method='POST', path='/dev/v1/writing/submissions', body=b'{}', length=None, ctype='application/json'):
    environ = {'REQUEST_METHOD': method, 'PATH_INFO': path, 'CONTENT_TYPE': ctype,
               'CONTENT_LENGTH': str(len(body) if length is None else length),
               'wsgi.input': io.BytesIO(body), 'HTTP_AUTHORIZATION': 'Bearer synthetic',
               'HTTP_ORIGIN': 'https://example.test'}
    received = []
    payload = b''.join(app(environ, lambda status, headers: received.append((status, dict(headers)))))
    return int(received[0][0].split()[0]), json.loads(payload), received[0][1]

def test_post_passes_raw_body_to_existing_gateway():
    gw = Gateway(); app = make_app(gw)
    status, data, headers = call(app, body=b'{"text":"test"}')
    assert status == 202 and data['status'] == 'queued'
    assert gw.calls[0][1]['body'] == b'{"text":"test"}'
    assert headers['Cache-Control'] == 'no-store'

def test_read_and_recover_are_separate():
    gw = Gateway(); app = make_app(gw)
    assert call(app, 'GET', '/dev/v1/writing/requests/abc', b'')[0] == 200
    assert call(app, 'GET', '/dev/v1/writing/requests/abc/recover', b'')[0] == 200
    assert [c[0] for c in gw.calls] == ['read', 'recover']

def test_rejects_oversize_and_truncated_body_without_gateway_call():
    gw = Gateway(); app = make_app(gw)
    assert call(app, length=999999)[0] == 413
    assert call(app, length=8)[0] == 400
    assert gw.calls == []

def test_rejects_invalid_routes_and_media_type():
    gw = Gateway(); app = make_app(gw)
    assert call(app, ctype='text/plain')[0] == 415
    assert call(app, 'GET', '/dev/v1/writing/requests/../../secret', b'')[0] == 404
    assert call(app, 'DELETE', '/dev/v1/writing/requests/abc', b'')[0] == 404
    assert gw.calls == []


def test_rejects_query_and_transfer_encoding_before_gateway():
    gw = Gateway(); app = make_app(gw)
    for key, value in [('QUERY_STRING', 'token=secret'), ('HTTP_TRANSFER_ENCODING', 'chunked')]:
        env = {'REQUEST_METHOD': 'POST', 'PATH_INFO': '/dev/v1/writing/submissions',
               'CONTENT_TYPE': 'application/json', 'CONTENT_LENGTH': '2',
               'wsgi.input': io.BytesIO(b'{}'), 'HTTP_AUTHORIZATION': 'Bearer synthetic',
               'HTTP_ORIGIN': 'https://example.test', key: value}
        replies = []
        result = b''.join(app(env, lambda status, headers: replies.append(status)))
        assert replies[0].startswith('400 ') and json.loads(result)['error'] == 'invalid_request'
    assert gw.calls == []
