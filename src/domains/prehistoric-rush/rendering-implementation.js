export function createPrehistoricRushRenderingImplementation(THREE, { host, world } = {}) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 1200);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  host.append(renderer.domElement);

  const material = new THREE.MeshStandardMaterial({ color: 0x527449, roughness: 0.96 });
  const geometry = new THREE.PlaneGeometry(900, 900, 90, 90);
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.attributes.position;
  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const z = position.getZ(index) + 360;
    position.setXYZ(index, x, world.sampleElevation(x, z), z);
  }
  geometry.computeVertexNormals();
  scene.add(new THREE.Mesh(geometry, material));
  scene.add(new THREE.HemisphereLight(0xe1f2cf, 0x2c3d25, 1.5));

  function draw(state, framing) {
    if (framing) {
      camera.position.set(...framing.position);
      camera.lookAt(...framing.target);
    }
    renderer.render(scene, camera);
  }

  return Object.freeze({ scene, camera, renderer, draw, snapshot: () => ({ terrainAuthority: "n:world:foundation", vegetationEnabled: false }) });
}
