// Active compatibility contract: PrehistoricRush follows mutable NexusEngine/main.
export const NEXUS_REF = "main";
// Exact NexusEngine/main revision validated by the current production integration.
export const NEXUS_COMMIT = "f030abd8f648fc3bf1ac0a359e7a421822b41b88";
export const NEXUS_MODULE_BASE = `https://esm.sh/gh/LuminaryLabs-Dev/NexusEngine@${NEXUS_REF}`;
export const THREE_VERSION = "0.179.1";
export const THREE_MODULE_URL = `https://esm.sh/three@${THREE_VERSION}`;

export const RUNTIME_URLS = Object.freeze({
  nexusCore: `${NEXUS_MODULE_BASE}/domains/core`,
  nexusHost: `${NEXUS_MODULE_BASE}/domains/host`,
  nexusWorld: `${NEXUS_MODULE_BASE}/domains/world`,
  nexusFoundation: `${NEXUS_MODULE_BASE}/domains/world/foundation`,
  nexusWorldTerrain: `${NEXUS_MODULE_BASE}/domains/world/terrain`,
  nexusWorldLandform: `${NEXUS_MODULE_BASE}/domains/world/landform`,
  nexusWorldHydrology: `${NEXUS_MODULE_BASE}/domains/world/hydrology`,
  nexusWorldEcology: `${NEXUS_MODULE_BASE}/domains/world/ecology`,
  nexusWorldAtmosphere: `${NEXUS_MODULE_BASE}/domains/world/atmosphere`,
  nexusCompute: `${NEXUS_MODULE_BASE}/domains/compute`,
  nexusRender: `${NEXUS_MODULE_BASE}/domains/render`,
  nexusRenderContracts: `${NEXUS_MODULE_BASE}/domains/render/contracts`,
  nexusMath: `${NEXUS_MODULE_BASE}/domains/math`,
  nexusRig: `${NEXUS_MODULE_BASE}/domains/rig`,
  nexusIK: `${NEXUS_MODULE_BASE}/domains/ik`,
  nexusCreature: `${NEXUS_MODULE_BASE}/domains/creature`,
  nexusCreatureProto: `${NEXUS_MODULE_BASE}/domains/creature/proto`,
  nexusPresentation: `${NEXUS_MODULE_BASE}/domains/presentation`,
  nexusPresentationArchetype: `${NEXUS_MODULE_BASE}/domains/presentation/archetype`,
  nexusPresentationFidelity: `${NEXUS_MODULE_BASE}/domains/presentation/fidelity`,
  nexusPresentationArtifact: `${NEXUS_MODULE_BASE}/domains/presentation/artifact`,
  nexusInput: `${NEXUS_MODULE_BASE}/domains/input`,
  nexusContent: `${NEXUS_MODULE_BASE}/domains/content`,
  nexusVehicle: `${NEXUS_MODULE_BASE}/domains/vehicle`,
  nexusGameplay: `${NEXUS_MODULE_BASE}/domains/gameplay`,
  nexusPlayer: `${NEXUS_MODULE_BASE}/domains/player`,
  nexusRuntime: `${NEXUS_MODULE_BASE}/domains/runtime`,
  nexusRuntimeSequence: `${NEXUS_MODULE_BASE}/domains/runtime/sequence`,
  nexusSchedule: `${NEXUS_MODULE_BASE}/domains/runtime/schedule`,
  three: THREE_MODULE_URL
});
