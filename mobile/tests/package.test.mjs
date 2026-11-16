import test from 'node:test';import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
import {nativeAuthRedirect,authCodeFromURL,authRedirect} from '../../account/platform.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),web=resolve(root,'www');
async function files(dir){const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){const p=resolve(dir,entry.name);if(entry.isDirectory())result.push(...await files(p));else result.push(p);}return result;}
test('native auth only consumes codes from its registered callback; web auth stays on the site',()=>{
 assert.equal(authCodeFromURL('crystaleye://auth/callback?code=example'),'example');
 for(const bad of ['https://evil.example/callback?code=x','crystaleye://evil/callback?code=x','crystaleye://auth/other?code=x','crystaleye://auth/callback','invalid'])assert.equal(authCodeFromURL(bad),null);
 assert.equal(authRedirect('https://example.com/account/'),'https://example.com/account/');
 const before=globalThis.Capacitor;globalThis.Capacitor={isNativePlatform:()=>true};try{assert.equal(authRedirect('https://example.com/account/'),nativeAuthRedirect);}finally{globalThis.Capacitor=before;}
});
test('app payload is local, complete, wired for native hooks, and excludes source uploads and backend code',async()=>{
 const all=await files(web),html=all.filter(p=>p.endsWith('.html'));assert.equal(html.length,324);
 for(const p of all){assert.ok(!/\/(?:node_modules|webpimages|booking-service|supabase|research|\.git)\//.test(p),p);assert.ok(!p.endsWith('.env'));}
 for(const p of html){const source=await readFile(p,'utf8');assert.equal((source.match(/assets\/native-app\.mjs/g)||[]).length,1,p);
  for(const match of source.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)){
   const href=match[1];if(/^[a-z]+:/i.test(href)||href.startsWith('//'))continue;
   const target=resolve(dirname(p),decodeURIComponent(href));assert.ok(target.startsWith(web),href);await stat(target);
  }
 }
 const config=JSON.parse(await readFile(resolve(root,'capacitor.config.json'),'utf8'));assert.equal(config.appId,'com.crystaleye.app');assert.ok(!config.server.url);
 const bundle=await readFile(resolve(web,'assets/native-app.mjs'),'utf8');assert.ok(bundle.includes('../account/client.mjs'));assert.ok(bundle.includes('../account/platform.mjs'));
 const manifest=await readFile(resolve(root,'android/app/src/main/AndroidManifest.xml'),'utf8');assert.ok(manifest.includes('android:scheme="crystaleye"'));assert.ok(manifest.includes('android:allowBackup="false"'));
 const plist=await readFile(resolve(root,'ios/App/App/Info.plist'),'utf8');assert.ok(plist.includes('<string>crystaleye</string>'));
});
