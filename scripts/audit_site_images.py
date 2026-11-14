#!/usr/bin/env python3
"""Verify uploaded-image coverage, actual WebP bytes, and every static image reference."""
import hashlib,json,re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse,unquote
ROOT=Path(__file__).resolve().parents[1]
class Images(HTMLParser):
    def __init__(self,text):super().__init__();self.paths=[];self.feed(text)
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='img' and attrs.get('src'):self.paths.append(attrs['src'])
def main():
    manifest=json.loads((ROOT/'data/site-images.json').read_text());built=json.loads((ROOT/'data/site-image-build.json').read_text())['images'];used=set();refs=0
    for page in ROOT.rglob('*.html'):
        for src in Images(page.read_text()).paths:
            u=urlparse(src)
            if u.scheme or u.netloc:continue
            path=(page.parent/unquote(u.path)).resolve();assert path.is_file(),(page,src);used.add(path);refs+=1
    for css in ROOT.rglob('*.css'):
        for src in re.findall(r'url\(\s*[\'"]?([^\'"\)]+)[\'"]?\s*\)',css.read_text()):
            u=urlparse(src)
            if u.scheme or u.netloc or not u.path:continue
            path=(css.parent/unquote(u.path)).resolve();assert path.is_file(),(css,src);used.add(path)
    sources=set()
    for item in manifest['images']:
        output=ROOT/item['output'];assert output in used,('Unplaced artwork',item['id'])
        raw=output.read_bytes();assert raw[:4]==b'RIFF' and raw[8:12]==b'WEBP',('Not encoded WebP',output)
        metadata=built[item['id']];assert hashlib.sha256(raw).hexdigest()==metadata['webp_sha256']
        source=ROOT/item['source'];assert hashlib.sha256(source.read_bytes()).hexdigest()==metadata['source_sha256']
        sources.add(source)
        for alias in item['aliases']:
            alias=ROOT/alias;assert alias.read_bytes()==source.read_bytes();sources.add(alias)
    uploads=set((ROOT/manifest['source_directory']).glob('*.webp'));assert sources==uploads,('Unmapped uploads',uploads-sources)
    assert not any('/webpimages/' in str(p) for p in used),'Full-resolution renamed PNG sources must not be served by page references.'
    sign_data=json.loads((ROOT/'data/astrology-signs.json').read_text())['signs']
    for sign in sign_data:
        assert sign['image']==sign['slug']
        if sign['constellation_image']:assert sign['constellation_image']==sign['slug']+'-stars'
    print(f'Passed: {len(uploads)} supplied files → {len(manifest["images"])} distinct artwork mappings, all placed; {refs} HTML image references and all CSS image URLs resolve; served images are true WebP and source files are preserved.')
if __name__=='__main__':main()
