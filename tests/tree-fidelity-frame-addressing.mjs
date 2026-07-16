import assert from "node:assert/strict";
import {
  circularDegreesDistance,
  resolveTreeImpostorFrame
} from "../src/render/three-tree-fidelity-layer.js";

const frames = [];
for (const [row, elevationDegrees] of [0, 20].entries()) {
  for (const [column, azimuthDegrees] of [0, 90, 180, 270].entries()) {
    frames.push({
      frameIndex: row * 4 + column,
      azimuthDegrees,
      elevationDegrees,
      atlasCell: [column, row]
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

console.log("tree fidelity exact azimuth/elevation frame addressing passed");
