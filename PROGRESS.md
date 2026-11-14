# Numerology research series — progress

Updated November 13, 2026 (America/Vancouver).

## Completed

| Series | Topic | PDF | Editable content |
|---|---|---|---|
| 01 | Personality | [Personality_Number_Research_Guide.pdf](Personality_Number_Research_Guide.pdf) | Unavailable; not reconstructed |
| 02 | Soul’s Desire | [Souls_Desire_Research_Guide.pdf](Souls_Desire_Research_Guide.pdf) | Unavailable; not reconstructed |
| 03 | Life Path | [Life_Path_Research_Guide.pdf](Life_Path_Research_Guide.pdf) | Unavailable; not reconstructed |
| 04 | Destiny / Expression | [Destiny_Expression_Research_Guide.pdf](output/pdf/Destiny_Expression_Research_Guide.pdf) | [JSON](data/destiny-expression.json), [Markdown](content/destiny-expression.md) |
| 05 | Minor Personality | [Minor_Personality_Research_Guide.pdf](output/pdf/Minor_Personality_Research_Guide.pdf) | [JSON](data/minor-personality.json), [Markdown](content/minor-personality.md) |
| 06 | Minor Soul’s Desire / Minor Soul Urge | [Minor_Souls_Desire_Research_Guide.pdf](output/pdf/Minor_Souls_Desire_Research_Guide.pdf) | [JSON](data/minor-souls-desire.json), [Markdown](content/minor-souls-desire.md) |
| 07 | Balance | [Balance_Number_Research_Guide.pdf](output/pdf/Balance_Number_Research_Guide.pdf) | [JSON](data/balance.json), [Markdown](content/balance.md) |

## Current and next topic

Balance is complete. **Current: Karmic Lessons**, series 08 — research draft prepared; final PDF layout awaits an accessible copy of the user’s new Personality.pdf design reference. **Next after completion: Hidden Passion**, series 09. Do not advance while Karmic Lessons remains unfinished.

After that, retain the order in [the project handoff](research/SERIES_HANDOFF.md): First–Third Life Cycles, First–Fourth Pinnacles, First–Fourth Challenges, and Birthday Number. Each position is a separate deliverable.

## Destiny / Expression conventions

- Full birth name; every letter included; repeating Pythagorean A–Z values.
- Reduce each name part first, preserving 11, 22, or 33, then combine and reduce by the same rule. Retained results: 1–9, 11/2, 22/4, 33/6.
- Numerology.com demonstrates combining unreduced letter totals; this can change a master result. Invented name Anna Alice yields 6 by name-part reduction, versus 33 by raw-total reduction.
- The existing calculator reduces Personality + Soul’s Desire for Destiny. This can differ: invented name Thomas Ann yields direct Expression 33/6, versus calculator Destiny 6. Calculator files and behavior remain unchanged.
- Current-name and minor-number conventions are separate. Decoz and Bender distinguish birth names from overlays; the Sarah Yip written article discusses a current legal name as Destiny. No universal naming rule is inferred.
- Clerical-error naming conventions differ between Decoz and Bender. Unknown birth names and non-Latin transliteration require explicit uncertainty, not invented inputs.

## Research and remaining limitations

Read full public Expression-specific articles from Decoz, Bender, and Numerology.com for all twelve results, plus Sarah Yip’s written article for a name-convention contrast: four publisher families, 29 cited pages. Yip does not supply result-level coverage in the article used. Multiple pages from one publisher are not counted as independent sources.

[Research notes](research/destiny-expression-sources.md) preserve exact URLs, titles, authors/publishers, access dates, per-result comparisons, exclusions, and limitations. No unresolved result-coverage gaps remain within the chosen twelve-result convention. Sources vary in how much 33 differs from 6. Ann Perry’s homepage returned a short HTTP 202 challenge response and was not counted. Yip’s embedded video was not reviewed. Numerology remains a symbolic belief system, not a validated assessment or prediction method.

## Validation performed

