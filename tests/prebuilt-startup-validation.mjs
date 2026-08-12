import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { chromium } from "playwright";

const RUN_ID = "2026-08-09-prehistoric-headless-visual-upgrade";
const baseUrl = process.env.PREHISTORIC_BASE_URL ?? "http://127.0.0.1:4173";
const output = path.resolve(`.agent/evidence/${RUN_ID}/metrics/prebuilt-startup.json`);
const MAX_CI_HOST_READY_MS = 90_000;
const errors = [];

const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--enable-unsafe-swiftshader",
    "--disable-dev-shm-usage"
  ]
});

let result;
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const startedAt = performance.now();
  await page.goto(`${baseUrl}/game.html?startup-validation=${Date.now()}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000
  });
  await page.waitForFunction(
    () => Boolean(globalThis.PrehistoricRushHost) && Boolean(globalThis.PrehistoricRushTreeAssetRuntime),
    null,
    { timeout: MAX_CI_HOST_READY_MS }
  );
  const hostReadyMs = performance.now() - startedAt;
  result = await page.evaluate(() => {
    const runtime = globalThis.PrehistoricRushTreeAssetRuntime;
    const state = globalThis.PrehistoricRushHost?.getState?.() ?? {};
    const assetStartup = state.assetStartup ?? state.startup?.assetStartup ?? null;
    const preparations = assetStartup?.preparations ?? [];
    const imagePreparation = preparations.find((entry) => entry.id === "tree-fidelity-runtime-images") ?? null;
    return {
      prebuiltUsage: structuredClone(runtime?.prebuiltFidelityUsage ?? null),
      assetReceipt: structuredClone(runtime?.receipt ?? null),
      imageReceipt: structuredClone(imagePreparation?.receipt ?? null),
      packageCount: state.treeFidelity?.packageCount ?? null,
      foliageOverflow: state.lushFoliage?.overflow ?? null,
      canvasPresent: Boolean(document.querySelector("canvas"))
    };
  });
  result.hostReadyMs = hostReadyMs;
  result.maxCiHostReadyMs = MAX_CI_HOST_READY_MS;
  result.errors = errors;
} finally {
  await browser.close();
}

assert.equal(result.prebuiltUsage?.packageHits, 12, "normal production startup loads all 12 compiled tree packages");
assert.ok((result.prebuiltUsage?.manifestHits ?? 0) >= 1, "normal production startup loads the compiled tree manifest");
assert.equal(result.prebuiltUsage?.runtimeFallbackPackages, 0, "normal production startup performs zero runtime tree package generation");
assert.equal(result.prebuiltUsage?.runtimeFallbackManifest, 0, "normal production startup does not fall back to a generated manifest");
assert.equal(result.imageReceipt?.parallelDecoding, true, "compiled tree atlases decode in parallel");
assert.equal(result.packageCount, 12, "production renderer receives all 12 Fidelity packages");
assert.equal(result.foliageOverflow, 0, "compiled startup preserves zero foliage overflow");
assert.equal(result.canvasPresent, true, "compiled startup reaches the production canvas");
assert.equal(errors.length, 0, "compiled startup has no browser errors");
assert.ok(result.hostReadyMs < MAX_CI_HOST_READY_MS, `compiled startup reaches host-ready in under ${MAX_CI_HOST_READY_MS}ms on CI`);

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify({ status: "PASS", ...result }, null, 2)}\n`);
console.log(JSON.stringify({ status: "PASS", ...result }, null, 2));
