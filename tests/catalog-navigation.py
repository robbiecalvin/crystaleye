"""Verify the complete catalog and navigation on every published HTML route."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
import json
ROOT=Path(__file__).resolve().parents[1]
class Toolbar(HTMLParser):
    def __init__(self,text):super().__init__();self.inside=False;self.links=[];self.label=None;self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='nav' and a.get('class')=='mobile-toolbar':self.inside=True
        if self.inside and tag=='a':self.links.append([a['href'],'']);self.label=True
    def handle_data(self,data):
        if self.inside and self.label:self.links[-1][1]+=data
    def handle_endtag(self,tag):
        if tag=='a':self.label=None
        if tag=='nav':self.inside=False

def main():
    pages=[p for p in ROOT.rglob('*.html') if 'node_modules' not in p.parts and '.wrangler' not in p.parts and 'mobile' not in p.parts]
    for page in pages:
        text=page.read_text();nav=Toolbar(text)
        assert len(nav.links)==5,page
        for (href,label),(name,folder) in zip(nav.links,[('Home',''),('Astrology','astrology'),('Tarot','tarot'),('Numerology','numerology'),('Shop','merchandise')]):
            assert label.strip()==name,(page,label)
            target=(page.parent/unquote(urlparse(href).path)).resolve()
            assert target==ROOT/folder/'index.html',(page,href)
        assert 'assets/mobile-toolbar.css?v=3' in text,page
    page=(ROOT/'merchandise/index.html').read_text()
    catalog=json.loads((ROOT/'data/merchandise.json').read_text())
    report=json.loads((ROOT/'data/numerology-topics.json').read_text())['report']
    plans=json.loads((ROOT/'data/subscriptions.json').read_text())['plans']
    for offer in [*catalog['products'],report,*plans]:
        assert offer['name'] in page,offer['name']
        assert '$'+offer['price'] in page,offer['price']
    assert page.count('class="merch-product"')==3
    assert page.count('class="subscription-offer"')==2
    assert page.count('class="report-offer"')==1
    checkout=json.loads((ROOT/'data/checkout.json').read_text())['products']
    for offer in checkout.values():
        if offer['ready']:
            assert offer['payment_link'] in page
    if not any(offer['ready'] for offer in checkout.values()):
        assert 'no orders, payments, or subscription enrollments are being accepted' in page
    assert (ROOT/'shop/index.html').read_text()==page
    print(f'Passed: correct five-link mobile navigation and versioned stylesheet on all {len(pages)} pages; all six products/subscriptions, CAD prices, availability, and compatible shop route.')
if __name__=='__main__':main()
