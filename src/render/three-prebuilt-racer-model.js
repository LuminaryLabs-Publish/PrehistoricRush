import { RUNTIME_URLS } from "../shared/runtime-versions.js";

function parseGltf(loader, buffer) {
  return new Promise((resolve, reject) => loader.parse(buffer, "", resolve, reject));
}

function materialsOf(object) {
  const result = [];
  object.traverse((node) => {
    if (!node.isMesh || !node.material) return;
    result.push(...(Array.isArray(node.material) ? node.material : [node.material]));
  });
  return result;
}

export async function createThreePrebuiltRacerModel(THREE, modelBuffer, options = {}) {
  if (!(modelBuffer instanceof ArrayBuffer)) throw new TypeError("A racer GLB ArrayBuffer is required.");
  const { GLTFLoader } = await import(options.loaderModuleUrl ?? RUNTIME_URLS.threeGltfLoader);
  const gltf = await parseGltf(new GLTFLoader(), modelBuffer.slice(0));
  const object = gltf.scene;
  object.name = options.name ?? object.name ?? "prehistoric-rush-prebuilt-racer";
  object.traverse((node) => {
    if (!node.isMesh) return;
    node.castShadow = true;
    node.receiveShadow = true;
  });
  const mixer = new THREE.AnimationMixer(object);
  const actions = new Map(gltf.animations.map((clip) => [clip.name, mixer.clipAction(clip)]));
  const idle = actions.get("idle") ?? actions.values().next().value ?? null;
  const run = actions.get("run") ?? idle;
  const ability = actions.get("ability") ?? null;
  idle?.play();
  run?.play();
  if (idle && run && idle !== run) {
    idle.setEffectiveWeight(1);
    run.setEffectiveWeight(0);
  }
  let abilityActive = false;
  function update(state, dt) {
    const moving = Number(state?.speed ?? 0) > 0.8;
    if (idle && run && idle !== run) {
      idle.setEffectiveWeight(moving ? 0 : 1);
      run.setEffectiveWeight(moving ? 1 : 0);
      run.timeScale = Math.max(0.45, Math.min(2.4, Number(state?.speed ?? 0) / 11));
    }
    const nextAbility = state?.abilityStatus === "active";
    if (ability && nextAbility && !abilityActive) {
      ability.reset().setLoop(THREE.LoopOnce, 1).play();
      ability.clampWhenFinished = true;
    }
    abilityActive = nextAbility;
    mixer.update(Math.max(0, Number(dt) || 0));
  }
  function dispose() {
    mixer.stopAllAction();
    object.traverse((node) => {
      node.geometry?.dispose?.();
      const surfaces = Array.isArray(node.material) ? node.material : node.material ? [node.material] : [];
      for (const surface of surfaces) surface.dispose?.();
    });
  }
  return Object.freeze({ object, animations: Object.freeze([...actions.keys()]), update, dispose, materialCount: materialsOf(object).length });
}
