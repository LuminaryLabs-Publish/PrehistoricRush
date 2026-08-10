import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const RUN_ID = "2026-08-09-prehistoric-headless-visual-upgrade";
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

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
const page = await context.newPage();
const browserErrors = [];
page.on("pageerror", (error) => browserErrors.push({ type: "pageerror", message: error.message }));
page.on("console", (message) => {
  if (message.type() === "error") browserErrors.push({ type: "console", message: message.text() });
});

try {
  await page.goto(`${baseUrl}/validation/forest-lab.html?scene=tree-lab`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForFunction(() => globalThis.__PREHISTORIC_FOREST_LAB_READY__ === true, null, { timeout: 120_000 });

  const sceneMetrics = {};
  for (const [sceneId, directory] of scenes) {
    const metrics = await page.evaluate(async (id) => globalThis.__setForestLabScene(id), sceneId);
    const sceneDirectory = path.join(evidenceRoot, directory);
    await mkdir(sceneDirectory, { recursive: true });
    await page.screenshot({ path: path.join(sceneDirectory, "after.png"), fullPage: true });
    await writeJson(path.join(sceneDirectory, "after.metrics.json"), metrics);
    sceneMetrics[sceneId] = metrics;
    assert.equal(metrics.growthValidation.valid, true, `${sceneId} growth validation`);
    assert.equal(metrics.speciesCount, 12, `${sceneId} species contract`);
  }

  const gamePage = await context.newPage();
  const gameErrors = [];
  gamePage.on("pageerror", (error) => gameErrors.push({ type: "pageerror", message: error.message }));
  gamePage.on("console", (message) => {
    if (message.type() === "error") gameErrors.push({ type: "console", message: message.text() });
  });
  await gamePage.goto(`${baseUrl}/game.html`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await gamePage.waitForFunction(
    () => Boolean(globalThis.PrehistoricRushHost) && Boolean(document.querySelector("canvas")),
    null,
    { timeout: 120_000 }
  );

  await gamePage.keyboard.press("Space");
  await gamePage.waitForTimeout(1200);
  await gamePage.keyboard.down("w");
  await gamePage.waitForTimeout(900);
  await gamePage.keyboard.up("w");
  await gamePage.keyboard.press("ArrowLeft");
  await gamePage.waitForTimeout(500);
  await gamePage.keyboard.press("Space");
  await gamePage.waitForTimeout(900);

  const gameplayProbe = await gamePage.evaluate(async () => {
    const frameTimes = [];
    let previous = performance.now();
    for (let index = 0; index < 120; index += 1) {
      await new Promise((resolve) => requestAnimationFrame((now) => {
        frameTimes.push(now - previous);
        previous = now;
        resolve();
      }));
    }
    const ordered = frameTimes.slice().sort((a, b) => a - b);
    const p95 = ordered[Math.min(ordered.length - 1, Math.floor(ordered.length * 0.95))] ?? 0;
    const host = globalThis.PrehistoricRushHost;
    return {
      hostPresent: Boolean(host),
      canvasPresent: Boolean(document.querySelector("canvas")),
      canvasCount: document.querySelectorAll("canvas").length,
      bodyText: document.body.innerText.slice(0, 1200),
      frameTimeAverageMs: frameTimes.reduce((sum, value) => sum + value, 0) / Math.max(1, frameTimes.length),
      frameTimeP95Ms: p95,
      frameSamples: frameTimes.length
    };
  });

  const gameDirectory = path.join(evidenceRoot, "game");
  await mkdir(gameDirectory, { recursive: true });
  await gamePage.screenshot({ path: path.join(gameDirectory, "production-game.png"), fullPage: true });
  await writeJson(path.join(gameDirectory, "gameplay-probe.json"), gameplayProbe);
  await writeJson(path.join(gameDirectory, "browser-errors.json"), gameErrors);

  assert.equal(gameplayProbe.hostPresent, true, "production game exposes PrehistoricRushHost");
  assert.equal(gameplayProbe.canvasPresent, true, "production game renders a canvas");
  assert.equal(gameErrors.length, 0, "production game browser errors");
  assert.equal(browserErrors.length, 0, "forest lab browser errors");

  const summary = {
    status: "PASS",
    runId: RUN_ID,
    viewport,
    scenes: Object.keys(sceneMetrics),
    browserErrors,
    gameErrors,
    gameplayProbe,
    limits: {
      performance: "GitHub Actions Chromium is a repeatable regression proxy, not a physical MacBook Air benchmark."
    }
  };
  await writeJson(path.join(evidenceRoot, "after", "browser-summary.json"), summary);
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
}
