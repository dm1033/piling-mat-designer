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
