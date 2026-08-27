export const NEXUS_REF = "main";
export const NEXUS_COMMIT = "4d550be678b721a435495b7b8b7196c294cbc561";
export const KITS_COMMIT = "9fd5b10053135e278c84b8b1591aece5cc641da1";
export const PATCH_KIT_COMMIT = "6bcda82797ab7ba2929262fc9bb13eac3f9d3749";
export const PROTOKITS_COMMIT = "534e249346d94351baa4cfce9f2d3cd837362920";
export const THREE_VERSION = "0.179.1";
export const RAPIER_VERSION = "0.15.0";

export const NEXUS_SOURCE_BASE = `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine@${NEXUS_REF}/src`;
export const NEXUS_VALIDATED_SOURCE_BASE = `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine@${NEXUS_COMMIT}/src`;
const NEXUS_COMPUTE_BOOTSTRAP_URL = new URL("./nexus-compute-bootstrap.js", import.meta.url).href;

export const RUNTIME_URLS = Object.freeze({
  nexus: `${NEXUS_SOURCE_BASE}/index.js`,
  nexusRuntime: `${NEXUS_SOURCE_BASE}/core-domains/runtime/index.js`,
  nexusHost: `${NEXUS_SOURCE_BASE}/core-domains/host/index.js`,
  nexusCompute: NEXUS_COMPUTE_BOOTSTRAP_URL,
  nexusActor: `${NEXUS_SOURCE_BASE}/core-domains/actor/index.js`,
  nexusSpatial: `${NEXUS_SOURCE_BASE}/core-domains/spatial/index.js`,
  nexusInteraction: `${NEXUS_SOURCE_BASE}/core-domains/interaction/index.js`,
  nexusSimulation: `${NEXUS_SOURCE_BASE}/core-domains/simulation/index.js`,
  nexusSimulationRuntime: `${NEXUS_SOURCE_BASE}/core-domains/simulation/kits/simulation-kit/index.js`,
  nexusMotion: `${NEXUS_SOURCE_BASE}/core-domains/simulation/motion/kits/motion-kit/index.js`,
  nexusPhysics: `${NEXUS_SOURCE_BASE}/core-domains/simulation/physics/kits/physics-kit/index.js`,
  nexusAsset: `${NEXUS_SOURCE_BASE}/core-domains/asset/index.js`,
  nexusObject: `${NEXUS_SOURCE_BASE}/core-domains/object/index.js`,
  nexusWorld: `${NEXUS_SOURCE_BASE}/core-domains/world/index.js`,
  nexusFoundationSampling: `${NEXUS_SOURCE_BASE}/core-domains/world/world-foundation-domain/kits/foundation-sampling-kit/index.js`,
  nexusPresentation: `${NEXUS_SOURCE_BASE}/core-domains/presentation/index.js`,
  nexusGraphics: `${NEXUS_SOURCE_BASE}/core-domains/presentation/graphics/kits/graphics-kit/index.js`,
  nexusAnimation: `${NEXUS_SOURCE_BASE}/core-domains/presentation/animation/kits/animation-kit/index.js`,
  nexusRender: `${NEXUS_SOURCE_BASE}/core-domains/render/index.js`,
  seedKit: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine-Kits@${KITS_COMMIT}/kits/foundation/seed-kit/index.js`,
  creatureKit: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine-Kits@${KITS_COMMIT}/kits/procedural-creatures/procedural-creature-body-kit/legacy.js`,
  batchKit: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine-Kits@${KITS_COMMIT}/kits/render-descriptors/instanced-render-batch-kit/index.js`,
  patchKit: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine-Kits@${PATCH_KIT_COMMIT}/kits/simulation/seeded-world-patch-controller-kit/index.js`,
  cameraKit: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine-Kits@${KITS_COMMIT}/kits/camera-feedback/camera-smooth-follow-kit/index.js`,
  three: `https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/build/three.module.js`,
  threeGltfLoader: `https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/examples/jsm/loaders/GLTFLoader.js`,
  rapier: `https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@${RAPIER_VERSION}/rapier.es.js`,
  rapierKit: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Agents/NexusEngine-ProtoKits@${PROTOKITS_COMMIT}/protokits/rapier-physics-domain-kit/index.js`,
  articulatedRapierProvider: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Agents/NexusEngine-ProtoKits@${PROTOKITS_COMMIT}/protokits/rapier-physics-domain-kit/articulated-provider.js`
});

export const VALIDATED_RUNTIME_URLS = Object.freeze({
  nexusHost: `${NEXUS_VALIDATED_SOURCE_BASE}/core-domains/host/index.js`,
  nexusCompute: `${NEXUS_VALIDATED_SOURCE_BASE}/core-domains/compute/index.js`,
  nexusGraphics: `${NEXUS_VALIDATED_SOURCE_BASE}/core-domains/presentation/graphics/kits/graphics-kit/index.js`,
  nexusRender: `${NEXUS_VALIDATED_SOURCE_BASE}/core-domains/render/index.js`
});