- Inspected all three existing PDFs’ extracted content and representative cover/profile layouts to match typography, navy/purple colors, Letter size, margins, and footer style. Confirmed all 46 existing pages contain searchable text. No editable sources of those guides were invented.
- Verified twelve retained results and twelve original three-paragraph profiles, each 201–219 words, against multiple position-specific interpretations. Practical final paragraphs and descriptive subtitles are identified as editorial synthesis.
- Independently recalculated the published Thomas Cruise Mapother example and both invented reduction comparisons. Inspected app.js without editing it.
- Built an 18-page PDF and generated Markdown from the same authoritative JSON.
- Extracted final PDF text and matched all 36 profile paragraphs to JSON; checked Letter dimensions, searchable text, page numbering, and absence of replacement/black-square glyphs.
- Rendered all 18 pages and visually inspected every page in contact sheets, with full-size checks of dense methodology and 33/6 pages. Re-rendered the final revision and inspected its changed methodology page. No clipping, orphaned headings, or blank pages observed.
- Verified three exact source link annotations on every profile and all 29 bibliography destinations. Re-requested all 29 exact URLs: HTTP 200 with substantive page bodies.
- Served the PDF locally for an internal download check: HTTP 200, application/pdf, exact bytes. No website was published and no external deployment occurred.
- Rebuilt from a different working directory into temporary paths; PDF and Markdown were byte-for-byte reproducible.
- All pre-existing tracked files, including the calculator and previous PDFs, remain unchanged. New files preserve the guide, research, builder, handoff, and progress.

Rebuild instructions are in [README.md](README.md). No environment configuration was reapplied or published during this research task.


## Minor Personality conventions and limitations

- Current first/middle/last inputs, with birth-name fallback when no alternative is supplied. Retain a current middle name when entered; distinguish this project input from Decoz’s short/social introduction name and Bender’s adjacent first/last-only minor-name rule.
- Consonants only; A/E/I/O/U excluded, Y and W included. Reduce each word before combining, retaining 11/22/33. Profile results: 1–9, 11/2, 22/4, 33/6. Roots are shown without rankings of worth.
- Decoz allows conditional Y; the project fixes it as a consonant. Invented Bobby Smith yields 1 here but 3 if Y is omitted. Invented birth name Robert James Smith yields Personality 7, distinct from current Bobby Smith’s Minor Personality 1.
- The existing calculator can return 0 for names with no consonants. Record that as a non-interpreted input case; no unsupported Minor Personality 0 profile was invented.
- Four publisher families and 29 cited documents were consulted live. Only Decoz supplies direct Minor result descriptions: explicit FAQs for eleven results and sample PDFs for 1 and 8. The consulted 5 article is main Personality only, so its entire current-name application is labeled editorial.
- Numerology.com supplies general number symbolism for comparison, not a second Minor-specific series. Bender and Sarah Yip supply name-convention contrasts, not Minor result profiles. No second publisher’s full Minor series was located within the accessible research destinations; this remains a material coverage gap. General symbolism is never counted as another Minor-specific interpretation.
- Per-result source roles, methodological contrasts, extrapolations, access limits, and original synthesis decisions are preserved in [research notes](research/minor-personality-sources.md) and JSON. The main and Minor Personality guides remain distinct; the earlier guide was not copied or replaced.

## Minor Personality validation

- Re-read the project handoff, agent instructions, progress, prior guide methodology, and representative existing PDF layouts.
- Built an 18-page Letter PDF with twelve original profiles, each 187–196 words, plus an evidence note on every result page. Markdown and PDF are generated from one JSON source.
- Verified all 36 profile paragraphs, twelve headings, and twelve evidence notes against extracted PDF text. Checked all page dimensions, page numbers, and absence of replacement/black-square glyphs.
- Rendered every page and inspected all 18 final pages in contact sheets, with an additional full-size check of the dense calculation page. Revised awkward title wraps before final rendering; no clipping, blank pages, or orphaned headings observed.
- Verified all profile source annotations and all 29 bibliography destinations. All 29 exact public article/PDF URLs returned HTTP 200 on the final link check.
- Evaluated the existing calculator’s nameNumbers function without editing it. Confirmed examples: Robert James Smith = 7, Bobby Smith = 1, A E = 0; Kevin = 11, Robert = 22, and invented Kevin Kevin Kevin = 33. The conditional-Y comparison was separately recalculated.
- Made the shared builder accept guide-specific presentation and output settings; the previous Destiny PDF and Markdown reproduced byte-for-byte in temporary output paths after the change. Final Minor output also passed a repeat-build check and an internal HTTP PDF download check.
- Calculator logic and earlier guide artifacts remain unchanged. Updated editable guide content, research, README, agent sequencing guidance, and progress only. No deployment, environment reconfiguration, or publication performed.


## Minor Soul’s Desire conventions and limitations

