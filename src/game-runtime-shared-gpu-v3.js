import { NEXUS_COMMIT, VALIDATED_RUNTIME_URLS } from "./shared/runtime-versions.js";
import { createPrehistoricRushDenseVisualContributions } from "./domains/prehistoric-rush/dense-world-visual-contributions.js";
import { createPrehistoricRushGPUWorldScene } from "./domains/prehistoric-rush/gpu-native-world-scene.js";

await import("./game-runtime-semantic-v2.js");

const baseHost = globalThis.PrehistoricRushHost;
if (!baseHost) throw new Error("PrehistoricRush semantic runtime did not publish its host before the unified GPU upgrade.");

globalThis.PrehistoricRushHost = null;

let gpuHost = null;
let computeHost = baseHost.computeHost;
let computeSelection = baseHost.getState().compute.selected;
let frameExecutor = null;
let gpuScene = null;
let gpuUpgradeError = null;
let gpuFrame = 0;

const rendererPreference = baseHost.rendering?.qualityProfile?.rendererPreference ?? "webgl2";

if (rendererPreference === "webgpu" && globalThis.navigator?.gpu && baseHost.rendering?.getDenseWorldPresentation) {
  try {
    const [Host, Compute, Graphics, Render] = await Promise.all([
      import(VALIDATED_RUNTIME_URLS.nexusHost),
      import(VALIDATED_RUNTIME_URLS.nexusCompute),
      import(VALIDATED_RUNTIME_URLS.nexusGraphics),
      import(VALIDATED_RUNTIME_URLS.nexusRender)
    ]);
    if (typeof Host.createGPUHost !== "function" || typeof Host.createWebGPUHostProvider !== "function") throw new Error("Nexus Host GPU capability is unavailable from validated NexusEngine/main.");
    if (typeof Compute.createWebGPUComputeProvider !== "function" || typeof Compute.createComputeHost !== "function") throw new Error("Nexus shared WebGPU Compute provider is unavailable.");
    if (typeof Graphics.defineVisualContribution !== "function" || typeof Graphics.composeVisualContributions !== "function") throw new Error("Nexus portable VisualContribution capability is unavailable.");
    if (typeof Render.createWebGPUFrameExecutor !== "function") throw new Error("Nexus unified WebGPU frame executor is unavailable.");

    gpuHost = Host.createGPUHost({
      id: "prehistoric-rush:shared-gpu-host",
      provider: Host.createWebGPUHostProvider({ id: "prehistoric-rush:webgpu-host-provider", gpu: globalThis.navigator.gpu })
    });
    const deviceDescriptor = await gpuHost.ensureDevice({
      requiredBackend: "webgpu",
      requiredFeatures: ["compute", "render", "storage-buffer", "vertex-buffer", "indirect-buffer"],
      compute: true,
      render: true
    });

    const providers = [
      Compute.createWebGPUComputeProvider({ id: "prehistoric-rush:webgpu-compute", gpuHost, priority: 100, awaitCompletion: true }),
      typeof Compute.createJavaScriptComputeProvider === "function" ? Compute.createJavaScriptComputeProvider({ id: "prehistoric-rush:javascript-compute", priority: 10 }) : null
    ].filter(Boolean);
    computeHost = Compute.createComputeHost({ id: "prehistoric-rush:compute-host-v4", providers });
    computeSelection = computeHost.selectProvider({ preferredBackends: ["webgpu", "javascript"], allowFallback: true });
    frameExecutor = Render.createWebGPUFrameExecutor({ id: "prehistoric-rush:webgpu-world-frame", gpuHost, gpu: globalThis.navigator.gpu, awaitCompletion: true });

    await baseHost.rendering.whenRichPresentationReady?.();
    const denseState = baseHost.rendering.getDenseWorldPresentation();
    if (denseState.treePackageCount !== 12) throw new Error(`Unified GPU handoff requires all 12 Tree Fidelity packages; received ${denseState.treePackageCount}.`);
    const contributions = createPrehistoricRushDenseVisualContributions({
      defineVisualContribution: Graphics.defineVisualContribution,
      composeVisualContributions: Graphics.composeVisualContributions,
      recipe: baseHost.worldRecipe,
      denseState
    });
    const renderHost = document.querySelector("#prehistoric-render-host");
    if (!renderHost) throw new Error("PrehistoricRush render host is unavailable for unified GPU presentation.");

    gpuScene = await createPrehistoricRushGPUWorldScene({
      hostElement: renderHost,
      world: baseHost.world,
      recipe: baseHost.worldRecipe,
      gpuHost,
      computeHost,
      frameExecutor,
      rendering: baseHost.rendering,
      qualityProfile: baseHost.rendering.qualityProfile,
      contributions
    });

    const gpuReady = gpuScene.snapshot();
    if (gpuHost.getDeviceDescriptor()?.id !== deviceDescriptor.id) throw new Error("Compute/Render GPU Host device identity changed during unified world startup.");
    if (gpuReady.treeSpeciesCount !== 12 || gpuReady.treeCount < 1 || gpuReady.passCount < 26) throw new Error("Unified GPU scene did not reach full Tree Fidelity readiness before presentation handoff.");
    baseHost.computeHost?.dispose?.();
    baseHost.rendering.setDenseWorldGPUActive(true);

    const scheduleGPUFrame = () => {
      if (!gpuScene) return;
      const snapshot = gpuScene.snapshot();
      if (!snapshot.active) {
        baseHost.rendering.setDenseWorldGPUActive(false);
        gpuScene.dispose();
        gpuScene = null;
        frameExecutor?.dispose?.();
        gpuHost?.dispose?.();
        frameExecutor = null;
        gpuHost = null;
        return;
      }
      gpuScene.scheduleFrame({ state: baseHost.gameplay.getState(), camera: baseHost.rendering.camera });
      gpuFrame += 1;
      requestAnimationFrame(scheduleGPUFrame);
    };
    requestAnimationFrame(scheduleGPUFrame);
    addEventListener("resize", () => gpuScene?.resize?.());
  } catch (error) {
    gpuUpgradeError = error instanceof Error ? error : new Error(String(error));
    baseHost.rendering.setDenseWorldGPUActive?.(false);
    gpuScene?.dispose?.();
    frameExecutor?.dispose?.();
    gpuHost?.dispose?.();
    gpuScene = null;
    frameExecutor = null;
    gpuHost = null;
    computeHost = baseHost.computeHost;
    computeSelection = baseHost.getState().compute.selected;
    console.warn(`PrehistoricRush unified Nexus WebGPU world unavailable; retaining validated WebGL fallback: ${gpuUpgradeError.message}`);
  }
}

function gpuSnapshot() {
  if (gpuScene) return gpuScene.snapshot();
  const presentation = baseHost.rendering.snapshot();
  return Object.freeze({
    active: false,
    backend: "webgl2-fallback",
    mode: "three-webgl2",
    sharedDeviceId: null,
    contributionIds: [],
    terrainAuthority: "n:world:foundation",
    terrainPatchCount: presentation.terrainPatchCount,
    treeCount: presentation.treeCount,
    treeSpeciesCount: presentation.treeFidelityPackageCount,
    grassLogicalCount: presentation.grassCount,
    sharedDepth: false,
    singleCanvas: false,
    singleFrameSubmission: false,
    gpuCulling: false,
    gpuLod: false,
    indirectDraw: false,
    zeroCopy: false,
    passCount: 0,
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
  gpuScene,
  getState() {
    const state = baseHost.getState();
    const gpu = gpuSnapshot();
    return {
      ...state,
      rendering: {
        ...state.rendering,
        gpuNative: gpu
      },
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
