/** Read only rendered number cards; never collect name/date fields or breakdowns. */
import {readingSaveControl} from './client.mjs';
import {fullNumerologySnapshot} from './model.mjs';
const output=document.getElementById('output');
function addSave(){
 if(!output||output.querySelector('.account-save'))return;
 const cards=[...output.querySelectorAll('.card')].map(card=>({label:card.querySelector('span')?.textContent||'',value:card.querySelector('strong')?.textContent||''}));
 if(!cards.length)return;
 try{output.append(readingSaveControl(fullNumerologySnapshot(cards)));}catch{/* Preserve the existing calculator even if a chart cannot be saved. */}
}
if(output){new MutationObserver(addSave).observe(output,{childList:true});addSave();}
