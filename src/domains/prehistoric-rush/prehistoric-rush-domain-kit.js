import {
  createPrehistoricRushDomainKit,
  createPrehistoricRushKitGraph as createBasePrehistoricRushKitGraph
} from "./prehistoric-rush-domain-runtime.js";
import { createPrehistoricRushPauseMenuDomainKit } from "./pause-menu-domain-kit.js";

export { createPrehistoricRushDomainKit };

export function createPrehistoricRushKitGraph(NexusEngine, NexusEngineKits, config = {}) {
  if (typeof NexusEngine?.createCorePresentationDomain !== "function") {
    throw new TypeError("Pinned NexusEngine module is missing createCorePresentationDomain().");
  }
  const kits = createBasePrehistoricRushKitGraph(NexusEngine, NexusEngineKits, config);
  const productIndex = kits.findIndex((kit) => kit?.id === "prehistoric-rush-domain-kit");
  if (productIndex < 0) throw new Error("PrehistoricRush product domain was not composed.");
  return [
    ...kits.slice(0, productIndex),
    ...NexusEngine.createCorePresentationDomain(),
    kits[productIndex],
    createPrehistoricRushPauseMenuDomainKit(NexusEngine),
    ...kits.slice(productIndex + 1)
  ];
}

export default createPrehistoricRushKitGraph;
