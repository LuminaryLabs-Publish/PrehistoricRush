import {
  applyCreaturePoseDamped,
  createCreatureMesh,
  dampCreatureMeshTowardDescriptor,
  disposeCreatureMesh,
  hasCompatibleCreatureTopology,
  setCreatureOpacity
} from "../render/three-procedural-creature.js";
import {
  createPlayerArticulatedPose,
  createPlayerGroundLegTargets
} from "../domains/prehistoric-rush/player-articulation.js";
import { installPrehistoricRushPlayerCharacter } from "../domains/prehistoric-rush/player-character-composition.js";

const smoothStep = (value) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

function characterGroundY(composition, scaleY, platformTopY) {
  const minimumY = finite(composition?.creature?.presentation?.metadata?.bounds?.min?.[1], 0);
  return platformTopY - minimumY * Math.max(0.0001, finite(scaleY, 1));
}

export function createCharacterPreviewTransition(options) {
  const {
    THREE,
    scene,
    engine,
    creatureApi,
    initialProfile,
    platformTopY = -0.14,
    morphSharpness = 10,
    poseSharpness = 15,
    placementSharpness = 10,
    crossfadeDuration = 0.22
  } = options;
  if (!THREE || !scene || !engine || !creatureApi || !initialProfile) {
    throw new TypeError("Preview transition dependencies are required.");
  }
  const articulatedMotion = engine.n.articulatedMotion;
  const coreCharacter = engine.coreCharacter ?? engine.n.coreCharacter;
  if (!articulatedMotion || !coreCharacter) throw new Error("Character preview domains did not install.");

  function compose(profile) {
    return installPrehistoricRushPlayerCharacter({
      engine,
      profile,
      creatureRecipe: profile.creature,
      bodyId: profile.creature.id,
      characterId: "preview-character",
      motionActorId: null,
      physicsBodyId: null,
      includePlayer: false,
      status: "active",
      visualRootOffsetY: 0
    });
  }

  let currentComposition = compose(initialProfile);
  let currentDescriptor = currentComposition.bodyDescriptor;
  let targetComposition = currentComposition;
  let targetDescriptor = currentDescriptor;
  let currentMesh = createCreatureMesh(THREE, currentDescriptor);
  currentMesh.position.y = characterGroundY(currentComposition, currentMesh.scale.y, platformTopY);
  let targetRevision = initialProfile.revision;
  let appliedRevision = initialProfile.revision;
  let crossfade = null;
  let poseFrame = 0;
  scene.add(currentMesh);

  function finishCrossfade() {
    if (!crossfade) return;
    setCreatureOpacity(crossfade.nextMesh, 1);
    disposeCreatureMesh(crossfade.previousMesh);
    currentMesh = crossfade.nextMesh;
    currentDescriptor = crossfade.descriptor;
    currentComposition = crossfade.composition;
    targetDescriptor = crossfade.descriptor;
    targetComposition = crossfade.composition;
    appliedRevision = crossfade.revision;
    crossfade = null;
  }

  function setTargetProfile(profile) {
    if (!profile?.creature) throw new TypeError("A character profile with a creature recipe is required.");
    if (crossfade) finishCrossfade();
    const composition = compose(profile);
    const descriptor = composition.bodyDescriptor;
    targetRevision = Number(profile.revision ?? targetRevision);
    targetComposition = composition;
    if (hasCompatibleCreatureTopology(currentDescriptor, descriptor)) {
      targetDescriptor = descriptor;
      currentDescriptor = descriptor;
      currentComposition = composition;
      return { mode: "damped-morph", revision: targetRevision };
    }

    const nextMesh = createCreatureMesh(THREE, descriptor, { opacity: 0 });
    nextMesh.position.copy(currentMesh.position);
    nextMesh.position.y = characterGroundY(composition, nextMesh.scale.y, platformTopY);
    nextMesh.rotation.copy(currentMesh.rotation);
    scene.add(nextMesh);
    crossfade = {
      previousMesh: currentMesh,
      nextMesh,
      descriptor,
      composition,
      revision: targetRevision,
      elapsed: 0
    };
    return { mode: "topology-crossfade", revision: targetRevision };
  }

  function solvePose(poseState, rotationY, mesh) {
    const rigId = targetComposition.rigId;
    const rig = articulatedMotion.getRig(rigId);
    const legacyPose = creatureApi.createPose(targetDescriptor.id, poseState);
    const tickId = `creator-preview:${poseFrame += 1}`;
    const basePose = createPlayerArticulatedPose(legacyPose, {
      rigId,
      id: `${tickId}:base`
    });
    const evaluatedPose = articulatedMotion.evaluatePose({ rigId, pose: basePose });
    const visualScale = Math.max(0.0001, finite(mesh.scale.x, 1));
    const targets = createPlayerGroundLegTargets({
      rig,
      evaluatedPose,
      runState: {
        x: 0,
        y: mesh.position.y,
        z: 0,
        yaw: rotationY,
        jumpHeight: 0,
        grounded: true
      },
      tickId,
      sampleHeight: () => platformTopY,
      settings: {
        footClearance: 0.01,
        maximumWeight: 0.8,
        activationHeight: 0.45,
        visualRootOffsetY: 0,
        visualScale
      }
    });
    const frame = articulatedMotion.solve({
      rigId,
      pose: basePose,
      targets,
      tickId,
      frame: poseFrame,
      metadata: { source: "prehistoric-rush-character-creator", characterId: targetComposition.characterId }
    });
    coreCharacter.setPose(targetComposition.characterId, frame.pose.id);
    return frame.pose;
  }

  function updateMeshPlacement(mesh, composition, frameTime) {
    const targetY = characterGroundY(composition, mesh.scale.y, platformTopY);
    const alpha = 1 - Math.exp(-placementSharpness * frameTime);
    mesh.position.y += (targetY - mesh.position.y) * alpha;
  }

  function update(dt, poseState = {}, rotationY = 0) {
    const frameTime = Math.max(0, Math.min(1 / 20, Number(dt) || 0));
    if (crossfade) {
      crossfade.elapsed += frameTime;
      const blend = smoothStep(crossfade.elapsed / crossfadeDuration);
      setCreatureOpacity(crossfade.previousMesh, 1 - blend);
      setCreatureOpacity(crossfade.nextMesh, blend);
      crossfade.previousMesh.rotation.y = rotationY;
      crossfade.nextMesh.rotation.y = rotationY;
      updateMeshPlacement(crossfade.previousMesh, currentComposition, frameTime);
      updateMeshPlacement(crossfade.nextMesh, crossfade.composition, frameTime);
      const pose = solvePose(poseState, rotationY, crossfade.nextMesh);
      applyCreaturePoseDamped(crossfade.previousMesh, pose, frameTime, poseSharpness);
      applyCreaturePoseDamped(crossfade.nextMesh, pose, frameTime, poseSharpness);
      if (blend >= 1) finishCrossfade();
      return;
    }

    currentMesh.rotation.y = rotationY;
    const difference = dampCreatureMeshTowardDescriptor(currentMesh, targetDescriptor, frameTime, morphSharpness);
    updateMeshPlacement(currentMesh, targetComposition, frameTime);
    const pose = solvePose(poseState, rotationY, currentMesh);
    applyCreaturePoseDamped(currentMesh, pose, frameTime, poseSharpness);
    if (difference < 0.0005) appliedRevision = targetRevision;
  }

  return Object.freeze({
    setTargetProfile,
    update,
    getMesh: () => currentMesh,
    getDescriptor: () => structuredClone(targetDescriptor),
    getCharacter: () => coreCharacter.resolve(targetComposition.characterId),
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
