import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  PREHISTORIC_VISUAL_QUALITY_PROFILES,
  resolvePrehistoricVisualQuality
} from "../src/shared/prehistoric-visual-quality.js";

const qualityIds = Object.keys(PREHISTORIC_VISUAL_QUALITY_PROFILES);
assert.deepEqual(qualityIds, ["performance", "balanced", "high", "cinematic"]);
assert.equal(resolvePrehistoricVisualQuality({ href: "https://game.local/?quality=cinematic" }, { navigator: {}, innerWidth: 1600 }).id, "cinematic");
assert.equal(resolvePrehistoricVisualQuality({ href: "https://game.local/?quality=high&renderer=webgpu" }, { navigator: {}, innerWidth: 1600 }).rendererPreference, "webgpu");
assert.equal(PREHISTORIC_VISUAL_QUALITY_PROFILES.high.preferUnifiedWebGPU, false, "the high-fidelity renderer must not be replaced by the simpler GPU path");

const renderingSource = readFileSync(new URL("../src/domains/prehistoric-rush/rendering-implementation.js", import.meta.url), "utf8");
const treeSource = readFileSync(new URL("../src/render/three-tree-fidelity-layer.js", import.meta.url), "utf8");
const cinematicSource = readFileSync(new URL("../src/render/three-cinematic-fidelity-layer.js", import.meta.url), "utf8");
const groundSource = readFileSync(new URL("../src/render/three-cinematic-ground-layer.js", import.meta.url), "utf8");
const gpuSource = readFileSync(new URL("../src/domains/prehistoric-rush/gpu-native-world-scene.js", import.meta.url), "utf8");
const semanticSource = readFileSync(new URL("../src/game-runtime-semantic-v2.js", import.meta.url), "utf8");

for (const token of ["prehistoric-triplanar-height-blended-terrain", "prehistoric-layered-dirt-trail", "createThreeCinematicGroundLayer", "createThreeCinematicFidelityLayer"]) {
  assert.match(renderingSource, new RegExp(token));
}
for (const token of ["treeTriplanar", "barkRidges", "leafTransmission", "treeWindStrength", "vTreeBaseAO"]) {
  assert.match(treeSource, new RegExp(token));
}
for (const token of ["sceneDepth", "aoStrength", "bloomStrength", "sharpenStrength", "filmic-jungle", "lightShafts", "cloudLayers"]) {
  assert.match(cinematicSource, new RegExp(token));
}
for (const token of ["cinematic-grass", "cinematic-ferns", "const rocks =", "const litter =", "const flowers =", "const roots ="]) {
  assert.match(groundSource, new RegExp(token));
}
for (const token of ["surfaceNoise", "filmicGrade", "trunkSway", "leafFlutter", "contactAO"]) {
  assert.match(gpuSource, new RegExp(token));
}
assert.match(semanticSource, /width:80vw/);
assert.match(semanticSource, /data-stamina-phase/);
assert.match(semanticSource, /prehistoric-rush-stamina-burst/);
assert.doesNotMatch(semanticSource, /prehistoric-ability/);
assert.doesNotMatch(semanticSource, /E ability/);

console.log("PrehistoricRush visual fidelity contract passed.");
