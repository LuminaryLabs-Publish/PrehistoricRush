import { NEXUS_COMMIT, NEXUS_REF, RUNTIME_URLS } from "./shared/runtime-versions.js";
import { createPrehistoricRushDenseVisualContributions } from "./domains/prehistoric-rush/dense-world-visual-contributions.js";
import { createPrehistoricRushGPUWorldScene } from "./domains/prehistoric-rush/gpu-native-world-scene.js";

const baseRuntimePromise = import("./game-runtime-semantic-v2.js");
const baseHostPromise = globalThis.PrehistoricRushHostPromise;
globalThis.PrehistoricRushHost = null;

let resolveHost;
let rejectHost;
const upgradedHostPromise = new Promise((resolve, reject) => { resolveHost = resolve; rejectHost = reject; });
globalThis.PrehistoricRushHostPromise = upgradedHostPromise;

function fallbackSnapshot(error = null) {
  return Object.freeze({
    active: false,
    backend: "fallback",
    mode: "three-webgl2",
    sharedDeviceId: null,
    contributionIds: [],
    terrainAuthority: "n:world:foundation",
    terrainPatchCount: 0,
    treeCount: 0,
    treeSpeciesCount: 0,
    grassLogicalCount: 0,
    sharedDepth: false,
    singleCanvas: false,
    singleFrameSubmission: false,
    gpuCulling: false,
    gpuLod: false,
    indirectDraw: false,
    zeroCopy: false,
    computeDispatches: 0,
    renderSubmissions: 0,
    frameSequence: 0,
    skippedFrames: 0,
    uploadedBytes: 0,
    gpuReadbackBytes: 0,
    resourceCount: 0,
    error: error?.message ?? null
  });
}

function upgradeHost(baseHost, gpuState) {
  return Object.freeze({
    ...baseHost,
    rendering: Object.freeze({
      ...baseHost.rendering,
      snapshot() {
        const snapshot = baseHost.rendering.snapshot();
        return { ...snapshot, gpuNative: gpuState.snapshot() };
      }
    }),
    compute: Object.freeze({
      ...(baseHost.compute ?? {}),
      selectedProvider: gpuState.snapshot().active ? "webgpu-shared-world" : baseHost.compute?.selectedProvider ?? "fallback",
      gpuNative: gpuState.snapshot
    }),
    performance: Object.freeze({
      ...baseHost.performance,
      gpuNative: gpuState.snapshot
    }),
    versions: Object.freeze({
      ...baseHost.versions,
      nexusRef: NEXUS_REF,
      nexusValidatedCommit: NEXUS_COMMIT
    })
  });
}

(async () => {
  try {
    await baseRuntimePromise;
    const baseHost = await baseHostPromise;
    let gpuScene = null;
    let gpuHost = null;
    let gpuError = null;
    let fallbackState = fallbackSnapshot();

    if (globalThis.navigator?.gpu && baseHost?.rendering?.getDenseWorldPresentation) {
      try {
        const [Host, Compute, Graphics, Render] = await Promise.all([
          import(RUNTIME_URLS.nexusHost),
          import(RUNTIME_URLS.nexusCompute),
          import(RUNTIME_URLS.nexusGraphics),
          import(RUNTIME_URLS.nexusRender)
        ]);
        if (typeof Host.createGPUHost !== "function" || typeof Host.createWebGPUHostProvider !== "function") throw new Error("Nexus Host GPU capability is unavailable.");
        if (typeof Compute.createComputeHost !== "function" || typeof Compute.createWebGPUComputeProvider !== "function") throw new Error("Nexus Compute shared WebGPU capability is unavailable.");
        if (typeof Graphics.defineVisualContribution !== "function" || typeof Graphics.composeVisualContributions !== "function") throw new Error("Nexus portable VisualContribution capability is unavailable.");
        if (typeof Render.createWebGPUFrameExecutor !== "function") throw new Error("Nexus unified WebGPU frame execution is unavailable.");

        gpuHost = Host.createGPUHost({
          id: "prehistoric-rush:shared-gpu-host",
          provider: Host.createWebGPUHostProvider({ id: "prehistoric-rush:webgpu-host-provider", gpu: globalThis.navigator.gpu })
        });
        await gpuHost.ensureDevice({ requiredBackend: "webgpu", requiredFeatures: ["compute", "render", "storage-buffer", "vertex-buffer", "indirect-buffer"], compute: true, render: true });

        const webgpuProvider = Compute.createWebGPUComputeProvider({ id: "prehistoric-rush:webgpu-compute", gpuHost, awaitCompletion: true });
        const javascriptProvider = Compute.createJavascriptComputeProvider?.({ id: "prehistoric-rush:javascript-compute" });
        const providers = [webgpuProvider, javascriptProvider].filter(Boolean);
        const computeHost = Compute.createComputeHost({ id: "prehistoric-rush:compute-host", providers, preference: ["webgpu", "javascript"] });
        await computeHost.initialize();
        const frameExecutor = Render.createWebGPUFrameExecutor({ id: "prehistoric-rush:webgpu-world-frame", gpuHost, gpu: globalThis.navigator.gpu, awaitCompletion: true });
        const denseState = baseHost.rendering.getDenseWorldPresentation();
        const contributions = createPrehistoricRushDenseVisualContributions({
          defineVisualContribution: Graphics.defineVisualContribution,
          composeVisualContributions: Graphics.composeVisualContributions,
          recipe: baseHost.world?.recipe,
          denseState
        });
        const renderHost = document.getElementById("prehistoric-render-host");
        if (!renderHost) throw new Error("PrehistoricRush render host is unavailable for unified GPU presentation.");
        gpuScene = await createPrehistoricRushGPUWorldScene({
          hostElement: renderHost,
          world: baseHost.world,
          recipe: baseHost.world?.recipe,
          gpuHost,
          computeHost,
          frameExecutor,
          rendering: baseHost.rendering,
          contributions
        });
        baseHost.compute?.dispose?.();
        baseHost.rendering.setDenseWorldGPUActive?.(true);

        const driveGPUFrame = () => {
          if (!gpuScene) return;
          const snapshot = gpuScene.snapshot();
          if (!snapshot.active) {
            baseHost.rendering.setDenseWorldGPUActive?.(false);
            gpuScene.dispose();
            gpuScene = null;
            return;
          }
          const state = baseHost.gameplay?.getState?.();
          if (state && baseHost.rendering?.camera) gpuScene.scheduleFrame({ state, camera: baseHost.rendering.camera });
          requestAnimationFrame(driveGPUFrame);
        };
        requestAnimationFrame(driveGPUFrame);
      } catch (error) {
        gpuError = error instanceof Error ? error : new Error(String(error));
        console.warn("PrehistoricRush unified Nexus WebGPU world unavailable; preserving Three/WebGL2 fallback.", gpuError);
        baseHost.rendering.setDenseWorldGPUActive?.(false);
        gpuScene?.dispose?.();
        gpuHost?.dispose?.();
        gpuScene = null;
        gpuHost = null;
        fallbackState = fallbackSnapshot(gpuError);
      }
    }

    const gpuState = Object.freeze({
      snapshot() {
        return gpuScene?.snapshot?.() ?? fallbackState;
      }
    });
    const upgradedHost = upgradeHost(baseHost, gpuState);
    globalThis.PrehistoricRushHost = upgradedHost;
    resolveHost(upgradedHost);
  } catch (error) {
    rejectHost(error);
    queueMicrotask(() => { throw error; });
  }
})();
