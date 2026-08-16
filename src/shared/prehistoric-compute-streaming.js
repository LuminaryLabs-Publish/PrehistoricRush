export const PREHISTORIC_PATCH_COMPUTE_GRAPH_ID = "prehistoric-rush:world-patch";
export const PREHISTORIC_PATCH_COMPUTE_KERNEL_ID = "generate-prehistoric-world-patch";

export function createPrehistoricPatchComputeRequest(request = {}) {
  const graph = Object.freeze({
    id: PREHISTORIC_PATCH_COMPUTE_GRAPH_ID,
    nodes: Object.freeze([Object.freeze({
      id: "generate-patch",
      kernelId: PREHISTORIC_PATCH_COMPUTE_KERNEL_ID,
      reads: Object.freeze([]),
      writes: Object.freeze([]),
      bindings: Object.freeze([]),
      dispatch: Object.freeze({ x: 1, y: 1, z: 1 }),
      indirect: null
    })])
  });
  return Object.freeze({
    graph,
    executionOrder: Object.freeze(["generate-patch"]),
    buffers: Object.freeze({}),
    kernels: Object.freeze({
      [PREHISTORIC_PATCH_COMPUTE_KERNEL_ID]: Object.freeze({
        id: PREHISTORIC_PATCH_COMPUTE_KERNEL_ID,
        entryPoint: PREHISTORIC_PATCH_COMPUTE_KERNEL_ID,
        language: "javascript"
      })
    }),
    input: Object.freeze({ request }),
    context: Object.freeze({ workload: "world-patch", semanticOwner: "prehistoric-rush:world" })
  });
}

export function createPrehistoricPatchComputeProvider(generatePatch) {
  if (typeof generatePatch !== "function") throw new TypeError("Prehistoric patch Compute provider requires generatePatch(request).");
  return Object.freeze({
    id: "prehistoric-rush-patch-worker",
    capabilities: Object.freeze({
      family: "cpu",
      backend: "javascript-worker",
      features: Object.freeze(["portable-graph", "off-main-thread", "transferable-output", "world-patch"]),
      priority: 100
    }),
    supports(profile = {}) {
      return !profile.requiredBackend || profile.requiredBackend === "javascript-worker";
    },
    async executeGraph(execution = {}) {
      if (execution.graph?.id !== PREHISTORIC_PATCH_COMPUTE_GRAPH_ID) {
        throw new TypeError(`Unsupported PrehistoricRush Compute graph: ${execution.graph?.id ?? "missing"}.`);
      }
      if (!execution.executionOrder?.includes("generate-patch")) {
        throw new TypeError("PrehistoricRush patch Compute graph is missing generate-patch execution.");
      }
      const patch = generatePatch(execution.input?.request ?? {});
      return {
        providerId: this.id,
        graphId: PREHISTORIC_PATCH_COMPUTE_GRAPH_ID,
        status: "completed",
        outputs: { patch },
        diagnostics: [{ nodeId: "generate-patch", status: "completed" }],
        metadata: { family: "cpu", backend: "javascript-worker", transferableOutput: true }
      };
    }
  });
}

export function evaluatePlayableStartup(input = {}) {
  const simulationRequired = Math.max(0, Number(input.simulationRequired ?? 0));
  const simulationGenerated = Math.max(0, Number(input.simulationGenerated ?? 0));
  const simulationReady = Math.max(0, Number(input.simulationReady ?? 0));
  const visualRequired = Math.max(0, Number(input.visualRequired ?? 0));
  const visualReady = Math.max(0, Number(input.visualReady ?? 0));
  const collisionReady = Boolean(input.collisionReady);
  const rendererReady = Boolean(input.rendererReady);
  const playableReady = simulationRequired > 0
    && simulationReady >= simulationRequired
    && collisionReady
    && rendererReady;
  const progress = simulationRequired > 0
    ? Math.min(1, Math.max(simulationGenerated, simulationReady) / simulationRequired)
    : 1;
  return Object.freeze({
    playableReady,
    progress,
    simulationGenerated,
    simulationReady,
    simulationRequired,
    visualReady,
    visualRequired,
    backgroundVisualPending: Math.max(0, visualRequired - visualReady),
    collisionReady,
    rendererReady
  });
}
