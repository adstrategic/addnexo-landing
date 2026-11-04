# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary buyer:** Owners, operators, CFOs, and general managers of US wholesale fresh produce distribution businesses generating **$5M to $100M in annual revenue**.
- **Operating reality:** Many buyers are of Hispanic origin and operate their business in English (with Spanish as a secondary language). They often check operations and search from mobile devices early in the morning (e.g., 4 a.m. warehouse receiving) or between sales and dispatch cycles.
- **Acquisition context (Produce Landing Page):** High-intent Google Search Ads traffic searching for landed cost / lot margin control, alternatives to spreadsheets/Excel, or wholesale produce ERP software.

## Product Purpose

ADDNEXO is the operating and financial system built for wholesale produce distribution. It unifies commercial workflows (Purchase → Purchase Order → Inventory → Customer Order → Dispatch → Invoice → Collection) and financial workflows (Purchase/Import → Associated Costs → Accounts Payable → Payment → Financial Control) into a single real-time system.

On the Google Ads conversion landing page (`/en/produce` and `/es/produce`), the **sole conversion objective** is booking a consultative **15-minute diagnostic call**—not self-serve signup or generic demo exploration.

## Positioning

- **True Landed Cost per Lot in Real Time:** "The supplier invoice is not the cost." Inventory stops being a mere quantity on hand and becomes a measurable economic unit—tracking what the lot cost (grower invoice + freight, customs, brokerage, insurance, cold storage, handling, shrink), what was lost, who bought it, what it earned, and the true gross margin in a 2–4% net margin business.
- **Accessible Vertical ERP vs. 6-Figure Legacy Systems:** Legacy produce ERPs (NetSuite, Famous Software, Silo, Prophet) require 6-figure budgets and 6–12 month implementations, out of reach for $5M–$100M distributors. The real incumbent is **QuickBooks + Excel + WhatsApp + notebooks**, making switching friction near zero because ADDNEXO replaces spreadsheet chaos rather than an entrenched ERP.
- **Battle-Tested Operational DNA:** Born solving the real operational pain of a Miami wholesale distributor who paid ~$6,000 upfront to get it solved and still runs the full cycle in production today, backed by a team with decades of real distribution knowledge (SICOM base).

## Operating Context

- **Core workflows:** Receiving containers/trucks at 4 a.m., assigning post-invoice costs (freight, customs, brokerage, insurance, cold storage, shrink) to specific lots, managing perishability, quoting and dispatching customer orders, invoicing, and collecting receivables.
- **Practical AI & Voice Layers:**
  - *AI quality reports at receiving:* Photos + notes generate automatic quality reports when the truck arrives.
  - *Voice-only operation:* Create purchase orders, dispatches, and invoices by voice alongside traditional manual entry.
  - *Conversational financial analyst:* Free-form business queries and recommendations on what to buy and whom not to buy from.

## Capabilities and Constraints

- **Pricing:** Transparent **$90 per user / month** (e.g., 5 users = $450/mo covering sales, admin, accounting, finance, and full operations; 8 users = $720/mo; 20 users = $1,800/mo).
- **Explicit Exclusion:** Do **not** include "automated buyer generation" as a live feature unless explicitly confirmed by the user prior to publishing.
- **Technical & Conversion Requirements for `/[locale]/produce`:**
  - Three interchangeable Hero variants controlled via URL query parameter (`?v=cost`, `?v=excel`, `?v=erp`, defaulting to `erp`) for Google Ads message match.
  - Single repeated primary CTA (`Book a free diagnostic call` / `Book my free diagnostic call`) scrolling to the diagnostic form; no competing secondary CTAs ("see demo", "explore", "contact sales").
  - Fast load times with no heavy background videos on the conversion page.
  - Conversion tracking firing a `form_submit` event (via `window.dataLayer` / `gtag` / `fbq` + custom event) strictly after successful validation and submission.
  - Bilingual architecture (`next-intl`) with English primary copy for US produce ads and clean structure ready for Spanish cloning.

## Brand Commitments

- **Visual reference:** Derived from ADDNEXO's established dark visual identity (`--brand-bg-dark` near-black `#060b19` / `#090d16`, `--brand-dark` deep slate, `--brand-cyan` teal/turquoise accents, crisp white typography in `Outfit`, subtle-bordered cards for metrics/modules, and `→` flow diagrams).
- **Voice & Tone:** Direct, authoritative, and aggressive on the distributor's financial and operational pain—speaking like operators who know what happens at 4 a.m. when a truck arrives short, not institutional or investor-speak.

## Evidence on Hand

- Real $42,000 avocado container landed-cost breakdown example (Grower invoice vs. freight, customs, brokerage, insurance, cold storage, handling, shrink → "true landed cost: unknown" in spreadsheets vs. exact margin in ADDNEXO).
- Miami wholesale produce distributor origin story (~$6,000 initial engagement, running full production cycle today) and decades of SICOM operational heritage.
- Product screenshots in `/public/` (`scs-dashboard-pc.png`, `scs-dasboard1-pc.png`, `scs-dashboard2-pc.png`, `scs-dasboard1-phone.png`, etc.) and brand logos (`addnexo.png`, `addstrategic-blanco.png`).

## Product Principles

1. **Economic truth per lot over accounting after-the-fact:** Every screen and narrative must connect physical inventory movement to real landed cost and net margin before the lot is sold out.
2. **Operator immediacy over enterprise bloat:** Speak directly to the $5M–$100M distributor's daily reality (Excel, QuickBooks, WhatsApp, 4 a.m. receiving docks) without enterprise jargon.
3. **Single consultative conversion path:** Every section builds conviction toward one low-friction action—booking a 15-minute honest diagnostic call.

