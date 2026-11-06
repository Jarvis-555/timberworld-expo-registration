# Timber World Limited Expo Registration

## Files
- `index.html`: visitor registration page.
- `submit.php`: same-domain server endpoint. It forwards submissions to Apps Script and only reports success when the sheet backend confirms the write.
- `Code.gs`: Google Apps Script backend.
- `assets/twl-logo.png`: add the official Timber World logo here (PNG recommended, transparent background).

## Google Sheet
Spreadsheet ID:
`1oCqlhGsKqgyqYtHs1qPCNpX4riSRNdLQRDcmnMDU35o`

The Apps Script creates/uses a tab named `Expo Leads`.

## Setup
1. Open the Google Sheet.
2. Extensions -> Apps Script.
3. Replace the editor contents with `Code.gs`.
4. Project Settings -> Time zone -> Africa/Nairobi.
5. Save. Run `setupSheet` once and authorize access.
6. Deploy -> New deployment -> Web app.
7. Execute as: Me. Who has access: Anyone.
8. Deploy and copy the URL ending in `/exec`.
9. In `submit.php`, replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.
10. Upload the complete project contents to your hosting folder, e.g. `public_html/event/`.
11. Ensure PHP cURL is enabled on the hosting account.
12. Test `https://timberworld.co.ke/event/` and verify a test row appears in the Google Sheet.

## Linktree and printed QR
The printed QR already opens `https://linktr.ee/timberworld_limited`. Do not alter/reprint it.
Add a clearly labelled Registration / Expo Registration link to that Linktree profile, pointing to:
`https://timberworld.co.ke/event/`

After successful submission, the page's Continue button opens:
`https://linktr.ee/timberworld`

## GitHub
Create a private repository, for example `timberworld-expo-registration`.
Upload `index.html`, `submit.php`, `Code.gs`, `README.md`, and `assets/twl-logo.png`.
Do not commit real credentials, passwords, API keys, or private visitor data. The Apps Script URL in `submit.php` is a deployment endpoint; keep repository private if you prefer not to expose it.
For updates, edit locally, commit/push to GitHub, then upload changed files to Host Africa (unless you later configure a deployment workflow).

## Important deployment notes
- `submit.php` must be in the same directory as `index.html`.
- Keep the Apps Script deployment access set to Anyone so visitors do not need Google accounts.
- The spreadsheet must be accessible to the Google account that owns/runs the Apps Script.
- Test a real submission and verify the row before adding the Linktree registration link.
- A web app endpoint exposed to the public can receive spam. The included honeypot is basic protection, not a full anti-abuse system.
- Provide an appropriate privacy notice and collect only information needed for event follow-up.
