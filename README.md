# Crystaleye

Crystaleye is a static site for astrology, tarot, and numerology, with a merchandise catalog, psychic reading requests, and customer accounts.

## Numerology research guides

| Series | Guide | Editable source and research |
|---|---|---|
| 01 | [Personality](Personality_Number_Research_Guide.pdf) | PDF only |
| 02 | [Soul’s Desire](Souls_Desire_Research_Guide.pdf) | PDF only |
| 03 | [Life Path](Life_Path_Research_Guide.pdf) | PDF only |
| 04 | [Destiny / Expression](output/pdf/Destiny_Expression_Research_Guide.pdf) | [JSON](data/destiny-expression.json) · [Markdown](content/destiny-expression.md) · [Research](research/destiny-expression-sources.md) |
| 05 | [Minor Personality](output/pdf/Minor_Personality_Research_Guide.pdf) | [JSON](data/minor-personality.json) · [Markdown](content/minor-personality.md) · [Research](research/minor-personality-sources.md) |
| 06 | [Minor Soul’s Desire](output/pdf/Minor_Souls_Desire_Research_Guide.pdf) | [JSON](data/minor-souls-desire.json) · [Markdown](content/minor-souls-desire.md) · [Research](research/minor-souls-desire-sources.md) |
| 07 | [Balance](output/pdf/Balance_Number_Research_Guide.pdf) | [JSON](data/balance.json) · [Markdown](content/balance.md) · [Research](research/balance-sources.md) |

**In progress:** Karmic Lessons (08) has [JSON](data/karmic-lessons.json), a [reading draft](content/karmic-lessons.md), and [research notes](research/karmic-lessons-sources.md). Final PDF layout awaits a readable compressed or split copy of the new Personality.pdf design reference. Hidden Passion (09) follows Karmic Lessons. See [series progress](PROGRESS.md) and the [research handoff](research/SERIES_HANDOFF.md).

The guides present numerology as a symbolic tradition. Research notes document source coverage and calculation conventions, including differences between the [calculator](numerology-calculator/README.txt) and the Destiny / Expression and Balance guides.

### Rebuild completed guides

Use Python 3.12 from the repository root. Edit the guide’s JSON first, then regenerate the Markdown and PDF together:

```sh
python3 -m pip install reportlab==4.4.9
python3 scripts/build_pdf.py --data data/destiny-expression.json
python3 scripts/build_pdf.py --data data/minor-personality.json
python3 scripts/build_pdf.py --data data/minor-souls-desire.json
python3 scripts/build_pdf.py --data data/balance.json
```

The default build uses Destiny / Expression. Use `--pdf` and `--markdown` to override output paths. PyMuPDF 1.26.6 and Pillow 13.0.0 support PDF text, link, and page inspection. After validation, commit the guide, editable content, research, and related project changes to GitHub `main` and verify the push.

## Homepage

The [homepage](index.html) leads with Astrology and Tarot, followed by a three-number numerology calculator and a merchandise preview. The [numerology hub](numerology/index.html) holds the seven completed PDF guides. To preview the static site locally, run this from the repository root:

