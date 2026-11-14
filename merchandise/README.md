# Merchandise and subscriptions

The complete catalog at `merchandise/index.html` presents three merchandise products, the full numerology report, and two separate monthly subscriptions. All prices are CAD. Checkout and enrollment remain coming soon at the user's request.

`python scripts/build_catalog.py` regenerates this page and the compatible `shop/index.html`; `build_tarot.py` also calls the catalog builder. The merchandise URL is preferred, while old shop/product anchors continue to work. Product data comes from `data/merchandise.json`, report data from `data/numerology-topics.json`, and plan data from `data/subscriptions.json`. Styles are in `assets/catalog.css`.

The four-tab mobile bar links to Astrology, Tarot, Numerology, and this catalog. It is static HTML, so it works without JavaScript. It is visible at widths up to 900px and on touch-first devices, with bottom safe-area clearance. A shared-script fallback repairs legacy pages that lack a current toolbar.

Verify with `python tests/catalog-navigation.py`, `python tests/numerology-pages.py`, and `node --test tests/*.test.mjs`. No orders, charges, emails, or paid accounts are created by this page.
