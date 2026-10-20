// STAGING ONLY. Public, read-only quote; final registration RPC independently revalidates.
import {createClient} from "npm:@supabase/supabase-js@2";
const origins=new Set(["https://nicetrip.tw","https://www.nicetrip.tw","https://qqsun1112-sys.github.io"]);
const headers=(origin:string|null)=>({"Access-Control-Allow-Origin":origin&&origins.has(origin)?origin:"https://nicetrip.tw","Access-Control-Allow-Headers":"content-type, apikey","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json","Vary":"Origin"});
const respond=(data:Record<string,unknown>,status:number,h:Record<string,string>)=>Response.json(data,{status,headers:h});
Deno.serve(async req=>{
 const origin=req.headers.get("origin"),h=headers(origin);
 if(req.method==="OPTIONS")return new Response("ok",{headers:h});
 if(req.method!=="POST"||(origin&&!origins.has(origin)))return respond({ok:false,error:"forbidden"},403,h);
 try{
  const body=await req.json().catch(()=>null);
  if(!body||typeof body!=="object")return respond({ok:false,error:"invalid_request"},400,h);
  const slug=String(body.event_slug||""),ticket=String(body.ticket_code||""),qty=Number(body.quantity),code=String(body.promotion_code||"").trim().toUpperCase();
  if(!/^[a-zA-Z0-9_-]{1,160}$/.test(slug)||!ticket||ticket.length>100||!Number.isSafeInteger(qty)||qty<1||qty>20||!/^[A-Z0-9_-]{3,32}$/.test(code))return respond({ok:false,error:"invalid_request"},400,h);
  const keys=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}"),secret=keys.default,url=Deno.env.get("SUPABASE_URL");
  if(!url||!secret)return respond({ok:false,error:"unavailable"},503,h);
  const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:a,error:ae}=await admin.from("site_activities").select("slug,event_date,status,published,ticket_options,max_per_registration,registration_deadline,service").eq("slug",slug).maybeSingle();
  if(ae||!a||a.published!==true||a.status!=="open"||!a.event_date)return respond({ok:false,error:"event_not_open"},400,h);
  const now=Date.now();
  if(a.registration_deadline&&now>=Date.parse(a.registration_deadline))return respond({ok:false,error:"registration_closed"},400,h);
  if(a.max_per_registration&&qty>Number(a.max_per_registration))return respond({ok:false,error:"quantity_limit"},400,h);
  const options=Array.isArray(a.ticket_options)?a.ticket_options:[],t=options.find((x:any)=>x&&x.active!==false&&String(x.code)===ticket);
  if(!t||qty<Number(t.min_qty||1)||(t.max_qty&&qty>Number(t.max_qty)))return respond({ok:false,error:"invalid_ticket"},400,h);
  if(t.deadline_days_before){const cutoff=new Date(a.event_date+"T00:00:00+08:00");cutoff.setDate(cutoff.getDate()-Number(t.deadline_days_before));if(now>cutoff.getTime())return respond({ok:false,error:"ticket_expired"},400,h)}
  const unit=Number(t.unit_price),gross=unit*qty;
  if(!Number.isSafeInteger(unit)||unit<=0||!Number.isSafeInteger(gross)||gross>2147483647||t.other_coupon_applied===true)return respond({ok:false,error:"coupon_not_eligible"},400,h);
  const {data:c,error:ce}=await admin.from("promotion_campaigns").select("code,discount_per_person,starts_at,ends_at,enabled,service,eligible_event_slugs").eq("code",code).maybeSingle();
  if(ce||!c||!c.enabled||now<Date.parse(c.starts_at)||now>Date.parse(c.ends_at)||c.service!==a.service||!Array.isArray(c.eligible_event_slugs)||!c.eligible_event_slugs.includes(slug))return respond({ok:false,error:"coupon_not_eligible"},400,h);
  const per=Number(c.discount_per_person);
  if(!Number.isSafeInteger(per)||per<=0)return respond({ok:false,error:"coupon_not_eligible"},400,h);
  const discount=Math.min(per,unit)*qty;
  return respond({ok:true,promotion_code:code,original_total:gross,promotion_discount:discount,total_amount:gross-discount,quantity:qty,ticket_code:ticket,event_slug:slug},200,h);
 }catch(e){console.error("promotion_quote_failed",e);return respond({ok:false,error:"quote_unavailable"},503,h)}
});
