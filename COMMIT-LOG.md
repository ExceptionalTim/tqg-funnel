# Pre-Commit Diagnostic & Change Report (Cumulative)

## Diagnostic Summary
- **Tests**: No `test` script or testing framework configured.
- **TypeScript**: `tsc --noEmit` passes with zero errors.
- **Build**: `npm run build` succeeds — 17 pages + 5 API routes compiled. No warnings.
- **Security**: Google Service Account key stored as base64 in `.env.local` (gitignored). No secrets in source. Calendar IDs are hardcoded constants (non-sensitive).
- **API verification**: Free bay returns 18 slots (30-min), evaluation returns 17 slots (60-min), Sunday returns 0 slots. All correct.

---

## Session 3 (2026-04-17): Landing Page Variants + Calendar Buttons + CRO Fixes

### Commit: Payment CTA Copy Change
- **File**: `src/pages/book/evaluation/payment.tsx`
- **Change**: Button text changed from "Pay $75 & Confirm Booking" to "Book Your Evaluation"
- **Why**: Reduces friction — price-first CTAs create hesitation. Action-first copy converts better.

### Commit: Inline "Next →" Button in CalendarWidget
- **Files**: `CalendarWidget.tsx`, `free-bay/index.tsx`, `evaluation/index.tsx`
- **Change**: Replaced external "Continue →" button below the calendar with an inline "Next →" button that slides in next to the selected time slot (Calendly-style). Selected slot uses orange outline instead of solid fill. Removed unused state from parent pages.
- **Why**: Better UX — the action appears right where the user is looking, not below a scrollable widget.

### Commit: Smart Default Date
- **File**: `CalendarWidget.tsx`
- **Change**: Default selected date now checks Central Time hour. If past 7 PM (closing), advances to tomorrow. Skips Sunday.
- **Why**: Users landing after hours saw "Cannot check availability for past dates" — hurts conversions.

### Commit: Functional Calendar Buttons
- **Files**: `src/lib/calendar-links.ts` (new), `free-bay/thank-you.tsx`, `evaluation/thank-you.tsx`
- **Change**: "Add to Google Calendar" opens Google Calendar with pre-filled event. "Add to Apple Calendar" downloads an .ics file. Shared helper handles URL generation and ICS creation. Free Bay = 30-min events, Evaluation = 60-min events. Both include TQG location address.
- **Why**: Buttons were previously non-functional `<button>` elements with no click handlers.

### Commit: Free Bay Landing Page (`/free-bay`)
- **File**: `src/pages/free-bay.tsx` (new — copy of `index.tsx`)
- **Change**: Removed all evaluation/paid CTAs: "GET A FULL LESSON — 50% OFF" hero button, evaluation offer card, "BOOK YOUR EVALUATION" buttons in mid-page and final CTA sections. Offer section title changed to "Your Path to Better Golf". All CTA routing goes to `/book/free-bay` only.
- **Why**: Dedicated landing page for ad campaigns targeting free bay sessions only — no paid offer distraction.

### Commit: Evaluation Landing Page (`/evaluation`)
- **File**: `src/pages/evaluation.tsx` (new — copy of `index.tsx`)
- **Change**: Removed all free bay CTAs: "BOOK YOUR FREE 30 MINUTES" hero button, free bay offer card, "FREE 30 MINUTE Practice" and "CLAIM YOUR FREE BAY" buttons. Offer section title changed to "Your Path to Better Golf". Hero CTA is "GET A FULL LESSON — 50% OFF". All CTA routing goes to `/book/evaluation` only.
- **Why**: Dedicated landing page for ad campaigns targeting paid evaluations only — no free offer distraction.

### Landing Page Summary
| URL | Purpose | CTAs |
|---|---|---|
| `/` | Both offers (original) | Free Bay + Evaluation |
| `/free-bay` | Free bay only | Free Bay only |
| `/evaluation` | Evaluation only | Evaluation only |

### Calendar Integration Verification
- `src/lib/google-calendar.ts`: UNMODIFIED
- `src/pages/api/availability.ts`: UNMODIFIED
- `src/pages/api/book.ts`: UNMODIFIED
- API results: 18/17/0 slots — all correct

---

## Commit 11: Smart Default Date — Skip Past Closing Time

### MODIFIED: `src/components/CalendarWidget.tsx`
- **What was changed**: Replaced the simple Sunday-only check for the default selected date with smart logic that uses `toLocaleString` with `America/Chicago` timezone to get the current Central Time hour. If it's past 7 PM (closing time), the default date advances to tomorrow. Then skips Sunday if needed.
- **Why**: When users landed on the booking page after 7 PM, the calendar defaulted to today, which had no availability. The API returned "Cannot check availability for past dates" — a poor first impression that hurts conversions. Now the default always lands on a date with potential availability.
- **Cases covered**:
  - Before 7 PM Mon-Sat: defaults to today (has slots)
  - After 7 PM Mon-Thu: defaults to tomorrow
  - After 7 PM Friday: defaults to Saturday
  - After 7 PM Saturday: defaults to Monday (skips Sunday)
  - Sunday any time: defaults to Monday

### Google Calendar Integration Verification
- `src/lib/google-calendar.ts`: **UNMODIFIED** — zero diff
- `src/pages/api/availability.ts`: **UNMODIFIED** — zero diff
- `src/pages/api/book.ts`: **UNMODIFIED** — zero diff
- API test results: Free Bay → 18 slots, Evaluation → 17 slots, Sunday → 0 slots (all correct)

### Diagnostic Results
- **TypeScript**: Zero errors
- **Build**: 14 pages + 5 API routes, no warnings
- **Files changed**: 1 file, 9 insertions, 2 deletions

