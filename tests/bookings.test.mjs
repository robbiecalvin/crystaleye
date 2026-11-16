import test from 'node:test';
import assert from 'node:assert/strict';
import worker,{validSlot,validateBooking} from '../booking-service/src/worker.mjs';
const now=Date.parse('2026-11-16T10:00:00Z');
const booking={starts_at:'2026-11-17T10:00:00Z',name:'Example Client',email:'client@example.com',method:'video',consent:true,verification:'token'};
test('24-hour notice, half-hour boundaries and maximum booking horizon are enforced',()=>{
 assert.ok(validSlot(booking.starts_at,now));
 for(const slot of ['bad','2026-11-17T09:30:00Z','2026-11-17T10:01:00Z','2027-01-01T00:00:00Z'])assert.equal(validSlot(slot,now),false);
 assert.equal(validateBooking(booking,now),null);
 assert.ok(validateBooking({...booking,method:'phone'},now));
 assert.equal(validateBooking({...booking,method:'phone',phone:'+1 604 555 0100'},now),null);
 assert.ok(validateBooking({...booking,consent:false},now));
 assert.ok(validateBooking({...booking,email:'invalid'},now));
});
test('availability uses Vancouver date through spring-forward and fall-back',async()=>{
 const oldNow=Date.now;const env={DB:{prepare:()=>({bind:()=>({all:async()=>({results:[]})})})},TURNSTILE_SECRET:'test',SITE_ORIGIN:'https://robbiecalvin.github.io'};
 try{
  for(const [date,current,count] of [['2025-03-09','2025-03-07T00:00:00Z',46],['2025-11-02','2025-10-31T00:00:00Z',50]]){
   Date.now=()=>Date.parse(current);
   const res=await worker.fetch(new Request(`https://api.example/availability?date=${date}`),env);const data=await res.json();assert.equal(data.slots.length,count);assert.equal(new Set(data.slots).size,count);
  }
 }finally{Date.now=oldNow;}
});
test('booking saves a request, rejects a competing reservation, validates verification, and restricts origins',async()=>{
 const oldNow=Date.now,oldFetch=globalThis.fetch;Date.now=()=>now;
 const rows=new Set();let verified=true;
 const env={TURNSTILE_SECRET:'secret',DB:{
  prepare(sql){return {bind(...args){return {
   first:async()=>({n:0}),
   run:async()=>{assert.equal(args[4],'video');if(rows.has(args[1]))throw Error('UNIQUE constraint failed: appointments.starts_at');rows.add(args[1]);}
  };}};}
 }};
 globalThis.fetch=async()=>new Response(JSON.stringify({success:verified,hostname:'robbiecalvin.github.io',action:'booking'}));
 const req=(body=booking,origin='https://robbiecalvin.github.io')=>new Request('https://api.example/bookings',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});
 try{
  assert.equal((await worker.fetch(req(),env)).status,201);
  assert.equal((await worker.fetch(req(),env)).status,409);
  assert.equal((await worker.fetch(req(booking,'https://other.example'),env)).status,403);
  verified=false;assert.equal((await worker.fetch(req(),env)).status,400);
  assert.equal((await worker.fetch(req(),{})).status,503);
 }finally{Date.now=oldNow;globalThis.fetch=oldFetch;}
});
