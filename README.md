# Crystaleye numerology reference series

Completed guides and related project changes are committed and pushed to GitHub `main` after validation, as requested by the user. Publishing a cloud environment preserves its workspace snapshot separately; it does not replace a Git commit and push.

[Destiny / Expression](output/pdf/Destiny_Expression_Research_Guide.pdf) (04), [Minor Personality](output/pdf/Minor_Personality_Research_Guide.pdf) (05), and [Minor Soul’s Desire](output/pdf/Minor_Souls_Desire_Research_Guide.pdf) (06) are complete. [PROGRESS.md](PROGRESS.md) records the sequence and validation.

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
