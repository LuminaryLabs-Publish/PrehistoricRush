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
  const image = evidenceFile(phase, "foundation-gate.png");
  const metrics = evidenceFile(phase, "foundation-gate.json");
  if (await exists(image)) captures.push({ id: `foundation-gate:${phase}`, kind: "screenshot", path: path.relative(evidenceRoot, image) });
  if (await exists(metrics)) captures.push({ id: `foundation-gate:${phase}:metrics`, kind: "metrics", path: path.relative(evidenceRoot, metrics) });
  return { ok: captures.length >= 1, phase, captures };
}

const adapter = {
  id: "prehistoric-rush-foundation-gate-adapter",
  async read() {
    const after = await json(evidenceFile("after", "foundation-gate.json"));
    return {
      ok: true,
      scene: { id: "prehistoric-rush-foundation-gate" },
      hierarchy: { core: "NexusEngine", product: "PrehistoricRush", renderer: "Three" },
      runtime: {
        validatedCommit,
        workflowRunId,
        pagesPass,
        nexus: after.nexus,
        terrainAuthority: after.terrainAuthority,
        vegetationEnabled: after.vegetationEnabled,
        landformCount: after.landformCount,
        traversalDistance: after.traversalDistance
      }
    };
  },
  async capture({ phase }) {
    return captureManifest(phase);
  },
  async plan({ goal }) {
    return {
      id: `${RUN_ID}:foundation-final-proof`,
      ok: Boolean(goal),
      commands: [
        { action: "validation.determinism.verify", target: "foundation-samples" },
        { action: "validation.continuity.verify", target: "foundation-cell-seams" },
        { action: "validation.gameplay.verify", target: "0-500m-foundation-playthrough" },
        { action: "validation.deployment.verify", target: "github-pages-main" }
      ],
      notes: ["Gate 1 evidence only: vegetation remains disabled until Foundation terrain quality is accepted."]
    };
  },
  async validate({ issues }) {
    const required = [
      evidenceFile("before", "foundation-gate.json"),
      evidenceFile("after", "foundation-gate.json"),
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
    return {
      ok: true,
      status: "completed",
      runId: workflowRunId,
      before: await json(evidenceFile("before", "foundation-gate.json")),
      after: await json(evidenceFile("after", "foundation-gate.json")),
      differences: await json(evidenceFile("after", "observed-differences.json")),
      pagesPass
    };
  },
  async verify({ observation }) {
    const after = observation.after;
    const checks = [
      ["before-evidence", observation.before.status === "PASS"],
      ["after-evidence", after.status === "PASS"],
      ["nexus-main", after.nexus === "main"],
      ["foundation-authority", after.terrainAuthority === "n:world:foundation"],
      ["vegetation-off", after.vegetationEnabled === false],
      ["landforms", Number(after.landformCount) >= 6],
      ["500m-traversal", Number(after.traversalDistance) >= 500],
      ["x-seam", Number(after.seamDeltas?.x) < 0.5],
      ["z-seam", Number(after.seamDeltas?.z) < 0.5],
      ["page-errors", (after.pageErrors ?? []).length === 0],
      ["console-errors", (after.consoleErrors ?? []).length === 0],
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
        foundation: after,
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
        { key: "terrainAuthority", before: null, after: differences.terrainAuthority ?? "n:world:foundation" },
        { key: "traversalDistance", before: null, after: differences.traversalDistance ?? null },
        { key: "vegetationEnabled", before: true, after: differences.vegetationEnabled ?? false }
      ],
      visual: [{ beforeCaptures: captureBefore.captures?.length ?? 0, afterCaptures: captureAfter.captures?.length ?? 0 }],
      regressions: [],
      unverifiedClaims: ["Visual prehistoric-landscape quality still requires human Gate 1 inspection; CI proves authority, determinism, continuity, and traversal only."]
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
