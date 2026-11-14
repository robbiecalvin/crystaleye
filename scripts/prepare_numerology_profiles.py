#!/usr/bin/env python3
"""Extract website reading copies from completed guides; never recreate PDF authoring files."""
import hashlib,json,re
from pathlib import Path
import fitz
ROOT=Path(__file__).resolve().parents[1]
NUMBERS=[1,2,3,4,5,6,7,8,9,11,22,33]
def plain(s):return re.sub(r'\s+',' ',s).strip()

def legacy(slug,filename):
    pdf=ROOT/filename;doc=fitz.open(pdf);profiles={}
    for offset,number in enumerate(NUMBERS):
        page=doc[offset+2];blocks=sorted(page.get_text('blocks'),key=lambda b:(b[1],b[0]))
        title=next(b for b in blocks if 85<b[1]<110)
        notes=[b for b in blocks if 120<b[1]<730 and plain(b[4]).startswith(('Source references:','Hans Decoz:','Final paragraph:'))]
        stop=min(b[1] for b in notes)
        body=[b for b in blocks if 120<b[1]<stop]
        groups=[];bottom=None
        for b in body:
            if bottom is None or b[1]-bottom>8:groups.append(plain(b[4]))
            else:groups[-1]+=' '+plain(b[4])
            bottom=b[3]
        assert len(groups)==3,(slug,number,len(groups))
        links=[]
        for link in page.get_links():
            if link.get('uri','').startswith(('http://','https://')):
                label=plain(page.get_textbox(link['from'])) or 'Profile source'
                links.append({'title':label,'url':link['uri']})
        profiles[str(number)]={'number':number,'subtitle':plain(title[4]),'paragraphs':groups,'evidence_note':' '.join(plain(b[4]) for b in notes),'sources':links,'pdf_page':offset+3}
    return {'pdf':filename,'pdf_sha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'source_kind':'extracted_completed_pdf','profiles':profiles}

def structured(slug,filename,pdfname):
    src=ROOT/filename;d=json.loads(src.read_text());pdf=ROOT/pdfname;doc=fitz.open(pdf);pages=[plain(p.get_text()) for p in doc];profiles={}
    for r in d['results']:
        number=int(str(r['number']).split('/')[0]);paras=[r[k] for k in ['core_meaning','potential_difficulties','constructive_direction']]
        matches=[i for i,text in enumerate(pages) if all(plain(p) in text for p in paras)]
        assert len(matches)==1,(slug,number,matches)
        profiles[str(number)]={'number':number,'subtitle':r['subtitle'],'paragraphs':paras,'evidence_note':' '.join(r[k] for k in ['evidence_note','editorial_note'] if r.get(k)),'sources':[{'title':s['title'],'url':s['url'],'id':s['id'],'role':r.get('source_roles',{}).get(s['id'],'')} for s in d['sources'] if s['id'] in r['source_ids']],'pdf_page':matches[0]+1}
    return {'pdf':pdfname,'pdf_sha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'source_json':filename,'source_json_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'source_kind':'completed_guide_json_verified_against_pdf','profiles':profiles}

def main():
    topics={}
    for slug,filename in [('personality','Personality_Number_Research_Guide.pdf'),('souls-desire','Souls_Desire_Research_Guide.pdf'),('life-path','Life_Path_Research_Guide.pdf')]:topics[slug]=legacy(slug,filename)
    for slug,datafile,pdf in [('destiny','destiny-expression','Destiny_Expression'),('minor-personality','minor-personality','Minor_Personality'),('minor-souls-desire','minor-souls-desire','Minor_Souls_Desire'),('balance','balance','Balance_Number')]:topics[slug]=structured(slug,f'data/{datafile}.json',f'output/pdf/{pdf}_Research_Guide.pdf')
    assert sum(len(t['profiles']) for t in topics.values())==81
    payload={'provenance':'Website reading copies of 81 profiles from the seven completed guides. Earlier PDFs remain the originals; these extracts are not replacement PDF authoring sources. Remaining topic profiles are intentionally not supplied.','topics':topics}
    (ROOT/'data/numerology-profiles.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
    print('Prepared 81 profile copies, all verified against completed PDFs.')

if __name__=='__main__':main()
