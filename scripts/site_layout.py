"""Shared layout styling applied by the final HTML writer on every route."""
import re

def with_ui_styles(html,relative_path):
    prefix='../'*(len(str(relative_path).replace('\\','/').split('/'))-1)
    tag=f'<link rel="stylesheet" href="{prefix}assets/ui.css?v=1">'
    html=re.sub(r'<link\b[^>]*href=[\'\"][^\'\"]*assets/ui\.css[^\'\"]*[\'\"][^>]*>\s*','',html)
    # Place the refinement layer before the metadata block, which is kept last in head.
    marker='<!-- social-preview:start -->'
    if marker in html:return html.replace(marker,tag+'\n'+marker,1)
    return html.replace('</head>',tag+'\n</head>',1)
