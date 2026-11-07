"""Offline request-lifecycle checks; no real learner credentials."""
import io
import json
from contextlib import contextmanager
from backend.writing_gateway import GatewayReply
from backend.writing_scoped_wsgi import make_scoped_app

def request(app):
    statuses = []
    environ = {'REQUEST_METHOD': 'GET',
               'PATH_INFO': '/dev/v1/writing/requests/request_123',
               'HTTP_AUTHORIZATION': 'Bearer fake',
               'HTTP_ORIGIN': 'https://test.invalid',
               'CONTENT_LENGTH': '2',
               'CONTENT_TYPE': 'application/json',
               'wsgi.input': io.BytesIO(b'{}')}
    result = b''.join(app(environ, lambda status, headers: statuses.append((status, dict(headers)))))
    return int(statuses[0][0].split()[0]), json.loads(result), statuses[0][1]

def test_each_request_creates_and_closes_distinct_gateway():
    events = []
    @contextmanager
    def factory(_):
        events.append('opened')
        class Gateway:
            def read(self, request_id, **kwargs):
                events.append('read')
                return GatewayReply(200, {'status':'ok'})
        try:
            yield Gateway()
        finally:
            events.append('closed')
    app = make_scoped_app(factory)
    assert request(app)[0] == 200
    assert request(app)[0] == 200
    assert events == ['opened','read','closed','opened','read','closed']

def test_factory_exception_is_redacted():
    @contextmanager
    def factory(_):
        raise RuntimeError('PRIVATE_CREDENTIAL')
        yield None
    status, body, headers = request(make_scoped_app(factory))
    assert status == 503 and body == {'error':'writing_unavailable'}
    assert 'PRIVATE_CREDENTIAL' not in json.dumps(body)
    assert headers['Cache-Control'] == 'no-store'

def test_access_is_closed_after_gateway_exception():
    events = []
    @contextmanager
    def factory(_):
        try:
            class Gateway:
                def read(self, request_id, **kwargs):
                    raise RuntimeError('PRIVATE_DATA')
            yield Gateway()
        finally:
            events.append('closed')
    status, body, _ = request(make_scoped_app(factory))
    assert status == 503 and body == {'error':'writing_unavailable'}
    assert events == ['closed']
