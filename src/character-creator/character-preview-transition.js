import {
  applyCreaturePoseDamped,
  createCreatureMesh,
  dampCreatureMeshTowardDescriptor,
  disposeCreatureMesh,
  hasCompatibleCreatureTopology,
  setCreatureOpacity
} from "../render/three-procedural-creature.js";

const smoothStep = (value) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

export function createCharacterPreviewTransition(options) {
  const {
    THREE,
    scene,
    creatureApi,
    initialProfile,
    morphSharpness = 10,
    poseSharpness = 15,
    crossfadeDuration = 0.22
  } = options;
  if (!THREE || !scene || !creatureApi || !initialProfile) throw new TypeError("Preview transition dependencies are required.");

  let currentDescriptor = creatureApi.create(initialProfile.creature);
  let targetDescriptor = currentDescriptor;
  let currentMesh = createCreatureMesh(THREE, currentDescriptor);
  let targetRevision = initialProfile.revision;
  let appliedRevision = initialProfile.revision;
  let crossfade = null;
  scene.add(currentMesh);

  function finishCrossfade() {
    if (!crossfade) return;
    setCreatureOpacity(crossfade.nextMesh, 1);
    disposeCreatureMesh(crossfade.previousMesh);
    currentMesh = crossfade.nextMesh;
    currentDescriptor = crossfade.descriptor;
    targetDescriptor = crossfade.descriptor;
    appliedRevision = crossfade.revision;
    crossfade = null;
  }

  function setTargetProfile(profile) {
    if (!profile?.creature) throw new TypeError("A character profile with a creature recipe is required.");
    if (crossfade) finishCrossfade();
    const descriptor = creatureApi.create(profile.creature);
    targetRevision = Number(profile.revision ?? targetRevision);
    if (hasCompatibleCreatureTopology(currentDescriptor, descriptor)) {
      targetDescriptor = descriptor;
      currentDescriptor = descriptor;
      return { mode: "damped-morph", revision: targetRevision };
    }

    const nextMesh = createCreatureMesh(THREE, descriptor, { opacity: 0 });
    nextMesh.position.copy(currentMesh.position);
    nextMesh.rotation.copy(currentMesh.rotation);
    scene.add(nextMesh);
    crossfade = {
      previousMesh: currentMesh,
      nextMesh,
      descriptor,
      revision: targetRevision,
      elapsed: 0
    };
    return { mode: "topology-crossfade", revision: targetRevision };
  }

  function update(dt, poseState = {}, rotationY = 0) {
    const frameTime = Math.max(0, Math.min(1 / 20, Number(dt) || 0));
    const pose = creatureApi.createPose(targetDescriptor.id, poseState);
    if (crossfade) {
      crossfade.elapsed += frameTime;
      const blend = smoothStep(crossfade.elapsed / crossfadeDuration);
      setCreatureOpacity(crossfade.previousMesh, 1 - blend);
      setCreatureOpacity(crossfade.nextMesh, blend);
      crossfade.previousMesh.rotation.y = rotationY;
      crossfade.nextMesh.rotation.y = rotationY;
      applyCreaturePoseDamped(crossfade.previousMesh, pose, frameTime, poseSharpness);
      applyCreaturePoseDamped(crossfade.nextMesh, pose, frameTime, poseSharpness);
      if (blend >= 1) finishCrossfade();
      return;
    }

    currentMesh.rotation.y = rotationY;
    const difference = dampCreatureMeshTowardDescriptor(currentMesh, targetDescriptor, frameTime, morphSharpness);
    applyCreaturePoseDamped(currentMesh, pose, frameTime, poseSharpness);
    if (difference < 0.0005) appliedRevision = targetRevision;
  }

  return Object.freeze({
    setTargetProfile,
    update,
    getMesh: () => currentMesh,
    getState: () => ({
      targetRevision,
      appliedRevision,
      transitioning: Boolean(crossfade),
      mode: crossfade ? "topology-crossfade" : appliedRevision === targetRevision ? "settled" : "damped-morph"
    }),
    dispose() {
      if (crossfade) {
        disposeCreatureMesh(crossfade.previousMesh);
        disposeCreatureMesh(crossfade.nextMesh);
        crossfade = null;
      } else {
        disposeCreatureMesh(currentMesh);
      }
    }
  });
}
