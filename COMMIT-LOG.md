# Pre-Commit Diagnostic & Change Report (Cumulative)

## Diagnostic Summary
- **Tests**: No `test` script or testing framework configured.
- **TypeScript**: `tsc --noEmit` passes with zero errors.
- **Build**: `npm run build` succeeds — 14 pages + 3 API routes compiled. No warnings.
- **Security**: Full audit completed. No API keys, secrets, or PII in source code. `.env.local` is gitignored. Stripe secret key is server-side only. New `get-payment` API returns only non-sensitive fields (id, amount, currency, status, metadata).

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
