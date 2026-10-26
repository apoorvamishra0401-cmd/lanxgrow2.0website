from datetime import datetime, timedelta, time
from zoneinfo import ZoneInfo
IST=ZoneInfo('Asia/Kolkata')
def entitlement(completed_at:datetime, paid_until:datetime|None, now:datetime):
    end=datetime.combine(completed_at.astimezone(IST).date()+timedelta(days=7),time.min,IST)
    premium=now<end or (paid_until is not None and now<paid_until)
    return {'seconds':300 if premium else 120,'reports':premium,'day':now.astimezone(IST).date(),'trial_end':end}
