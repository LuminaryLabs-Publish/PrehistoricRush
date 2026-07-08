export { createDinoFormDomainKit } from "./dino-form-domain-kit.js";
export { createDinoPoseDomainKit } from "./dino-pose-domain-kit.js";
export { createDinoMaterialDomainKit } from "./dino-material-domain-kit.js";

export function createDinoDomainBundle(config = {}) {
  return {
    id: "dino-domain-bundle",
    kind: "domain-bundle",
    domains: [
      createDinoFormDomainKit(config),
      createDinoPoseDomainKit(config),
      createDinoMaterialDomainKit(config)
    ]
  };
}
