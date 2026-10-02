# Armenia Life Sciences Exchange

An Armenian-first discovery network for Armenia's CROs, research centers, laboratories, manufacturers, and other life sciences providers, with Russian and English translations. The commercial plan centers on **private AI agent workspaces and custom agent development for providers**: cited capability answers, RFQ intake and proposal drafts, approved document search, and human-reviewed workflow handoffs. The public directory helps buyers find and compare providers and gives the agent business a trusted route to customers.

The public index currently has ten real, source-linked entries: five clinical-study sites from ClinicalTrials.gov and five manufacturers from Armenian regulator GMP documents. These records state only what the sources establish; they do not verify commercial CRO services, provider consent, or current service availability. The AI pilot button drafts a brief locally; it does not submit a lead.

**Live demo:** https://hrezaii95.github.io/armenia-CRO/

Run locally from this directory:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` and try the language switch, search, filters, profile details, comparison, and inquiry flow. Run `node tests/smoke.mjs` for source and localization checks. With the server running, `node tests/browser-smoke.cjs` tests the full interaction flow using fixture records injected only into the browser test.

The [business plan](docs/business-plan.md) sets out the agent revenue model, market hypothesis, pilot economics, trust requirements, and source gaps. AI workspaces and integrations are proposed paid pilot scopes, not live functions of this demo. [Data sourcing rules](data/SOURCES.md) explain how real organizations enter the index. No package install, credentials, or build step is required to run the site; fonts and GSAP are bundled locally. Font licenses are in `assets/fonts/` and the geographic outline comes from Natural Earth public domain data via `world-atlas`.

GitHub Pages publishes the root of the `gh-pages` branch. After verifying an update locally, publish it with `git push origin HEAD:main` followed by `git push origin HEAD:gh-pages`. The repository's GitHub Actions token cannot create a Pages site, so branch publishing is used.
