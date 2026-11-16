"""Create a portable native source package with one built web payload."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
ROOT=Path(__file__).resolve().parents[1]
output=ROOT/'releases/Crystal-Eye-iOS-Android-source.zip'
output.parent.mkdir(exist_ok=True)
ignored={'node_modules','releases','.gradle','.idea','build','build-ios','DerivedData','.DS_Store','local.properties','capacitor-cordova-android-plugins','capacitor-cordova-ios-plugins'}
with ZipFile(output,'w',ZIP_DEFLATED,compresslevel=6) as archive:
 for path in sorted(ROOT.rglob('*')):
  rel=path.relative_to(ROOT)
  if not path.is_file() or any(p in ignored for p in rel.parts):continue
  if rel.as_posix().startswith(('android/app/src/main/assets/','ios/App/App/public/')):continue
  if path.suffix in {'.jks','.keystore','.p12','.mobileprovision'}:continue
  archive.write(path,Path('mobile')/rel)
print(output)
print(f'{output.stat().st_size/1024/1024:.1f} MiB native-source bundle; no compiled binaries.')
