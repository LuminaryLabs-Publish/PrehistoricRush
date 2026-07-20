import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const runtimeSource = await readFile(new URL("../src/game-runtime-lod.js", import.meta.url), "utf8");
const adapterSource = await readFile(new URL("../src/render/three-patch-stream-adapter.js", import.meta.url), "utf8");
const lodAdapterSource = await readFile(new URL("../src/render/three-patch-stream-lod-adapter.js", import.meta.url), "utf8");
const versionsSource = await readFile(new URL("../src/shared/runtime-versions.js", import.meta.url), "utf8");

assert.doesNotMatch(adapterSource, /function rebuildActiveContent|rebuildActiveContent\(/, "full active-world rebuild authority is removed");
assert.match(adapterSource, /const activePatches = new Map\(\)/, "active patches retain explicit ownership");
assert.match(adapterSource, /const grassByPatch = new Map\(\)/, "grass is patch-owned");
assert.match(adapterSource, /const shardsByPatch = new Map\(\)/, "shards are patch-owned");
assert.match(adapterSource, /const collidersByPatch = new Map\(\)/, "colliders are patch-owned");
assert.match(adapterSource, /updateMode: "incremental"/g, "streamed instance batches opt into incremental ranges");
assert.match(adapterSource, /cellCapacity: TREE_CELL_CAPACITY/, "trees receive stable patch ranges");
assert.match(adapterSource, /cellCapacity: GRASS_CELL_CAPACITIES\[index\]/, "grass layers receive stable patch ranges");
assert.match(adapterSource, /cellCapacity: SHARD_CELL_CAPACITY/, "shards receive stable patch ranges");
assert.match(adapterSource, /tree\.trunkBatch\.replaceCell\(patch\.id/, "tree activation replaces one patch cell");
assert.match(adapterSource, /grass\[layerIndex\]\.batch\.replaceCell\(patch\.id/, "grass activation replaces one patch cell");
assert.match(adapterSource, /shardBatch\.replaceCell\(patchId, visible\)/, "pickup visibility replaces one shard cell");
assert.match(adapterSource, /tree\.trunkBatch\.releaseCell\(patchId\)/, "tree release removes one patch cell");
assert.match(adapterSource, /layer\.batch\.releaseCell\(patchId\)/, "grass release removes one patch cell");
assert.match(adapterSource, /shardBatch\.releaseCell\(patchId\)/, "shard release removes one patch cell");
assert.match(adapterSource, /mesh\.instanceMatrix\.addUpdateRange\?\.\(write\.start \* 16, write\.count \* 16\)/, "GPU uploads use reported changed ranges");
assert.match(adapterSource, /function syncColliderMembership\(\)/, "collider flattening is isolated to membership changes");
assert.equal((adapterSource.match(/corePhysics\.syncColliders\(/g) ?? []).length, 1, "collider synchronization has one bounded authority");
assert.match(adapterSource, /refreshDynamicContent\(state, changedPickupIds = \[\]\)/, "pickup refresh is separate from patch membership");
assert.doesNotMatch(adapterSource, /refreshDynamicContent[\s\S]{0,1200}syncColliderMembership\(/, "pickup changes do not resynchronize colliders");

assert.match(runtimeSource, /prefetchDistance: 5/, "the runner requests a five-patch forward horizon");
assert.match(runtimeSource, /cacheLimit: 128/, "the patch cache can retain active and visual-prefetch records");
assert.match(runtimeSource, /startupGenerationBudget: 4/, "startup uses bounded higher generation concurrency");
assert.match(runtimeSource, /startupActivationBudget: 4/, "startup admits multiple simulation patches per frame");
assert.match(runtimeSource, /visualPrefetchCapacity: 12/, "the visual corridor is capped at twelve patches");
assert.match(runtimeSource, /startupSimulationRadius: 1/, "startup requires a 3x3 simulation core");
assert.match(runtimeSource, /startupVisualRows: 4/, "startup requires four three-wide visual rows");
assert.match(runtimeSource, /priorityPolicy: runnerPatchPriority/, "the product supplies the runner-specific directional priority policy");
assert.match(runtimeSource, /takeReadyPrefetchPatches/, "the runtime adopts presentation-only patches");
assert.match(runtimeSource, /promotePrefetchPatch/, "the runtime promotes visual patches without regenerating them");
assert.match(runtimeSource, /await beginRun\("initial-run"\)/, "the initial run waits for world readiness");
assert.match(runtimeSource, /await prepareStartupWorld\(state\)/, "run entry is gated on the route corridor");
assert.doesNotMatch(runtimeSource, /generateSync\(/, "startup no longer synchronously generates only the center patch");
assert.match(runtimeSource, /adapter\.refreshDynamicContent\(state, collectedPickupIds\)/, "the runtime updates only collected pickup cells");
assert.match(runtimeSource, /adapter\.releasePatches\(controller\.takeReleasedPatchIds\(\)\)/, "stream release delegates patch identities only");

assert.match(lodAdapterSource, /function prefetchPatch\(entry, state\)/, "the renderer has an explicit visual-only admission path");
assert.match(lodAdapterSource, /function promotePrefetchPatch\(entry, state\)/, "the renderer promotes existing visual state to simulation");
assert.match(lodAdapterSource, /activeTerrainSlotCount \+ visualPrefetchCapacity/, "terrain capacity includes the visual corridor");
assert.match(lodAdapterSource, /presentationOnly: true/, "visual-prefetch admission is explicitly presentation-only");
const prefetchBody = lodAdapterSource.match(/function prefetchPatch\(entry, state\) \{([\s\S]*?)\n  \}/)?.[1] ?? "";
assert.doesNotMatch(prefetchBody, /baseActivatePatch/, "visual prefetch does not activate pickups, colliders, or gameplay ownership");
assert.match(versionsSource, /KITS_COMMIT = "6bcda82797ab7ba2929262fc9bb13eac3f9d3749"/, "the game pins the two-tier streaming kit revision");

console.log("patch-owned two-tier streaming authority test ok");
