-- STAGING ONLY. Apply only after owner approval and isolated database testing.
-- The edge endpoint authenticates JWT and allowlists operator UUID before invoking this RPC.
-- This routine must be callable by service_role ONLY, and writes audit + campaign atomically.
BEGIN;
CREATE OR REPLACE FUNCTION public.manage_promotion_campaign_atomic(
  p_actor uuid, p_campaign jsonb, p_id bigint DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  old_row public.promotion_campaigns%ROWTYPE;
  new_row public.promotion_campaigns%ROWTYPE;
  action_name text := 'create';
  slugs text[];
  n integer;
  distinct_n integer;
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF p_actor IS NULL OR p_campaign IS NULL OR jsonb_typeof(p_campaign) <> 'object' THEN
    RAISE EXCEPTION 'invalid_input';
  END IF;
  IF p_id IS NOT NULL THEN
    SELECT * INTO old_row FROM public.promotion_campaigns WHERE id=p_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'campaign_not_found'; END IF;
    action_name := CASE WHEN old_row.enabled AND NOT (p_campaign->>'enabled')::boolean THEN 'disable' ELSE 'update' END;
  END IF;
  IF jsonb_typeof(p_campaign->'eligible_event_slugs') IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'invalid_events';
  END IF;
  SELECT array_agg(value) INTO slugs FROM jsonb_array_elements_text(p_campaign->'eligible_event_slugs') AS value;
  IF cardinality(slugs) IS NULL OR cardinality(slugs)=0 OR cardinality(slugs)>100 OR EXISTS (
    SELECT 1 FROM unnest(slugs) AS slug WHERE slug IS NULL OR btrim(slug)=''
  ) THEN RAISE EXCEPTION 'invalid_events'; END IF;
  SELECT count(DISTINCT slug) INTO distinct_n FROM unnest(slugs) AS slug;
  IF distinct_n <> cardinality(slugs) THEN RAISE EXCEPTION 'duplicate_event_scope'; END IF;
  IF p_campaign->>'service' IS DISTINCT FROM 'city' THEN RAISE EXCEPTION 'invalid_service'; END IF;
  SELECT count(*) INTO n FROM public.site_activities WHERE slug=ANY(slugs) AND service='city';
  IF n <> cardinality(slugs) THEN RAISE EXCEPTION 'invalid_event_scope'; END IF;
  IF p_campaign->>'code' !~ '^[A-Z0-9_-]{3,32} INTO public.promotion_campaigns(code,title,discount_per_person,starts_at,ends_at,enabled,service,eligible_event_slugs)
    VALUES (p_campaign->>'code',p_campaign->>'title',(p_campaign->>'discount_per_person')::integer,
      (p_campaign->>'starts_at')::timestamptz,(p_campaign->>'ends_at')::timestamptz,
      (p_campaign->>'enabled')::boolean,'city',slugs)
    RETURNING * INTO new_row;
  ELSE
    UPDATE public.promotion_campaigns SET
      code=p_campaign->>'code',title=p_campaign->>'title',
      discount_per_person=(p_campaign->>'discount_per_person')::integer,
      starts_at=(p_campaign->>'starts_at')::timestamptz,
      ends_at=(p_campaign->>'ends_at')::timestamptz,
      enabled=(p_campaign->>'enabled')::boolean,
      eligible_event_slugs=slugs,updated_at=now()
    WHERE id=p_id RETURNING * INTO new_row;
  END IF;
  INSERT INTO public.promotion_campaign_audit(campaign_id,actor_user_id,action,before_state,after_state)
  VALUES (new_row.id,p_actor,action_name,CASE WHEN p_id IS NULL THEN NULL ELSE to_jsonb(old_row) END,to_jsonb(new_row));
  RETURN to_jsonb(new_row);
END;
$$;
REVOKE ALL ON FUNCTION public.manage_promotion_campaign_atomic(uuid,jsonb,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.manage_promotion_campaign_atomic(uuid,jsonb,bigint) TO service_role;
COMMIT;
 OR btrim(coalesce(p_campaign->>'title',''))='' THEN
    RAISE EXCEPTION 'invalid_campaign';
  END IF;
  IF p_id IS NULL THEN
    INSERT INTO public.promotion_campaigns(code,title,discount_per_person,starts_at,ends_at,enabled,service,eligible_event_slugs)
    VALUES (p_campaign->>'code',p_campaign->>'title',(p_campaign->>'discount_per_person')::integer,
      (p_campaign->>'starts_at')::timestamptz,(p_campaign->>'ends_at')::timestamptz,
      (p_campaign->>'enabled')::boolean,'city',slugs)
    RETURNING * INTO new_row;
  ELSE
    UPDATE public.promotion_campaigns SET
      code=p_campaign->>'code',title=p_campaign->>'title',
      discount_per_person=(p_campaign->>'discount_per_person')::integer,
      starts_at=(p_campaign->>'starts_at')::timestamptz,
      ends_at=(p_campaign->>'ends_at')::timestamptz,
      enabled=(p_campaign->>'enabled')::boolean,
      eligible_event_slugs=slugs,updated_at=now()
    WHERE id=p_id RETURNING * INTO new_row;
  END IF;
  INSERT INTO public.promotion_campaign_audit(campaign_id,actor_user_id,action,before_state,after_state)
  VALUES (new_row.id,p_actor,action_name,CASE WHEN p_id IS NULL THEN NULL ELSE to_jsonb(old_row) END,to_jsonb(new_row));
  RETURN to_jsonb(new_row);
END;
$$;
REVOKE ALL ON FUNCTION public.manage_promotion_campaign_atomic(uuid,jsonb,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.manage_promotion_campaign_atomic(uuid,jsonb,bigint) TO service_role;
COMMIT;
