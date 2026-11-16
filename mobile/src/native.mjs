import {Capacitor} from '@capacitor/core';
import {App} from '@capacitor/app';
import {Browser} from '@capacitor/browser';
import {Filesystem,Directory} from '@capacitor/filesystem';
import {Share} from '@capacitor/share';
// Resolve after bundling at /assets/native-app.mjs, sharing one Supabase client per page.
const {getClient,accountURL}=await import('../account/client.mjs');
const {authCodeFromURL}=await import('../account/platform.mjs');
if(Capacitor.isNativePlatform()){
 document.documentElement.classList.add('native-app');
 const key='crystaleye-native-notice';
 function message(value){let node=document.getElementById(key);if(!node){node=document.createElement('p');node.id=key;node.setAttribute('role','status');document.body.append(node);}node.textContent=value;}
 let pending=false,lastCode='';
 async function openAuth(input){
  const code=authCodeFromURL(input);if(!code||pending||code===lastCode)return;
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(code)))).map(n=>n.toString(16).padStart(2,'0')).join('');
  try{if(localStorage.getItem('crystaleye-handled-auth')===hash)return;}catch{}
  if(pending||code===lastCode)return;
  pending=true;message('Signing you in…');
  try{const client=await getClient();if(!client)throw new Error();const {error}=await client.auth.exchangeCodeForSession(code);if(error)throw error;lastCode=code;try{localStorage.setItem('crystaleye-handled-auth',hash);}catch{}location.replace(accountURL);}
  catch{message('That sign-in link could not be used. Open My Account and request another link on this device.');}
  finally{pending=false;}
 }
 await App.addListener('appUrlOpen',event=>openAuth(event.url));
 const launch=await App.getLaunchUrl();if(launch?.url)await openAuth(launch.url);
 await App.addListener('appStateChange',async({isActive})=>{const client=await getClient().catch(()=>null);if(isActive)client?.auth.startAutoRefresh();else client?.auth.stopAutoRefresh();});
 if(Capacitor.getPlatform()==='android')await App.addListener('backButton',({canGoBack})=>{if(canGoBack)history.back();else if(location.pathname!=='/index.html'&&location.pathname!=='/')location.href=new URL('../index.html',import.meta.url).href;else App.minimizeApp();});
 document.addEventListener('click',async event=>{
  const link=event.target.closest('a[href]');if(!link||event.defaultPrevented)return;const url=new URL(link.href,location.href);
  const same=url.origin===location.origin;
  if(same){link.removeAttribute('target');if(!url.pathname.toLowerCase().endsWith('.pdf'))return;
   event.preventDefault();message('Preparing your guide…');
   try{const response=await fetch(url.href);if(!response.ok)throw new Error();const bytes=new Uint8Array(await response.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
    const name=decodeURIComponent(url.pathname.split('/').pop()).replace(/[^A-Za-z0-9_.-]/g,'_');
    const {uri}=await Filesystem.writeFile({path:name,data:btoa(binary),directory:Directory.Cache});await Share.share({title:'Crystal Eye guide',url:uri,dialogTitle:'Open or save your guide'});message('Guide ready.');
   }catch{message('Unable to open this guide. Please try again.');}return;
  }
  if(url.protocol==='https:'){event.preventDefault();try{await Browser.open({url:url.href});}catch{message('Unable to open this link. Please check your connection.');}}
 },true);
}
