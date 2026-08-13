import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const phase = process.env.PREHISTORIC_EVIDENCE_PHASE ?? "after";
const baseUrl = process.env.PREHISTORIC_BASE_URL ?? "http://127.0.0.1:4173";
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const evidenceRoot = path.join(repositoryRoot, ".agent", "evidence", "2026-08-09-prehistoric-headless-visual-upgrade", phase);
const evidenceFile = path.join(evidenceRoot, "foundation-gate.json");
const screenshotFile = path.join(evidenceRoot, "foundation-gate.png");
const pageErrors = [];
const consoleErrors = [];

await mkdir(evidenceRoot, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"]
});

async function waitForSemanticHost(page) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const state = await page.evaluate(() => ({
      ready: Boolean(globalThis.PrehistoricRushHost) && Boolean(document.querySelector("canvas")),
      body: document.body?.innerText?.slice(0, 1200) ?? ""
    }));
    if (state.ready) return;
    if (pageErrors.length || consoleErrors.length || state.body.includes("Could not start PrehistoricRush")) {
      throw new Error([
        "Semantic PrehistoricRush startup failed.",
        ...pageErrors.map((value) => `pageerror: ${value}`),
        ...consoleErrors.map((value) => `console: ${value}`),
        `body: ${state.body}`
      ].join("\n"));
    }
    await page.waitForTimeout(250);
  }
  const body = await page.evaluate(() => document.body?.innerText?.slice(0, 1200) ?? "");
  throw new Error(`Semantic PrehistoricRush host did not become ready.\npageErrors=${pageErrors.join(" | ")}\nconsoleErrors=${consoleErrors.join(" | ")}\nbody=${body}`);
}

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(`${baseUrl}/game.html`, { waitUntil: "domcontentloaded", timeout: 120000 });

  if (phase === "before") {
    await page.waitForSelector("canvas", { timeout: 120000 });
    await page.screenshot({ path: screenshotFile, fullPage: true });
    const evidence = {
      status: "PASS",
      phase: "before",
      purpose: "Historical visual baseline only; semantic Foundation assertions apply to current main.",
      pageErrors,
      consoleErrors
    };
    await writeFile(evidenceFile, `${JSON.stringify(evidence, null, 2)}\n`);
    console.log(JSON.stringify(evidence, null, 2));
  } else {
    await waitForSemanticHost(page);

    const initial = await page.evaluate(() => globalThis.PrehistoricRushHost.getState());
    assert.equal(initial.rendering.terrainAuthority, "n:world:foundation", "Rendering must consume Nexus World Foundation");
    assert.equal(initial.rendering.vegetationEnabled, false, "Gate 1 keeps renderer vegetation off");
    assert.equal(initial.vegetation.enabled, false, "Gate 1 keeps vegetation off globally");
    assert.equal(initial.streamingReadiness.foundationReady, true, "Foundation must be ready before play");
    assert.ok(initial.world.landforms.length >= 6, "World recipe must project a meaningful landform set");
    assert.equal(initial.versions.nexus, "main", "browser runtime must consume Nexus main");

    const samplePoints = [[0, 0], [64, 160], [96, 300], [192, 420], [-160, 500], [240, 640]];
    const beforeSamples = await page.evaluate((points) => points.map(([x, z]) => globalThis.PrehistoricRushHost.world.sampleElevation(x, z)), samplePoints);
    const repeatedSamples = await page.evaluate((points) => points.map(([x, z]) => globalThis.PrehistoricRushHost.world.sampleElevation(x, z)), samplePoints);
    assert.deepEqual(repeatedSamples, beforeSamples, "Foundation sampling must be deterministic within a run");

    const seamSamples = await page.evaluate(() => {
      const sample = globalThis.PrehistoricRushHost.world.sampleElevation;
      return {
        xLeft: sample(95.999, 300),
        xRight: sample(96.001, 300),
        zNear: sample(120, 383.999),
        zFar: sample(120, 384.001)
      };
    });
    assert.ok(Math.abs(seamSamples.xLeft - seamSamples.xRight) < 0.5, "X cell boundary must be continuous");
    assert.ok(Math.abs(seamSamples.zNear - seamSamples.zFar) < 0.5, "Z cell boundary must be continuous");

    const yawBefore = await page.evaluate(() => globalThis.PrehistoricRushHost.gameplay.getState().yaw);
    await page.keyboard.down("ArrowLeft");
    await page.waitForFunction((yaw) => Math.abs(globalThis.PrehistoricRushHost.gameplay.getState().yaw - yaw) > 0.01, yawBefore, { timeout: 15000 });
    await page.keyboard.up("ArrowLeft");

    await page.keyboard.press("Space");
    await page.waitForFunction(() => globalThis.PrehistoricRushHost.gameplay.getState().jumpHeight > 0, null, { timeout: 15000 });

    const traversal = await page.evaluate(() => {
      const host = globalThis.PrehistoricRushHost;
      host.gameplay.start();
      host.gameplay.setInput({ boost: true, steer: 0 });
      for (let index = 0; index < 1200 && host.gameplay.getState().distance < 500; index += 1) {
        host.gameplay.tick(0.05);
        host.engine.tick(0.05);
      }
      host.gameplay.setInput({ boost: false });
      return host.gameplay.getState();
    });
    assert.ok(traversal.distance >= 500, `Foundation playthrough must reach 500m, got ${traversal.distance}`);
    assert.ok(Number.isFinite(traversal.y), "Player ground elevation must remain finite through 500m");

    await page.waitForTimeout(250);
    await page.screenshot({ path: screenshotFile, fullPage: true });
    const beforeReload = await page.evaluate((points) => points.map(([x, z]) => globalThis.PrehistoricRushHost.world.sampleElevation(x, z)), samplePoints);
    await page.reload({ waitUntil: "domcontentloaded", timeout: 120000 });
    await waitForSemanticHost(page);
    const afterReload = await page.evaluate((points) => points.map(([x, z]) => globalThis.PrehistoricRushHost.world.sampleElevation(x, z)), samplePoints);
    assert.deepEqual(afterReload, beforeReload, "same recipe/seed reload must reproduce identical Foundation elevations");

    assert.deepEqual(pageErrors, [], `browser page errors: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors, [], `browser console errors: ${consoleErrors.join(" | ")}`);

    const finalState = await page.evaluate(() => globalThis.PrehistoricRushHost.getState());
    const evidence = {
      status: "PASS",
      phase: "after",
      nexus: finalState.versions.nexus,
      terrainAuthority: finalState.rendering.terrainAuthority,
      vegetationEnabled: finalState.vegetation.enabled,
      landformCount: finalState.world.landforms.length,
      traversalDistance: traversal.distance,
      seamDeltas: {
        x: Math.abs(seamSamples.xLeft - seamSamples.xRight),
        z: Math.abs(seamSamples.zNear - seamSamples.zFar)
      },
      deterministicSamples: beforeReload,
      pageErrors,
      consoleErrors
    };
    await writeFile(evidenceFile, `${JSON.stringify(evidence, null, 2)}\n`);
    console.log(JSON.stringify(evidence, null, 2));
  }
} finally {
  await browser.close();
}
