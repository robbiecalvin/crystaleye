"""Static Stripe Payment Links; no credentials or browser-side payment claims."""
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

ROOT=Path(__file__).resolve().parents[1]

def load_checkout(path=None):
    data=json.loads((path or ROOT/'data/checkout.json').read_text())
    if data.get('currency')!='CAD':
        raise ValueError('Checkout currency must remain CAD.')
    offers=data.get('products',{})
    if set(offers)!={'book','deck','bundle'}:
        raise ValueError('Configure exactly the three merchandise products.')
    for key,offer in offers.items():
        url=offer.get('payment_link','')
        if url:
            parsed=urlsplit(url)
            if (parsed.scheme!='https' or parsed.netloc!='buy.stripe.com'
                or not re.fullmatch(r'/[A-Za-z0-9_]+',parsed.path)
                or parsed.query or parsed.fragment):
                raise ValueError(f'{key}: expected a Stripe-hosted Payment Link URL.')
        if offer.get('ready'):
            if not url or parsed.path.startswith('/test_'):
                raise ValueError(f'{key}: ready products need a live Payment Link.')
            if not offer.get('fulfillment'):
                raise ValueError(f'{key}: confirm fulfillment before enabling checkout.')
    return data

def payment_link(product_id):
    offer=load_checkout()['products'][product_id]
    return offer['payment_link'] if offer.get('ready') else None

def any_ready():
    return any(p.get('ready') for p in load_checkout()['products'].values())
