import test from 'node:test';import assert from 'node:assert/strict';
import {calculate} from '../numerology/number-engine.mjs';
import summaries from '../numerology/result-summaries.mjs';
import {readingFor} from '../astrology/reading-engine.mjs';
import {numerologySnapshot,astrologySnapshot,profileInput,validateSnapshot,subscriptionLabel,fullNumerologySnapshot} from '../account/model.mjs';
import {configured} from '../account/client.mjs';
test('saved quick numerology includes readings and method, excluding birth identity and calculations',()=>{
 const snapshot=numerologySnapshot(calculate('John Smith','1980-10-22'),summaries);assert.equal(snapshot.kind,'numerology');assert.deepEqual(snapshot.payload.numbers.map(n=>n.value),[11,5,8]);assert.ok(snapshot.payload.numbers.every(n=>n.summary.length));
 const raw=JSON.stringify(snapshot);for(const value of ['John','Smith','1980-10-22','words','components'])assert.ok(!raw.includes(value));assert.match(raw,/master totals/);assert.equal(validateSnapshot(snapshot),snapshot);
});
test('astrology snapshot preserves the three actual editorial placement readings',()=>{
 const placements={sun:'aries',moon:'cancer',rising:'leo'};const snapshot=astrologySnapshot(placements,'2026-11-16',readingFor);
 for(const part of snapshot.payload.paragraphs)assert.equal(part.text,readingFor(part.sign,'2026-11-16',part.role).paragraph);
 assert.throws(()=>astrologySnapshot({...placements,moon:''},'2026-11-16',readingFor));assert.match(snapshot.payload.source,/preview/i);
});
test('profiles validate signs and limit names; snapshots reject unbounded content',()=>{
 assert.deepEqual(profileInput('  Robbie  ',{sun:'aries'}),{display_name:'Robbie',sun:'aries',moon:null,rising:null});assert.throws(()=>profileInput('x'.repeat(81),{}));assert.throws(()=>profileInput('a',{sun:'unknown'}));
 assert.throws(()=>validateSnapshot({kind:'subscription',title:'Active',payload:{}}));assert.throws(()=>validateSnapshot({kind:'astrology',title:'test',payload:{text:'x'.repeat(30000)}}));
 assert.equal(fullNumerologySnapshot([{label:'Karmic Lessons',value:'None'}]).payload.chart[0].value,'None');
 assert.throws(()=>fullNumerologySnapshot([{label:'Personal details',value:'John Smith'}]));
});
test('subscription display distinguishes absent, expired, unverified and active billing',()=>{
 const now=Date.parse('2026-11-16');assert.equal(subscriptionLabel(null,now),'No subscription');assert.equal(subscriptionLabel({status:'active'},now),'Status pending verification');assert.match(subscriptionLabel({status:'active',current_period_end:'2026-11-01'},now),/ended/);assert.equal(subscriptionLabel({status:'active',current_period_end:'2026-12-01'},now),'Active');assert.equal(subscriptionLabel({status:'past_due'},now),'Payment overdue');
});
test('only HTTPS project URLs and browser-safe public Supabase keys are accepted',()=>{
 assert.equal(configured({supabase_url:'',publishable_key:''}),false);assert.equal(configured({supabase_url:'https://project.supabase.co',publishable_key:'sb_publishable_example'}),true);
 for(const key of ['sb_secret_example','other',`eyJ.${btoa(JSON.stringify({role:'service_role'}))}.test`])assert.throws(()=>configured({supabase_url:'https://project.supabase.co',publishable_key:key}));
 assert.throws(()=>configured({supabase_url:'http://project.supabase.co',publishable_key:'sb_publishable_example'}));
});
