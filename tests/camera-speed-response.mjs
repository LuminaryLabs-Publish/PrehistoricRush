import assert from "node:assert/strict";
import { resolveRacerCameraResponse, smoothCameraValue } from "../src/domains/prehistoric-rush/camera-response.js";
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

assert.ok(smoothCameraValue(0, 10, 1 / 60, 7) > 0, "camera smoothing must move toward its target");
assert.ok(smoothCameraValue(10, 0, 1 / 60, 7) < 10, "camera smoothing must return toward its target");
assert.equal(smoothCameraValue(4, 10, 0, 7), 4, "zero delta time must not advance the camera");

console.log("speed-reactive camera response contract passed");