- Minor Soul’s Desire, Minor Soul Urge and Minor Heart’s Desire refer to the current-name counterpart of the main birth-name position. Use current first/middle/last inputs, with birth-name fallback when no alternative is supplied. Distinguish this project input from a shorter social introduction name.
- Count A=1, E=5, I=9, O=6 and U=3. Y and W are excluded to match the calculator. Reduce each word before combining, preserving 11, 22 and 33 at completed word/final totals. Results: 1–9, 11/2, 22/4, 33/6.
- Decoz explicitly uses the same calculation for main and minor and retains all three masters. His dedicated Minor article supplies direct profiles only for 1–9, 11 and 22. The 33/6 profile is an explicitly labeled editorial current-name adaptation from Decoz’s and Bender’s main Soul Urge 33 interpretations, with M’s minor framework and 6-root context. A direct Minor 33 description remains a source gap.
- Decoz uses conditional Y; Bender reports varying approaches to Y and occasional W variants. The project’s fixed rule can give a different result: invented Lynn Ng is 0 here but 7 with Y included. Zero is separately recorded as no vowel-derived result under the selected input rule, not a thirteenth motivational profile or an absence of desire.
- Invented Robert James Smith has main Soul’s Desire 8; current Bobby Smith has Minor Soul’s Desire 6. Invented John Amelia gives 4 by word reduction but 22 by combining raw vowel values. These examples were verified against the existing calculator and independent arithmetic.
- Three publisher families and 19 articles were consulted live: Decoz for direct minor material and calculation; Bender for twelve main Soul Urge comparisons and methodology; Numerology.com for the main position’s definition. Main material is not counted as another Minor series. Ann Perry’s linked Soul Urge PDF returned HTTP 202 HTML, not a readable PDF, and was not used.
- A second full Minor-specific publisher series was not located in the accessible research destinations. The guide labels source roles and does not claim whole-web completeness. Source assertions of enhanced capacities are reframed as symbolism, not demonstrated name effects. The main birth-name guide remains separate and unchanged.
- Exact source URLs, authors, titles, access dates, disagreements, per-result comparisons and editorial decisions are preserved in [research notes](research/minor-souls-desire-sources.md) and structured data.

## Minor Soul’s Desire validation

- Read the current agent instructions, progress and original handoff. Inspected relevant prior-guide text and cover/profile layouts for consistency.
- Built a 17-page Letter PDF: cover, two methodology pages, twelve original three-paragraph profiles (194–210 words each), and two bibliography pages. Markdown and PDF come from the same authoritative JSON; the shared builder required no changes.
- Verified the twelve retained results, all 36 profile paragraphs, twelve headings and twelve evidence notes against extracted PDF text. Checked searchable text, Letter dimensions, sequential page numbers, and absence of replacement/black-square glyphs.
- Rendered every page and visually inspected all 17 pages in contact sheets, plus full-size checks of the calculation page and the 33/6 adaptation page. Revised long title wraps before final rendering; no clipping, blank pages, or orphaned headings observed.
- Verified all profile source annotations and all 19 bibliography destinations. The final check of all 19 exact article URLs returned HTTP 200 with substantive content.
- Evaluated the existing nameNumbers function without editing it. Confirmed Soul values: Robert James Smith 8, Bobby Smith 6, Lynn Ng 0, John Amelia 4, Joe Ng 11, Joe Joe 22 and Joe Joe Joe 33. Independently checked conditional-Y and raw-total alternatives.
- Final repeat-build into temporary paths reproduced both PDF and Markdown byte-for-byte. An internal HTTP download check returned application/pdf, HTTP 200 and exact PDF bytes.
- Prior guide outputs and calculator logic remain unchanged. Added this guide’s data, Markdown, PDF and research notes, and updated README/progress. No environment reconfiguration, publication or deployment was performed.


## Balance conventions and limitations

