import { NEXUS_COMMIT, RUNTIME_URLS } from "./shared/runtime-versions.js";
import { createPrehistoricRushGPUGroundCover } from "./domains/prehistoric-rush/gpu-native-ground-cover.js";

await import("./game-runtime-semantic-v2.js");

const baseHost = globalThis.PrehistoricRushHost;
if (!baseHost) throw new Error("PrehistoricRush semantic runtime did not publish its host before the shared GPU upgrade.");

// Do not expose a half-upgraded host to validation or product consumers.
globalThis.PrehistoricRushHost = null;

let gpuHost = null;
let computeHost = baseHost.computeHost;
let computeSelection = baseHost.getState().compute.selected;
let renderProvider = null;
let gpuLayer = null;
let gpuUpgradeError = null;
let gpuFrame = 0;

if (globalThis.navigator?.gpu) {
  try {
    const [Host, Compute, Render] = await Promise.all([
      import(RUNTIME_URLS.nexusHost),
      import(RUNTIME_URLS.nexusCompute),
      import(RUNTIME_URLS.nexusRender)
    ]);
    if (typeof Host.createGPUHost !== "function" || typeof Host.createWebGPUHostProvider !== "function") throw new Error("Nexus Host GPU capability is unavailable from NexusEngine/main.");
    if (typeof Compute.createWebGPUComputeProvider !== "function" || typeof Compute.createComputeHost !== "function") throw new Error("Nexus shared WebGPU Compute provider is unavailable.");
    if (typeof Render.createWebGPURenderProvider !== "function") throw new Error("Nexus WebGPU Render provider is unavailable.");

    const gpuProvider = Host.createWebGPUHostProvider({
      id: "prehistoric-rush-webgpu-host-provider",
      gpu: globalThis.navigator.gpu
    });
    gpuHost = Host.createGPUHost({ id: "prehistoric-rush-shared-gpu", provider: gpuProvider });
    const deviceDescriptor = await gpuHost.ensureDevice({
      requiredBackend: "webgpu",
      requiredFeatures: ["compute", "render", "storage-buffer", "indirect-buffer"]
    });

    const providers = [
      Compute.createWebGPUComputeProvider({
        id: "prehistoric-rush-shared-webgpu-compute",
        gpuHost,
        priority: 100,
        awaitCompletion: true
      }),
      Compute.createJavaScriptComputeProvider({
        id: "prehistoric-rush-javascript-compute",
        priority: 10
      })
    ];
    computeHost = Compute.createComputeHost({ id: "prehistoric-rush-compute-host-v3", providers });
    computeSelection = computeHost.selectProvider({ preferredBackends: ["webgpu", "javascript"], allowFallback: true });
    renderProvider = Render.createWebGPURenderProvider({
      id: "prehistoric-rush-shared-webgpu-render",
      gpuHost,
      awaitCompletion: true
    });

    const renderHost = document.querySelector("#prehistoric-render-host");
    gpuLayer = await createPrehistoricRushGPUGroundCover({
      hostElement: renderHost,
      world: baseHost.world,
      recipe: baseHost.worldRecipe,
      gpuHost,
      computeHost,
      renderProvider
    });

    baseHost.computeHost?.dispose?.();

    const cpuGrass = baseHost.rendering.scene?.getObjectByName?.("prehistoric-foundation-grass");
    if (cpuGrass) cpuGrass.visible = false;

    const scheduleGPUFrame = () => {
      if (!gpuLayer?.active) return;
      gpuLayer.scheduleFrame({
        state: baseHost.gameplay.getState(),
        camera: baseHost.rendering.camera
      });
      gpuFrame += 1;
      requestAnimationFrame(scheduleGPUFrame);
    };
    requestAnimationFrame(scheduleGPUFrame);
    addEventListener("resize", () => gpuLayer?.resize?.());

    if (gpuHost.getDeviceDescriptor()?.id !== deviceDescriptor.id) throw new Error("Compute/Render GPU Host device identity changed during PrehistoricRush startup.");
  } catch (error) {
    gpuUpgradeError = error instanceof Error ? error : new Error(String(error));
    gpuLayer?.dispose?.();
    renderProvider?.dispose?.();
    gpuHost?.dispose?.();
    gpuLayer = null;
    renderProvider = null;
    gpuHost = null;
    computeHost = baseHost.computeHost;
    computeSelection = baseHost.getState().compute.selected;
    console.warn(`PrehistoricRush shared WebGPU path unavailable; retaining validated WebGL fallback: ${gpuUpgradeError.message}`);
  }
}

function gpuSnapshot() {
  if (gpuLayer) return gpuLayer.snapshot();
  return Object.freeze({
    active: false,
    backend: "webgl2-fallback",
    mode: "cpu-webgl-fallback",
    sharedDeviceId: null,
    terrainAuthority: "n:world:foundation",
    terrainHeightfieldResident: false,
    terrainPatchCount: baseHost.rendering.snapshot().terrainPatchCount,
    grassLogicalCount: baseHost.rendering.snapshot().grassCount,
    gpuCulling: false,
    gpuLod: false,
    indirectDraw: false,
    zeroCopy: false,
    computeDispatches: 0,
    renderSubmissions: 0,
    frameSequence: gpuFrame,
    skippedFrames: 0,
    uploadedBytes: 0,
    gpuReadbackBytes: 0,
    resourceCount: 0,
    error: gpuUpgradeError?.message ?? null
  });
}

const upgradedHost = Object.freeze({
  ...baseHost,
  computeHost,
  gpuHost,
  gpuLayer,
  getState() {
    const state = baseHost.getState();
    const gpu = gpuSnapshot();
    const rendering = {
      ...state.rendering,
      grassCount: gpu.active ? gpu.grassLogicalCount : state.rendering.grassCount,
      gpuNative: gpu
    };
    return {
      ...state,
      rendering,
      compute: {
        selected: computeSelection,
        providers: computeHost?.listProviders?.() ?? state.compute.providers,
        webgpuAdapterReady: Boolean(gpu.active),
        sharedGPUHost: Boolean(gpu.active),
        sharedDeviceId: gpu.sharedDeviceId,
        zeroCopyRender: gpu.zeroCopy
      },
      gpuNative: gpu,
      performance: {
        ...state.performance,
        gpuNative: {
          uploadedBytes: gpu.uploadedBytes,
          readbackBytes: gpu.gpuReadbackBytes,
          computeDispatches: gpu.computeDispatches,
          renderSubmissions: gpu.renderSubmissions,
          skippedFrames: gpu.skippedFrames
        }
      },
      versions: { ...state.versions, nexus: "main", nexusValidatedCommit: NEXUS_COMMIT }
    };
  }
});

globalThis.PrehistoricRushHost = upgradedHost;
