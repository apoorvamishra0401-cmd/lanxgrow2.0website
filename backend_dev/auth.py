"""Offline RS256 JWT verifier for an explicitly configured development issuer."""
import jwt
from jwt import InvalidTokenError
from .writing_api import Unauthorized

def make_verifier(*, issuer: str, audience: str, public_key_pem: str):
    if not issuer.startswith('https://') or not issuer.endswith('/auth/v1'):
        raise ValueError('Explicit HTTPS Supabase auth issuer required')
    if not audience or not public_key_pem.strip():
        raise ValueError('Audience and public key are required')
    def verify(token: str) -> str:
        try:
            claims = jwt.decode(token, public_key_pem, algorithms=['RS256'],
                                issuer=issuer, audience=audience,
                                options={'require': ['exp', 'iat', 'iss', 'aud', 'sub']},
                                leeway=0)
            subject = claims['sub']
            if not isinstance(subject, str) or not subject.strip():
                raise Unauthorized('Invalid subject')
            return subject
        except InvalidTokenError as exc:
            raise Unauthorized('Invalid bearer token') from exc
    return verify
