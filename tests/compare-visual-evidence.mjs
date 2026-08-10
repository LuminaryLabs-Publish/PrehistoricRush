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
  gameplayFrameTimeP95Ms: {
    before: beforeSummary.gameplayProbe.frameTimeP95Ms,
    after: afterSummary.gameplayProbe.frameTimeP95Ms
  },
  note: "Frame time is recorded for regression review; GitHub Actions is not a physical MacBook Air benchmark."
};

console.log(JSON.stringify(result, null, 2));
