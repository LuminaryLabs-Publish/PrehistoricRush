import assert from "node:assert/strict";
import {
  createPlayerArticulatedPose,
  createPlayerArticulatedRig,
  eulerXYZToQuaternion
} from "../src/domains/prehistoric-rush/player-articulation.js";

const body = {
  id: "raptor",
  archetype: "theropod",
  contentHash: "abc",
  skeleton: {
    rootBoneId: "root",
    bones: [
      { id: "root", parentId: null, position: [0, 0, 0], rotation: [0, 0, 0, 1] },
      { id: "thigh-L", parentId: "root", position: [-0.2, 0, 0], rotation: [0, 0, 0, 1] },
      { id: "shin-L", parentId: "thigh-L", position: [0, -1, 0], rotation: [0, 0, 0, 1] },
      { id: "foot-L", parentId: "shin-L", position: [0, -1, 0], rotation: [0, 0, 0, 1] },
      { id: "thigh-R", parentId: "root", position: [0.2, 0, 0], rotation: [0, 0, 0, 1] },
      { id: "shin-R", parentId: "thigh-R", position: [0, -1, 0], rotation: [0, 0, 0, 1] },
      { id: "foot-R", parentId: "shin-R", position: [0, -1, 0], rotation: [0, 0, 0, 1] }
    ]
  }
};

const rig = createPlayerArticulatedRig(body, { rigId: "raptor-rig" });
assert.equal(rig.chains.hindLegL.bones.length, 3);
assert.equal(rig.chains.hindLegR.bones.length, 3);

const pose = createPlayerArticulatedPose({
  id: "legacy",
  bones: {
    "thigh-L": { rotationEuler: [Math.PI / 2, 0, 0] }
  }
}, {
  rigId: rig.id,
  id: "pose"
});

assert.equal(pose.rigId, rig.id);
assert.ok(Math.abs(pose.bones["thigh-L"].rotation.x - Math.SQRT1_2) < 1e-6);
assert.deepEqual(eulerXYZToQuaternion([0, 0, 0]), { x: 0, y: 0, z: 0, w: 1 });
assert.doesNotThrow(() => structuredClone({ rig, pose }));

console.log("player articulation test ok");
