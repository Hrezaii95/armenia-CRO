import { providers, categories } from "./data/providers.js";
import { filterProviders, createBrief } from "./lib/catalog.js";

const state = { query: "", category: "All", compared: new Set(), recipient: "a provider" };
const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const tags = (items) => items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("");

function renderCategories() {
  $("#categories").innerHTML = categories.map((category) => `<button type="button" data-category="${escapeHtml(category)}" class="${category === state.category ? "active" : ""}" aria-pressed="${category === state.category}">${escapeHtml(category)}</button>`).join("");
}

function renderProviders() {
  const matches = filterProviders(providers, state.query, state.category);
  $("#result-count").textContent = `${matches.length} ${matches.length === 1 ? "profile" : "profiles"}`;
  $("#provider-grid").innerHTML = matches.map((provider) => `
    <article class="provider-card">
      <div class="card-top"><span class="avatar ${escapeHtml(provider.accent)}" aria-hidden="true">${escapeHtml(provider.initials)}</span><label class="compare-toggle"><input type="checkbox" data-compare="${escapeHtml(provider.id)}" ${state.compared.has(provider.id) ? "checked" : ""} aria-label="Compare ${escapeHtml(provider.name)}"> Compare</label></div>
      <div class="card-category">${escapeHtml(provider.category)} · ${escapeHtml(provider.location)}</div>
      <h3>${escapeHtml(provider.name)}</h3><p class="tagline">${escapeHtml(provider.tagline)}</p>
      <div class="tag-list">${tags(provider.services.slice(0, 2))}</div>
      <div class="card-footer"><span>Illustrative profile</span><button type="button" data-profile="${escapeHtml(provider.id)}">View profile <span aria-hidden="true">↗</span></button></div>
    </article>`).join("");
  $("#empty-state").hidden = matches.length !== 0;
  renderCompareBar();
}

function renderCompareBar() {
  $("#compare-bar").hidden = state.compared.size === 0;
  $("#compare-count").textContent = `${state.compared.size} selected`;
  $("#compare-open").disabled = state.compared.size < 2;
  $("#compare-open").title = state.compared.size < 2 ? "Select at least two providers" : "Compare selected providers";
}

function openProfile(id) {
  const provider = providers.find((item) => item.id === id);
  if (!provider) return;
  $("#profile-content").innerHTML = `
    <div class="dialog-head"><div class="profile-title-row"><span class="avatar ${escapeHtml(provider.accent)}" aria-hidden="true">${escapeHtml(provider.initials)}</span><div><span class="modal-kicker">ILLUSTRATIVE ${escapeHtml(provider.category.toUpperCase())} PROFILE</span><h2>${escapeHtml(provider.name)}</h2></div></div><button class="icon-button" type="button" data-close="profile-dialog" aria-label="Close profile">×</button></div>
    <div class="profile-summary"><p>${escapeHtml(provider.description)}</p><div class="profile-badges">${provider.services.map((service) => `<span>${escapeHtml(service)}</span>`).join("")}</div></div>
    <div class="profile-details"><div class="detail-card"><h3>Location</h3><p>${escapeHtml(provider.location)}, Armenia</p></div><div class="detail-card"><h3>Project stages</h3><p>${escapeHtml(provider.stages.join(", "))}</p></div><div class="detail-card"><h3>Modalities</h3><p>${escapeHtml(provider.modalities.join(", "))}</p></div><div class="detail-card"><h3>Languages</h3><p>${escapeHtml(provider.languages.join(", "))}</p></div><div class="detail-card"><h3>Response expectation</h3><p>${escapeHtml(provider.response)}</p></div><div class="detail-card"><h3>Evidence status</h3><p>${escapeHtml(provider.evidence)}</p></div></div>
    <div class="profile-caution">This is a fictional demonstration profile. Its name, services, response estimate, and quality details have not been verified. A production profile will need provider consent and dated evidence.</div>
    <div class="profile-actions"><button class="button button-primary" type="button" data-inquire="${escapeHtml(provider.id)}">Draft an inquiry <span aria-hidden="true">↗</span></button><button class="button button-outline" type="button" data-close="profile-dialog">Back to directory</button></div>`;
  $("#profile-dialog").showModal();
  history.replaceState(null, "", `${location.pathname}${location.search ? "" : ""}#provider-${encodeURIComponent(id)}`);
}

