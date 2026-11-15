"""Static social metadata shared by every page builder; no client JavaScript required."""
import json,re
from site_layout import with_ui_styles
from pathlib import Path
from html import escape as e
from html.parser import HTMLParser
from urllib.parse import urljoin
ROOT=Path(__file__).resolve().parents[1]
CONFIG=json.loads((ROOT/'data/site.json').read_text())
class Head(HTMLParser):
    def __init__(self):super().__init__();self.in_title=False;self.title=[];self.description='';self.attrs={}
    def handle_starttag(self,tag,attrs):
        self.attrs=dict(attrs)
        if tag=='title':self.in_title=True
        if tag=='meta' and self.attrs.get('name','').lower()=='description':self.description=self.attrs.get('content','')
    def handle_endtag(self,tag):
        if tag=='title':self.in_title=False
    def handle_data(self,data):
        if self.in_title:self.title.append(data)
def canonical_url(relative_path):
    path=str(relative_path).replace('\\','/')
    if path=='shop/index.html':path='merchandise/index.html'
    if path.endswith('index.html'):path=path[:-10]
    return urljoin(CONFIG['url'],path)
def _remove_old_tag(match):
    text=match.group();parser=Head();parser.feed(text);attrs=parser.attrs
    if text.lower().startswith('<meta') and (attrs.get('property','').lower().startswith('og:') or attrs.get('name','').lower().startswith('twitter:')):return ''
    if text.lower().startswith('<link') and attrs.get('rel','').lower() in ['image_src','apple-touch-icon']:return ''
    return text
def with_social_metadata(html,relative_path):
    html=re.sub(r'\s*<!-- social-preview:start -->.*?<!-- social-preview:end -->', '',html,flags=re.S)
    html=re.sub(r'<(?:meta|link)\b[^>]*>',_remove_old_tag,html,flags=re.I)
    head=Head();head.feed(html.split('</head>',1)[0]);title=''.join(head.title).strip();assert title,relative_path
    description=head.description or CONFIG['description']
    image=CONFIG['social_image'];icon=CONFIG['touch_icon']
    properties={'og:type':'website','og:site_name':CONFIG['name'],'og:title':title,'og:description':description,'og:url':canonical_url(relative_path),'og:image':image['url'],'og:image:secure_url':image['url'],'og:image:type':image['type'],'og:image:width':str(image['width']),'og:image:height':str(image['height']),'og:image:alt':image['alt']}
    twitter={'twitter:card':'summary_large_image','twitter:title':title,'twitter:description':description,'twitter:image':image['url'],'twitter:image:alt':image['alt']}
    tags=['<!-- social-preview:start -->']
    if not head.description:tags.append(f'<meta name="description" content="{e(description,quote=True)}">')
    tags.extend(f'<meta property="{key}" content="{e(value,quote=True)}">' for key,value in properties.items())
    tags.extend(f'<meta name="{key}" content="{e(value,quote=True)}">' for key,value in twitter.items())
    tags.extend([f'<link rel="image_src" href="{e(image["url"],quote=True)}">',f'<link rel="apple-touch-icon" sizes="{icon["size"]}x{icon["size"]}" href="{e(icon["url"],quote=True)}">','<!-- social-preview:end -->'])
    assert '</head>' in html,relative_path
    return html.replace('</head>','\n'+'\n'.join(tags)+'\n</head>',1)
def write_html(path,html):
    path=Path(path);path.write_text(with_social_metadata(with_ui_styles(html,path.relative_to(ROOT).as_posix()),path.relative_to(ROOT).as_posix()))
