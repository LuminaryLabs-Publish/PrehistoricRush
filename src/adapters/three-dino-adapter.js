export function createThreeDinoAdapter({ THREE }) {
  const cache = new Map();

  function material(color, options = {}) {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: options.emissive ?? 0x000000,
      emissiveIntensity: options.emissive ? 0.22 : 0,
      roughness: 0.82,
      metalness: 0.02,
      flatShading: true
    });
  }

  function applyDescriptor(entityId, descriptors = {}) {
    const state = cache.get(entityId) ?? { entityId, descriptors: {} };
    state.descriptors = { ...state.descriptors, ...descriptors };
    cache.set(entityId, state);
    return state;
  }

  function snapshot() {
    return {
      adapter: "three-dino-adapter",
      entities: [...cache.keys()],
      descriptors: [...cache.values()]
    };
  }

  return { material, applyDescriptor, snapshot };
}
