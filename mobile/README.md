# Crystal Eye for iOS and Android

Capacitor 8 native projects wrap the same bundled website, calculators, guides, artwork, animations, and Supabase customer accounts. **This is a native source package, not a signed IPA/APK or an App Store/Google Play submission.** No store listing has been created and no developer account or signing credential is assumed.

- Display name: **Crystal Eye**
- Initial application identifier: `com.crystaleye.app` (confirm availability/ownership in your developer accounts before release)
- iOS 15+ and Android API 24+; Android compile/target SDK 36.
- Website content is bundled locally, not loaded from a remote `server.url`. Approximately 30 MB before native frameworks/compression. The 661 MB original artwork upload directory is excluded; optimized artwork and existing public PDFs are included.
- Sign-in/saved cloud readings require internet. Native and website installs share the same Supabase users/cloud records, but each browser/app installation has its own sign-in session.
- Existing tarot and astrology subscription previews remain previews. This package does not activate Stripe, store billing, email delivery, or appointment hosting.

## Build from this Git repository

Use Node 22+ and npm. The checked-in SDK bundle under `account/vendor/` is already built.

```sh
npm ci --prefix mobile
npm run sync --prefix mobile
npm test --prefix mobile
```

This prepares `mobile/www`, updates native plugin references, and copies the app assets to both platform projects. `www` and copied assets are rebuildable and intentionally ignored in Git. Never run the site's HTML builders against native generated assets; the site tools exclude `mobile/`.

Open `mobile/android` with Android Studio, or `npm run android --prefix mobile`. Install Android SDK 36/build-tools and Java 21. To create an installable **debug** APK locally:

```sh
cd mobile/android
chmod +x gradlew
./gradlew assembleDebug
```

Output: `app/build/outputs/apk/debug/app-debug.apk`. A Play Store release needs your own signing/upload key and a signed Android App Bundle. Do not commit signing keys or passwords.

On a Mac with current Xcode and its iOS SDK, open `mobile/ios/App/App.xcodeproj` (or `npm run ios --prefix mobile`). Swift Package Manager resolves Capacitor/plugin packages. Select the App scheme and an iOS simulator to run. For a physical iPhone/TestFlight, choose your Apple Developer team and signing configuration, then archive/export through Xcode. Linux cannot produce a signed iOS installation file.

### Downloadable native-source bundle

The source ZIP contains `mobile/` and a ready-built `mobile/www`, without `node_modules`, copied duplicates, build caches, signing secrets, or the original artwork archive. After extraction, run these **inside its `mobile` folder**:

```sh
npm ci
npx cap sync
```

Then open the platform project. Use `npx cap sync`, not `npm run sync`, in the standalone ZIP: rebuilding `www` requires the complete website repository one directory above. The Git repository remains the source of truth for website updates.

## Supabase mobile sign-in

Keep the existing web callback. In Supabase **Authentication → URL Configuration → Redirect URLs**, also allow exactly:

```text
crystaleye://auth/callback
```

The website uses its normal HTTPS callback; native apps use this scheme. Both platforms register it, and the native handler accepts only that exact scheme/host/path and exchanges the PKCE code using the verifier in the requesting app. Links must be opened on the same device/app installation that requested them. A handled-code hash prevents the launch URL being exchanged repeatedly on page navigation. Test cold and warm app launches with a real email on each platform before release. Do not put service-role keys in the application.

## Native behavior

- Safe-area styling and existing touch navigation; Android back navigates within the app and minimizes at the home screen.
- External HTTPS links open in the platform browser. Internal navigation stays in the app.
- Bundled PDFs are exported to the app cache and opened through the system share sheet, so Android does not depend on WebView PDF support. No broad storage permissions are requested.
- iOS icon/splash and Android launcher/splash resources use the supplied Crystal Eye logo. `scripts/icons.py` regenerates sizes using Pillow; no new artwork is invented.
- Android device backup is disabled because the WebView holds a sign-in session. Native sessions use the SDK's existing web storage; no device keychain migration is included.

## Test and release status

This workspace generated and synchronized both projects, independently extracted/installed/synchronized the portable ZIP, tested every bundled page's local references, tested callback URL parsing and website/native routing, and checked bundled pages/calculators in Chromium. It has no Android SDK or Xcode, so it did not compile an APK/IPA or run a simulator/device. The manual **Build native test apps** GitHub Actions workflow can build an Android debug APK and an unsigned **iOS simulator** `.app` ZIP. It is not automatically triggered and does not publish or sign releases. Simulator output cannot be installed on an iPhone.

Before store submission, complete actual device testing, developer signing, store metadata/screenshots, and privacy/support URLs. Apps that create accounts need a functional account-deletion flow (not just sign-out); this has not been implemented. Paid digital tarot/astrology subscriptions need the relevant Apple/Google purchase integration and verified backend access, subject to storefront rules. Stripe-only web checkout is not implemented as a native subscription purchase. Existing booking backend/Turnstile settings also need a native-compatible origin/verification strategy or hosted booking flow when appointment requests are activated; they remain offline here. The apps do not need camera/microphone permissions because readings are arranged externally rather than using in-app calls.
