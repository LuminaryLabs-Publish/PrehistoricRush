import {
  PREHISTORIC_TREE_ARCHETYPES,
  TREE_FIDELITY_PACKAGE_VERSION
} from "../../shared/tree-fidelity-assets.js";

export const PREHISTORIC_RUSH_ASSET_PROVIDER_ID = "prehistoric-rush-runtime-assets";
export const PREHISTORIC_RUSH_PLAYABLE_BUNDLE_ID = "prehistoric-rush-playable";
export const PREHISTORIC_RUSH_LOCAL_FIDELITY_BUNDLE_ID = "jurassic-valley-local";
export const PREHISTORIC_RUSH_GENERIC_TREE_PROXY_ID = "prehistoric-rush:proxy:tree";
export const PREHISTORIC_RUSH_GROUND_COVER_PROXY_ID = "prehistoric-rush:proxy:ground-cover";
export const PREHISTORIC_RUSH_TERRAIN_ROUTE_ID = "prehistoric-rush:presentation:terrain-route";
export const PREHISTORIC_RUSH_REQUIRED_GROUP_COUNT = 4;
export const PREHISTORIC_RUSH_OPTIONAL_REQUEST_CONCURRENCY = 2;

const TREE_ROOT = new URL("../../../assets/tree-fidelity/", import.meta.url);
const packageIdFor = (speciesId) => `prehistoric-rush:tree-fidelity:${speciesId}`;
const racerAssetIdFor = (racerId) => `prehistoric-rush:presentation:racer:${racerId}`;

function clonePortablePackage(packageValue) {
  const portable = structuredClone(packageValue);
  for (const formId of ["far", "horizon"]) {
    const atlas = portable?.forms?.[formId]?.atlas;
    if (atlas) delete atlas.runtimeImage;
  }
  return portable;
}

async function decodeAtlas(url) {
  if (typeof globalThis.Image !== "function") throw new Error("Tree atlas decoding requires the browser Image API.");
  const image = new globalThis.Image();
  image.decoding = "async";
  image.src = url.href;
  await image.decode();
  return image;
}

async function hydratePackage(packageValue, speciesId) {
  const value = structuredClone(packageValue);
  const atlasUrl = new URL(`${speciesId}.png`, TREE_ROOT);
  const image = await decodeAtlas(atlasUrl);
  if (value.forms?.far?.atlas) value.forms.far.atlas.runtimeImage = image;
  if (value.forms?.horizon?.atlas) value.forms.horizon.atlas.runtimeImage = image;
  return value;
}

function createRuntimeAssetProvider() {
  return Object.freeze({
    id: PREHISTORIC_RUSH_ASSET_PROVIDER_ID,
    version: "1.0.0",
    metadata: Object.freeze({
      owner: "n:asset",
      purpose: "Load Prehistoric Rush startup groups and optional prebuilt tree fidelity without renderer-owned queues."
    }),
    async load(asset, context) {
      if (asset.type !== "tree-fidelity-package") {
        context.updateProgress?.(1, 1, `Ready ${asset.id}`);
        return {
          portable: Object.freeze({ schema: "prehistoric-rush.logical-runtime-asset/1", id: asset.id, metadata: asset.metadata }),
          metadata: { logicalGroup: true, requiredBeforePlay: Boolean(asset.metadata?.requiredBeforePlay) }
        };
      }
      const speciesId = String(asset.metadata?.speciesId ?? "");
      if (!speciesId) throw new TypeError(`Tree fidelity asset ${asset.id} is missing speciesId.`);
      context.updateProgress?.(0.08, 1, `Loading ${speciesId} fidelity`);
      const response = await fetch(new URL(`${speciesId}.json`, TREE_ROOT), { cache: "force-cache", signal: context.signal ?? undefined });
      if (!response.ok) throw new Error(`Tree fidelity package ${speciesId} failed: ${response.status}`);
      const portable = await response.json();
      if (portable.archetypeId !== speciesId) throw new Error(`Tree fidelity package identity mismatch for ${speciesId}.`);
      context.updateProgress?.(0.65, 1, `Decoding ${speciesId} atlas`);
      const runtimeValue = await hydratePackage(portable, speciesId);
      context.updateProgress?.(1, 1, `${speciesId} fidelity ready`);
      return {
        runtimeValue,
        portable: clonePortablePackage(portable),
        metadata: {
          speciesId,
          optional: true,
          packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
          growthDigest: portable.growth?.digest ?? null,
          contentDigest: portable.generation?.id ?? portable.growth?.digest ?? null
        }
      };
    },
    async restore(portable, context) {
      const speciesId = String(context?.asset?.metadata?.speciesId ?? portable?.archetypeId ?? "");
      return hydratePackage(portable, speciesId);
    }
  });
}

