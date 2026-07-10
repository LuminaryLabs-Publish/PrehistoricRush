import { createRouteFieldDomainKit } from './src/domains/route/route-field-domain-kit.js';
import { createSurfaceTraversalDomainKit } from './src/domains/surface/surface-traversal-domain-kit.js';
import { createForestArchetypeDomainKit } from './src/domains/forest/forest-archetype-domain-kit.js';
import { createGrassPatchDomainKit } from './src/domains/grass/grass-patch-domain-kit.js';

const route = createRouteFieldDomainKit({ seed: 238991 });
const surface = createSurfaceTraversalDomainKit();
const forest = createForestArchetypeDomainKit();
const grass = createGrassPatchDomainKit();
if (route.samples.length < 1000) throw new Error('route did not generate enough samples');
const origin = route.nearest(0, 0, 0, 200);
if (!Number.isFinite(origin.distance)) throw new Error('route nearest query failed');
for (let i = 0; i < 120; i++) surface.update(i < 30 ? 'path' : i < 60 ? 'edge' : i < 90 ? 'verge' : 'forest', 1 / 60);
if (!(surface.getState().multiplier < 0.7)) throw new Error('surface slowdown failed');
if (forest.archetypes.some((tree) => tree.maxHeight < 24)) throw new Error('tree scale too small');
if (grass.scaleForRoute(1, 3.1) !== 0) throw new Error('grass path cutout failed');
console.log(JSON.stringify({ routeSamples: route.samples.length, origin, surface: surface.getState(), treeHeights: forest.archetypes.map((x) => [x.id, x.minHeight, x.maxHeight]), grassLayers: grass.layers }, null, 2));
