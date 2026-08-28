import assert from "node:assert/strict";
import { resolveCameraTerrainClearance, resolveCloseChasePosition, resolveRacerCameraResponse, smoothCameraValue } from "../src/domains/prehistoric-rush/camera-response.js";
import { listRacerProfiles } from "../src/racers/racer-catalog.js";

for (const profile of listRacerProfiles()) {
  const { camera, movement, presentation } = profile;
  assert.ok(camera.closeDistance < camera.minimumDistance, `${profile.id} camera must have a closer playable distance`);
  assert.ok(camera.closeDistance < camera.maximumDistance, `${profile.id} close distance must remain below its maximum`);
  assert.ok(camera.fovExpansion > 0, `${profile.id} camera must widen at speed`);
  assert.ok(camera.speedLookAheadSeconds > 0, `${profile.id} camera must look farther ahead at speed`);
  assert.ok(camera.targetLift > 0, `${profile.id} camera must aim above the racer`);
  assert.ok(camera.fovSmoothing > 0, `${profile.id} camera FOV smoothing must be positive`);

  const running = resolveRacerCameraResponse({
    state: { speed: movement.baseSpeed, paceMode: "run", jumpHeight: 0, steer: 0 },
    movement,
    camera: { ...camera, jumpNormalization: presentation.jumpNormalization }
  });
  const sprinting = resolveRacerCameraResponse({
    state: { speed: movement.boostSpeed, paceMode: "sprint", jumpHeight: presentation.jumpNormalization, steer: 1 },
    movement,
    camera: { ...camera, jumpNormalization: presentation.jumpNormalization }
  });
  const reduced = resolveRacerCameraResponse({
    state: { speed: movement.boostSpeed, paceMode: "sprint", jumpHeight: presentation.jumpNormalization, steer: 1 },
    movement,
    camera: { ...camera, jumpNormalization: presentation.jumpNormalization },
    reducedMotion: true
  });

  assert.equal(running.speed01, 0, `${profile.id} baseline speed signal must be zero`);
  assert.equal(sprinting.speed01, 1, `${profile.id} boost speed signal must be one`);
  assert.ok(sprinting.targetFov > running.targetFov, `${profile.id} FOV must widen at speed`);
  assert.ok(sprinting.lookAheadSeconds > running.lookAheadSeconds, `${profile.id} look-ahead must increase at speed`);
  assert.ok(sprinting.targetLift > running.targetLift, `${profile.id} target must lift at speed/jump`);
  assert.ok(sprinting.turnLead > 0, `${profile.id} turn lead must respond to steering`);
  assert.ok(sprinting.paddingScale >= running.paddingScale, `${profile.id} speed padding must not move farther inward`);
  assert.equal(reduced.targetFov, camera.verticalFov, `${profile.id} reduced motion must keep baseline FOV`);
  assert.equal(reduced.lookAheadSeconds, camera.lookAheadSeconds, `${profile.id} reduced motion must keep baseline look-ahead`);
}

const profile = listRacerProfiles()[0];
const leftTurn = resolveRacerCameraResponse({
  state: { speed: profile.movement.maximumSpeed, paceMode: "run", jumpHeight: 0, steer: -1 },
  movement: profile.movement,
  camera: profile.camera
});
assert.ok(leftTurn.turnLead < 0, "camera turn lead must retain steering direction");

assert.ok(smoothCameraValue(0, 10, 1 / 60, 7) > 0, "camera smoothing must move toward its target");
assert.ok(smoothCameraValue(10, 0, 1 / 60, 7) < 10, "camera smoothing must return toward its target");
assert.equal(smoothCameraValue(4, 10, 0, 7), 4, "zero delta time must not advance the camera");

const raisedCamera = resolveCameraTerrainClearance([4, -8, 9], () => -3, 2.2);
assert.equal(raisedCamera[0], 4);
assert.ok(Math.abs(raisedCamera[1] - -0.8) < 1e-12, "camera must not remain below authoritative terrain");
assert.equal(raisedCamera[2], 9);
assert.deepEqual(
  resolveCameraTerrainClearance([4, 7, 9], () => -3, 2.2),
  [4, 7, 9],
  "terrain clearance must not lower an already safe camera"
);
const closeChase = resolveCloseChasePosition([0, 8, -16], [0, 0, 0], 9);
assert.ok(Math.abs(Math.hypot(...closeChase) - 9) < 1e-12, "close chase framing must honor the racer distance");
assert.ok(closeChase[1] > 0 && closeChase[2] < 0, "close chase framing must preserve the framing kit direction");

console.log("speed-reactive camera response contract passed");
