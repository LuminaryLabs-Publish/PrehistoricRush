function createSkyDome(THREE, scene, profile) {
  const uniforms = {
    time: { value: 0 },
    sunDirection: { value: new THREE.Vector3(-0.42, 0.76, -0.5).normalize() },
    cloudStrength: { value: 0.22 + profile.cloudLayers * 0.055 }
  };
  const material = new THREE.ShaderMaterial({
    name: "prehistoric-cinematic-sky",
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    toneMapped: false,
    uniforms,
    vertexShader: `
      varying vec3 vSkyDirection;
      void main() {
        vSkyDirection = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float cloudStrength;
      uniform vec3 sunDirection;
      varying vec3 vSkyDirection;
      float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + 1.0), f.x), f.y);
      }
      float fbm(vec2 p) {
        float value = 0.0;
        value += noise(p) * 0.54; p = p * 2.03 + 11.7;
        value += noise(p) * 0.28; p = p * 2.07 - 7.2;
        value += noise(p) * 0.13; p = p * 2.11 + 3.4;
        value += noise(p) * 0.05;
        return value;
      }
      void main() {
        vec3 direction = normalize(vSkyDirection);
        float horizon = smoothstep(-0.12, 0.72, direction.y);
        vec3 horizonColor = vec3(0.53, 0.72, 0.68);
        vec3 zenithColor = vec3(0.22, 0.52, 0.76);
        vec3 color = mix(horizonColor, zenithColor, horizon);
        vec2 cloudUv = direction.xz / max(0.12, direction.y + 0.42) * 0.72;
        float cloud = fbm(cloudUv * 2.4 + vec2(time * 0.0035, time * 0.0014));
        cloud = smoothstep(0.52, 0.76, cloud) * smoothstep(-0.04, 0.24, direction.y);
        float sun = pow(max(0.0, dot(direction, sunDirection)), 420.0);
        float halo = pow(max(0.0, dot(direction, sunDirection)), 24.0);
        color = mix(color, vec3(1.0, 0.96, 0.84), cloud * cloudStrength);
        color += vec3(1.0, 0.72, 0.32) * sun * 3.4 + vec3(1.0, 0.78, 0.42) * halo * 0.18;
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(620, 40, 22), material);
  mesh.name = "prehistoric-cinematic-sky-dome";
  mesh.frustumCulled = false;
  mesh.renderOrder = -1000;
  scene.add(mesh);
  return { mesh, material, uniforms };
}

export function createThreeCinematicFidelityLayer(THREE, options = {}) {
  const { scene, camera, profile, sun } = options;
  if (!scene || !camera || !profile) throw new TypeError("Cinematic fidelity layer requires scene, camera, and quality profile.");
  const sky = createSkyDome(THREE, scene, profile);
  let elapsed = 0;
  let visible = true;

  function update(state = {}, deltaTime = 1 / 60) {
    elapsed += Math.max(0, Number(deltaTime) || 0);
    if (!visible) return;
    sky.uniforms.time.value = elapsed;
    sky.mesh.position.copy(camera.position);
    if (sun) sky.uniforms.sunDirection.value.copy(sun.position).normalize();
  }

  return Object.freeze({
    view: Object.freeze({
      cloudLayers: profile.cloudLayers
    }),
    update,
    setVisible(nextVisible) {
      visible = Boolean(nextVisible);
      sky.mesh.visible = visible;
      return visible;
    },
    dispose() {
      scene.remove(sky.mesh);
      sky.mesh.geometry.dispose();
      sky.material.dispose();
    }
  });
}

export default createThreeCinematicFidelityLayer;
