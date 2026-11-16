"""Shared static components; prices come from data/merchandise.json."""
import json
from checkout import payment_link, any_ready
from decimal import Decimal
from html import escape as e
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT/'data/merchandise.json').read_text())

def merchandise(prefix='', shop_page=False, compact=False):
    prices={p['id']:Decimal(p['price']) for p in CATALOG['products']}
    savings=f"{prices['book']+prices['deck']-prices['bundle']:.2f}"
    products=[]
    for p in CATALOG['products']:
        href=('#' if shop_page else prefix+'merchandise/index.html#')+p['id']
        checkout=payment_link(p['id']) if shop_page else None
        if checkout: href=checkout
        products.append(f'''<article class="merch-product" {'id="'+p['id']+'"' if shop_page else ''}><img src="{prefix}assets/images/tarot/{p['image']}.webp" width="480" height="720" alt="{'Card-back artwork preview' if p['id']=='book' else 'Tarot card artwork preview'}" loading="lazy" decoding="async"><div><p class="merch-kicker">{'Save $'+savings+' together' if p['id']=='bundle' else ('Read the symbols' if p['id']=='book' else 'Make it your ritual')}</p><h3>{e(p['name'])}</h3><p class="merch-description">{e(p['description'])}</p><p class="merch-price">${p['price']} <span>CAD{' · one-time' if shop_page else ''}</span></p><a class="merch-link" href="{href}">{'Buy with Stripe' if checkout else 'Ordering information' if shop_page else 'Explore '+('the bundle' if p['id']=='bundle' else 'the '+p['id'])} →</a></div></article>''')
    if compact:
        import re
        products=[re.sub(r'<p class="merch-description">.*?</p>','',card) for card in products]
    if shop_page:
        products=[x.replace(f'href="#{p["id"]}"', 'href="#ordering"') for x,p in zip(products,CATALOG['products'])]
    readings=f'<aside class="reading-service" id="psychic-reading"><p class="merch-kicker">One-to-one / By appointment</p><h3>Psychic Readings</h3><p>A personal 30-minute session with Robbie by video or phone. $29.99 CAD · available day or night with at least 24 hours’ notice.</p><a class="text-link" href="{prefix}psychic-readings/index.html#booking">Explore appointments →</a></aside>'
    browse='' if shop_page else f'<p class="merch-catalog-link"><a href="{prefix}merchandise/index.html">Browse all products &amp; subscriptions →</a></p>'
    ordering_note='Secure Stripe checkout available for ready products.' if any_ready() else 'ordering coming soon.'
    return f'''<!-- merchandise:start -->
<section class="merch-section{' home-shop-preview' if compact else ''}" aria-label="Crystaleye books and tarot decks"><div class="merch-inner"><div class="merch-heading"><div><p class="merch-kicker">A little wonder, in your hands</p><h2>Keep the <em>ritual.</em></h2></div><p>Learn with the guide. Read with the deck. Find your own way in.<br><span>Prices in Canadian dollars · {ordering_note}</span></p></div><div class="merch-grid">{''.join(products)}</div>{readings}{browse}</div></section>
<!-- merchandise:end -->'''


def quick_numerology_calculator(prefix='../',step='02'):
    return f'''<section class="num-calculator-band num-section" id="calculator"><div class="wrap"><div class="num-topline"><p class="eyebrow">{step} / Numerology · Start small</p><span>Three results. A simple beginning.</span></div><h2>A little detail.<br><em>Your first three numbers.</em></h2><p class="section-copy">Enter the full name on your birth record and your date of birth. Your details stay in this tab; they are not saved or sent anywhere.</p><div class="mini-layout"><form id="mini-form" class="mini-form"><label for="birth-name">Full name at birth</label><input id="birth-name" name="birthName" autocomplete="off" maxlength="240" required placeholder="First, middle, and last names"><p class="fine-print">Use all name words. Accented Latin letters, spaces, apostrophes, and hyphens are supported. A–Z letter values are used; Y counts as a consonant.</p><label for="birth-date">Date of birth</label><input id="birth-date" name="birthDate" type="date" min="1800-01-01" max="2026-12-31" required><p class="fine-print">Uses the full calculator’s supported birth years, 1800–2026.</p><p id="mini-error" class="mini-error" role="alert"></p><button class="button button-gold" type="submit" id="mini-submit" disabled>Enable JavaScript to calculate</button><button class="mini-clear" type="reset">Clear my details</button><noscript><p class="notice">Enable JavaScript to use the quick calculator. The topic guides and number profiles work without it.</p></noscript></form><div class="mini-output" id="mini-output" aria-live="polite" aria-atomic="true"><p class="eyebrow">A first look at your chart</p><h3>Three ways<br>to get <em>curious.</em></h3><ul><li><strong>Personality</strong><span>Your outward impression</span></li><li><strong>Life Path</strong><span>A theme for development</span></li><li><strong>Destiny</strong><span>A lens on contribution</span></li></ul></div></div><div class="quick-conventions"><details><summary>How are these three numbers calculated?</summary><p>Personality uses consonants in each birth-name word, reduced word by word and then combined. Life Path reduces the month, day, and year separately and then combines them. This quick calculator uses the existing app’s Destiny rule: reduce Personality + Soul’s Desire, with Soul’s Desire calculated from the vowels. It preserves 11, 22, and 33 at completed reduction steps.</p><p>The completed Expression guide instead reduces the totals of all letters in each name word. That can change a master-number result. Your calculation details identify the difference when it occurs.</p></details><a class="text-link" href="{prefix}numerology-calculator/index.html">Want all 21 positions? Open the full calculator →</a></div></div></section>'''


def mobile_toolbar(prefix='',active=None):
    if active is None and prefix=='':active='Home'
    icons={
        'Astrology':'<path d="m12 2 2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4Z"/>',
        'Tarot':'<rect x="5" y="3" width="14" height="19" rx="2"/><path d="m12 8 3 4-3 4-3-4Z"/>',
        'Numerology':'<path d="M9 3 6 21M18 3l-3 18M3 9h18M2 15h18"/>',
        'Shop':'<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>'
    }
    destinations={'Home':'index.html','Astrology':'astrology/index.html','Tarot':'tarot/index.html','Numerology':'numerology/index.html','Shop':'merchandise/index.html'}
    links=[]
    for name,path in destinations.items():
        content=f'<img class="toolbar-logo" src="{prefix}assets/images/site-logo.webp" alt="" width="32" height="32"><span class="visually-hidden">Home</span>' if name=='Home' else f'<svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg><span>{name}</span>'
        links.append(f'<a href="{prefix}{path}" class="{"mobile-home" if name=="Home" else "mobile-destination"}" {"aria-current=\"true\"" if active==name else ""} {"aria-label=\"Crystal Eye home\" title=\"Crystal Eye home\"" if name=="Home" else ""}>{content}</a>')
    return '<!-- mobile-toolbar:start --><nav class="mobile-toolbar" aria-label="Explore Crystaleye">'+''.join(links)+'</nav><!-- mobile-toolbar:end -->'