- Full birth-name word initials; use repeating Pythagorean values and reduce the summed initials completely to 1–9. Decoz explicitly reduces masters in this position: 11→2, 22→4, 33→6. The guide contains nine result profiles, not twelve.
- The calculator currently preserves 11/22/33 through its shared reduction function. This discrepancy is documented without changing software. For app Balance 11 use guide 2; for 22 use 4; for 33 use 6. The JSON records this under calculator_compatibility.
- Decoz’s Thomas John Hancock example has initials T2+J1+H8=11 and guide result 2; the app displays 11. Invented Ivy Ian Dana gives app 22 / guide 4; Ivy Ian Isaac Ford gives app 33 / guide 6. Ordinary 1–9 outputs already agree. Zero is not a valid result for a nonempty alphabetic birth name under this method.
- The project takes an initial per whitespace-separated name word across birth first/middle/last fields. It removes apostrophes/hyphens within a word, so a hyphenated word supplies one initial. This tokenization is a documented project convention; no universal compound-name or transliteration rule is asserted.
- Eleven cited articles come from three publisher families. Decoz supplies the only direct Balance-specific series found in accessible material. Numerology.com supplies general number symbolism; Bender’s boundary-setting essay explicitly concerns Life Path. These are labeled as supplementary comparisons, not additional Balance series.
- A second accessible Balance-specific publisher remains a material gap. Exact-phrase Bender and Sarah Yip searches did not locate a direct series; Numerology.com’s live sitemap had no Balance article. Additional research sites were blocked by the configured network policy. No bypass, configuration change or claim of whole-web completeness was made.
- The profiles focus on choosing a response during difficulty, not fixed traits, inner motivation, a date-derived Challenge, or a prediction of hardship. Decoz’s blanket blame statement in Balance 6 and clinical/guaranteed-outcome claims are not adopted. Source roles, comparisons, exclusions and access limits are preserved in [research notes](research/balance-sources.md).

## Balance validation

- Read the current agent instructions, progress and handoff; inspected prior-guide text and representative PDF layouts.
- Built a 13-page Letter PDF: cover, two methodology pages, nine original three-paragraph profiles (197–212 words each), and one bibliography page. PDF and Markdown are generated from the same JSON.
- Verified all nine results, all 27 profile paragraphs, all headings and evidence notes against extracted PDF text. Confirmed the cover lists only 1–9, sequential page numbering, Letter dimensions, and absence of missing/replacement/black-square glyphs.
- Rendered and visually inspected every page in contact sheets, with full-size checks of the calculation page and bibliography. No clipping, orphaned headings or blank pages observed.
- Verified all profile source annotations and all 11 bibliography destinations; every exact source URL returned HTTP 200 with article content on the final link check.
- Executed the existing nameNumbers function without editing it; confirmed master-preserving Balance outputs 11, 22 and 33 for the documented fixtures and ordinary output 6 for Ada Ben Cora. Independently checked the fully reduced guide results.
- Made cover result labels and bibliography page size configurable so the nine-result guide does not inherit master-number labels or a nearly empty extra reference page. Compared old and new builders on the previous Minor Soul’s Desire data: both PDF and Markdown were byte-for-byte identical.
- Final Balance rebuild into temporary output paths reproduced both files exactly. Internal HTTP download verification returned 200, application/pdf, and the exact saved bytes.
- Calculator and previous guide outputs remain unchanged. The completed guide, research notes, builder adjustment, README and progress are included in the GitHub commit/push workflow requested by the user. No website deployment or environment publication is involved.


## Karmic Lessons — research draft, not complete

- The user now requires all remaining PDFs to match the structure and appearance of newly uploaded Personality.pdf. The file tool rejected transfer because the attachment exceeds 32 MiB. Its contents and layout have not been inspected. A compressed copy below the limit or smaller split PDF parts are required to finish layout work. No instructions from the uninspected attachment were adopted.
- Saved [structured research content](data/karmic-lessons.json), [editable reading draft](content/karmic-lessons.md), and [source notes](research/karmic-lessons-sources.md). Data is explicitly marked draft_pending_design_reference. The provisional PDF is retained outside the checkout at /tmp/karmic-work/Karmic_Lessons_Research_Draft.pdf, not published as a completed output in output/pdf.
- Karmic Lessons use the set of birth-name letter values absent from 1–9. The schema separates result_model, valid_lesson_values, lesson_profiles, empty_set_reading, and example_cases. Multiple lessons are not summed or reduced. None is an empty set, not Lesson 0 or proof that personal development is complete. Masters are not lesson members.
- Three publisher families and twelve cited articles were consulted live. Decoz supplies the direct missing-value method and all nine lessons. Numerology.com supplies general symbolism only. Decoz’s and Sarah Yip’s debt articles clarify a different category, not more lesson interpretations. A second accessible direct Karmic Lessons publisher remains a material source gap.
- The nine original profile drafts are 195–203 words each. Missing letters are not presented as proof of personal deficiency, past-life events, moral debt, deserved hardship or required future experiences. Calculator logic remains unchanged.
- Verified calculator cases: James Oliver Smith → [7]; James Smyth → [3, 6, 9]; James Oliver Smyth → []; A A → [2, 3, 4, 5, 6, 7, 8, 9]. Checked repeated-letter/punctuation invariance and rejection of empty input. Independently counted every frequency-table cell.
- Validated the provisional 15-page PDF: all 27 profile paragraphs and nine evidence notes match the structured content; all page dimensions and numbering are correct; every page was rendered and visually inspected. This does not validate a match to the newly supplied design. All twelve exact cited URLs returned HTTP 200 with article content.
- Added set-valued profile catalogs and optional methodology tables to the shared builder. Draft PDF/Markdown reproduce byte-for-byte; old/new builders produce identical Balance outputs for the previous single-result schema. Final output must be rebuilt and fully checked after the new template is available.
- The pending-reference state, research draft, reusable builder changes and user’s new design requirement are saved as work in progress for the GitHub sync workflow. No Karmic Lessons completion claim, environment publication or website deployment is made.


