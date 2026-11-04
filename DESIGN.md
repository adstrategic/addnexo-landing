---
name: ADDNEXO
description: Dark operational and financial ledger system for wholesale distribution and real-time lot control.
colors:
  brand-cyan: "#38bdf8"
  brand-blue: "#2563eb"
  alert-rose: "#fda4af"
  warning-amber: "#fcd34d"
  obsidian-ground: "#060b19"
  slate-surface: "#091022"
  ledger-card: "#0b1325"
  brand-dark: "#0f172a"
  text-primary: "#f8fafc"
  text-secondary: "#e2e8f0"
  text-muted: "#cbd5e1"
  border-subtle: "rgba(255, 255, 255, 0.1)"
  border-strong: "rgba(255, 255, 255, 0.15)"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(2.35rem, 5vw, 4.25rem)"
    fontWeight: 900
    lineHeight: 1.06
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(1.85rem, 3.6vw, 2.85rem)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "80px"
  section: "112px"
components:
  button-primary:
    backgroundColor: "{colors.brand-cyan}"
    textColor: "{colors.brand-dark}"
    rounded: "{rounded.pill}"
    padding: "16px 36px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  card-ledger:
    backgroundColor: "{colors.ledger-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input-dark:
    backgroundColor: "#0c1528"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
---

# Design System: ADDNEXO

## Overview

**Creative North Star: "The 4 A.M. Cold-Chain Financial Ledger"**

ADDNEXO's visual system is engineered for high-intent operational and financial clarity under real warehouse and buying-desk conditions. Rather than soft institutional SaaS pastures or decorative marketing chrome, the surface language pairs deep cold-chain obsidian and slate grounds with high-contrast white geometric headlines, surgical cyan indicators, and tabular receipt statements that expose lot-level economics immediately.

Density is purposeful and structured: generous vertical rhythm separates major narrative arguments, while inside financial artifacts—such as the Lot Economic Unit Ledger, the $42,000 Container Landed Cost Statement, and the Parallel Flow Diagram—information compacts into crisp hairline-divided tables with tabular numerals.

**Key Characteristics:**
- High-contrast obsidian and deep-slate surfaces designed for low-glare legibility at 4 a.m. receiving docks and executive buying desks.
- Bold, tightly tracked `Outfit` display typography that speaks directly without ornamental kickers or gradient text tricks.
- Strict monospace and `tabular-nums` discipline reserved exclusively for financial figures, lot codes, unit costs, and timestamps.
- Subtle 1px structural borders (`rgba(255, 255, 255, 0.1)` to `0.15`) and dashed receipt summary dividers that organize complex operational flows cleanly.

## Colors

The palette contrasts deep nocturnal slate surfaces against high-luminance white copy and surgical cyan operational accents, supplemented by semantic amber and rose signals for unallocated costs and margin leaks.

### Primary
- **Cold-Chain Cyan** (`#38bdf8` / `oklch(0.746 0.127 215.31)`): Primary conversion actions, active lot-sync bridges, verified landed-cost totals, and interactive focus rings.
- **Operational Royal Blue** (`#2563eb` / `oklch(0.546 0.215 262.88)`): Ambient radial depth and secondary interactive emphasis on light corporate views.

### Secondary
- **Margin-Leak Rose** (`#fda4af`): Used strictly in financial ledgers and form validation to flag uncalculated landed costs (`UNKNOWN`), per-box losses, and invalid inputs.
- **Unallocated Cost Amber** (`#fcd34d`): Highlights post-invoice charges (freight, customs, cold storage) that arrive weeks late in spreadsheet workflows.

### Neutral
- **Obsidian Dock Ground** (`#060b19`): Primary page background canvas on conversion surfaces.
- **Deep Cooler Slate** (`#091022` / `#0f172a`): Alternating section ground and sticky navigation surface.
- **Ledger Container Navy** (`#0b1325`): Elevated surface for financial statements, flow diagrams, and diagnostic forms.
- **Crisp Ledger White** (`#f8fafc`): Primary display headings, table totals, and key value callouts.
- **Cool Slate Copy** (`#e2e8f0` / `#cbd5e1`): High-contrast body copy and supporting table descriptions, maintaining ≥4.5:1 contrast against dark grounds.

