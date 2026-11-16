# Crystal Eye customer accounts

The site uses Supabase Auth and namespaced PostgreSQL tables. The existing GitHub Pages frontend remains static. The owner supplied the existing project URL and public publishable key, now configured in `data/account.json`. The owner confirmed the migration and Auth callback setup; `enabled` is now true and sign-in is open. The environment blocks live requests to the Supabase project, so hosted connectivity/authentication has not been verified here.

## Connect the existing project

1. Set `supabase_url` and the **public publishable/anon key** in `data/account.json`. The browser needs this public key; it is not a secret. Never use a service-role key, `sb_secret_` key, database password, or personal access token. Both build-time and runtime checks reject known private-key formats. Row-level security is what protects records, not hiding the public key.
2. Review and run `supabase/migrations/202611160001_customer_accounts.sql` against the existing project through its SQL editor or your usual migration workflow. It creates three namespaced tables and no triggers on existing user/application tables. It is a one-time versioned migration, not an idempotent seed. Existing Supabase users can sign in immediately after setup; they do not need a separate imported identity.
3. Enable email authentication and allow new sign-ups if appropriate. In Supabase Auth URL settings, preserve existing application settings and add the **exact** allowed sign-in callback `https://robbiecalvin.github.io/crystaleye/account/`. Add a local development callback only for testing. Avoid wildcard redirects. The app uses PKCE and the standard email magic-link template; links must be opened in the browser that requested them. Configure a production email sender/SMTP and verify delivery and rate limits before opening sign-up.
4. Once the migration and Auth settings are configured, set `enabled` to true in `data/account.json` and run `python scripts/build_account.py`. Rebuild normal wing pages and `python scripts/build_merchandise.py` to retain navigation/integration. The shared HTML writer adds My Account to section headers, including the calculator. No database credentials belong in GitHub Pages.
5. Test a real account: request the email, follow the link in the same browser, save/edit the profile, save numerology from both calculators, save astrology, reload on another signed-in device, delete a saved reading, and sign out. Test expired links and network failures. With a second user, verify that neither can read or modify the other's data. No real authentication email or live database migration was performed in this workspace.

## Data and permissions

- `crystaleye_profiles`: one row per Auth user with chosen display name and optional Sun/Moon/rising signs. This form does not calculate birth charts or guess missing signs. Users can read, insert, and update only their own profile.
- `crystaleye_saved_readings`: explicit numerical/astrology snapshots, owner ID, title, and creation time. Users can read, insert, and delete only their own records. Save retries reuse an ID with `ON CONFLICT DO NOTHING`. The page loads 50 at a time, supports filters, and escapes display values through DOM text nodes. Snapshots include the displayed content, not the raw birth name, full date of birth, letter breakdown, or credentials. A full chart does contain its numerical Birthday result, as shown in the calculator.
- `crystaleye_subscriptions`: owner-readable plan/status/period information. Authenticated customers have no insert/update/delete grant or write policy. Only a trusted backend may write this table. The dashboard does not grant access based on profile fields or client state. There is no paid-content endpoint in this change.

Authentication sessions persist in the browser using the SDK's standard local-storage mechanism (`crystaleye-auth`) until sign-out. Do not add untrusted scripts or render stored HTML. Sign-out clears displayed private content; restored browser pages re-check authentication. Saved cloud data remains available after signing in again. SDK code is bundled locally, so there is no runtime dependency on a third-party JavaScript CDN.

## What is still separate

Stripe checkout, a verified/idempotent Stripe webhook integration, Customer Portal creation, and actual paid tarot/astrology fulfillment remain separate work. The dashboard shows read-only subscription status; creating an account or saving a reading does not activate a subscription. Existing on-site astrology and tarot previews retain their preview labels. A future paid API must verify the authenticated user and current subscription server-side on every protected request; a UI badge alone is not access control.

The earlier Cloudflare appointment service has not been migrated into Supabase and the dashboard does not claim to show appointment history. Consolidate that backend separately before launch. The pending Robbie portrait is also unchanged by this account feature.

## Build and verify

The vendored Supabase SDK is pinned by `account/package-lock.json`; licenses are retained in `account/vendor/`. Rebuild with `npm ci --prefix account` and `npm run build:vendor --prefix account`. Do not commit `node_modules` or sessions.

- `node --test tests/*.test.mjs`: existing features and account snapshot/config tests.
- `node tests/account-database.mjs`: applies the real migration to an isolated embedded PostgreSQL database (PGlite), switches roles/users, and exercises grants and RLS; requires the account dev dependencies above. No hosted project is touched.
- `python tests/numerology-pages.py`, `python tests/catalog-navigation.py`, `python tests/social-previews.py`, `python tests/ui-layout.py`, `python scripts/audit_site_images.py`: every page, links, navigation, images, and metadata.
- With the site served locally on port 8007, `python tests/accounts-browser.py` (Playwright + Chromium): passwordless callback, profile CRUD, saved reading controls, status display, logout, and responsive layout against mocked Supabase endpoints. Override the base with `CRYSTALEYE_TEST_URL` if necessary. No actual emails, payments, or hosted records are created by this test.


## Native apps

The Capacitor apps use the same Supabase project with the additional allowed redirect `crystaleye://auth/callback`. Native sign-in emails must be opened on the requesting device/app installation. The website's HTTPS callback remains unchanged. See `mobile/README.md` for the platform URL handlers and native build instructions.
