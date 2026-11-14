"""Shared image references for generated pages; outputs come from build_images.py."""
import json
from functools import lru_cache
from html import escape as e
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
@lru_cache(maxsize=1)
def records():
    return json.loads((ROOT/'data/site-image-build.json').read_text())['images']
def image_tag(key,prefix='',alt='',cls='',eager=False):
    image=records()[key]
    return f'<img class="{e(cls)}" src="{prefix}{image["path"]}" width="{image["width"]}" height="{image["height"]}" alt="{e(alt)}" loading="{"eager" if eager else "lazy"}" decoding="async">'
def brand_mark(prefix=''):
    return image_tag('brand.logo',prefix,'','brand-mark image-logo',True)
