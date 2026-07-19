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
import {
  FOLIAGE_ATLAS_REVISION,
  PREHISTORIC_GROUND_COVER_ARCHETYPES
} from "../src/shared/prehistoric-foliage-card-recipes.js";
import { createVegetationPlacementFixture } from "./helpers/vegetation-placement-fixture.mjs";

const routeSamples = Array.from({ length: 240 }, (_, index) => ({
  x: Math.sin(index * 0.03) * 4,
  z: index * 2 - 240,
  width: 3.1
}));
const generator = createPrehistoricPatchGenerator({
  config: { seed: 238991, chunk: 56, segments: 30, trees: 1, grass: 2, groundCover: 2, shardsPerPatch: 1 },
  treeTypes: PREHISTORIC_TREE_TYPES,
  groundCoverArchetypes: PREHISTORIC_GROUND_COVER_ARCHETYPES,
  vegetation: createVegetationPlacementFixture(PREHISTORIC_TREE_ARCHETYPES, PREHISTORIC_GROUND_COVER_ARCHETYPES),
  foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
  routeSamples
});
const patch = generator({ x: 0, z: 0, patchId: "0:0", worldSeed: "terrain-lod-test" });
const policy = PREHISTORIC_TERRAIN_LOD_POLICY_INPUT;

assert.equal(patch.terrain.segments, 64, "patch production uses the LOD source resolution");
assert.equal(patch.terrain.heights.length, 65 * 65, "64-segment patches have 65x65 vertices");
assert.equal(patch.terrain.colors.length, 65 * 65 * 3, "color capacity matches the high-resolution patch");
assert.equal(patch.terrain.mapping, "world-space");
assert.equal(patch.terrain.materialRevision, "stylized-high-fidelity-v4-production-jungle");
assert.equal(patch.vegetationRevision, FOLIAGE_ATLAS_REVISION);
assert.equal(patch.vegetationDensityPolicy, "production-patches-v1");
assert.ok(Array.isArray(patch.groundCover), "patches carry domain-backed ground cover");

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

assert.match(layerSource, /new THREE\.MeshPhysicalMaterial\(/, "terrain uses a physical stylized material");
assert.match(layerSource, /roughnessMap: textures\.roughnessMap/, "terrain consumes the roughness texture");
assert.match(layerSource, /normalMap: textures\.normalMap/, "terrain consumes the normal texture");
assert.match(layerSource, /geometry\.morphAttributes\.position/, "terrain allocates geomorph targets");
assert.match(layerSource, /setIndexForLevel/, "terrain switches reusable LOD index buffers");
assert.match(wrapperSource, /hideLegacyTerrain/, "the fixed-grid terrain is suppressed");
assert.match(wrapperSource, /terrain\.activatePatch\(patch, state\)/, "LOD preparation runs before base patch adoption");
assert.match(wrapperSource, /terrain\.releasePatches\(\[patch\.id\]\)/, "failed base adoption rolls back the LOD candidate");
assert.match(wrapperSource, /lastVisibleFrameAck/, "the first matching terrain frame is acknowledged");
assert.match(wrapperSource, /createThreeLushFoliageLayer/, "the LOD wrapper presents compute-prepared near and medium foliage cards");
assert.match(wrapperSource, /authority: treeFidelity/, "foliage consumes the Object Fidelity selection authority");
assert.match(wrapperSource, /createThreeGroundCoverLayer/, "the LOD wrapper owns streamed ground cover");
assert.match(wrapperSource, /createThreeProductionGroundLayer/, "the LOD wrapper retains only production grass and ground detail");
assert.doesNotMatch(wrapperSource, /createThreeProductionForestLayer/, "duplicate tree presentation is retired");
assert.match(wrapperSource, /productionCanopyGroups: 0/);
assert.match(wrapperSource, /productionBranchesAndBark: 0/);
assert.match(textureSource, /options\.resolution \?\? 2048/, "renderer generates 2K texture outputs");
assert.match(textureSource, /workingResolution \?\? 1024/, "texture generation uses bounded working detail");
assert.match(runtimeSource, /createThreePatchStreamLodAdapter/, "the active runtime selects the LOD adapter");
assert.match(runtimeSource, /treeFidelityGenerationDigest/, "stream cache identity includes the updated fidelity package generation");
assert.match(runtimeSource, /selectTerrainLodLevel: NexusEngine\.selectTerrainLodLevel/, "Core Graphics selects LOD levels");
assert.match(gameSource, /game-runtime-lod\.js/, "the page boots the LOD runtime");
assert.match(generatorSource, /function surfaceColor\(/, "terrain color uses continuous world-space blending");
assert.match(generatorSource, /smoothstep\(/, "route materials blend instead of hard switching");
assert.match(generatorSource, /selectGroundCoverSpecies/, "ground-cover placement is domain-selected");
assert.match(generatorSource, /treeDensity/, "tree placement uses deterministic grove density");
assert.match(generatorSource, /groundCoverDensity/, "ground cover uses patch density");
assert.match(generatorSource, /grassDensity/, "grass uses patch density");
assert.match(generatorSource, /leafLitter/, "terrain surface includes leaf-litter breakup");

console.log("terrain LOD and single-authority natural vegetation renderer test ok");
