import assert from "node:assert/strict";
import {
  createPlayerArticulatedPose,
  createPlayerArticulatedRig,
  createPlayerGroundLegTargets,
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

const evaluatedPose = {
  rigId: rig.id,
  bones: {
    "foot-L": { rigPosition: { x: -0.25, y: -0.02, z: 0.35 } },
    "foot-R": { rigPosition: { x: 0.25, y: -0.02, z: -0.15 } }
  }
};
const runState = {
  x: 10,
  y: 0,
  z: 20,
  yaw: Math.PI / 4,
  jumpHeight: 0,
  grounded: true
};
const settings = {
  footClearance: 0.03,
  maximumWeight: 0.8,
  activationHeight: 0.45,
  visualRootOffsetY: 0.05,
  visualScale: 0.82
};
const flatTargets = createPlayerGroundLegTargets({
  rig,
  evaluatedPose,
  runState,
  tickId: "tick:1",
  sampleHeight: () => 0,
  settings
});
assert.equal(flatTargets.length, 2);
assert.deepEqual(flatTargets.map((target) => target.chainId), ["hindLegL", "hindLegR"]);
assert.ok(flatTargets.every((target) => target.space === "rig"));
assert.deepEqual(flatTargets[0].position.x, evaluatedPose.bones["foot-L"].rigPosition.x);
assert.deepEqual(flatTargets[0].position.z, evaluatedPose.bones["foot-L"].rigPosition.z);
assert.deepEqual(flatTargets[0].poleDirection, rig.chains.hindLegL.poleDirection);
assert.deepEqual(flatTargets[1].poleDirection, rig.chains.hindLegR.poleDirection);
assert.ok(flatTargets.every((target) => target.weight > 0));

const raisedTargets = createPlayerGroundLegTargets({
  rig,
  evaluatedPose,
  runState,
  tickId: "tick:raised",
  sampleHeight: () => 0.2,
  settings
});
assert.equal(raisedTargets[0].position.x, flatTargets[0].position.x);
assert.equal(raisedTargets[0].position.z, flatTargets[0].position.z);
assert.ok(Math.abs((raisedTargets[0].position.y - flatTargets[0].position.y) - 0.2 / settings.visualScale) < 1e-9);

const swingPose = structuredClone(evaluatedPose);
swingPose.bones["foot-L"].rigPosition.y = 0.6;
const swingTargets = createPlayerGroundLegTargets({
  rig,
  evaluatedPose: swingPose,
  runState,
  tickId: "tick:swing",
  sampleHeight: () => 0,
  settings
});
assert.ok(swingTargets[0].weight < flatTargets[0].weight, "a raised swing foot receives less IK weight");

const airborneTargets = createPlayerGroundLegTargets({
  rig,
  evaluatedPose,
  runState: { ...runState, grounded: false, jumpHeight: 1 },
  tickId: "tick:airborne",
  sampleHeight: () => 0,
  settings
});
assert.ok(airborneTargets.every((target) => target.weight === 0));

const duplicateTargets = createPlayerGroundLegTargets({
  rig,
  evaluatedPose,
  runState,
  tickId: "tick:1",
  sampleHeight: () => 0,
  settings
});
assert.deepEqual(duplicateTargets, flatTargets, "ground target generation is deterministic");

console.log("player articulation test ok");