export function installPrehistoricRushStartupAssets(engine, options = {}) {
  const assets = engine?.n?.asset;
  if (!assets) throw new TypeError("Prehistoric Rush startup assets require Nexus Core Assets at n:asset.");
  const racerId = String(options.racerId ?? "velociraptor");
  const worldId = String(options.worldId ?? "jurassic-valley");
  const racerAssetId = racerAssetIdFor(racerId);
  let persistentCache = "unavailable";
  if (globalThis.indexedDB && typeof options.Nexus?.createBrowserIndexedDbAssetCacheAdapter === "function" && typeof assets.setCacheProvider === "function") {
    try {
      assets.setCacheProvider(options.Nexus.createBrowserIndexedDbAssetCacheAdapter({
        databaseName: "prehistoric-rush-assets",
        storeName: "progressive-runtime-assets",
        version: Number(TREE_FIDELITY_PACKAGE_VERSION)
      }));
      persistentCache = "indexeddb";
    } catch {
      persistentCache = "unavailable";
    }
  }
  assets.registerProvider(createRuntimeAssetProvider());

  const requiredAssets = [
    {
      id: racerAssetId,
      type: "racer-presentation-reference",
      metadata: { group: "selected-racer-presentation", racerId, requiredBeforePlay: true }
    },
    {
      id: PREHISTORIC_RUSH_TERRAIN_ROUTE_ID,
      type: "terrain-route-presentation-reference",
      metadata: { group: "terrain-and-route-presentation", worldId, requiredBeforePlay: true }
    },
    {
      id: PREHISTORIC_RUSH_GENERIC_TREE_PROXY_ID,
      type: "generic-tree-proxy",
      metadata: { group: "generic-tree-proxy", requiredBeforePlay: true }
    },
    {
      id: PREHISTORIC_RUSH_GROUND_COVER_PROXY_ID,
      type: "ground-cover-proxy",
      metadata: { group: "grass-and-ground-cover-proxy", requiredBeforePlay: true }
    }
  ];
  for (const descriptor of requiredAssets) assets.registerAsset({
    ...descriptor,
    version: "1",
    providerId: PREHISTORIC_RUSH_ASSET_PROVIDER_ID,
    cache: { enabled: false },
    fallback: { kind: "logical-reference" }
  });

  const speciesAssetIds = [];
  for (const archetype of PREHISTORIC_TREE_ARCHETYPES) {
    const id = packageIdFor(archetype.id);
    speciesAssetIds.push(id);
    assets.registerAsset({
      id,
      type: "tree-fidelity-package",
      version: TREE_FIDELITY_PACKAGE_VERSION,
      providerId: PREHISTORIC_RUSH_ASSET_PROVIDER_ID,
      cache: { enabled: true, namespace: "prehistoric-rush-tree-fidelity" },
      fallback: { assetId: PREHISTORIC_RUSH_GENERIC_TREE_PROXY_ID, fidelity: "proxy" },
      metadata: {
        group: "optional-species-fidelity",
        speciesId: archetype.id,
        optional: true,
        requiredBeforePlay: false,
        packageVersion: TREE_FIDELITY_PACKAGE_VERSION
      }
    });
  }

  assets.registerBundle({
    id: PREHISTORIC_RUSH_PLAYABLE_BUNDLE_ID,
    version: "1",
    assets: requiredAssets.map((entry) => entry.id),
    metadata: { requiredBeforePlay: true, logicalGroupCount: PREHISTORIC_RUSH_REQUIRED_GROUP_COUNT }
  });
  assets.registerBundle({
    id: PREHISTORIC_RUSH_LOCAL_FIDELITY_BUNDLE_ID,
    version: TREE_FIDELITY_PACKAGE_VERSION,
    assets: speciesAssetIds,
    metadata: { requiredBeforePlay: false, optional: true, worldDrivenFirst: true }
  });

  const failures = new Map();
  const optionalRequestQueue = [];
  const scheduledOptionalRequests = new Map();
  let activeOptionalRequests = 0;
  let peakOptionalRequests = 0;
  let optionalRequestSequence = 0;

  function optionalPriorityRank(priority) {
    if (priority === "visible" || priority === "required" || priority === "high") return 0;
    if (priority === "background" || priority === "local") return 1;
    return 2;
  }

  function pumpOptionalRequests() {
    optionalRequestQueue.sort((left, right) => left.rank - right.rank || left.sequence - right.sequence);
    while (activeOptionalRequests < PREHISTORIC_RUSH_OPTIONAL_REQUEST_CONCURRENCY && optionalRequestQueue.length > 0) {
      const entry = optionalRequestQueue.shift();
      entry.started = true;
      activeOptionalRequests += 1;
      peakOptionalRequests = Math.max(peakOptionalRequests, activeOptionalRequests);
      assets.request(entry.assetId, {
        priority: entry.priority,
        onProgress(...progress) {
          for (const callback of entry.progressCallbacks) callback(...progress);
        }
      }).then(() => {
        failures.delete(entry.speciesId);
        entry.resolve(Object.freeze({ speciesId: entry.speciesId, value: assets.getValue(entry.assetId), error: null }));
      }).catch((error) => {
        const normalizedError = error instanceof Error ? error : new Error(String(error));
        failures.set(entry.speciesId, normalizedError.message);
        entry.resolve(Object.freeze({ speciesId: entry.speciesId, value: null, error: normalizedError }));
      }).finally(() => {
        activeOptionalRequests -= 1;
        scheduledOptionalRequests.delete(entry.speciesId);
        pumpOptionalRequests();
      });
    }
  }

  function scheduleOptionalRequest(speciesId, requestOptions) {
    const priority = requestOptions.priority ?? "background";
    const rank = optionalPriorityRank(priority);
    const existing = scheduledOptionalRequests.get(speciesId);
    if (existing) {
      if (!existing.started && rank < existing.rank) {
        existing.rank = rank;
        existing.priority = priority;
      }
      if (typeof requestOptions.onProgress === "function") existing.progressCallbacks.add(requestOptions.onProgress);
      pumpOptionalRequests();
      return existing.promise;
    }
    const entry = {
      speciesId,
      assetId: packageIdFor(speciesId),
      priority,
      rank,
      sequence: optionalRequestSequence++,
      started: false,
      progressCallbacks: new Set(typeof requestOptions.onProgress === "function" ? [requestOptions.onProgress] : [])
    };
    entry.promise = new Promise((resolve) => { entry.resolve = resolve; });
    scheduledOptionalRequests.set(speciesId, entry);
    optionalRequestQueue.push(entry);
    pumpOptionalRequests();
    return entry.promise;
  }

  async function requestSpecies(speciesIds = [], requestOptions = {}) {
    const ids = Array.from(new Set(speciesIds.map(String))).filter((id) => speciesAssetIds.includes(packageIdFor(id)));
    const settled = await Promise.all(ids.map((speciesId) => scheduleOptionalRequest(speciesId, requestOptions)));
    for (const entry of settled) if (entry.error) requestOptions.onFailure?.(entry.speciesId, entry.error);
    return settled.map((entry) => entry.value).filter(Boolean);
  }

  return Object.freeze({
    assets,
    racerAssetId,
    requiredAssetIds: Object.freeze(requiredAssets.map((entry) => entry.id)),
    speciesAssetIds: Object.freeze(speciesAssetIds),
    async preparePlayable(onProgress = () => {}) {
      const receipt = await assets.requestBundle(PREHISTORIC_RUSH_PLAYABLE_BUNDLE_ID, {
        priority: "required",
        onProgress
      });
      return Object.freeze({ receipt, groupCount: PREHISTORIC_RUSH_REQUIRED_GROUP_COUNT });
    },
    requestSpecies,
    requestAllSpecies(options = {}) {
      return requestSpecies(PREHISTORIC_TREE_ARCHETYPES.map((entry) => entry.id), { ...options, priority: options.priority ?? "idle" });
    },
    getPackage(speciesId) { return assets.getValue(packageIdFor(speciesId)); },
    getSnapshot() {
      const readySpeciesIds = PREHISTORIC_TREE_ARCHETYPES
        .map((entry) => entry.id)
        .filter((speciesId) => assets.getStatus(packageIdFor(speciesId)) === "ready");
      return Object.freeze({
        owner: "n:asset",
        persistentCache,
        playableBundleId: PREHISTORIC_RUSH_PLAYABLE_BUNDLE_ID,
        requiredGroupCount: PREHISTORIC_RUSH_REQUIRED_GROUP_COUNT,
        required: Object.freeze(requiredAssets.map((entry) => Object.freeze({ id: entry.id, status: assets.getStatus(entry.id) }))),
        optional: Object.freeze({
          readySpeciesIds,
          readyCount: readySpeciesIds.length,
          totalCount: speciesAssetIds.length,
          failures: Object.freeze(Object.fromEntries(failures)),
          requests: Object.freeze({
            concurrencyLimit: PREHISTORIC_RUSH_OPTIONAL_REQUEST_CONCURRENCY,
            active: activeOptionalRequests,
            queued: optionalRequestQueue.length,
            peak: peakOptionalRequests
          })
        })
      });
    }
  });
}

export function speciesIdsForPatch(patch) {
  const result = [];
  for (let index = 0; index < PREHISTORIC_TREE_ARCHETYPES.length; index += 1) {
    const treeSet = patch?.trees?.[index];
    if ((treeSet?.trunks?.length ?? 0) > 0 || (treeSet?.crowns?.length ?? 0) > 0) result.push(PREHISTORIC_TREE_ARCHETYPES[index].id);
  }
  return Object.freeze(result);
}

export default installPrehistoricRushStartupAssets;
