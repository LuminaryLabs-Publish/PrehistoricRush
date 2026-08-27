import { RUNTIME_URLS } from "../shared/runtime-versions.js";
import {
  createPrehistoricVegetationGeneratorOptions,
  createPrehistoricVegetationRuntime
} from "../shared/prehistoric-vegetation-domain.js";
import {
  createPrehistoricPatchComputeProvider,
  createPrehistoricPatchComputeRequest
} from "../shared/prehistoric-compute-streaming.js";
import { collectPatchTransferables } from "../world/prehistoric-patch-generator.js";
import { createPrehistoricWorldPatchGenerator } from "../world/prehistoric-world-patch-generator.js";

let computeHost = null;
let initialization = null;

async function initialize(payload = {}) {
  const [NexusEngine, NexusObject, NexusCompute] = await Promise.all([
    import(RUNTIME_URLS.nexus),
    import(RUNTIME_URLS.nexusObject),
    import(RUNTIME_URLS.nexusCompute)
  ]);
  if (typeof NexusCompute.createComputeHost !== "function") {
    throw new Error("Nexus Compute Host is unavailable from NexusEngine/main.");
  }
  const vegetationRuntime = createPrehistoricVegetationRuntime(NexusEngine, { objectDomain: NexusObject });
  const generatePatch = createPrehistoricWorldPatchGenerator({
    ...payload,
    ...createPrehistoricVegetationGeneratorOptions(vegetationRuntime)
  });
  const patchProvider = createPrehistoricPatchComputeProvider(generatePatch);
  const providers = [patchProvider];
  if (typeof NexusCompute.createWebGPUComputeProvider === "function" && globalThis.navigator?.gpu) {
    providers.unshift(NexusCompute.createWebGPUComputeProvider({ id: "prehistoric-rush-webgpu" }));
  }
  computeHost = NexusCompute.createComputeHost({ id: "prehistoric-rush-patch-compute-host", providers });
  return { vegetationRuntime, NexusCompute };
}

self.addEventListener("message", async (event) => {
  const message = event.data ?? {};
  if (message.type === "init-patch-worker") {
    try {
      initialization = initialize(message.payload ?? {});
      const { vegetationRuntime } = await initialization;
      self.postMessage({
        type: "patch-worker-ready",
        vegetationDomain: "n:object:vegetation",
        computeHost: "n:compute:host",
        computeProviders: computeHost.listProviders(),
        selectedBackend: "javascript-worker",
        treeSpeciesCount: vegetationRuntime.catalog.species.length,
        groundCoverSpeciesCount: vegetationRuntime.catalog.groundCoverSpecies.length,
        foliageAtlasRevision: vegetationRuntime.catalog.foliageAtlasRevision
      });
    } catch (error) {
      self.postMessage({ type: "patch-worker-error", error: String(error?.message ?? error) });
    }
    return;
  }
  if (message.type !== "generate-patch") return;
  try {
    if (initialization) await initialization;
    if (!computeHost) throw new Error("Patch Compute Host has not been initialized.");
    const execution = createPrehistoricPatchComputeRequest(message.request);
    const result = await computeHost.executeGraph(execution, {
      requiredFamily: "cpu",
      requiredBackend: "javascript-worker",
      requiredFeatures: ["world-patch"],
      allowFallback: false
    });
    const patch = result.outputs?.patch;
    if (!patch) throw new Error("Patch Compute Host completed without a patch output.");
    self.postMessage({
      type: "patch-generated",
      requestId: message.requestId,
      patch,
      compute: {
        graphId: result.graphId,
        providerId: result.providerId,
        backend: result.metadata?.backend ?? "javascript-worker"
      }
    }, collectPatchTransferables(patch));
  } catch (error) {
    self.postMessage({
      type: "patch-error",
      requestId: message.requestId,
      error: String(error?.message ?? error)
    });
  }
});
