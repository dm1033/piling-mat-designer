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
