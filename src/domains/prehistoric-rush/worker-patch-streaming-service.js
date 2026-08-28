const DEFAULT_POLICY = Object.freeze({
  patchSize: 96,
  activeRadius: 2,
  retainRadius: 3,
  prefetchDistance: 2,
  prefetchLateralRadius: 1,
  lookaheadSeconds: 1.5,
  generationBudget: 1,
  activationBudget: 1,
  workerCount: 1,
  cacheLimit: 64,
  workerReadyTimeoutMs: 10000
});

function finite(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function integer(value, fallback, minimum = 0) {
  return Math.max(minimum, Math.floor(finite(value, fallback)));
}

function createPolicy(input = {}) {
  return Object.freeze({
    patchSize: Math.max(1, finite(input.patchSize, DEFAULT_POLICY.patchSize)),
    activeRadius: integer(input.activeRadius, DEFAULT_POLICY.activeRadius),
    retainRadius: integer(input.retainRadius, DEFAULT_POLICY.retainRadius),
    prefetchDistance: integer(input.prefetchDistance, DEFAULT_POLICY.prefetchDistance),
    prefetchLateralRadius: integer(input.prefetchLateralRadius, DEFAULT_POLICY.prefetchLateralRadius),
    lookaheadSeconds: Math.max(0, finite(input.lookaheadSeconds, DEFAULT_POLICY.lookaheadSeconds)),
    generationBudget: integer(input.generationBudget, DEFAULT_POLICY.generationBudget),
    activationBudget: integer(input.activationBudget, DEFAULT_POLICY.activationBudget),
    workerCount: integer(input.workerCount, DEFAULT_POLICY.workerCount),
    cacheLimit: integer(input.cacheLimit, DEFAULT_POLICY.cacheLimit, 1),
    workerReadyTimeoutMs: integer(input.workerReadyTimeoutMs, DEFAULT_POLICY.workerReadyTimeoutMs, 1)
  });
}

function patchId(x, z) {
  return `foundation-forest:${x}:${z}`;
}

function flattenGrass(value, target = []) {
  if (!Array.isArray(value)) return target;
  for (const entry of value) {
    if (Array.isArray(entry)) flattenGrass(entry, target);
    else if (entry != null) target.push(entry);
  }
  return target;
}

function normalizePatch(patch, request) {
  const source = patch && typeof patch === "object" ? patch : {};
  return {
    ...source,
    id: request.id,
    x: request.x,
    z: request.z,
    trees: Array.isArray(source.trees) ? source.trees : [],
    grass: flattenGrass(source.grass)
  };
}

function ring(centerX, centerZ, radius, reason, forward) {
  const entries = [];
  for (let dz = -radius; dz <= radius; dz += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const distance = Math.max(Math.abs(dx), Math.abs(dz));
      entries.push({
        id: patchId(centerX + dx, centerZ + dz),
        x: centerX + dx,
        z: centerZ + dz,
        reason,
        distance,
        manhattan: Math.abs(dx) + Math.abs(dz),
        forwardDot: dx * forward.x + dz * forward.z,
        step: 0,
        lateralDistance: 0
      });
    }
  }
  return entries;
}

function primaryAxes(forward) {
  if (Math.abs(forward.x) >= Math.abs(forward.z)) {
    return {
      forward: { x: Math.sign(forward.x) || 1, z: 0 },
      side: { x: 0, z: 1 }
    };
  }
  return {
    forward: { x: 0, z: Math.sign(forward.z) || 1 },
    side: { x: 1, z: 0 }
  };
}

function prefetchPlan(centerX, centerZ, forward, speed, policy) {
  if (policy.prefetchDistance === 0 || speed <= 0) return [];
  const axes = primaryAxes(forward);
  const lookaheadPatches = Math.ceil(speed * policy.lookaheadSeconds / policy.patchSize);
  const rows = Math.min(policy.prefetchDistance, Math.max(1, lookaheadPatches));
  const entries = [];
  for (let step = 1; step <= rows; step += 1) {
    const distance = policy.activeRadius + step;
    for (let lateral = -policy.prefetchLateralRadius; lateral <= policy.prefetchLateralRadius; lateral += 1) {
      const x = centerX + axes.forward.x * distance + axes.side.x * lateral;
      const z = centerZ + axes.forward.z * distance + axes.side.z * lateral;
      entries.push({
        id: patchId(x, z),
        x,
        z,
        reason: "prefetch",
        distance,
        manhattan: distance + Math.abs(lateral),
        forwardDot: distance,
        step,
        lateralDistance: Math.abs(lateral)
      });
    }
  }
  return entries;
}

