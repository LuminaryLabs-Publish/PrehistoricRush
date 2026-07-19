import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const groundSource = readFileSync(new URL("../src/render/three-production-ground-layer.js", import.meta.url), "utf8");
const legacyProductionSource = readFileSync(new URL("../src/render/three-production-forest-layer.js", import.meta.url), "utf8");
const groundCoverSource = readFileSync(new URL("../src/render/three-ground-cover-layer.js", import.meta.url), "utf8");
const wrapperSource = readFileSync(new URL("../src/render/three-patch-stream-lod-adapter.js", import.meta.url), "utf8");

assert.match(groundSource, /GRASS_VARIANT_COUNT = 6/);
assert.match(groundSource, /const bladeCount = 14 \+ variant \* 3/);
assert.match(groundSource, /suppressLegacyGrass/);
assert.match(groundSource, /production-ground-detail/);
assert.match(groundSource, /treePresentationRetired: true/);
assert.doesNotMatch(groundSource, /patch\.trees/);
assert.doesNotMatch(groundSource, /createTreeProductionRecords/);

assert.match(legacyProductionSource, /createTreeProductionRecords/, "retired implementation remains available for forensic comparison");
assert.doesNotMatch(wrapperSource, /createThreeProductionForestLayer/);
assert.match(wrapperSource, /createThreeProductionGroundLayer/);
assert.match(wrapperSource, /productionCanopyGroups: 0/);
assert.match(wrapperSource, /productionBranchesAndBark: 0/);
assert.match(wrapperSource, /productionGrassClumps/);
assert.match(wrapperSource, /groundSurfaceDetails/);

assert.match(groundCoverSource, /groundCoverMode/);
assert.match(groundCoverSource, /radial-frond/);
assert.match(groundCoverSource, /ground-conforming/);
assert.match(groundCoverSource, /upright-clump/);
assert.match(groundCoverSource, /fern-frond\|palm-frond/);
assert.match(groundCoverSource, /hanging-vine/);

console.log("duplicate tree presentation retired while grass, ground detail, and understory presentation remain active");
