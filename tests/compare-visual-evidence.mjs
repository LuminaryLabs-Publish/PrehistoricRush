import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const RUN_ID = "2026-08-09-prehistoric-headless-visual-upgrade";
const root = path.resolve(process.env.PREHISTORIC_EVIDENCE_DIR ?? `.agent/evidence/${RUN_ID}`);

async function json(...parts) {
  return JSON.parse(await readFile(path.join(root, ...parts), "utf8"));
}

const beforeSummary = await json("before", "browser-summary.json");
const afterSummary = await json("after", "browser-summary.json");
assert.equal(beforeSummary.status, "PASS");
assert.equal(afterSummary.status, "PASS");
assert.equal(beforeSummary.gameplayProbe.skipped, true, "historical production game boot is intentionally excluded from the baseline");
assert.equal(afterSummary.gameplayProbe.skipped, false, "current main production game must run live validation");

const beforeCanopy = await json("canopy-lab", "before.metrics.json");
const afterCanopy = await json("canopy-lab", "after.metrics.json");
const beforeTree = await json("tree-lab", "before.metrics.json");
const afterTree = await json("tree-lab", "after.metrics.json");
const beforeRace = await json("racing-line", "before.metrics.json");
const afterRace = await json("racing-line", "after.metrics.json");

assert.ok(afterCanopy.foliageCards > beforeCanopy.foliageCards, "canopy lab must gain visible foliage mass");
assert.ok(afterTree.foliageCards > beforeTree.foliageCards, "12-species tree lab must gain foliage mass");
assert.ok(afterRace.foliageCards > beforeRace.foliageCards, "racing-line forest must gain foliage mass");
assert.equal(afterCanopy.growthValidation.valid, true);
assert.equal(afterTree.growthValidation.valid, true);
assert.equal(afterRace.growthValidation.valid, true);

const result = {
  status: "PASS",
  canopyFoliageCards: { before: beforeCanopy.foliageCards, after: afterCanopy.foliageCards },
  treeLabFoliageCards: { before: beforeTree.foliageCards, after: afterTree.foliageCards },
  racingLineFoliageCards: { before: beforeRace.foliageCards, after: afterRace.foliageCards },
  currentGameplayFrameTimeP95Ms: afterSummary.gameplayProbe.frameTimeP95Ms,
  liveFidelityPackages: afterSummary.gameplayProbe.treeFidelity.packageCount,
  liveFoliageOverflow: afterSummary.gameplayProbe.lushFoliage.overflow,
  note: "Current-main frame time is recorded as a CI regression proxy; GitHub Actions is not a physical MacBook Air benchmark."
};

console.log(JSON.stringify(result, null, 2));
