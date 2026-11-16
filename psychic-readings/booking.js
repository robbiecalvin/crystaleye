const form=document.querySelector('#booking-form'),fields=document.querySelector('#booking-fields'),status=document.querySelector('#booking-status'),date=document.querySelector('#reading-date'),slot=document.querySelector('#reading-slot'),method=document.querySelector('#reading-method'),phone=document.querySelector('#reading-phone');
let config,widget,token='',loading=0;
const localDate=value=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Vancouver',year:'numeric',month:'2-digit',day:'2-digit'}).format(value);
function message(text,error=false){status.textContent=text;status.dataset.error=String(error);}
method.addEventListener('change',()=>{phone.hidden=method.value!=='phone';phone.required=method.value==='phone';document.querySelector('#phone-label').hidden=phone.hidden;});
async function availability(){
 const version=++loading;slot.replaceChildren(new Option('Loading times…',''));slot.disabled=true;
 try{
  const response=await fetch(`${config.api_url}/availability?date=${encodeURIComponent(date.value)}`);const data=await response.json();if(version!==loading)return;
  if(!response.ok)throw new Error(data.error||'Unable to load times.');
  slot.replaceChildren(new Option(data.slots.length?'Choose a start time':'No available times on this date',''));
  for(const iso of data.slots){const label=new Intl.DateTimeFormat('en-CA',{timeZone:config.timezone,hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(iso));slot.add(new Option(label,iso));}
  slot.disabled=!data.slots.length;
  message(data.slots.length?'Choose a time, then send your booking request.':'No times are available for this date. Try another day.');
 }catch(error){if(version===loading){slot.replaceChildren(new Option('Unable to load times',''));message(error.message,true);}}
}
date.addEventListener('change',availability);
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!form.reportValidity()||!slot.value)return;
 if(!token){message('Please complete the verification.',true);return;}
 fields.disabled=true;message('Saving your appointment request…');
 try{
  const response=await fetch(config.api_url+'/bookings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({starts_at:slot.value,method:method.value,name:document.querySelector('#reading-name').value,email:document.querySelector('#reading-email').value,phone:phone.value,consent:document.querySelector('#reading-consent').checked,verification:token})});
  const data=await response.json();if(!response.ok)throw new Error(data.error||'Unable to save your request.');
  const when=new Intl.DateTimeFormat('en-CA',{timeZone:config.timezone,dateStyle:'full',timeStyle:'short'}).format(new Date(data.starts_at));
  message(`Request received for ${when} (Vancouver time). Reference: ${data.id}. ${data.message}`);fields.hidden=true;
 }catch(error){fields.disabled=false;message(error.message,true);token='';window.turnstile?.reset(widget);}
});
try{
 config=await fetch('config.json').then(r=>{if(!r.ok)throw new Error();return r.json();});
 if(!config.api_url||!config.turnstile_site_key){message('Online booking is being set up. Sessions are $29.99 CAD for 30 minutes by video or phone, with at least 24 hours’ notice. Appointment requests are not open yet.');}
 else{
  const api=new URL(config.api_url);if(api.protocol!=='https:')throw new Error();config.api_url=config.api_url.replace(/\/$/,'');
  date.min=localDate(Date.now()+86400000);date.max=localDate(Date.now()+config.booking_horizon_days*86400000);date.value=date.min;
  window.crystalEyeBookingReady=()=>{widget=window.turnstile.render('#booking-verification',{sitekey:config.turnstile_site_key,action:'booking',callback:value=>{token=value;},'expired-callback':()=>{token='';},'error-callback':()=>{token='';message('Verification could not load. Please try again.',true);}});fields.disabled=false;availability();};
  const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=crystalEyeBookingReady&render=explicit';script.async=true;script.onerror=()=>message('Booking verification could not load. Please refresh to try again.',true);document.head.append(script);
 }
}catch{message('Booking is temporarily unavailable. Please check back soon.',true);}
