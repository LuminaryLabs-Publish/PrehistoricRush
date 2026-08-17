// Semantic-v2 bootstraps on the deterministic CPU provider only.
// The shared-GPU v3 runtime owns the sole WebGPU adapter/device so Compute and Render cannot race separate device lifecycles.
const Compute = await import("https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine@main/src/core-domains/compute/index.js");

export const createComputeHost = Compute.createComputeHost;
export const createJavaScriptComputeProvider = Compute.createJavaScriptComputeProvider;
