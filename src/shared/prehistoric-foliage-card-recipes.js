export const FOLIAGE_ATLAS_REVISION = "prehistoric-foliage-cards-v1";
export const FOLIAGE_ATLAS_COLUMNS = 4;
export const FOLIAGE_ATLAS_ROWS = 2;

const freeze = (value) => Object.freeze(value);

export const PREHISTORIC_FOLIAGE_CARD_FAMILIES = freeze([
  freeze({
    id: "broadleaf-spray",
    label: "Broadleaf Spray",
    kind: "broadleaf-cluster",
    atlasCell: freeze([0, 0]),
    alphaCutoff: 0.42,
    roughness: 0.76,
    translucency: 0.14,
    size: freeze({ minimum: freeze([0.8, 0.7]), maximum: freeze([4.2, 3.2]) }),
    wind: freeze({ amplitude: 0.12, frequency: 0.74, stiffness: 0.66 })
  }),
  freeze({
    id: "palm-frond",
    label: "Palm Frond",
    kind: "palm-frond",
    atlasCell: freeze([1, 0]),
    alphaCutoff: 0.38,
    roughness: 0.72,
    translucency: 0.18,
    size: freeze({ minimum: freeze([1.2, 0.55]), maximum: freeze([7.8, 2.2]) }),
    wind: freeze({ amplitude: 0.18, frequency: 0.62, stiffness: 0.52 })
  }),
  freeze({
    id: "fern-frond",
    label: "Fern Frond",
    kind: "fern-frond",
    atlasCell: freeze([2, 0]),
    alphaCutoff: 0.36,
    roughness: 0.8,
    translucency: 0.16,
    size: freeze({ minimum: freeze([0.7, 0.42]), maximum: freeze([5.4, 1.8]) }),
    wind: freeze({ amplitude: 0.15, frequency: 0.82, stiffness: 0.58 })
  }),
  freeze({
    id: "needle-spray",
    label: "Needle Spray",
    kind: "needle-cluster",
    atlasCell: freeze([3, 0]),
    alphaCutoff: 0.4,
    roughness: 0.84,
    translucency: 0.08,
    size: freeze({ minimum: freeze([0.65, 0.45]), maximum: freeze([3.5, 1.8]) }),
    wind: freeze({ amplitude: 0.08, frequency: 0.68, stiffness: 0.84 })
  }),
  freeze({
    id: "ginkgo-fan",
    label: "Ginkgo Fan Cluster",
    kind: "fan-leaf-cluster",
    atlasCell: freeze([0, 1]),
    alphaCutoff: 0.4,
    roughness: 0.75,
    translucency: 0.13,
    size: freeze({ minimum: freeze([0.8, 0.7]), maximum: freeze([4.4, 3.5]) }),
    wind: freeze({ amplitude: 0.11, frequency: 0.72, stiffness: 0.68 })
  }),
  freeze({
    id: "hanging-vine",
    label: "Hanging Vine",
    kind: "vine-spray",
    atlasCell: freeze([1, 1]),
    alphaCutoff: 0.36,
    roughness: 0.8,
    translucency: 0.16,
    size: freeze({ minimum: freeze([0.5, 1.2]), maximum: freeze([2.2, 6.8]) }),
    wind: freeze({ amplitude: 0.2, frequency: 0.56, stiffness: 0.42 })
  }),
  freeze({
    id: "bush-cluster",
    label: "Jungle Bush Cluster",
    kind: "understory-cluster",
    atlasCell: freeze([2, 1]),
    alphaCutoff: 0.4,
    roughness: 0.79,
    translucency: 0.12,
    size: freeze({ minimum: freeze([0.8, 0.7]), maximum: freeze([3.8, 3.1]) }),
    wind: freeze({ amplitude: 0.09, frequency: 0.76, stiffness: 0.7 })
  }),
  freeze({
    id: "horsetail-whorl",
    label: "Horsetail Whorl",
    kind: "whorl-cluster",
    atlasCell: freeze([3, 1]),
    alphaCutoff: 0.38,
    roughness: 0.82,
    translucency: 0.1,
    size: freeze({ minimum: freeze([0.45, 0.45]), maximum: freeze([2.4, 1.5]) }),
    wind: freeze({ amplitude: 0.08, frequency: 0.9, stiffness: 0.82 })
  })
]);

