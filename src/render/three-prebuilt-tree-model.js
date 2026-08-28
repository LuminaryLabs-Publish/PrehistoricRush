import { RUNTIME_URLS } from "../shared/runtime-versions.js";

function parseGltf(loader, buffer) {
  return new Promise((resolve, reject) => loader.parse(buffer, "", resolve, reject));
}

function materialColor(material) {
  const color = material?.color;
  return [
    Number.isFinite(Number(color?.r)) ? Number(color.r) : 1,
    Number.isFinite(Number(color?.g)) ? Number(color.g) : 1,
    Number.isFinite(Number(color?.b)) ? Number(color.b) : 1
  ];
}

function appendMesh(THREE, mesh, positions, normals, colors, bounds) {
  const source = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
  if (!source.getAttribute("normal")) source.computeVertexNormals();
  source.applyMatrix4(mesh.matrixWorld);
  const positionAttribute = source.getAttribute("position");
  const normalAttribute = source.getAttribute("normal");
  const colorAttribute = source.getAttribute("color");
  const surface = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  const surfaceColor = materialColor(surface);
  for (let index = 0; index < positionAttribute.count; index += 1) {
    const x = positionAttribute.getX(index);
    const y = positionAttribute.getY(index);
    const z = positionAttribute.getZ(index);
    positions.push(x, y, z);
    bounds.expandByPoint(new THREE.Vector3(x, y, z));
    if (normalAttribute) normals.push(normalAttribute.getX(index), normalAttribute.getY(index), normalAttribute.getZ(index));
    else normals.push(0, 1, 0);
    if (colorAttribute) {
      colors.push(
        colorAttribute.getX(index) * surfaceColor[0],
        colorAttribute.getY(index) * surfaceColor[1],
        colorAttribute.getZ(index) * surfaceColor[2]
      );
    } else colors.push(...surfaceColor);
  }
  source.dispose?.();
}

function combineTreeMeshes(THREE, root) {
  const positions = [];
  const normals = [];
  const colors = [];
  const bounds = new THREE.Box3();
  root.updateMatrixWorld(true);
  root.traverse((mesh) => {
    if (mesh?.isMesh && mesh.geometry?.getAttribute?.("position")) appendMesh(THREE, mesh, positions, normals, colors, bounds);
  });
  if (positions.length === 0) throw new TypeError("Factory tree GLB contains no renderable mesh geometry.");

  const centerX = (bounds.min.x + bounds.max.x) * 0.5;
  const centerZ = (bounds.min.z + bounds.max.z) * 0.5;
  const groundY = bounds.min.y;
  for (let index = 0; index < positions.length; index += 3) {
    positions[index] -= centerX;
    positions[index + 1] -= groundY;
    positions[index + 2] -= centerZ;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  const normalizedBounds = geometry.boundingBox;
  return {
    geometry,
    bounds: Object.freeze({
      min: normalizedBounds.min.toArray(),
      max: normalizedBounds.max.toArray(),
      size: normalizedBounds.getSize(new THREE.Vector3()).toArray(),
      center: normalizedBounds.getCenter(new THREE.Vector3()).toArray(),
      width: normalizedBounds.max.x - normalizedBounds.min.x,
      height: normalizedBounds.max.y - normalizedBounds.min.y,
      depth: normalizedBounds.max.z - normalizedBounds.min.z
    })
  };
}

/**
 * Parse one factory-exported tree GLB and collapse all of its source meshes
 * into one vertex-coloured geometry. The tree fidelity layer then reuses that
 * geometry in InstancedMesh batches instead of creating one object per part.
 */
export async function createThreePrebuiltTreeModel(THREE, modelBuffer, options = {}) {
  if (!(modelBuffer instanceof ArrayBuffer)) throw new TypeError("A tree GLB ArrayBuffer is required.");
  const { GLTFLoader } = await import(options.loaderModuleUrl ?? RUNTIME_URLS.threeGltfLoader);
  const gltf = await parseGltf(new GLTFLoader(), modelBuffer.slice(0));
  const combined = combineTreeMeshes(THREE, gltf.scene);
  return Object.freeze({
    geometry: combined.geometry,
    bounds: combined.bounds,
    sourceMeshCount: (() => {
      let count = 0;
      gltf.scene.traverse((object) => { if (object?.isMesh) count += 1; });
      return count;
    })(),
    source: "factory-glb"
  });
}

export default createThreePrebuiltTreeModel;
