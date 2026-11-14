# Crystaleye tarot wing

`tarot/index.html` is the tarot hub. Its five learning pages are `major-arcana.html`, `swords.html`, `cups.html`, `pentacles.html`, and `wands.html`. The root homepage links into the wing. `shop/index.html` presents the book, deck, bundle, and ordering status.

## Daily draws

The complete existing 78-card CyberPunkTarotDeck is available to both draws, using optimized WebP derivatives in `assets/images/tarot/`. The card back is a derivative of `CyberPunkTarotDeck/Cover.png`; original artwork is preserved. Every card has an individual upright focus, yesterday reflection, and tomorrow gratitude prompt in `data/tarot-cards.json`. Source filenames are recorded even where their original spelling differs from the corrected display name.

The free draw offers an easier, mixed, or more demanding **symbolic day theme**, with a practical response. It does not claim to predict a real event. The planned $5.99 CAD/month three-card subscription assigns distinct cards to yesterday's lesson, today's focus, and tomorrow's gratitude. A clearly labeled public preview demonstrates the spread; it is not a paid account or active subscription. Tarot and astrology subscriptions are separate products.

`draw-engine.mjs` selects cards with Web Crypto, rejection sampling, and a partial Fisher–Yates shuffle. Three-card spreads draw without replacement. No reversals are used in this initial interpretation set. The draw is saved before animation starts, so refreshing mid-reveal restores the same selection. CSS shuffles/deals and turns the cards on screen; reduced-motion preferences reveal the same result immediately.

Draws are logged by local date and mode in `sessionStorage` under `crystaleye.tarot.session.v1`, with card IDs only. The journal retains up to 30 calendar dates (at most 60 records: free and preview). Refreshing or navigating within the same tab preserves the daily selections. Closing the tab/session normally ends the record; browser session restoration may retain it, and a duplicated tab may begin with a copy according to browser behavior. Other tabs and sessions are not a single user identity. This is not a server-enforced daily entitlement. If storage is unavailable, the page explicitly switches to in-memory draws, which may be lost on refresh. Invalid or stale saved records are rejected.

Local dates are recalculated at intervals and on returning to a visible tab. A new day resets the draw controls while retaining previous journal entries. No account, name, email, birth details, payment data, cookie, analytics, or server draw log is created by this feature.

## Learning content

`data/tarot-learning.json` supplies detailed explanations of all four suits and one three-act teaching framework for the Major Arcana: The Fool as prologue, I–VII as Act I, VIII–XIV as Act II, and XV–XXI as Act III. It uses Strength VIII / Justice XI and explicitly acknowledges other traditions. Each suit covers its element, life domains, Ace-to-Ten narrative, court-card approaches, and practical use, with all fourteen individual cards. The existing `Tarot Guide.pdf` was inspected for context and remains unchanged; the new content is independently worded and does not repeat its speculative Egyptian-origin claim.

## Build and verify

No frontend build or dependency installation is needed to serve the site. Run `python -m http.server 8000` from the repository root and visit `/tarot/`.

Editable data is in `data/tarot-cards.json`, `data/tarot-learning.json`, and `data/merchandise.json`. Regenerate static pages and shared card data using Python 3.12+:

```sh
python scripts/build_tarot.py
python scripts/build_astrology.py
python scripts/build_merchandise.py
node --test tests/*.test.mjs
```

The tarot builder creates the six tarot pages, shop, and `card-data.mjs`. The astrology builder includes the same static merchandise component. The merchandise script refreshes the hand-maintained homepage and calculator; it does not change calculation logic. Shared product markup is in `scripts/site_components.py`, styles in `assets/merchandise.css`, and the common visual theme in `assets/cyberpunk.css`.

Browser verification covers animated reveals, refresh during a reveal, session persistence/isolation, three unique cards, history, storage failure, reduced motion, local midnight rollover, all local links and anchors, and layouts at 320/390/768/1440 pixels. Every one of the 22 HTML pages includes all three merchandise items. The existing calculator was checked with John Smith / October 22, 1980 and still produces 21 result cards.

## Merchandise and future checkout

All prices are CAD: Tarot Guide Book $19.99, Crystal Eye Tarot Deck $39.99, and Book + Card bundle $49.99. Bundle savings are computed from catalog prices. The shop clearly states that ordering is coming soon, and artwork previews do not represent finalized packaging. Product format, fulfillment, and final checkout terms are not invented. No payment, email, or inventory integration has been activated; the user deferred those systems.

A production subscription will need server-side customer identity, verified billing state, entitlement checks, and durable daily draw records. Client session storage and the public preview must not be treated as paid access control. The existing drawing/interpretation interface can inform that later service, but no such service is currently deployed.
