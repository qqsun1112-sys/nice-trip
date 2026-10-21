// Draft only. Requires 20261021_email_transfer_link.sql and reviewed email issuance.
// Secure email-link transfer reporting, separate from legacy report-transfer endpoint.
import { createClient } from "npm:@supabase/supabase-js@2";
const origins=new Set(["https://nicetrip.tw","https://www.nicetrip.tw","https://qqsun1112-sys.github.io"]);
const headers=(origin:string|null)=>({"Content-Type":"application/json","Cache-Control":"no-store","Vary":"Origin","Access-Control-Allow-Origin":origin&&origins.has(origin)?origin:"https://nicetrip.tw","Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"POST, OPTIONS"});
const reply=(body:unknown,status:number,h:Record<string,string>)=>Response.json(body,{status,headers:h});
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))).map(b=>b.toString(16).padStart(2,"0")).join("");
Deno.serve(async(req)=>{
 const origin=req.headers.get("origin"),h=headers(origin);
 if(req.method==="OPTIONS")return new Response(null,{headers:h});
 if(req.method!=="POST"||(origin&&!origins.has(origin)))return reply({ok:false,error:"forbidden"},403,h);
 try{
  const body=await req.json(),action=String(body.action||""),no=String(body.registration_no||"").trim(),token=String(body.report_token||"").trim();
  if(!["preview","submit"].includes(action)||!/^NT-[0-9]{8}-[A-Z0-9]{6}$/.test(no)||!/^[a-f0-9]{64}$/.test(token))return reply({ok:false,error:"invalid_link"},400,h);
  const keys=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}");
  if(!keys.default)throw Error("missing_service_key");
  const admin=createClient(Deno.env.get("SUPABASE_URL")!,keys.default);
  const digest=await hash(token);
  const {data:r,error}=await admin.from("registrations").select("id,registration_no,event_title,event_date,quantity,total_amount,status,transfer_link_expires_at").eq("registration_no",no).eq("transfer_link_token_hash",digest).maybeSingle();
  if(error||!r||!r.transfer_link_expires_at||new Date(r.transfer_link_expires_at).getTime()<Date.now())return reply({ok:false,error:"invalid_or_expired_link"},404,h);
  if(action==="preview")return reply({ok:true,event_title:r.event_title,event_date:r.event_date,quantity:r.quantity,total_amount:r.total_amount,status:r.status,reportable:r.status==="pending_transfer"},200,h);
  const last5=String(body.transfer_last5||"").trim(),memo=String(body.transfer_memo||"").trim();
  if(!/^[0-9]{5}$/.test(last5)||memo.length>60||/[\u0000-\u001f\u007f]/.test(memo))return reply({ok:false,error:"invalid_fields"},400,h);
  if(r.status==="transfer_reported")return reply({ok:true,status:"transfer_reported",already_reported:true},200,h);
  if(r.status!=="pending_transfer")return reply({ok:false,error:"status_locked"},409,h);
  const {data:changed,error:ue}=await admin.from("registrations").update({transfer_last5:last5,transfer_memo:memo||null,status:"transfer_reported",updated_at:new Date().toISOString()}).eq("id",r.id).eq("status","pending_transfer").select("id");
  if(ue)return reply({ok:false,error:"update_failed"},500,h);
  if(!changed?.length)return reply({ok:false,error:"status_changed"},409,h);
  // TODO before production: shared notification dispatch with existing report-transfer,
  // plus rate limiting and monitoring. No false claim that email was sent.
  return reply({ok:true,status:"transfer_reported"},200,h);
 }catch(e){console.error("transfer_link_error",e);return reply({ok:false,error:"invalid_request"},400,h)}
});
