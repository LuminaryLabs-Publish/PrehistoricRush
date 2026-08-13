import {
  createPrehistoricRushDomainKit,
  createPrehistoricRushKitGraph as createBasePrehistoricRushKitGraph
} from "./prehistoric-rush-domain-runtime.js";
import { createPrehistoricRushCourseDomainKit } from "./course-domain-kit.js";
import { createPrehistoricRushPauseMenuDomainKit } from "./pause-menu-domain-kit.js";
import { createPrehistoricRushWorldCompositionDomainKit } from "./world-composition-domain-kit.js";
import { createPrehistoricTerrainLodPolicy } from "../../world/prehistoric-terrain-lod-policy.js";

export { createPrehistoricRushDomainKit };

function createPrehistoricTerrainLodPolicyKit(NexusEngine, config = {}) {
  const policy = createPrehistoricTerrainLodPolicy(NexusEngine, config);
  return NexusEngine.defineDomainServiceKit({
    id: "prehistoric-rush-terrain-lod-policy-kit",
    domain: "prehistoric-rush-terrain-lod",
    apiName: "prehistoricRushTerrainLod",
    version: "1.0.0",
    stability: "game",
    services: ["policy"],
    requires: ["n:core-graphics"],
    createApi({ engine }) {
      engine.n.coreGraphics.setDescriptor("terrainLodPolicies", policy.id, policy);
      return Object.freeze({
        getPolicy: () => structuredClone(policy),
        getSnapshot: () => ({ policy: structuredClone(policy) }),
        loadSnapshot: () => ({ policy: structuredClone(policy) }),
        reset: () => ({ policy: structuredClone(policy) })
      });
    },
    metadata: {
      purpose: "Renderer-neutral PrehistoricRush terrain resolution, quadtree distance, crack, morph, and clay surface policy.",
      owns: ["PrehistoricRush terrain LOD policy descriptor"],
      doesNotOwn: ["Three.js meshes", "GPU buffers", "terrain tessellation execution"],
      rendererAgnostic: true
    }
  });
}

export function createPrehistoricRushKitGraph(NexusEngine, NexusEngineKits, config = {}) {
  for (const factory of [
    "createCorePresentationDomain",
    "createCoreWorldDomain",
    "createUniformGridPartition",
    "createFlatWorldSurface",
    "createTerrainLodPolicyDescriptor"
  ]) {
    if (typeof NexusEngine?.[factory] !== "function") {
      throw new TypeError(`Pinned NexusEngine module is missing ${factory}().`);
    }
  }

  const kits = createBasePrehistoricRushKitGraph(NexusEngine, NexusEngineKits, config);
  const productIndex = kits.findIndex((kit) => kit?.id === "prehistoric-rush-domain-kit");
  if (productIndex < 0) throw new Error("PrehistoricRush product domain was not composed.");

  return [
    ...kits.slice(0, productIndex),
    NexusEngine.createCoreWorldDomain(config.coreWorld ?? {}),
    ...NexusEngine.createCorePresentationDomain(),
    createPrehistoricTerrainLodPolicyKit(NexusEngine, config.terrainLod ?? {}),
    kits[productIndex],
    createPrehistoricRushCourseDomainKit(NexusEngine, config),
    createPrehistoricRushWorldCompositionDomainKit(NexusEngine, {
      recipes: config.worldRecipes,
      selectedWorldId: config.selectedWorldId,
      cellSize: config.worldCellSize ?? config.terrainLod?.patchSize,
      cellRadius: config.worldCellRadius ?? 2
    }),
    createPrehistoricRushPauseMenuDomainKit(NexusEngine),
    ...kits.slice(productIndex + 1)
  ];
}

export default createPrehistoricRushKitGraph;
