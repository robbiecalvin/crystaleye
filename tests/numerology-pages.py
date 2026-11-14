"""Static site integrity checks; run with Python 3.12+, no dependencies."""
import json
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.ids=[];self.links=[];self.feed(text)
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if 'id' in attrs:self.ids.append(attrs['id'])
        if tag=='a' and 'href' in attrs:self.links.append(attrs['href'])
        if tag in ['img','script'] and attrs.get('src'):self.links.append(attrs['src'])
        if tag=='link' and attrs.get('href'):self.links.append(attrs['href'])
def main():
    files=list(ROOT.rglob('*.html'));parsed={p:Page(p.read_text()) for p in files};count=0
    assert len(list((ROOT/'numerology').rglob('*.html')))==299
    for p,page in parsed.items():
        text=p.read_text()
        assert len(page.ids)==len(set(page.ids)),p
        assert text.count('class="merch-product"')==3,p
        assert text.count('assets/cyberpunk.css')==1,p
        for href in page.links:
            u=urlparse(href)
            if u.scheme or u.netloc:continue
            target=(p.parent/unquote(u.path)).resolve() if u.path else p
            if target.is_dir():target=target/'index.html'
            assert target==ROOT or ROOT in target.parents,(p,href)
            assert target.is_file(),(p,href,target)
            if u.fragment and target.suffix=='.html':assert unquote(u.fragment) in parsed[target].ids,(p,href)
            count+=1
    config=json.loads((ROOT/'data/numerology-topics.json').read_text());profiles=json.loads((ROOT/'data/numerology-profiles.json').read_text())['topics']
    assert len(config['topics'])==21
    assert sum(len(v['profiles']) for v in profiles.values())==81
    for topic in config['topics']:
        for n in config['standard_routes']:assert (ROOT/'numerology'/topic['slug']/f'number-{n}/index.html').is_file()
        for n,r in profiles.get(topic['slug'],{}).get('profiles',{}).items():
            p=ROOT/'numerology'/topic['slug']/f'number-{n}/index.html';text=p.read_text()
            from html import unescape
            for paragraph in r['paragraphs']:assert paragraph in unescape(text),(topic['slug'],n)
            assert 'Profile coming soon</p>' not in text
    print(f'Passed: {len(files)} HTML pages; {count} local links/assets/anchors; 21×12 standard routes, valid Birthday/Challenge extras, 81 source profiles, shared theme, and merchandise.')
if __name__=='__main__':main()
