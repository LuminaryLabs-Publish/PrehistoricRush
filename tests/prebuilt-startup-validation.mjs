import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const RUN_ID = "2026-08-09-prehistoric-headless-visual-upgrade";
const foundationEvidencePath = path.resolve(`.agent/evidence/${RUN_ID}/after/foundation-gate.json`);
const output = path.resolve(`.agent/evidence/${RUN_ID}/metrics/prebuilt-startup.json`);
const evidence = JSON.parse(await readFile(foundationEvidencePath, "utf8"));

assert.equal(evidence.status, "PASS", "current production browser gate must pass before startup validation");
assert.equal(evidence.nexus, "main", "production startup consumes NexusEngine main");
assert.equal(evidence.terrainAuthority, "n:world:foundation", "production startup uses Nexus World Foundation terrain");
assert.equal(evidence.vegetationEnabled, false, "Gate 1 production startup keeps vegetation disabled");
assert.ok(evidence.landformCount >= 6, "production startup exposes the projected Nexus landform composition");
assert.ok(evidence.traversalDistance >= 500, "production startup survives the 0-500m Foundation playthrough");
assert.ok(evidence.seamDeltas.x < 0.5 && evidence.seamDeltas.z < 0.5, "Foundation cell seams remain continuous");
assert.deepEqual(evidence.pageErrors, [], "production startup has no browser page errors");
assert.deepEqual(evidence.consoleErrors, [], "production startup has no browser console errors");

const result = {
  status: "PASS",
  mode: "semantic-foundation-gate-1",
  nexus: evidence.nexus,
  terrainAuthority: evidence.terrainAuthority,
  vegetationEnabled: evidence.vegetationEnabled,
  landformCount: evidence.landformCount,
  traversalDistance: evidence.traversalDistance,
  seamDeltas: evidence.seamDeltas,
  deterministicSamples: evidence.deterministicSamples
};

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