const FAMILY_BY_ID = new Map(PREHISTORIC_FOLIAGE_CARD_FAMILIES.map((family) => [family.id, family]));

export function getPrehistoricFoliageCardFamily(id) {
  return FAMILY_BY_ID.get(String(id)) ?? null;
}

export function foliageFamilyIdForArchetype(archetype) {
  if (archetype.foliageCardFamily) return archetype.foliageCardFamily;
  const token = `${archetype.shape}:${archetype.foliageTexture}`;
  if (/palm/.test(token)) return "palm-frond";
  if (/fern|cycad|frond/.test(token)) return "fern-frond";
  if (/spire|araucaria|needle/.test(token)) return "needle-spray";
  if (/ginkgo|fan-leaf/.test(token)) return "ginkgo-fan";
  if (/horsetail|whorl/.test(token)) return "horsetail-whorl";
  return "broadleaf-spray";
}

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

function placement(seed, familyId, position, rotation, scale, options = {}) {
  const family = getPrehistoricFoliageCardFamily(familyId);
  if (!family) throw new RangeError(`Unknown foliage card family: ${familyId}`);
  return freeze({
    id: String(options.id ?? `${seed}:${familyId}`),
    familyId,
    position: freeze(position.map(Number)),
    rotation: freeze(rotation.map(Number)),
    scale: freeze(scale.map(Number)),
    tint: freeze((options.tint ?? [1, 1, 1]).map(Number)),
    wind: freeze({
      amplitude: Number(options.windAmplitude ?? family.wind.amplitude),
      frequency: Number(options.windFrequency ?? family.wind.frequency),
      stiffness: Number(options.windStiffness ?? family.wind.stiffness),
      phase: Number(options.windPhase ?? between(seed, "phase", 0, Math.PI * 2))
    }),
    seed: unit(seed, "card-seed"),
    mode: options.mode ?? "branch-cluster",
    metadata: freeze({ ...(options.metadata ?? {}) })
  });
}

function radialPlacements(archetype, count, familyId, options = {}) {
  const output = [];
  const baseY = options.baseY ?? archetype.averageHeight * 0.78;
  const radius = options.radius ?? archetype.crownRadius * 0.58;
  const width = options.width ?? archetype.crownRadius * 0.58;
  const height = options.height ?? archetype.crownHeight * 0.38;
  const tilt = options.tilt ?? -0.18;
  for (let index = 0; index < count; index += 1) {
    const seed = `${archetype.id}:radial:${options.quality ?? "near"}:${index}`;
    const angle = index / count * Math.PI * 2 + between(seed, "angle", -0.12, 0.12);
    const distance = radius * between(seed, "distance", 0.48, 1.02);
    output.push(placement(
      seed,
      familyId,
      [Math.sin(angle) * distance * 0.48, baseY + between(seed, "y", -height * 0.18, height * 0.28), Math.cos(angle) * distance * 0.48],
      [tilt + between(seed, "pitch", -0.14, 0.14), angle, between(seed, "roll", -0.22, 0.22)],
      [width * between(seed, "width", 0.72, 1.08), height * between(seed, "height", 0.72, 1.12)],
      { mode: "frond-burst", windAmplitude: options.windAmplitude }
    ));
  }
  return output;
}

