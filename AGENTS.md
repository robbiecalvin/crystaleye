# Numerology reference series

Read PROGRESS.md and research/SERIES_HANDOFF.md before continuing. Complete one topic per request; use the current next topic recorded in PROGRESS.md. Do not generate the rest of the series automatically.

Research each new topic live, read at least three substantive source families where available, verify the result range and calculation conventions, and record per-result support and disagreements. Keep source limitations explicit. Numerology is symbolic, not a validated assessment or prediction method.

Use structured data as the source of truth and generate Markdown and PDF together. Inspect reference PDFs, extracted output text, links, and every rendered page. Preserve calculator behavior and existing guides unless explicitly asked to change them. Do not invent editable versions of earlier guides.

Use the existing isolated checkout; do not create a Git worktree unless the user requests one. Avoid generated page images, source HTML caches, virtual environments, and credentials in the repository. Do not publish a website or deploy an application as part of guide generation.

The user requests ongoing GitHub synchronization. After completing and validating each guide, add, commit, and push all project deliverables and related changes to origin/main: PDFs, editable content, structured data, research notes, builder changes, and progress/documentation. Do not leave completed work only in the environment snapshot. Check remote changes before pushing, preserve other contributors' work, and never force-push. Verify that the remote branch contains the commit and report the result. Exclude scratch files, dependency environments, caches, and credentials.
