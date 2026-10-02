// Run after starting: python3 -m http.server 4173
const assert = require("node:assert/strict");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("html").getAttribute("lang"), "hy");
    await page.locator('[data-lang="ru"]').first().click();
    assert.match(await page.locator("#hero-title").innerText(), /Бионауки Армении/);
    await page.locator('[data-lang="en"]').first().click();
    assert.match(await page.locator("#hero-title").innerText(), /Armenia’s life sciences/);

    await page.evaluate(async () => {
      const { providers } = await import("./data/providers.js");
      providers.push(
        { id: "fixture-a", sector: "research", name: { en: "Fixture Research Lab", hy: "Փորձնական հետազոտական լաբորատորիա", ru: "Тестовая лаборатория" }, city: { en: "Yerevan", hy: "Երևան", ru: "Ереван" }, summary: { en: "Assay design", hy: "Փորձարկումների մշակում", ru: "Разработка анализов" }, services: { en: ["Assay design"], hy: ["Փորձարկումների մշակում"], ru: ["Разработка анализов"] }, languages: ["English"], sourceUrl: "https://example.org/research", sourceChecked: "2026-10-02" },
        { id: "fixture-b", sector: "analytical", name: { en: "Fixture Quality Lab", hy: "Փորձնական որակի լաբորատորիա", ru: "Тестовая лаборатория качества" }, city: { en: "Gyumri", hy: "Գյումրի", ru: "Гюмри" }, summary: { en: "Quality testing", hy: "Որակի ստուգում", ru: "Контроль качества" }, services: { en: ["Quality testing"], hy: ["Որակի ստուգում"], ru: ["Контроль качества"] }, languages: ["English"], sourceUrl: "https://example.org/quality", sourceChecked: "2026-10-02" }
      );
    });
    await page.locator('[data-category="all"]').click();
    assert.equal(await page.locator(".provider-card").count(), 2);
    await page.locator("#search").fill("assay");
    assert.equal(await page.locator(".provider-card").count(), 1);
    await page.locator("#clear-filters").click();
    await page.locator('[data-compare="fixture-a"]').check();
    await page.locator('[data-compare="fixture-b"]').check();
    await page.locator("#compare-open").click();
    assert.match(await page.locator("#compare-content").innerText(), /Fixture Quality Lab/);
    await page.locator('[data-close="compare-dialog"]').click();
    await page.locator('[data-profile="fixture-a"]').click();
    assert.equal(await page.locator('.profile-source a').getAttribute('href'), "https://example.org/research");
    await page.locator('[data-inquire="fixture-a"]').click();
    await page.locator('[name="service"]').fill("Bioanalysis");
    await page.locator('[name="stage"]').selectOption("1");
    await page.locator('[name="scope"]').fill("Small molecule samples");
    await page.locator('[name="timing"]').fill("Next quarter");
    await page.locator('[name="contact"]').fill("Example team");
    await page.locator(".form-submit").click();
    assert.match(await page.locator("#draft-text").inputValue(), /Bioanalysis/);
    await page.locator('[data-close="inquiry-dialog"]').click();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth) <= 390);
    assert.deepEqual(errors, []);
    console.log("Browser localization, profile, comparison, inquiry, and mobile checks passed.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
