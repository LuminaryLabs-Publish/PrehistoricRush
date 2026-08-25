import assert from "node:assert/strict";
import { applyLushJungleAtmosphere } from "../src/render/lush-jungle-atmosphere.js";

class Color { constructor(value) { this.value = value; } set(value) { this.value = value; } }
class FogExp2 { constructor(color, density) { this.color = color; this.density = density; } }
class DirectionalLight {
  constructor(color = 0, intensity = 1) {
    this.isDirectionalLight = true;
    this.color = new Color(color);
    this.intensity = intensity;
    this.position = { x: 0, y: 0, z: 0, set: (x, y, z) => { this.position.x = x; this.position.y = y; this.position.z = z; } };
    this.shadow = { mapSize: { set() {} }, camera: { updateProjectionMatrix() {} } };
  }
}
class AmbientLight { constructor(color, intensity) { this.color = new Color(color); this.intensity = intensity; } }
const THREE = { Color, FogExp2, DirectionalLight, AmbientLight };
const hemisphere = { isHemisphereLight: true, color: new Color(0), groundColor: new Color(0), intensity: 0 };
const sun = new DirectionalLight();
const scene = {
  objects: [hemisphere, sun],
  traverse(callback) { for (const object of this.objects) callback(object); },
  add(...objects) { this.objects.push(...objects); }
};
let renders = 0;
const renderer = {
  userData: {},
  shadowMap: { autoUpdate: true, needsUpdate: false },
  render() { renders += 1; }
};

const atmosphere = applyLushJungleAtmosphere(THREE, scene, renderer, { shadowUpdateDistance: 24, shadowUpdateIntervalMs: 60000 });
assert.equal(renderer.shadowMap.autoUpdate, false, "shadow map must not redraw automatically every frame");
assert.equal(renderer.shadowMap.needsUpdate, true, "first frame must still build the shadow map");
renderer.render(scene, {});
renderer.shadowMap.needsUpdate = false;
for (let frame = 0; frame < 120; frame += 1) renderer.render(scene, {});
assert.equal(renderer.shadowMap.needsUpdate, false, "stationary lighting must not request shadow redraws every frame");

sun.position.set(12, 0, 0);
renderer.render(scene, {});
assert.equal(renderer.shadowMap.needsUpdate, false, "sub-threshold movement must keep the existing shadow map");
sun.position.set(25, 0, 0);
renderer.render(scene, {});
assert.equal(renderer.shadowMap.needsUpdate, true, "meaningful light-anchor movement must request one shadow update");
assert.equal(atmosphere.shadowUpdateGate.snapshot().requestedUpdates, 2, "only initial + threshold shadow updates should be requested");
assert.equal(renders, 123, "shadow gating must not suppress normal scene renders");
console.log("shadow update policy: ok", atmosphere.shadowUpdateGate.snapshot());
