-- WhatsApp channel columns on profiles. Collected at signup so the
-- daily-question notifier has a target for every new user.
--
-- whatsapp_number stores the E.164 number ("+919812345678"). We keep
-- it as text (not phone/regclass) so international numbers work later
-- without a schema change. Uniqueness prevents duplicate accounts
-- claiming the same phone.

alter table public.profiles
  add column if not exists whatsapp_number text,
  add column if not exists whatsapp_daily_opt_in boolean default true,
  add column if not exists whatsapp_verified_at timestamptz;

create unique index if not exists profiles_whatsapp_number_unique
  on public.profiles (whatsapp_number)
  where whatsapp_number is not null;
