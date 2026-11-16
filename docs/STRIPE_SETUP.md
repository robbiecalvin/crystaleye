# Stripe checkout for Crystal Eye

The site is static GitHub Pages. Merchandise checkout uses Stripe-hosted Payment Links, with no secret API key in source or browser code. `data/checkout.json` is the public configuration. Empty links and `ready: false` keep ordering closed.

## Account and ready products

Activate the owner's Stripe account and complete Stripe's business and payout details privately in its dashboard. Confirm whether the book is digital or printed, deck/bundle stock, shipping destinations and rates, delivery timelines, support contact, and refund terms. Configure tax collection based on the business's actual registrations; no tax rates or shipping charges are assumed here.

Create one-time CAD prices:

- Tarot Guide Book: $19.99
- Crystal Eye Tarot Deck: $39.99
- Book + Card bundle: $49.99

Create a separate Payment Link per product. For physical goods, collect shipping addresses and configure the agreed shipping countries/rates. For digital delivery, arrange actual delivery rather than assuming a receipt supplies the PDF. Enable receipts/customer confirmation as appropriate. Check a test-mode purchase and the complete fulfillment process before switching to live links.

For each ready product, place its `https://buy.stripe.com/...` live URL in `payment_link`, record the confirmed delivery process in `fulfillment`, then set `ready` to true. Test links, other hosts, query strings, and missing fulfillment are rejected during generation. These checks validate URL structure and configuration, not the remote product's price or account: verify those in Stripe. The buttons work without JavaScript.

Rebuild with `python scripts/build_astrology.py`, `python scripts/build_numerology.py`, `python scripts/build_tarot.py`, and `python scripts/build_merchandise.py`. Run `python tests/checkout.py` and the existing site tests. Never commit secret keys, webhook secrets, customer data, or account credentials.

## Deferred services

The $19.99 report remains unavailable until its content/delivery are ready. Both $5.99 CAD monthly subscriptions remain unavailable until fulfillment exists. Astrology needs sign collection, scheduled email delivery, unsubscribe handling, and subscription state. Tarot needs an authenticated paid-access flow. A future backend must verify Stripe webhook signatures and payment/subscription state; a browser redirect or URL query is not proof of payment. Stripe Payment Links alone do not supply these services.
