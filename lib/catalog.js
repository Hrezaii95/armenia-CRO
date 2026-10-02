export function localized(value, locale) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[locale] || value.en || Object.values(value)[0] || "";
}

export function filterProviders(providers, query = "", category = "all") {
  const needle = query.trim().toLocaleLowerCase();
  return providers.filter((provider) => {
    if (category !== "all" && provider.sector !== category) return false;
    if (!needle) return true;
    const values = [provider.name, provider.city, provider.summary, provider.services];
    const haystack = values.flatMap((value) => {
      if (typeof value === "string") return [value];
      if (Array.isArray(value)) return value;
      if (value && typeof value === "object") return Object.values(value).flat();
      return [];
    }).join(" ").toLocaleLowerCase();
    return haystack.includes(needle);
  });
}

export function createBrief({ recipient, service, stage, scope, timing, contact }, t) {
  const fields = { recipient, service, stage, scope, timing, contact };
  if (Object.values(fields).some((value) => !String(value ?? "").trim())) {
    throw new Error("Complete every brief field before creating a draft.");
  }
  return `${t.formTo}: ${recipient}\n${t.formSubject}: ${service.trim()}\n\n${t.formHello}\n\n${t.formService}: ${service.trim()}\n${t.formStage}: ${stage.trim()}\n${t.formScope}: ${scope.trim()}\n${t.formTiming}: ${timing.trim()}\n\n${t.formAsk}\n\n${t.formThanks}\n${contact.trim()}\n\n[${t.formNotice}]`;
}
