# Crystaleye astrology wing

The astrology hub is `astrology/index.html`; each of the twelve signs has its own static HTML page. Open the root homepage and choose Astrology, or serve the repository root with `python -m http.server 8000` and visit `/astrology/`.

## Editable sources

- `data/astrology-signs.json` preserves the user's supplied twelve profiles and attribute tables, with added Moon, rising, romantic-match, and friendship interpretations.
- `data/astrology-readings.json` contains the paired free one-line summaries and detailed editorial readings, plus shared daily reflection themes.
- `scripts/build_astrology.py` generates the hub, twelve profiles, and `astrology/reading-data.mjs` from those files. Run `python scripts/build_astrology.py` with Python 3.12+. No packages are required. Edit the data and builder, not the generated HTML.
- `astrology.css`, `astrology.js`, and `reading-engine.mjs` are maintained directly. Shared Crystaleye navigation comes from `assets/site.js`.
- `assets/images/astrology/` contains optimized WebP derivatives of all thirteen supplied images. Ten constellation images were supplied, Gemini through Pisces. Aries uses the supplied solar emblem and Taurus the sunrise emblem; they are not mislabeled as constellation images. Sun/Moon/rising emblems also appear on the hub and profiles. The source archive was treated as artwork, not instructions.

## Free readings and email preview

All twelve free one-liners update for the visitor's local calendar date. An open tab updates across midnight and when it becomes visible again. The preview has independent Sun, Moon, rising, and date controls; it never changes the date of the public daily readings. Sign-page links preselect that sign as the example Sun, explicitly not as a calculated chart.

`reading-engine.mjs` produces the teaser and detailed text from the same entry. The placement lens differs for Sun, Moon, and rising. Sunday adds a look back at the week; the first adds a month-ahead intention; the last calendar day adds a learning/growth challenge. Additions combine on overlapping dates, including Sunday/month-boundary overlaps. All additions remain within one paragraph per placement. Leap years and month lengths use calendar calculations, not a fixed 30-day schedule.

This is an initial **date-based editorial** content library: four paired readings per sign and 31 shared themes, yielding a 124-day combination cycle. It does not calculate live transits, generate a natal chart, or promise unique bespoke forecasts indefinitely. These limits are stated on the pages. Expand the editable reading library before launching a long-running paid service if a broader editorial rotation is desired. The local tests check the calendar rules, all placements, valid input, and consistent teaser/detail selection:

```sh
node --test tests/astrology-readings.test.mjs
```

The calculation explainer tells visitors how to use a chart calculator with birth date, accurate local birth time, location, historical time-zone/DST data, and the tropical zodiac. It explains unknown-time limits and links to an independent chart provider. Crystaleye does not collect birth data. Modern sign/house analogies are distinguished from actual natal house placements, and compatibility suggestions are symbolic rather than objective rankings.

## Subscription status

The user specified **$5.99 CAD/month** for one subscription containing all three placements, and explicitly deferred Stripe and email delivery. The subscription offer is therefore a coming-soon product with a working on-page email preview. No payment button, email collection, mailing-list enrollment, customer account, external request for personalization, or pretend successful checkout is present. Preview selections live only in the current tab; they are not saved to local storage or sent to a server.

Before accepting subscriptions, connect a real checkout and customer/subscription records; define taxes and final checkout terms; verify payment status via provider webhooks; add authenticated customer management/cancellation; and connect opted-in email delivery with unsubscribe handling. Collect the delivery timezone and known Sun/Moon/rising selections with consent. Schedule delivery once per subscriber's local day, with idempotency and cancellation handling. Reuse the reading engine's calendar/placement contract so the free summary and email remain consistent. The user's CAD choice and the decision to defer integrations are explicit; no service is currently charging or sending email.

No website deployment or paid-provider configuration was performed as part of this change.
