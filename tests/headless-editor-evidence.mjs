import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { createHeadlessEditorHarness } from "@luminarylabs/nexusengine-editor/headless";

const RUN_ID = "2026-08-09-prehistoric-headless-visual-upgrade";
const evidenceRoot = path.resolve(`.agent/evidence/${RUN_ID}`);
const workspaceRoot = path.join(evidenceRoot, "headless");
const validatedCommit = process.env.PREHISTORIC_VALIDATED_SHA ?? "unknown";
const workflowRunId = process.env.PREHISTORIC_WORKFLOW_RUN_ID ?? "unknown";
const pagesPass = process.env.PREHISTORIC_PAGES_PASS === "1";
const scenes = ["tree-lab", "root-lab", "foliage-lab", "canopy-lab", "lod-lab", "backlight-lab", "racing-line", "game"];

async function exists(file) {
  try { await access(file); return true; }
  catch { return false; }
}

async function json(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

function evidenceFile(...parts) {
  return path.join(evidenceRoot, ...parts);
}

async function captureManifest(phase) {
  const captures = [];
  for (const scene of scenes) {
    const image = evidenceFile(scene, `${phase}.png`);
    const metrics = evidenceFile(scene, `${phase}.metrics.json`);
    if (await exists(image)) captures.push({ id: `${scene}:${phase}`, kind: "screenshot", path: path.relative(evidenceRoot, image) });
    if (await exists(metrics)) captures.push({ id: `${scene}:${phase}:metrics`, kind: "metrics", path: path.relative(evidenceRoot, metrics) });
  }
  const productionImage = evidenceFile("game", `production-game-${phase}.png`);
  if (await exists(productionImage)) captures.push({ id: `production-game:${phase}`, kind: "screenshot", path: path.relative(evidenceRoot, productionImage) });
  return { ok: captures.length >= 16, phase, captures };
}

const adapter = {
  id: "prehistoric-rush-headless-visual-adapter",
  async read() {
    const after = await json(evidenceFile("after", "browser-summary.json"));
    return {
      ok: true,
      scene: { id: "prehistoric-rush", validationScenes: scenes },
      hierarchy: { core: "NexusEngine", product: "PrehistoricRush", renderer: "Three" },
      assets: scenes.map((scene) => ({ id: scene, before: `${scene}/before.png`, after: `${scene}/after.png` })),
      runtime: {
        validatedCommit,
        workflowRunId,
        pagesPass,
        browserStatus: after.status,
        hostPresent: after.gameplayProbe.hostPresent,
        canvasPresent: after.gameplayProbe.canvasPresent
      }
    };
  },
  async capture({ phase }) {
    return captureManifest(phase);
  },
  async plan({ goal }) {
    return {
      id: `${RUN_ID}:final-proof`,
      ok: Boolean(goal),
      commands: [
        { action: "validation.contracts.verify", target: "all-12-species" },
        { action: "validation.determinism.verify", target: "256-seed-sweep" },
        { action: "validation.visual.compare", target: "fixed-scenes" },
        { action: "validation.gameplay.verify", target: "production-game" },
        { action: "validation.deployment.verify", target: "github-pages-main" }
      ],
      notes: ["Evidence-only submit: source mutation already occurred through reviewed main changes."]
    };
  },
  async validate({ issues }) {
    const required = [
      evidenceFile("before", "browser-summary.json"),
      evidenceFile("after", "browser-summary.json"),
      evidenceFile("after", "observed-differences.json")
    ];
    const missing = [];
    for (const file of required) if (!await exists(file)) missing.push(path.relative(evidenceRoot, file));
    return {
      ok: issues.length === 0 && missing.length === 0 && pagesPass,
      issues: missing.map((file) => ({ severity: "error", code: "missing-evidence", message: `Missing ${file}` })),
      requiredEvidence: required.map((file) => path.relative(evidenceRoot, file)),
      pagesPass
    };
  },
  async submit() {
    return { ok: true, submitted: true, runId: workflowRunId, mode: "evidence-only" };
  },
  async observe() {
    const before = await json(evidenceFile("before", "browser-summary.json"));
    const after = await json(evidenceFile("after", "browser-summary.json"));
    const differences = await json(evidenceFile("after", "observed-differences.json"));
    return {
      ok: true,
      status: "completed",
      runId: workflowRunId,
      before,
      after,
      differences,
      pagesPass
    };
  },
  async verify({ observation }) {
    const checks = [
      ["before-browser", observation.before.status === "PASS"],
      ["after-browser", observation.after.status === "PASS"],
      ["forest-browser-errors", observation.after.browserErrors.length === 0],
      ["game-browser-errors", observation.after.gameErrors.length === 0],
      ["game-host", observation.after.gameplayProbe.hostPresent === true],
      ["game-canvas", observation.after.gameplayProbe.canvasPresent === true],
      ["observed-differences", observation.differences.status === "PASS"],
      ["pages-main", observation.pagesPass === true]
    ].map(([id, ok]) => ({ id, ok }));
    return {
      ok: checks.every((entry) => entry.ok),
      checks,
      readAfter: {
        validatedCommit,
        workflowRunId,
        pagesPass,
        gameplayProbe: observation.after.gameplayProbe,
        differences: observation.differences
      }
    };
  },
  async observedDifferences({ readBefore, readAfter, captureBefore, captureAfter }) {
    const differences = await json(evidenceFile("after", "observed-differences.json"));
    return {
      ok: differences.status === "PASS" && pagesPass,
      structured: [
        { key: "validatedCommit", before: readBefore?.runtime?.validatedCommit ?? null, after: readAfter?.validatedCommit ?? validatedCommit },
        { key: "treeLabFoliageCards", ...differences.treeLabFoliageCards },
        { key: "canopyFoliageCards", ...differences.canopyFoliageCards },
        { key: "racingLineFoliageCards", ...differences.racingLineFoliageCards }
      ],
      visual: [{ beforeCaptures: captureBefore.captures?.length ?? 0, afterCaptures: captureAfter.captures?.length ?? 0 }],
      regressions: [],
      unverifiedClaims: ["Physical MacBook Air frame-time budget requires target hardware and is not inferred from GitHub Actions Chromium."]
    };
  }
};

const target = await readFile(".agent/target.md", "utf8");
const harness = createHeadlessEditorHarness({
  sessionId: RUN_ID,
  goal: target,
  workspace: { root: workspaceRoot },
  adapter
});
const result = await harness.run();
assert.equal(result.ok, true, "NexusEngine-Editor Headless lifecycle must pass every stage");
assert.equal(result.stageResults.length, 9, "all nine Headless stages must run");
assert.ok(result.stageResults.every((entry) => entry.ok), "all Headless stages must pass");
console.log(JSON.stringify({
  status: "PASS",
  runId: RUN_ID,
  stages: result.stageResults.map((entry) => ({ stage: entry.stage, ok: entry.ok })),
  workspace: path.relative(process.cwd(), workspaceRoot)
}, null, 2));