```sh
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000). No frontend build or package installation is required.

### Install the web app

Use **Install Crystaleye** when the browser shows the button. On iPhone, open the site in Safari and choose **Share → Add to Home Screen**. On Android, open the site in Chrome and choose **Install app** or **Add to Home screen** from the menu. The [web app ZIP](downloads/Crystaleye-Web-App.zip) is also available from the homepage.

## Astrology

The [astrology wing](astrology/index.html) includes all twelve sign profiles with the supplied material, Moon and rising interpretations, suggested love/friendship pairings, free daily editorial one-liners, and a birth-chart calculation explainer. The upcoming daily email is priced at **$5.99 CAD/month** and has an interactive three-sign preview with Sunday, month-opening, and month-end additions. Stripe and email delivery are intentionally deferred at the user's request; the page clearly marks subscriptions as coming soon and collects neither payments nor email addresses.

See [astrology/README.md](astrology/README.md) for editable sources, rebuild instructions, reading-library limits, tests, and the future integration contract. The astrology content is generated with `python scripts/build_astrology.py`; no dependency installation is needed.


## Tarot and merchandise

The [tarot wing](tarot/index.html) has an animated free daily card, a browser-session journal, a clearly labeled three-card subscription preview ($5.99 CAD/month), and five learning pages covering the three-act Major Arcana story and all four suits. All 78 existing cards have upright interpretations for the daily focus and each spread position. [Tarot documentation](tarot/README.md) describes session behavior, editable sources, rebuild commands, and tests.

## Shared cyberpunk design

[assets/cyberpunk.css](assets/cyberpunk.css) applies the user's imagery-led direction across the homepage, astrology, tarot, shop, and calculator: a continuous nebula background from supplied artwork, cyan/violet light, subtle grid texture, geometric headings, translucent panels, and luminous card frames. The theme loads after page-specific styles. Backgrounds and accents preserve contrast, mobile layouts, keyboard focus, and reduced-motion preferences. The calculator's formulas and JavaScript are unchanged.


## Numerology wing

The [numerology hub](numerology/index.html) answers what numerology is and how old its traditions are, offers a simple Personality/Life Path/Destiny calculator, and links to all 21 chart positions. The 21 topic libraries contain 276 result routes: the twelve requested numbers per topic, plus the valid Birthday and Challenge extras. **81 profiles** use the seven completed guides; unfinished profiles are visibly marked as placeholders, and convention notes explain values that do not apply to a position.

The [Full Numerology report](numerology/report.html) is listed at **$19.99 CAD, one-time purchase**, with ordering coming soon. See [numerology/README.md](numerology/README.md) for content provenance, formula differences, build commands, and tests. Rebuild with `python scripts/build_numerology.py`. The previously blocked numerology artwork is now available through the user’s GitHub image upload and is integrated across the wing.


## Supplied images and rebuilds

All 139 files in `assets/images/webpimages/` are accounted for in [data/site-images.json](data/site-images.json): 138 distinct illustrations plus an exact Aries duplicate named `cyberttaurus.webp`. The real Taurus image is `tauruscyber.webp`. Filename quirks such as `detiny`, `eocyber`, `ibrastars`, `sagitarriusstars`, and `thirdchalennge` are mapped explicitly to the correct pages.

The uploaded files have WebP extensions but contain PNG data internally. They are kept untouched as source artwork. `scripts/build_images.py` makes actual WebP browser assets (about 22.1 MiB in total, rather than serving roughly 657 MiB of unique source files). Metadata and source/output hashes are in `data/site-image-build.json`. Formatting, resizing, and compression preserve the supplied compositions; no new illustrations are substituted.

Rebuild images with Pillow installed, then rebuild the pages:

```sh
python3 scripts/build_images.py
python scripts/build_astrology.py
python scripts/build_numerology.py
python scripts/build_tarot.py
python scripts/build_merchandise.py
python scripts/audit_site_images.py
python tests/numerology-pages.py
node --test tests/*.test.mjs
```

The audit verifies that every uploaded image has a placement or documented identical alias, every served image is encoded WebP, all image URLs resolve, and the untouched source files match their recorded hashes. Portraits, constellations, number illustrations, card faces, card backs, logo, and page backgrounds have separate explicit roles.


## Homepage and mobile navigation

The homepage now leads with Astrology, followed by Tarot and the embedded three-number numerology calculator. A compact merchandise preview follows; the full PDF guide library is on the Numerology hub. Both the homepage and numerology hub use the same form component (`quick_numerology_calculator` in `scripts/site_components.py`) and the same calculation module. Its result and artwork links resolve relative to the module, so they work from either location.

Every page includes a fixed bottom toolbar on mobile widths up to 900px and on touch-first devices, linking home through the eye logo and to the Astrology, Tarot, Numerology, and Shop main pages. It works without JavaScript, indicates the active wing, provides touch-sized targets, and reserves bottom space including device safe-area insets. Desktop layouts hide it. Styles are in `assets/mobile-toolbar.css`; generated pages and the hand-maintained-page refresh helper preserve it on rebuild.


## Merchandise and subscriptions catalog

[merchandise/index.html](merchandise/index.html) is the complete catalog: Tarot Guide Book ($19.99 CAD), Crystal Eye Tarot Deck ($39.99 CAD), Book + Card bundle ($49.99 CAD), Full Numerology report ($19.99 CAD one-time), Daily Astrology Subscription ($5.99 CAD/month), and Daily Three-Card Tarot Subscription ($5.99 CAD/month). The existing `/shop/index.html` remains compatible, with the merchandise URL identified as the preferred location.

The Tarot Guide Book, deck, and bundle use Stripe-hosted checkout, with $9.99 CAD flat-rate shipping within Canada. The Full Numerology report and both monthly subscriptions are coming soon. See [checkout setup](docs/STRIPE_SETUP.md) and [payment-link configuration](data/checkout.json). Merchandise data is in `data/merchandise.json`, monthly plans in `data/subscriptions.json`, and the report in `data/numerology-topics.json`. Rebuild with `python scripts/build_catalog.py` (also called by `build_tarot.py`).

Mobile navigation is rendered statically on every page, including the catalog and full calculator. The shared script can also repair an older/missing toolbar. Its stylesheet is versioned for the updated Home-plus-four-section layout. Validate with `python tests/catalog-navigation.py` and `python tests/numerology-pages.py`.


## Logo-only shared-link previews

All pages include static Open Graph and Twitter preview metadata for the supplied Crystal Eye gem-eye logo. Titles and descriptions remain page-specific. Page URLs use the confirmed public base `https://robbiecalvin.github.io/crystaleye/`; the old shop page shares the merchandise canonical URL.

`data/site.json` controls the site address and preview assets. The logo-only 1200×630 PNG and 180×180 Apple touch icon are generated from the original supplied logo into `assets/social/`. They contain no tarot, zodiac, product artwork, or promotional text. PNG is used for broad preview-crawler compatibility. Image URLs are absolute HTTPS public GitHub raw URLs, independent of page depth or JavaScript. The normal page imagery remains unchanged.

Rebuild the logo framing and metadata with `python3 scripts/build_social_previews.py`. All regular page builders also apply the shared metadata helper, so regeneration preserves the logo preview. Verify every page with `python tests/social-previews.py`. Existing previews may remain cached by individual messaging apps; previously sent messages are not changed by editing the website.

Shared UI refinements in `assets/ui.css` are inserted on all pages by `scripts/site_layout.py` through the final HTML writer. Calculator result summaries are generated from completed profiles into `numerology/result-summaries.mjs`. Number tiles distinguish available profiles, reference mappings, and coming-soon previews. The catalog separates one-time CAD purchases from monthly subscriptions.


## Psychic readings

The [booking form](psychic-readings/index.html) accepts requests for 30-minute phone or video sessions at $29.99 CAD. It uses Vancouver time, requires 24 hours’ notice, and shows slots within a rolling 30-day window. The form is configured to use the deployed Cloudflare Worker, D1, and Turnstile. The owner confirms requests manually and arranges the call. See the [booking service documentation](booking-service/README.md) for setup and request management.

Run `python3 scripts/build_readings.py` to rebuild the page and browser configuration from `data/readings.json`.

## Accounts and native apps

Customer accounts are built in `account/` with passwordless Supabase sign-in, editable profile/sign choices, explicit numerology/astrology saves, private saved-reading history, and read-only tarot/astrology subscription status. `python scripts/build_account.py` writes the dashboard and browser-safe connection settings. Both quick and full calculators save numerical results without the entered birth identity. The existing project's public connection settings are configured, and sign-in is enabled following the owner's confirmation of the database migration and Auth callback settings. See [customer account setup](docs/CUSTOMER_ACCOUNTS.md) for configuration, permissions, launch verification, and SDK rebuilds. Stripe subscription activation/paid fulfillment and appointment consolidation remain separate integrations.


Native iOS and Android projects are available in [mobile](mobile/README.md), built with Capacitor and a curated local copy of the site. Run `npm ci --prefix mobile` and `npm run sync --prefix mobile` to prepare both projects. Native auth adds the Supabase callback `crystaleye://auth/callback`; the website retains its HTTPS callback. Android back navigation, external browser links, logo resources, safe-area styling, and native PDF sharing are included. A manual GitHub Actions workflow builds Android debug/iOS simulator artifacts when run with suitable GitHub access. These are source projects; no signed APK/IPA or store submission has been produced here. See the mobile README for device-build and store-release requirements.

## Regression testing and structured data

The `data/`, `content/` and `research/` directories separate machine-readable resources, editorial material and source notes. `tests/numerology-calculator.test.mjs` compares calculations with a reference implementation and checks invalid inputs, leap years and punctuation. Run it with `node --test tests/numerology-calculator.test.mjs`. Numerology is presented as a symbolic tradition, not a scientifically validated prediction method.
