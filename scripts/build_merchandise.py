#!/usr/bin/env python3
"""Refresh shared promotions on hand-maintained pages; builders handle generated pages."""
import re
from site_metadata import write_html
from site_components import ROOT, merchandise, mobile_toolbar, quick_numerology_calculator
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
            if '../account/calculator-save.mjs' not in s:s=s.replace('</body>','<script type="module" src="../account/calculator-save.mjs"></script>\n</body>')
            marker='<a href="../numerology/index.html">'
            if marker in s and 'image-logo' not in s:s=s.replace(marker,marker+brand_mark(prefix),1)
        toolbar=mobile_toolbar(prefix,'Numerology' if rel.startswith('numerology-calculator/') else None)
        if '<!-- mobile-toolbar:start -->' in s:s=re.sub(r'<!-- mobile-toolbar:start -->.*?<!-- mobile-toolbar:end -->',lambda _:toolbar,s,flags=re.S)
        else:s=s.replace('</body>',toolbar+'\n</body>')
        s=s.replace(f'href="{prefix}assets/mobile-toolbar.css"',f'href="{prefix}assets/mobile-toolbar.css?v=3"')
        s=s.replace(f'href="{prefix}shop/index.html',f'href="{prefix}merchandise/index.html')
        if rel=='index.html':s=s.replace('<a href="#library">The library</a>', '<a href="merchandise/index.html">Shop</a>')
        if rel.startswith('numerology-calculator/'):
            nav=re.search(r'<nav class="calculator-site-nav".*?</nav>',s,re.S)
            if nav and 'merchandise/index.html' not in nav.group():s=s[:nav.start()]+nav.group().replace('</nav>','<a href="../merchandise/index.html">Shop</a></nav>')+s[nav.end():]
        s=s.replace('mobile-toolbar.css?v=2','mobile-toolbar.css?v=3')
        toolbar_css=f'<link rel="stylesheet" href="{prefix}assets/mobile-toolbar.css?v=3">'
        if f'href="{prefix}assets/mobile-toolbar.css' not in s:s=s.replace('</head>',toolbar_css+'\n</head>')
        if rel=='index.html':
            start='<!-- home-calculator:start -->';end='<!-- home-calculator:end -->'
            s=re.sub(start+r'.*?'+end,lambda _:start+quick_numerology_calculator('','03')+end,s,flags=re.S)
        fragment=merchandise(prefix,compact=rel=='index.html')
        if '<!-- merchandise:start -->' in s:s=re.sub(r'<!-- merchandise:start -->.*?<!-- merchandise:end -->',lambda _:fragment,s,flags=re.S)
        else:s=s.replace('</main>',fragment+'\n</main>')
        write_html(p,s)
    print('Refreshed homepage and calculator merchandise promotions.')

if __name__=='__main__':main()