function canopyPlacements(archetype, count, familyId, options = {}) {
  const output = [];
  const layers = Math.max(1, options.layers ?? archetype.canopyLayers ?? 3);
  const baseY = options.baseY ?? archetype.averageHeight * 0.73;
  const width = archetype.crownRadius * (options.widthScale ?? 0.42);
  const height = archetype.crownHeight * (options.heightScale ?? 0.38);
  for (let index = 0; index < count; index += 1) {
    const seed = `${archetype.id}:canopy:${options.quality ?? "near"}:${index}`;
    const layer = index % layers;
    const layerT = layers === 1 ? 0.5 : layer / (layers - 1);
    const angle = index * 2.399963229728653 + between(seed, "angle", -0.18, 0.18);
    const shell = Math.sqrt((index + 0.5) / count);
    const radius = archetype.crownRadius * shell * (0.74 - layerT * 0.16);
    const y = baseY + layerT * archetype.crownHeight * 0.46 + between(seed, "y", -height * 0.22, height * 0.22);
    output.push(placement(
      seed,
      familyId,
      [Math.sin(angle) * radius * 0.72, y, Math.cos(angle) * radius * 0.72],
      [between(seed, "pitch", -0.28, 0.28), angle + Math.PI * 0.5, between(seed, "roll", -0.32, 0.32)],
      [width * between(seed, "width", 0.68, 1.16), height * between(seed, "height", 0.7, 1.2)],
      { mode: layer === layers - 1 ? "canopy-shell" : "branch-cluster" }
    ));
  }
  const hangingCount = Math.round(count * Number(archetype.hangingFoliage ?? 0));
  for (let index = 0; index < hangingCount; index += 1) {
    const seed = `${archetype.id}:hanging:${options.quality ?? "near"}:${index}`;
    const angle = index / Math.max(1, hangingCount) * Math.PI * 2 + between(seed, "angle", -0.3, 0.3);
    output.push(placement(
      seed,
      "hanging-vine",
      [Math.sin(angle) * archetype.crownRadius * 0.68, baseY - archetype.crownHeight * 0.12, Math.cos(angle) * archetype.crownRadius * 0.68],
      [0, angle, between(seed, "roll", -0.12, 0.12)],
      [archetype.crownRadius * 0.18, archetype.crownHeight * between(seed, "length", 0.55, 0.96)],
      { mode: "dangling-edge", windAmplitude: 0.18 }
    ));
  }
  return output;
}

function tieredPlacements(archetype, count, familyId, options = {}) {
  const output = [];
  const tiers = Math.max(3, archetype.canopyLayers ?? 6);
  for (let index = 0; index < count; index += 1) {
    const seed = `${archetype.id}:tier:${options.quality ?? "near"}:${index}`;
    const tier = index % tiers;
    const tierT = tier / Math.max(1, tiers - 1);
    const angle = index * 2.17 + between(seed, "angle", -0.16, 0.16);
    const radius = archetype.crownRadius * (1 - tierT * 0.68);
    output.push(placement(
      seed,
      familyId,
      [Math.sin(angle) * radius * 0.52, archetype.averageHeight * 0.42 + tierT * archetype.crownHeight * 0.78, Math.cos(angle) * radius * 0.52],
      [between(seed, "pitch", -0.2, 0.12), angle, between(seed, "roll", -0.16, 0.16)],
      [radius * between(seed, "width", 0.38, 0.62), archetype.crownHeight * between(seed, "height", 0.12, 0.22)],
      { mode: "crown-tier" }
    ));
  }
  return output;
}

export function createTreeFoliageCardPlacements(archetype, quality = "near") {
  const familyId = foliageFamilyIdForArchetype(archetype);
  const nearCount = Math.max(4, Math.floor(archetype.heroCardCount ?? 22));
  const mediumCount = Math.max(3, Math.floor(archetype.mediumCardCount ?? Math.max(6, nearCount * 0.46)));
  const count = quality === "medium" ? mediumCount : nearCount;
  const token = `${archetype.shape}:${familyId}`;
  if (/palm/.test(token)) {
    return freeze(radialPlacements(archetype, count, "palm-frond", {
      quality,
      baseY: archetype.averageHeight * 0.9,
      radius: archetype.crownRadius,
      width: archetype.crownRadius * 0.72,
      height: archetype.crownHeight * 0.26,
      tilt: -0.34,
      windAmplitude: 0.2
    }));
  }
  if (/fern|cycad/.test(token)) {
    return freeze(radialPlacements(archetype, count, familyId === "palm-frond" ? "fern-frond" : familyId, {
      quality,
      baseY: archetype.averageHeight * 0.73,
      radius: archetype.crownRadius,
      width: archetype.crownRadius * 0.7,
      height: archetype.crownHeight * 0.22,
      tilt: -0.2
    }));
  }
  if (/spire|araucaria|needle/.test(token)) return freeze(tieredPlacements(archetype, count, "needle-spray", { quality }));
  if (/horsetail|whorl/.test(token)) return freeze(tieredPlacements(archetype, count, "horsetail-whorl", { quality }));
  return freeze(canopyPlacements(archetype, count, familyId, {
    quality,
    layers: archetype.canopyLayers,
    widthScale: /ginkgo/.test(token) ? 0.36 : 0.42,
    heightScale: /ghostwood/.test(token) ? 0.32 : 0.38
  }));
}