### Named Rules
**The Single-Action Cyan Rule.** On conversion surfaces, solid Cold-Chain Cyan (`#38bdf8`) fills only the primary diagnostic call button and active ledger toggles so the conversion path is unmistakable at every scroll depth.

**The Semantic Red-Ink Rule.** Rose and amber accents appear only inside financial data rows or form errors to represent real money at risk—never as decorative badges or background washes.

## Typography

**Display Font:** `Outfit` (with `sans-serif` fallback)
**Body Font:** `Outfit` (with `sans-serif` fallback)
**Label/Mono Font:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

**Character:** `Outfit` delivers geometric authority at heavy weights (`800`–`900`) with tight negative tracking, while the system monospace stack provides clinical precision on currency columns, lot identifiers, and receipt breakdowns.

### Hierarchy
- **Display** (`900`, `clamp(2.35rem, 5vw, 4.25rem)`, `1.06` line-height, `-0.038em` tracking): Message-matched hero headlines (`<h1>`).
- **Headline** (`800`, `clamp(1.85rem, 3.6vw, 2.85rem)`, `1.12` line-height, `-0.03em` tracking): Section arguments (`<h2>`), always balanced (`text-wrap: balance`).
- **Title** (`700`, `1.22rem`, `1.25` line-height, `-0.02em` tracking): Capability and competitor row titles (`<h3>`).
- **Body** (`400`, `1rem`, `1.7` line-height, `500px`–`540px` max measure): Narrative paragraphs with `text-wrap: pretty` so lines stay under 75 characters with zero single-word stragglers.
- **Label / Tabular Data** (`700`, `0.875rem`, `0.04em` tracking, `tabular-nums`): Financial receipt rows, lot codes, and pricing figures.

### Named Rules
**The Self-Sufficient Heading Rule.** Headings carry their own weight without uppercase kickers or eyebrows stacked above them.

**The Tabular Currency Rule.** Every dollar amount, box count, and percentage uses `font-variant-numeric: tabular-nums` so vertical columns align to the pixel.

## Layout

Pages use a centered `1280px` max-width container with `20px` (`px-5`) horizontal padding on mobile and `32px` (`px-8`) on desktop. Sections follow a `80px` (`py-20`) mobile and `112px` (`sm:py-28`) desktop vertical rhythm separated by full-bleed `1px` hairline dividers (`rgba(255, 255, 255, 0.1)`).

Rather than repeating uniform card grids, layout structure varies by argument:
- **First Viewport:** 12-column asymmetric split (`7` columns copy/CTA, `5` columns live Lot Economic Unit Ledger + platform preview).
- **Problem Statement:** Sticky `5`-column narrative paired with a `7`-column interactive container receipt ledger.
- **Process Architecture:** Dual horizontal flow tracks (`Commercial Flow` and `Financial Flow`) connected by `→` arrows and a central real-time sync bridge.
- **Capabilities:** 3-column architectural hairline grid (`divide-x` on desktop, `divide-y` on mobile) with zero nested card boxes.

## Elevation & Depth

ADDNEXO relies primarily on **tonal surface layering and crisp 1px hairline borders**, reserving deep ambient shadows for primary interactive containers (the Hero Ledger, the $42,000 Container Receipt, and the Final Diagnostic Form) and primary CTA hover states.

### Shadow Vocabulary
- **Ledger Elevation** (`box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55)`): Anchors major financial proof artifacts against the obsidian ground.
- **Primary CTA Glow** (`box-shadow: 0 12px 32px rgba(56, 189, 248, 0.22)`): Subtle directional lift on the primary conversion button, intensifying to `0 6px 20px rgba(56, 189, 248, 0.35)` on hover.

