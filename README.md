# Armenia Life Sciences Index

An Armenian-first index of Armenia's life sciences organizations, with Russian and English translations. The redesign uses locally bundled fonts and animation, an Armenia map, and source-linked provider records. The inquiry tool drafts text in the browser; it does not send or store anything.

**Live demo:** https://hrezaii95.github.io/armenia-CRO/

Run locally from this directory:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` and try the language switch, search, filters, profile details, comparison, and inquiry flow. Run `node tests/smoke.mjs` for source and localization checks. With the server running, `node tests/browser-smoke.cjs` tests the full interaction flow using fixture records injected only into the browser test.

The [business plan](docs/business-plan.md) sets out the market hypothesis, pilot economics, trust requirements, and source gaps. [Data sourcing rules](data/SOURCES.md) explain how real organizations enter the index. No package install, credentials, or build step is required to run the site; fonts and GSAP are bundled locally. Font licenses are in `assets/fonts/` and the geographic outline comes from Natural Earth public domain data via `world-atlas`.

GitHub Pages publishes the root of the `gh-pages` branch. After verifying an update locally, publish it with `git push origin HEAD:main` followed by `git push origin HEAD:gh-pages`. The repository's GitHub Actions token cannot create a Pages site, so branch publishing is used.
