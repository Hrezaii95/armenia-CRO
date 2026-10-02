import assert from "node:assert/strict";
import { providers } from "../data/providers.js";
import { filterProviders, createBrief } from "../lib/catalog.js";

assert.equal(providers.length, 6);
assert.equal(filterProviders(providers, "", "All").length, 6);
assert.deepEqual(filterProviders(providers, "bioanalysis", "Analytical").map((item) => item.id), ["ararat-bioanalytics"]);
assert.deepEqual(filterProviders(providers, "clinical", "Manufacturing"), []);
assert.equal(filterProviders(providers, "  GYUMRI  ", "All")[0].id, "apricot-device-lab");

const draft = createBrief({ recipient: "Ararat Bioanalytics", service: "Method development", stage: "Preclinical", scope: "Small molecule samples", timing: "January", contact: "Example research team" });
assert.match(draft, /Method development/);
assert.match(draft, /Small molecule samples/);
assert.match(draft, /DRAFT ONLY/);
assert.throws(() => createBrief({ recipient: "Example", service: "", stage: "Clinical", scope: "Study", timing: "Soon", contact: "Team" }), /Complete every brief field/);

console.log("Catalog and inquiry smoke checks passed.");
