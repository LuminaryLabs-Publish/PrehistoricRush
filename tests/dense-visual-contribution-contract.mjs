import assert from "node:assert/strict";
import fs from "node:fs";
import { createPrehistoricRushDenseVisualContributions } from "../src/domains/prehistoric-rush/dense-world-visual-contributions.js";

const source = fs.readFileSync(new URL("../src/domains/prehistoric-rush/dense-world-visual-contributions.js", import.meta.url), "utf8");
for (const forbidden of ["wgsl", "gpudevice", "gpubuffer", "bindgroup", "commandencoder"]) {
  assert.equal(source.toLowerCase().includes(forbidden), false, `portable contribution source must not contain ${forbidden}`);
}

const defineVisualContribution = (input) => Object.freeze(structuredClone(input));
const composeVisualContributions = (...items) => Object.freeze(items.flat().sort((a, b) => a.semanticId.localeCompare(b.semanticId)));
const contributions = createPrehistoricRushDenseVisualContributions({
  defineVisualContribution,
  composeVisualContributions,
  recipe: { id: "synthetic-prehistoric" },
  denseState: { terrainPatchCount: 9, treeCount: 42, treePackageCount: 12, forestPatchCount: 25 }
});

assert.equal(contributions.length, 3);
assert.deepEqual(contributions.map((item) => item.sourceDomain).sort(), ["n:world:feature:ecology", "n:world:feature:ecology", "n:world:terrain"]);
assert.equal(contributions.find((item) => item.semanticId.includes("tree-fidelity")).transforms.count, 42);
assert.equal(contributions.find((item) => item.semanticId.includes("terrain")).generation.patchCount, 9);
console.log("PrehistoricRush portable dense visual contribution contract passed.");
