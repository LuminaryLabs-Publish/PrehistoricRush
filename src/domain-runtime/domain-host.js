export function createDomainHost({ eventBus }) {
  const domains = new Map();

  function install(domain) {
    if (!domain?.id) throw new Error("Domain install requires an id.");
    if (domains.has(domain.id)) return domains.get(domain.id);
    const instance = domain.install?.({ host: api, eventBus }) ?? domain;
    domains.set(domain.id, instance);
    eventBus.emit("domain.installed", { id: domain.id, kind: domain.kind ?? "domain" });
    return instance;
  }

  function get(id) {
    return domains.get(id);
  }

  function tick(dt, context = {}) {
    for (const domain of domains.values()) domain.tick?.(dt, context);
  }

  function snapshot() {
    return {
      domains: [...domains.keys()],
      installed: [...domains.values()].map((domain) => domain.snapshot?.() ?? { id: domain.id })
    };
  }

  const api = { install, get, tick, snapshot };
  return api;
}
