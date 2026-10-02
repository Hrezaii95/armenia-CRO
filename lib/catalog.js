export function filterProviders(providers, query = "", category = "All") {
  const needle = query.trim().toLocaleLowerCase();
  return providers.filter((provider) => {
    if (category !== "All" && provider.category !== category) return false;
    if (!needle) return true;
    return [provider.name, provider.location, provider.category, provider.tagline, ...provider.services, ...provider.modalities, ...provider.stages]
      .join(" ").toLocaleLowerCase().includes(needle);
  });
}

export function createBrief({ recipient, service, stage, scope, timing, contact }) {
  const fields = { recipient, service, stage, scope, timing, contact };
  if (Object.values(fields).some((value) => !String(value ?? "").trim())) {
    throw new Error("Complete every brief field before creating a draft.");
  }
  return `To: ${recipient}\nSubject: Inquiry about ${service.trim()}\n\nHello,\n\nI am reaching out on behalf of ${contact.trim()} to explore a potential collaboration.\n\nService needed: ${service.trim()}\nProject stage: ${stage.trim()}\nProject context: ${scope.trim()}\nDesired start: ${timing.trim()}\n\nCould you let us know whether this is within your scope and what information you would need to assess fit?\n\nThank you,\n${contact.trim()}\n\n[DRAFT ONLY — review before sending. This site has not sent your inquiry.]`;
}