## Crystaleye homepage

- Built root index.html with responsive dark plum and gold styling, original eye artwork, calculator links, seven completed PDF guides, and existing tarot material. Added compressed WebP derivatives of three repository deck images; original artwork is preserved.
- Added accessible mobile navigation and progressively enhanced library search/category filters. Navigation and all guides remain available without JavaScript. No external runtime dependencies, analytics, or storage were added.
- Browser validation covers desktop and mobile layouts, 320px width, mobile menu dismissal/navigation, category/search/reset/empty states, local PDF destinations, and the existing calculator producing 21 result cards. Checked the no-JavaScript fallback and inspected rendered desktop/mobile pages.
- This website task does not advance the Karmic Lessons research draft or change calculator formulas and existing PDFs. Files are committed and pushed through the requested GitHub workflow; no deployment or environment publication is involved.


## Astrology wing

- Added an astrology hub and twelve static sign pages, preserving every supplied attribute and profile section. Added distinct Moon/rising readings, explainers for finding chart placements, and suggested romantic/friendship matches with symbolic-compatibility context.
- Optimized and featured all thirteen supplied images. The archive contains ten constellation images (Gemini–Pisces), with supplied celestial emblems used for Aries and Taurus. Added the astrology wing to root-home navigation and a new homepage feature.
- Built date-based free one-liners and an interactive three-placement email preview from a shared editorial reading engine. Sunday reflections, month-ahead previews, and last-day growth challenges combine on calendar overlaps and handle leap years. The starter library's rotation is documented; these readings do not use live planetary transits.
- The user confirmed $5.99 CAD/month and deferred Stripe/email integration. The offer is labeled coming soon; no payment, email collection, or sending service is active.
- Calendar/reading tests cover all signs and placement lenses, Sunday/month-boundary overlaps, leap years, invalid dates, preview shortcuts, and teaser/detail consistency. Browser checks cover profiles, local links/assets, anchors, element filters, preview controls, mobile navigation, and responsive/no-JavaScript behavior.
- Existing numerology calculations and PDFs are preserved. This separate website task does not advance the pending Karmic Lessons PDF.


## Tarot wing, merchandise, and shared cyberpunk styling

- Built the tarot hub with an animated free one-card daily draw, easy/mixed/demanding symbolic themes, and a local browser-tab session journal. Draws persist through refresh, including refresh during animation, and reset by local calendar date. All 78 cards are eligible; the three-card preview draws without replacement. Blocked storage and reduced motion have explicit fallbacks.
- Added a $5.99 CAD/month three-card subscription offer and public preview: yesterday's reflection, today's energy, and tomorrow's gratitude. Paid enrollment is coming soon, with no active account, payment, or sending service.
- Added five learning pages: a detailed three-act Major Arcana story with The Fool as prologue and all four suits with their symbolism, numbered-card narratives, court cards, and individual meanings. The existing deck artwork and reference PDF are preserved. Optimized derivatives cover all 78 cards and the supplied card back.
- Added the merchandise catalog and shop: guide $19.99 CAD, deck $39.99 CAD, bundle $49.99 CAD. All 22 pages include static product promotions and working shop links. Purchase ordering remains coming soon; no packaging, stock, or fulfillment details are fabricated.
- The user requested a full-site cyberpunk visual direction that blends with the supplied imagery. Added one shared theme across every page, using a continuous nebula backdrop, cyan/violet highlights, a subtle grid, geometric typography, and translucent surfaces. Site generators retain the shared theme and merchandise component on rebuild.
- Tests cover full-deck integrity, random selection, session restore and isolation, corrupt/blocked storage, unique spread cards, journal retention, and all existing astrology calendar rules. Browser checks cover 22 pages with product prices/links, animations, session persistence, no-JavaScript fallback, mobile navigation, and 320/390/768/1440px layouts. Local-day rollover and the calculator's 21-result behavior were also checked.
- No deployment, checkout activation, calculator formula changes, or PDF regeneration is part of this work. The pending Karmic Lessons guide remains at its prior status.


