import { RUNTIME_URLS } from "../shared/runtime-versions.js";
import { createPrehistoricVegetationRuntime } from "../shared/prehistoric-vegetation-domain.js";
import {
  collectPatchTransferables,
  createPrehistoricPatchGenerator
} from "../world/prehistoric-patch-generator.js";

let generatePatch = null;
let initialization = null;

async function initialize(payload = {}) {
  const NexusEngine = await import(RUNTIME_URLS.nexus);
  const vegetationRuntime = createPrehistoricVegetationRuntime(NexusEngine);
  generatePatch = createPrehistoricPatchGenerator({
    ...payload,
    treeTypes: vegetationRuntime.catalog.treeTypes,
    vegetation: vegetationRuntime.placement
  });
  return vegetationRuntime;
}

self.addEventListener("message", async (event) => {
  const message = event.data ?? {};
  if (message.type === "init-patch-worker") {
    try {
      initialization = initialize(message.payload ?? {});
      await initialization;
      self.postMessage({ type: "patch-worker-ready", vegetationDomain: "n:object:vegetation" });
    } catch (error) {
      self.postMessage({ type: "patch-worker-error", error: String(error?.message ?? error) });
    }
    return;
  }
  if (message.type !== "generate-patch") return;
  try {
    if (initialization) await initialization;
    if (!generatePatch) throw new Error("Patch worker has not been initialized.");
    const patch = generatePatch(message.request);
    self.postMessage({
      type: "patch-generated",
      requestId: message.requestId,
      patch
    }, collectPatchTransferables(patch));
  } catch (error) {
    self.postMessage({
      type: "patch-error",
      requestId: message.requestId,
      error: String(error?.message ?? error)
    });
  }
});
