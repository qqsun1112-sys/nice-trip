// Draft only. Requires 20261021_email_transfer_link.sql and reviewed email issuance.
// Secure email-link transfer reporting, separate from legacy report-transfer endpoint.
import { createClient } from "npm:@supabase/supabase-js@2";
const origins=new Set(["https://nicetrip.tw","https://www.nicetrip.tw","https://qqsun1112-sys.github.io"]);
const headers=(origin:string|null)=>({"Content-Type":"application/json","Cache-Control":"no-store","Vary":"Origin","Access-Control-Allow-Origin":origin&&origins.has(origin)?origin:"https://nicetrip.tw","Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"POST, OPTIONS"});
const reply=(body:unknown,status:number,h:Record<string,string>)=>Response.json(body,{status,headers:h});
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))).map(b=>b.toString(16).padStart(2,"0")).join("");
Deno.serve(async(req)=>{
 const origin=req.headers.get("origin"),h=headers(origin);
 const contentLength=Number(req.headers.get("content-length")||"0");
 if(contentLength>4096)return reply({ok:false,error:"request_too_large"},413,h);
 if(req.method==="OPTIONS")return new Response(null,{headers:h});
 if(req.method!=="POST"||(origin&&!origins.has(origin)))return reply({ok:false,error:"forbidden"},403,h);
 try{
  // Best-effort, database-backed hourly throttle. No IP address or token is logged.
  const forwarded=req.headers.get("cf-connecting-ip")||req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"unknown";
  const clientKey=await hash(forwarded+"|"+(Deno.env.get("TRANSFER_RATE_LIMIT_PEPPER")||Deno.env.get("SUPABASE_URL")||""));
  const body=await req.json(),action=String(body.action||""),no=String(body.registration_no||"").trim(),token=String(body.report_token||"").trim();
  if(action==="submit"){
   const keysForLimit=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}");
   if(!keysForLimit.default)throw Error("missing_service_key");
   const limiter=createClient(Deno.env.get("SUPABASE_URL")!,keysForLimit.default);
   const {data:allowed,error:limitError}=await limiter.rpc("check_transfer_report_rate_limit",{p_client_hash:clientKey,p_registration_no:no,p_max_attempts:8});
   if(limitError||allowed!==true)return reply({ok:false,error:"too_many_requests"},429,h);
  }
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
  const {data:changed,error:ue}=await admin.from("registrations").update({transfer_last5:last5,transfer_memo:memo||null,status:"transfer_reported",updated_at:new Date().toISOString()}).eq("id",r.id).eq("status","pending_transfer").eq("transfer_link_token_hash",digest).gt("transfer_link_expires_at",new Date().toISOString()).select("id");
  if(ue)return reply({ok:false,error:"update_failed"},500,h);
  if(!changed?.length)return reply({ok:false,error:"status_changed_or_expired"},409,h);
  // Notify the administrator, matching the legacy report-transfer workflow.
  try{
   const key=Deno.env.get("RESEND_API_KEY");
   if(key){
    const esc=(v:unknown)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
    const html='<div style="font-family:Arial,sans-serif;color:#333;max-width:640px"><h2>參加者已回報匯款｜請查帳</h2><p><b>活動：</b>'+esc(r.event_title)+'</p><p><b>日期：</b>'+esc(r.event_date)+'</p><p><b>報名編號：</b>'+esc(no)+'</p><p><b>人數：</b>'+esc(r.quantity)+'</p><p><b>應收金額：</b>NT$ '+Number(r.total_amount||0).toLocaleString("zh-TW")+'</p><p><b>匯款末五碼：</b>'+esc(last5)+'</p><p><b>備註：</b>'+esc(memo||"未填寫")+'</p><p>請至美遊記後台核帳確認，切勿僅憑回報認定已收款。</p></div>';
    const mr=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({from:"美遊記 NICE TRIP <registration@send.nicetrip.tw>",to:["rodney.xinzhan@gmail.com"],subject:"【美遊記待查帳】"+r.event_title+"｜末5碼 "+last5,html})});
    if(!mr.ok)console.error("transfer_link_admin_notification_failed",mr.status);
   }
  }catch(err){console.error("transfer_link_admin_notification_failed",String(err))}
  // TODO: add server-side rate limiting and audit monitoring before production.
  return reply({ok:true,status:"transfer_reported"},200,h);
 }catch(e){console.error("transfer_link_error",e);return reply({ok:false,error:"invalid_request"},400,h)}
});
