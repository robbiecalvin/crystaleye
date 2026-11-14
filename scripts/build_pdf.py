#!/usr/bin/env python3
"""Build the editable Markdown and Letter PDF from one authoritative guide JSON.

Requires reportlab. Run from any directory; defaults resolve from this script.
"""
from __future__ import annotations
import argparse
import json
import re
from datetime import date
from html import escape
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
NAVY = '#20243b'
PURPLE = '#7351a3'
MUTED = '#646779'
LEFT, WIDTH, BOTTOM = 58, 496, 65


def profile_data(data: dict) -> tuple[list, list]:
    """Return permitted identifiers and the guide's profile catalog."""
    if data.get('result_model', {}).get('type') == 'set':
        return data['valid_lesson_values'], data['lesson_profiles']
    return data['valid_results'], data['results']


def markdown(data: dict) -> str:
    _, profiles = profile_data(data)
    label = data.get('presentation', {}).get('markdown_result_label', 'Expression')
    parts = [f"# {data['title']}", f"Numerology Reference Series / {data['series_number']:02d}",
             f"Prepared for {data['prepared_for']} | {data['prepared_on']}", data['framing_note'],
             '## Overview and methodology']
    for section in data['methodology_sections']:
        parts += ['### ' + section['title'], section['text']]
        if section.get('table'):
            table = section['table']
            parts += ['\n'.join(['| ' + ' | '.join(map(str, table['headers'])) + ' |',
                                  '| ' + ' | '.join(['---'] * len(table['headers'])) + ' |'] +
                                 ['| ' + ' | '.join(map(str, row)) + ' |' for row in table['rows']])]
    for result in profiles:
        parts += [f"## {label} {result['number']}: {result['subtitle']}"]
        for field in ['core_meaning', 'potential_difficulties', 'constructive_direction']:
            parts.append(result[field])
        if result.get('evidence_note'):
            parts.append('Evidence scope: ' + result['evidence_note'])
        parts += ['Sources: ' + ', '.join(result['source_ids']), result['editorial_note']]
    parts.append('## Bibliography')
    for s in data['sources']:
        parts += [f"### [{s['id']}] {s['author_or_publisher']}",
                  f"[{s['title']}]({s['url']})", f"Accessed {s['accessed_on']}. {s['access_notes']}",
                  'Coverage: ' + s['coverage']]
    return '\n\n'.join(parts) + '\n'