function groundCover(value) {
  return freeze({
    family: "prehistoric-ground-cover",
    kind: "ground-cover",
    rooted: true,
    distributionWeight: 1,
    ecology: freeze({ moisture: 0.5, elevation: 0.35, slope: 0.35, clusterScale: 0.03, clusterStrength: 0.88 }),
    variation: freeze({
      yawDegrees: freeze([0, 360]),
      leanXDegrees: freeze([-4, 4]),
      leanZDegrees: freeze([-4, 4]),
      uniformScale: freeze([0.78, 1.28]),
      heightScale: freeze([0.88, 1.18]),
      crownScale: freeze([0.9, 1.12]),
      groundSink: freeze([0.02, 0.16]),
      hueShift: freeze([-0.06, 0.06]),
      roughnessAdd: freeze([-0.04, 0.05]),
      valueShift: freeze([-0.08, 0.08])
    }),
    ...value
  });
}

export const PREHISTORIC_GROUND_COVER_ARCHETYPES = freeze([
  groundCover({ id: "fern-floor-clump", label: "Fern Floor Clump", familyId: "fern-frond", averageHeight: 1.25, averageWidth: 2.4, crossedPlanes: 4, color: 0x5f9a45, accentColor: 0x8ab85b, distributionWeight: 1.35, ecology: freeze({ moisture: 0.76, elevation: 0.28, slope: 0.35, clusterScale: 0.035, clusterStrength: 0.98 }) }),
  groundCover({ id: "cycad-understory-clump", label: "Cycad Understory Clump", familyId: "palm-frond", averageHeight: 1.8, averageWidth: 3.1, crossedPlanes: 5, color: 0x6f9848, accentColor: 0xa4b85c, distributionWeight: 0.9, ecology: freeze({ moisture: 0.58, elevation: 0.24, slope: 0.3, clusterScale: 0.028, clusterStrength: 0.92 }) }),
  groundCover({ id: "broadleaf-floor-clump", label: "Broadleaf Jungle Floor", familyId: "bush-cluster", averageHeight: 1.45, averageWidth: 2.3, crossedPlanes: 3, color: 0x4f8f47, accentColor: 0x7cad5c, distributionWeight: 1.25, ecology: freeze({ moisture: 0.66, elevation: 0.38, slope: 0.42, clusterScale: 0.032, clusterStrength: 0.9 }) }),
  groundCover({ id: "juvenile-palm-clump", label: "Juvenile Palm Clump", familyId: "palm-frond", averageHeight: 2.6, averageWidth: 3.6, crossedPlanes: 5, color: 0x72a34e, accentColor: 0xa7be61, distributionWeight: 0.62, ecology: freeze({ moisture: 0.54, elevation: 0.3, slope: 0.24, clusterScale: 0.024, clusterStrength: 0.82 }) }),
  groundCover({ id: "hanging-vine-patch", label: "Creeping Vine Patch", familyId: "hanging-vine", averageHeight: 0.85, averageWidth: 2.2, crossedPlanes: 2, color: 0x3f7f45, accentColor: 0x6aa35c, distributionWeight: 0.72, ecology: freeze({ moisture: 0.88, elevation: 0.42, slope: 0.72, clusterScale: 0.04, clusterStrength: 0.96 }) }),
  groundCover({ id: "horsetail-marsh-clump", label: "Marsh Horsetail Clump", familyId: "horsetail-whorl", averageHeight: 1.6, averageWidth: 1.8, crossedPlanes: 3, color: 0x4e8171, accentColor: 0x77a696, distributionWeight: 0.78, ecology: freeze({ moisture: 0.96, elevation: 0.12, slope: 0.18, clusterScale: 0.046, clusterStrength: 1 }) })
]);

export const PREHISTORIC_GROUND_COVER_BY_ID = new Map(PREHISTORIC_GROUND_COVER_ARCHETYPES.map((entry) => [entry.id, entry]));
