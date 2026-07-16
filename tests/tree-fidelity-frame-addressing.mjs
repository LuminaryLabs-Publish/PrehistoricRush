import assert from "node:assert/strict";
import {
  circularDegreesDistance,
  resolveTreeImpostorBlend,
  resolveTreeImpostorFrame
} from "../src/render/three-tree-fidelity-layer.js";

const frames = [];
for (const [row, elevationDegrees] of [0, 20].entries()) {
  for (const [column, azimuthDegrees] of [0, 90, 180, 270].entries()) {
    frames.push({
      frameIndex: row * 4 + column,
      azimuthDegrees,
      elevationDegrees,
      atlasCell: [column, row],
      uvRect: [column * 0.25, row * 0.5, 0.25, 0.5]
    });
  }
}

assert.equal(circularDegreesDistance(359, 1), 2);
assert.equal(circularDegreesDistance(10, 190), 180);

const bounds = { center: [0, 10, 0] };
const frontLow = resolveTreeImpostorFrame(frames, { x: 0, y: 10, z: 100 }, bounds);
assert.equal(frontLow.frameIndex, 0);
assert.deepEqual(frontLow.atlasCell, [0, 0]);

const rightLow = resolveTreeImpostorFrame(frames, { x: 100, y: 10, z: 0 }, bounds);
assert.equal(rightLow.frameIndex, 1);
assert.deepEqual(rightLow.atlasCell, [1, 0]);

const backHigh = resolveTreeImpostorFrame(frames, { x: 0, y: 47, z: -100 }, bounds);
assert.equal(backHigh.frameIndex, 6);
assert.deepEqual(backHigh.atlasCell, [2, 1]);
assert.equal(backHigh.frameElevationDegrees, 20);

const wraparound = resolveTreeImpostorFrame(frames, { x: -1, y: 10, z: 100 }, bounds);
assert.equal(wraparound.frameIndex, 0);

const diagonalBlend = resolveTreeImpostorBlend(frames, { x: 100, y: 10, z: 100 }, bounds);
assert.equal(diagonalBlend.length, 2);
assert.deepEqual(diagonalBlend.map((entry) => entry.frameIndex), [0, 1]);
assert.ok(Math.abs(diagonalBlend[0].weight - 0.5) < 0.0001);
assert.ok(Math.abs(diagonalBlend[1].weight - 0.5) < 0.0001);
assert.ok(Math.abs(diagonalBlend.reduce((sum, entry) => sum + entry.weight, 0) - 1) < 0.0001);

const rotatedTree = resolveTreeImpostorFrame(frames, { x: 0, y: 10, z: 100 }, bounds, 90);
assert.equal(rotatedTree.frameIndex, 3, "tree yaw rotates the relative capture view");

console.log("tree fidelity exact azimuth/elevation addressing and adjacent-angle blending passed");
