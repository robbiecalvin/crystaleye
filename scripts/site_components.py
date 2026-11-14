"""Shared static components; prices come from data/merchandise.json."""
import json
from decimal import Decimal
from html import escape as e
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT/'data/merchandise.json').read_text())

def merchandise(prefix='', shop_page=False):
    prices={p['id']:Decimal(p['price']) for p in CATALOG['products']}
    savings=f"{prices['book']+prices['deck']-prices['bundle']:.2f}"
    products=[]
    for p in CATALOG['products']:
        href=('#' if shop_page else prefix+'shop/index.html#')+p['id']
        products.append(f'''<article class="merch-product" {'id="'+p['id']+'"' if shop_page else ''}><img src="{prefix}assets/images/tarot/{p['image']}.webp" width="480" height="720" alt="{'Card-back artwork preview' if p['id']=='book' else 'Tarot card artwork preview'}" loading="lazy" decoding="async"><div><p class="merch-kicker">{'Save $'+savings+' together' if p['id']=='bundle' else ('Read the symbols' if p['id']=='book' else 'Make it your ritual')}</p><h3>{e(p['name'])}</h3><p class="merch-description">{e(p['description'])}</p><p class="merch-price">${p['price']} <span>CAD</span></p><a class="merch-link" href="{href}">{'Ordering information' if shop_page else 'Explore '+('the bundle' if p['id']=='bundle' else 'the '+p['id'])} →</a></div></article>''')
    if shop_page:
        products=[x.replace(f'href="#{p["id"]}"', 'href="#ordering"') for x,p in zip(products,CATALOG['products'])]
    return f'''<!-- merchandise:start -->
<section class="merch-section" aria-label="Crystaleye books and tarot decks"><div class="merch-inner"><div class="merch-heading"><div><p class="merch-kicker">A little wonder, in your hands</p><h2>Keep the <em>ritual.</em></h2></div><p>Learn with the guide. Read with the deck. Find your own way in.<br><span>Prices in Canadian dollars · ordering coming soon.</span></p></div><div class="merch-grid">{''.join(products)}</div></div></section>
<!-- merchandise:end -->'''
