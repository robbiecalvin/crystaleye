/** Storage boundary: small snapshots, no birth name/date or session credentials. */
export const signSlugs=['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
export const destinyConvention='App Destiny uses Personality + Soul’s Desire. The Expression guide uses an all-letter method; master totals can differ.';
export function profileInput(name,placements){
 if(typeof name!=='string'||name.trim().length>80)throw new Error('Use a display name of up to 80 characters.');
 const result={display_name:name.trim()};
 for(const role of ['sun','moon','rising']){const value=placements[role]||null;if(value&&!signSlugs.includes(value))throw new Error('Choose a valid sign.');result[role]=value;}
 return result;
}
export function numerologySnapshot(result,summaries){
 const numbers=[['Personality','personality','personality'],['Life Path','life','life-path'],['Destiny','destiny','destiny']].map(([label,key,slug])=>{
  const value=result[key];if(![0,1,2,3,4,5,6,7,8,9,11,22,33].includes(value))throw new Error('Calculate your numbers again before saving.');
  return {label,value,slug,summary:value===0?'No counted consonants; no Personality 0 interpretation.':summaries[slug]?.[value]?.summary||''};
 });
 return {kind:'numerology',title:'My first three numbers',payload:{version:1,numbers,convention:destinyConvention}};
}
export function astrologySnapshot(placements,iso,readingFor){
 const paragraphs=['Sun','Moon','Rising'].map(role=>{const slug=placements[role.toLowerCase()];if(!signSlugs.includes(slug))throw new Error('Choose your Sun, Moon, and rising signs first.');const reading=readingFor(slug,iso,role);return {role,sign:slug,text:reading.paragraph};});
 return {kind:'astrology',title:`Astrology · ${iso}`,payload:{version:1,date:iso,source:'On-page editorial preview',paragraphs}};
}
export function validateSnapshot(snapshot){
 if(!snapshot||!['numerology','astrology'].includes(snapshot.kind)||typeof snapshot.title!=='string'||!snapshot.title.trim()||snapshot.title.length>160||!snapshot.payload||typeof snapshot.payload!=='object'||Array.isArray(snapshot.payload)||JSON.stringify(snapshot.payload).length>25000)throw new Error('This reading could not be saved. Please generate it again.');
 return snapshot;
}
export function subscriptionLabel(row,now=Date.now()){
 if(!row)return 'No subscription';
 const until=Date.parse(row.current_period_end);
 if(['active','trialing'].includes(row.status)){
  if(!Number.isFinite(until))return 'Status pending verification';
  if(until<=now)return 'Period ended · awaiting billing update';
  return row.cancel_at_period_end?'Active · ends at period close':row.status==='trialing'?'Trial active':'Active';
 }
 return ({past_due:'Payment overdue',canceled:'Canceled',unpaid:'Unpaid',paused:'Paused',incomplete:'Payment incomplete',incomplete_expired:'Checkout expired'})[row.status]||'Status unavailable';
}
export function fullNumerologySnapshot(cards){
 if(!Array.isArray(cards)||!cards.length||cards.length>40)throw new Error('Calculate your chart before saving.');
 const chart=cards.map(({label,value})=>{
  if(typeof label!=='string'||label.length>100||typeof value!=='string'||value.length>100||!(value==='None'||/^[-\d,\s—]+$/.test(value)))throw new Error('Invalid number chart.');
  return {label,value};
 });
 return {kind:'numerology',title:'My full numerology chart',payload:{version:1,numbers:[],chart,convention:destinyConvention}};
}
