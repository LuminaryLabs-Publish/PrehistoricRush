import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const RUN_ID = "2026-08-09-prehistoric-headless-visual-upgrade";
const output = path.resolve(`.agent/evidence/${RUN_ID}/metrics/game-startup-performance.json`);
const baseUrl = process.env.PREHISTORIC_BASE_URL ?? "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const pageErrors = [];
const consoleErrors = [];
page.on("pageerror", (error) => pageErrors.push(String(error?.message ?? error)));
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});

const startedAt = Date.now();
try {
  await page.goto(`${baseUrl}/game.html?validation=startup`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(
    () => Boolean(globalThis.PrehistoricRushHost?.getState?.().streamingReadiness?.rendererReady),
    undefined,
    { timeout: 60000 }
  );
  const wallClockStartupMs = Date.now() - startedAt;
  const state = await page.evaluate(() => globalThis.PrehistoricRushHost.getState());
  const startupMs = Number(state.performance?.startupMs ?? wallClockStartupMs);

  assert.ok(startupMs < 60000, `production startup must complete under 60 seconds, observed ${startupMs}ms`);
  assert.ok(wallClockStartupMs < 60000, `browser wall-clock startup must complete under 60 seconds, observed ${wallClockStartupMs}ms`);
  assert.equal(state.streamingReadiness.foundationReady, true, "Foundation must be ready at playable entry");
  assert.equal(state.streamingReadiness.rendererReady, true, "local terrain ring must be ready at playable entry");
  assert.equal(state.streamingReadiness.vegetationReady, true, "tree fidelity packages must be admitted at playable entry");
  assert.ok(state.rendering.terrainPatchCount >= 9, "playable terrain uses the local 3x3 Foundation ring");
  assert.ok(state.rendering.terrainPatchCount <= 25, "startup must not recreate the old full-world terrain mesh");
  assert.equal(state.versions.nexus, "main", "production intentionally follows NexusEngine/main");
  assert.ok(state.versions.nexusValidatedCommit, "production records the exact validated Nexus SHA");
  assert.ok(state.compute?.selected?.backend, "Compute Host must select an execution backend");
  assert.deepEqual(pageErrors, [], "production game must have no page errors");
  assert.deepEqual(consoleErrors, [], "production game must have no console errors");

  const result = {
    status: "PASS",
    startupMs,
    wallClockStartupMs,
    startupBudgetMs: 60000,
    terrainPatchCount: state.rendering.terrainPatchCount,
    activeForestPatches: state.rendering.activeForestPatches,
    backgroundForestPending: state.streamingReadiness.backgroundForestPending,
    computeBackend: state.compute.selected.backend,
    computeProviders: state.compute.providers.map((provider) => ({ id: provider.id, family: provider.family, backend: provider.backend })),
    webgpuAdapterReady: state.compute.webgpuAdapterReady,
    nexus: state.versions.nexus,
    nexusValidatedCommit: state.versions.nexusValidatedCommit,
    pageErrors,
    consoleErrors
  };
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
