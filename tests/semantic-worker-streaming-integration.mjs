import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const gamePage = await readFile(new URL("../game.html", import.meta.url), "utf8");
const pageLoader = await readFile(new URL("../src/pages/game.js", import.meta.url), "utf8");
const sharedGpuRuntime = await readFile(new URL("../src/game-runtime-shared-gpu-v3.js", import.meta.url), "utf8");
const semanticRuntime = await readFile(new URL("../src/game-runtime-semantic-v2.js", import.meta.url), "utf8");
const renderer = await readFile(new URL("../src/domains/prehistoric-rush/rendering-implementation.js", import.meta.url), "utf8");
const workerService = await readFile(new URL("../src/domains/prehistoric-rush/worker-patch-streaming-service.js", import.meta.url), "utf8");
const patchWorker = await readFile(new URL("../src/workers/prehistoric-patch-worker.js", import.meta.url), "utf8");

assert.match(gamePage, /src="\.\/src\/pages\/game\.js/, "game.html uses the canonical page loader");
assert.match(pageLoader, /game-runtime-shared-gpu-v3\.js/, "the page loader enters the shared-GPU semantic runtime");
assert.match(sharedGpuRuntime, /game-runtime-semantic-v2\.js/, "the shared-GPU layer composes the semantic runtime");
assert.match(semanticRuntime, /createPrehistoricRushRenderingImplementation/, "the semantic runtime owns renderer composition");
assert.match(renderer, /createWorkerPatchStreamingService/, "the semantic renderer creates the worker streaming service");
assert.match(renderer, /workerStreaming\?\.update\(state\)/, "the frame loop pumps bounded streaming");
assert.match(renderer, /onActivate\(patch\)/, "completed worker patches enter presentation through one activation boundary");
assert.match(renderer, /onRelease\(id\)/, "released patches leave presentation through one release boundary");
assert.doesNotMatch(renderer, /function createForestPatch|function ensureForest/, "main-thread forest generation is removed");
assert.match(workerService, /staleRejected/, "the worker service rejects stale results");
assert.match(workerService, /activationBudget/, "the worker service bounds main-thread activation");
assert.match(workerService, /deferred-main-thread-fallback/, "the worker service has a bounded fallback");
assert.match(patchWorker, /collectPatchTransferables\(patch\)/, "worker results transfer terrain buffers without copying");

console.log("PrehistoricRush semantic worker streaming integration passed.");
