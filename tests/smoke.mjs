import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { providers } from "../data/providers.js";
import { translations } from "../i18n.js";
import { filterProviders, localized, createBrief } from "../lib/catalog.js";

const fixture = [
  { id: "fixture-a", sector: "research", name: { en: "Assay Lab", ru: "Лаборатория анализов", hy: "Անալիզի լաբորատորիա" }, city: { en: "Yerevan", ru: "Ереван", hy: "Երևան" }, summary: { en: "Assay design", ru: "Разработка анализов", hy: "Փորձարկումների մշակում" }, services: { en: ["Assay design"], ru: ["Разработка анализов"], hy: ["Փորձարկումների մշակում"] } },
  { id: "fixture-b", sector: "analytical", name: { en: "Quality Lab", ru: "Лаборатория качества", hy: "Որակի լաբորատորիա" }, city: { en: "Gyumri", ru: "Гюмри", hy: "Գյումրի" }, summary: { en: "Testing", ru: "Тестирование", hy: "Փորձարկում" }, services: { en: ["Quality testing"], ru: ["Контроль качества"], hy: ["Որակի ստուգում"] } }
];

assert.equal(filterProviders(fixture, "", "all").length, 2);
assert.deepEqual(filterProviders(fixture, "анализов", "all").map((p) => p.id), ["fixture-a"]);
assert.deepEqual(filterProviders(fixture, "Երևան", "research").map((p) => p.id), ["fixture-a"]);
assert.deepEqual(filterProviders(fixture, "assay", "analytical"), []);
assert.equal(localized(fixture[0].name, "hy"), "Անալիզի լաբորատորիա");
for (const locale of ["hy", "ru", "en"]) {
  const brief = createBrief({ recipient: "Example", service: "Bioanalysis", stage: "Preclinical", scope: "Samples", timing: "Q1", contact: "Team" }, translations[locale]);
  assert.match(brief, /Bioanalysis/);
  assert.match(brief, /Samples/);
  assert.match(brief, new RegExp(translations[locale].formNotice.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}
assert.throws(() => createBrief({ recipient: "Example", service: "", stage: "Clinical", scope: "Study", timing: "Soon", contact: "Team" }, translations.en), /Complete every brief field/);
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]);
for (const locale of ["hy", "ru", "en"]) for (const key of keys) assert.equal(typeof translations[locale][key], "string", `${locale}.${key} missing`);
for (const provider of providers) {
  assert.match(provider.sourceUrl, /^https:\/\//);
  assert.match(provider.sourceChecked, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(provider.name.en && provider.name.hy && provider.name.ru);
}
assert.ok(providers.every((provider) => !/Ararat Bioanalytics|Sevan Clinical Partners|Masis Formulation Studio/.test(provider.name.en)));
console.log("Localization, catalog, source policy, and brief checks passed.");
