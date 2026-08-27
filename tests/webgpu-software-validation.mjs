import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.PREHISTORIC_BASE_URL ?? "http://127.0.0.1:4173";
const browser = await chromium.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--use-angle=vulkan",
    "--enable-features=Vulkan",
    "--disable-vulkan-surface",
    "--enable-unsafe-webgpu",
    "--ignore-gpu-blocklist"
  ]
});

const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const pageErrors = [];
const consoleErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

try {
  await page.goto(`${baseUrl}/game.html?validation=software-webgpu`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  const gpuAvailable = await page.evaluate(() => Boolean(navigator.gpu));
  assert.equal(gpuAvailable, true, "software validation requires navigator.gpu");

  try {
    await page.waitForFunction(() => {
      const state = globalThis.PrehistoricRushEngine?.n?.prehistoricRush?.getSnapshot?.();
      const gpu = state?.gpuNative;
      return Boolean(
        gpu?.active
        && gpu.sharedDepth
        && gpu.singleCanvas
        && gpu.singleFrameSubmission
        && gpu.zeroCopy
        && gpu.gpuCulling
        && gpu.gpuLod
        && gpu.indirectDraw
        && gpu.treeSpeciesCount >= 12
        && gpu.treeCount > 0
        && gpu.passCount >= 26
        && gpu.computeDispatches > 0
        && gpu.renderSubmissions > 0
      );
    }, undefined, { timeout: 120_000, polling: 250 });
  } catch (error) {
    const diagnostic = await page.evaluate(() => {
      const product = globalThis.PrehistoricRushEngine?.n?.prehistoricRush;
      if (!product?.getSnapshot) return { engineReady: false };
      const state = product.getSnapshot();
      return {
        engineReady: true,
        gpuNative: state.gpuNative ?? null,
        compute: state.compute ?? null,
        rendering: state.rendering ?? null,
        streamingReadiness: state.streamingReadiness ?? null,
        versions: state.versions ?? null
      };
    }).catch((evaluationError) => ({ diagnosticError: evaluationError.message }));
    console.error(JSON.stringify({ status: "TIMEOUT", gpuAvailable, diagnostic, pageErrors, consoleErrors }, null, 2));
    throw error;
  }

  const result = await page.evaluate(() => {
    const product = globalThis.PrehistoricRushEngine.n.prehistoricRush;
    const state = product.getSnapshot();
    const gpu = state.gpuNative;
    const gpuPresentation = product.getComponent("gpuNative");
    const adapter = gpuPresentation?.gpuHost?.providerAccess?.().getAdapter?.() ?? null;
    const rendering = product.getComponent("rendering");
    let hiddenDenseFallbacks = 0;
    let visibleDenseFallbacks = 0;
    rendering.scene.traverse((object) => {
      const name = String(object?.name ?? "");
      if (name.startsWith("prehistoric-foundation-terrain") || name.startsWith("prehistoric-tree-fidelity-") || name === "prehistoric-foundation-grass") {
        if (object.visible === false) hiddenDenseFallbacks += 1;
        else visibleDenseFallbacks += 1;
      }
    });
    return {
      gpu,
      compute: gpu.compute,
      versions: state.versions,
      adapterInfo: adapter?.info ? {
        architecture: adapter.info.architecture ?? "",
        device: adapter.info.device ?? "",
        vendor: adapter.info.vendor ?? "",
        description: adapter.info.description ?? "",
        isFallbackAdapter: Boolean(adapter.info.isFallbackAdapter)
      } : null,
      hiddenDenseFallbacks,
      visibleDenseFallbacks,
      gpuCanvasCount: document.querySelectorAll('#prehistoric-render-host canvas[data-prehistoric-gpu-native="unified-world"]').length,
      totalCanvasCount: document.querySelectorAll("#prehistoric-render-host canvas").length
    };
  });

  assert.equal(result.gpu.backend, "webgpu");
  assert.equal(result.gpu.mode, "unified-dense-world");
  assert.equal(result.gpu.sharedDepth, true);
  assert.equal(result.gpu.singleCanvas, true);
  assert.equal(result.gpu.singleFrameSubmission, true);
  assert.equal(result.gpu.zeroCopy, true);
  assert.equal(result.gpu.gpuReadbackBytes, 0);
  assert.equal(result.gpu.treeSpeciesCount, 12);
  assert.ok(result.gpu.treeCount > 0);
  assert.ok(result.gpu.passCount >= 26, "terrain + 24 Tree Fidelity near/medium passes + ground cover must share the unified frame");
  assert.ok(result.gpu.computeDispatches > 0);
  assert.ok(result.gpu.renderSubmissions > 0);
  assert.equal(result.compute.sharedGPUHost, true);
  assert.equal(result.compute.zeroCopyRender, true);
  assert.equal(result.gpuCanvasCount, 1, "dense world must use exactly one Nexus WebGPU canvas");
  assert.ok(result.hiddenDenseFallbacks > 0, "Three dense fallback meshes must be hidden after unified WebGPU activation");
  assert.equal(result.visibleDenseFallbacks, 0, "no dense Three fallback mesh may remain visible behind the unified GPU scene");
  assert.equal(result.versions.nexusValidatedCommit, "4d550be678b721a435495b7b8b7196c294cbc561");
  assert.deepEqual(pageErrors, []);
  assert.deepEqual(consoleErrors, []);

  console.log(JSON.stringify({
    status: "PASS",
    adapter: result.adapterInfo,
    gpu: result.gpu,
    canvases: { gpu: result.gpuCanvasCount, total: result.totalCanvasCount },
    hiddenDenseFallbacks: result.hiddenDenseFallbacks,
    pageErrors,
    consoleErrors
  }, null, 2));
} finally {
  await browser.close();
}
