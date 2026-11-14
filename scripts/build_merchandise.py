#!/usr/bin/env python3
"""Refresh shared promotions on hand-maintained pages; builders handle generated pages."""
import re
from site_components import ROOT, merchandise
from site_images import brand_mark

def main():
    for rel in ['index.html','numerology-calculator/index.html']:
        p=ROOT/rel;prefix='../' if '/' in rel else '';s=p.read_text()
        css=f'<link rel="stylesheet" href="{prefix}assets/merchandise.css">'
        if f'href="{prefix}assets/merchandise.css"' not in s:s=s.replace('</head>',css+'\n</head>')
        theme=f'<link rel="stylesheet" href="{prefix}assets/cyberpunk.css">'
        if f'href="{prefix}assets/cyberpunk.css"' not in s:s=s.replace('</head>',theme+'\n</head>')
        s=re.sub(r'<svg class="brand-mark".*?</svg>|<img class="brand-mark image-logo"[^>]*>',lambda _:brand_mark(prefix),s,flags=re.S)
        if rel.startswith('numerology-calculator/'):
            marker='<a href="../numerology/index.html">'
            if marker in s and 'image-logo' not in s:s=s.replace(marker,marker+brand_mark(prefix),1)
        fragment=merchandise(prefix)
        if '<!-- merchandise:start -->' in s:s=re.sub(r'<!-- merchandise:start -->.*?<!-- merchandise:end -->',lambda _:fragment,s,flags=re.S)
        else:s=s.replace('</main>',fragment+'\n</main>')
        p.write_text(s)
    print('Refreshed homepage and calculator merchandise promotions.')

if __name__=='__main__':main()
