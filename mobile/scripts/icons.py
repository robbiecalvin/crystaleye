"""Resize the supplied Crystal Eye logo into native icon/splash resource sizes."""
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
logo=Image.open(ROOT/'assets/images/site-logo.webp').convert('RGBA')
def frame(size,fraction=.85):
 image=Image.new('RGB',size,'#080b19');mark=logo.copy();mark.thumbnail((round(size[0]*fraction),round(size[1]*fraction)),Image.Resampling.LANCZOS);image.paste(mark,((size[0]-mark.width)//2,(size[1]-mark.height)//2),mark);return image
for path in (ROOT/'mobile/ios/App/App/Assets.xcassets').rglob('*.png'):
 with Image.open(path) as old:size=old.size
 frame(size,.85 if 'AppIcon' in str(path) else .23).save(path,optimize=True)
for path in (ROOT/'mobile/android/app/src/main/res').rglob('*.png'):
 with Image.open(path) as old:size=old.size
 fraction=.58 if 'foreground' in path.name else .85 if 'launcher' in path.name else .23
 frame(size,fraction).save(path,optimize=True)
for path in [ROOT/'mobile/android/app/src/main/res/values/ic_launcher_background.xml']:
 path.write_text('<?xml version="1.0" encoding="utf-8"?><resources><color name="ic_launcher_background">#080b19</color></resources>\n')
print('Generated native icon and splash resources from the existing eye logo.')
