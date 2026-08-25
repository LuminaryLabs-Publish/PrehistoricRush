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
const productionScreenshotFile = path.join(evidenceRoot, "production-restored.png");
const worldBeforeScreenshotFile = path.join(evidenceRoot, "world-before.png");
const worldAfterScreenshotFile = path.join(evidenceRoot, "world-after-movement.png");
const raceBeforeScreenshotFile = path.join(evidenceRoot, "race-before.png");
const raceAfterScreenshotFile = path.join(evidenceRoot, "race-after.png");
const PRODUCTION_STARTUP_BUDGET_MS = 60000;
const pageErrors = [];
const consoleErrors = [];

await mkdir(evidenceRoot, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"]
});

async function waitForSemanticHost(page, attempts = 360) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
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

  const initialUrl = phase === "after" ? `${baseUrl}/game.html?diagnostic=foundation` : `${baseUrl}/game.html`;
  await page.goto(initialUrl, { waitUntil: "domcontentloaded", timeout: 120000 });

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
    assert.equal(initial.rendering.diagnosticFoundationOnly, true, "Gate 1 must use explicit Foundation diagnostic mode");
    assert.equal(initial.rendering.vegetationEnabled, false, "Foundation diagnostic keeps renderer vegetation off");
    assert.equal(initial.vegetation.enabled, false, "Foundation diagnostic keeps vegetation off globally");
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

    assert.deepEqual(pageErrors, [], `Foundation diagnostic page errors: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors, [], `Foundation diagnostic console errors: ${consoleErrors.join(" | ")}`);

    pageErrors.length = 0;
    consoleErrors.length = 0;
    const productionNavigationStartedAt = performance.now();
    await page.goto(`${baseUrl}/game.html?production-validation=1`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await waitForSemanticHost(page, 480);
    const productionHostObservedMs = performance.now() - productionNavigationStartedAt;
    const playable = await page.evaluate(() => globalThis.PrehistoricRushHost.getState());
    assert.ok(playable.performance.startupMs < PRODUCTION_STARTUP_BUDGET_MS, `Production playable startup took ${playable.performance.startupMs}ms`);
    assert.equal(playable.performance.withinStartupBudget, true, "Production playable startup must remain under 60 seconds");
    assert.ok(productionHostObservedMs < PRODUCTION_STARTUP_BUDGET_MS, `Browser observed production host after ${productionHostObservedMs}ms`);
    assert.equal(playable.streamingReadiness.rendererReady, true, "Playable host requires the 3x3 terrain ring");
    assert.equal(playable.versions.nexus, "main", "Production must follow mutable Nexus main");
    assert.equal(playable.versions.nexusValidatedCommit.length, 40, "Production must record the exact validated Nexus SHA");

    await page.waitForFunction(() => {
      const state = globalThis.PrehistoricRushHost.getState();
      return state.rendering.treeFidelityStatus === "ready"
        && state.treeFidelity.packageCount === 12
        && state.rendering.activeForestPatches === state.rendering.forestTargetPatchCount
        && state.streamingReadiness.backgroundForestPending === 0;
    }, null, { timeout: 60000 });
    const raceBefore = await page.evaluate(() => globalThis.PrehistoricRushHost.getState());
    const worldBefore = raceBefore.worldUpdate;
    assert.equal(worldBefore.worldId, raceBefore.world.recipe.id, "World update diagnostics must identify the selected world.");
    assert.equal(worldBefore.worldRevision, raceBefore.world.recipe.revision, "World update diagnostics must identify the recipe revision.");
    assert.equal(worldBefore.terrainPatchIds.length, 9, "Race must begin with a complete active terrain ring.");
    assert.equal(worldBefore.streamingHoleCount, 0, "Race must begin without terrain streaming holes.");
    assert.equal(raceBefore.playerPresentation, "procedural-skinned-raptor", "Race must render the selected character.");
    assert.equal(raceBefore.rendering.courseVisible, true, "Race must render the procedural course.");
    assert.equal(await page.locator('[data-race-screen="true"]').count(), 1, "Race screen must be present.");
    assert.equal(await page.locator('[data-race-hud="true"]').count(), 1, "Race HUD must be present.");
    assert.equal(await page.locator('[aria-label*="classification tablet"]').count(), 0, "Character selection card must not appear during the race.");
    await page.screenshot({ path: worldBeforeScreenshotFile, fullPage: true });
    await page.screenshot({ path: raceBeforeScreenshotFile, fullPage: true });

    await page.keyboard.press("Enter");
    await page.waitForFunction(() => document.body.dataset.raceStatus === "game", null, { timeout: 15000 });
    const started = await page.evaluate(() => globalThis.PrehistoricRushHost.getState());
    await page.keyboard.down("ArrowUp");
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(5000);
    await page.keyboard.up("ArrowUp");
    await page.keyboard.up("ArrowRight");
    const raceAfter = await page.evaluate(() => globalThis.PrehistoricRushHost.getState());
    const worldAfter = raceAfter.worldUpdate;
    assert.ok(raceAfter.game.run.distance > started.game.run.distance, "Character must move along the track after input.");
    assert.ok(worldAfter.focusUpdateCount > worldBefore.focusUpdateCount, "World focus must update after the character crosses a streaming cell.");
    assert.notEqual(worldAfter.focusCell, worldBefore.focusCell, "World focus cell must change during traversal.");
    assert.ok(worldAfter.terrainPatchIds.length >= 9, "Moving race must retain a complete active terrain ring.");
    assert.equal(new Set(worldAfter.terrainPatchIds).size, worldAfter.terrainPatchIds.length, "Moving race terrain patches must remain unique.");
    assert.ok(worldAfter.activeForestPatchIds.length > 0, "Moving race must retain active forest patches.");
    assert.equal(worldAfter.streamingHoleCount, 0, "Moving race must not expose terrain streaming holes.");
    assert.ok(Math.abs(worldAfter.playerWorldPosition.z - raceAfter.game.run.z) < 0.001, "World diagnostics must track the player world position.");
    assert.notDeepEqual(raceAfter.camera, started.camera, "Camera must follow the moving character.");
    assert.equal(raceAfter.playerPresentation, "procedural-skinned-raptor", "Moving race must retain the selected character.");
    assert.equal(raceAfter.rendering.courseVisible, true, "Moving race must retain the procedural course.");
    await page.screenshot({ path: worldAfterScreenshotFile, fullPage: true });
    await page.screenshot({ path: raceAfterScreenshotFile, fullPage: true });

    const production = raceAfter;
    assert.equal(production.rendering.terrainAuthority, "n:world:foundation", "Production must retain Foundation terrain authority");
    assert.equal(production.rendering.diagnosticFoundationOnly, false, "Normal production must not use terrain-only diagnostics");
    assert.equal(production.vegetation.enabled, true, "Normal production must restore vegetation");
    assert.equal(production.rendering.treeFidelityStatus, "ready", "Tree Fidelity must become ready in the background");
    assert.equal(production.rendering.treeFidelityError, null, "Background presentation must not fail silently");
    assert.equal(production.treeFidelity.packageCount, 12, "Normal production must load all 12 Tree Fidelity species");
    assert.equal(production.rendering.activeForestPatches, 25, "Normal production must retain the full 5x5 forest target");
    assert.equal(production.streamingReadiness.backgroundForestPending, 0, "Full local forest must eventually settle");
    assert.ok(production.treeFidelity.treeCount > 0, "Normal production must render Foundation-positioned trees");
    assert.ok(production.rendering.grassCount > 0, "Normal production must restore grass");
    assert.equal(production.playerPresentation, "procedural-skinned-raptor", "Normal production must restore the skinned procedural raptor");
    assert.ok(production.world.ecology.length >= 3, "Normal production must compose Nexus Ecology features");
    assert.ok(production.world.hydrology.length >= 1, "Normal production must compose Nexus Hydrology features");
    assert.ok(production.world.atmosphere.length >= 2, "Normal production must compose Nexus Atmosphere features");
    assert.ok(production.game.pickups.total > 0, "Normal production must restore shard pickups");
    assert.deepEqual(pageErrors, [], `Production page errors: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors, [], `Production console errors: ${consoleErrors.join(" | ")}`);
    await page.screenshot({ path: productionScreenshotFile, fullPage: true });

    const finalState = await page.evaluate(() => globalThis.PrehistoricRushHost.getState());
    const evidence = {
      status: "PASS",
      phase: "after",
      nexus: initial.versions.nexus,
      nexusValidatedCommit: finalState.versions.nexusValidatedCommit,
      terrainAuthority: initial.rendering.terrainAuthority,
      vegetationEnabled: initial.vegetation.enabled,
      landformCount: initial.world.landforms.length,
      traversalDistance: traversal.distance,
      seamDeltas: {
        x: Math.abs(seamSamples.xLeft - seamSamples.xRight),
        z: Math.abs(seamSamples.zNear - seamSamples.zFar)
      },
      deterministicSamples: beforeReload,
      production: {
        terrainAuthority: finalState.rendering.terrainAuthority,
        vegetationEnabled: finalState.vegetation.enabled,
        treeFidelityPackageCount: finalState.treeFidelity.packageCount,
        treeCount: finalState.treeFidelity.treeCount,
        grassCount: finalState.rendering.grassCount,
        activeForestPatches: finalState.rendering.activeForestPatches,
        forestTargetPatchCount: finalState.rendering.forestTargetPatchCount,
        playerPresentation: finalState.playerPresentation,
        ecologyFeatureCount: finalState.world.ecology.length,
        hydrologyFeatureCount: finalState.world.hydrology.length,
        atmosphereFeatureCount: finalState.world.atmosphere.length,
        shardCount: finalState.game.pickups.total,
        performance: {
          browserObservedHostReadyMs: productionHostObservedMs,
          ...finalState.performance,
          rendering: finalState.rendering.performance
        }
      },
      race: {
        before: {
          distance: raceBefore.game.run.distance,
          playerPresentation: raceBefore.playerPresentation,
          courseVisible: raceBefore.rendering.courseVisible,
          camera: raceBefore.camera
        },
        after: {
          distance: raceAfter.game.run.distance,
          playerPresentation: raceAfter.playerPresentation,
          courseVisible: raceAfter.rendering.courseVisible,
          camera: raceAfter.camera
        },
        screenshots: ["race-before.png", "race-after.png"],
        characterCardPresent: false,
        movementObserved: raceAfter.game.run.distance > started.game.run.distance,
        cameraFollowObserved: JSON.stringify(raceAfter.camera) !== JSON.stringify(started.camera)
      },
      worldUpdate: {
        before: {
          worldId: worldBefore.worldId,
          worldRevision: worldBefore.worldRevision,
          focusCell: worldBefore.focusCell,
          focusUpdateCount: worldBefore.focusUpdateCount,
          terrainPatchIds: worldBefore.terrainPatchIds,
          activeForestPatchIds: worldBefore.activeForestPatchIds,
          streamingHoleCount: worldBefore.streamingHoleCount
        },
        after: {
          worldId: worldAfter.worldId,
          worldRevision: worldAfter.worldRevision,
          focusCell: worldAfter.focusCell,
          focusUpdateCount: worldAfter.focusUpdateCount,
          terrainPatchIds: worldAfter.terrainPatchIds,
          activeForestPatchIds: worldAfter.activeForestPatchIds,
          streamingHoleCount: worldAfter.streamingHoleCount,
          playerWorldPosition: worldAfter.playerWorldPosition
        },
        screenshots: ["world-before.png", "world-after-movement.png"],
        focusChanged: worldAfter.focusCell !== worldBefore.focusCell,
        noStreamingHoles: worldAfter.streamingHoleCount === 0
      },
      pageErrors,
      consoleErrors
    };
    await writeFile(evidenceFile, `${JSON.stringify(evidence, null, 2)}\n`);
    console.log(JSON.stringify(evidence, null, 2));
  }
} finally {
  await browser.close();
}
