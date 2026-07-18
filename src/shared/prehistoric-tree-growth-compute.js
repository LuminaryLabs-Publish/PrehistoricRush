import { PREHISTORIC_TREE_ARCHETYPES } from "./tree-archetype-catalog.js";

export const PREHISTORIC_TREE_GROWTH_COMPUTE_PROVIDER_ID = "prehistoric-tree-growth-compute-provider";
export const PREHISTORIC_TREE_GROWTH_REVISION = "natural-growth-v1";

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
      Math.max(0.04, 1 - entry.shade * 0.68),
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
    version: "1.0.0",
    metadata: {
      purpose: "Execute deterministic natural tree growth and pack GPU-ready branch, foliage, and shading buffers.",
      algorithm: "phyllotaxis-apical-tropism",
      rendererNeutral: true
    },
    syncDescriptors() {},
    async executeGraph(request) {
      const tree = request.input?.tree;
      const foliage = request.input?.foliage;
      const quality = request.input?.quality === "medium" ? "medium" : "near";
      const plan = treeApi.createGrowthPlan(tree, {
        foliage,
        quality,
        seed: request.input?.seed,
        height: request.input?.height,
        crownRadius: request.input?.crownRadius,
        crownHeight: request.input?.crownHeight,
        metadata: {
          product: "prehistoric-rush",
          computeGraphId: request.graph.id,
          revision: PREHISTORIC_TREE_GROWTH_REVISION
        }
      });
      const validation = treeApi.validateGrowthPlan(plan, {
        minimumClusters: plan.algorithm.kind === "radial-frond" ? 8 : quality === "medium" ? 6 : 12
      });
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
    const descriptors = treeApi.createGrowthComputeDescriptors(tree, {
      id: `prehistoric-tree-growth:${archetype.id}`,
      maximumSegments: 320,
      maximumClusters: Math.max(96, archetype.heroCardCount * 4)
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
      metrics: Object.freeze({ near: near.metadata, medium: medium.metadata })
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
      if ((plan?.metrics?.clusterCount ?? 0) < (quality === "near" ? 8 : 4)) errors.push(`${archetype.id} ${quality} plan is too sparse.`);
      if (!(plan?.metrics?.crownCoverage >= 0.28)) errors.push(`${archetype.id} ${quality} crown coverage is too low.`);
    }
  }
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), speciesCount: Object.keys(plans).length });
}

export default preparePrehistoricTreeGrowthPlans;
