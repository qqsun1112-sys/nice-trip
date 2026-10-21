-- Transaction-safe transfer report submission throttle (draft migration).
-- Run together with 20261021_email_transfer_link.sql before deploying the Edge Function.
create table if not exists public.transfer_report_rate_limits (
  client_hash text not null,
  registration_no text not null,
  hour_bucket timestamptz not null,
  attempt_count integer not null default 0,
  primary key (client_hash, registration_no, hour_bucket)
);
alter table public.transfer_report_rate_limits enable row level security;
revoke all on public.transfer_report_rate_limits from anon, authenticated;
create or replace function public.check_transfer_report_rate_limit(
  p_client_hash text,
  p_registration_no text,
  p_max_attempts integer default 8
) returns boolean language plpgsql security definer
set search_path = public as $$
declare v_count integer;
begin
  if p_client_hash is null or length(p_client_hash) <> 64
     or p_registration_no is null or length(p_registration_no) > 40
     or p_max_attempts not between 1 and 20 then
    return false;
  end if;
  insert into public.transfer_report_rate_limits
    (client_hash, registration_no, hour_bucket, attempt_count)
  values (p_client_hash, p_registration_no, date_trunc('hour', now()), 1)
  on conflict (client_hash, registration_no, hour_bucket)
  do update set attempt_count = transfer_report_rate_limits.attempt_count + 1
  returning attempt_count into v_count;
  return v_count <= p_max_attempts;
end; $$;
revoke all on function public.check_transfer_report_rate_limit(text,text,integer) from public, anon, authenticated;
grant execute on function public.check_transfer_report_rate_limit(text,text,integer) to service_role;
-- Housekeeping: schedule periodic deletion of hour_bucket < now() - interval '2 days'
-- via existing scheduler, after verifying that extension/scheduler is available.
