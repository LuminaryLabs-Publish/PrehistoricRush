import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.env.PREHISTORIC_EVIDENCE_DIR ?? ".agent/evidence/2026-08-09-prehistoric-headless-visual-upgrade");
const read = async (phase) => JSON.parse(await readFile(path.join(root, phase, "foundation-gate.json"), "utf8"));

const before = await read("before");
const after = await read("after");
assert.equal(before.status, "PASS");
assert.equal(before.phase, "before");
assert.equal(after.status, "PASS");
assert.equal(after.phase, "after");
assert.equal(after.nexus, "main");
assert.equal(after.terrainAuthority, "n:world:foundation");
assert.equal(after.vegetationEnabled, false);
assert.ok(after.landformCount >= 6);
assert.ok(after.traversalDistance >= 500);
assert.ok(after.seamDeltas.x < 0.5);
assert.ok(after.seamDeltas.z < 0.5);
assert.deepEqual(after.pageErrors, []);
assert.deepEqual(after.consoleErrors, []);

console.log(JSON.stringify({
  status: "PASS",
  transition: "historical-baseline -> semantic-foundation-gate-1",
  nexus: after.nexus,
  terrainAuthority: after.terrainAuthority,
  landformCount: after.landformCount,
  traversalDistance: after.traversalDistance,
  seamDeltas: after.seamDeltas,
  vegetationEnabled: after.vegetationEnabled
}, null, 2));
