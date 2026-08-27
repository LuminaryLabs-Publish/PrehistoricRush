import assert from "node:assert/strict";
import { createPrehistoricRushPlayerImplementation } from "../src/domains/prehistoric-rush/player-implementation.js";

const intents = [];
const engine = {
  n: {
    player: {},
    character: {},
    motion: { submitIntent(value) { intents.push(structuredClone(value)); } }
  }
};
const course = {
  route: {
    nearest(x, z) {
      return { index: Math.max(0, Math.floor(z * 2)), progress: z / 100, distance: Math.abs(x), width: 2 };
    },
    classify(distance, width) {
      return distance <= width ? "path" : distance <= width + 1 ? "edge" : distance <= width + 2 ? "verge" : "forest";
    }
  }
};
const world = {
  sampleElevation(x, z) {
    return Math.sin(x * 0.03) * 0.2 + Math.cos(z * 0.02) * 0.1;
  }
};
const racer = createPrehistoricRushPlayerImplementation({ engine, course, world });

const expected = new Map([
  [1, { x: 0.022712158896634825, z: 0.5558501816445274, yaw: 0.040837500000000006, speed: 16.858, jumpHeight: 0, region: "path" }],
  [6, { x: 0.1774873907325992, z: 2.0455271162145934, yaw: 0.14396250000000002, speed: 18.674379322620418, jumpHeight: 0.21555555555555556, region: "path" }],
  [24, { x: 1.7147245640651736, z: 9.446680699414967, yaw: 0.11756250000000007, speed: 25.706857737912017, jumpHeight: 2.524122000000001, region: "path" }],
  [30, { x: 2.454580112558356, z: 12.439898876046472, yaw: 0.32696250000000004, speed: 27.05474470226868, jumpHeight: 2.4406995555555575, region: "edge" }],
  [36, { x: 3.572606503689451, z: 14.867111306814884, yaw: 0.5069625000000002, speed: 26.49897224021687, jumpHeight: 2.009099555555558, region: "verge" }],
  [48, { x: 6.374407325186981, z: 19.911968863754204, yaw: 0.5069625000000002, speed: 22.922555127478425, jumpHeight: 0, region: "forest" }]
]);

function close(actual, target, label) {
  assert.ok(Math.abs(actual - target) <= 1e-12, `${label}: expected ${target}, received ${actual}`);
}

for (let index = 0; index < 48; index += 1) {
  const frame = index + 1;
  const state = racer.tick(index % 9 === 0 ? 0.033 : 1 / 60, {
    steer: index < 12 ? 0.55 : index < 24 ? -0.35 : index < 36 ? 0.8 : 0,
    boost: index >= 8 && index < 30,
    jump: index === 5 || index === 28
  });
  const checkpoint = expected.get(frame);
  if (!checkpoint) continue;
  close(state.x, checkpoint.x, `frame ${frame} x`);
  close(state.z, checkpoint.z, `frame ${frame} z`);
  close(state.yaw, checkpoint.yaw, `frame ${frame} yaw`);
  close(state.speed, checkpoint.speed, `frame ${frame} speed`);
  close(state.jumpHeight, checkpoint.jumpHeight, `frame ${frame} jumpHeight`);
  assert.equal(state.region, checkpoint.region, `frame ${frame} region`);
}

const state = racer.snapshot();
const intent = intents.at(-1);
close(state.distance, 21.1586933920178, "final distance");
close(state.surfaceMultiplier, 0.6045134885226128, "final surface multiplier");
assert.equal(state.grounded, true);
assert.equal(state.abilityStatus, "ready", "unavailable vine anchors do not alter legacy movement");
assert.equal(intent.id, "player-motion-48");
assert.equal(intent.actorId, "player-character");
assert.equal(intent.sequence, 48);
close(intent.desiredVelocity.x, 11.12945151435463, "final intent velocity x");
close(intent.desiredVelocity.z, 20.039432191604554, "final intent velocity z");

console.log("racer controller Velociraptor parity ok");
