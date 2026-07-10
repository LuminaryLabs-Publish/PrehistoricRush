import { createProceduralDinoBodyDomainKit } from "./src/domains/dino/procedural-dino-body-domain-kit.js";
const kit = createProceduralDinoBodyDomainKit();
const descriptor = kit.getDescriptor();
if (!descriptor.topology.singleSkinnedSurface) throw new Error("single skinned surface missing");
if (!descriptor.topology.triangulated) throw new Error("triangulated topology missing");
if (descriptor.topology.tailSegments !== 7) throw new Error("tail topology mismatch");
if (descriptor.proportions.bodyScale <= 0) throw new Error("body scale invalid");
console.log(JSON.stringify({ id: kit.id, version: descriptor.version, topology: descriptor.topology, proportions: descriptor.proportions }, null, 2));
