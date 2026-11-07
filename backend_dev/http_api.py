"""Loopback-only development HTTP API. Not a production server."""
import json
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
from .writing_api import Unauthorized, InvalidSubmission

MAX_BODY = 12_000
REPORT_PATH = re.compile(r'^/dev/v1/writing/reports/([0-9a-f-]{36})$')

def handler_for(service):
    class Handler(BaseHTTPRequestHandler):
        def _send(self, status, body):
            data = json.dumps(body, separators=(',', ':')).encode('utf-8')
            self.send_response(status)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        def _execute(self, action):
            try:
                result = action()
                self._send(result.status, result.body)
            except Unauthorized:
                self._send(401, {'error': 'unauthorized'})
            except (InvalidSubmission, ValueError, UnicodeError, json.JSONDecodeError):
                self._send(400, {'error': 'invalid_request'})
            except Exception:
                self._send(503, {'error': 'temporarily_unavailable'})
        def do_POST(self):
            if urlsplit(self.path).path != '/dev/v1/writing/submissions':
                return self._send(404, {'error': 'not_found'})
            if self.headers.get('Content-Type', '').split(';')[0].strip().lower() != 'application/json':
                return self._send(415, {'error': 'unsupported_media_type'})
            try:
                size = int(self.headers.get('Content-Length', ''))
                if size < 1 or size > MAX_BODY:
                    return self._send(413, {'error': 'invalid_body_size'})
            except ValueError:
                return self._send(411, {'error': 'content_length_required'})
            def action():
                body = json.loads(self.rfile.read(size).decode('utf-8'))
                return service.submit(self.headers.get('Authorization', ''), body)
            self._execute(action)
        def do_GET(self):
            match = REPORT_PATH.fullmatch(urlsplit(self.path).path)
            if not match:
                return self._send(404, {'error': 'not_found'})
            self._execute(lambda: service.get_report(self.headers.get('Authorization', ''), match.group(1)))
        def log_message(self, format, *args):
            pass
    return Handler

def serve_local(service, port=8765):
    return ThreadingHTTPServer(('127.0.0.1', port), handler_for(service))
