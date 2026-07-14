import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const runtimeSource = await readFile(new URL("../src/game-runtime.js", import.meta.url), "utf8");
const adapterSource = await readFile(new URL("../src/render/three-patch-stream-adapter.js", import.meta.url), "utf8");
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
assert.match(runtimeSource, /adapter\.refreshDynamicContent\(state, collectedPickupIds\)/, "the runtime updates only collected pickup cells");
assert.match(runtimeSource, /adapter\.releasePatches\(controller\.takeReleasedPatchIds\(\)\)/, "stream release delegates patch identities only");
assert.match(versionsSource, /KITS_COMMIT = "9fd5b10053135e278c84b8b1591aece5cc641da1"/, "the game pins the stable-range kit revision");

console.log("patch-owned streaming authority test ok");
