import { createEventBus } from "./domain-runtime/event-bus.js";
import { createDomainHost } from "./domain-runtime/domain-host.js";
import { createTickScheduler } from "./domain-runtime/tick-scheduler.js";
import { createDinoFormDomainKit, createDinoPoseDomainKit, createDinoMaterialDomainKit } from "./domains/dino/index.js";
import { createCameraDomainKit } from "./domains/camera/camera-domain-kit.js";
import { createHudDomainKit } from "./domains/hud/hud-domain-kit.js";

const eventBus = createEventBus();
const domainHost = createDomainHost({ eventBus });
const scheduler = createTickScheduler({ host: domainHost, eventBus });

const domains = [
  createDinoFormDomainKit({ entityId: "dino" }),
  createDinoPoseDomainKit({ entityId: "dino" }),
  createDinoMaterialDomainKit({ entityId: "dino" }),
  createCameraDomainKit(),
  createHudDomainKit()
];

for (const domain of domains) domainHost.install(domain);

globalThis.PrehistoricRushComposition = {
  version: "dsk-composition-v2-presentation",
  mode: "legacy-visual-runtime-with-camera-hud-dino-domain-scaffold",
  eventBus,
  domainHost,
  scheduler,
  snapshot() {
    return {
      version: this.version,
      mode: this.mode,
      domains: domainHost.snapshot(),
      events: eventBus.snapshot(),
      scheduler: scheduler.snapshot()
    };
  }
};

eventBus.emit("composition.ready", {
  version: globalThis.PrehistoricRushComposition.version,
  domains: domainHost.snapshot().domains
});

// Keep the live game playable while the monolith is cut apart one domain at a time.
await import("./runtime-terrain-v6.mjs");