### Potential Risks
- **Timezone detection on client**: Uses `toLocaleString` with `America/Chicago` timezone which works in all modern browsers. If a browser doesn't support the `timeZone` option (extremely rare, pre-2016 browsers), `parseInt` would get NaN and the `>= 19` check would be false — defaulting to today, which is the old behavior. No regression.

---

## Commit 10: Inline "Next →" Button in CalendarWidget (Calendly-style)

### MODIFIED: `src/components/CalendarWidget.tsx`
- **What was changed**:
  - Time slot selection no longer immediately triggers `onDateTimeSelect`. Instead, clicking a time slot toggles it selected/deselected (clicking the same slot again deselects it).
  - Selected time slot styling changed from solid orange background (`bg-primary-container`) to transparent background with orange border (`bg-transparent border-primary-container`) — so it doesn't look identical to the "Next" CTA button.
  - A "Next →" button now appears inline to the right of the selected time slot, with a slide-in animation (`max-w-0 → max-w-[120px]`, `opacity-0 → opacity-100`, `duration-300 ease-out`).
  - The "Next →" button triggers `onDateTimeSelect(selectedDate, time)` which navigates to the contact form.
- **Why**: Mimics Calendly's UX where the next action appears inline next to the selected slot, instead of a separate button below the entire widget. Better visual affordance.

### MODIFIED: `src/pages/book/free-bay/index.tsx`
- **What was changed**: Removed the external "Continue →" button that appeared below the CalendarWidget. Removed unused `useState` import, `selectedDate`/`selectedTime` state, and `handleContinue` function. The `handleDateTimeSelect` callback now directly navigates to the contact page.
- **Why**: Navigation is now handled inside the CalendarWidget via the inline "Next →" button. The parent page no longer needs to track selection state.

### MODIFIED: `src/pages/book/evaluation/index.tsx`
- **What was changed**: Same changes as free-bay/index.tsx — removed external "Continue →" button, unused state, and `handleContinue`. Navigation happens directly in `handleDateTimeSelect`.
- **Why**: Same reason — CalendarWidget handles the UX internally.

### Google Calendar Integration Verification
- **`src/lib/google-calendar.ts`**: UNMODIFIED — zero diff
- **`src/pages/api/availability.ts`**: UNMODIFIED — zero diff
- **`src/pages/api/book.ts`**: UNMODIFIED — zero diff
- **API test results**: Free Bay → 18 slots, Evaluation → 17 slots, Sunday → 0 slots (all correct)
- **Conclusion**: Calendar integration is completely unaffected by these UI changes.

### Diagnostic Results
- **TypeScript**: Zero errors
- **Build**: 14 pages + 5 API routes, no warnings
- **Files changed**: 3 files, 25 insertions, 59 deletions (net reduction — cleaner code)

### Potential Risks
- **None significant.** Changes are purely UI/UX — no API, booking, or calendar logic was touched. The `onDateTimeSelect` callback interface is unchanged.

---

## Session 2 (2026-04-16): Stripe Live Keys + Payment Element Fix

### Summary
Switched Stripe from test keys to live keys and resolved the Payment Element not rendering on production. No source code changes needed beyond the lazy-load guard in payment.tsx (commit a26f5cc). The root cause was the old 2019-era publishable key (`pk_live_ijgb...`) being incompatible with Stripe's Payment Element API — rolling the key to the new format (`pk_live_51C4XoR...`) fixed it.

### Changes Made

**Environment Variables (`.env.local` + Vercel)**:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: changed from `pk_test_...` → `pk_live_51C4XoR...` (new rolled key)
- `STRIPE_SECRET_KEY`: changed from `sk_test_...` → `sk_live_KYoMDDs...`
- Both updated on Vercel via `vercel env add --value` (not shell piping — piping corrupts values)

**`src/pages/book/evaluation/payment.tsx`** (commit a26f5cc):
- Replaced module-scope `loadStripe()` with lazy `getStripe()` function that validates the key exists
- Added visible error message if key is missing instead of silent empty render
- Why: Defense against undefined env var during build. Not the root cause of this issue but good hardening.

### Root Cause Analysis
The old Stripe publishable key (`pk_live_ijgbPyt2YA5OkjBmoFVLDuw6000EmkMhUL`, created June 2019) was a legacy format incompatible with Stripe's Payment Element API. The Payment Element loaded briefly then received **401 Unauthorized** from `api.stripe.com/v1/el_pe_payment_intent` because the old key format can't authenticate against the Payment Element backend. Rolling the key in Stripe Dashboard generated a new-format key (`pk_live_51C4XoR...`) which works correctly.

### Errors Encountered and Resolved
1. **Shell piping corrupts env var values**: `echo "key" | vercel env add` mangles the value. Fix: use `vercel env add --value 'key'` instead.
2. **Vercel build cache**: `NEXT_PUBLIC_` vars are inlined at build time. Must "Redeploy without cache" after changing them.
3. **401 from Stripe on production**: Old publishable key format (2019) incompatible with Payment Element. Fix: Roll the key in Stripe Dashboard.

### Diagnostic Results
- **TypeScript**: Zero errors
- **Build**: 14 pages + 5 API routes, no warnings
- **Stripe API**: Live PaymentIntent creation confirmed (`pi_3TMz...`)
- **Live key in bundle**: Verified `pk_live_51C4XoR...` present in deployed JS chunk
- **No uncommitted code changes**: All fixes already pushed
- **Untracked files**: 8 GTM JSON import files (one-time tools, not for git)

