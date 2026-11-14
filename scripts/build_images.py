#!/usr/bin/env python3
"""Create browser-sized true WebP copies from the supplied artwork, preserving originals."""
import hashlib,io,json
from pathlib import Path
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[1]
def main():
    config=json.loads((ROOT/'data/site-images.json').read_text());report={};before=after=0
    for item in config['images']:
        source=ROOT/item['source'];raw=source.read_bytes();digest=hashlib.sha256(raw).hexdigest();before+=len(raw)
        for alias in item['aliases']:assert hashlib.sha256((ROOT/alias).read_bytes()).hexdigest()==digest,alias
        with Image.open(source) as original:
            source_format=original.format;image=ImageOps.exif_transpose(original);image.thumbnail(item['max_size'],Image.Resampling.LANCZOS)
            if image.mode not in ['RGB','RGBA']:image=image.convert('RGBA' if 'transparency' in image.info else 'RGB')
            output=io.BytesIO();image.save(output,format='WEBP',quality=84 if item['id'].startswith('tarot.') else 86,method=6);result=output.getvalue();dest=ROOT/item['output'];dest.parent.mkdir(parents=True,exist_ok=True)
            if not dest.exists() or dest.read_bytes()!=result:dest.write_bytes(result)
            after+=len(result);report[item['id']]={'path':item['output'],'width':image.width,'height':image.height,'source_sha256':digest,'source_format':source_format,'webp_sha256':hashlib.sha256(result).hexdigest(),'bytes':len(result)}
    (ROOT/'data/site-image-build.json').write_text(json.dumps({'images':report},ensure_ascii=False,indent=2)+'\n')
    print(f'Built {len(report)} true WebP site images: {before/1048576:.1f} MiB source → {after/1048576:.1f} MiB browser assets.')
if __name__=='__main__':main()
