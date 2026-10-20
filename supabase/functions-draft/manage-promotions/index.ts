// STAGING DRAFT ONLY — do not deploy before isolated integration tests and owner approval.
// ADMIN_USER_IDS is a comma-separated list of Supabase Auth user UUIDs, set as an Edge Function secret.
// SUPABASE_SECRET_KEYS must contain the service-role key under "default".
import { createClient } from "npm:@supabase/supabase-js@2";
const origins=new Set(["https://nicetrip.tw","https://www.nicetrip.tw","https://qqsun1112-sys.github.io"]);
const cors=(origin:string|null)=>({"Access-Control-Allow-Origin":origin&&origins.has(origin)?origin:"https://nicetrip.tw","Access-Control-Allow-Headers":"authorization, apikey, content-type","Access-Control-Allow-Methods":"GET, POST, PATCH, OPTIONS","Content-Type":"application/json","Vary":"Origin"});
const fail=(error:string,status:number,h:Record<string,string>)=>Response.json({ok:false,error},{status,headers:h});
const isRecord=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==="object"&&!Array.isArray(x);
Deno.serve(async(req)=>{
 const origin=req.headers.get("origin"),h=cors(origin);
 if(req.method==="OPTIONS")return new Response("ok",{headers:h});
 if(!["GET","POST","PATCH"].includes(req.method)||(origin&&!origins.has(origin)))return fail("forbidden",403,h);
 const url=Deno.env.get("SUPABASE_URL"),publishable=Deno.env.get("SUPABASE_ANON_KEY");
 let keys:Record<string,string>={};
 try{keys=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}")}catch{return fail("admin_not_configured",503,h)}
 const secret=keys.default;
 const allowed=new Set((Deno.env.get("ADMIN_USER_IDS")||"").split(",").map(x=>x.trim()).filter(Boolean));
 if(!url||!publishable||!secret||!allowed.size)return fail("admin_not_configured",503,h);
 const bearer=/^Bearer (.+)$/i.exec(req.headers.get("authorization")||"");
 if(!bearer)return fail("unauthorized",401,h);
 const auth=createClient(url,publishable,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:identity,error:authError}=await auth.auth.getUser(bearer[1]);
 const userId=identity?.user?.id;
 if(authError||!userId)return fail("unauthorized",401,h);
 if(!allowed.has(userId))return fail("forbidden",403,h);
 const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 try{
  if(req.method==="GET"){
   const {data,error}=await admin.from("promotion_campaigns").select("id,code,title,discount_per_person,starts_at,ends_at,enabled,service,eligible_event_slugs,updated_at").order("created_at",{ascending:false}).limit(100);
   if(error)throw error;
   return Response.json({ok:true,campaigns:data},{headers:h});
  }
  const body=await req.json().catch(()=>null);
  if(!isRecord(body))return fail("invalid_body",400,h);
  const action=req.method==="POST"?"create":"update";
  const id=Number(body.id);
  if(action==="update"&&(!Number.isSafeInteger(id)||id<=0))return fail("invalid_id",400,h);
  let previous:Record<string,unknown>|null=null;
  if(action==="update"){
   const {data,error}=await admin.from("promotion_campaigns").select("*").eq("id",id).single();
   if(error||!data)return fail("not_found",404,h);
   previous=data;
  }
  const code=String(body.code??previous?.code??"").trim().toUpperCase();
  const title=String(body.title??previous?.title??"").trim();
  const amount=Number(body.discount_per_person??previous?.discount_per_person);
  const starts=String(body.starts_at??previous?.starts_at??"");
  const ends=String(body.ends_at??previous?.ends_at??"");
  const service=String(body.service??previous?.service??"city");
  const slugs=body.eligible_event_slugs??previous?.eligible_event_slugs;
  const enabled=body.enabled??previous?.enabled??false;
  if(!/^[A-Z0-9_-]{3,32}$/.test(code)||!title||title.length>120||!Number.isSafeInteger(amount)||amount<1||amount>100000||!Number.isFinite(Date.parse(starts))||!Number.isFinite(Date.parse(ends))||Date.parse(ends)<=Date.parse(starts)||service!=="city"||typeof enabled!=="boolean"||!Array.isArray(slugs)||!slugs.length||slugs.length>100||slugs.some(x=>typeof x!=="string"||!x.trim()||x.length>160)||new Set(slugs).size!==slugs.length)return fail("invalid_campaign",400,h);
  // Check every selected activity exists and belongs to the designated service.
  const {data:events,error:eventError}=await admin.from("site_activities").select("slug,service").in("slug",slugs);
  if(eventError||!events||events.length!==slugs.length||events.some(x=>x.service!==service))return fail("invalid_event_scope",400,h);
  const payload={code,title,discount_per_person:amount,starts_at:starts,ends_at:ends,enabled,service,eligible_event_slugs:slugs,updated_at:new Date().toISOString()};
  const result=await admin.rpc("manage_promotion_campaign_atomic",{p_actor:userId,p_campaign:payload,p_id:action==="create"?null:id});
  if(result.error||!result.data)throw result.error||Error("write_failed");
  return Response.json({ok:true,campaign:result.data},{headers:h});
 }catch(e){console.error("manage_promotions_error",e);return fail("management_failed",500,h)}
});
