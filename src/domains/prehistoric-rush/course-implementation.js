import { createDrunkRouteGenerator } from "./kits/drunk-route-generator.js";

export function createPrehistoricRushCourseImplementation({ engine, config = {} } = {}) {
  if (!engine?.n?.world || !engine?.n?.spatial) {
    throw new TypeError("PrehistoricRush Course requires Nexus World and Spatial services.");
  }

  const route = createDrunkRouteGenerator({
    seed: config.seed ?? 238991,
    segmentLength: config.segmentLength ?? 18,
    sampleSpacing: config.sampleSpacing ?? 2.5,
    pathHalfWidth: config.pathHalfWidth ?? 3.1,
    vergeWidth: config.vergeWidth ?? 3.2
  });

  return Object.freeze({
    id: "prehistoric-rush-course",
    route,
    nearest: (...args) => route.nearest(...args),
    classify: (...args) => route.classify(...args),
    snapshot: () => ({
      id: "prehistoric-rush-course",
      authority: "prehistoric-rush-course-implementation",
      coreWorld: "n:world",
      coreSpatial: "n:spatial",
      route: route.snapshot()
    })
  });
}
