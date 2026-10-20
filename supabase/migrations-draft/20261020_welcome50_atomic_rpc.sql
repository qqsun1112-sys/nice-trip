-- DRAFT ONLY. DO NOT EXECUTE AGAINST PRODUCTION WITHOUT APPROVAL.
-- Replaces only public.create_registration_atomic(p_row jsonb).
-- Keeps original registration behavior for no-code orders.
-- Requires 20261020_welcome50_phase1.sql to be applied first.
CREATE OR REPLACE FUNCTION public.create_registration_atomic(p_row jsonb)
RETURNS public.registrations
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
 a public.site_activities%rowtype;
 used integer;
 q integer;
 out_row public.registrations%rowtype;
 promo text := nullif(upper(btrim(coalesce(p_row->>'promotion_code',''))),'');
 gross integer;
 discount integer;
 amount integer;
 unit integer;
BEGIN
 SELECT * INTO a FROM public.site_activities WHERE slug=p_row->>'event_slug' FOR UPDATE;
 IF NOT FOUND OR NOT a.published OR a.status <> 'open' THEN
  RAISE EXCEPTION 'event_not_open' USING errcode='P0001';
 END IF;
 q:=greatest(1,coalesce((p_row->>'quantity')::integer,1));
 IF a.max_per_registration IS NOT NULL AND q>a.max_per_registration THEN
  RAISE EXCEPTION 'quantity_limit' USING errcode='P0001';
 END IF;
 IF a.capacity IS NOT NULL AND a.capacity>0 THEN
  SELECT coalesce(sum(quantity),0)::integer INTO used FROM public.registrations
  WHERE event_slug=a.slug AND status IN ('pending_transfer','transfer_reported','confirmed','confirmed_free');
  IF used+q>a.capacity THEN RAISE EXCEPTION 'event_full' USING errcode='P0001'; END IF;
 END IF;
 discount:=0;
 IF promo IS NOT NULL THEN
  unit:=coalesce((p_row->>'unit_price')::integer,0);
  gross:=unit*q;
  IF promo<>'WELCOME50' OR NOT a.welcome50_enabled OR a.service<>'city'
    OR (a.registration_deadline IS NOT NULL AND now() >= a.registration_deadline)
    OR unit<=0 OR now()<timestamptz '2026-10-20 00:00:00+08'
    OR now()>timestamptz '2026-12-31 23:59:59+08'
  THEN RAISE EXCEPTION 'coupon_not_eligible' USING errcode='P0001'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(coalesce(a.ticket_options,'[]'::jsonb)) AS ticket(value)
    WHERE ticket.value->>'code'=p_row->>'ticket_code'
      AND coalesce((ticket.value->>'active')::boolean,true)
      AND coalesce((ticket.value->>'other_coupon_applied')::boolean,false)=false
      AND (ticket.value->>'unit_price')::integer=unit
      AND q>=coalesce(nullif(ticket.value->>'min_qty','')::integer,1)
      AND (nullif(ticket.value->>'max_qty','') IS NULL OR q<=nullif(ticket.value->>'max_qty','')::integer)
      AND (nullif(ticket.value->>'deadline_days_before','') IS NULL
           OR now() <= ((a.event_date::timestamp
                       - (nullif(ticket.value->>'deadline_days_before','')::integer * interval '1 day'))
                       AT TIME ZONE 'Asia/Taipei'))
  ) THEN
    RAISE EXCEPTION 'coupon_ticket_mismatch' USING errcode='P0001';
  END IF;
  discount:=least(50,unit)*q;
 END IF;
 -- Preserve the original registration RPC behavior for ordinary (no-code) orders:
 -- the existing endpoint's total is stored unchanged, with no new pricing gate.
 amount:=CASE WHEN promo IS NULL THEN nullif(p_row->>'total_amount','')::integer ELSE gross-discount END;
 IF promo IS NOT NULL AND (
   (amount=0 AND coalesce(p_row->>'status','')<>'confirmed_free')
   OR (amount>0 AND coalesce(p_row->>'status','') NOT IN ('pending_transfer','transfer_reported'))
 ) THEN
   RAISE EXCEPTION 'coupon_status_mismatch' USING errcode='P0001';
 END IF;
 -- Price and coupon consistency enforced inside the same transaction.
 IF promo IS NOT NULL AND (
   amount<>coalesce((p_row->>'total_amount')::integer,-1)
   OR discount<>coalesce((p_row->>'promotion_discount')::integer,-1)
   OR gross<>coalesce((p_row->>'original_total')::integer,-1)
 )
 THEN RAISE EXCEPTION 'amount_mismatch' USING errcode='P0001'; END IF;
 INSERT INTO public.registrations(
  event_slug,event_title,event_date,full_name,phone,email,birth_date,national_id,
  insurance_opt_out,ticket_type,quantity,tax_id,note,transfer_last5,status,
  unit_price,total_amount,ticket_code,promotion_code,promotion_discount,original_total
 ) VALUES (
  p_row->>'event_slug',p_row->>'event_title',(p_row->>'event_date')::date,
  p_row->>'full_name',p_row->>'phone',p_row->>'email',
  nullif(p_row->>'birth_date','')::date,nullif(p_row->>'national_id',''),
  coalesce((p_row->>'insurance_opt_out')::boolean,false),p_row->>'ticket_type',q,
  nullif(p_row->>'tax_id',''),nullif(p_row->>'note',''),nullif(p_row->>'transfer_last5',''),
  p_row->>'status',nullif(p_row->>'unit_price','')::integer,amount,nullif(p_row->>'ticket_code',''),promo,discount,CASE WHEN promo IS NULL THEN NULL ELSE gross END
 ) RETURNING * INTO out_row;
 RETURN out_row;
END $function$;
