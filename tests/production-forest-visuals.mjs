import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const productionSource = readFileSync(new URL("../src/render/three-production-forest-layer.js", import.meta.url), "utf8");
const groundCoverSource = readFileSync(new URL("../src/render/three-ground-cover-layer.js", import.meta.url), "utf8");
const wrapperSource = readFileSync(new URL("../src/render/three-patch-stream-lod-adapter.js", import.meta.url), "utf8");

assert.match(productionSource, /function productionRecipe/);
assert.match(productionSource, /primary:\s*5/);
assert.match(productionSource, /secondary:\s*2/);
assert.match(productionSource, /canopyGroups:\s*6/);
assert.match(productionSource, /:primary:/);
assert.match(productionSource, /:secondary:/);
assert.match(productionSource, /:root:/);
assert.match(productionSource, /verticalGrain/);
assert.match(productionSource, /float moss/);
assert.match(productionSource, /edge-light/);
assert.match(productionSource, /inner-light/);
assert.match(productionSource, /GRASS_VARIANT_COUNT = 6/);
assert.match(productionSource, /const bladeCount = 14 \+ variant \* 3/);
assert.match(productionSource, /suppressLegacyGrass/);
assert.match(productionSource, /production-ground-detail/);
assert.match(productionSource, /productionCanopyGroups|canopyGroups/);

assert.match(groundCoverSource, /groundCoverMode/);
assert.match(groundCoverSource, /radial-frond/);
assert.match(groundCoverSource, /ground-conforming/);
assert.match(groundCoverSource, /upright-clump/);
assert.match(groundCoverSource, /fern-frond\|palm-frond/);
assert.match(groundCoverSource, /hanging-vine/);

assert.match(wrapperSource, /createThreeProductionForestLayer/);
assert.match(wrapperSource, /productionForest\.activatePatch/);
assert.match(wrapperSource, /productionForest\.update/);
assert.match(wrapperSource, /productionBranchesAndBark/);
assert.match(wrapperSource, /productionGrassClumps/);
assert.match(wrapperSource, /groundSurfaceDetails/);

console.log("production canopy, branches, bark, grass, understory orientation, and ground detail contracts passed");