def build(data: dict, output: Path) -> None:
    valid_values, profiles = profile_data(data)
    assert valid_values and len(set(valid_values)) == len(valid_values)
    assert [r['number'] for r in profiles] == valid_values
    display = data.get('presentation', {})
    sources = {s['id']: s for s in data['sources']}
    assert len(sources) == len(data['sources'])
    for result in profiles:
        assert len(result['source_ids']) >= 2
        assert all(s in sources for s in result['source_ids'])
        assert all(result[k].strip() for k in ['core_meaning', 'potential_difficulties', 'constructive_direction'])
    output.parent.mkdir(parents=True, exist_ok=True)
    canvas = Canvas(str(output), pagesize=(612, 792), invariant=1, pageCompression=1)
    canvas.setTitle(data['title'] + ' — Research Guide')
    canvas.setAuthor('Crystaleye / Numerology Reference Series')
    canvas.setSubject('Researched symbolic interpretations; calculation conventions and linked sources')
    page = 0

    def link(label: str, url: str) -> str:
        return f'<link href="{escape(url, quote=True)}" color="{PURPLE}">{escape(label)}</link>'

    def rich(text: str) -> str:
        text = escape(text)
        def citations(match):
            return re.sub(r'\b[A-Z][A-Z0-9]*\b',
                          lambda m: link(m[0], sources[m[0]]['url']) if m[0] in sources else m[0], match[0])
        return re.sub(r'\[[^\]]+\]', citations, text).replace('\n', '<br/>')

    def para(text: str, y: float, size=11, leading=16, bold=False, color=NAVY,
             gap=12, markup=False) -> float:
        style = ParagraphStyle('p', fontName='Helvetica-Bold' if bold else 'Helvetica',
                               fontSize=size, leading=leading, textColor=colors.HexColor(color))
        p = Paragraph(text if markup else rich(text), style)
        _, h = p.wrap(WIDTH, 700)
        if y - h < BOTTOM:
            raise ValueError(f'Page {page}: content exceeds bottom margin ({y-h:.1f}); {text[:60]}')
        p.drawOn(canvas, LEFT, y - h)
        return y - h - gap

    def start(label: str | None = None) -> float:
        nonlocal page
        page += 1
        canvas.setFillColor(colors.white)
        canvas.rect(0, 0, 612, 792, fill=1, stroke=0)
        canvas.setStrokeColor(colors.HexColor('#d7d5e1'))
        canvas.setLineWidth(0.5)
        canvas.line(48, 40, 564, 40)
        canvas.setFillColor(colors.HexColor(MUTED))
        canvas.setFont('Helvetica', 8)
        canvas.drawString(48, 27, display.get('footer_label', 'NUMEROLOGY  /  DESTINY & EXPRESSION'))
        canvas.drawRightString(564, 27, str(page))
        if label:
            canvas.drawString(48, 761, label)
        return 722

    def end():
        canvas.showPage()

    stamp = date.fromisoformat(data['prepared_on']).strftime('%B %d, %Y')
    y = start()
    y = 675
    y = para(f"NUMEROLOGY REFERENCE SERIES / {data['series_number']:02d}", y, 8.5, 12, color=PURPLE, gap=16)
    y = para(display.get('cover_title', 'Destiny / Expression'), y, 27, 33, bold=True, gap=19)
    y = para(display.get('cover_subtitle', 'Twelve interpretations of capacities and expression'), y, 17, 23, bold=True, gap=12)
    y = para(display.get('cover_results', '1, 2, 3, 4, 5, 6, 7, 8, 9, 11/2, 22/4 and 33/6'), y, 8.5, 12, color=PURPLE, gap=40)
    y = para(display.get('cover_intro', 'Original descriptions synthesized from position-specific numerology sources, with calculation comparisons and practical editorial guidance.'), y, gap=35)
    y = para('Reading note', y, 8.5, 12, color=PURPLE, gap=12)
    y = para(data['framing_note'], y, gap=16)
    para(f"Prepared for {data['prepared_for']} | {stamp}", y, 8.5, 12, color=MUTED)
    end()

    method_pages = display.get('methodology_pages', [
        {'title': 'Understanding the number', 'section_indices': list(range(5))},
        {'title': 'Methods and research decisions', 'section_indices': list(range(5, len(data['methodology_sections'])))}])
    for method_page in method_pages:
        title = method_page['title']
        sections = [data['methodology_sections'][i] for i in method_page['section_indices']]
        y = start(display.get('section_label', 'CAPACITIES AND THEIR EXPRESSION'))
        y = para(title, y, 24, 29, bold=True, gap=17)
        for section in sections:
            y = para(section['title'], y, 12, 16, bold=True, gap=5)
            y = para(section['text'], y, 10, 14, gap=13)
            if section.get('table'):
                table = section['table']
                rows = [table['headers']] + table['rows']
                cells = []
                for row_index, row in enumerate(rows):
                    style = ParagraphStyle('cell', fontName='Helvetica-Bold' if row_index == 0 else 'Helvetica',
                                           fontSize=9, leading=12, alignment=1, textColor=colors.HexColor(NAVY))
                    cells.append([Paragraph(escape(str(value)), style) for value in row])
                widths = table.get('column_widths', [WIDTH / len(rows[0])] * len(rows[0]))
                grid = Table(cells, colWidths=widths)
                grid.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1eef7')),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#d7d5e1')),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ]))
                _, height = grid.wrap(WIDTH, 700)
                if y - height < BOTTOM:
                    raise ValueError(f'Page {page}: table exceeds bottom margin')
                grid.drawOn(canvas, LEFT, y - height)
                y -= height + 14
        end()

    for result in profiles:
        y = start(display.get('section_label', 'CAPACITIES AND THEIR EXPRESSION'))
        y = para(display.get('result_label', 'EXPRESSION') + ' ' + str(result['number']), y, 8.5, 12, color=PURPLE, gap=14)
        y = para(result['subtitle'], y, 27, 32, bold=True, gap=18)
        for field in ['core_meaning', 'potential_difficulties', 'constructive_direction']:
            y = para(result[field], y)
        if result.get('evidence_note'):
            y = para('Evidence scope: ' + result['evidence_note'], y - 5, 8.5, 12, color=MUTED, gap=6)
        refs = []
        for sid in result['source_ids']:
            s = sources[sid]
            refs.append(link('[' + sid + '] ' + s['author_or_publisher'].split(' / ')[0], s['url']))
        y = para(' | '.join(refs), y - 14, 8.5, 12, color=MUTED, markup=True, gap=10)
        para(result['editorial_note'], y, 8.5, 12, color=MUTED)
        end()

    # Guides can choose a reference count suited to their titles and source list.
    references_per_page = display.get('bibliography_page_size', 10)
    assert isinstance(references_per_page, int) and references_per_page > 0
    for idx, offset in enumerate(range(0, len(data['sources']), references_per_page), start=1):
        y = start('SOURCE REFERENCES')
        y = para('Bibliography' + (f' / {idx}' if idx > 1 else ''), y, 24, 29, bold=True, gap=12)
        y = para('Titles link to the exact source pages. All accessed ' + stamp + '.', y, 9, 13, color=MUTED, gap=17)
        for s in data['sources'][offset:offset + references_per_page]:
            y = para('[' + s['id'] + '] ' + s['author_or_publisher'], y, 9, 12, bold=True, gap=3)
            y = para(link(s['title'], s['url']), y, 9.5, 13, markup=True, gap=13)
        if idx == 1:
            para(display.get('bibliography_note', 'Decoz, Bender, and Numerology.com supply Expression profiles. Yip supplies a name-convention comparison only; her embedded video was not reviewed. Detailed access and comparison notes are preserved in the editable research file.'), y, 9, 13, color=MUTED)
        end()
    canvas.save()
    print(f'Built {page} pages: {output}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--data', type=Path, default=ROOT / 'data/destiny-expression.json')
    parser.add_argument('--pdf', type=Path)
    parser.add_argument('--markdown', type=Path)
    args = parser.parse_args()
    data = json.loads(args.data.read_text(encoding='utf-8'))
    args.pdf = args.pdf or ROOT / 'output/pdf' / data.get('pdf_filename', 'Destiny_Expression_Research_Guide.pdf')
    args.markdown = args.markdown or ROOT / 'content' / (data['id'] + '.md')
    build(data, args.pdf)
    args.markdown.parent.mkdir(parents=True, exist_ok=True)
    args.markdown.write_text(markdown(data), encoding='utf-8')
    print(f'Built editable Markdown: {args.markdown}')


if __name__ == '__main__':
    main()
