# Crystaleye numerology wing

The main page is `numerology/index.html`, with a simple three-result calculator, introductory explanation, historical context, all 21 topic links, and the planned **Full Numerology report — $19.99 CAD, one-time purchase**. Ordering remains coming soon, consistent with the user's decision to defer payments. No report is presented as ready for immediate delivery while its remaining guide content is unfinished.

## Page structure and status

There are 21 topic overviews and 276 result routes, plus the hub and report page: **299 numerology HTML pages**. Every topic includes the requested twelve routes for 1–9, 11, 22, and 33, using directories such as `/numerology/personality/number-4/`. Static hosting redirects the extensionless directory path to its index page.

Birthday also gets the other calendar-day values through 31, and each Challenge gets a zero route. A route is not automatically a valid or completed interpretation. Balance masters explain their mapping to 2/4/6, Karmic Lessons and Hidden Passion explain their 1–9 sets, Birthday 33 explains the calendar limit, and cycle/Challenge pages identify calculation limits. These convention notes prevent a general master interpretation from being reused for a position that does not support it.

**81 result pages** reproduce profiles from the seven completed guides: Personality, Soul’s Desire, Life Path, Destiny/Expression, Minor Personality, Minor Soul’s Desire, and Balance. Other valid results are marked “Profile coming soon”; unsupported/reserved routes have range notes. Unfinished and convention-only pages use `noindex,follow`. Karmic Lessons research drafts have not been relabeled as completed PDF material.

All pages retain the shared cyberpunk theme, navigation, and three merchandise promotions. The root homepage, full calculator, astrology footer, tarot footer, and shop link into the new wing or report offer. The site now has 321 HTML pages in total.

## Sources and editable files

- `data/numerology-topics.json`: the 21 introductions, explicit calculation conventions, valid-result ranges, and report price/status. Overviews for unfinished topics explain the existing calculator positions; they are not new researched result guides.
- `data/numerology-profiles.json`: website reading copies, PDF page numbers, source links/notes, and source SHA-256 hashes for the seven completed guides. These copies are **not replacement PDF authoring sources**. Earlier PDF originals remain unchanged.
- `scripts/prepare_numerology_profiles.py`: refreshes the reading copies. It extracts the first three guides from the actual PDFs, preserving their three-paragraph profiles, and checks the structured content of the other four against extracted PDF text. It requires PyMuPDF. All 81 copies were checked against their completed PDFs.
- `scripts/build_numerology.py`: generates all numerology HTML using the data above. It needs only Python 3.12+ and the standard library.
- `number-engine.mjs`, `numerology.js`, and `numerology.css`: maintained calculator logic, interactions, and layouts.

Rebuild the pages after changing website data:

```sh
python scripts/build_numerology.py
```

Refresh extracts only after a completed source guide changes:

```sh
/workspace/.crystaleye-tools/venv/bin/python scripts/prepare_numerology_profiles.py
python scripts/build_numerology.py
```

The existing numerology PDF builder and its original guide data remain separate. No PDFs were generated or modified for this website change.

## Quick-calculator conventions

The mini calculator uses a full birth-name field and a birth-date field and shows exactly three result cards: Personality, Life Path, and app Destiny. The pure calculation module was compared with the untouched full calculator across name variants and more than 1,500 valid date samples. It normalizes accented Latin letters, accepts name spaces/apostrophes/hyphens, uses A/E/I/O/U as vowels and Y as a consonant, and preserves 11/22/33 at completed reduction steps. A zero consonant total gets an uninterpreted dash and a method link, not an invented Personality 0 reading.

Destiny deliberately retains the existing app's `reduce(Personality + Soul's Desire)` formula. The completed Expression guide uses word-by-word all-letter totals, which can produce a different master result. This difference is visible in the UI and calculation detail; Thomas Ann gives app Destiny 6 and guide Expression 33/6. The original calculator's JavaScript and formulas have not been changed.

The existing full app's 1800–2026 birth-year range is retained. The mini calculator additionally rejects future birth dates. It stores nothing, sends no name or birth details to a server, and uses no local/session storage. Its result links go to the corresponding topic profile. The advanced calculator remains freely accessible for all 21 values.

The Challenge overviews explicitly identify the existing app's custom zero-clamped, master-preserving subtraction rule, which differs from common absolute-difference/single-digit methods. They do not publish generic master Challenge interpretations or assign unresearched stage timings.

## History and image status

The main-page history distinguishes ancient number symbolism/Pythagorean traditions from later name-and-date numerology rather than assigning one founding date to all systems. It links to Stanford's Pythagoras entry as background context. This task did not involve new live research guides; attempts to retrieve external historical reference pages were blocked by the environment's network access. No claim of live source verification is made.

The user's **Archive 3.zip** exceeded the attachment tool's 32 MiB transfer limit. Its contents and images could not be inspected or incorporated. No instructions from it were adopted. A compressed or split archive below the transfer limit is needed to apply that new artwork. The wing currently uses the existing shared imagery-driven theme and original geometric number motifs; it does not claim to feature the inaccessible new images.

## Verification

```sh
node --test tests/*.test.mjs
python tests/numerology-pages.py
```

Checks cover all 321 pages' local links/assets/anchors, twelve standard routes per topic, calendar/Challenge extras, source-profile text, and shared styling/merchandise. Browser checks cover the mini calculator, method differences, invalid input and clear, topic filters/search, completed/placeholder/convention examples, no-JavaScript navigation, and desktop/mobile layouts. No paid report is generated, customer information collected, or deployment performed.
