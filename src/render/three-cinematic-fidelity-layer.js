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

function createLightShafts(THREE, scene, count) {
  if (count < 1) return [];
  const geometry = new THREE.CylinderGeometry(0.45, 6.8, 54, 12, 1, true);
  geometry.translate(0, -10, 0);
  return Array.from({ length: count }, (_, index) => {
    const material = new THREE.MeshBasicMaterial({
      name: `prehistoric-light-shaft:${index}`,
      color: index % 2 ? 0xffe1a6 : 0xe9f1ba,
      transparent: true,
      opacity: 0.027 + (index % 3) * 0.008,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: true,
      toneMapped: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `prehistoric-canopy-light-shaft-${index}`;
    mesh.rotation.z = -0.16 - index * 0.012;
    mesh.renderOrder = 40;
    scene.add(mesh);
    return mesh;
  });
}

function createPostProcess(THREE, renderer, camera, profile) {
  if (!profile.postProcessing) return null;
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  const target = new THREE.WebGLRenderTarget(Math.max(1, size.x), Math.max(1, size.y), {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    depthBuffer: true,
    stencilBuffer: false
  });
  target.texture.name = "prehistoric-cinematic-color";
  target.depthTexture = new THREE.DepthTexture(Math.max(1, size.x), Math.max(1, size.y), THREE.UnsignedIntType);
  target.depthTexture.name = "prehistoric-cinematic-depth";

  const uniforms = {
    sceneColor: { value: target.texture },
    sceneDepth: { value: target.depthTexture },
    resolution: { value: size.clone() },
    cameraNear: { value: camera.near },
    cameraFar: { value: camera.far },
    time: { value: 0 },
    aoStrength: { value: profile.contactAO ? 0.48 : 0 },
    bloomStrength: { value: profile.bloom ? 0.18 : 0 },
    sharpenStrength: { value: profile.id === "cinematic" ? 0.2 : 0.14 }
  };
  const material = new THREE.ShaderMaterial({
    name: "prehistoric-cinematic-post",
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
    `,
    fragmentShader: `
      uniform sampler2D sceneColor;
      uniform sampler2D sceneDepth;
      uniform vec2 resolution;
      uniform float cameraNear;
      uniform float cameraFar;
      uniform float time;
      uniform float aoStrength;
      uniform float bloomStrength;
      uniform float sharpenStrength;
      varying vec2 vUv;

      float linearDepth(vec2 uv) {
        float depth = texture2D(sceneDepth, uv).x;
        float viewZ = (cameraNear * cameraFar) / ((cameraFar - cameraNear) * depth - cameraFar);
        return clamp((-viewZ - cameraNear) / (cameraFar - cameraNear), 0.0, 1.0);
      }
      float prehistoricLuminance(vec3 color) { return dot(color, vec3(0.2126, 0.7152, 0.0722)); }
      float hash21(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      vec3 grade(vec3 color) {
        color = max(vec3(0.0), color - 0.004);
        color = (color * (6.2 * color + 0.5)) / (color * (6.2 * color + 1.7) + 0.06);
        float luma = prehistoricLuminance(color);
        color = mix(vec3(luma), color, 1.09);
        color *= vec3(1.025, 1.015, 0.975);
        return clamp(color, 0.0, 1.0);
      }
      void main() {
        vec2 texel = 1.0 / max(resolution, vec2(1.0));
        vec3 center = texture2D(sceneColor, vUv).rgb;
        float centerDepth = linearDepth(vUv);
        float ao = 0.0;
        vec2 aoOffsets[8];
        aoOffsets[0]=vec2(1.0,0.0); aoOffsets[1]=vec2(-1.0,0.0); aoOffsets[2]=vec2(0.0,1.0); aoOffsets[3]=vec2(0.0,-1.0);
        aoOffsets[4]=vec2(1.0,1.0); aoOffsets[5]=vec2(-1.0,1.0); aoOffsets[6]=vec2(1.0,-1.0); aoOffsets[7]=vec2(-1.0,-1.0);
        for (int index = 0; index < 8; index++) {
          float sampleDepth = linearDepth(vUv + aoOffsets[index] * texel * 3.0);
          float delta = centerDepth - sampleDepth;
          ao += smoothstep(0.00002, 0.0016, delta) * (1.0 - smoothstep(0.0016, 0.009, delta));
        }
        ao = 1.0 - aoStrength * ao / 8.0 * (1.0 - smoothstep(0.12, 0.72, centerDepth));

        vec3 north = texture2D(sceneColor, vUv + vec2(0.0, texel.y)).rgb;
        vec3 south = texture2D(sceneColor, vUv - vec2(0.0, texel.y)).rgb;
        vec3 east = texture2D(sceneColor, vUv + vec2(texel.x, 0.0)).rgb;
        vec3 west = texture2D(sceneColor, vUv - vec2(texel.x, 0.0)).rgb;
        vec3 sharpened = center * (1.0 + sharpenStrength * 4.0) - (north + south + east + west) * sharpenStrength;

        vec3 bloom = vec3(0.0);
        vec2 bloomOffsets[8];
        bloomOffsets[0]=vec2(5.0,0.0); bloomOffsets[1]=vec2(-5.0,0.0); bloomOffsets[2]=vec2(0.0,5.0); bloomOffsets[3]=vec2(0.0,-5.0);
        bloomOffsets[4]=vec2(3.5,3.5); bloomOffsets[5]=vec2(-3.5,3.5); bloomOffsets[6]=vec2(3.5,-3.5); bloomOffsets[7]=vec2(-3.5,-3.5);
        for (int index = 0; index < 8; index++) {
          vec3 sampleColor = texture2D(sceneColor, vUv + bloomOffsets[index] * texel).rgb;
          bloom += sampleColor * smoothstep(0.69, 1.02, prehistoricLuminance(sampleColor));
        }
        vec3 color = sharpened * ao + bloom * (bloomStrength / 8.0);
        float vignette = 1.0 - smoothstep(0.32, 0.78, length(vUv - 0.5)) * 0.16;
        color = grade(color) * vignette;
        color += (hash21(gl_FragCoord.xy + time * 17.0) - 0.5) / 255.0;
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(quad);
  const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  function resizeIfNeeded() {
    const next = renderer.getDrawingBufferSize(new THREE.Vector2());
    if (next.x === uniforms.resolution.value.x && next.y === uniforms.resolution.value.y) return;
    target.setSize(Math.max(1, next.x), Math.max(1, next.y));
    uniforms.resolution.value.copy(next);
  }

  return {
    target,
    uniforms,
    render(worldScene, elapsed) {
      resizeIfNeeded();
      uniforms.time.value = elapsed;
      uniforms.cameraNear.value = camera.near;
      uniforms.cameraFar.value = camera.far;
      renderer.setRenderTarget(target);
      renderer.clear();
      renderer.render(worldScene, camera);
      renderer.setRenderTarget(null);
      renderer.render(scene, postCamera);
    },
    dispose() {
      target.dispose();
      quad.geometry.dispose();
      material.dispose();
    }
  };
}

export function createThreeCinematicFidelityLayer(THREE, options = {}) {
  const { scene, camera, renderer, profile, sun } = options;
  if (!scene || !camera || !renderer || !profile) throw new TypeError("Cinematic fidelity layer requires scene, camera, renderer, and quality profile.");
  const sky = createSkyDome(THREE, scene, profile);
  const shafts = createLightShafts(THREE, scene, profile.lightShafts);
  const post = createPostProcess(THREE, renderer, camera, profile);
  let elapsed = 0;
  let visible = true;

  function update(state = {}, deltaTime = 1 / 60) {
    elapsed += Math.max(0, Number(deltaTime) || 0);
    if (!visible) return;
    sky.uniforms.time.value = elapsed;
    sky.mesh.position.copy(camera.position);
    shafts.forEach((shaft, index) => {
      const phase = index * 2.399 + Math.floor(Number(state.z ?? 0) / 48) * 0.31;
      shaft.position.set(
        Number(state.x ?? 0) + Math.sin(phase) * (12 + index * 3.1),
        Number(state.y ?? 0) + 28,
        Number(state.z ?? 0) + 22 + Math.cos(phase * 1.17) * 36
      );
      shaft.material.opacity = (0.025 + (index % 3) * 0.008) * (0.82 + Math.sin(elapsed * 0.17 + phase) * 0.18);
    });
    if (sun) sky.uniforms.sunDirection.value.copy(sun.position).normalize();
  }

  return Object.freeze({
    view: Object.freeze({
      postProcessing: Boolean(post),
      contactAO: Boolean(profile.contactAO && post),
      bloom: Boolean(profile.bloom && post),
      cloudLayers: profile.cloudLayers,
      lightShafts: shafts.length,
      colorGrade: "filmic-jungle",
      sharpening: Boolean(post)
    }),
    update,
    setVisible(nextVisible) {
      visible = Boolean(nextVisible);
      sky.mesh.visible = visible;
      for (const shaft of shafts) shaft.visible = visible;
      return visible;
    },
    render(worldScene = scene) {
      if (!visible) renderer.render(worldScene, camera);
      else if (post) post.render(worldScene, elapsed);
      else renderer.render(worldScene, camera);
    },
    dispose() {
      scene.remove(sky.mesh);
      sky.mesh.geometry.dispose();
      sky.material.dispose();
      for (const shaft of shafts) {
        scene.remove(shaft);
        shaft.material.dispose();
      }
      shafts[0]?.geometry?.dispose?.();
      post?.dispose();
    }
  });
}

export default createThreeCinematicFidelityLayer;