## Numerology website wing

- Built a main numerology page with plain-language introduction/history, a three-result calculator (Personality, Life Path, app Destiny), 21 topic overviews, and a $19.99 CAD one-time full-report offer marked coming soon. No payment or report delivery service was activated.
- Generated the twelve requested routes under every topic (1–9, 11, 22, 33), plus the remaining unreduced Birthday days and Challenge 0 routes: 276 result pages, 21 overviews, hub, and report page (299 numerology pages; 321 site-wide). Route/range notes distinguish unsupported values and Balance mappings instead of inventing profiles.
- Extracted 36 profiles from the three actual earlier PDFs, and checked 45 structured profiles against the four later PDFs, for 81 source-verified readings. Source files, page references, hashes, evidence notes, and source links are preserved in the website reading-copy data. Earlier PDF authoring sources were not invented or replaced.
- Remaining valid profiles are explicitly placeholders; the unfinished Karmic Lessons draft is not published as a completed guide. The full calculator's custom Challenge rule, Birthdays, set-valued results, and Destiny/Balance differences are explained at their topic pages. No PDF-series advancement or PDF changes occurred.
- The mini calculator matches the original app's number formulas, including the Destiny variant, while showing only three cards. Original calculator JavaScript is unchanged. Tests compare name variants and over 1,500 valid dates; result links, zero-consonant handling, invalid/future inputs, and privacy behavior are checked.
- Preserved the shared cyberpunk styling and merchandise across all pages, and linked the wing/report from the homepage, calculator, other wings, and shop. Source/PDF extraction and static-page generation are separately rebuildable.
- Archive 3.zip could not be transferred: the attachment tool reports that it exceeds 32 MiB. Its contents were not inspected, instructions were not adopted, and new artwork was not claimed as used. An accessible compressed/split copy is needed; existing shared artwork and number motifs are used meanwhile.
- Static checks validate all 321 HTML pages and more than 13,000 local links/assets/anchors. Browser checks cover quick-calculator workflows, topic discovery, representative reading/placeholder/convention pages, responsive navigation and no-JavaScript fallback.


## Complete image integration — November 14, 2026

- Fast-forwarded the user's two image commits from GitHub before making changes. The replacement sources are in assets/images/webpimages; the earlier source/optimized directories were removed in that upload, so prior page references needed new site copies.
- Accounted for all 139 uploads as 138 distinct illustrations and one byte-identical Aries alias. cyberttaurus.webp shows the Aries ram and is identical to ariescyber.webp; Taurus uses the actual bull in tauruscyber.webp. Other filename typos are explicitly mapped, not guessed from a partial name.
- Supplied files retain PNG encoding despite their WebP extensions. Preserved every upload unchanged and created 138 properly encoded, browser-sized WebP derivatives (~22.1 MiB total). Added source/output hashes, dimensions, roles, and an image coverage audit.
- Added all 21 numerology topic artworks, all twelve numeral illustrations, a three-topic homepage illustration, and matching quick-calculator result art. Compound Birthdays and Challenge 0 use topic art rather than an unrelated digit. The previous Archive 3 image block is resolved through the GitHub upload; no further archive upload is required for this artwork.
- Replaced the astrology hub and all twelve sign heroes with the correct zodiac portraits, and added the ten matching constellation panels separately. Updated the shared background to the starfield asset so it does not accidentally become a character portrait. Sun/Moon/rising emblems remain in their proper roles.
- Updated headers to use the supplied gem eye logo, restored the 78 card faces and card back from the new source collection, and routed homepage/shop/draw previews through the canonical deck assets. Retired the three redundant homepage tarot thumbnails. Page builders retain all new placements on rebuild.
- Automated audits cover all uploaded sources, actual WebP signatures/hashes, all static image/CSS references, all 321 pages' links/anchors, and the existing calculator/draw/calendar tests. Browser review checks image decoding, precise topic/sign/result mappings, animated card draw, and mobile layouts. Calculator formulas, existing written profiles/PDFs, prices, and subscription availability are unchanged.
