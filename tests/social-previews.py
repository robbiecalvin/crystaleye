"""Check logo-only sharing metadata in all generated HTML, without JavaScript."""
import json,struct,sys
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
from site_metadata import with_social_metadata,canonical_url
CONFIG=json.loads((ROOT/'data/site.json').read_text())
class Metadata(HTMLParser):
    def __init__(self,text):super().__init__();self.tags={};self.links={};self.title=[];self.in_title=False;self.in_head=False;self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='head':self.in_head=True
        if tag=='title':self.in_title=True
        if tag=='meta' and self.in_head:
            key=a.get('property',a.get('name'))
            if key:self.tags.setdefault(key,[]).append(a.get('content',''))
        if tag=='link' and self.in_head:self.links.setdefault(a.get('rel'),[]).append(a.get('href'))
    def handle_endtag(self,tag):
        if tag=='title':self.in_title=False
        if tag=='head':self.in_head=False
    def handle_data(self,data):
        if self.in_title:self.title.append(data)
def main():
    for config,width,height in [(CONFIG['social_image'],1200,630),(CONFIG['touch_icon'],180,180)]:
        raw=(ROOT/config['file']).read_bytes();assert raw[:8]==b'\x89PNG\r\n\x1a\n';assert struct.unpack('>II',raw[16:24])==(width,height);assert len(raw)<1024*1024
        assert urlparse(config['url']).scheme=='https'
    image=CONFIG['social_image'];pages=list(ROOT.rglob('*.html'))
    for page in pages:
        html=page.read_text();m=Metadata(html);relative=page.relative_to(ROOT).as_posix()
        assert m.tags['og:image']==[image['url']],page
        assert m.tags['twitter:image']==[image['url']],page
        assert m.tags['og:image:type']==['image/png'],page
        assert m.tags['og:image:width']==['1200'] and m.tags['og:image:height']==['630'],page
        assert m.tags['og:title']==[''.join(m.title)],page
        assert m.tags['og:description']==m.tags['description'],page
        assert m.tags['og:url']==[canonical_url(relative)],page
        assert m.tags['og:image:alt']==[image['alt']],page
        assert m.tags['twitter:card']==['summary_large_image'],page
        assert m.links['image_src']==[image['url']],page
        assert m.links['apple-touch-icon']==[CONFIG['touch_icon']['url']],page
        assert with_social_metadata(html,relative)==html,('Not idempotent',page)
    assert canonical_url('index.html')==CONFIG['url']
    assert canonical_url('numerology/personality/number-4/index.html').endswith('/numerology/personality/number-4/')
    assert canonical_url('shop/index.html')==canonical_url('merchandise/index.html')
    fixture='<html><head><title>Crystal Eye &amp; stars</title><meta name="description" content="A &amp; B"><meta property="og:image" content="wrong-card.jpg"><meta name="twitter:image" content="wrong-zodiac.jpg"></head><body>Unchanged</body></html>'
    fixed=with_social_metadata(fixture,'index.html');assert 'wrong-card' not in fixed and 'wrong-zodiac' not in fixed;assert '<body>Unchanged</body>' in fixed
    print(f'Passed: all {len(pages)} pages use only the supplied logo for OG/Twitter/image-src previews, static head metadata, correct URLs/titles, touch-icon fallback, PNG dimensions/size, duplicate removal, and repeatable updates.')
if __name__=='__main__':main()
