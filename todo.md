# BRE470 Piling Mat Designer TODO

## Original Features (v1)
- [x] BRE470 calculation engine (cohesive + granular subgrades)
- [x] Calculator page with step-by-step inputs
- [x] Cross-section SVG diagram
- [x] Reference page with BRE470 tables
- [x] Export/print report functionality
- [x] Mobile-first responsive design
- [x] Home landing page

## Phase 1: Infrastructure Upgrade
- [x] Upgrade to web-db-user (backend + database + auth)
- [x] Add Stripe feature

## Phase 2: Paywall & Payment Flow
- [x] Redesign Home page with sales-focused landing page
- [x] Add tagline: "Design & check your own bases — one-off cost"
- [x] Add £300 price display and Buy Now button
- [x] Create Stripe checkout session for £300 one-off payment
- [x] Create payment success page
- [x] Store purchase records in database
- [x] Gate calculator and reference pages behind payment check

## Phase 3: Access & Sharing
- [x] After purchase, allow buyer to share access with construction companies
- [x] Generate shareable access link/code
- [x] Allow shared users to access the tool without paying again
- [x] Access code redemption page

## Phase 4: Testing & Delivery
- [x] Unit tests for purchase and access code routers (12 tests passing)
- [x] Verify calculator still works correctly after changes
- [x] Test full purchase flow end-to-end (12 unit tests passing)
- [x] Fix render-phase navigation in Calculator/Reference to use useEffect
- [x] Save checkpoint and deliver

## Piling Rig Database Feature
- [x] Research Liebherr piling rig specifications (LB 16-44, LRB 155/255)
- [x] Research Bauer piling rig specifications (BG 15-46)
- [x] Research Soilmec piling rig specifications (SR-30 to SR-100)
- [x] Create rig database data file with 23 models and EN 996 parameters
- [x] Build RigSelector UI component with search, manufacturer filter tabs
- [x] Integrate rig selector into Calculator Step 4 with Select Rig / Manual Entry toggle
- [x] Allow manual override of auto-filled values
- [x] Write 25 unit tests for rig database (all passing)
- [x] All 43 tests passing (25 rig + 18 existing)
- [x] Save checkpoint and deliver

## PWA Support & Free Demo Mode
- [x] Create PWA manifest.json with app name, icons, theme colors
- [x] Generate PWA icons (192x192, 512x512)
- [x] Add service worker for offline caching
- [x] Add install prompt banner for mobile users
- [x] Register manifest and service worker in index.html
- [x] Add free demo mode: one free calculation without purchase
- [x] Show demo result with upsell prompt to purchase full access
- [x] Track demo usage in localStorage to limit to one free calc
- [x] Add "Try Free Demo" CTA on landing page hero and pricing card
- [x] Restrict export/print and calculation steps for demo users
- [x] Test PWA installation banner visible on calculator
- [x] Test demo mode flow — 6 unit tests passing
- [x] All 58 tests passing (15 demo + 25 rig + 18 existing)
- [x] Save checkpoint and deliver

## Tiered Subscription Model & Marketing
- [x] Convert products.ts from one-off to 3 tiered subscriptions (Individual/Team/Enterprise)
- [x] Update Stripe checkout to create subscriptions instead of one-off payments
- [x] Update webhook handler for subscription events (invoice.paid, customer.subscription.*)
- [x] Update database schema for subscription tracking (tier, status, period)
- [x] Update access control to check active subscription status
- [x] Update landing page with 3-tier pricing cards (£9.99/£29.99/£49.99 per month)
- [x] Add annual pricing with discount (£99/£299/£499 per year)
- [x] Add David Miller consultation section (Temporary Works Designer, 1-to-1 coaching)
- [x] Update marketing copy to emphasise cost savings for the industry
- [x] Add Email David and Call to Book buttons for David Miller consultation
- [x] Update Account page for subscription management with billing portal
- [x] Write tests for subscription logic — 72 tests passing
- [x] Save checkpoint and deliver

## Contact Details Update
- [x] Update Home.tsx with real email (temporaryworksconsultingltd@outlook.com)
- [x] Update Home.tsx with real phone (07900 984900)
- [x] Update footer email to temporaryworksconsultingltd@outlook.com
- [x] Verified no other pages have placeholder contact details
- [x] Fixed service worker cache (bumped to v2) to serve fresh content
- [x] All 72 tests passing
- [x] Save checkpoint and deliver
