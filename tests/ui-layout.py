"""Guard the approved homepage hierarchy and library/result availability."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
home=(ROOT/'index.html').read_text()
hub=(ROOT/'numerology/index.html').read_text()
assert 'class="guide-row"' not in home
assert hub.count('class="guide-row"')==7
assert 'home-shop-preview' in home
for action in ['Read your horoscope','Draw today’s card','Find your three numbers']:
    assert action in home or action in (ROOT/'numerology/numerology.js').read_text(),action
for page in (p for p in ROOT.rglob('*.html') if 'node_modules' not in p.parts and '.wrangler' not in p.parts and 'mobile' not in p.parts):
    assert page.read_text().count('assets/ui.css?v=1')==1,page
assert 'data-status="ready"' in (ROOT/'numerology/personality/index.html').read_text()
assert 'Profiles coming soon' in hub
print('Passed: compact homepage, seven-guide Numerology library, clear actions, profile availability and shared UI on every route.')
