import assert from "node:assert/strict";
import {
  NEXUS_COMMIT,
  NEXUS_REF,
  RUNTIME_URLS
} from "../src/shared/runtime-versions.js";
import {
  PREHISTORIC_PATCH_COMPUTE_GRAPH_ID,
  createPrehistoricPatchComputeProvider,
  createPrehistoricPatchComputeRequest,
  evaluatePlayableStartup
} from "../src/shared/prehistoric-compute-streaming.js";

assert.equal(NEXUS_REF, "main", "PrehistoricRush intentionally follows mutable NexusEngine/main");
assert.equal(NEXUS_COMMIT, "f030abd8f648fc3bf1ac0a359e7a421822b41b88", "validation records exact Nexus Compute baseline");
assert.ok(RUNTIME_URLS.nexusCompute.endsWith("/core-domains/compute/index.js"));
for (const [name, url] of Object.entries(RUNTIME_URLS)) {
  if (!String(url).includes("NexusEngine@")) continue;
  assert.equal(String(url).includes("/subdomains/"), false, `${name} must use semantic Nexus paths`);
}

const request = { id: "0:0", x: 0, z: 0 };
const execution = createPrehistoricPatchComputeRequest(request);
assert.equal(execution.graph.id, PREHISTORIC_PATCH_COMPUTE_GRAPH_ID);
assert.deepEqual(execution.executionOrder, ["generate-patch"]);
assert.strictEqual(execution.input.request, request, "patch request stays zero-copy inside the Worker Compute adapter");

const patch = { id: "0:0", terrain: { heights: new Float32Array([1, 2, 3]) } };
const provider = createPrehistoricPatchComputeProvider(() => patch);
const result = await provider.executeGraph(execution);
assert.strictEqual(result.outputs.patch, patch, "large patch output is not defensively duplicated before postMessage transfer");
assert.equal(result.metadata.transferableOutput, true);

const playable = evaluatePlayableStartup({
  simulationRequired: 9,
  simulationGenerated: 9,
  simulationReady: 9,
  visualRequired: 12,
  visualReady: 0,
  collisionReady: true,
  rendererReady: true
});
assert.equal(playable.playableReady, true, "distant presentation prefetch must not block gameplay");
assert.equal(playable.backgroundVisualPending, 12);

const blocked = evaluatePlayableStartup({
  simulationRequired: 9,
  simulationGenerated: 9,
  simulationReady: 9,
  visualRequired: 12,
  visualReady: 12,
  collisionReady: true,
  rendererReady: false
});
assert.equal(blocked.playableReady, false, "the playable simulation ring must be rendered before entry");

console.log("PrehistoricRush Compute streaming contract passed.");
