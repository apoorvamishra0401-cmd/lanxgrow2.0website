-- Owner explicitly requested phone/password signup without phone OTP.
-- Keep the absence of ownership verification explicit rather than using a fake date.
alter table public.account_verifications alter column verified_at drop not null;
alter table public.account_verifications add constraint unverified_phone_has_no_verification_time check (provider <> 'unverified-phone' or (channel='phone' and verified_at is null));
