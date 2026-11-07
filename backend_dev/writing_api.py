"""Development-only Writing service. Caller injects trusted token verifier and evaluator."""
import json
import sqlite3
import uuid
from dataclasses import dataclass
from typing import Callable

class Unauthorized(Exception):
    pass

class InvalidSubmission(Exception):
    pass

@dataclass(frozen=True)
class Result:
    status: int
    body: dict

class WritingService:
    def __init__(self, database: str, verify_token: Callable[[str], str], evaluate: Callable[[str], dict]):
        self.database = database
        self.verify_token = verify_token
        self.evaluate = evaluate
        with self._connect() as db:
            db.execute('CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY, owner TEXT NOT NULL, submission TEXT NOT NULL, report TEXT NOT NULL)')

    def _connect(self):
        return sqlite3.connect(self.database)

    def _owner(self, bearer: str) -> str:
        if not isinstance(bearer, str) or not bearer.startswith('Bearer '):
            raise Unauthorized('Missing bearer token')
        subject = self.verify_token(bearer[7:])
        if not isinstance(subject, str) or not subject.strip():
            raise Unauthorized('Invalid subject')
        return subject

    def submit(self, bearer: str, payload: dict) -> Result:
        owner = self._owner(bearer)
        if not isinstance(payload, dict) or set(payload) != {'text'}:
            raise InvalidSubmission('Expected text only')
        text = payload['text']
        if not isinstance(text, str) or not (1 <= len(text.strip()) <= 10000):
            raise InvalidSubmission('Text must contain 1–10000 characters')
        report = self.evaluate(text.strip())
        if not isinstance(report, dict) or report.get('status') not in ('completed', 'insufficient'):
            raise ValueError('Evaluator returned unsupported report')
        report_id = str(uuid.uuid4())
        with self._connect() as db:
            db.execute('INSERT INTO reports VALUES (?, ?, ?, ?)', (report_id, owner, text.strip(), json.dumps(report)))
        return Result(201, {'id': report_id, 'status': report['status']})

    def get_report(self, bearer: str, report_id: str) -> Result:
        owner = self._owner(bearer)
        with self._connect() as db:
            row = db.execute('SELECT report FROM reports WHERE id = ? AND owner = ?', (report_id, owner)).fetchone()
        if row is None:
            return Result(404, {'error': 'not_found'})
        return Result(200, {'id': report_id, 'report': json.loads(row[0])})
