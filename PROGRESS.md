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

## Current and next topic

Minor Soul’s Desire / Minor Soul Urge is complete. **Next: Balance**, series 07. Stop here until the user asks to proceed. Do not generate the remaining series in a batch.

After that, retain the order in [the project handoff](research/SERIES_HANDOFF.md): Karmic Lessons, Hidden Passion, First–Third Life Cycles, First–Fourth Pinnacles, First–Fourth Challenges, and Birthday Number. Each position is a separate deliverable.

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
