import { PREHISTORIC_TREE_ARCHETYPES } from "./tree-archetype-catalog.js";
import {
  PREHISTORIC_TREE_ART_DIRECTION,
  getPrehistoricTreeFoliageTargets,
  isPrehistoricRadialTree
} from "./prehistoric-tree-art-direction.js";

export const PREHISTORIC_TREE_GROWTH_COMPUTE_PROVIDER_ID = "prehistoric-tree-growth-compute-provider";
export const PREHISTORIC_TREE_GROWTH_REVISION = "natural-growth-v5-efficient-crossed-geometry";

const GENERIC_CROWN_COVERAGE_ERROR = /^Tree crown coverage .* is too sparse\.$/;
const VISUAL_PLANES_PER_CLUSTER = 2;

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function hashText(value) {
  let hash = 2166136261;
  for (const character of String(value)) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function minimumClustersFor(archetypeOrKind, quality = "near") {
  const radial = typeof archetypeOrKind === "string"
    ? String(archetypeOrKind) === "radial-frond"
    : isPrehistoricRadialTree(archetypeOrKind);
  const policy = PREHISTORIC_TREE_ART_DIRECTION.validation.minimumClusters;
  if (radial) return quality === "medium" ? policy.radialMedium : policy.radialNear;
  return quality === "medium" ? policy.nonRadialMedium : policy.nonRadialNear;
}

export function getPrehistoricTreeCrownCoverageMinimum(algorithmKind, quality = "near") {
  const policy = PREHISTORIC_TREE_ART_DIRECTION.validation.crownCoverage;
  if (String(algorithmKind) === "radial-frond") return quality === "medium" ? policy.radialMedium : policy.radialNear;
  return quality === "medium" ? policy.nonRadialMedium : policy.nonRadialNear;
}

export function validatePrehistoricTreeCrownCoverage(plan, quality = plan?.quality ?? "near") {
  const coverage = Number(plan?.metrics?.crownCoverage ?? 0);
  const minimum = getPrehistoricTreeCrownCoverageMinimum(plan?.algorithm?.kind, quality);
  return Object.freeze({
    valid: Number.isFinite(coverage) && coverage >= minimum,
    coverage,
    minimum,
    algorithmKind: plan?.algorithm?.kind ?? null,
    quality
  });
}

function authoredShading(cluster) {
  const zone = cluster.metadata?.zone ?? null;
  if (cluster.mode === "radial-frond") return { lightExposure: 0.74, shade: 0.16 };
  if (cluster.mode === "hanging-edge") return { lightExposure: 0.76, shade: 0.22 };
  if (cluster.mode === "canopy-core" || zone === "core") return { lightExposure: 0.28, shade: 0.72 };
  if (cluster.mode === "canopy-shell" || zone === "shell") return { lightExposure: 0.68, shade: 0.3 };
  if (cluster.mode === "canopy-fringe" || zone === "fringe") return { lightExposure: 0.78, shade: 0.2 };
  if (cluster.mode === "crown-tier") return { lightExposure: 0.58, shade: 0.38 };
  return { lightExposure: 0.56, shade: 0.42 };
}

function selectAuthoredClusters(foliage, quality) {
  const source = foliage?.clusters ?? [];
  if (quality === "near" || source.length <= 1) return source;
  const density = clamp(Number(foliage?.fidelity?.medium?.density ?? 0.35), 0.1, 1);
  const target = Math.max(1, Math.round(source.length * density));
  return Array.from({ length: target }, (_, index) => source[Math.min(source.length - 1, Math.floor((index + 0.5) * source.length / target))]);
}

function authoredFoliageClusters(tree, foliage, quality) {
  const source = selectAuthoredClusters(foliage, quality);
  const crownBottom = Math.max(0, Number(tree.averageHeight) - Number(tree.canopy?.height ?? tree.averageHeight * 0.32));
  const crownHeight = Math.max(0.01, Number(tree.canopy?.height ?? tree.averageHeight * 0.32));
  return source.map((cluster, index) => {
    const shading = authoredShading(cluster);
    const width = Math.max(0.08, Number(cluster.extent?.[0] ?? 1));
    const height = Math.max(0.08, Number(cluster.extent?.[1] ?? 1));
    const seed = hashText(`${tree.id}:${quality}:${cluster.id}`) / 4294967295;
    const hanging = cluster.mode === "hanging-edge";
    const y = Number(cluster.position?.[1] ?? crownBottom);
    return Object.freeze({
      id: `${tree.id}:authored-foliage:${quality}:${index}:${cluster.id}`,
      familyId: cluster.familyId,
      anchorSegmentId: null,
      mode: cluster.mode,
      position: Object.freeze((cluster.position ?? [0, crownBottom, 0]).map(Number)),
      rotation: Object.freeze((cluster.rotation ?? [0, 0, 0]).map(Number)),
      scale: Object.freeze([width, height, 1]),
      tangent: Object.freeze([0, hanging ? -1 : 0.2, 1]),
      cardCount: 1,
      lightExposure: shading.lightExposure,
      shade: shading.shade,
      windScale: Math.max(0, Number(cluster.windScale ?? 1)),
      layer: Math.max(0, Math.floor(clamp((y - crownBottom) / crownHeight, 0, 1) * Math.max(1, Number(tree.canopy?.layerCount ?? 3) - 1))),
      seed,
      metadata: Object.freeze({
        ...(cluster.metadata ?? {}),
        productAuthoredCanopy: true,
        volumetricCrossedCards: true,
        volumetricCrossedGeometry: true,
        visualPlaneCount: VISUAL_PLANES_PER_CLUSTER,
        instanceEfficient: true,
        sourceClusterId: cluster.id,
        quality
      })
    });
  });
}

function withAuthoredFoliage(plan, tree, foliage, quality) {
  const clusters = authoredFoliageClusters(tree, foliage, quality);
  if (!clusters.length) return plan;
  const crownRadius = Math.max(0.1, Number(tree.canopy?.radius ?? tree.averageWidth * 0.5));
  const crownHeight = Math.max(0.1, Number(tree.canopy?.height ?? tree.averageHeight * 0.32));
  const estimatedCardArea = clusters.reduce(
    (sum, entry) => sum + entry.scale[0] * entry.scale[1] * VISUAL_PLANES_PER_CLUSTER,
    0
  );
  const crownProjectedArea = Math.PI * crownRadius * Math.max(crownRadius, crownHeight * 0.5);
  return Object.freeze({
    ...plan,
    foliageClusters: Object.freeze(clusters),
    metrics: Object.freeze({
      ...plan.metrics,
      clusterCount: clusters.length,
      estimatedCardCount: clusters.length,
      estimatedPlaneCount: clusters.length * VISUAL_PLANES_PER_CLUSTER,
      crownCoverage: crownProjectedArea > 0 ? estimatedCardArea / crownProjectedArea : 0
    }),
    metadata: Object.freeze({
      ...(plan.metadata ?? {}),
      productAuthoredCanopy: true,
      volumetricCrossedCards: true,
      volumetricCrossedGeometry: true,
      instanceEfficient: true,
      visualPlaneCount: VISUAL_PLANES_PER_CLUSTER,
      authoredClusterCount: clusters.length,
      authoredCardCount: clusters.length,
      authoredPlaneCount: clusters.length * VISUAL_PLANES_PER_CLUSTER
    })
  });
}

function validateGrowthPlan(treeApi, plan, quality) {
  const generic = treeApi.validateGrowthPlan(plan, {
    minimumClusters: minimumClustersFor(plan.algorithm.kind, quality)
  });
  const coverage = validatePrehistoricTreeCrownCoverage(plan, quality);
  const errors = generic.errors.filter((message) => !GENERIC_CROWN_COVERAGE_ERROR.test(message));
  if (!coverage.valid) {
    errors.push(
      `Tree crown coverage ${coverage.coverage.toFixed(3)} is below the PrehistoricRush ${coverage.algorithmKind ?? "unknown"} ${quality} minimum ${coverage.minimum.toFixed(3)}.`
    );
  }
  return Object.freeze({
    ...generic,
    valid: errors.length === 0,
    errors: Object.freeze(errors),
    policy: coverage
  });
}

function packGrowthBuffers(plan) {
  const segments = [...plan.roots, ...plan.woodSegments];
  return {
    branchBuffer: segments.flatMap((entry) => [
      ...entry.start,
      entry.radiusStart,
      ...entry.end,
      entry.radiusEnd,
      entry.order,
      entry.lightExposure,
      entry.terminal ? 1 : 0,
      entry.role === "root" ? 0 : entry.role === "trunk" ? 1 : entry.order + 1
    ]),
    foliageBuffer: plan.foliageClusters.flatMap((entry) => [
      ...entry.position,
      ...entry.rotation,
      ...entry.scale,
      entry.cardCount,
      entry.lightExposure,
      entry.shade,
      entry.windScale,
      entry.layer,
      entry.seed
    ]),
    shadingBuffer: plan.foliageClusters.flatMap((entry) => [
      entry.lightExposure,
      entry.shade,
      Math.max(0.08, 1 - entry.shade * 0.62),
      entry.windScale,
      entry.seed,
      entry.cardCount,
      entry.mode === "radial-frond" ? 1 : 0,
      entry.mode === "hanging-edge" ? 1 : 0
    ])
  };
}

export function createPrehistoricTreeGrowthComputeProvider(runtime) {
  const treeApi = runtime.engine.n.vegetationTree;
  if (!treeApi) throw new Error("Prehistoric tree growth compute requires the Tree vegetation domain.");
  return {
    id: PREHISTORIC_TREE_GROWTH_COMPUTE_PROVIDER_ID,
    version: "5.0.0",
    metadata: {
      purpose: "Execute deterministic Core natural tree growth, admit the authored PrehistoricRush canopy recipe, and encode one foliage instance per crossed-geometry cluster.",
      algorithm: "core-growth-plus-instance-efficient-crossed-canopy",
      rendererNeutral: true,
      artDirection: PREHISTORIC_TREE_GROWTH_REVISION
    },
    syncDescriptors() {},
    async executeGraph(request) {
      const tree = request.input?.tree;
      const foliage = request.input?.foliage;
      const quality = request.input?.quality === "medium" ? "medium" : "near";
      const corePlan = treeApi.createGrowthPlan(tree, {
        foliage,
        quality,
        seed: request.input?.seed,
        height: request.input?.height,
        crownRadius: request.input?.crownRadius,
        crownHeight: request.input?.crownHeight,
        allowInvalid: true,
        metadata: {
          product: "prehistoric-rush",
          computeGraphId: request.graph.id,
          revision: PREHISTORIC_TREE_GROWTH_REVISION
        }
      });
      const plan = withAuthoredFoliage(corePlan, tree, foliage, quality);
      const validation = validateGrowthPlan(treeApi, plan, quality);
      if (!validation.valid) throw new Error(`Tree growth compute rejected ${tree.speciesId}: ${validation.errors.join("; ")}`);
      const buffers = packGrowthBuffers(plan);
      return {
        status: "completed",
        outputs: { growthPlan: plan, validation, ...buffers },
        diagnostics: validation.warnings.map((message) => ({ severity: "warning", message })),
        metadata: {
          speciesId: tree.speciesId,
          quality,
          algorithm: plan.algorithm.kind,
          branchCount: plan.metrics.branchCount,
          clusterCount: plan.metrics.clusterCount,
          estimatedCardCount: plan.metrics.estimatedCardCount,
          estimatedPlaneCount: plan.metrics.estimatedPlaneCount,
          crownCoverage: plan.metrics.crownCoverage,
          minimumCrownCoverage: validation.policy.minimum,
          authoredCanopy: plan.metadata?.productAuthoredCanopy === true,
          volumetricCrossedGeometry: plan.metadata?.volumetricCrossedGeometry === true,
          instanceEfficient: plan.metadata?.instanceEfficient === true,
          revision: PREHISTORIC_TREE_GROWTH_REVISION
        }
      };
    },
    reset() {},
    dispose() {}
  };
}

export async function preparePrehistoricTreeGrowthPlans(NexusEngine, runtime) {
  const compute = runtime.engine.n.coreCompute;
  const treeApi = runtime.engine.n.vegetationTree;
  const foliageApi = runtime.engine.n.vegetationFoliage;
  if (!compute || !treeApi || !foliageApi) throw new Error("Prehistoric tree growth preparation requires Core Compute, Tree, and Foliage domains.");
  compute.setProvider(createPrehistoricTreeGrowthComputeProvider(runtime));
  const plans = {};
  for (const archetype of PREHISTORIC_TREE_ARCHETYPES) {
    const tree = treeApi.get(`${archetype.id}:tree-structure`);
    const foliage = foliageApi.get(`${archetype.id}:foliage`);
    if (!tree || !foliage) throw new Error(`Missing vegetation descriptors for ${archetype.id}.`);
    const targets = getPrehistoricTreeFoliageTargets(archetype);
    const descriptors = treeApi.createGrowthComputeDescriptors(tree, {
      id: `prehistoric-tree-growth:${archetype.id}`,
      maximumSegments: 320,
      maximumClusters: Math.max(128, targets.near * 4)
    });
    for (const buffer of descriptors.buffers) compute.registerBuffer(buffer);
    for (const kernel of descriptors.kernels) compute.registerKernel(kernel);
    compute.registerGraph(descriptors.graph);
    const sharedInput = {
      tree,
      foliage,
      seed: `${archetype.id}:${PREHISTORIC_TREE_GROWTH_REVISION}`,
      height: archetype.averageHeight,
      crownRadius: archetype.crownRadius,
      crownHeight: archetype.crownHeight
    };
    const near = await compute.executeGraph(descriptors.graph.id, { ...sharedInput, quality: "near" });
    const medium = await compute.executeGraph(descriptors.graph.id, { ...sharedInput, quality: "medium" });
    plans[archetype.id] = Object.freeze({
      speciesId: archetype.id,
      graphId: descriptors.graph.id,
      providerId: near.providerId,
      revision: PREHISTORIC_TREE_GROWTH_REVISION,
      near: near.outputs.growthPlan,
      medium: medium.outputs.growthPlan,
      buffers: Object.freeze({
        near: Object.freeze({ branches: near.outputs.branchBuffer, foliage: near.outputs.foliageBuffer, shading: near.outputs.shadingBuffer }),
        medium: Object.freeze({ branches: medium.outputs.branchBuffer, foliage: medium.outputs.foliageBuffer, shading: medium.outputs.shadingBuffer })
      }),
      validation: Object.freeze({ near: near.outputs.validation, medium: medium.outputs.validation }),
      metrics: Object.freeze({ near: near.metadata, medium: medium.metadata }),
      targets
    });
  }
  structuredClone(plans);
  return Object.freeze(plans);
}

export function validatePrehistoricTreeGrowthPlans(plans = {}) {
  const errors = [];
  for (const archetype of PREHISTORIC_TREE_ARCHETYPES) {
    const entry = plans[archetype.id];
    if (!entry) {
      errors.push(`Missing growth plan for ${archetype.id}.`);
      continue;
    }
    for (const quality of ["near", "medium"]) {
      const plan = entry[quality];
      if (!plan || plan.speciesId !== archetype.id) errors.push(`${archetype.id} ${quality} plan has incorrect species identity.`);
      if (!entry.validation?.[quality]?.valid) errors.push(`${archetype.id} ${quality} plan failed validation.`);
      if (plan?.metadata?.productAuthoredCanopy !== true) errors.push(`${archetype.id} ${quality} plan did not admit the authored product canopy.`);
      if (plan?.metadata?.volumetricCrossedGeometry !== true) errors.push(`${archetype.id} ${quality} plan did not admit crossed foliage geometry.`);
      if (plan?.metadata?.instanceEfficient !== true) errors.push(`${archetype.id} ${quality} plan is not marked instance-efficient.`);
      const minimumClusters = minimumClustersFor(archetype, quality);
      if ((plan?.metrics?.clusterCount ?? 0) < minimumClusters) errors.push(`${archetype.id} ${quality} plan is too sparse: ${plan?.metrics?.clusterCount ?? 0} < ${minimumClusters}.`);
      const coverage = validatePrehistoricTreeCrownCoverage(plan, quality);
      if (!coverage.valid) {
        errors.push(`${archetype.id} ${quality} crown coverage ${coverage.coverage.toFixed(3)} is below ${coverage.minimum.toFixed(3)}.`);
      }
      if ((plan?.foliageClusters ?? []).some((cluster) => Number(cluster.cardCount ?? 0) !== 1)) {
        errors.push(`${archetype.id} ${quality} contains duplicated foliage instances instead of crossed geometry.`);
      }
      const bounds = plan?.bounds;
      const finiteBounds = bounds && [...(bounds.min ?? []), ...(bounds.max ?? [])].length === 6 && [...bounds.min, ...bounds.max].every(Number.isFinite);
      if (!finiteBounds) errors.push(`${archetype.id} ${quality} has invalid growth bounds.`);
    }
  }
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), speciesCount: Object.keys(plans).length });
}

export default preparePrehistoricTreeGrowthPlans;
