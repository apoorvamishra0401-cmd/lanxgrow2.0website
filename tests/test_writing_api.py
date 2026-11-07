import os
import tempfile
import unittest
from backend_dev.writing_api import WritingService, Unauthorized, InvalidSubmission

class WritingAPITests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db = os.path.join(self.tmp.name, 'reports.db')
        self.verifier = lambda token: {'alice-token': 'alice', 'bob-token': 'bob'}.get(token)
        self.evaluator = lambda text: {'status': 'completed', 'feedback': f'{len(text)} chars'}
        self.service = WritingService(self.db, self.verifier, self.evaluator)

    def tearDown(self):
        self.tmp.cleanup()

    def test_submit_and_durable_readback(self):
        receipt = self.service.submit('Bearer alice-token', {'text': 'Practice writing'})
        self.assertEqual(receipt.status, 201)
        restarted = WritingService(self.db, self.verifier, self.evaluator)
        self.assertEqual(restarted.get_report('Bearer alice-token', receipt.body['id']).body['report']['status'], 'completed')

    def test_cross_user_isolation(self):
        rid = self.service.submit('Bearer alice-token', {'text': 'Private'}).body['id']
        self.assertEqual(self.service.get_report('Bearer bob-token', rid).status, 404)

    def test_missing_auth_denied(self):
        with self.assertRaises(Unauthorized):
            self.service.submit('', {'text': 'Private'})

    def test_invalid_token_denied(self):
        with self.assertRaises(Unauthorized):
            self.service.get_report('Bearer invalid', 'id')

    def test_invalid_payload_denied(self):
        with self.assertRaises(InvalidSubmission):
            self.service.submit('Bearer alice-token', {'text': ''})
        with self.assertRaises(InvalidSubmission):
            self.service.submit('Bearer alice-token', {'text': 'ok', 'owner': 'bob'})

    def test_evaluator_failure_does_not_persist(self):
        service = WritingService(self.db, self.verifier, lambda _: (_ for _ in ()).throw(RuntimeError('offline')))
        with self.assertRaises(RuntimeError):
            service.submit('Bearer alice-token', {'text': 'Private'})
        import sqlite3
        with sqlite3.connect(self.db) as db:
            self.assertEqual(db.execute('SELECT COUNT(*) FROM reports').fetchone()[0], 0)

    def test_raw_submission_never_persisted(self):
        self.service.submit('Bearer alice-token', {'text': 'SECRET-SYNTHETIC-ESSAY'})
        import sqlite3
        with sqlite3.connect(self.db) as db:
            row = db.execute('SELECT sql FROM sqlite_master WHERE name = ?', ('reports',)).fetchone()
            self.assertNotIn('submission', row[0].lower())
            self.assertNotIn('SECRET-SYNTHETIC-ESSAY', str(db.execute('SELECT * FROM reports').fetchall()))

    def test_verifier_exception_fails_closed(self):
        service = WritingService(self.db, lambda token: (_ for _ in ()).throw(RuntimeError('identity down')), self.evaluator)
        with self.assertRaises(Unauthorized):
            service.submit('Bearer alice-token', {'text': 'Private'})

    def test_invalid_evaluator_report_does_not_persist(self):
        service = WritingService(self.db, self.verifier, lambda _: {'status': 'unknown'})
        with self.assertRaises(ValueError):
            service.submit('Bearer alice-token', {'text': 'Private'})

if __name__ == '__main__':
    unittest.main()
