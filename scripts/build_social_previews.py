#!/usr/bin/env python3
"""Frame the supplied logo for link previews and refresh static metadata across the site."""
import io
from PIL import Image,ImageOps
from site_metadata import ROOT,CONFIG,write_html

def save_png(image,path):
    output=io.BytesIO();image.save(output,format='PNG',optimize=True);raw=output.getvalue();path.parent.mkdir(parents=True,exist_ok=True)
    if not path.exists() or path.read_bytes()!=raw:path.write_bytes(raw)
def main():
    with Image.open(ROOT/CONFIG['logo_source']) as source:
        logo=ImageOps.exif_transpose(source).convert('RGB')
        # Trim only empty framing and retain a margin around all visible artwork.
        visible=logo.convert('L').point(lambda v:255 if v>15 else 0).getbbox();assert visible
        box=(max(0,visible[0]-24),max(0,visible[1]-24),min(logo.width,visible[2]+24),min(logo.height,visible[3]+24))
        cropped=logo.crop(box);preview=CONFIG['social_image'];card=Image.new('RGB',(preview['width'],preview['height']),(0,0,0))
        art=ImageOps.contain(cropped,(preview['width']-64,preview['height']-64),Image.Resampling.LANCZOS)
        card.paste(art,((card.width-art.width)//2,(card.height-art.height)//2));save_png(card,ROOT/preview['file'])
        size=CONFIG['touch_icon']['size'];save_png(ImageOps.contain(logo,(size,size),Image.Resampling.LANCZOS),ROOT/CONFIG['touch_icon']['file'])
    pages=[p for p in ROOT.rglob('*.html') if 'node_modules' not in p.parts and '.wrangler' not in p.parts]
    for path in pages:write_html(path,path.read_text())
    print(f'Built logo-only {card.width}×{card.height} PNG and touch icon; added static sharing metadata to all {len(pages)} pages.')
if __name__=='__main__':main()
