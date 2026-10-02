// Run after starting: python3 -m http.server 4173
const assert = require("node:assert/strict");
const { chromium } = require("playwright");

async function assertLocale(page, locale) {
  const expected = await page.evaluate(async (language) => (await import("./i18n.js")).translations[language], locale);
  assert.equal(await page.locator("html").getAttribute("lang"), locale);
  assert.equal(await page.locator("[data-i18n=heroA]").innerText(), expected.heroA);
  assert.equal(await page.title(), expected.title);
  assert.equal(await page.locator('meta[name="description"]').getAttribute("content"), expected.description);
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });
  try {
    const compatibilityPage = await browser.newPage();
    await compatibilityPage.addInitScript(() => { Object.hasOwn = undefined; });
    await compatibilityPage.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await compatibilityPage.locator('[data-lang="ru"]').first().click();
    await assertLocale(compatibilityPage, "ru");
    await compatibilityPage.close();

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await assertLocale(page, "hy");
    await page.locator('[data-lang="ru"]').first().click();
    await assertLocale(page, "ru");
    await page.locator('[data-lang="en"]').first().click();
    await assertLocale(page, "en");
    for (const width of [1440, 1024, 768]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator('.header [data-lang="hy"]').click();
      const titleFits = await page.locator('[data-i18n="heroA"]').evaluate((element) => element.scrollWidth <= element.clientWidth);
      assert.ok(titleFits, `Armenian hero title overflows at ${width}px`);
    }
    await page.locator('.header [data-lang="en"]').click();
    const publicRecords = await page.locator(".provider-card").count();
    assert.equal(publicRecords, 10);
    assert.equal(await page.locator(".provider-card .card-source").count(), publicRecords);
    assert.equal(await page.locator(".provider-card .card-open").count(), publicRecords);
    assert.ok((await page.locator(".provider-card .card-open").first().innerText()).trim().length > 0);
    assert.equal(await page.locator("#metric-providers").innerText(), "10");
    await page.locator('[data-category="manufacturing"]').click();
    assert.equal(await page.locator(".provider-card").count(), 5);
    await page.locator('[data-category="research"]').click();
    assert.equal(await page.locator(".provider-card").count(), 5);
    await page.locator("#clear-filters").click();
    await page.locator('[data-profile="arpimed"]').click();
    assert.equal(await page.locator("#profile-dialog").getAttribute("aria-labelledby"), "profile-dialog-title");
    assert.match(await page.locator(".profile-source a").getAttribute("href"), /^http:\/\/www\.pharm\.am\/attachments\/article\//);
    await page.locator('[data-close="profile-dialog"]').click();

    await page.evaluate(async () => {
      const { providers } = await import("./data/providers.js?v=20261002-agent");
      providers.push(
        { id: "fixture-a", sector: "research", name: { en: "Fixture Research Lab", hy: "Փորձնական հետազոտական լաբորատորիա", ru: "Тестовая лаборатория" }, city: { en: "Yerevan", hy: "Երևան", ru: "Ереван" }, summary: { en: "Assay design", hy: "Փորձարկումների մշակում", ru: "Разработка анализов" }, services: { en: ["Assay design"], hy: ["Փորձարկումների մշակում"], ru: ["Разработка анализов"] }, languages: ["English"], sourceUrl: "https://example.org/research", sourceChecked: "2026-10-02" },
        { id: "fixture-b", sector: "analytical", name: { en: "Fixture Quality Lab", hy: "Փորձնական որակի լաբորատորիա", ru: "Тестовая лаборатория качества" }, city: { en: "Gyumri", hy: "Գյումրի", ru: "Гюмри" }, summary: { en: "Quality testing", hy: "Որակի ստուգում", ru: "Контроль качества" }, services: { en: ["Quality testing"], hy: ["Որակի ստուգում"], ru: ["Контроль качества"] }, languages: ["English"], sourceUrl: "https://example.org/quality", sourceChecked: "2026-10-02" }
      );
    });
    await page.locator('[data-category="all"]').click();
    assert.equal(await page.locator(".provider-card").count(), publicRecords + 2);
    await page.locator("#search").fill("Fixture Research Lab");
    assert.equal(await page.locator(".provider-card").count(), 1);
    await page.locator("#clear-filters").click();
    await page.locator('[data-compare="fixture-a"]').check();
    await page.locator('[data-compare="fixture-b"]').check();
    await page.locator("#compare-open").click();
    assert.equal(await page.locator("#compare-dialog").getAttribute("aria-labelledby"), "compare-dialog-title");
    assert.match(await page.locator("#compare-content").innerText(), /Fixture Quality Lab/);
    assert.equal(await page.locator("#compare-content a").count(), 2);
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

    await page.locator("#agent-pilot-open").click();
    assert.equal(await page.locator("#inquiry-dialog").getAttribute("aria-labelledby"), "inquiry-dialog-title");
    const aiCopy = await page.evaluate(async () => (await import("./i18n.js")).translations.en);
    assert.equal(await page.locator("#inquiry-dialog .dialog-inner h2").innerText(), aiCopy.aiPilotFormTitle);
    assert.equal(await page.locator("#inquiry-form [name=service]").inputValue(), aiCopy.aiPilotService);
    assert.equal(await page.locator("#stage-select option").count(), aiCopy.aiPilotStages.length + 1);
    await page.locator('[name="stage"]').selectOption("1");
    await page.locator('[name="scope"]').fill("Answer capability questions from approved materials with citations");
    await page.locator('[name="timing"]').fill("Next quarter");
    await page.locator('[name="contact"]').fill("Example team");
    await page.locator(".form-submit").click();
    assert.match(await page.locator("#draft-text").inputValue(), new RegExp(aiCopy.aiPilotAsk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await page.locator('[data-close="inquiry-dialog"]').click();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth) <= 390);
    await page.locator('.header [data-lang="ru"]').click();
    await assertLocale(page, "ru");
    await page.setViewportSize({ width: 320, height: 568 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth) <= 320);
    await page.locator('.header [data-lang="hy"]').click();
    await assertLocale(page, "hy");
    const navFits = await page.locator(".nav").evaluate((element) => element.scrollWidth <= element.clientWidth);
    assert.ok(navFits, "Mobile navigation should show all four destinations");
    assert.deepEqual(errors, []);
    console.log("Browser localization, profile, comparison, inquiry, and mobile checks passed.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
