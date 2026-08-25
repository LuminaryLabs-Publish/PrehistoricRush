import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createPrehistoricRushPlayerImplementation } from "../src/domains/prehistoric-rush/player-implementation.js";
import { createPrehistoricRushGameplayImplementation } from "../src/domains/prehistoric-rush/gameplay-implementation.js";

const originalStructuredClone = globalThis.structuredClone;
let cloneCalls = 0;
globalThis.structuredClone = (value) => {
  cloneCalls += 1;
  return originalStructuredClone(value);
};

const intents = [];
const engine = {
  n: {
    player: {},
    character: {},
    motion: {
      submitIntent(intent) {
        intents.push({
          ...intent,
          desiredVelocity: { ...intent.desiredVelocity },
          desiredFacing: { ...intent.desiredFacing }
        });
      }
    }
  }
};
const samples = Array.from({ length: 4096 }, (_, index) => ({ x: Math.sin(index * 0.01) * 18, z: index * 2, width: 3.1 }));
const course = {
  route: {
    samples,
    pathHalfWidth: 3.1,
    nearest(x, z) {
      const index = Math.max(0, Math.min(samples.length - 1, Math.round(z / 2)));
      return { index, progress: index / (samples.length - 1), distance: Math.abs(x - samples[index].x), width: 3.1 };
    },
    classify(distance, width) {
      if (distance <= width) return "path";
      if (distance <= width + 1.5) return "edge";
      if (distance <= width + 4) return "verge";
      return "forest";
    }
  }
};
const world = { sampleElevation(x, z) { return Math.sin(x * 0.01) * 0.5 + Math.cos(z * 0.01) * 0.5; } };

const player = createPrehistoricRushPlayerImplementation({ engine, course, world });
const gameplay = createPrehistoricRushGameplayImplementation({ player, course, world, goalDistance: 3600 });
const setupCloneCalls = cloneCalls;
const initialState = gameplay.readState();
const initialPickups = gameplay.readPickups();
assert.ok(initialPickups.length > 0, "pickups must be generated");

for (let frame = 0; frame < 600; frame += 1) {
  if (frame === 30) gameplay.setInput({ boost: true });
  if (frame === 120) gameplay.setInput({ steer: 0.4 });
  if (frame === 240) gameplay.setInput({ steer: 0 });
  if (frame === 300) gameplay.setInput({ jump: true });
  gameplay.tick(1 / 60);
  assert.strictEqual(gameplay.readState(), initialState, "hot-path run state must retain stable identity");
  assert.strictEqual(gameplay.readPickups(), initialPickups, "active pickup view must retain stable identity");
}

assert.equal(cloneCalls, setupCloneCalls, "600 hot-path frames must not call structuredClone");
assert.equal(intents.length, 600, "each gameplay frame must still submit one motion intent");
assert.ok(gameplay.readState().distance > 100, "player must continue traversing the course");
const coldSnapshot = gameplay.snapshot();
assert.ok(cloneCalls > setupCloneCalls, "diagnostic snapshot is allowed to clone off the hot path");
assert.notStrictEqual(coldSnapshot.run, gameplay.readState(), "snapshot must remain isolated from hot state");

const semanticSource = await readFile(new URL("../src/game-runtime-semantic-v2.js", import.meta.url), "utf8");
const gpuSource = await readFile(new URL("../src/game-runtime-shared-gpu-v3.js", import.meta.url), "utf8");
assert.equal((semanticSource.match(/requestAnimationFrame\(loop\)/g) ?? []).length, 2, "semantic runtime must use one loop target for bootstrap + recurrence");
assert.equal((gpuSource.match(/requestAnimationFrame/g) ?? []).length, 0, "GPU upgrade must not create a second RAF");
assert.match(semanticSource, /gameplay\.readState\(\)/, "semantic hot path must use borrowed state");
assert.match(semanticSource, /HUD_INTERVAL_MS = 200/, "HUD work must be throttled to 5 Hz");

console.log(JSON.stringify({
  status: "PASS",
  frames: 600,
  hotPathStructuredCloneCalls: 0,
  intents: intents.length,
  distance: Math.round(gameplay.readState().distance),
  pickups: gameplay.readPickups().length
}, null, 2));

globalThis.structuredClone = originalStructuredClone;
