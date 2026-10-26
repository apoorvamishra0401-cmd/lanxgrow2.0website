import unittest,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from datetime import datetime,timezone
from rules import entitlement
class Rules(unittest.TestCase):
 def test_ist_calendar_trial(self):
  p=datetime.fromisoformat('2026-10-25T18:29:00+00:00')
  self.assertEqual(entitlement(p,None,datetime.fromisoformat('2026-10-31T18:29:59+00:00'))['seconds'],300)
  e=entitlement(p,None,datetime.fromisoformat('2026-10-31T18:30:00+00:00'))
  self.assertEqual(e['seconds'],120);self.assertFalse(e['reports']);self.assertEqual(str(e['day']),'2026-11-01')
 def test_paid_expiry(self):
  p=datetime.fromisoformat('2026-01-01T00:00:00+00:00');now=datetime.now(timezone.utc)
  self.assertTrue(entitlement(p,now.replace(year=now.year+1),now)['reports'])
  self.assertFalse(entitlement(p,now,now)['reports'])
if __name__=='__main__':unittest.main()
