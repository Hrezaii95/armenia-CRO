# Armenia Life Sciences Exchange

An illustrative, dependency-free marketplace demo for discovering and comparing Armenian life sciences service providers. Provider names and capabilities in the demo are fictional. The inquiry assistant drafts text in the browser; it does not send or store anything.

**Live demo:** https://hrezaii95.github.io/armenia-CRO/

Run locally from this directory:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` and try search, filters, profile details, comparison, and the inquiry flow. For a quick automated check, run `node tests/smoke.mjs` and request the local page with `curl -f http://127.0.0.1:4173/` while the server runs.

The [business plan](docs/business-plan.md) sets out the market hypothesis, pilot economics, trust requirements, and source gaps. The [design brief](docs/superpowers/specs/2026-10-02-armenia-lifesciences-marketplace-design.md) defines this first product slice. No package install, credentials, or build step is required.

GitHub Pages publishes the root of the `gh-pages` branch. After verifying an update locally, publish it with `git push origin HEAD:main` followed by `git push origin HEAD:gh-pages`. The repository's GitHub Actions token cannot create a Pages site, so branch publishing is used.
