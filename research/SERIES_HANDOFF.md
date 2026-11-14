# Numerology Research Series — Project Handoff

## Objective

Continue a series of researched numerology reference guides.

For each topic:
1. Consult several relevant sources.
2. Compare their interpretations and identify meaningful disagreements.
3. Merge the researched themes into one original, freshly worded description for each valid result.
4. Produce a polished downloadable PDF with clickable source references.
5. Preserve editable content and research notes in the repository.

Complete ONE topic at a time. Do not automatically research or generate the entire remaining series.

## Completed work

The following guides are complete:

- Personality_Number_Research_Guide.pdf
- Souls_Desire_Research_Guide.pdf
- Life_Path_Research_Guide.pdf

Inspect these PDFs before continuing. Use them as the reference for depth, tone, structure, and visual consistency.

Do not claim to have inspected a file that is absent or unreadable. Identify any missing reference files, then continue with the requirements below where possible.

The next topic is:

**Destiny Number, also called the Expression Number.**

## Remaining sequence

Proceed in this order:

1. Destiny / Expression
2. Minor Personality
3. Minor Soul’s Desire / Minor Soul Urge
4. Balance
5. Karmic Lessons
6. Hidden Passion
7. First Life Cycle
8. Second Life Cycle
9. Third Life Cycle
10. First Pinnacle
11. Second Pinnacle
12. Third Pinnacle
13. Fourth Pinnacle
14. First Challenge
15. Second Challenge
16. Third Challenge
17. Fourth Challenge
18. Birthday Number

Each numbered item is a separate deliverable. Stop after completing the current item and identify the next topic.

When the user says “proceed” or “next,” complete the next unfinished item.

## Research requirements

Browse the web for each new topic. Do not generate interpretations solely from memory or recycle earlier descriptions with a different heading.

Use at least three substantive sources for each topic where available. Prefer four.

Useful starting sources include:

- Hans Decoz / World Numerology:
  https://www.worldnumerology.com/
- Felicia Bender:
  https://feliciabender.com/
- Numerology.com:
  https://www.numerology.com/
- Ann Perry:
  https://annperrynumerologist.com/
- Sarah Yip, particularly for contrasting methods:
  https://sarahyip.com/

These are starting points, not an exclusive source list.

Prefer material specifically discussing the requested chart position. General number symbolism may supplement position-specific research but must not silently substitute for it.

For each possible result:
- Compare at least two relevant interpretations where available.
- Record which sources support the description.
- Identify where an interpretation is an extrapolation.
- State gaps honestly when position-specific coverage is limited.

Read the relevant source content. Search snippets alone are insufficient for a deep research claim. If only a snippet is accessible, label that limitation.

Multiple pages from one publisher count as one source family. Do not imply that agreement among websites establishes scientific validity or that all sources are independent.

Record:
- Author or publisher
- Page title
- Exact URL
- Access date
- Relevant themes
- Methodological disagreements
- Access limitations

## Determine valid results before writing

Do not assume every topic uses 1–9, 11, 22, and 33.

Research the valid results and calculation conventions for each position first.

Examples requiring particular care:
- Challenge Numbers may include 0 and generally use a different result range.
- Karmic Lessons concern missing values in a name and may produce multiple lessons or none.
- Hidden Passion may produce tied results.
- Birthday Numbers may be interpreted through the actual day, 1–31, as well as a reduced number.
- Life Cycles and Pinnacles require position-specific interpretation.

Document the chosen convention and any consequential alternatives.

Do not confuse:
- Karmic Lessons with Karmic Debt
- Destiny / Expression with Life Path
- Birth-name numbers with current-name or minor numbers
- A general number meaning with its meaning in a particular cycle or position

## Existing calculator convention

A related calculator project uses:
- Full birth name for the main name-derived numbers.
- Current-name inputs for the minor numbers.
- Birth-name inputs copied into current-name inputs when no alternative name is supplied.

This is a project convention. Some sources define minor numbers using a short or socially used name instead. Explain that distinction where relevant.

The user also requested that negative Challenge results become 0 in the calculator. This is an existing software requirement, not a researched universal numerology rule.

If research shows that a conventional Challenge formula uses an absolute difference, document the discrepancy. Do not silently alter calculator behavior or present the clamp-to-zero rule as standard numerology.

Do not modify the calculator unless explicitly asked.

## Writing requirements

Write complete, original descriptions that integrate the research rather than presenting a collection of source summaries.

Aim for approximately 170–230 words per result when the source material supports that depth. Do not pad sparse material.

Use three connected paragraphs:

1. **Core meaning**
   Explain the number in this specific chart position, including its central themes and constructive qualities.

2. **Potential difficulties**
   Explain tensions, excesses, underdeveloped expressions, and possible misunderstandings.

