import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const runtimeSource = await readFile(new URL("../src/domains/prehistoric-rush/worker-patch-streaming-service.js", import.meta.url), "utf8");
const renderingSource = await readFile(new URL("../src/domains/prehistoric-rush/rendering-implementation.js", import.meta.url), "utf8");
const policySource = await readFile(new URL("../src/domains/prehistoric-rush/rendering-streaming-policy.js", import.meta.url), "utf8");
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
assert.match(adapterSource, /shardBatch\.releaseCell\(patchId\)/, "shards release one patch cell");
assert.match(adapterSource, /mesh\.instanceMatrix\.addUpdateRange\?\.\(write\.start \* 16, write\.count \* 16\)/, "GPU uploads use reported changed ranges");
assert.match(adapterSource, /function syncColliderMembership\(\)/, "collider flattening is isolated to membership changes");
assert.equal((adapterSource.match(/corePhysics\.syncColliders\(/g) ?? []).length, 1, "collider synchronization has one bounded authority");
assert.match(adapterSource, /refreshDynamicContent\(state, changedPickupIds = \[\]\)/, "pickup refresh is separate from patch membership");
assert.doesNotMatch(adapterSource, /refreshDynamicContent[\s\S]{0,1200}syncColliderMembership\(/, "pickup changes do not resynchronize colliders");

assert.match(policySource, /prefetchDistance: 5/, "the runner requests a five-patch forward horizon");
assert.match(policySource, /cacheLimit: 128/, "the patch cache can retain active and prefetched records");
assert.match(policySource, /generationBudget: 2/, "generation concurrency is centrally bounded");
assert.match(policySource, /activationBudget: 1/, "main-thread adoption is limited to one patch per frame");
assert.match(runtimeSource, /function prefetchPlan/, "the service generates a directional prefetch plan");
assert.match(runtimeSource, /function enforceCacheLimit/, "the service owns bounded cache eviction");
assert.match(runtimeSource, /staleRejected/, "stale worker results are explicitly rejected");
assert.match(runtimeSource, /deferred-main-thread-fallback/, "worker failure retains a bounded fallback");
assert.match(runtimeSource, /onRelease\(id, patch, reason\)/, "stream release delegates patch identities");
assert.match(renderingSource, /workerStreaming\?\.update\(state\)/, "the semantic render loop pumps the worker service");
assert.doesNotMatch(renderingSource, /function createForestPatch|function ensureForest/, "the semantic renderer contains no synchronous forest generator");

assert.match(lodAdapterSource, /function prefetchPatch\(entry, state\)/, "the renderer has an explicit visual-only admission path");
assert.match(lodAdapterSource, /function promotePrefetchPatch\(entry, state\)/, "the renderer promotes existing visual state to simulation");
assert.match(lodAdapterSource, /activeTerrainSlotCount \+ visualPrefetchCapacity/, "terrain capacity includes the visual corridor");
assert.match(lodAdapterSource, /presentationOnly: true/, "visual-prefetch admission is explicitly presentation-only");
const prefetchBody = lodAdapterSource.match(/function prefetchPatch\(entry, state\) \{([\s\S]*?)\n  \}/)?.[1] ?? "";
assert.doesNotMatch(prefetchBody, /baseActivatePatch/, "visual prefetch does not activate pickups, colliders, or gameplay ownership");
assert.match(versionsSource, /KITS_COMMIT = "9fd5b10053135e278c84b8b1591aece5cc641da1"/, "unchanged kits retain their prior immutable revision");
assert.match(versionsSource, /PATCH_KIT_COMMIT = "6bcda82797ab7ba2929262fc9bb13eac3f9d3749"/, "the patch controller alone pins the two-tier streaming revision");
assert.match(versionsSource, /patchKit: `[^`]*@\$\{PATCH_KIT_COMMIT\}/, "the patch-controller URL uses the isolated revision");

console.log("patch-owned two-tier streaming authority test ok");
