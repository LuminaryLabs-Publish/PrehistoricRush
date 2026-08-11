export const PREHISTORIC_FOLIAGE_CARD_GEOMETRY_REVISION = "crossed-foliage-volume-v2-efficient";

function appendPlane(positions, uvs, indices, planeIndex, angle, hanging) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const minY = hanging ? -1 : -0.5;
  const midY = hanging ? -0.5 : 0;
  const maxY = hanging ? 0 : 0.5;
  const rows = [
    [-0.5, minY, 0], [0.5, minY, 0],
    [-0.5, midY, 0], [0.5, midY, 0],
    [-0.5, maxY, 0], [0.5, maxY, 0]
  ];
  const base = planeIndex * 6;
  for (let index = 0; index < rows.length; index += 1) {
    const [x, y, z] = rows[index];
    positions.push(x * cos + z * sin, y, -x * sin + z * cos);
    const row = Math.floor(index / 2);
    uvs.push(index % 2, row * 0.5);
  }
  indices.push(
    base, base + 1, base + 2,
    base + 1, base + 3, base + 2,
    base + 2, base + 3, base + 4,
    base + 3, base + 5, base + 4
  );
}

export function createPrehistoricFoliageCardGeometry(THREE, options = {}) {
  if (!THREE?.BufferGeometry || !THREE?.Float32BufferAttribute) {
    throw new TypeError("Prehistoric foliage card geometry requires THREE.BufferGeometry.");
  }
  const planes = Math.max(1, Math.min(3, Math.floor(Number(options.planes ?? 2))));
  const hanging = options.hanging === true;
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let plane = 0; plane < planes; plane += 1) {
    appendPlane(positions, uvs, indices, plane, plane / planes * Math.PI, hanging);
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
  geometry.userData.instanceEfficient = true;
  return geometry;
}

export default createPrehistoricFoliageCardGeometry;
