"""Shared layout styling applied by the final HTML writer on every route."""
import re

def with_ui_styles(html,relative_path):
    prefix='../'*(len(str(relative_path).replace('\\','/').split('/'))-1)
    # Keep the service discoverable from all generated section headers.
    def readings_link(match):
        nav=match.group()
        if 'psychic-readings/index.html' in nav:return nav
        return nav.replace('</nav>',f'<a href="{prefix}psychic-readings/index.html">Psychic Readings</a></nav>')
    html=re.sub(r'<nav\b[^>]*(?:id="site-nav"|class="calculator-site-nav")[^>]*>.*?</nav>',readings_link,html,flags=re.S)
    tag=f'<link rel="stylesheet" href="{prefix}assets/ui.css?v=1">'
    html=re.sub(r'<link\b[^>]*href=[\'\"][^\'\"]*assets/ui\.css[^\'\"]*[\'\"][^>]*>\s*','',html)
    # Place the refinement layer before the metadata block, which is kept last in head.
    marker='<!-- social-preview:start -->'
    if marker in html:return html.replace(marker,tag+'\n'+marker,1)
    return html.replace('</head>',tag+'\n</head>',1)