3. **Constructive direction**
   Offer a practical synthesis of how the themes can be expressed constructively.

Clearly distinguish editorial guidance from claims made by sources.

For the main name-number guides, second-person language is appropriate. Use cautious wording such as “you may,” “this interpretation emphasizes,” or “within numerology.”

For Life Cycles, Pinnacles, and Challenges, describe the relevant phase or developmental theme rather than treating the result as a fixed personality.

Make the four Pinnacle guides meaningfully distinct by position. Do the same for the four Challenge guides and three Life Cycle guides.

Preserve distinctions:
- Personality: outward impression.
- Soul’s Desire: inner motivation and fulfillment.
- Life Path: broad developmental themes.
- Destiny / Expression: name-derived capacities and ways of expressing them, according to the researched tradition.

Do not merely reuse the same twelve descriptions across topics.

## Evidence and interpretation boundaries

Present numerology as a symbolic belief system, not a scientifically validated assessment or prediction method.

Include one concise framing note in each guide. Avoid repeatedly interrupting the descriptions with disclaimers.

Do not assert that a number proves:
- A person’s appearance or medical condition
- Trauma, abuse, or childhood events
- Addiction or a mental-health diagnosis
- Psychic or supernatural abilities
- Guaranteed wealth, success, relationships, or future events
- A requirement to marry, have children, or enter a profession

Do not suggest that suffering or mistreatment was deserved, necessary, or caused by someone’s number.

Master numbers are not rankings of human worth. Where retained, show their roots as 11/2, 22/4, and 33/6.

Respect source copyright. Synthesize ideas in original language, keep quotations minimal, and obey applicable source limits. Rewording does not remove attribution requirements.

## Repository structure

Use an existing sensible structure if present. Otherwise:

AGENTS.md
README.md
PROGRESS.md
content/
  personality.md
  souls-desire.md
  life-path.md
  destiny-expression.md
research/
  destiny-expression-sources.md
data/
  destiny-expression.json
scripts/
  build_pdf.py
output/
  pdf/
    Destiny_Expression_Research_Guide.pdf

Create additional files as later topics are completed.

Do not reconstruct editable versions of completed guides from memory. Extract and verify their PDFs if conversion is needed, or mark editable source as unavailable.

## Structured content

Store each new guide in a reusable format suitable for future website or calculator integration.

Suggested JSON structure:

{
  "id": "destiny-expression",
  "title": "Destiny / Expression Number",
  "series_number": 4,
  "overview": "...",
  "calculation_convention": "...",
  "valid_results": ["..."],
  "methodology_notes": ["..."],
  "results": [
    {
      "number": "...",
      "root_number": null,
      "subtitle": "...",
      "core_meaning": "...",
      "potential_difficulties": "...",
      "constructive_direction": "...",
      "source_ids": ["..."]
    }
  ],
  "sources": [
    {
      "id": "...",
      "author_or_publisher": "...",
      "title": "...",
      "url": "...",
      "accessed_on": "...",
      "access_notes": "..."
    }
  ]
}

Populate every field with verified content. Adjust the schema for multi-result topics such as Karmic Lessons or Hidden Passion rather than forcing them into a misleading single-number model.

Generate the Markdown and PDF from the same authoritative content where practical to prevent inconsistencies.

## PDF requirements

Match the completed series as closely as practical:

- US Letter pages
- White background
- Dark navy text
- Muted purple accents
- Consistent headings and generous margins
- Cover page with series number
- Overview and methodology
- One page per result when practical
- Source references associated with each result
- Final bibliography with clickable links
- Page numbers and consistent footers
- Selectable, searchable text

Use readable typography. Avoid clipping, awkward page breaks, orphaned headings, excessive blank pages, and broken characters.

## Verification

Before declaring a guide complete:

1. Verify the valid result range.
2. Confirm every required result has a description.
3. Check that each description fits the requested chart position.
4. Verify source attribution and distinguish disagreements.
5. Generate the PDF.
6. Extract its text and check for missing content or broken characters.
7. Render every page and visually inspect the layout.
8. Fix defects and inspect the revised output.
9. Confirm that source links and the downloadable file work.
10. Update PROGRESS.md.

If rendering or browsing is unavailable, report the limitation explicitly. Do not claim unperformed verification.

Use focused checks appropriate to this document project; do not build an unnecessary testing framework.

## Progress tracking

PROGRESS.md should record:
- Completed topics and output paths
- Current topic
- Next topic
- Chosen calculation conventions
- Unresolved source gaps
- Validation performed

At the start of a session, inspect progress and existing files before repeating work.

## Completion response

When the current guide is finished:
- Provide a direct link to the PDF.
- Briefly state what it includes.
- Mention any material research limitation.
- Identify the next topic.
- Stop and wait for the user to continue.

Do not publish a website, deploy an application, or change calculator logic as part of this research task.