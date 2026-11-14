const reduceNumber=n=>{while(n>9&&![11,22,33].includes(n))n=String(n).split('').reduce((s,d)=>s+Number(d),0);return n;};
const valueOf=l=>(l.charCodeAt(0)-65)%9+1;
function normalizeName(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();}
function nameNumbers(parts){
 const words=parts.flatMap(p=>normalizeName(p).trim().split(/\s+/)).map(w=>w.replace(/['’\-]/g,'')).filter(Boolean);
 if(!words.length||words.some(w=>!/^[A-Z]+$/.test(w)))throw Error('Please use A–Z letters in names. Accented Latin letters are converted; spaces, apostrophes and hyphens are accepted.');
 const freq=Array(10).fill(0);let pc=0,pv=0,initials=0;
 const breakdown=words.map(word=>{let c=0,v=0;const letters=[...word].map(l=>{const n=valueOf(l),vowel='AEIOU'.includes(l);freq[n]++;if(vowel)v+=n;else c+=n;return {l,n,vowel};});initials+=valueOf(word[0]);const rc=reduceNumber(c),rv=reduceNumber(v);pc+=rc;pv+=rv;return {word,letters,c,v,rc,rv};});
 const personality=reduceNumber(pc),soul=reduceNumber(pv),peak=Math.max(...freq.slice(1));
 return {personality,soul,destiny:reduceNumber(personality+soul),balance:reduceNumber(initials),karmic:freq.map((n,i)=>i&&n===0?i:null).filter(Boolean),passion:freq.map((n,i)=>i&&n===peak?i:null).filter(Boolean),breakdown};
}
function dateNumbers(m,d,y){const a=reduceNumber(m),b=reduceNumber(d),c=reduceNumber(y),f=reduceNumber(a+b),g=reduceNumber(b+c),j=Math.max(0,a-b),k=Math.max(0,b-c);return {cycles:[a,b,c],birthday:d,life:reduceNumber(a+b+c),pinnacles:[f,g,reduceNumber(f+g),reduceNumber(a+c)],challenges:[j,k,Math.max(0,j-k),Math.max(0,a-c)]};}
const $=id=>document.getElementById(id);
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
months.forEach((m,i)=>$('month').add(new Option(m,i+1)));
for(let y=2026;y>=1800;y--)$('year').add(new Option(y,y));
function daysInMonth(m,y){return [31,y&&y%4===0&&(y%100!==0||y%400===0)?29:28,31,30,31,30,31,31,30,31,30,31][m-1]||0;}
function updateDays(){const old=$('day').value,m=Number($('month').value),y=Number($('year').value);$('day').replaceChildren(new Option('Day',''));$('day').disabled=!m;for(let d=1;d<=daysInMonth(m,y);d++)$('day').add(new Option(d,d));if(old&&Number(old)<=daysInMonth(m,y))$('day').value=old;}
$('month').addEventListener('change',updateDays);$('year').addEventListener('change',updateDays);
function toggleCurrent(){const checked=$('alternate').checked;$('current').hidden=!checked;['currentFirst','currentLast'].forEach(id=>$(id).required=checked);}
$('alternate').addEventListener('change',toggleCurrent);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function card(label,value,formula=''){return `<div class="card"><span>${esc(label)}</span><strong>${esc(value)}</strong>${formula?`<small>${esc(formula)}</small>`:''}</div>`;}
function group(title,cards){return `<h3 class="section-title">${esc(title)}</h3><div class="grid">${cards.join('')}</div>`;}
function breakdown(title,n){return `<details><summary>${esc(title)}</summary>${n.breakdown.map(w=>`<div class="word"><b>${esc(w.word)}</b><div class="letters">${w.letters.map(l=>`<span class="letter ${l.vowel?'':'c'}">${esc(l.l)}<b>${l.n}</b></span>`).join('')}</div><span class="small">Consonants: ${w.c} → ${w.rc} · Vowels: ${w.v} → ${w.rv}</span></div>`).join('')}</details>`;}
const empty=$('output').innerHTML;
$('form').addEventListener('submit',e=>{e.preventDefault();$('error').textContent='';try{
 const birth=['first','middle','last'].map(id=>$(id).value.trim());const current=$('alternate').checked?['currentFirst','currentMiddle','currentLast'].map(id=>$(id).value.trim()):birth;
 if(!birth[0]||!birth[2]||!current[0]||!current[2])throw Error('Please enter first and last names. Middle names are optional.');
 const m=Number($('month').value),d=Number($('day').value),y=Number($('year').value);
 if(!m||y<1800||y>2026||d<1||d>daysInMonth(m,y))throw Error('Please select a valid birth date.');
 const n=nameNumbers(birth),minor=nameNumbers(current),date=dateNumbers(m,d,y);const ord=['First','Second','Third','Fourth'];
 $('output').innerHTML=`<div class="eyebrow">Your numerology results</div><h2>${esc(birth.filter(Boolean).join(' '))}</h2><p>${months[m-1]} ${d}, ${y}</p>`+
 group('Core numbers',[card('Life Path Number',date.life,'Reduced sum of the three Life Cycle numbers'),card('Destiny Number',n.destiny,'Reduced Personality + Soul’s Desire'),card('Personality Number',n.personality),card('Soul’s Desire Number',n.soul),card('Balance Number',n.balance,'Reduced sum of first-letter values'),card('Birthday Number',date.birthday,'Unreduced birth day')])+
 `<p class="small">Current name: ${esc(current.filter(Boolean).join(' '))}${$('alternate').checked?'':' · Same as birth name'}</p>`+
 group('Minor numbers',[card('Minor Personality Number',minor.personality),card('Minor Soul’s Desire Number',minor.soul)])+
 group('Name patterns',[card('Karmic Lessons',n.karmic.join(', ')||'None','Values absent from the birth name'),card('Hidden Passion',n.passion.join(', '),'Most frequent birth-name value(s)')])+
 group('Life cycles',date.cycles.map((v,i)=>card(`${ord[i]} Life Cycle Number`,v,['Reduced month','Reduced day','Reduced year'][i])))+
 group('Pinnacles',date.pinnacles.map((v,i)=>card(`${ord[i]} Pinnacle Number`,v)))+
 group('Challenges',date.challenges.map((v,i)=>card(`${ord[i]} Challenge Number`,v,'Minimum zero · no reduction')))+
 breakdown('Explore the birth-name calculations',n)+breakdown('Explore the current-name calculations',minor)+
 '<button class="secondary" type="button" id="print">Print results / Save as PDF</button>';
 $('print').addEventListener('click',()=>window.print());$('output').scrollIntoView({behavior:'smooth',block:'start'});
 }catch(error){$('error').textContent=error.message;}});
$('form').addEventListener('reset',()=>{setTimeout(()=>{toggleCurrent();updateDays();$('error').textContent='';$('output').innerHTML=empty;},0);});
