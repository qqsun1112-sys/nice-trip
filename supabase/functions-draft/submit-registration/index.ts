// STAGING DRAFT ONLY. DO NOT DEPLOY. Requires database migration and updated atomic RPC.
import { createClient } from "npm:@supabase/supabase-js@2";
const allowed=new Set(["https://qqsun1112-sys.github.io","https://nicetrip.tw","https://www.nicetrip.tw","https://nice-trip.tw","https://www.nice-trip.tw"]);
const hs=(o:string|null)=>({"Access-Control-Allow-Origin":o&&allowed.has(o)?o:"https://qqsun1112-sys.github.io","Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json","Vary":"Origin"});
const esc=(v:any)=>String(v??"").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
const money=(n:any)=>new Intl.NumberFormat("zh-TW").format(Number(n)||0);
async function sendMail(apiKey:string,to:string,subject:string,html:string){
 const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json"},body:JSON.stringify({from:"美遊記 NICE TRIP <registration@send.nicetrip.tw>",to:[to],subject,html,reply_to:"rodney.xinzhan@gmail.com"})});
 const j=await r.json().catch(()=>({})); if(!r.ok) throw new Error("resend_"+r.status+":"+JSON.stringify(j)); return j;
}
Deno.serve(async(req)=>{
 const o=req.headers.get("origin"); if(req.method==="OPTIONS") return new Response("ok",{headers:hs(o)});
 if(req.method!=="POST"||(o&&!allowed.has(o))) return Response.json({ok:false},{status:403,headers:hs(o)});
 try{
  const b=await req.json(), email=String(b.email??"").trim().toLowerCase(), phone=String(b.phone??"").trim(), nid=String(b.national_id??"").trim().toUpperCase();
  const required=["event_slug","full_name","phone","email","ticket_code"]; if(required.some(k=>!String(b[k]??"").trim())) return Response.json({ok:false,error:"missing_fields"},{status:400,headers:hs(o)});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ok:false,error:"invalid_email"},{status:400,headers:hs(o)});
  if(phone.length<8||phone.length>30) return Response.json({ok:false,error:"invalid_phone"},{status:400,headers:hs(o)});
  const keys=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}"),admin=createClient(Deno.env.get("SUPABASE_URL")!,keys.default);
  const {data:a,error:ae}=await admin.from("site_activities").select("slug,title,event_date,status,published,ticket_options,capacity,max_per_registration,registration_deadline,service,welcome50_enabled").eq("slug",String(b.event_slug)).single();
  if(ae||!a||!a.published||a.status!=="open"||!a.event_date)return Response.json({ok:false,error:"event_not_open"},{status:400,headers:hs(o)});
  if(a.registration_deadline&&Date.now()>=new Date(a.registration_deadline).getTime())return Response.json({ok:false,error:"registration_closed"},{status:400,headers:hs(o)});
  const qty=Number(b.quantity); if(!Number.isSafeInteger(qty)||qty<1||qty>20)return Response.json({ok:false,error:"invalid_quantity"},{status:400,headers:hs(o)}); if(a.max_per_registration&&qty>Number(a.max_per_registration)) return Response.json({ok:false,error:"quantity_limit"},{status:400,headers:hs(o)});
  const code=String(b.ticket_code), opts=Array.isArray(a.ticket_options)?a.ticket_options:[],t=opts.find((x:any)=>x&&x.active!==false&&String(x.code)===code);
  if(!t)return Response.json({ok:false,error:"invalid_ticket"},{status:400,headers:hs(o)});
  if(qty<Number(t.min_qty||1)||(t.max_qty&&qty>Number(t.max_qty)))return Response.json({ok:false,error:"ticket_quantity_mismatch"},{status:400,headers:hs(o)});
  if(t.deadline_days_before){const cutoff=new Date(a.event_date+"T00:00:00+08:00");cutoff.setDate(cutoff.getDate()-Number(t.deadline_days_before));if(new Date()>cutoff)return Response.json({ok:false,error:"ticket_expired"},{status:400,headers:hs(o)})}
  const unit=Number(t.unit_price); if(!Number.isSafeInteger(unit)||unit<0)return Response.json({ok:false,error:"invalid_ticket_price"},{status:400,headers:hs(o)});
  const gross=unit*qty,coupon=String(b.promotion_code??"").trim().toUpperCase(),requested=coupon!=="";
  const now=Date.now(),eligible=a.service==="city"&&a.welcome50_enabled===true&&t.other_coupon_applied!==true&&unit>0&&now>=Date.parse("2026-10-20T00:00:00+08:00")&&now<=Date.parse("2026-12-31T23:59:59+08:00");
  if(requested&&(coupon!=="WELCOME50"||!eligible))return Response.json({ok:false,error:coupon!=="WELCOME50"?"coupon_invalid_code":"coupon_not_eligible"},{status:400,headers:hs(o)});
  const promotionDiscount=requested?Math.min(50,unit)*qty:0,total=gross-promotionDiscount;
  const row={event_slug:a.slug,event_title:a.title,event_date:a.event_date,full_name:String(b.full_name).trim().slice(0,80),phone:phone.slice(0,30),email,birth_date:b.insurance_opt_out?null:b.birth_date,national_id:b.insurance_opt_out?null:nid.slice(0,20),insurance_opt_out:Boolean(b.insurance_opt_out),ticket_type:String(t.label||code).slice(0,100),ticket_code:code,unit_price:unit,total_amount:total,quantity:qty,...(requested?{promotion_code:"WELCOME50",promotion_discount:promotionDiscount,original_total:gross}:{}),tax_id:String(b.tax_id??"").trim().slice(0,20)||null,note:String(b.note??"").trim().slice(0,1000)||null,transfer_last5:/^[0-9]{5}$/.test(String(b.transfer_last5??""))?String(b.transfer_last5):null,status:total===0?"confirmed_free":(/^[0-9]{5}$/.test(String(b.transfer_last5??""))? "transfer_reported":"pending_transfer")};
  if(!row.insurance_opt_out&&(!row.birth_date||!row.national_id))return Response.json({ok:false,error:"insurance_fields_required"},{status:400,headers:hs(o)});
  const {data,error}=await admin.rpc("create_registration_atomic",{p_row:row});
  if(error){const msg=String(error.message||"");if(msg.includes("event_full"))return Response.json({ok:false,error:"event_full"},{status:409,headers:hs(o)});if(msg.includes("event_not_open"))return Response.json({ok:false,error:"event_not_open"},{status:400,headers:hs(o)});if(msg.includes("coupon_not_eligible"))return Response.json({ok:false,error:"coupon_not_eligible"},{status:400,headers:hs(o)});if(msg.includes("coupon_ticket_mismatch"))return Response.json({ok:false,error:"coupon_ticket_mismatch"},{status:409,headers:hs(o)});if(msg.includes("coupon_status_mismatch"))return Response.json({ok:false,error:"coupon_status_mismatch"},{status:409,headers:hs(o)});if(msg.includes("amount_mismatch"))return Response.json({ok:false,error:"amount_mismatch"},{status:409,headers:hs(o)});if(msg.includes("quantity_limit"))return Response.json({ok:false,error:"quantity_limit"},{status:400,headers:hs(o)});return Response.json({ok:false,error:"registration_failed"},{status:500,headers:hs(o)})}

  let email_sent=false;
  try{
   const apiKey=Deno.env.get("RESEND_API_KEY"); if(!apiKey) throw new Error("missing_resend_key");
   const free=total===0;
   const due=data.payment_due_at?new Date(data.payment_due_at).toLocaleString("zh-TW",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}):"報名後 2 日內";
   const discountSummary=requested?'<p>原價：NT$ '+money(gross)+'<br>WELCOME50 折抵：-NT$ '+money(promotionDiscount)+'<br><b>優惠後應付：NT$ '+money(total)+'</b></p>':'';
   const common='<p>您好，'+esc(row.full_name)+'：</p><p>感謝您報名美遊記活動。</p><table style="border-collapse:collapse;line-height:1.8"><tr><td><b>活動</b></td><td style="padding-left:16px">'+esc(a.title)+'</td></tr><tr><td><b>日期</b></td><td style="padding-left:16px">'+esc(a.event_date)+'</td></tr><tr><td><b>報名編號</b></td><td style="padding-left:16px">'+esc(data.registration_no)+'</td></tr><tr><td><b>票種</b></td><td style="padding-left:16px">'+esc(data.ticket_type)+'</td></tr><tr><td><b>人數</b></td><td style="padding-left:16px">'+esc(data.quantity)+'</td></tr></table><div style="background:#f4f7f5;padding:14px 16px;border-radius:10px;margin:16px 0"><p style="margin:0 0 6px"><b>取消驗證碼：</b>'+esc(data.cancel_token)+'</p><p style="margin:0;color:#666">如需取消報名，請點選 <a href="'+ 'https://nicetrip.tw/cancel-booking.html#no=' + encodeURIComponent(data.registration_no) + '&amp;token=' + encodeURIComponent(data.cancel_token) + '">取消這筆報名</a>。點選後仍需確認。</p></div>';
   const html=free?'<div style="font-family:Arial,\'Noto Sans TC\',sans-serif;color:#333;max-width:640px">'+common+'<h2 style="color:#2f6b52">報名成功</h2><p>'+(requested?'本次報名已由 WELCOME50 優惠全額折抵，無需匯款。':'本活動為公益免費活動，無需匯款。')+discountSummary+'您的報名已完成，期待活動當天與您見面。</p><p style="color:#666">如需取消，請使用本信所列的報名編號與取消驗證碼辦理。</p><p>美遊記 NICE TRIP</p></div>':'<div style="font-family:Arial,\'Noto Sans TC\',sans-serif;color:#333;max-width:640px">'+common+'<h2 style="color:#9a5b2b">已收到報名資料｜尚未完成報名</h2><p>應付金額：<b>NT$ '+money(total)+'</b></p>'+discountSummary+'<p>請於 <b>'+esc(due)+'</b> 前完成匯款，並回報帳號末五碼。完成匯款後仍須經美遊記查核確認，才算正式完成報名。</p><div style="background:#f7f3ea;padding:16px 18px;border-radius:10px;margin:16px 0"><p style="margin:0 0 8px"><b>匯款帳戶</b></p><p style="margin:4px 0">戶名：薪展新創文化有限公司</p><p style="margin:4px 0">銀行：中國信託銀行</p><p style="margin:4px 0">帳號：071540380455</p></div><p>匯款完成後，請依報名頁指示回報帳號末五碼；請勿提供銀行密碼或其他敏感資料。</p><p style="color:#666">逾期未完成匯款，名額將可釋出予其他參加者。</p><p>美遊記 NICE TRIP</p></div>';
   const sent=await sendMail(apiKey,email,free?"美遊記｜活動報名成功":"美遊記｜已收到活動報名資料（尚未完成報名）",html);
   try{
    const adminHtml='<div style="font-family:Arial,\'Noto Sans TC\',sans-serif;color:#333;max-width:640px"><h2 style="color:#9a5b2b">新活動報名通知</h2><p><b>活動：</b>'+esc(a.title)+'</p><p><b>日期：</b>'+esc(a.event_date)+'</p><p><b>報名編號：</b>'+esc(data.registration_no)+'</p><p><b>姓名：</b>'+esc(row.full_name)+'</p><p><b>票種：</b>'+esc(data.ticket_type)+'</p><p><b>人數：</b>'+esc(data.quantity)+'</p><p><b>金額：</b>NT$ '+money(total)+'</p>'+discountSummary+'<p><b>狀態：</b>'+(free?(requested?'優惠折抵後免匯款':'免費報名已成立'):(row.transfer_last5?'已填匯款末五碼，待查核':'待匯款'))+'</p><p><b>Email：</b>'+esc(email)+'</p><p><b>電話：</b>'+esc(phone)+'</p></div>';
    await sendMail(apiKey,"rodney.xinzhan@gmail.com","【美遊記新報名】"+a.title+"｜"+row.full_name+"｜"+data.quantity+"人",adminHtml);
   }catch(adminMailError){console.error("admin_notification_failed",adminMailError)}

   email_sent=true;
   await admin.from("registration_notifications").update({status:"sent",sent_at:new Date().toISOString(),payload:{resend_id:sent.id||null}}).eq("registration_no",data.registration_no).eq("notification_type",free?"free_confirmed":"payment_pending").eq("status","pending");
  }catch(e){
   await admin.from("registration_notifications").update({status:"failed",payload:{error:String(e).slice(0,500)}}).eq("registration_no",data.registration_no).eq("status","pending");
  }
  return Response.json({ok:true,...data,email_sent},{status:201,headers:hs(o)});
 }catch{return Response.json({ok:false,error:"invalid_request"},{status:400,headers:hs(o)})}
});