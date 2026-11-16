const HALF_HOUR=1800000, NOTICE=86400000, HORIZON=30*NOTICE;
const cors=origin=>({'Access-Control-Allow-Origin':origin,'Vary':'Origin','Content-Type':'application/json','Cache-Control':'no-store'});
export function validSlot(start,now=Date.now()) { const n=Date.parse(start);return Number.isFinite(n)&&n%HALF_HOUR===0&&n>=now+NOTICE&&n<=now+HORIZON; }
export function validateBooking(body,now=Date.now()) {
 if(!body||!['video','phone'].includes(body.method)||!validSlot(body.starts_at,now))return 'Choose a valid appointment at least 24 hours ahead.';
 if(typeof body.name!=='string'||!body.name.trim()||body.name.length>100)return 'Enter your name.';
 if(typeof body.email!=='string'||body.email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))return 'Enter a valid email.';
 if(body.method==='phone'&&(typeof body.phone!=='string'||!/^\+?[\d\s().-]{7,40}$/.test(body.phone)))return 'Enter your phone number with country code.';
 if(body.consent!==true)return 'Please agree to be contacted about this session.';
 return null;
}
export default {async fetch(request,env){
 const origin=request.headers.get('Origin');
 const allowed=env.SITE_ORIGIN||'https://robbiecalvin.github.io';
 const headers=cors(allowed);
 const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(origin&&origin!==allowed)return reply({error:'Origin not allowed.'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
 if(!env.DB||!env.TURNSTILE_SECRET)return reply({error:'Booking is not open yet.'},503);
 const url=new URL(request.url);
 try{
 if(url.pathname==='/availability'&&request.method==='GET'){
  const date=url.searchParams.get('date');if(!/^\d{4}-\d{2}-\d{2}$/.test(date||''))return reply({error:'Choose a date.'},400);
  const now=Date.now(),first=Math.ceil((now+NOTICE)/HALF_HOUR)*HALF_HOUR;
  const {results}=await env.DB.prepare("SELECT starts_at FROM appointments WHERE status IN ('requested','confirmed') AND starts_at >= ? AND starts_at <= ?").bind(new Date(first).toISOString(),new Date(now+HORIZON).toISOString()).all();
  const busy=new Set(results.map(r=>r.starts_at));const slots=[];
  const fmt=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Vancouver',year:'numeric',month:'2-digit',day:'2-digit'});
  for(let t=first;t<=now+HORIZON;t+=HALF_HOUR){const iso=new Date(t).toISOString();if(fmt.format(t)===date&&!busy.has(iso))slots.push(iso);}
  return reply({slots,timezone:'America/Vancouver',duration_minutes:30,price:'29.99',currency:'CAD'});
 }
 if(url.pathname==='/bookings'&&request.method==='POST'){
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return reply({error:'Expected JSON.'},415);
  const raw=await request.text();if(raw.length>4096)return reply({error:'Request is too large.'},413);
  let body;try{body=JSON.parse(raw);}catch{return reply({error:'Invalid request.'},400);}
  const error=validateBooking(body);if(error)return reply({error},400);
  if(typeof body.verification!=='string'||body.verification.length>2048)return reply({error:'Complete the verification.'},400);
  const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:body.verification,remoteip:request.headers.get('CF-Connecting-IP')||''})}).then(r=>r.json());
  if(!verification.success||verification.hostname!==new URL(allowed).hostname||verification.action!=='booking')return reply({error:'Verification expired. Please try again.'},400);
  const email=body.email.trim().toLowerCase();
  const recent=await env.DB.prepare("SELECT COUNT(*) AS n FROM appointments WHERE email = ? AND created_at > ? AND status IN ('requested','confirmed')").bind(email,new Date(Date.now()-NOTICE).toISOString()).first();
  if(recent.n>=3)return reply({error:'You already have several recent requests. Please wait for a reply.'},429);
  const id=crypto.randomUUID(),start=new Date(body.starts_at).toISOString();
  try{await env.DB.prepare("INSERT INTO appointments (id, starts_at, name, email, method, phone, status, created_at, consent_at) VALUES (?, ?, ?, ?, ?, ?, 'requested', ?, ?)").bind(id,start,body.name.trim(),email,body.method,body.method==='phone'?body.phone.trim():null,new Date().toISOString(),new Date().toISOString()).run();}
  catch(e){if(/UNIQUE constraint failed/.test(String(e)))return reply({error:'That time has just been taken. Please choose another.'},409);throw e;}
  return reply({id,starts_at:start,status:'requested',message:'Your request is saved. Robbie will contact you to confirm your session and arrange the call. No payment has been taken.'},201);
 }
 return reply({error:'Not found.'},404);
 }catch{return reply({error:'Booking is temporarily unavailable. Please try again later.'},503);}
}};
