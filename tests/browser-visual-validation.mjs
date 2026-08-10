import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const RUN_ID = "2026-08-09-prehistoric-headless-visual-upgrade";
const phase = process.env.PREHISTORIC_EVIDENCE_PHASE === "before" ? "before" : "after";
const baseUrl = process.env.PREHISTORIC_BASE_URL ?? "http://127.0.0.1:4173";
const evidenceRoot = path.resolve(process.env.PREHISTORIC_EVIDENCE_DIR ?? `.agent/evidence/${RUN_ID}`);
const viewport = { width: 1440, height: 900 };
const scenes = [
  ["tree-lab", "tree-lab"],
  ["root-lab", "root-lab"],
  ["foliage-lab", "foliage-lab"],
  ["canopy-lab", "canopy-lab"],
  ["lod-lab", "lod-lab"],
  ["backlight-lab", "backlight-lab"],
  ["racing-line", "racing-line"],
  ["full-game-seed", "game"]
];

async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--enable-unsafe-swiftshader"
  ]
});

let labContext = null;
let gameContext = null;
const browserErrors = [];
const gameErrors = [];

try {
  labContext = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await labContext.newPage();
  page.on("pageerror", (error) => browserErrors.push({ type: "pageerror", message: error.stack || error.message }));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push({ type: "console", message: message.text() });
  });

  await page.goto(`${baseUrl}/validation/forest-lab.html?scene=tree-lab`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForFunction(
    () => globalThis.__PREHISTORIC_FOREST_LAB_READY__ === true || (globalThis.__PREHISTORIC_FOREST_LAB_ERRORS__?.length ?? 0) > 0,
    null,
    { timeout: 180_000 }
  );
  const labState = await page.evaluate(() => ({
    ready: globalThis.__PREHISTORIC_FOREST_LAB_READY__ === true,
    errors: [...(globalThis.__PREHISTORIC_FOREST_LAB_ERRORS__ ?? [])],
    status: document.querySelector("#status")?.innerText ?? ""
  }));
  if (!labState.ready) {
    throw new Error(`Forest lab failed to initialize for ${phase}: ${[...labState.errors, ...browserErrors.map((entry) => entry.message), labState.status].filter(Boolean).join(" | ")}`);
  }

  const sceneMetrics = {};
  for (const [sceneId, directory] of scenes) {
    const metrics = await page.evaluate(async (id) => globalThis.__setForestLabScene(id), sceneId);
    const sceneDirectory = path.join(evidenceRoot, directory);
    await mkdir(sceneDirectory, { recursive: true });
    await page.screenshot({ path: path.join(sceneDirectory, `${phase}.png`), fullPage: true });
    await writeJson(path.join(sceneDirectory, `${phase}.metrics.json`), metrics);
    sceneMetrics[sceneId] = metrics;
    assert.equal(metrics.growthValidation.valid, true, `${sceneId} growth validation`);
    assert.equal(metrics.speciesCount, 12, `${sceneId} species contract`);
  }

  assert.equal(browserErrors.length, 0, "forest lab browser errors");

  // Release all validation-lab WebGL resources before the production game builds
  // its 12 Fidelity packages. Keeping both workloads alive in one SwiftShader
  // context can crash Chromium even though each workload succeeds independently.
  await labContext.close();
  labContext = null;

  let gameplayProbe = {
    skipped: phase === "before",
    reason: phase === "before" ? "Historical baseline uses the fixed Full Game Seed lab; live production runtime validation is current-main only." : null
  };

  if (phase === "after") {
    gameContext = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    const gamePage = await gameContext.newPage();
    gamePage.on("pageerror", (error) => gameErrors.push({ type: "pageerror", message: error.stack || error.message }));
    gamePage.on("console", (message) => {
      if (message.type() === "error") gameErrors.push({ type: "console", message: message.text() });
    });
    await gamePage.goto(`${baseUrl}/game.html`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    try {
      await gamePage.waitForFunction(
        () => Boolean(globalThis.PrehistoricRushHost) && Boolean(document.querySelector("canvas")),
        null,
        { timeout: 360_000 }
      );
    } catch (error) {
      let startupState = { bodyText: "", canvasCount: 0, hostPresent: false };
      try {
        startupState = await gamePage.evaluate(() => ({
          bodyText: document.body.innerText.slice(0, 2000),
          canvasCount: document.querySelectorAll("canvas").length,
          hostPresent: Boolean(globalThis.PrehistoricRushHost)
        }));
      } catch (stateError) {
        startupState = { ...startupState, evaluationError: stateError.message };
      }
      throw new Error(`Production game did not reach host-ready state under software Chromium: ${JSON.stringify(startupState)}; ${error.message}`);
    }

    const readRun = () => gamePage.evaluate(() => {
      const state = globalThis.PrehistoricRushHost?.getState?.() ?? {};
      return structuredClone(state.game?.run ?? null);
    });

    await gamePage.keyboard.press("Space");
    await gamePage.waitForTimeout(300);
    const startedRun = await readRun();

    await gamePage.keyboard.down("w");
    await gamePage.waitForTimeout(900);
    await gamePage.keyboard.up("w");
    const boostedRun = await readRun();

    await gamePage.keyboard.down("ArrowLeft");
    await gamePage.waitForTimeout(300);
    await gamePage.keyboard.up("ArrowLeft");
    const steeredRun = await readRun();

    await gamePage.keyboard.press("Space");
    await gamePage.waitForTimeout(120);
    const jumpedRun = await readRun();
    await gamePage.waitForTimeout(780);

    gameplayProbe = await gamePage.evaluate(async ({ startedRun, boostedRun, steeredRun, jumpedRun }) => {
      const frameTimes = [];
      let previous = performance.now();
      for (let index = 0; index < 30; index += 1) {
        await new Promise((resolve) => requestAnimationFrame((now) => {
          frameTimes.push(now - previous);
          previous = now;
          resolve();
        }));
      }
      const ordered = frameTimes.slice().sort((a, b) => a - b);
      const p95 = ordered[Math.min(ordered.length - 1, Math.floor(ordered.length * 0.95))] ?? 0;
      const host = globalThis.PrehistoricRushHost;
      const state = host?.getState?.() ?? {};
      const run = state.game?.run ?? null;
      return {
        skipped: false,
        hostPresent: Boolean(host),
        canvasPresent: Boolean(document.querySelector("canvas")),
        canvasCount: document.querySelectorAll("canvas").length,
        bodyText: document.body.innerText.slice(0, 1200),
        frameTimeAverageMs: frameTimes.reduce((sum, value) => sum + value, 0) / Math.max(1, frameTimes.length),
        frameTimeP95Ms: p95,
        frameSamples: frameTimes.length,
        game: {
          status: run?.status ?? null,
          distance: run?.distance ?? null,
          speed: run?.speed ?? null,
          yaw: run?.yaw ?? null,
          jumpHeight: run?.jumpHeight ?? null,
          grounded: run?.grounded ?? null
        },
        mechanics: { startedRun, boostedRun, steeredRun, jumpedRun },
        treeFidelity: {
          packageCount: state.treeFidelity?.packageCount ?? null,
          counts: state.treeFidelity?.counts ?? null,
          textureCount: state.treeFidelity?.textureCount ?? null,
          transitioning: state.treeFidelity?.transitioning ?? null,
          exactFrameAck: state.treeFidelity?.exactFrameAck ?? null
        },
        lushFoliage: {
          overflow: state.lushFoliage?.overflow ?? null,
          nearCards: state.lushFoliage?.nearCards ?? null,
          mediumCards: state.lushFoliage?.mediumCards ?? null,
          sourceCards: state.lushFoliage?.sourceCards ?? null
        },
        startup: {
          readiness: state.streamingReadiness ?? null,
          assetStartup: state.assetStartup ?? null
        }
      };
    }, { startedRun, boostedRun, steeredRun, jumpedRun });

    const gameDirectory = path.join(evidenceRoot, "game");
    await mkdir(gameDirectory, { recursive: true });
    await gamePage.screenshot({ path: path.join(gameDirectory, "production-game-after.png"), fullPage: true });
    await writeJson(path.join(gameDirectory, "gameplay-probe-after.json"), gameplayProbe);
    await writeJson(path.join(gameDirectory, "browser-errors-after.json"), gameErrors);

    assert.equal(gameplayProbe.hostPresent, true, "production game exposes PrehistoricRushHost");
    assert.equal(gameplayProbe.canvasPresent, true, "production game renders a canvas");
    assert.equal(gameplayProbe.mechanics.startedRun?.status, "game", "start input enters active gameplay");
    assert.ok(gameplayProbe.mechanics.boostedRun?.distance > gameplayProbe.mechanics.startedRun?.distance, "boost interval advances run distance");
    assert.ok(gameplayProbe.mechanics.boostedRun?.speed > gameplayProbe.mechanics.startedRun?.speed, "boost input raises player speed");
    assert.ok(Math.abs((gameplayProbe.mechanics.steeredRun?.yaw ?? 0) - (gameplayProbe.mechanics.boostedRun?.yaw ?? 0)) > 0.01, "steer input changes player yaw");
    assert.ok((gameplayProbe.mechanics.jumpedRun?.jumpHeight ?? 0) > 0, "jump input raises the player above the ground");
    assert.equal(gameplayProbe.mechanics.jumpedRun?.grounded, false, "jump input enters airborne state");
    assert.equal(gameplayProbe.treeFidelity.packageCount, 12, "production runtime admits all 12 tree Fidelity packages");
    assert.equal(gameplayProbe.lushFoliage.overflow, 0, "target-density production foliage stays within live batch capacity");
    assert.ok(gameplayProbe.treeFidelity.exactFrameAck, "production runtime acknowledges exact generation-bound impostor frames");
    assert.equal(gameErrors.length, 0, "production game browser errors");

    await gameContext.close();
    gameContext = null;
  }

  const summary = {
    status: "PASS",
    runId: RUN_ID,
    phase,
    viewport,
    scenes: Object.keys(sceneMetrics),
    browserErrors,
    gameErrors,
    gameplayProbe,
    limits: {
      performance: "GitHub Actions Chromium is a repeatable regression proxy, not a physical MacBook Air benchmark."
    }
  };
  await writeJson(path.join(evidenceRoot, phase, "browser-summary.json"), summary);
  console.log(JSON.stringify(summary, null, 2));
} finally {
  if (gameContext) await gameContext.close().catch(() => {});
  if (labContext) await labContext.close().catch(() => {});
  await browser.close();
}
