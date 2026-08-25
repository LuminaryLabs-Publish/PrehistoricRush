export const SOFT_PLASTIC_PROFILE = Object.freeze({
  metalness: 0,
  roughness: 0.52,
  clearcoat: 0.24,
  clearcoatRoughness: 0.62,
  sheen: 0.06
});

export function createSoftPlasticMaterial(THREE, {
  color,
  roughness = SOFT_PLASTIC_PROFILE.roughness,
  clearcoat = SOFT_PLASTIC_PROFILE.clearcoat,
  clearcoatRoughness = SOFT_PLASTIC_PROFILE.clearcoatRoughness,
  sheen = SOFT_PLASTIC_PROFILE.sheen,
  sheenColor = color,
  vertexColors = false,
  flatShading = false,
  side = THREE.FrontSide,
  transparent = false,
  opacity = 1
} = {}) {
  if (!THREE?.MeshPhysicalMaterial) throw new Error("Three.js MeshPhysicalMaterial is required.");
  if (color == null) throw new Error("A soft-plastic material color is required.");
  const material = new THREE.MeshPhysicalMaterial({
    color,
    metalness: SOFT_PLASTIC_PROFILE.metalness,
    roughness,
    clearcoat,
    clearcoatRoughness,
    sheen,
    sheenRoughness: 0.8,
    sheenColor,
    vertexColors,
    flatShading,
    side,
    transparent,
    opacity,
    dithering: true
  });
  material.userData.surfaceProfile = "prehistoric-soft-molded-plastic";
  return material;
}