function comparePriority(left, right) {
  const leftReason = left.reason === "active" ? 0 : 1;
  const rightReason = right.reason === "active" ? 0 : 1;
  return leftReason - rightReason
    || left.distance - right.distance
    || right.forwardDot - left.forwardDot
    || left.lateralDistance - right.lateralDistance
    || left.manhattan - right.manhattan
    || left.z - right.z
    || left.x - right.x;
}

function defaultClock() {
  return globalThis.performance?.now?.() ?? Date.now();
}

export function createWorkerPatchStreamingService(options = {}) {
  const policy = createPolicy(options.policy);
  const onActivate = typeof options.onActivate === "function" ? options.onActivate : () => {};
  const onRelease = typeof options.onRelease === "function" ? options.onRelease : () => {};
  const fallbackGenerator = typeof options.fallbackGenerator === "function" ? options.fallbackGenerator : null;
  const clock = typeof options.clock === "function" ? options.clock : defaultClock;
  const logger = options.logger ?? console;
  const cache = new Map();
  const active = new Map();
  const activationQueue = new Map();
  const inflight = new Map();
  const workers = [];
  let desiredActive = new Map();
  let retained = new Set();
  let prefetched = new Set();
  let pending = [];
  let requestSequence = 0;
  let touchSequence = 0;
  let disposed = false;
  let backend = "initializing";
  let fallbackActive = false;
  let workerReadyTimer = null;
  const timing = {
    generated: 0,
    activated: 0,
    released: 0,
    staleRejected: 0,
    evicted: 0,
    failures: 0,
    generationMs: 0,
    activationMs: 0
  };

  function isWanted(id) {
    return retained.has(id) || prefetched.has(id);
  }

  function release(id, reason = "outside-active-ring") {
    const patch = active.get(id);
    if (!patch) return;
    active.delete(id);
    timing.released += 1;
    onRelease(id, patch, reason);
  }

  function enforceCacheLimit() {
    while (cache.size > policy.cacheLimit) {
      const candidates = [...cache.entries()].sort((left, right) => {
        const leftActive = active.has(left[0]) ? 1 : 0;
        const rightActive = active.has(right[0]) ? 1 : 0;
        return leftActive - rightActive || left[1].touched - right[1].touched || left[0].localeCompare(right[0]);
      });
      const candidate = candidates[0];
      if (!candidate) break;
      if (active.has(candidate[0])) release(candidate[0], "cache-eviction");
      cache.delete(candidate[0]);
      activationQueue.delete(candidate[0]);
      timing.evicted += 1;
    }
  }

  function acceptPatch(request, patch, startedAt) {
    timing.generationMs += Math.max(0, clock() - startedAt);
    timing.generated += 1;
    if (!isWanted(request.id)) {
      timing.staleRejected += 1;
      return;
    }
    const normalized = normalizePatch(patch, request);
    cache.set(request.id, { patch: normalized, touched: ++touchSequence });
    if (desiredActive.has(request.id) && !active.has(request.id)) activationQueue.set(request.id, normalized);
    enforceCacheLimit();
  }

  function takeInflight(requestId) {
    const entry = inflight.get(requestId);
    if (!entry) return null;
    inflight.delete(requestId);
    if (entry.slot) entry.slot.busy = false;
    return entry;
  }

  function beginFallback(reason, error) {
    if (fallbackActive || disposed) return;
    fallbackActive = true;
    if (workerReadyTimer !== null) globalThis.clearTimeout?.(workerReadyTimer);
    workerReadyTimer = null;
    backend = "deferred-main-thread-fallback";
    for (const slot of workers) slot.worker.terminate?.();
    workers.length = 0;
    for (const entry of inflight.values()) {
      if (isWanted(entry.request.id)) pending.push(entry.request);
    }
    inflight.clear();
    if (error) logger?.warn?.(`Patch workers unavailable (${reason}); using bounded fallback generation.`, error);
  }

  function handleWorkerMessage(slot, message = {}) {
    if (disposed) return;
    if (message.type === "patch-worker-ready") {
      slot.ready = true;
      if (!fallbackActive && workers.every((candidate) => candidate.ready)) {
        backend = "worker";
        if (workerReadyTimer !== null) globalThis.clearTimeout?.(workerReadyTimer);
        workerReadyTimer = null;
      }
      return;
    }
    if (message.type === "patch-worker-error") {
      timing.failures += 1;
      beginFallback("initialization failed", new Error(String(message.error ?? "unknown worker error")));
      return;
    }
    if (message.type !== "patch-generated" && message.type !== "patch-error") return;
    const entry = takeInflight(message.requestId);
    if (!entry) return;
    if (message.type === "patch-generated") {
      acceptPatch(entry.request, message.patch, entry.startedAt);
      return;
    }
    timing.failures += 1;
    if (isWanted(entry.request.id)) pending.push(entry.request);
    beginFallback("generation failed", new Error(String(message.error ?? "unknown patch error")));
  }

  function bindWorker(worker, index) {
    const slot = { worker, index, ready: false, busy: false };
    const listener = (event) => handleWorkerMessage(slot, event?.data ?? event);
    const errorListener = (event) => {
      timing.failures += 1;
      beginFallback("runtime error", event?.error ?? new Error(String(event?.message ?? "unknown worker error")));
    };
    if (typeof worker.addEventListener === "function") {
      worker.addEventListener("message", listener);
      worker.addEventListener("error", errorListener);
    } else {
      worker.onmessage = listener;
      worker.onerror = errorListener;
    }
    worker.postMessage({ type: "init-patch-worker", payload: options.generatorOptions ?? {} });
    workers.push(slot);
  }

  function initializeWorkers() {
    if (policy.workerCount === 0) {
      beginFallback("worker pool disabled");
      return;
    }
    const WorkerClass = options.WorkerClass ?? globalThis.Worker;
    if (!options.workerFactory && typeof WorkerClass !== "function") {
      beginFallback("Worker is unavailable");
      return;
    }
    try {
      for (let index = 0; index < policy.workerCount; index += 1) {
        const worker = options.workerFactory
          ? options.workerFactory(options.workerUrl, { type: "module" }, index)
          : new WorkerClass(options.workerUrl, { type: "module" });
        if (!worker || typeof worker.postMessage !== "function") throw new TypeError("Worker factory returned an invalid worker.");
        bindWorker(worker, index);
      }
      workerReadyTimer = globalThis.setTimeout?.(() => {
        if (!fallbackActive && workers.some((slot) => !slot.ready)) beginFallback("initialization timed out");
      }, policy.workerReadyTimeoutMs) ?? null;
    } catch (error) {
      for (const slot of workers) slot.worker.terminate?.();
      workers.length = 0;
      beginFallback("construction failed", error);
    }
  }

  function rebuildPlan(player = {}) {
    const x = finite(player.x ?? player.position?.x, 0);
    const z = finite(player.z ?? player.position?.z, 0);
    const yaw = finite(player.yaw, 0);
    const speed = Math.max(0, finite(player.speed, 0));
    const forward = { x: Math.sin(yaw), z: Math.cos(yaw) };
    const centerX = Math.floor(x / policy.patchSize);
    const centerZ = Math.floor(z / policy.patchSize);
    const activeEntries = ring(centerX, centerZ, policy.activeRadius, "active", forward);
    const retainedEntries = ring(centerX, centerZ, Math.max(policy.activeRadius, policy.retainRadius), "retained", forward);
    const prefetchEntries = prefetchPlan(centerX, centerZ, forward, speed, policy);
    desiredActive = new Map(activeEntries.map((entry) => [entry.id, entry]));
    retained = new Set(retainedEntries.map((entry) => entry.id));
    prefetched = new Set(prefetchEntries.map((entry) => entry.id));

    for (const id of [...active.keys()]) {
      if (!retained.has(id)) release(id);
    }
    for (const id of [...activationQueue.keys()]) {
      if (!desiredActive.has(id)) activationQueue.delete(id);
    }
    for (const [id, entry] of cache) {
      if (desiredActive.has(id) && !active.has(id)) activationQueue.set(id, entry.patch);
    }

    const unique = new Map();
    for (const entry of [...activeEntries, ...prefetchEntries]) unique.set(entry.id, entry);
    pending = [...unique.values()]
      .filter((entry) => !cache.has(entry.id) && ![...inflight.values()].some((item) => item.request.id === entry.id))
      .sort(comparePriority);
  }

  function dispatchWorker(request, slot) {
    const requestId = `forest-${++requestSequence}`;
    slot.busy = true;
    inflight.set(requestId, { request, slot, startedAt: clock() });
    slot.worker.postMessage({
      type: "generate-patch",
      requestId,
      request: {
        patchId: request.id,
        cacheKey: request.id,
        worldSeed: String(options.generatorOptions?.config?.seed ?? "prehistoric-rush"),
        x: request.x,
        z: request.z
      }
    });
  }

  function dispatchFallback(request) {
    const requestId = `fallback-${++requestSequence}`;
    const entry = { request, slot: null, startedAt: clock() };
    inflight.set(requestId, entry);
    Promise.resolve().then(() => fallbackGenerator?.({ patchId: request.id, x: request.x, z: request.z }))
      .then((patch) => {
        if (disposed) return;
        const current = takeInflight(requestId);
        if (current) acceptPatch(request, patch, entry.startedAt);
      })
      .catch((error) => {
        if (disposed) return;
        takeInflight(requestId);
        timing.failures += 1;
        logger?.warn?.(`Fallback patch generation failed for ${request.id}.`, error);
      });
  }

  function generate() {
    let remaining = fallbackActive
      ? Math.max(0, policy.generationBudget - inflight.size)
      : policy.generationBudget;
    while (remaining > 0 && pending.length > 0) {
      const request = pending.shift();
      if (!request || !isWanted(request.id) || cache.has(request.id)) continue;
      if (fallbackActive) {
        if (!fallbackGenerator) break;
        dispatchFallback(request);
      } else {
        const slot = workers.find((candidate) => candidate.ready && !candidate.busy);
        if (!slot) break;
        dispatchWorker(request, slot);
      }
      remaining -= 1;
    }
  }

  function activate() {
    let remaining = policy.activationBudget;
    for (const [id, patch] of [...activationQueue]) {
      if (remaining <= 0) break;
      activationQueue.delete(id);
      if (!desiredActive.has(id) || active.has(id) || !cache.has(id)) continue;
      const startedAt = clock();
      onActivate(patch);
      timing.activationMs += Math.max(0, clock() - startedAt);
      timing.activated += 1;
      active.set(id, patch);
      cache.get(id).touched = ++touchSequence;
      const obsoleteId = [...active.keys()].find((activeId) => !desiredActive.has(activeId));
      if (obsoleteId && active.size > desiredActive.size) release(obsoleteId, "replaced-outside-active-ring");
      remaining -= 1;
    }
  }

  function update(player = {}) {
    if (disposed) return getSnapshot();
    rebuildPlan(player);
    generate();
    activate();
    enforceCacheLimit();
    return getSnapshot();
  }

  function getSnapshot() {
    return Object.freeze({
      backend,
      disposed,
      policy,
      desiredActivePatchIds: Object.freeze([...desiredActive.keys()]),
      retainedPatchIds: Object.freeze([...retained]),
      prefetchPatchIds: Object.freeze([...prefetched]),
      activePatchIds: Object.freeze([...active.keys()]),
      cachedPatchIds: Object.freeze([...cache.keys()]),
      pendingPatchIds: Object.freeze(pending.map((entry) => entry.id)),
      inflightPatchIds: Object.freeze([...inflight.values()].map((entry) => entry.request.id)),
      readyActivationPatchIds: Object.freeze([...activationQueue.keys()]),
      workerCount: workers.length,
      timing: Object.freeze({ ...timing })
    });
  }

  function dispose() {
    if (disposed) return;
    for (const id of [...active.keys()]) release(id, "dispose");
    disposed = true;
    if (workerReadyTimer !== null) globalThis.clearTimeout?.(workerReadyTimer);
    workerReadyTimer = null;
    for (const slot of workers) slot.worker.terminate?.();
    workers.length = 0;
    inflight.clear();
    pending = [];
    activationQueue.clear();
    cache.clear();
    desiredActive.clear();
    retained.clear();
    prefetched.clear();
    backend = "disposed";
  }

  initializeWorkers();
  return Object.freeze({ update, snapshot: getSnapshot, getSnapshot, dispose });
}

export default createWorkerPatchStreamingService;