### Potential Risks
- **Old Stripe integrations**: If the client's WordPress site (tourqualitygolf.com) uses the old publishable key for Forminator or other plugins, those will break since the key was rolled. The `rk_live_...N9nD` restricted key (visible in Stripe dashboard) is separate and unaffected.

---

## Commit 9: Separate Bay Pools for Free Bay vs Evaluation Bookings

### MODIFIED: `src/lib/google-calendar.ts`
- **What was changed**:
  - Renamed `BAY_CALENDARS` to `RENTAL_BAYS` (5 general bays: Hogan, Members, Nicklaus, Palmer, Tiger).
  - Added `LESSON_BAY` array containing the Fitting & Lesson Bay calendar (`c_206bd909...@group.calendar.google.com`).
  - Both `getAvailableSlots()` and `bookSlot()` now select the correct bay pool based on booking type:
    - `free-bay` → queries/books from `RENTAL_BAYS` (5 bays)
    - `evaluation` → queries/books from `LESSON_BAY` (1 bay) + instructor calendars
- **Why**: Per client (Ross MacDonald): the 5 general bays are for rental/free sessions only. The Fitting & Lesson Bay is dedicated to lessons and fittings — the $75 evaluation should only book into that bay. This prevents evaluation bookings from occupying rental bays and vice versa.

### Diagnostic Results
- **TypeScript**: Zero errors.
- **Build**: 14 pages + 5 API routes. No warnings.
- **API tests**: Free bay → 18 slots (30-min, 5 bays), Evaluation → 17 slots (60-min, 1 bay + instructors). Sunday → 0 slots. All correct.
- **Files changed**: 1 file, 17 insertions, 8 deletions.

