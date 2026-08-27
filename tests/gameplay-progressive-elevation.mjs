import assert from "node:assert/strict";
import { createPrehistoricRushGameplayImplementation } from "../src/domains/prehistoric-rush/gameplay-implementation.js";

const samples = Array.from({ length: 2072 }, (_, index) => ({ x: Math.sin(index * 0.017) * 20, z: index * 2.5, width: 3.1 }));
const course = { route: { samples } };
let elevationSamples = 0;
const elevation = (x, z) => Math.sin(x * 0.03) + Math.cos(z * 0.02);
const world = {
  sampleElevation(x, z) {
    elevationSamples += 1;
    return elevation(x, z);
  }
};
const state = {
  x: 0, y: 0, z: 0, yaw: 0, speed: 0, verticalVelocity: 0, jumpHeight: 0, grounded: true,
  distance: 0, routeIndex: 0, routeProgress: 0, region: "path", surfaceMultiplier: 1, steer: 0,
  stamina: 100, abilityId: null, abilityStatus: "unavailable", abilityElapsed: 0, abilityCooldown: 0,
  abilityEffect: null, passiveId: null, lastLandingImpact: 0, landingRecoveryMultiplier: 1
};
const player = {
  tick() { return state; },
  reset() { return state; }
};

const gameplay = createPrehistoricRushGameplayImplementation({ player, course, world });
assert.equal(elevationSamples, 0, "gameplay construction does not synchronously project route-wide Foundation elevations");
assert.ok(gameplay.readPickups().length > 0);
gameplay.tick(1 / 60);
assert.equal(elevationSamples, 2, "pickup Foundation projection is limited to two samples per frame");
gameplay.hydratePickupElevations(1000);
assert.equal(elevationSamples, gameplay.readPickups().length, "all pickup elevations can converge incrementally");
for (const pickup of gameplay.readPickups()) {
  assert.equal(pickup.y, elevation(pickup.x, pickup.z) + 1.15, "incremental projection preserves eager semantic elevation results");
}

console.log("progressive gameplay elevation and semantic equivalence passed");
