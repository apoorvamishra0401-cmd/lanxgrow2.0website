"""Development WSGI composition; never reuse request-scoped identity/access ports."""
from http import HTTPStatus
from .writing_wsgi import make_app

def make_scoped_app(gateway_context_factory):
    """The trusted factory returns a context manager that closes access ports.

    The factory must obtain identity and consent from trusted server sources,
    not from client-supplied body fields. No listener, secrets or network calls.
    """
    if not callable(gateway_context_factory):
        raise TypeError('trusted_gateway_factory_required')

    def app(environ, start_response):
        try:
            with gateway_context_factory(environ) as gateway:
                return make_app(gateway)(environ, start_response)
        except Exception:
            body = b'{"error":"writing_unavailable"}'
            start_response(f'503 {HTTPStatus.SERVICE_UNAVAILABLE.phrase}', [
                ('Content-Type', 'application/json; charset=utf-8'),
                ('Cache-Control', 'no-store'),
                ('X-Content-Type-Options', 'nosniff'),
                ('Content-Length', str(len(body)))])
            return [body]
    return app
