import { createDrunkRouteGenerator } from "./kits/drunk-route-generator.js";

const clone = (value) => value === undefined ? undefined : structuredClone(value);

export function createPrehistoricRushCourseDomainKit(NexusEngine, config = {}) {
  const { defineDomainServiceKit } = NexusEngine;
  if (typeof defineDomainServiceKit !== "function") {
    throw new TypeError("Pinned NexusEngine module is missing defineDomainServiceKit().");
  }

  const route = createDrunkRouteGenerator({
    seed: config.seed ?? 238991,
    segmentLength: config.segmentLength ?? 18,
    sampleSpacing: config.sampleSpacing ?? 2.5,
    pathHalfWidth: config.pathHalfWidth ?? 3.1,
    vergeWidth: config.vergeWidth ?? 3.2
  });

  return defineDomainServiceKit({
    id: config.id ?? "prehistoric-rush-course-domain-kit",
    domain: "prehistoric-rush-course",
    domainPath: "n:prehistoric-rush:course",
    parentDomainPath: "n:prehistoric-rush",
    apiName: config.apiName ?? "prehistoricRushCourse",
    version: "1.0.0",
    stability: "game",
    services: ["route", "surface-classification", "snapshot"],
    requires: ["n:prehistoric-rush"],
    createApi() {
      return {
        route,
        nearest: (...args) => route.nearest(...args),
        classify: (...args) => route.classify(...args),
        snapshot: () => clone(route.snapshot())
      };
    },
    metadata: {
      purpose: "Authoritative PrehistoricRush playable-course boundary.",
      owns: ["playable route", "route proximity", "route surface classification"],
      doesNotOwn: ["terrain generation", "terrain elevation", "world geometry", "world composition", "rendering", "physics", "player lifecycle"],
      implementationKit: "drunk-route-generator",
      temporaryRouteAlgorithm: true,
      deterministic: true,
      rendererAgnostic: true,
      snapshot: true
    }
  });
}

export default createPrehistoricRushCourseDomainKit;