### Named Rules
**The No-Nested-Cards Rule.** Once inside a bordered ledger or container (`#0b1325` or `#060b19` with `1px` border), internal groups separate strictly via horizontal or vertical hairlines (`divide-white/10`), never by placing smaller bordered cards inside a parent card.

## Shapes

- **Buttons:** Full pill geometry (`9999px`) for unmistakable clickability against rectangular data tables.
- **Ledger & Form Surfaces:** `16px` (`rounded-2xl`) outer corners with `1px` subtle borders (`rgba(255, 255, 255, 0.15)`).
- **Flow Steps & Inputs:** `8px` to `12px` (`rounded-lg` / `rounded-xl`) corners with crisp `1px` strokes.
- **Receipt Summary Divider:** `2px` dashed horizontal border (`border-t-2 border-dashed`) separating itemized post-invoice charges from the final landed-cost verdict.

## Components

### Buttons
- **Shape:** Full pill (`9999px` radius)
- **Primary (`lime` / `navCta`):** Solid Cold-Chain Cyan (`#38bdf8`) background, dark slate (`#0f172a`) bold text, `16px 36px` padding on hero/section CTAs.
- **Hover / Focus:** `-2px` vertical lift (`hover:-translate-y-0.5`) with `cubic-bezier(0.16, 1, 0.3, 1)` easing and cyan glow (`0 6px 20px rgba(56, 189, 248, 0.35)`).

### Cards / Containers
- **Corner Style:** `16px` radius (`rounded-2xl`)
- **Background:** `#0b1325` or `#060b19`
- **Shadow Strategy:** `0 24px 60px rgba(0, 0, 0, 0.55)` on primary proof ledgers; flat tonal layering on comparison matrices.
- **Border:** `1px solid rgba(255, 255, 255, 0.15)`
- **Internal Padding:** `24px` to `40px` (`p-6` to `sm:p-10`), divided internally by `1px` hairlines.

### Inputs / Fields
- **Style:** `12px` radius (`rounded-xl`), `1px solid rgba(255, 255, 255, 0.15)`, `#0c1528` background, `#f8fafc` text, `#94a3b8` (`text-slate-400`) high-contrast placeholders (`14px 16px` padding).
- **Focus:** Border shifts to `#38bdf8` with a `2px` cyan focus ring (`rgba(56, 189, 248, 0.3)`).
- **Error:** Rose error text (`#fda4af`) below the field with `aria-invalid="true"`.

### Navigation
- **Style:** Fixed `72px` height header (`rgba(6, 11, 25, 0.92)` with `backdrop-filter: blur(12px)` and `1px` bottom border), containing the ADDNEXO logo, anchor links (`14px` medium slate-300 shifting to white on hover), locale switcher (`EN`/`ES`), and the primary conversion CTA pill.

### Lot Landed-Cost Receipt Ledger
- **Structure:** Header bar with lot metadata (`#0d162c`), 2-button mode switch (`What Excel & QuickBooks Show Day 1` vs. `What ADDNEXO Calculates in Real Time`), 8 itemized cost rows with arrival timing subtitles, and a dashed-border total footer that toggles between `UNKNOWN` (rose alert) and `$51,870.00 / $33.95 per sellable box` (cyan verified).

## Do's and Don'ts

### Do:
- **Do** keep body copy containers constrained to `460px`–`540px` (`<75` characters per line) with `text-wrap: pretty`.
- **Do** use `tabular-nums` and monospace typography for all dollar figures, box counts, and lot codes.
- **Do** maintain a single repeated conversion CTA (`Book a free diagnostic call`) across the entire conversion surface.
- **Do** theme browser surfaces (`::selection`, `caret-color: #38bdf8`, and dark scrollbars) to match the obsidian ledger world.

### Don't:
- **Don't** place kickers, eyebrows, or small pill labels above `<h1>`, `<h2>`, or `<h3>` headings.
- **Don't** nest bordered cards inside other bordered cards; use `1px` hairline dividers instead.
- **Don't** use gradient text (`background-clip: text`) or decorative glassmorphism on data containers.
- **Don't** use body or label font sizes smaller than `12px` (`0.75rem`).
