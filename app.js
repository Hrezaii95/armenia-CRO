import { providers, categories } from "./data/providers.js";
import { translations } from "./i18n.js";
import { filterProviders, localized, createBrief } from "./lib/catalog.js";

const $ = (selector) => document.querySelector(selector);
const state = { locale: initialLocale(), query: "", category: "all", compared: new Set(), recipientId: null };
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const t = () => translations[state.locale];
const langTag = { hy: "hy-AM", ru: "ru-RU", en: "en-US" };
const cityCoordinates = { Yerevan: [44.515, 40.177], Gyumri: [43.845, 40.789], Vanadzor: [44.493, 40.812], Dilijan: [44.863, 40.74] };
function projectPoint(longitude, latitude) {
  const radians = Math.PI / 180;
  const scale = 8325.648911506465;
  return [scale * longitude * radians - 6240.845678467901, 6619.062631582581 - scale * Math.log(Math.tan(Math.PI / 4 + latitude * radians / 2))];
}

function initialLocale() {
  const requested = new URLSearchParams(location.search).get("lang");
  if (requested && translations[requested]) return requested;
  try { const stored = localStorage.getItem("als-locale"); if (translations[stored]) return stored; } catch {}
  return "hy";
}

function sourceUrl(provider) {
  try {
    const url = new URL(provider.sourceUrl || provider.website);
    return url.protocol === "https:" ? url.href : "";
  } catch { return ""; }
}