function openComparison() {
  if (state.compared.size < 2) return;
  const chosen = providers.filter((provider) => state.compared.has(provider.id));
  const rows = [
    ["Category", (provider) => provider.category],
    ["Location", (provider) => provider.location],
    ["Services", (provider) => provider.services.join(", ")],
    ["Modalities", (provider) => provider.modalities.join(", ")],
    ["Stages", (provider) => provider.stages.join(", ")],
    ["Languages", (provider) => provider.languages.join(", ")],
    ["Response", (provider) => provider.response],
    ["Evidence", (provider) => provider.evidence]
  ];
  $("#compare-content").innerHTML = `<table class="comparison-table"><thead><tr><th>Criteria</th>${chosen.map((provider) => `<th>${escapeHtml(provider.name)}<br><em>Fictional example</em></th>`).join("")}</tr></thead><tbody>${rows.map(([label, value]) => `<tr><td>${label}</td>${chosen.map((provider) => `<td>${escapeHtml(value(provider))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  $("#compare-dialog").showModal();
}

function openInquiry(id) {
  const provider = providers.find((item) => item.id === id);
  state.recipient = provider ? provider.name : "a provider";
  $("#inquiry-recipient").textContent = `Intended recipient: ${state.recipient} · fictional example`;
  $("#draft-result").hidden = true;
  $("#inquiry-dialog").showModal();
}

function resetFilters() {
  state.query = "";
  state.category = "All";
  $("#search").value = "";
  renderCategories();
  renderProviders();
}

document.addEventListener("click", (event) => {
  const category = event.target.closest("[data-category]");
  if (category) { state.category = category.dataset.category; renderCategories(); renderProviders(); return; }
  const profile = event.target.closest("[data-profile]");
  if (profile) { openProfile(profile.dataset.profile); return; }
  const inquiry = event.target.closest("[data-inquire]");
  if (inquiry) { $("#profile-dialog").close(); openInquiry(inquiry.dataset.inquire); return; }
  const close = event.target.closest("[data-close]");
  if (close) { $(`#${close.dataset.close}`).close(); return; }
});

document.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-compare]");
  if (!checkbox) return;
  if (checkbox.checked && state.compared.size >= 3) { checkbox.checked = false; window.alert("Choose up to three providers to compare."); return; }
  if (checkbox.checked) state.compared.add(checkbox.dataset.compare);
  else state.compared.delete(checkbox.dataset.compare);
  renderCompareBar();
});

$("#search").addEventListener("input", (event) => { state.query = event.target.value; renderProviders(); });
$("#clear-filters").addEventListener("click", resetFilters);
$("#empty-reset").addEventListener("click", resetFilters);
$("#compare-clear").addEventListener("click", () => { state.compared.clear(); renderProviders(); });
$("#compare-open").addEventListener("click", openComparison);
$("#inquiry-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = Object.fromEntries(new FormData(event.currentTarget));
  const draft = createBrief({ recipient: state.recipient, ...form });
  $("#draft-text").textContent = draft;
  $("#draft-result").hidden = false;
  $("#draft-result").scrollIntoView({ behavior: "smooth", block: "nearest" });
});
$("#copy-draft").addEventListener("click", async () => {
  const button = $("#copy-draft");
  try { await navigator.clipboard.writeText($("#draft-text").textContent); button.textContent = "Copied to clipboard"; }
  catch { button.textContent = "Select the text above to copy"; }
});
$("#profile-dialog").addEventListener("close", () => { if (location.hash.startsWith("#provider-")) history.replaceState(null, "", `${location.pathname}#directory`); });
for (const dialog of document.querySelectorAll("dialog")) dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

renderCategories();
renderProviders();
if (location.hash.startsWith("#provider-")) openProfile(decodeURIComponent(location.hash.slice(10)));
