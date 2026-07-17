import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  PREHISTORIC_TERRAIN_LOD_POLICY_INPUT,
  selectPrehistoricTerrainLodLevel
} from "../src/world/prehistoric-terrain-lod-policy.js";
import {
  createTerrainLodTopology,
  createTerrainPatchVertexData
} from "../src/render/terrain-lod-geometry.js";
import { createPrehistoricPatchGenerator } from "../src/world/prehistoric-patch-generator.js";
import {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES
} from "../src/shared/tree-archetype-catalog.js";
import { createVegetationPlacementFixture } from "./helpers/vegetation-placement-fixture.mjs";

const routeSamples = Array.from({ length: 240 }, (_, index) => ({
  x: Math.sin(index * 0.03) * 4,
  z: index * 2 - 240,
  width: 3.1
}));
const generator = createPrehistoricPatchGenerator({
  config: { seed: 238991, chunk: 56, segments: 30, trees: 1, grass: 2, shardsPerPatch: 1 },
  treeTypes: PREHISTORIC_TREE_TYPES,
  vegetation: createVegetationPlacementFixture(PREHISTORIC_TREE_ARCHETYPES),
  routeSamples
});
const patch = generator({ x: 0, z: 0, patchId: "0:0", worldSeed: "terrain-lod-test" });
const policy = PREHISTORIC_TERRAIN_LOD_POLICY_INPUT;

assert.equal(patch.terrain.segments, 64, "patch production uses the LOD source resolution");
assert.equal(patch.terrain.heights.length, 65 * 65, "64-segment patches have 65x65 vertices");
assert.equal(patch.terrain.colors.length, 65 * 65 * 3, "color capacity matches the high-resolution patch");
assert.equal(patch.terrain.mapping, "world-space");

const topology = createTerrainLodTopology(policy);
assert.equal(topology.gridVertexCount, 65 * 65);
assert.equal(topology.skirtVertexCount, 65 * 4);
assert.equal(topology.vertexCount, 4485);
assert.ok(topology.indicesByLevel.near.length > topology.indicesByLevel.medium.length);
assert.ok(topology.indicesByLevel.medium.length > topology.indicesByLevel.far.length);
assert.ok(topology.indicesByLevel.near.length > 64 * 64 * 6, "near topology includes skirt triangles");

const data = createTerrainPatchVertexData({ patch, policy, topology });
assert.equal(data.positions.length, topology.vertexCount * 3);
assert.equal(data.uvs.length, topology.vertexCount * 2);
assert.equal(data.morphOffsetsByLevel.medium.length, topology.vertexCount * 3);
assert.equal(data.morphOffsetsByLevel.far.length, topology.vertexCount * 3);
assert.ok(data.morphOffsetsByLevel.medium.some((value) => Math.abs(value) > 1e-6), "medium geomorph has non-zero offsets");
assert.ok(data.morphOffsetsByLevel.far.some((value) => Math.abs(value) > 1e-6), "far geomorph has non-zero offsets");

const near = selectPrehistoricTerrainLodLevel(policy, { focus: { x: 0, z: 0 }, bounds: patch.bounds });
const far = selectPrehistoricTerrainLodLevel(policy, { focus: { x: 200, z: 200 }, bounds: patch.bounds });
assert.equal(near.levelId, "near");
assert.equal(far.levelId, "far");
assert.deepEqual(policy.levels.map((level) => level.resolution), [64, 32, 16]);
assert.equal(policy.materialPolicy.textureResolution.width, 2048);
assert.equal(policy.crackPolicy.mode, "skirts");
assert.equal(policy.morphPolicy.mode, "geomorph");

const layerSource = await readFile(new URL("../src/render/three-terrain-lod-layer.js", import.meta.url), "utf8");
const wrapperSource = await readFile(new URL("../src/render/three-patch-stream-lod-adapter.js", import.meta.url), "utf8");
const textureSource = await readFile(new URL("../src/render/three-clay-surface-textures.js", import.meta.url), "utf8");
const runtimeSource = await readFile(new URL("../src/game-runtime-lod.js", import.meta.url), "utf8");
const gameSource = await readFile(new URL("../src/game.js", import.meta.url), "utf8");
const generatorSource = await readFile(new URL("../src/world/prehistoric-patch-generator.js", import.meta.url), "utf8");
const workerSource = await readFile(new URL("../src/workers/prehistoric-patch-worker.js", import.meta.url), "utf8");

assert.match(layerSource, /new THREE\.MeshPhysicalMaterial\(/, "terrain uses a physical clay material");
assert.match(layerSource, /roughnessMap: textures\.roughnessMap/, "terrain consumes the roughness texture");
assert.match(layerSource, /normalMap: textures\.normalMap/, "terrain consumes the normal texture");
assert.match(layerSource, /geometry\.morphAttributes\.position/, "terrain allocates geomorph targets");
assert.match(layerSource, /setIndexForLevel/, "terrain switches reusable LOD index buffers");
assert.match(wrapperSource, /hideLegacyTerrain/, "the fixed-grid terrain is suppressed");
assert.match(wrapperSource, /terrain\.activatePatch\(patch, state\)/, "LOD preparation runs before base patch adoption");
assert.match(wrapperSource, /terrain\.releasePatches\(\[patch\.id\]\)/, "failed base adoption rolls back the LOD candidate");
assert.match(wrapperSource, /lastVisibleFrameAck/, "the first matching terrain frame is acknowledged");
assert.match(textureSource, /options\.resolution \?\? 2048/, "renderer generates 2K texture outputs");
assert.match(textureSource, /workingResolution \?\? 1024/, "texture generation uses bounded working detail");
assert.match(runtimeSource, /createThreePatchStreamLodAdapter/, "the active runtime selects the LOD adapter");
assert.match(runtimeSource, /createPrehistoricVegetationRuntime\(NexusEngine\)/, "main-thread generation installs Object Vegetation");
assert.match(workerSource, /createPrehistoricVegetationRuntime\(NexusEngine\)/, "worker generation installs Object Vegetation");
assert.doesNotMatch(generatorSource, /function chooseTreeType|function treeVariation/, "the product patch generator no longer owns generic vegetation selection or variation");
const generatorVersion = runtimeSource.match(/generatorVersion:\s*"([^"]+)"/)?.[1];
assert.match(generatorVersion ?? "", /^prehistoric-patch-v\d+-[a-z0-9-]+$/, "stream cache identity declares a versioned patch schema");
assert.match(
  runtimeSource,
  /terrainSettingsHash:\s*`segments-\$\{terrainLodPolicy\.sourceResolution\}-lod-\$\{terrainLodPolicy\.revision\}`/,
  "stream cache identity includes the terrain resolution and LOD policy revision"
);
assert.match(
  runtimeSource,
  /vegetationSettingsHash:\s*`trees-\$\{cfg\.trees\}-grass-\$\{cfg\.grass\}-catalog-\$\{vegetationCatalogDigest\}-fidelity-\$\{treeFidelityGenerationDigest\}`/,
  "stream cache identity includes the exact vegetation catalog and tree-fidelity generation"
);
assert.match(runtimeSource, /selectTerrainLodLevel: NexusEngine\.selectTerrainLodLevel/, "Core Graphics selects LOD levels");
assert.match(gameSource, /game-runtime-lod\.js/, "the page boots the LOD runtime");
assert.match(generatorSource, /function surfaceColor\(/, "terrain color uses continuous world-space blending");
assert.match(generatorSource, /smoothstep\(/, "route materials blend instead of hard switching");

console.log("terrain LOD renderer authority test ok");
