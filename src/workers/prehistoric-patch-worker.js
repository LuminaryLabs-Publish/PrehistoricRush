import {
  collectPatchTransferables,
  createPrehistoricPatchGenerator
} from "../world/prehistoric-patch-generator.js";

let generatePatch = null;

self.addEventListener("message", (event) => {
  const message = event.data ?? {};
  if (message.type === "init-patch-worker") {
    generatePatch = createPrehistoricPatchGenerator(message.payload ?? {});
    self.postMessage({ type: "patch-worker-ready" });
    return;
  }
  if (message.type !== "generate-patch") return;
  try {
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
