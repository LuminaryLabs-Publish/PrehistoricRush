import assert from "node:assert/strict";
import { createWorkerPatchStreamingService } from "../src/domains/prehistoric-rush/worker-patch-streaming-service.js";

class FakeWorker {
  static instances = [];

  constructor() {
    this.messages = [];
    this.listener = null;
    this.terminated = false;
    FakeWorker.instances.push(this);
  }

  addEventListener(type, listener) {
    if (type === "message") this.listener = listener;
  }

  postMessage(message) {
    this.messages.push(message);
  }

  emit(data) {
    this.listener?.({ data });
  }

  ready() {
    this.emit({ type: "patch-worker-ready" });
  }

  generationMessages() {
    return this.messages.filter((message) => message.type === "generate-patch");
  }

  complete(index = 0, patch = {}) {
    const message = this.generationMessages()[index];
    this.emit({
      type: "patch-generated",
      requestId: message.requestId,
      patch: { id: "worker-id-is-normalized", trees: [], grass: [[{ blade: 1 }], [{ blade: 2 }]], ...patch }
    });
  }

  terminate() {
    this.terminated = true;
  }
}

function createWorkerService(overrides = {}) {
  FakeWorker.instances = [];
  const activated = [];
  const released = [];
  const service = createWorkerPatchStreamingService({
    workerUrl: new URL("../src/workers/prehistoric-patch-worker.js", import.meta.url),
    WorkerClass: FakeWorker,
    generatorOptions: { seed: 7 },
    policy: {
      patchSize: 10,
      activeRadius: 1,
      retainRadius: 1,
      prefetchDistance: 2,
      lookaheadSeconds: 1,
      generationBudget: 2,
      activationBudget: 1,
      workerCount: 2,
      cacheLimit: 20,
      ...overrides.policy
    },
    onActivate: (patch) => activated.push(patch),
    onRelease: (id, patch, reason) => released.push({ id, patch, reason }),
    logger: { warn() {} },
    ...overrides.options
  });
  for (const worker of FakeWorker.instances) worker.ready();
  return { service, workers: FakeWorker.instances, activated, released };
}

function generatedRequests(workers) {
  return workers.flatMap((worker) => worker.generationMessages()).map((message) => message.request);
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
}

{
  const { service, workers } = createWorkerService();
  service.update({ x: 0, z: 0, yaw: 0, speed: 20 });
  const first = generatedRequests(workers);
  assert.equal(first.length, 2, "generation is bounded by generationBudget");
  assert.equal(first[0].patchId, "foundation-forest:0:0", "the current patch has first priority");
  assert.equal(first[1].patchId, "foundation-forest:0:1", "the forward active patch wins equal-distance priority");
  workers.find((worker) => worker.generationMessages().length > 0).complete();
  service.update({ x: 0, z: 0, yaw: 0, speed: 20 });
  const snapshot = service.snapshot();
  assert.equal(snapshot.prefetchPatchIds[0], "foundation-forest:-1:2");
  service.dispose();
}

{
  const { service, workers, activated } = createWorkerService({ policy: { generationBudget: 2, activationBudget: 1 } });
  service.update({ speed: 0 });
  const messages = workers.flatMap((worker) => worker.generationMessages());
  for (const worker of workers) {
    if (worker.generationMessages()[0]) worker.complete(0);
  }
  service.update({ speed: 0 });
  assert.equal(activated.length, 1, "activation is bounded by activationBudget");
  assert.equal(service.snapshot().readyActivationPatchIds.length, 1, "remaining activation waits for another update");
  assert.equal(messages.length, 2);
  service.dispose();
}

{
  const { service, workers, activated } = createWorkerService({
    policy: { activeRadius: 0, retainRadius: 0, generationBudget: 1, workerCount: 1 }
  });
  service.update({ x: 0, z: 0, speed: 0 });
  service.update({ x: 100, z: 0, speed: 0 });
  workers[0].complete(0);
  service.update({ x: 100, z: 0, speed: 0 });
  assert.equal(activated.length, 0, "stale worker results are never activated");
  assert.equal(service.snapshot().timing.staleRejected, 1);
  service.dispose();
}

{
  const { service, workers, released } = createWorkerService({
    policy: { activeRadius: 0, retainRadius: 1, generationBudget: 1, activationBudget: 1, workerCount: 1 }
  });
  service.update({ x: 0, z: 0, speed: 0 });
  workers[0].complete(0);
  service.update({ x: 0, z: 0, speed: 0 });
  service.update({ x: 20, z: 0, speed: 0 });
  assert.equal(released.length, 1, "leaving the active ring invokes release");
  assert.equal(released[0].id, "foundation-forest:0:0");
  service.dispose();
}

{
  const { service, workers } = createWorkerService({
    policy: { activeRadius: 0, retainRadius: 0, prefetchDistance: 2, prefetchLateralRadius: 0, generationBudget: 1, workerCount: 1, cacheLimit: 2 }
  });
  service.update({ speed: 30, yaw: 0 });
  workers[0].complete(0);
  service.update({ speed: 30, yaw: 0 });
  assert.equal(workers[0].generationMessages()[1].request.patchId, "foundation-forest:0:1", "prefetch generation prioritizes the forward lane");
  workers[0].complete(1);
  service.update({ speed: 30, yaw: 0 });
  assert.equal(workers[0].generationMessages()[2].request.patchId, "foundation-forest:0:2", "lookahead continues forward before unrelated work");
  workers[0].complete(2);
  service.update({ speed: 30, yaw: 0 });
  assert.equal(service.snapshot().cachedPatchIds.length, 2, "cache never exceeds cacheLimit");
  assert.ok(service.snapshot().timing.evicted >= 1, "oldest non-active cache entries are evicted");
  service.dispose();
}

{
  const generated = [];
  const activated = [];
  const service = createWorkerPatchStreamingService({
    workerUrl: "unused",
    WorkerClass: undefined,
    fallbackGenerator(request) {
      generated.push(request.patchId);
      return { trees: [{ kind: "tree-family" }], grass: [[{ id: "a" }], [[{ id: "b" }]]] };
    },
    policy: {
      patchSize: 10,
      activeRadius: 1,
      retainRadius: 1,
      prefetchDistance: 0,
      generationBudget: 2,
      activationBudget: 1,
      workerCount: 1,
      cacheLimit: 12
    },
    onActivate: (patch) => activated.push(patch),
    logger: { warn() {} }
  });
  service.update({ speed: 0 });
  assert.equal(generated.length, 0, "fallback generation is deferred out of update");
  await flush();
  assert.equal(generated.length, 2, "fallback generation obeys generationBudget");
  service.update({ speed: 0 });
  assert.equal(activated.length, 1, "fallback results obey activationBudget");
  assert.equal(activated[0].id, "foundation-forest:0:0");
  assert.equal(activated[0].grass.length, 2, "nested grass layers are flattened");
  assert.equal(service.snapshot().backend, "deferred-main-thread-fallback");
  service.dispose();
}

console.log("PrehistoricRush worker patch streaming service passed.");
