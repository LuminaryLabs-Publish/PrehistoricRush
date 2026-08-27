import { NEXUS_COMMIT, VALIDATED_RUNTIME_URLS } from "./shared/runtime-versions.js";
import { createPrehistoricRushDenseVisualContributions } from "./domains/prehistoric-rush/dense-world-visual-contributions.js";
import { createPrehistoricRushGPUWorldScene } from "./domains/prehistoric-rush/gpu-native-world-scene.js";
import { setFoundationTerrainStreamingOwner } from "./domains/prehistoric-rush/rendering-streaming-policy.js";

await import("./game-runtime-semantic-v2.js");

const engine = globalThis.PrehistoricRushEngine;
if (!engine?.n?.prehistoricRush) throw new Error("PrehistoricRush semantic runtime did not publish its Nexus Engine before the unified GPU upgrade.");
const product = engine.n.prehistoricRush;
const rendering = product.getComponent("rendering");
const gameplay = product.getComponent("gameplay");
const world = product.getComponent("world");
const worldRecipe = product.getComponent("worldRecipe");
const baseComputeHost = product.getComponent("computeHost");
const baseComputeSelection = product.getComponent("selection");
if (!rendering || !gameplay || !world || !worldRecipe) throw new Error("PrehistoricRush product composition is incomplete before the unified GPU upgrade.");

let gpuHost = null;
let computeHost = baseComputeHost;
let computeSelection = baseComputeSelection;
let frameExecutor = null;
let gpuScene = null;
let gpuUpgradeError = null;
let gpuFrame = 0;
let removeGPUFrameHook = null;
const rendererPreference = rendering.qualityProfile?.rendererPreference ?? "webgl2";

function disableGPUScene() {
  removeGPUFrameHook?.();
  removeGPUFrameHook = null;
  setFoundationTerrainStreamingOwner("webgl2");
  rendering.setDenseWorldGPUActive?.(false);
  gpuScene?.dispose?.();
  frameExecutor?.dispose?.();
  gpuHost?.dispose?.();
  gpuScene = null;
  frameExecutor = null;
  gpuHost = null;
}

if (rendererPreference === "webgpu" && globalThis.navigator?.gpu && rendering.getDenseWorldPresentation) {
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
    const deviceDescriptor = await gpuHost.ensureDevice({ requiredBackend: "webgpu", requiredFeatures: ["compute", "render", "storage-buffer", "vertex-buffer", "indirect-buffer"], compute: true, render: true });
    const providers = [
      Compute.createWebGPUComputeProvider({ id: "prehistoric-rush:webgpu-compute", gpuHost, priority: 100, awaitCompletion: true }),
      typeof Compute.createJavaScriptComputeProvider === "function" ? Compute.createJavaScriptComputeProvider({ id: "prehistoric-rush:javascript-compute", priority: 10 }) : null
    ].filter(Boolean);
    computeHost = Compute.createComputeHost({ id: "prehistoric-rush:compute-host-v4", providers });
    computeSelection = computeHost.selectProvider({ preferredBackends: ["webgpu", "javascript"], allowFallback: true });
    frameExecutor = Render.createWebGPUFrameExecutor({ id: "prehistoric-rush:webgpu-world-frame", gpuHost, gpu: globalThis.navigator.gpu, awaitCompletion: true });

    await rendering.whenRichPresentationReady?.();
    const denseState = rendering.getDenseWorldPresentation();
    if (denseState.treePackageCount !== 12) throw new Error(`Unified GPU handoff requires all 12 Tree Fidelity packages; received ${denseState.treePackageCount}.`);
    const contributions = createPrehistoricRushDenseVisualContributions({ defineVisualContribution: Graphics.defineVisualContribution, composeVisualContributions: Graphics.composeVisualContributions, recipe: worldRecipe, denseState });
    const renderHost = document.querySelector("#prehistoric-render-host");
    if (!renderHost) throw new Error("PrehistoricRush render host is unavailable for unified GPU presentation.");

    gpuScene = await createPrehistoricRushGPUWorldScene({ hostElement: renderHost, world, recipe: worldRecipe, gpuHost, computeHost, frameExecutor, rendering, qualityProfile: rendering.qualityProfile, contributions });
    const gpuReady = gpuScene.snapshot();
    if (gpuHost.getDeviceDescriptor()?.id !== deviceDescriptor.id) throw new Error("Compute/Render GPU Host device identity changed during unified world startup.");
    if (gpuReady.treeSpeciesCount !== 12 || gpuReady.treeCount < 1 || gpuReady.passCount < 26) throw new Error("Unified GPU scene did not reach full Tree Fidelity readiness before presentation handoff.");
    const terrainAnchor = gameplay.readState?.() ?? gameplay.getState?.() ?? { x: 0, z: 0 };
    setFoundationTerrainStreamingOwner("webgpu", terrainAnchor);
    rendering.setDenseWorldGPUActive(true);

    removeGPUFrameHook = product.registerFrameHook(({ state, camera }) => {
      if (!gpuScene) return;
      const snapshot = gpuScene.snapshot();
      if (!snapshot.active) {
        disableGPUScene();
        return;
      }
      gpuScene.scheduleFrame({ state, camera });
      gpuFrame += 1;
    });
    addEventListener("resize", () => gpuScene?.resize?.());
  } catch (error) {
    gpuUpgradeError = error instanceof Error ? error : new Error(String(error));
    disableGPUScene();
    computeHost = baseComputeHost;
    computeSelection = baseComputeSelection;
    console.warn(`PrehistoricRush unified Nexus WebGPU world unavailable; retaining validated WebGL fallback: ${gpuUpgradeError.message}`);
  }
}

function gpuSnapshot() {
  if (gpuScene) return gpuScene.snapshot();
  const presentation = rendering.snapshot();
  return Object.freeze({ active: false, backend: "webgl2-fallback", mode: "three-webgl2", sharedDeviceId: null, contributionIds: [], terrainAuthority: "n:world:foundation", terrainPatchCount: presentation.terrainPatchCount, treeCount: presentation.treeCount, treeSpeciesCount: presentation.treeFidelityPackageCount, grassLogicalCount: presentation.grassCount, sharedDepth: false, singleCanvas: false, singleFrameSubmission: false, gpuCulling: false, gpuLod: false, indirectDraw: false, zeroCopy: false, passCount: 0, computeDispatches: 0, renderSubmissions: 0, frameSequence: gpuFrame, skippedFrames: 0, uploadedBytes: 0, gpuReadbackBytes: 0, resourceCount: 0, error: gpuUpgradeError?.message ?? null });
}

const gpuPresentation = Object.freeze({
  id: "prehistoric-rush:gpu-native-presentation",
  get computeHost() { return computeHost; },
  get gpuHost() { return gpuHost; },
  get scene() { return gpuScene; },
  snapshot() {
    const gpu = gpuSnapshot();
    return Object.freeze({
      ...gpu,
      compute: Object.freeze({
        selected: computeSelection,
        providers: computeHost?.listProviders?.() ?? [],
        webgpuAdapterReady: Boolean(gpu.active),
        sharedGPUHost: Boolean(gpu.active),
        sharedDeviceId: gpu.sharedDeviceId,
        zeroCopyRender: gpu.zeroCopy
      }),
      nexusValidatedCommit: NEXUS_COMMIT
    });
  }
});

product.bindOptionalPresentation("gpuNative", gpuPresentation);
