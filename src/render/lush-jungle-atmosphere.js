function nowMs() {
  return globalThis.performance?.now?.() ?? Date.now();
}

function installShadowUpdateGate(renderer, sun, options = {}) {
  if (!renderer?.shadowMap || !sun || typeof renderer.render !== "function") return null;
  renderer.userData ??= {};
  if (renderer.userData.prehistoricShadowUpdateGate) return renderer.userData.prehistoricShadowUpdateGate;

  const movementThreshold = Math.max(1, Number(options.shadowUpdateDistance ?? 24));
  const maximumIntervalMs = Math.max(250, Number(options.shadowUpdateIntervalMs ?? 1250));
  const movementThresholdSq = movementThreshold * movementThreshold;
  const originalRender = renderer.render.bind(renderer);
  let lastX = Number(sun.position?.x ?? 0);
  let lastY = Number(sun.position?.y ?? 0);
  let lastZ = Number(sun.position?.z ?? 0);
  let lastUpdateAt = nowMs();
  let requestedUpdates = 1;

  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;

  const gate = {
    request() {
      renderer.shadowMap.needsUpdate = true;
      lastX = Number(sun.position?.x ?? 0);
      lastY = Number(sun.position?.y ?? 0);
      lastZ = Number(sun.position?.z ?? 0);
      lastUpdateAt = nowMs();
      requestedUpdates += 1;
    },
    snapshot() {
      return Object.freeze({
        mode: "threshold",
        autoUpdate: renderer.shadowMap.autoUpdate,
        movementThreshold,
        maximumIntervalMs,
        requestedUpdates
      });
    }
  };

  renderer.render = function prehistoricShadowGatedRender(...args) {
    const x = Number(sun.position?.x ?? 0);
    const y = Number(sun.position?.y ?? 0);
    const z = Number(sun.position?.z ?? 0);
    const dx = x - lastX;
    const dy = y - lastY;
    const dz = z - lastZ;
    const currentTime = nowMs();
    const movedEnough = dx * dx + dy * dy + dz * dz >= movementThresholdSq;
    const intervalElapsed = currentTime - lastUpdateAt >= maximumIntervalMs;
    if (!renderer.shadowMap.needsUpdate && (movedEnough || intervalElapsed)) gate.request();
    return originalRender(...args);
  };

  renderer.userData.prehistoricShadowUpdateGate = gate;
  return gate;
}

export function applyLushJungleAtmosphere(THREE, scene, renderer, options = {}) {
  if (!scene || !renderer) throw new TypeError("Lush jungle atmosphere requires scene and renderer.");
  const background = new THREE.Color(options.background ?? 0x8eb8a0);
  const fogColor = new THREE.Color(options.fogColor ?? 0x86ad98);
  scene.background = background;
  scene.fog = new THREE.FogExp2(fogColor, Number(options.fogDensity ?? 0.0062));
  renderer.toneMappingExposure = Number(options.exposure ?? 1.08);

  let hemisphere = null;
  let sun = null;
  scene.traverse((object) => {
    if (!hemisphere && object?.isHemisphereLight) hemisphere = object;
    if (!sun && object?.isDirectionalLight) sun = object;
  });
  if (hemisphere) {
    hemisphere.color.set(options.skyLight ?? 0xe1f2cf);
    hemisphere.groundColor.set(options.groundLight ?? 0x2c3d25);
    hemisphere.intensity = Number(options.hemisphereIntensity ?? 2.05);
  }
  if (sun) {
    sun.color.set(options.sunColor ?? 0xffdda0);
    sun.intensity = Number(options.sunIntensity ?? 3.05);
    const shadowMapSize = Math.max(512, Number(options.shadowMapSize ?? 3072));
    const shadowRadius = Math.max(24, Number(options.shadowRadius ?? 72));
    sun.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    sun.shadow.camera.left = -shadowRadius;
    sun.shadow.camera.right = shadowRadius;
    sun.shadow.camera.top = shadowRadius;
    sun.shadow.camera.bottom = -shadowRadius;
    sun.shadow.normalBias = 0.045;
    sun.shadow.camera.updateProjectionMatrix();
  }

  const shadowUpdateGate = installShadowUpdateGate(renderer, sun, options);

  const fill = new THREE.DirectionalLight(options.fillColor ?? 0x9fc9c7, Number(options.fillIntensity ?? 0.42));
  fill.name = "prehistoric-jungle-fill";
  fill.position.set(34, 24, 18);
  fill.castShadow = false;
  scene.add(fill);

  const canopyBounce = new THREE.AmbientLight(options.canopyBounceColor ?? 0x5f825d, Number(options.canopyBounceIntensity ?? 0.34));
  canopyBounce.name = "prehistoric-canopy-bounce";
  scene.add(canopyBounce);

  return Object.freeze({ background, fogColor, hemisphere, sun, fill, canopyBounce, shadowUpdateGate });
}

export default applyLushJungleAtmosphere;
