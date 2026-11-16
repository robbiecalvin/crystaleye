import {getClient,accountURL,currentUser,saveReading} from './client.mjs';
import {profileInput,signSlugs,astrologySnapshot,subscriptionLabel} from './model.mjs';
import {readingFor,localDate} from '../astrology/reading-engine.mjs';
const $=id=>document.getElementById(id);
const status=$('account-status');let client,user,epoch=0,filter='all',offset=0,rows=[],busy=false,readingLoadEpoch=-1;
const notice=(target,text,error=false)=>{target.textContent=text;target.dataset.error=String(error);};
const text=(tag,value,className)=>{const node=document.createElement(tag);node.textContent=value;if(className)node.className=className;return node;};
function clearPrivate(){user=null;rows=[];offset=0;$('dashboard').hidden=true;$('login-panel').hidden=false;$('profile-form').reset();$('signed-in-email').textContent='';$('saved-readings').replaceChildren();$('subscription-list').replaceChildren();for(const id of ['profile-status','saved-status','subscription-status','today-status'])$(id).textContent='';}
for(const role of ['sun','moon','rising'])for(const slug of signSlugs)$( `profile-${role}`).add(new Option(slug[0].toUpperCase()+slug.slice(1),slug));
function renderReadings(){
 const container=$('saved-readings');container.replaceChildren();
 for(const row of rows){
  if(filter!=='all'&&row.kind!==filter)continue;
  const article=text('article','','saved-reading');article.append(text('h3',row.title));
  const created=new Date(row.created_at);if(Number.isFinite(created.getTime())){const time=text('time',created.toLocaleString());time.dateTime=created.toISOString();article.append(time);}
  const details=document.createElement('details');details.append(text('summary','Read saved reflection'));
  const payload=row.payload||{};
  if(row.kind==='numerology'&&Array.isArray(payload.numbers)){
   for(const n of payload.numbers){details.append(text('h4',`${n.label} · ${n.value===0?'—':n.value}`),text('p',n.summary||''));
    if(['personality','life-path','destiny'].includes(n.slug)&&[1,2,3,4,5,6,7,8,9,11,22,33].includes(n.value)){const link=text('a','Read number profile →','text-link');link.href=new URL(`../numerology/${n.slug}/number-${n.value}/`,import.meta.url).href;details.append(link);}}
   if(Array.isArray(payload.chart))for(const n of payload.chart)details.append(text('h4',`${n.label} · ${n.value}`));
   details.append(text('p',payload.convention||'','fine-print'));
  }else if(row.kind==='astrology'&&Array.isArray(payload.paragraphs)){
   details.append(text('p',`${payload.date||''} · ${payload.source||'Saved astrology reflection'}`,'fine-print'));
   for(const p of payload.paragraphs)details.append(text('h4',`${p.role} · ${p.sign}`),text('p',p.text));
  }else details.append(text('p','This saved reading uses a different format.'));
  article.append(details);const remove=text('button','Delete saved reading','reading-delete');remove.type='button';
  remove.addEventListener('click',async()=>{if(!user)return;const current=epoch;remove.disabled=true;notice($('saved-status'),'Removing reading…');const {error}=await client.from('crystaleye_saved_readings').delete().eq('id',row.id).eq('user_id',user.id);if(current!==epoch)return;if(error){remove.disabled=false;notice($('saved-status'),'Could not remove this reading. Please try again.',true);return;}rows=rows.filter(r=>r.id!==row.id);offset=Math.max(0,offset-1);renderReadings();notice($('saved-status'),'Reading removed.');});
  article.append(remove);container.append(article);
 }
 if(!container.children.length)container.append(text('p',filter==='all'?'No readings saved yet. Start with your numbers or an astrology preview.':'No loaded readings in this category.','fine-print'));
}
async function loadReadings(reset=false){
 if(!user||readingLoadEpoch===epoch)return;readingLoadEpoch=epoch;const current=epoch;const owner=user.id;
 $('load-more').disabled=true;notice($('saved-status'),'Loading saved readings…');
 try{
  if(reset){rows=[];offset=0;}
  const {data,error}=await client.from('crystaleye_saved_readings').select('id,kind,title,payload,created_at').eq('user_id',owner).order('created_at',{ascending:false}).order('id',{ascending:false}).range(offset,offset+49);
  if(current!==epoch)return;if(error)throw error;
  rows.push(...data);offset+=data.length;renderReadings();$('load-more').hidden=data.length<50;notice($('saved-status'),`${rows.length} saved reading${rows.length===1?'':'s'} loaded.`);
 }catch{if(current===epoch){notice($('saved-status'),'Could not load readings. Please try again.',true);$('load-more').hidden=false;}}
 finally{if(readingLoadEpoch===current)readingLoadEpoch=-1;$('load-more').disabled=false;}
}
async function loadSubscriptions(current){
 const {data,error}=await client.from('crystaleye_subscriptions').select('plan,status,current_period_end,cancel_at_period_end').eq('user_id',user.id);
 if(current!==epoch)return;
 if(error){notice($('subscription-status'),'Unable to verify subscription status. Please try signing in again.',true);return;}
 $('subscription-list').replaceChildren();
 for(const [plan,title] of [['tarot','Daily Three-Card Tarot'],['astrology','Daily Astrology Email']]){
  const row=data.find(item=>item.plan===plan);const card=text('article','','subscription-summary');card.append(text('h3',title),text('strong',subscriptionLabel(row)));
  if(row?.current_period_end){const date=new Date(row.current_period_end);if(Number.isFinite(date.getTime()))card.append(text('p',`Billing period ends ${date.toLocaleDateString()}.`,'fine-print'));}
  const link=text('a',plan==='tarot'?'Explore tarot →':'Explore astrology →','text-link');link.href=new URL(`../${plan==='tarot'?'tarot':'astrology'}/`,import.meta.url).href;card.append(link);$('subscription-list').append(card);
 }
 notice($('subscription-status'),'Billing status loaded. Signing in alone does not activate a plan.');
}
async function refresh(){
 const current=++epoch;clearPrivate();notice(status,'Checking your account…');
 try{
  const found=await currentUser(client);if(current!==epoch)return;
  if(!found){notice(status,'Sign in to save and revisit your readings.');return;}
  user=found;$('login-panel').hidden=true;$('dashboard').hidden=false;$('signed-in-email').textContent=user.email||'';notice(status,'You’re signed in. Saved readings are private to your account.');
  const {data,error}=await client.from('crystaleye_profiles').select('display_name,sun,moon,rising').eq('user_id',user.id).maybeSingle();if(current!==epoch)return;
  if(error)notice($('profile-status'),'Could not load your profile. Please retry signing in.',true);
  else if(data){$('display-name').value=data.display_name;for(const role of ['sun','moon','rising'])$(`profile-${role}`).value=data[role]||'';}
  $('welcome-title').textContent=data?.display_name?`Welcome back, ${data.display_name}.`:'Welcome to your space.';
  await Promise.all([loadReadings(true),loadSubscriptions(current)]);
 }catch{if(current===epoch)notice(status,'Unable to connect to your account. Please refresh and try again.',true);}
}
$('login-form').addEventListener('submit',async event=>{
 event.preventDefault();if(!client||!$('login-form').reportValidity())return;
 $('login-fields').disabled=true;notice($('login-status'),'Sending your sign-in link…');
 try{const {error}=await client.auth.signInWithOtp({email:$('login-email').value.trim(),options:{emailRedirectTo:accountURL,shouldCreateUser:true}});if(error)throw error;notice($('login-status'),'Check your email for a sign-in link. Open it in this browser. If it doesn’t arrive, check spam or try again in a minute.');}
 catch{notice($('login-status'),'The email could not be sent. Check the address and try again in a minute.',true);}
 finally{setTimeout(()=>{$('login-fields').disabled=false;},60000);}
});
$('sign-out').addEventListener('click',async()=>{
 $('sign-out').disabled=true;
 try{const {error}=await client.auth.signOut();if(error)throw error;++epoch;clearPrivate();notice(status,'You’re signed out.');}
 catch{notice(status,'Sign-out did not complete. Check your connection and try again.',true);}
 finally{$('sign-out').disabled=false;}
});
$('profile-form').addEventListener('submit',async event=>{
 event.preventDefault();if(!user||busy)return;busy=true;const current=epoch;const button=$('profile-form').querySelector('button');button.disabled=true;
 try{const profile=profileInput($('display-name').value,Object.fromEntries(['sun','moon','rising'].map(role=>[role,$(`profile-${role}`).value])));const {error}=await client.from('crystaleye_profiles').upsert({...profile,user_id:user.id,updated_at:new Date().toISOString()});if(error)throw new Error('Could not save your profile. Please try again.');if(current===epoch){notice($('profile-status'),'Profile saved.');$('welcome-title').textContent=profile.display_name?`Welcome back, ${profile.display_name}.`:'Welcome to your space.';}}
 catch(error){if(current===epoch)notice($('profile-status'),error.message,true);}
 finally{busy=false;button.disabled=false;}
});
$('save-today').addEventListener('click',async()=>{
 const button=$('save-today'),current=epoch;button.disabled=true;
 try{const placements=Object.fromEntries(['sun','moon','rising'].map(role=>[role,$(`profile-${role}`).value]));await saveReading(astrologySnapshot(placements,localDate(),readingFor));if(current===epoch){notice($('today-status'),'Today’s astrology reflection is saved. Save your profile separately to keep these sign choices.');await loadReadings(true);}}
 catch(error){if(current===epoch)notice($('today-status'),error.message,true);}finally{button.disabled=false;}
});
$('load-more').addEventListener('click',()=>loadReadings());
for(const button of document.querySelectorAll('[data-reading-filter]'))button.addEventListener('click',()=>{filter=button.dataset.readingFilter;for(const other of document.querySelectorAll('[data-reading-filter]'))other.setAttribute('aria-pressed',String(other===button));renderReadings();});
try{
 client=await getClient();
 if(!client)notice(status,'Customer accounts are being connected. Sign-in and saving are not open yet. Your public calculators and readings still work.');
 else{
  $('login-fields').disabled=false;
  client.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN'&&session?.user?.id===user?.id)return;if(['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event))setTimeout(refresh,0);});
  await refresh();
  if(new URLSearchParams(location.search).has('error')||new URLSearchParams(location.hash.slice(1)).has('error')){notice(status,'Your sign-in link could not be used. Request a new link below.',true);history.replaceState({},'',new URL('./',import.meta.url).pathname);}
 }
}catch{notice(status,'Accounts are temporarily unavailable. Please try again later.',true);}
// Re-check private data when the browser restores a previous dashboard page.
window.addEventListener('pageshow',event=>{if(event.persisted&&client)refresh();});
