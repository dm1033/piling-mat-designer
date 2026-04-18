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

## Per-Design Payment & Certificate (v3)
- [x] Convert payment model from subscriptions to per-design £299.99
- [x] Update products.ts with single per-design product
- [x] Update Stripe checkout for one-off per-design payments
- [x] Update webhook handler for per-design checkout.session.completed
- [x] Update database schema to track individual design purchases (designs table)
- [x] Create professional design certificate page with:
  - [x] Full interpretive design and calculations (Section 4: Calculation Audit Trail)
  - [x] Clear check certificate format (Section 5: Design Check Certificate)
  - [x] Signed by David Miller, Temporary Works Designer
  - [x] Project details, soil parameters, rig details, results
  - [x] BRE470 compliance statement and disclaimer
  - [x] Professional A4 print-ready formatting with company branding
- [x] Update calculator flow: calculate → project details → pay £299.99 → certificate
- [x] Update landing page pricing to show £299.99 per design
- [x] Update marketing copy to emphasise per-design value vs consultant cost
- [x] Remove subscription-related UI (monthly/annual toggle, tiers)
- [x] Create My Designs page showing all purchased certificates
- [x] Create PaymentSuccess page with certificate link
- [x] Add Certificate route (/certificate/:id)
- [x] Rewrite purchase.test.ts for per-design model (10 tests)
- [x] Rewrite webhook-integration.test.ts for per-design model (14 tests)
- [x] All 65 tests passing across 5 test files
- [x] Save checkpoint and deliver

## Admin Panel
- [x] Add admin DB helpers (getAllUsers, getAllDesigns, getAdminStats)
- [x] Add admin tRPC procedures (admin.users, admin.designs, admin.stats) using adminProcedure
- [x] Create admin Dashboard page with summary stats (total users, total designs, total revenue)
- [x] Create admin Users page with table listing all users (name, email, role, designs count, joined date)
- [x] Create admin Designs page with table listing all certificates (ref, project, user, payment status, date)
- [x] Create admin design detail view to see full certificate data
- [x] Wire AdminLayout with sidebar navigation (Dashboard, Users, Designs, Back to Site)
- [x] Add /admin routes to App.tsx with role-based access control (adminProcedure)
- [x] Add Admin link in header nav (visible only to admin role users)
- [x] Write vitest tests for admin procedures (13 tests, all passing)
- [x] All 78 tests passing across 6 test files
- [x] Save checkpoint and deliver

## Bug Fix: Duplicate React Instance
- [x] Fix duplicate React causing 'Invalid hook call' in TRPCProvider
- [x] Fix Vite websocket connection failure (resolved by fresh node_modules install)
- [x] Clear Vite dep cache and verify fix (all pages rendering, 0 console errors)

## Bug Fix: Persistent Duplicate React (v2)
- [x] Root cause: Service worker (sw.js v2) used cache-first for ALL static assets including Vite optimized deps
- [x] When Vite regenerated deps with new hashes, SW served stale cached React chunk alongside fresh one
- [x] Fix: Updated sw.js to v3 — never caches .vite/ files, uses network-first for JS/CSS
- [x] Added all deps to optimizeDeps.include to prevent two-pass optimization
- [x] Verified: all pages render correctly with 0 application errors (Vite HMR websocket warning remains in dev proxy environment — does not affect production)
- [x] All 78 tests passing across 6 test files

## SEO Optimisation
- [x] Audit current meta tags, title, description across all pages
- [x] Add SEO meta tags (title, description, keywords) to index.html
- [x] Add Open Graph and Twitter Card meta tags for social sharing
- [x] Add JSON-LD structured data (Product, Organization, FAQPage, WebApplication)
- [x] Create sitemap.xml with all public pages (9 URLs)
- [x] Create robots.txt with sitemap reference
- [x] Add canonical URL and geo targeting meta tags
- [x] Build blog/articles section with 5 SEO-rich articles:
  - [x] Article 1: What is BRE470 and Why It Matters for Piling
  - [x] Article 2: How to Design a Working Platform to BRE470
  - [x] Article 3: Piling Mat Design Calculator — Save 50-70% vs Consultants
  - [x] Article 4: Temporary Works Coordinator Guide to Platform Certificates
  - [x] Article 5: Choosing the Right Piling Rig — Track Pressures Explained
- [x] Blog listing page (/blog) with article cards, hero images, tags
- [x] Individual article page (/blog/:slug) with TOC, share links, prev/next nav
- [x] Blog routes added to App.tsx
- [x] Blog link added to header navigation (visible to all users)
- [x] Internal linking: footer Quick Links + Popular Articles, CTA in each article
- [x] Dynamic document title and meta description per article
- [x] LinkedIn and Email share links on each article
- [x] All 78 tests passing across 6 test files
- [x] Save checkpoint and deliver

## Marketing Outreach & Contact List
- [x] Research UK piling contractors (FPS full + associate members)
- [x] Research ground engineering companies
- [x] Research temporary works design consultancies
- [x] Research principal contractors with piling/ground engineering divisions
- [x] Research rig hire companies and piling equipment suppliers
- [x] Research geotechnical consultants and material suppliers
- [x] Compile 98 contacts into structured Excel spreadsheet (8 sheets, 7 categories + summary)
- [x] Draft 4 marketing email templates (primary, short, TWC, industry body)
- [x] Create LinkedIn posting strategy with 2 post templates
- [x] Include Mailchimp setup guide and GDPR compliance notes
- [x] Add Share/Referral section to homepage (LinkedIn, Email, Copy Link)
- [x] All 88 tests passing across 7 test files
- [x] Save checkpoint and deliver

## Google Analytics, CPD Page & Industry Article
- [x] Add Google Analytics tracking to the site (Manus Umami analytics already configured in index.html)
- [x] Build CPD Presentation Request page (/cpd)
  - [x] Overview of CPD talk: "BRE470 Compliance Made Simple"
  - [x] Learning outcomes, duration, target audience
  - [x] Request form (name, company, email, preferred date, number of attendees)
  - [x] Store CPD requests in database and notify admin
- [x] Add CPD link to navigation (header + footer)
- [x] Add /cpd to sitemap.xml (10 URLs total)
- [x] Admin CPD Requests page with status management
- [x] Write professional article for industry bodies (FPS, TWf, ICE, Ground Engineering)
  - [x] Article: "Working Platform Design in the Digital Age"
  - [x] Suitable for newsletter submission to FPS, TWf, ICE, Ground Engineering magazine
  - [x] Include problem statement, solution, benefits, call to action
- [x] Add routes, navigation, run tests (88 tests passing, 0 TS errors)
- [x] Save checkpoint and deliver

## CPD Payment (£19.99) & PayPal Integration
- [x] Add CPD_PRODUCT constant (£19.99, 1999 pence) to server/products.ts
- [x] Add cpd.submit procedure — Stripe Checkout for CPD at £19.99 (merged submit + checkout)
- [x] Enable PayPal payment method on CPD Stripe Checkout session
- [x] Enable PayPal payment method on Design Certificate Stripe Checkout session
- [x] Update CPD page: form submits → stores CPD request → redirects to Stripe Checkout
- [x] Add dedicated CpdSuccess page (/cpd-success) with booking confirmation
- [x] Update webhook to handle CPD checkout.session.completed (mark CPD request as paid)
- [x] Add paymentStatus, stripeSessionId, paymentIntentId columns to cpd_requests table
- [x] Update admin CPD Requests page to show payment status badge
- [x] Run tests (88 passing, 0 TS errors), save checkpoint, deliver
