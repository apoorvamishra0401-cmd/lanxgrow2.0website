"""Development WSGI adapter for the RC2 WritingGateway; no listener or credentials."""
import json
import re
from http import HTTPStatus
from http import HTTPStatus
from .writing_gateway import GatewayReply, MAX_BODY_BYTES

_REQUEST = re.compile(r'^/dev/v1/writing/requests/([a-zA-Z0-9_-]{1,128})(?:/(recover))?$')

def make_app(gateway):
    def app(environ, start_response):
        method = environ.get('REQUEST_METHOD', '')
        path = environ.get('PATH_INFO', '')
        authorization = environ.get('HTTP_AUTHORIZATION', '')
        origin = environ.get('HTTP_ORIGIN', '')
        try:
            if environ.get('QUERY_STRING') or environ.get('HTTP_TRANSFER_ENCODING'):
                reply = GatewayReply(400, {'error': 'invalid_request'})
            elif method == 'POST' and path == '/dev/v1/writing/submissions':
                if environ.get('CONTENT_TYPE', '').split(';')[0].strip().lower() != 'application/json':
                    reply = GatewayReply(415, {'error': 'unsupported_media_type'})
                else:
                    try:
                        length = int(environ.get('CONTENT_LENGTH', ''))
                    except (ValueError, TypeError):
                        length = -1
                    if not 0 < length <= MAX_BODY_BYTES:
                        reply = GatewayReply(413, {'error': 'invalid_request_size'})
                    else:
                        body = environ['wsgi.input'].read(length)
                        reply = (GatewayReply(400, {'error': 'invalid_request'}) if len(body) != length
                                 else gateway.submit(authorization=authorization, origin=origin, body=body))
            elif method == 'GET' and (match := _REQUEST.fullmatch(path)):
                request_id, recover = match.groups()
                reply = (gateway.recover if recover else gateway.read)(
                    request_id, authorization=authorization, origin=origin)
            else:
                reply = GatewayReply(404, {'error': 'not_found'})
        except Exception:
            reply = GatewayReply(503, {'error': 'writing_unavailable'})
        payload = json.dumps(reply.body, separators=(',', ':'), ensure_ascii=False).encode('utf-8')
        headers = [('Content-Type', 'application/json; charset=utf-8'),
                   ('Cache-Control', 'no-store'), ('X-Content-Type-Options', 'nosniff'),
                   ('Content-Length', str(len(payload)))]
        start_response(f'{reply.status} {HTTPStatus(reply.status).phrase}', headers)
        return [payload]
    return app
