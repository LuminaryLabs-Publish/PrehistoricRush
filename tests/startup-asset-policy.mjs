import assert from "node:assert/strict";
import {
  PREHISTORIC_RUSH_OPTIONAL_REQUEST_CONCURRENCY,
  PREHISTORIC_RUSH_REQUIRED_GROUP_COUNT,
  installPrehistoricRushStartupAssets
} from "../src/domains/prehistoric-rush/startup-asset-policy.js";

function createFakeCoreAssets({ loadOverride = null } = {}) {
  const assets = new Map();
  const bundles = new Map();
  const values = new Map();
  const statuses = new Map();
  let provider = null;
  let cacheProvider = null;
  return {
    registerProvider(next) { provider = next; },
    registerAsset(asset) { assets.set(asset.id, asset); statuses.set(asset.id, "unrequested"); },
    registerBundle(bundle) { bundles.set(bundle.id, bundle); },
    setCacheProvider(next) { cacheProvider = next; },
    async request(id, options = {}) {
      const asset = assets.get(id);
      if (!asset) throw new RangeError(id);
      if (statuses.get(id) === "ready") return { targetId: id, cached: false };
      statuses.set(id, "loading");
      try {
        const context = {
          signal: null,
          updateProgress(completed, total, detail) { options.onProgress?.(completed / total, detail); }
        };
        const raw = loadOverride
          ? await loadOverride(asset, context, provider)
          : await provider.load(asset, context);
        values.set(id, raw.runtimeValue ?? raw.portable ?? raw);
        statuses.set(id, "ready");
        return { targetId: id, cached: false };
      } catch (error) {
        statuses.set(id, "failed");
        throw error;
      }
    },
    async requestBundle(id, options = {}) {
      const bundle = bundles.get(id);
      let completed = 0;
      for (const assetId of bundle.assets) {
        await this.request(assetId);
        completed += 1;
        options.onProgress?.(completed / bundle.assets.length, assetId);
      }
      return { targetId: id, members: [...bundle.assets] };
    },
    getValue(id) { return values.get(id) ?? null; },
    getStatus(id) { return statuses.get(id) ?? "unrequested"; },
    inspect() { return { assets, bundles, statuses, cacheProvider }; }
  };
}

const coreAssets = createFakeCoreAssets();
const session = installPrehistoricRushStartupAssets({ n: { asset: coreAssets } }, {
  racerId: "velociraptor",
  worldId: "jurassic-valley"
});
const platformFetch = globalThis.fetch;
globalThis.fetch = async (url) => {
  if (String(url).includes("/assets/models/racers/")) return { ok: true, arrayBuffer: async () => new ArrayBuffer(16) };
  throw new Error(`Unexpected startup fetch: ${url}`);
};
assert.equal(PREHISTORIC_RUSH_REQUIRED_GROUP_COUNT, 4);
const prepared = await session.preparePlayable();
globalThis.fetch = platformFetch;
assert.equal(prepared.groupCount, 4);
assert.equal(session.requiredAssetIds.length, 4);
assert.ok(session.getSnapshot().required.every((entry) => entry.status === "ready"));
assert.ok(session.getRacerModelBuffer() instanceof ArrayBuffer, "the selected racer GLB is the first required presentation group");
assert.equal(session.getSnapshot().optional.readyCount, 0, "no detailed species package blocks playable preparation");
assert.equal(session.speciesAssetIds.length, 12);
assert.ok(session.speciesAssetIds.every((id) => coreAssets.inspect().statuses.get(id) === "unrequested"));
assert.equal(session.getSnapshot().persistentCache, "unavailable", "missing IndexedDB degrades to in-memory Core Assets without blocking play");

const originalFetch = globalThis.fetch;
globalThis.fetch = async () => ({ ok: false, status: 503 });
const optional = await session.requestSpecies(["giant-fern-tree"]);
globalThis.fetch = originalFetch;
assert.deepEqual(optional, [], "optional package failure resolves to proxy fallback instead of blocking gameplay");
assert.equal(session.getSnapshot().optional.failures["giant-fern-tree"].includes("503"), true);

const originalIndexedDb = globalThis.indexedDB;
globalThis.indexedDB = {};
const cachedCoreAssets = createFakeCoreAssets();
const cacheAdapter = { id: "indexeddb-test" };
const cachedSession = installPrehistoricRushStartupAssets({ n: { asset: cachedCoreAssets } }, {
  racerId: "velociraptor",
  worldId: "jurassic-valley",
  Nexus: { createBrowserIndexedDbAssetCacheAdapter: () => cacheAdapter }
});
if (originalIndexedDb === undefined) delete globalThis.indexedDB;
else globalThis.indexedDB = originalIndexedDb;
assert.equal(cachedSession.getSnapshot().persistentCache, "indexeddb");
assert.strictEqual(cachedCoreAssets.inspect().cacheProvider, cacheAdapter, "available Nexus IndexedDB support remains owned by the shared Core Assets session");

const controlledResolvers = [];
const controlledStarts = [];
let controlledActive = 0;
let controlledPeak = 0;
const controlledCoreAssets = createFakeCoreAssets({
  async loadOverride(asset, context, provider) {
    if (asset.type !== "tree-fidelity-package") return provider.load(asset, context);
    const speciesId = asset.metadata.speciesId;
    controlledStarts.push(speciesId);
    controlledActive += 1;
    controlledPeak = Math.max(controlledPeak, controlledActive);
    await new Promise((resolve) => controlledResolvers.push(resolve));
    controlledActive -= 1;
    return { runtimeValue: { archetypeId: speciesId } };
  }
});
const controlledSession = installPrehistoricRushStartupAssets({ n: { asset: controlledCoreAssets } });
const allSpeciesRequest = controlledSession.requestAllSpecies();
await new Promise((resolve) => setImmediate(resolve));
assert.equal(PREHISTORIC_RUSH_OPTIONAL_REQUEST_CONCURRENCY, 2);
assert.equal(controlledStarts.length, 2, "idle completion starts only the bounded number of optional fetch/decode operations");
assert.equal(controlledPeak, 2);

const prioritySpecies = "short-jungle-palm";
const visibleRequest = controlledSession.requestSpecies([prioritySpecies], { priority: "visible" });
controlledResolvers.shift()();
await new Promise((resolve) => setImmediate(resolve));
assert.equal(controlledStarts[2], prioritySpecies, "a queued visible-cell package moves ahead of idle completion");

for (let released = 1; released < controlledSession.speciesAssetIds.length; released += 1) {
  while (controlledResolvers.length === 0) await new Promise((resolve) => setImmediate(resolve));
  controlledResolvers.shift()();
  await new Promise((resolve) => setImmediate(resolve));
}
const [allPackages, visiblePackages] = await Promise.all([allSpeciesRequest, visibleRequest]);
assert.equal(allPackages.length, 12);
assert.equal(visiblePackages.length, 1);
assert.equal(controlledPeak, 2, "Core Assets optional request concurrency never exceeds its policy limit");
assert.equal(controlledSession.getSnapshot().optional.requests.peak, 2);

console.log("four-group Core Assets startup policy passed");
