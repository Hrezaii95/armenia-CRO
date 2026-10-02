# Armenia Life Sciences Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a polished, working static demo and a provisional, evidence conscious business plan.

**Architecture:** HTML/CSS/JavaScript with a single fictional provider dataset. Browser state drives search, filters, compare, profile, and inquiry draft. No backend or third party scripts.

**Tech Stack:** HTML5, CSS3, JavaScript ES modules, Python standard library HTTP server for local smoke checks.

**Spec:** `docs/superpowers/specs/2026-10-02-armenia-lifesciences-marketplace-design.md`

## Global Constraints

- The GitHub repository has no pre-existing source or commits.
- All sample providers are fictional and visibly labeled.
- The demo must not send inquiries or make unverified compliance claims.
- No runtime dependencies or credentials are required.

## Review Focus

- Empty searches show a useful empty state.
- Filters can be cleared without reloading.
- Comparison is limited to three providers.
- Inquiry text is explicitly a draft and survives step navigation.
- Mobile layout remains usable at narrow widths.

---

### Task 1: Research brief and product framing

**Files:** Create `docs/business-plan.md`; create `README.md`.

- [ ] Explain the buyer problem, launch wedge, business model, hypotheses, validation steps, and source gaps.
- [ ] Document local startup and demo limitations.
- [ ] Check the documents for unsupported claims and missing source notes.

### Task 2: Static marketplace demo

**Files:** Create `index.html`, `styles.css`, `data/providers.js`, `app.js`.

- [ ] Build the accessible page shell and responsive visual design.
- [ ] Implement search, category chips, profile detail, and up to three way comparison.
- [ ] Implement the five field inquiry draft and copy action with no network send.
- [ ] Verify the controls with a browser or functional DOM test.

### Task 3: Local readiness and publication

**Files:** Create `tests/smoke.mjs`; optionally create deployment configuration if supported.

- [ ] Run source checks and the functional smoke test.
- [ ] Start the HTTP server and check an actual page request.
- [ ] Try the available authorized public hosting route, then verify the live URL if deployed.
- [ ] Save reproducible startup instructions in the cloud environment draft.
