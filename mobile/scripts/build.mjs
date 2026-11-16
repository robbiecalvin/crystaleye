/** Curated static app payload: never copy the repository or service source wholesale. */
import {cp,mkdir,rm,readdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,relative,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
const here=resolve(dirname(fileURLToPath(import.meta.url)),'..'),root=resolve(here,'..'),out=resolve(here,'www');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
const wings=['account','astrology','numerology','numerology-calculator','tarot','merchandise','shop','psychic-readings'];
const allowed=new Set(['.html','.css','.js','.mjs','.json','.webp','.png','.svg','.jpg','.jpeg','.pdf','.woff','.woff2']);
const excluded=new Set(['node_modules','webpimages','.git','src','scripts','vendor-entry.mjs','package.json','package-lock.json']);
const ext=path=>path.slice(path.lastIndexOf('.')).toLowerCase();
async function copyTree(source,destination){
 for(const entry of await readdir(source,{withFileTypes:true})){
  if(excluded.has(entry.name)||entry.name.startsWith('.'))continue;
  const from=resolve(source,entry.name),to=resolve(destination,entry.name);
  if(entry.isDirectory())await copyTree(from,to);
  else if(entry.isFile()&&(allowed.has(ext(entry.name))||entry.name.endsWith('-LICENSE'))){await mkdir(dirname(to),{recursive:true});await cp(from,to);}
 }
}
await cp(resolve(root,'index.html'),resolve(out,'index.html'));
for(const folder of [...wings,'assets'])await copyTree(resolve(root,folder),resolve(out,folder));
await copyTree(resolve(root,'output/pdf'),resolve(out,'output/pdf'));
async function htmlText(dir){let result='';for(const entry of await readdir(dir,{withFileTypes:true})){const path=resolve(dir,entry.name);if(entry.isDirectory())result+=await htmlText(path);else if(entry.name.endsWith('.html'))result+=await readFile(path,'utf8');}return result;}
const markup=await htmlText(out);
for(const entry of await readdir(root))if(entry.endsWith('.pdf')&&(markup.includes(entry)||markup.includes(encodeURIComponent(entry))))await cp(resolve(root,entry),resolve(out,entry));
// Native code uses existing local account modules; do not embed service source or keys.
await build({entryPoints:[resolve(here,'src/native.mjs')],bundle:true,format:'esm',platform:'browser',minify:true,outfile:resolve(out,'assets/native-app.mjs'),external:['../account/client.mjs','../account/platform.mjs']});
async function inject(dir){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const path=resolve(dir,entry.name);if(entry.isDirectory())await inject(path);
  else if(entry.name.endsWith('.html')){
   const prefix=relative(dirname(path),out).replaceAll('\\','/');const base=prefix?prefix+'/':'';
   let html=await readFile(path,'utf8');
   html=html.replace(/content="width=device-width,\s*initial-scale=1"/,'content="width=device-width,initial-scale=1,viewport-fit=cover"');
   html=html.replace('</head>',`<link rel="stylesheet" href="${base}assets/native-app.css"><script type="module" src="${base}assets/native-app.mjs"></script></head>`);
   await writeFile(path,html);
  }
 }
}
await cp(resolve(here,'src/native.css'),resolve(out,'assets/native-app.css'));
await inject(out);
await mkdir(resolve(out,'assets/licenses'),{recursive:true});
for(const pkg of ['core','android','ios','app','browser','filesystem','share'])await cp(resolve(here,`node_modules/@capacitor/${pkg}/LICENSE`),resolve(out,`assets/licenses/capacitor-${pkg}.txt`));
// Secrets remain backend-only; the public account config intentionally ships with the app.
console.log('Built bundled app website in mobile/www (source uploads and backend/dependency files excluded).');
