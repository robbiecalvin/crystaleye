# Crystaleye

Completed guides and related project changes are committed and pushed to GitHub `main` after validation, as requested by the user. Publishing a cloud environment preserves its workspace snapshot separately; it does not replace a Git commit and push.

[Destiny / Expression](output/pdf/Destiny_Expression_Research_Guide.pdf) (04), [Minor Personality](output/pdf/Minor_Personality_Research_Guide.pdf) (05), [Minor Soul’s Desire](output/pdf/Minor_Souls_Desire_Research_Guide.pdf) (06), and [Balance](output/pdf/Balance_Number_Research_Guide.pdf) (07) are complete. [PROGRESS.md](PROGRESS.md) records the sequence and validation.

- Authoritative editable content: [data/destiny-expression.json](data/destiny-expression.json)
- Generated reading copy: [content/destiny-expression.md](content/destiny-expression.md)
- Source provenance, comparisons, and limitations: [research/destiny-expression-sources.md](research/destiny-expression-sources.md)
- Original project requirements: [research/SERIES_HANDOFF.md](research/SERIES_HANDOFF.md)

Rebuild from any directory with the prepared cloud environment:

```sh
/workspace/.crystaleye-tools/venv/bin/python /workspace/crystaleye/scripts/build_pdf.py
```

Elsewhere, use Python 3.12 with `reportlab==4.4.9` installed, then run `python scripts/build_pdf.py` from the checkout. `PyMuPDF==1.26.6` and `Pillow==13.0.0` support text/link inspection and page rendering. The builder accepts `--data`, `--pdf`, and `--markdown` paths. Edit JSON first; the builder regenerates both Markdown and PDF. Do not put source HTML or credentials in the repository.

The three previous guides remain at the repository root. Their editable sources are unavailable; no reconstruction from memory has been attempted. Numerology is presented as a symbolic tradition. Source agreement does not establish scientific validity.

The separate [calculator](numerology-calculator/README.txt) remains unchanged. It uses a different Destiny formula from the guide; see the guide’s calculation comparisons before expecting identical master-number results. No build or package installation is required to run its static files.


For Minor Personality, use the same builder with its authoritative data file:

```sh
/workspace/.crystaleye-tools/venv/bin/python /workspace/crystaleye/scripts/build_pdf.py --data /workspace/crystaleye/data/minor-personality.json
```

The data selects the correct PDF and Markdown filenames and guide-specific layout labels. The default command still builds Destiny / Expression. Minor Personality’s [JSON](data/minor-personality.json), [Markdown](content/minor-personality.md), and [research notes](research/minor-personality-sources.md) explicitly distinguish direct Minor material, general numeric comparisons, and editorial adaptations. In particular, 5 is an adaptation, and no second publisher’s full Minor series was located in the accessible research destinations.


Build Minor Soul’s Desire / Minor Soul Urge with:

```sh
/workspace/.crystaleye-tools/venv/bin/python /workspace/crystaleye/scripts/build_pdf.py --data /workspace/crystaleye/data/minor-souls-desire.json
```

Its [JSON](data/minor-souls-desire.json), [Markdown](content/minor-souls-desire.md), and [research notes](research/minor-souls-desire-sources.md) distinguish direct minor interpretations from main Soul Urge comparisons. The 33/6 profile is an explicit current-name adaptation; the calculation includes 33, but the consulted direct Minor series has no separate 33 entry.


Build Balance with:

```sh
/workspace/.crystaleye-tools/venv/bin/python /workspace/crystaleye/scripts/build_pdf.py --data /workspace/crystaleye/data/balance.json
```

Its [JSON](data/balance.json), [Markdown](content/balance.md), and [research notes](research/balance-sources.md) follow the sourced 1–9 Balance convention. Master totals are reduced for this guide, unlike the calculator’s current Balance formula; the correspondence is documented without changing calculator behavior. Direct Balance evidence comes from Decoz, while the other cited publishers supply explicitly labeled general-number and Life Path comparisons.


Karmic Lessons is in progress: [data](data/karmic-lessons.json), [reading draft](content/karmic-lessons.md), and [research notes](research/karmic-lessons-sources.md). It uses a set-valued result model, with multiple or no selected lessons. The user’s new Personality.pdf must be inspected and matched before the final PDF is produced; the uploaded attachment exceeded the file tool’s 32 MiB transfer limit. Previous layout output is provisional and is not listed as a completed guide. The same new design will apply to subsequent guides.


## Homepage

Open [index.html](index.html) for the responsive Crystaleye homepage: the existing numerology calculator, a searchable library of seven completed PDF guides, and the tarot guide with artwork from CyberPunkTarotDeck. No build, account, external service, or package installation is required. Search and mobile menu controls use progressive enhancement; navigation and PDF links also work without JavaScript.

To preview from the repository root:

```sh
python -m http.server 8000
```

Visit `http://localhost:8000`. Homepage styles and interactions are in `assets/site.css` and `assets/site.js`. The three WebP images in `assets/images` are compressed derivatives of the existing Star, Moon, and Sun deck images; originals are preserved. The in-progress Karmic Lessons draft is excluded from the completed library.


## Astrology

The [astrology wing](astrology/index.html) includes all twelve sign profiles with the supplied material, Moon and rising interpretations, suggested love/friendship pairings, free daily editorial one-liners, and a birth-chart calculation explainer. The upcoming daily email is priced at **$5.99 CAD/month** and has an interactive three-sign preview with Sunday, month-opening, and month-end additions. Stripe and email delivery are intentionally deferred at the user's request; the page clearly marks subscriptions as coming soon and collects neither payments nor email addresses.

See [astrology/README.md](astrology/README.md) for editable sources, rebuild instructions, reading-library limits, tests, and the future integration contract. The astrology content is generated with `python scripts/build_astrology.py`; no dependency installation is needed.
