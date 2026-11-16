import {createClient} from './vendor/supabase.mjs';
import {validateSnapshot} from './model.mjs';
let promise;
export const accountURL=new URL('./',import.meta.url).href;
export function configured(config){
 if(config.enabled===false||!config.supabase_url||!config.publishable_key)return false;
 const url=new URL(config.supabase_url);
 if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw new Error('Account connection is not configured correctly.');
 const key=config.publishable_key;
 if(key.startsWith('sb_secret_'))throw new Error('A secret key cannot be used in the browser.');
 if(key.startsWith('eyJ')){try{const payload=JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));if(payload.role!=='anon')throw new Error();}catch{throw new Error('A public publishable or anon key is required.');}}
 else if(!key.startsWith('sb_publishable_'))throw new Error('A public publishable or anon key is required.');
 return true;
}
export function getClient(){
 if(!promise)promise=(async()=>{const response=await fetch(new URL('./config.json',import.meta.url),{cache:'no-store'});if(!response.ok)throw new Error('Unable to load account settings.');const config=await response.json();if(!configured(config))return null;
 return createClient(config.supabase_url,config.publishable_key,{auth:{flowType:'pkce',detectSessionInUrl:true,persistSession:true,autoRefreshToken:true,storageKey:'crystaleye-auth'}});})();
 return promise;
}
export async function currentUser(client){const {data,error}=await client.auth.getUser();if(error||!data?.user)return null;return data.user;}
export async function saveReading(snapshot,id=crypto.randomUUID()){
 validateSnapshot(snapshot);const client=await getClient();if(!client)throw new Error('Account saving is being connected. Please try again later.');
 const user=await currentUser(client);if(!user)throw new Error('Sign in to your account before saving.');
 const row={id,user_id:user.id,kind:snapshot.kind,title:snapshot.title,payload:snapshot.payload};
 const {error}=await client.from('crystaleye_saved_readings').upsert(row,{onConflict:'id',ignoreDuplicates:true});if(error)throw new Error('Could not save this reading. Please check your connection and try again.');return id;
}
export function readingSaveControl(snapshot){
 const wrap=document.createElement('div');wrap.className='account-save';
 const button=document.createElement('button');button.type='button';button.className='button button-outline';button.textContent='Save to my account';
 const link=document.createElement('a');link.href=accountURL;link.textContent='My account (new tab) →';link.target='_blank';link.rel='noopener';
 const status=document.createElement('p');status.className='fine-print';status.setAttribute('role','status');status.textContent='Only this reading is saved when you choose. Birth names and dates are not included.';
 const id=crypto.randomUUID();
 button.addEventListener('click',async()=>{button.disabled=true;status.textContent='Saving…';try{await saveReading(snapshot,id);status.textContent='Saved to your private account.';button.textContent='Saved';}catch(error){status.textContent=error.message;button.disabled=false;}});
 wrap.append(button,link,status);return wrap;
}
