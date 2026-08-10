export const PREHISTORIC_FOLIAGE_CARD_GEOMETRY_REVISION = "crossed-foliage-volume-v1";

function buildPlane(positions, uvs, indices, planeIndex, angle, hanging) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const bottom = hanging ? -1 : -0.5;
  const top = hanging ? 0 : 0.5;
  const corners = [
    [-0.5, bottom, 0, 0, 0],
    [0.5, bottom, 0, 1, 0],
    [0.5, top, 0, 1, 1],
    [-0.5, top, 0, 0, 1]
  ];
  const base = planeIndex * 4;
  for (const [x, y, z, u, v] of corners) {
    positions.push(x * cos + z * sin, y, -x * sin + z * cos);
    uvs.push(u, v);
  }
  indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
}

export function createPrehistoricFoliageCardGeometry(THREE, options = {}) {
  if (!THREE?.BufferGeometry || !THREE?.Float32BufferAttribute) throw new TypeError("Foliage card geometry requires THREE.BufferGeometry.");
  const planes = Math.max(1, Math.min(3, Math.floor(Number(options.planes ?? 2))));
  const hanging = options.hanging === true;
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let plane = 0; plane < planes; plane += 1) {
    buildPlane(positions, uvs, indices, plane, plane / planes * Math.PI, hanging);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData.foliageCardGeometryRevision = PREHISTORIC_FOLIAGE_CARD_GEOMETRY_REVISION;
  geometry.userData.crossedPlanes = planes;
  return geometry;
}

export default createPrehistoricFoliageCardGeometry;
