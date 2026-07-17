function hashText(value) {
  let hash = 2166136261;
  for (const character of String(value)) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function unit(seed, salt) {
  let value = hashText(`${seed}:${salt}`) || 1;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return (value >>> 0) / 4294967295;
}

function between(seed, salt, minimum, maximum) {
  return minimum + unit(seed, salt) * (maximum - minimum);
}

function instanceFor(selected, input) {
  const seed = String(input.seed);
  const hueShift = between(seed, "hue", -0.05, 0.05);
  const valueShift = between(seed, "value", -0.08, 0.08);
  return {
    schema: "nexus-vegetation-instance/1",
    id: input.id,
    speciesId: selected.id,
    seed,
    position: [...input.position],
    environment: structuredClone(input.environment ?? {}),
    variation: {
      yawDegrees: between(seed, "yaw", 0, 360),
      leanXDegrees: between(seed, "lean-x", -5, 5),
      leanZDegrees: between(seed, "lean-z", -5, 5),
      uniformScale: between(seed, "uniform", selected.kind === "ground-cover" ? 0.78 : 0.84, selected.kind === "ground-cover" ? 1.28 : 1.18),
      heightScale: between(seed, "height", selected.kind === "ground-cover" ? 0.88 : 0.92, selected.kind === "ground-cover" ? 1.18 : 1.12),
      crownScale: between(seed, "crown", 0.9, selected.kind === "ground-cover" ? 1.12 : 1.1),
      groundSink: between(seed, "sink", selected.kind === "ground-cover" ? 0.02 : 0.1, selected.kind === "ground-cover" ? 0.16 : 0.5),
      hueShift,
      roughnessAdd: between(seed, "roughness", -0.06, 0.06),
      valueShift,
      tint: [1 + valueShift + hueShift * 0.7, 1 + valueShift * 0.75, 1 + valueShift - hueShift * 0.7]
    },
    lifecycle: { state: "mature", stage: "mature", health: 1, revision: 0 },
    metadata: structuredClone(input.metadata ?? {})
  };
}

export function createVegetationPlacementFixture(treeArchetypes, groundCoverArchetypes = []) {
  const treeSpecies = treeArchetypes.map((entry, typeIndex) => ({
    schema: "nexus-vegetation-species/1",
    id: entry.id,
    kind: "tree",
    metadata: {
      typeIndex,
      averageHeight: entry.averageHeight,
      barkColor: entry.barkColor,
      foliageColor: entry.foliageColor,
      barkTexture: entry.barkTexture,
      foliageTexture: entry.foliageTexture,
      foliageCardFamily: entry.foliageCardFamily
    }
  }));
  const groundSpecies = groundCoverArchetypes.map((entry, groundCoverIndex) => ({
    schema: "nexus-vegetation-species/1",
    id: entry.id,
    kind: "ground-cover",
    metadata: {
      groundCoverIndex,
      averageHeight: entry.averageHeight,
      averageWidth: entry.averageWidth,
      familyId: entry.familyId,
      crossedPlanes: entry.crossedPlanes,
      wind: { amplitude: 0.1, frequency: 0.72, stiffness: 0.68 }
    }
  }));
  const species = [...treeSpecies, ...groundSpecies];
  const byId = new Map(species.map((entry) => [entry.id, entry]));
  return Object.freeze({
    selectSpecies(_environment, seed) {
      return treeSpecies[hashText(seed) % treeSpecies.length];
    },
    selectGroundCoverSpecies(_environment, seed) {
      if (groundSpecies.length === 0) return null;
      return groundSpecies[hashText(seed) % groundSpecies.length];
    },
    createInstanceDescriptor(input) {
      const selected = byId.get(input.speciesId);
      if (!selected) throw new RangeError(`Unknown fixture vegetation species: ${input.speciesId}`);
      return instanceFor(selected, input);
    }
  });
}