### Potential Risks
- **Single bay for evaluations**: Since evaluations now book from only 1 bay (Fitting & Lesson Bay), availability is more constrained. If that bay is fully booked, no evaluation slots will show even if other bays are free. This is intentional per the client's request.
- **No calendar ID in source for the new bay is sensitive** — Calendar IDs are not secrets (they're analogous to email addresses).

---

## Commit 8: Google Calendar Availability & Booking Integration

### NEW: `src/lib/google-calendar.ts`
- **What was changed**: Core server-side module for Google Calendar API integration:
  - **Auth**: Decodes base64 service account key from env, creates `google.auth.JWT` with domain-wide delegation to impersonate `bays@tourqualitygolf.com` (for bay calendars) and instructor emails (for their calendars).
  - **Calendar constants**: All 5 bay calendar IDs and 2 instructor calendar IDs hardcoded.
  - **`getAvailableSlots(date, type)`**: Uses Google FreeBusy API to batch-query all relevant calendars. Generates candidate slots (30-min for free-bay starting 10am–6:30pm, 60-min for evaluation starting 10am–6pm). Filters to slots where at least 1 bay is free (+ 1 instructor for evaluations).
  - **`bookSlot(params)`**: Re-checks availability (race condition prevention), picks a random available bay (+ instructor for evaluations), creates Google Calendar events via `calendar.events.insert`. Returns assigned bay/instructor names.
  - Timezone: `America/Chicago` (Central Time) with CDT offset for date queries.
- **Why**: Central availability engine that all current and future funnels will use. Google Calendar is the sole source of truth — no database needed.

### NEW: `src/pages/api/availability.ts`
- **What was changed**: `GET /api/availability?date=YYYY-MM-DD&type=free-bay|evaluation` — validates params (date format, not past, not Sunday), calls `getAvailableSlots()`, returns `{ slots: [...] }`.
- **Why**: CalendarWidget needs real-time availability data when user selects a date.

### NEW: `src/pages/api/book.ts`
- **What was changed**: `POST /api/book` — accepts `{ date, time, type, firstName, lastName, email, phone, notes?, paymentIntentId? }`. For evaluations, verifies Stripe payment succeeded before creating events. Calls `bookSlot()` which re-checks availability. Returns `{ success, bayName, instructorName? }` or `409` if slot was taken.
- **Why**: Creates actual Google Calendar events when bookings are confirmed. Server-side payment verification prevents unpaid evaluation bookings.

### MODIFIED: `src/components/CalendarWidget.tsx`
- **What was changed**:
  - Added `bookingType: 'free-bay' | 'evaluation'` prop.
  - Removed all mock availability data (`MOCK_AVAILABILITY`, `fullDaySlots`).
  - Added `useEffect` that fetches `/api/availability` whenever `selectedDate` or `bookingType` changes.
  - Added loading spinner while fetching, error state with "Try again" button, "No availability" message for empty results.
  - `isDateDisabled` simplified: only checks for past dates and Sundays (no longer references mock data).
- **Why**: Replace hardcoded mock slots with live Google Calendar availability.

### MODIFIED: `src/pages/book/free-bay/index.tsx`
- **What was changed**: Pass `bookingType="free-bay"` to CalendarWidget.
- **Why**: CalendarWidget now requires this prop to determine slot duration (30 min).

### MODIFIED: `src/pages/book/evaluation/index.tsx`
- **What was changed**: Pass `bookingType="evaluation"` to CalendarWidget.
- **Why**: CalendarWidget uses this to determine slot duration (60 min) and query instructor availability.

### MODIFIED: `src/pages/book/free-bay/contact.tsx`
- **What was changed**:
  - `handleSubmit` now calls `POST /api/book` instead of directly redirecting to thank-you.
  - Added `submitting` state: button shows spinner and disables during booking.
  - Added `bookingError` state: displays error message if booking fails (409 slot taken, server error).
  - On success: redirects to thank-you with `bayName` from API response.
  - DataLayer `form_submission` event only fires after successful booking (not before).
- **Why**: Booking must create a real calendar event before confirming to the user. Race condition handling via 409 error.

### MODIFIED: `src/pages/book/evaluation/thank-you.tsx`
- **What was changed**:
  - After payment verification, calls `POST /api/book` to create calendar events with data from Stripe PaymentIntent metadata.
  - Added `bayName`, `instructorName`, and `bookingError` state.
  - Uses localStorage key `booking_{pi_id}` to cache booking result and prevent duplicate calendar events on page refresh.
  - Hardcoded "Ross MacDonald" and "Bay 2 — TrackMan" replaced with dynamic values from booking API response. Falls back to "Assigned at check-in" while loading.
  - Added booking error display with phone number to call for manual resolution.
- **Why**: Calendar events must be created after payment, with deduplication. Dynamic assignment replaces hardcoded instructor/bay.

### MODIFIED: `src/pages/book/free-bay/thank-you.tsx`
- **What was changed**: Accepts `bayName` from query params. Displays assigned bay name with TrackMan label in the booking summary card.
- **Why**: Show user which bay they've been assigned to.

### MODIFIED: `package.json` / `package-lock.json`
- **What was changed**: Added `googleapis` v148.0.0 (Google APIs Node.js client).
- **Why**: Required for Google Calendar FreeBusy and Events API access.

### NEW: `.env.local` entry (NOT committed)
- Added `GOOGLE_SERVICE_ACCOUNT_KEY` (base64-encoded service account JSON).

### Diagnostic Results
- **TypeScript**: Zero errors.
- **Build**: 14 pages + 5 API routes (`availability`, `book`, `create-payment-intent`, `get-payment`, `hello`).
- **API tests**: Free bay → 18 slots, Evaluation → 17 slots, Sunday → 0 slots. All correct.
- **Files changed**: 8 modified + 3 new = 11 total (821 insertions, 100 deletions).

### Potential Risks
- **DST offset hardcoded**: `timeMin`/`timeMax` use `-05:00` (CDT). This is correct for April 2026 but will be wrong during CST (Nov–Mar). A proper timezone library (e.g., `date-fns-tz`) should be added for production.
- **Vercel env var**: `GOOGLE_SERVICE_ACCOUNT_KEY` must be added to Vercel Environment Variables for deployed version to work.
- **No race condition lock**: Re-checks availability before booking but doesn't hold a lock. With 5 bays, true conflicts are extremely rare. 409 errors are handled gracefully in the UI.
- **Domain-wide delegation**: The service account impersonates `bays@tourqualitygolf.com` and instructor emails. If these accounts are deactivated or renamed, the integration breaks.
- **No cleanup on partial failure**: If bay event is created but instructor event fails (evaluation), the bay event remains orphaned. This is acceptable at current volume — manual cleanup via Google Calendar.

---

## Commit 7: Form DataLayer Events, Phone Formatting, and Input Validation

### MODIFIED: `src/pages/book/evaluation/contact.tsx`
- **What was changed**:
  - Added US phone number auto-formatting: as the user types, digits are formatted to `(555) 000-0000` pattern via controlled input with `formatPhone()` helper.
  - Added email validation: regex check for valid email format (`user@domain.tld`). Shows "Please enter a valid email address." on failure.
  - Added phone validation: checks for exactly 10 digits. Shows "Please enter a valid 10-digit US phone number." on failure.
  - On successful form submission, pushes `dataLayer` event:
    - `event: 'form_submission'`
    - `form_name: 'Performance Evaluation Form Submission'`
    - `user_data: { email, first_name, last_name, phone }` — same keys as the `purchase` event
  - Removed deprecated `FormEvent` import, using `React.SyntheticEvent<HTMLFormElement>` instead.
- **Why**: Client needs form submission tracking in GTM with user data, and phone numbers need to be consistently formatted for US numbers. Email/phone validation prevents garbage data from entering the funnel.

### MODIFIED: `src/pages/book/free-bay/contact.tsx`
- **What was changed**: Identical changes as the evaluation contact form:
  - US phone auto-formatting, email regex validation, 10-digit phone validation.
  - On successful submission, pushes `dataLayer` event with `form_name: 'Free Bay Form Submission'` and matching `user_data` object.
  - Removed deprecated `FormEvent` import.
- **Why**: Same reasons — consistent tracking and validation across both funnels.

### MODIFIED: `src/pages/book/evaluation/payment.tsx`
- **What was changed**:
  - Added `add_payment_info` dataLayer event that fires when the user first focuses (taps/clicks into) the Stripe Payment Element. Contains:
    - `event: 'add_payment_info'`
    - `ecommerce: { currency: 'USD', value: 75, payment_type: 'credit_card', items: [{ item_name: 'Performance Evaluation', ... }] }`
  - Uses `useRef` guard to ensure it only fires once per page load (not on every focus).
  - The Payment Element is wrapped in a `<div onFocus={handlePaymentFocus}>` to capture focus events bubbling from the Stripe iframe.
  - `CheckoutForm` component now accepts `email` and `phone` props (passed from query params).
  - Added `Window.dataLayer` type declaration.
- **Why**: Client needs to track when users begin entering payment information, using the GA4 `add_payment_info` event standard.

### Diagnostic Results
- **TypeScript**: `tsc --noEmit` passes with zero errors.
- **Build**: `npm run build` succeeds — 14 pages + 3 API routes. No warnings.
- **Files changed**: 3 files, 122 insertions, 15 deletions.

### DataLayer Event Summary (all events across the funnel)
| Event | Page | Trigger | `user_data` |
|---|---|---|---|
| `form_submission` (Free Bay) | `/book/free-bay/contact` | Successful form submit | email, first_name, last_name, phone |
| `form_submission` (Evaluation) | `/book/evaluation/contact` | Successful form submit | email, first_name, last_name, phone |
| `add_payment_info` | `/book/evaluation/payment` | First focus on payment fields | — |
| `purchase` | `/book/evaluation/thank-you` | Page load (localStorage dedup) | email, first_name, last_name, phone |

### Potential Risks
- **`onFocus` on Stripe iframe**: The `<PaymentElement>` renders in a Stripe-controlled iframe. The `onFocus` handler is on the wrapping `<div>`, which captures focus events when the user clicks into the payment area. If Stripe changes iframe focus behavior in a future SDK version, this could stop firing — but it's the standard approach.
- **Phone formatting is US-only**: The `(XXX) XXX-XXXX` format assumes 10-digit US numbers. International numbers are not supported.
- **No dedup on form_submission**: The form submission events fire on every successful submit. If a user submits, goes back, and submits again, it will fire twice. This is intentional — each submission represents a real user action, unlike `purchase` which must be unique per transaction.

---

## Commit 6: Stripe Payment, GTM, and Purchase DataLayer Event

### NEW: `src/pages/api/create-payment-intent.ts`
- **What was changed**: POST-only API route. Creates a Stripe PaymentIntent for $75 (`amount: 7500, currency: 'usd'`). Attaches booking metadata (date, time, first_name, last_name, email, phone) to the PaymentIntent.
- **Why**: Server-side endpoint required by Stripe's Payment Element flow.

### NEW: `src/pages/api/get-payment.ts`
- **What was changed**: GET-only API route. Accepts `payment_intent` query param, calls `stripe.paymentIntents.retrieve()`, and returns `{ id, amount, currency, status, metadata }`. Does not expose the full Stripe object — only the fields needed for the dataLayer.
- **Why**: The thank-you page needs to pull transaction data and user info from Stripe to fire the `purchase` dataLayer event. This keeps the Stripe secret key server-side.

### MODIFIED: `src/pages/book/evaluation/contact.tsx`
- **What was changed**: Added `last_name` and `phone` to the query string in the `router.push()` call to the payment page (line 34). Previously only `name` (first name) and `email` were passed.
- **Why**: These fields are needed downstream for the PaymentIntent metadata and the dataLayer `user_data` object.

### MODIFIED: `src/pages/book/evaluation/payment.tsx`
- **What was changed**: Complete rewrite replacing mock payment form with real Stripe Payment Element:
  - Removed fake card inputs, `PLACEHOLDER_STRIPE_KEY`, mock setTimeout, all TODO blocks
  - Added `loadStripe()`, `<Elements>` provider, `<PaymentElement>`, `CheckoutForm` component
  - Dark theme `appearance` config matching existing design (night base, `#0A0A0A` inputs, `#d38743` focus, Open Sans)
  - Now destructures `last_name` and `phone` from `router.query` and passes them to `/api/create-payment-intent`
  - Loading spinner while PaymentIntent is created, error state with "Try again"
  - Preserved: order summary card, button styling, "Go back" button, SSL footer
- **Why**: Replace non-functional mock with real Stripe payment processing.

### MODIFIED: `src/pages/book/evaluation/thank-you.tsx`
- **What was changed**:
  - Added `useEffect` that fetches `/api/get-payment?payment_intent=pi_xxx` on page load
  - Pushes `window.dataLayer.push()` with GA4-compatible `purchase` event containing:
    - `ecommerce.transaction_id` — Stripe PaymentIntent ID
    - `ecommerce.value` — 75 (converted from cents)
    - `ecommerce.currency` — USD
    - `ecommerce.items` — Performance Evaluation, $75, qty 1, category "Golf Services"
    - `user_data.email`, `.first_name`, `.last_name`, `.phone` — from PaymentIntent metadata
  - **Deduplication**: Uses `localStorage` key `dl_purchase_{pi_id}` to ensure the event fires exactly once per payment intent — survives page refreshes, revisits, and browser restarts
  - **Validation**: Only fires if `data.status === 'succeeded'` (skips pending/failed payments)
  - Added `Window.dataLayer` type declaration
- **Why**: GTM purchase event tracking with full ecommerce and user data, with bulletproof dedup.

### MODIFIED: `src/pages/_document.tsx`
- **What was changed**: Added GTM container `GTM-WZZP7HLD` — `<script>` first in `<Head>`, `<noscript>` iframe after `<body>`.
- **Why**: Global tag manager tracking across all pages.

### MODIFIED: `package.json` / `package-lock.json`
- **What was changed**: Added `stripe` v22.0.0, `@stripe/stripe-js` v9.1.0, `@stripe/react-stripe-js` v6.1.0.
- **Why**: Required for Stripe Payment Element integration.

### NEW: `.env.local` (NOT committed — gitignored)
- Contains `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`.

### Potential Risks
- **Stripe test mode**: Using test keys. Must switch to live keys before production.
- **Vercel env vars**: Both Stripe keys must be added to Vercel's Environment Variables settings for the deployed version to work.
- **No webhook verification**: The current flow trusts Stripe's redirect + `status === 'succeeded'` check. For production hardening, add a Stripe webhook endpoint to verify payment completion server-side.
- **Fixed price**: $75 is hardcoded in `create-payment-intent.ts`. Must update if pricing changes.
- **localStorage dedup**: If a user clears their browser storage and revisits the thank-you URL, the dataLayer event will fire again. This is an acceptable edge case — the alternative (server-side dedup) would require a database.
- **`get-payment` API**: Currently has no authentication. Anyone who knows a `pi_xxx` ID could call it. The response only contains non-sensitive metadata (name, email, amount), but consider adding session validation for production.

---

### NEW: `src/pages/api/create-payment-intent.ts`
- **What was changed**: Created a POST-only API route that creates a Stripe PaymentIntent for $75 (`amount: 7500, currency: 'usd'`). Attaches booking metadata (date, time, name, email) to the PaymentIntent for Stripe Dashboard record-keeping. Returns `{ clientSecret }` to the client.
- **Why**: Server-side endpoint required by Stripe's Payment Element flow — the client needs a `clientSecret` to render the payment form and confirm payment.

### MODIFIED: `src/pages/book/evaluation/payment.tsx`
- **What was changed**: Complete rewrite replacing the mock payment form with a real Stripe Payment Element integration:
  - Removed fake card number, expiry, and CVC input fields and their state variables
  - Removed the `PLACEHOLDER_STRIPE_KEY` constant and all TODO comment blocks
  - Removed the mock 2-second `setTimeout` payment simulation
  - Added `loadStripe()` at module scope with the publishable key from env
  - Added `appearance` config object matching the dark theme (night base, `#0A0A0A` input backgrounds, `#d38743` orange focus rings, `#d8c2b4` labels, Open Sans font)
  - Added `CheckoutForm` child component using `useStripe()` and `useElements()` hooks with `<PaymentElement />`
  - Parent component fetches `clientSecret` from `/api/create-payment-intent` on mount, then renders `<Elements>` provider wrapping `CheckoutForm`
  - On successful payment, Stripe redirects to the thank-you page with `payment_intent` and `payment_intent_client_secret` appended to the URL
  - Added loading spinner while PaymentIntent is being created, and error state with "Try again" button
  - Preserved: order summary card, button styling, "Go back" button, "256-bit SSL / Powered by Stripe" footer, BookingLayout wrapper
- **Why**: Replace the non-functional mock with a real payment flow that processes $75 charges via Stripe.

### MODIFIED: `src/pages/book/evaluation/thank-you.tsx`
- **What was changed**: Added `payment_intent` to the destructured `router.query` params (line 30). No UI changes.
- **Why**: Stripe's `confirmPayment` automatically appends `payment_intent=pi_xxx` to the return URL. Capturing it now enables future data layer integration to pull transaction details from Stripe's API.

### MODIFIED: `src/pages/_document.tsx`
- **What was changed**: Added Google Tag Manager container `GTM-WZZP7HLD`:
  - GTM `<script>` tag inserted as the first element in `<Head>` (highest priority position)
  - GTM `<noscript>` iframe inserted immediately after `<body>` opening tag
- **Why**: Enables Google Tag Manager tracking across all pages in the application (landing page, all funnel pages, thank-you pages). Placed in `_document.tsx` so it loads globally without needing to modify individual pages.

### MODIFIED: `package.json` / `package-lock.json`
- **What was changed**: Added three new dependencies:
  - `stripe` v22.0.0 (server-side Node SDK for PaymentIntent creation)
  - `@stripe/stripe-js` v9.1.0 (client-side `loadStripe()`)
  - `@stripe/react-stripe-js` v6.1.0 (React components: `Elements`, `PaymentElement`, hooks)
- **Why**: Required for the Stripe Payment Element integration.

### NEW: `.env.local` (NOT committed — gitignored)
- **What was changed**: Created with `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`.
- **Why**: Stripe API keys for the payment integration. File is excluded from git by the `.env*` pattern in `.gitignore`.

### Potential Risks
- **Stripe test mode**: Currently using test keys (`pk_test_`, `sk_test_`). Must switch to live keys before production launch.
- **Vercel env vars**: When deploying to Vercel, both Stripe keys must be added to the Vercel project's Environment Variables settings (Settings → Environment Variables). Without them, the API route will fail.
- **No webhook verification**: The current implementation trusts Stripe's redirect. For production hardening, a Stripe webhook endpoint should be added to verify payment completion server-side.
- **Fixed price**: The $75 amount is hardcoded in the API route. If pricing changes, it must be updated in `create-payment-intent.ts`.

---

## Commit 5: Landing Page Offer Card & Footer Link Fixes

### MODIFIED: `src/pages/index.tsx`
- **What was changed (1 of 2)**: Removed `hover:bg-surface-container` from the left offer card ("First Look Session: 30 Minutes on TrackMan") in the "Your Two Paths to Better Golf" section.
- **Why**: With the section background set to `bg-surface-container-low`, hovering the left card changed its background to `bg-surface-container` which is nearly identical, making the card visually disappear into the background. Removing the hover effect keeps the card consistently visible.

- **What was changed (2 of 2)**: Changed all four footer Services links (Full Bag Fitting, PGA Instruction, TrackMan Rental, Club Repair) from `href="#"` to `href="#why-tqg"`.
- **Why**: These service links were dead (`#`). They now anchor to the "Why Golfers Drive Hours to Get Here" section which showcases TQG's service capabilities.

### Diagnostic Results
- **TypeScript**: One pre-existing error (`faq.open` on `Element` at index.tsx:65). No new errors introduced by this commit.
- **Tests**: No test framework configured.
- **Files changed**: 1 file, 5 insertions, 5 deletions.

### Potential Risks
- None. Both changes are minimal CSS/href tweaks with no functional side effects.

---

## Commit 4: Evaluation Thank-You Page Overhaul + Logo & Nav Fixes

### MODIFIED: `src/pages/book/evaluation/thank-you.tsx`
- **What was changed**:
  - Added coach name ("Ross MacDonald") and bay/technology info ("Bay 2 — TrackMan") to the booking summary card's right column, with `person` and `sports_golf` Material icons.
  - Removed the "$75 PAID" receipt line and payment confirmation subtitle from the hero — the page now focuses on the appointment details rather than the transaction.
  - Changed the hero subtitle margin from `mb-4` to `mb-12` to match the HTML design spacing.
  - Added the "01 — 04 / PREPARATION" counter label in a flex row alongside the "WHAT HAPPENS ON THE DAY" heading.
  - Updated all four preparation step descriptions to match the HTML design copy (e.g. "Get checked in and grab a water..." instead of "Get checked in and warmed up...").
  - Added the `<TestimonialSlider />` component between the preparation steps and the CTA section.
  - Added a full FAQ section ("BEFORE YOU COME IN") with 5 expandable `<details>` elements covering: what to bring, what happens during the 60 minutes, lesson vs. fitting distinction, rescheduling, and arrival directions. Uses native HTML `<details>`/`<summary>` instead of React state toggle.
  - Updated the final CTA heading from "QUESTIONS BEFORE YOUR EVALUATION?" to "QUESTIONS BEFORE YOU COME IN?" and changed the phone number from a plain `<p>` to a clickable `<a href="tel:">` link.
  - Updated the CTA body copy to match the HTML design ("master fitters and technicians" instead of "PGA-certified instructors").
  - Changed the page title from "Evaluation Booked" to "You're Booked".
  - Removed unused `useState` import (was left over from an earlier toggle-based FAQ approach).
- **Why**: The page was missing the testimonial slider, FAQ, coach/bay details, and had copy that didn't match the approved HTML design.

### MODIFIED: `src/pages/book/contact.tsx`
- **What was changed**: Replaced logo `src` from `/logo.svg` to the production webp URL (`tourqualitygolf.com/wp-content/uploads/2021/09/tour-quality-logo-1.webp`).
- **Why**: `/logo.svg` doesn't exist in the project; the production URL ensures the logo renders.

### MODIFIED: `src/pages/book/date.tsx`
- **What was changed**: Same logo URL fix as above.
- **Why**: Same reason — consistent logo rendering across all booking pages.

### MODIFIED: `src/pages/book/thank-you.tsx`
- **What was changed**: Same logo URL fix as above.
- **Why**: Same reason.

### MODIFIED: `src/pages/book/time.tsx`
- **What was changed**: Same logo URL fix as above.
- **Why**: Same reason.

### MODIFIED: `src/pages/index.tsx`
- **What was changed**:
  - Split the monolithic CTA click listener into three distinct routing groups: nav "Book Now" (scrolls to `#the-offer`), Free Bay CTAs (routes to `/book/free-bay`), and Evaluation CTAs (routes to `/book/evaluation`).
  - Added an `IntersectionObserver` for scroll-spy active state on desktop nav links, applying a `.nav-link-active` class to the currently visible section's nav link.
  - Normalized all desktop nav link classes to use `border-b-2 border-transparent pb-1` (removing the hardcoded active state from "HOW IT WORKS") so the scroll-spy observer controls highlighting dynamically.
  - Added an accordion behavior for the FAQ section: toggling one `<details>` element open automatically closes any other open `<details>`.
  - Changed the offer section (`#the-offer`) padding from `py-24` to `pt-16 pb-20` and background from `bg-surface` to `bg-surface-container-low`.
  - Changed both offer cards' backgrounds from `bg-surface-container-low` to `bg-surface` to maintain contrast against the new section background.
- **Why**: CTAs previously all routed to the same `/book/date` page regardless of which offer was clicked. The nav scroll-spy and FAQ accordion improve interactivity.

### MODIFIED: `src/styles/globals.css`
- **What was changed**: Added `.nav-link-active` class with `color: #FFB77C`, `border-bottom-color: #D38743`, and `font-weight: 700` (all `!important`).
- **Why**: Supports the new IntersectionObserver-based scroll-spy in `index.tsx`. Uses `!important` to override the inline Tailwind classes on the nav links.

### Potential Risks
- **Pre-existing TS error**: `src/pages/index.tsx:65` — `faq.open` on `Element` type. Not introduced by this commit but should be fixed (cast to `HTMLDetailsElement`).
- **Orphaned pages**: The old `/book/date`, `/book/time`, `/book/contact`, `/book/thank-you` pages still exist but no CTA links to them anymore. They should be removed in a future cleanup.
- **Hardcoded coach/bay**: The evaluation thank-you page hardcodes "Ross MacDonald" and "Bay 2 — TrackMan". These should eventually come from booking data.
- **External logo URL**: Four booking pages now reference `tourqualitygolf.com` for the logo. If that CDN is unavailable, the logo won't render. Consider hosting the asset locally.
- **Stripe & Calendar API mocks**: Payment and calendar availability remain mocked with TODOs.

---

## Commit 3: Multi-Funnel Architecture Split

### NEW: `src/components/CalendarWidget.tsx`
- **What was changed**: Created a fully interactive React calendar component with dynamically generated date grids, time slot panels, and month navigation. Auto-selects tomorrow's date by default.
- **Why**: Replaces the static hardcoded HTML calendar used in the old `/book/date` page. The widget is constrained to 600px max-height and is shared across both funnels.
- **Mock API Note**: Contains `MOCK_AVAILABILITY` placeholder arrays with `TODO` comment marking where Google Workspace Calendar API call needs to be injected.

### NEW: `src/components/BookingLayout.tsx`
- **What was changed**: Extracted the duplicated Tailwind config, header (with production logo), and footer into a single reusable layout wrapper.
- **Why**: All 7 funnel pages were sharing identical boilerplate. This DRYs the entire tree.

### NEW: `src/pages/book/free-bay/index.tsx` (Step 1: Date/Time)
- **What was changed**: Created the Free Bay entry page with "YOUR FREE SESSION STARTS HERE" headline and the CalendarWidget.
- **Why**: This is the dedicated landing for the "Book your free 30 minutes" CTA.

### NEW: `src/pages/book/free-bay/contact.tsx` (Step 2: Contact)
- **What was changed**: Contact form with inline validation, booking summary bar, and "Confirm My Free Session" CTA.

### NEW: `src/pages/book/free-bay/thank-you.tsx` (Step 3: Confirmation)
- **What was changed**: Confirmation page with calendar add buttons and day-of preparation guide.

### NEW: `src/pages/book/evaluation/index.tsx` (Step 1: Date/Time)
- **What was changed**: Created the Evaluation entry page with "PERFORMANCE EVALUATION 50% OFF — JUST $75" headline and CalendarWidget.
- **Why**: Distinct copy and trust signals ("The Diagnostic Deep-Dive") from the free funnel.

### NEW: `src/pages/book/evaluation/contact.tsx` (Step 2: Contact)
- **What was changed**: Contact form that routes to `/book/evaluation/payment` instead of directly to thank-you.

### NEW: `src/pages/book/evaluation/payment.tsx` (Step 3: Payment)
- **What was changed**: Mock Stripe checkout page with order summary ($150 crossed out → $75), card input fields, and "PAY $75 & CONFIRM BOOKING" CTA.
- **Mock API Note**: Contains `TODO` comments marking where Stripe `loadStripe()`, `PaymentElement`, and `/api/create-payment-intent` API route need to be wired.

### NEW: `src/pages/book/evaluation/thank-you.tsx` (Step 4: Confirmation)
- **What was changed**: Confirmation page showing "$75.00 PAID" receipt and evaluation-specific preparation steps.

### MODIFIED: `src/pages/index.tsx`
- **What was changed**: Split the monolithic CTA listener into two routing arrays. `freeBayCtaTexts` routes to `/book/free-bay`, `evaluationCtaTexts` routes to `/book/evaluation`. The "Book Now" nav button still scrolls to the offer section.
- **Why**: Previously all CTAs blindly pushed to `/book/date` regardless of intent.

### Potential Risks
- The old `/book/date`, `/book/time`, `/book/contact`, `/book/thank-you` pages are still present but orphaned (no CTA links to them). They should be removed in a future cleanup.
- Stripe payment is mocked — must be replaced with real keys before production.
- Google Calendar API is mocked — must be replaced with real credentials and calendar ID.

---

## Commit 2: Slider Refactoring & Nav Anchors

### 1. `src/pages/index.tsx`
- **What was changed**:
  - Added the explicit `id="nav-book-now"` property onto the central header CTA and intercepted it within the native Javascript `useEffect`. Prevented its normal `/book/date` routing hook, securely replacing it with a `.scrollIntoView({ behavior: 'smooth' })` sweep specifically dropping down onto the `#the-offer` element containing the two packages.
  - Dynamically spliced out the massive monolithic "SOCIAL PROOF" raw HTML segment mapping into the `dangerouslySetInnerHTML` tree entirely, cleanly parsing and hooking up a separate custom `<TestimonialSlider/>` React mount point in its place.
  - Thoroughly scrubbed the obsolete vanilla Javascript nested pagination loops and window scroll listeners out of the hook that previously controlled the HTML slider.

### 2. `src/components/TestimonialSlider.tsx`
- **What was changed**:
  - Newly generated native React module.
  - Built an explicitly controlled React state container tracing an internal `centerIndex` mechanism iterating logically across an artificially expanded data array (cloning the initial testimonials block 3x). The container flawlessly transforms horizontally to "infinite" loop without native `snap-x` jitter by instantly dropping back into its middle buffer zone transparently.
  - Implemented logic calculating the physical center layout positioning exclusively matching device breakpoints natively (e.g. tracking width vs visible nodes) mapping the priority `bg-primary-container`, inverted dark typography, and elevated shadow styling exactly onto the central focused block securely.
  - Hardened left/right directional arrow button overlays applying rigorous `z-20` depths permanently avoiding UX clicking collisions with sliding internal layered content structures.

---

## Commit 1: Initial Layout Fixes

### 1. `src/pages/_document.tsx`
- **What was changed**: Shifted Google Fonts (`Bayon`, `Open Sans`, etc.) `<link>` imports directly into the structural `next/document` `<Head>`.
- **Reason**: Next.js automatically unmounts font nodes within dynamic page-level `next/head` shells during client-side navigation. Moving them sequentially into Document guarantees they persist reliably without flickering.

### 2. `src/styles/globals.css`
- **What was changed**: Removed the `@media (prefers-color-scheme: dark)` overwrites, enforcing the `--background: #0a0a0a` and `--foreground: #ededed` universally.
- **Reason**: Discovered that Light Theme desktop OS configurations were overwriting explicitly inherited colors. Since the entire app design is rigidly Dark Theme, globally enforcing it here protects layout color mapping.

### 3. `src/pages/index.tsx`
- **What was changed**:
  - Added `text-on-surface` utility class strictly onto the parent encompassing wrapper div.
  - Eliminated the local `/logo.svg` URL path, mapping it to the newly provided production webp URL.
  - Demolished the placeholder video block, injecting the requested responsive YouTube `<iframe>`.
