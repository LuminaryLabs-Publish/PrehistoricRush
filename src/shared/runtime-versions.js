export const NEXUS_COMMIT = "d86188c66692d9c24815aa2b29612c70df8fde4e";
export const KITS_COMMIT = "9673594de5669b4691737b91a9d56fa282e74370";
export const PROTOKITS_COMMIT = "11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5";
export const THREE_VERSION = "0.179.1";
export const RAPIER_VERSION = "0.15.0";

export const RUNTIME_URLS = Object.freeze({
  nexus: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine@${NEXUS_COMMIT}/src/index.js`,
  seedKit: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine-Kits@${KITS_COMMIT}/kits/foundation/seed-kit/index.js`,
  creatureKit: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine-Kits@${KITS_COMMIT}/kits/procedural-creatures/procedural-creature-body-kit/index.js`,
  batchKit: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine-Kits@${KITS_COMMIT}/kits/render-descriptors/instanced-render-batch-kit/index.js`,
  patchKit: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine-Kits@${KITS_COMMIT}/kits/simulation/seeded-world-patch-controller-kit/index.js`,
  cameraKit: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine-Kits@${KITS_COMMIT}/kits/camera-feedback/camera-smooth-follow-kit/index.js`,
  three: `https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/build/three.module.js`,
  rapier: `https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@${RAPIER_VERSION}/rapier.es.js`,
  rapierKit: `https://cdn.jsdelivr.net/gh/LuminaryLabs-Agents/NexusEngine-ProtoKits@${PROTOKITS_COMMIT}/protokits/rapier-physics-domain-kit/index.js`
});
