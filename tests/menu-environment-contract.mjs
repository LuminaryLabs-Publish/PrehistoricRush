import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  MENU_ENVIRONMENT_BUDGET,
  MENU_ENVIRONMENT_COUNTS,
  MENU_ROCK_ARCHETYPES,
  MENU_TRACK_SPEC,
  MENU_TREE_ARCHETYPES,
  getMenuEnvironmentPerformanceEstimate,
  getMenuTrackLaneLength,
  getMenuTrackMetrics,
  sampleMenuTrackLane
} from "../src/render/prehistoric-menu-environment.js";
import { SOFT_PLASTIC_PROFILE } from "../src/render/prehistoric-soft-plastic-material.js";

const approximately = (actual, expected, epsilon = 1e-6) => {
  assert.ok(Math.abs(actual - expected) <= epsilon, `Expected ${actual} to be within ${epsilon} of ${expected}.`);
};

assert.equal(MENU_TRACK_SPEC.lanes, 4, "The menu circuit must retain four lanes.");
const metrics = getMenuTrackMetrics();
approximately(metrics.outerWidth, 66.6);
approximately(metrics.outerDepth, 34.6);
assert.ok(metrics.aspectRatio > 1.9 && metrics.aspectRatio < 2, "The circuit must read as a long stadium oval.");
assert.equal(metrics.laneLengths.length, 4);
for (let lane = 1; lane < MENU_TRACK_SPEC.lanes; lane += 1) {
  assert.ok(metrics.laneLengths[lane] > metrics.laneLengths[lane - 1], "Outer lanes must have longer paths.");
}

for (let lane = 0; lane < MENU_TRACK_SPEC.lanes; lane += 1) {
  const length = getMenuTrackLaneLength(lane);
  const start = sampleMenuTrackLane(lane, 0);
  const closed = sampleMenuTrackLane(lane, length);
  approximately(start.x, -MENU_TRACK_SPEC.straightHalf);
  approximately(start.z, closed.z);
  approximately(start.x, closed.x);
  approximately(start.tangentX, 1);
  approximately(start.tangentZ, 0);
  for (let sample = 0; sample < 96; sample += 1) {
    const point = sampleMenuTrackLane(lane, length * sample / 96);
    assert.ok([point.x, point.z, point.tangentX, point.tangentZ, point.curvature].every(Number.isFinite));
    approximately(Math.hypot(point.tangentX, point.tangentZ), 1, 1e-5);
  }
}

const topStraight = sampleMenuTrackLane(0, MENU_TRACK_SPEC.straightHalf);
approximately(topStraight.x, 0);
approximately(topStraight.curvature, 0);
const turn = sampleMenuTrackLane(0, MENU_TRACK_SPEC.straightHalf * 2 + 1);
assert.ok(turn.curvature < 0, "Semicircular turns must report signed curvature.");

assert.deepEqual(MENU_TREE_ARCHETYPES, ["short-bush", "short-broadleaf", "tall-thin-broadleaf", "tiered-conifer", "redwood"]);
assert.deepEqual(MENU_ROCK_ARCHETYPES, ["round", "sharp-side", "vertical"]);
assert.equal(MENU_ENVIRONMENT_COUNTS.trees, 34);
assert.equal(Object.values(MENU_ENVIRONMENT_COUNTS.rocks).reduce((sum, count) => sum + count, 0), 30);
assert.equal(MENU_ENVIRONMENT_COUNTS.canopyLobesPerTree, 6);
assert.equal(MENU_ENVIRONMENT_BUDGET.maximumDrawCalls, 70);
assert.equal(MENU_ENVIRONMENT_BUDGET.maximumRenderedTriangles, 100000);
const performance = getMenuEnvironmentPerformanceEstimate();
assert.ok(performance.drawCalls <= MENU_ENVIRONMENT_BUDGET.maximumDrawCalls);
assert.ok(performance.renderedTriangles <= MENU_ENVIRONMENT_BUDGET.maximumRenderedTriangles);
assert.equal(performance.renderedInstances, 1007, "The estimate must include instanced copies and single meshes.");

assert.equal(SOFT_PLASTIC_PROFILE.metalness, 0);
assert.ok(SOFT_PLASTIC_PROFILE.roughness >= 0.48 && SOFT_PLASTIC_PROFILE.roughness <= 0.72);
assert.ok(SOFT_PLASTIC_PROFILE.clearcoat > 0 && SOFT_PLASTIC_PROFILE.clearcoat < 0.4);
approximately(SOFT_PLASTIC_PROFILE.clearcoatRoughness, 0.62);

const environmentSource = await readFile(new URL("../src/render/prehistoric-menu-environment.js", import.meta.url), "utf8");
const menuSource = await readFile(new URL("../src/pages/menu.js", import.meta.url), "utf8");
for (const legacyPrimitive of ["DodecahedronGeometry", "CylinderGeometry", "RingGeometry", "CircleGeometry", "TubeGeometry"]) {
  assert.ok(!environmentSource.includes(legacyPrimitive), `Environment must not use the legacy ${legacyPrimitive} shortcut.`);
}
assert.match(environmentSource, /new THREE\.InstancedMesh/g);
assert.match(environmentSource, /makeSweptTrunkGeometry/);
assert.match(environmentSource, /makeRockGeometry/);
assert.match(menuSource, /createPrehistoricMenuEnvironment/);
assert.match(menuSource, /sampleMenuTrackLane/);
assert.match(menuSource, /RACERS\.map/);
assert.match(menuSource, /globalThis\.location\.href = startRun\.href/);
assert.ok(!menuSource.includes("createShowcaseWorld"), "The legacy circular showcase must be removed.");

console.log("Menu environment contract passed.");