function dateLabel(value) {
  if (!value) return t().unknown;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? t().unknown : new Intl.DateTimeFormat(langTag[state.locale], { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(date);
}

function setLocale(locale) {
  if (!translations[locale]) return;
  state.locale = locale;
  document.documentElement.lang = locale;
  document.title = t().title;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (typeof t()[key] === "string") element.textContent = t()[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t()[element.dataset.i18nPlaceholder] || "";
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    const active = button.dataset.lang === locale;
    button.setAttribute("aria-pressed", String(active));
    button.classList.toggle("active", active);
  });
  const stage = $("#stage-select").value;
  $("#stage-select").innerHTML = `<option value="">${escapeHtml(t().formStageOption)}</option>${t().stages.map((label, index) => `<option value="${index}">${escapeHtml(label)}</option>`).join("")}`;
  $("#stage-select").value = stage;
  const url = new URL(location.href);
  url.searchParams.set("lang", locale);
  history.replaceState(null, "", url);
  try { localStorage.setItem("als-locale", locale); } catch {}
  renderCategories();
  renderProviders();
  if ($("#profile-dialog").open) openProfile($("#profile-dialog").dataset.id, true);
  if ($("#compare-dialog").open) openComparison(true);
  if ($("#inquiry-dialog").open) renderRecipient();
}

function renderCategories() {
  $("#categories").innerHTML = categories.map((category) => `<button type="button" data-category="${category}" class="${category === state.category ? "active" : ""}" aria-pressed="${category === state.category}">${escapeHtml(t().categories[category])}</button>`).join("");
}

function renderProviders() {
  const matches = filterProviders(providers, state.query, state.category);
  $("#result-count").textContent = String(matches.length);
  $("#provider-grid").innerHTML = matches.map((provider, index) => `<article class="provider-card"><div class="card-top"><span class="card-index">NO. ${String(index + 1).padStart(2, "0")}</span><label class="card-compare"><input type="checkbox" data-compare="${escapeHtml(provider.id)}" ${state.compared.has(provider.id) ? "checked" : ""} aria-label="${escapeHtml(t().compare)} ${escapeHtml(localized(provider.name, state.locale))}">${escapeHtml(t().compare)}</label></div><div class="card-sector">${escapeHtml(t().categories[provider.sector] || provider.sector)}</div><h3>${escapeHtml(localized(provider.name, state.locale))}</h3><p>${escapeHtml(localized(provider.summary, state.locale))}</p><div class="card-bottom"><span class="card-location">${escapeHtml(localized(provider.city, state.locale))} / ARMENIA</span><button class="card-open" type="button" data-profile="${escapeHtml(provider.id)}" aria-label="${escapeHtml(t().profile)}: ${escapeHtml(localized(provider.name, state.locale))}">↗</button></div></article>`).join("");
  $("#empty-state").hidden = matches.length !== 0;
  $("#empty-state h3").textContent = providers.length ? t().noMatchTitle : t().emptyTitle;
  $("#empty-state p").textContent = providers.length ? t().noMatchBody : t().emptyBody;
  renderCompareBar();
  renderMetrics();
}

function renderCompareBar() {
  $("#compare-bar").hidden = state.compared.size === 0;
  $("#compare-count").textContent = String(state.compared.size);
  $("#compare-open").disabled = state.compared.size < 2;
}

function renderMetrics() {
  $("#metric-providers").textContent = String(providers.length);
  $("#metric-sectors").textContent = String(new Set(providers.map((p) => p.sector)).size);
  $("#metric-cities").textContent = String(new Set(providers.map((p) => localized(p.city, "en"))).size);
  const counts = categories.slice(1).map((category) => [category, providers.filter((provider) => provider.sector === category).length]).filter((item) => item[1] > 0);
  const max = Math.max(1, ...counts.map((item) => item[1]));
  $("#sector-chart").innerHTML = counts.map(([category, count]) => `<div class="sector-row"><span>${escapeHtml(t().categories[category])}</span><div class="sector-track"><div class="sector-fill" style="width:${Math.round(100 * count / max)}%"></div></div><span>${count}</span></div>`).join("");
  renderMapMarkers();
}

function renderMapMarkers() {
  const byCity = new Map();
  for (const provider of providers) {
    const key = localized(provider.city, "en");
    const existing = byCity.get(key) || [];
    existing.push(provider);
    byCity.set(key, existing);
  }
  const stage = $(".map-stage").getBoundingClientRect();
  const image = $(".map-stage img").getBoundingClientRect();
  $("#map-markers").innerHTML = [...byCity].filter(([city, list]) => cityCoordinates[city] || (Number.isFinite(list[0]?.longitude) && Number.isFinite(list[0]?.latitude))).map(([city, list]) => {
    const [longitude, latitude] = cityCoordinates[city] || [list[0].longitude, list[0].latitude];
    const [x, y] = projectPoint(longitude, latitude);
    const left = image.left - stage.left + image.width * x / 600;
    const top = image.top - stage.top + image.height * y / 500;
    return `<span class="map-marker" style="left:${left}px;top:${top}px" title="${escapeHtml(city)}: ${list.length}"><span>${escapeHtml(city)} · ${list.length}</span></span>`;
  }).join("");
}

function openProfile(id, refresh = false) {
  const provider = providers.find((item) => item.id === id);
  if (!provider) return;
  const url = sourceUrl(provider);
  const details = [
    [t().sector, t().categories[provider.sector] || provider.sector],
    [t().location, localized(provider.city, state.locale)],
    [t().services, localized(provider.services, state.locale).join?.(", ") || localized(provider.services, state.locale)],
    [t().languages, provider.languages?.join(", ") || t().unknown],
    [t().evidenceDate, dateLabel(provider.sourceChecked)]
  ];
  $("#profile-content").innerHTML = `<div class="dialog-head"><span class="dialog-code">PROFILE / SOURCE-LINKED</span><button type="button" data-close="profile-dialog" aria-label="${escapeHtml(t().close)}">×</button></div><div class="profile-content"><div class="profile-meta">${escapeHtml(t().categories[provider.sector] || provider.sector)} / ${escapeHtml(localized(provider.city, state.locale))}</div><h2>${escapeHtml(localized(provider.name, state.locale))}</h2><p>${escapeHtml(localized(provider.summary, state.locale))}</p><div class="profile-grid">${details.map(([label, value]) => `<div><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value || t().unknown)}</span></div>`).join("")}</div><div class="profile-source"><strong>${escapeHtml(t().source)}:</strong> ${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t().visitSource)} ↗</a>` : escapeHtml(t().unknown)}<br>${escapeHtml(t().claimNote)}</div><button type="button" data-inquire="${escapeHtml(provider.id)}">${escapeHtml(t().briefCta)} ↗</button></div>`;
  $("#profile-dialog").dataset.id = id;
  if (!refresh) {
    $("#profile-dialog").showModal();
    const page = new URL(location.href); page.searchParams.set("provider", id); history.replaceState(null, "", page);
  }
}

function openComparison(refresh = false) {
  if (state.compared.size < 2) return;
  const chosen = providers.filter((provider) => state.compared.has(provider.id));
  const rows = [
    [t().sector, (p) => t().categories[p.sector] || p.sector],
    [t().location, (p) => localized(p.city, state.locale)],
    [t().services, (p) => localized(p.services, state.locale).join?.(", ") || t().unknown],
    [t().evidenceDate, (p) => dateLabel(p.sourceChecked)],
    [t().source, (p) => sourceUrl(p) || t().unknown]
  ];
  $("#compare-content").className = "compare-content";
  $("#compare-content").innerHTML = `<table class="compare-table"><thead><tr><th>${escapeHtml(t().compare)}</th>${chosen.map((provider) => `<th>${escapeHtml(localized(provider.name, state.locale))}</th>`).join("")}</tr></thead><tbody>${rows.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td>${chosen.map((provider) => `<td>${escapeHtml(value(provider))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  if (!refresh) $("#compare-dialog").showModal();
}

function renderRecipient() {
  const provider = providers.find((item) => item.id === state.recipientId);
  $("#inquiry-recipient").textContent = provider ? localized(provider.name, state.locale) : t().formGeneric;
}

function openInquiry(id = null) {
  state.recipientId = id;
  renderRecipient();
  $("#draft-result").hidden = true;
  $("#inquiry-dialog").showModal();
}

function resetFilters() {
  state.query = ""; state.category = "all"; $("#search").value = "";
  renderCategories(); renderProviders();
}

function initMotion() {
  if (!window.gsap || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro.from(".hero-eyebrow", { y: 18, autoAlpha: 0, duration: .55 })
    .from(".title-line", { y: 55, autoAlpha: 0, stagger: .14, duration: .9 }, "-=.2")
    .from(".hero-description,.hero-actions", { y: 22, autoAlpha: 0, stagger: .1, duration: .65 }, "-=.45")
    .from(".hero-art", { scale: .93, autoAlpha: 0, duration: 1 }, "<-.35");
  gsap.to(".art-core", { y: -10, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
  if (window.ScrollTrigger) {
    gsap.utils.toArray(".section-header,.method-card,.metric-row").forEach((element) => {
      gsap.from(element, { y: 36, duration: .75, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 90%", once: true } });
    });
    gsap.from(".brief-main", { y: 36, duration: .75, ease: "power2.out", scrollTrigger: { trigger: ".brief-main", start: "top 90%", once: true } });
  }
}

document.addEventListener("click", (event) => {
  const lang = event.target.closest("[data-lang]");
  if (lang) { setLocale(lang.dataset.lang); return; }
  const category = event.target.closest("[data-category]");
  if (category) { state.category = category.dataset.category; renderCategories(); renderProviders(); return; }
  const profile = event.target.closest("[data-profile]");
  if (profile) { openProfile(profile.dataset.profile); return; }
  const inquire = event.target.closest("[data-inquire]");
  if (inquire) { $("#profile-dialog").close(); openInquiry(inquire.dataset.inquire); return; }
  const close = event.target.closest("[data-close]");
  if (close) { $(`#${close.dataset.close}`).close(); return; }
});
document.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-compare]");
  if (!checkbox) return;
  if (checkbox.checked && state.compared.size >= 3) { checkbox.checked = false; return; }
  if (checkbox.checked) state.compared.add(checkbox.dataset.compare);
  else state.compared.delete(checkbox.dataset.compare);
  renderCompareBar();
});
$("#search").addEventListener("input", (event) => { state.query = event.target.value; renderProviders(); });
$("#clear-filters").addEventListener("click", resetFilters);
$("#empty-reset").addEventListener("click", resetFilters);
$("#compare-clear").addEventListener("click", () => { state.compared.clear(); renderProviders(); });
$("#compare-open").addEventListener("click", () => openComparison());
$("#nav-inquiry").addEventListener("click", () => openInquiry());
$("#brief-open").addEventListener("click", () => openInquiry());
$("#inquiry-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = Object.fromEntries(new FormData(event.currentTarget));
  const stage = $("#stage-select").selectedOptions[0].textContent;
  const draft = createBrief({ recipient: $("#inquiry-recipient").textContent, ...form, stage }, t());
  $("#draft-text").value = draft;
  $("#draft-result").hidden = false;
  $("#draft-result").scrollIntoView({ block: "nearest", behavior: "smooth" });
});
$("#copy-draft").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText($("#draft-text").value); $("#copy-draft").textContent = t().formCopied; }
  catch { $("#draft-text").focus(); $("#draft-text").select(); }
});
$("#profile-dialog").addEventListener("close", () => { const url = new URL(location.href); url.searchParams.delete("provider"); history.replaceState(null, "", url); });
for (const dialog of document.querySelectorAll("dialog")) dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
window.addEventListener("resize", () => renderMapMarkers());
$(".map-stage img").addEventListener("load", renderMapMarkers);

setLocale(state.locale);
const deepLink = new URLSearchParams(location.search).get("provider");
if (deepLink && providers.some((item) => item.id === deepLink)) openProfile(deepLink);
window.addEventListener("load", initMotion);
