# Crystal Eye appointment service

This Cloudflare Worker and D1 database support the static site's on-page booking form. Sessions cost $29.99 CAD and last 30 minutes. Availability is day and night, in half-hour increments, with at least 24 hours' notice and a rolling 30-day booking window. Display dates use `America/Vancouver`, including the runtime's timezone rules. UTC timestamps avoid ambiguous local-time reservations.

**Not deployed yet.** The public form stays disabled while its API URL or Turnstile site key is blank. A successful request reserves the time with status `requested`; Robbie must confirm it and arrange video/phone details. No automated email, payment, video room, or customer account is claimed or supplied. The form displays a reference after a successful save. Do not open booking until the owner can monitor and contact clients.

## Connect the backend

1. In your Cloudflare account, create a D1 database named `crystaleye-bookings`. Add its database ID to `wrangler.jsonc`. Install the pinned development dependencies with `npm ci` in this directory.
2. Apply `schema.sql` to that database using `npx wrangler d1 execute crystaleye-bookings --remote --file=schema.sql`.
3. Create a Turnstile widget restricted to `robbiecalvin.github.io`. Add its secret with `npx wrangler secret put TURNSTILE_SECRET`. Never put this secret or Cloudflare credentials in source control. `SITE_ORIGIN` is the origin (no `/crystaleye/` path).
4. Deploy using `npm run deploy`. This needs access to the owner's Cloudflare account. Put the resulting HTTPS Worker URL, without a trailing slash, and public Turnstile site key into `data/readings.json`, then run `python scripts/build_readings.py`.
5. Test an actual request in a browser: video and phone, minimum notice, busy slot, confirmation reference, dashboard record, and rejection of a second request for the same slot. Check mobile layouts and that the owner receives enough information to contact the client. The record is stored in D1, not emailed automatically.

## Manage appointments

Use the authenticated Cloudflare dashboard's D1 console; the public API exposes availability and request creation only. Review `id`, `starts_at`, contact details, `method`, and `status`. Set `status` to `confirmed` after personally confirming; set it to `cancelled` when a request is cancelled or rejected. Both requested and confirmed appointments block that time, with a database-enforced unique index protecting concurrent requests. Cancellation releases it. For a personal blocked-out time, insert a confirmed appointment in the private database with a unique ID and the required fields; never use real client details for a block.

Monitor requests regularly and confirm them manually. A Turnstile token and a three-active-requests-per-email-per-day limit reduce abuse, but are not identity verification. Configure Cloudflare edge rate limits as traffic warrants. Do not expose the D1 console or credentials to visitors. Restrict dashboard access, set a client-data retention policy, and remove old records according to that policy. Do not log request bodies. Configure scheduled notifications/retention if required before expecting unattended operation.

The API intentionally returns no names, emails, phone numbers, or booking identifiers from availability. Errors use generic messages. Keep `data/readings.json` and the worker's duration/notice/horizon constants in sync if the service rules change. Price here is informational; Stripe payment and paid-session confirmation will be a separate integration. A Stripe return URL must never count as proof of payment.

Tests: from the repository root, `node --test tests/bookings.test.mjs`. The tests cover notice, slot alignment, historical Vancouver clock changes, request validation, request persistence, conflicting slots, verification, and origin restrictions. Run the real D1/browser smoke test after deployment as well.
