const clone = (value) => value === undefined ? undefined : structuredClone(value);

export function eulerXYZToQuaternion(value = [0, 0, 0]) {
  const [x, y, z] = Array.isArray(value)
    ? value.map((entry) => Number(entry) || 0)
    : [Number(value.x) || 0, Number(value.y) || 0, Number(value.z) || 0];
  const c1 = Math.cos(x / 2);
  const c2 = Math.cos(y / 2);
  const c3 = Math.cos(z / 2);
  const s1 = Math.sin(x / 2);
  const s2 = Math.sin(y / 2);
  const s3 = Math.sin(z / 2);
  return {
    x: s1 * c2 * c3 + c1 * s2 * s3,
    y: c1 * s2 * c3 - s1 * c2 * s3,
    z: c1 * c2 * s3 + s1 * s2 * c3,
    w: c1 * c2 * c3 - s1 * s2 * s3
  };
}

export function createPlayerArticulatedRig(bodyDescriptor, options = {}) {
  if (!bodyDescriptor?.skeleton?.bones) throw new TypeError("Player articulation requires a creature skeleton descriptor.");
  const rigId = String(options.rigId ?? `${bodyDescriptor.id}:rig`);
  const bones = bodyDescriptor.skeleton.bones.map((bone) => ({
    id: String(bone.id),
    parentId: bone.parentId == null ? null : String(bone.parentId),
    restPosition: clone(bone.position ?? [0, 0, 0]),
    restRotation: clone(bone.rotation ?? [0, 0, 0, 1]),
    metadata: { source: "procedural-creature-body" }
  }));
  const ids = new Set(bones.map((bone) => bone.id));
  const chains = {};
  const addChain = (id, chainBones, poleDirection) => {
    if (chainBones.every((boneId) => ids.has(boneId))) {
      chains[id] = { id, bones: chainBones, solver: "two-bone", poleDirection };
    }
  };
  addChain("hindLegL", ["thigh-L", "shin-L", "foot-L"], [-1, 0, 0.35]);
  addChain("hindLegR", ["thigh-R", "shin-R", "foot-R"], [1, 0, 0.35]);
  return {
    id: rigId,
    rootBoneId: String(bodyDescriptor.skeleton.rootBoneId ?? bones.find((bone) => bone.parentId == null)?.id ?? "root"),
    bones,
    chains,
    metadata: {
      creatureId: bodyDescriptor.id,
      archetype: bodyDescriptor.archetype,
      contentHash: bodyDescriptor.contentHash
    }
  };
}

export function createPlayerArticulatedPose(legacyPose, options = {}) {
  const rigId = String(options.rigId ?? legacyPose?.rigId ?? "player-rig");
  const id = String(options.id ?? `${rigId}:pose`);
  const bones = Object.fromEntries(Object.entries(legacyPose?.bones ?? {}).map(([boneId, transform]) => [
    boneId,
    {
      position: transform.position == null ? null : clone(transform.position),
      rotation: transform.rotation == null
        ? eulerXYZToQuaternion(transform.rotationEuler ?? [0, 0, 0])
        : clone(transform.rotation),
      weight: transform.weight == null ? 1 : Number(transform.weight)
    }
  ]));
  return {
    id,
    rigId,
    bones,
    metadata: {
      sourcePoseId: legacyPose?.id ?? null,
      sourceKind: legacyPose?.kind ?? "procedural-creature-pose"
    }
  };
}
