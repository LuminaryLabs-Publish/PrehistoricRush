function behaviorId(value, kind) {
  const id = String(value ?? "").trim();
  if (!id) throw new TypeError(`${kind} id must be a non-empty string.`);
  return id;
}

function definition(value, kind) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError(`${kind} definition must be an object.`);
  return Object.freeze({ ...value, id: behaviorId(value.id, kind) });
}

export function createRacerBehaviorRegistry() {
  const abilities = new Map();
  const passives = new Map();

  function registerAbility(value) {
    const next = definition(value, "Racer ability");
    if (abilities.has(next.id)) throw new Error(`Racer ability is already registered: ${next.id}.`);
    abilities.set(next.id, next);
    return next;
  }

  function registerPassive(value) {
    const next = definition(value, "Racer passive");
    if (passives.has(next.id)) throw new Error(`Racer passive is already registered: ${next.id}.`);
    passives.set(next.id, next);
    return next;
  }

  return Object.freeze({
    registerAbility,
    registerPassive,
    getAbility: (id) => id == null ? null : abilities.get(String(id)) ?? null,
    getPassive: (id) => id == null ? null : passives.get(String(id)) ?? null,
    listAbilities: () => [...abilities.values()],
    listPassives: () => [...passives.values()]
  });
}

export const DEFAULT_RACER_BEHAVIOR_REGISTRY = createRacerBehaviorRegistry();

export function registerRacerAbility(definition, registry = DEFAULT_RACER_BEHAVIOR_REGISTRY) {
  return registry.registerAbility(definition);
}

export function registerRacerPassive(definition, registry = DEFAULT_RACER_BEHAVIOR_REGISTRY) {
  return registry.registerPassive(definition);
}

registerRacerAbility({
  id: "vine-swing",
  canActivate: ({ state }) => Boolean(state.grounded),
  activate: () => ({ duration: 0.85, cooldown: 2.25, staminaCost: 24, verticalImpulse: 11, speedImpulse: 2.5, effect: "traversal-arc" }),
  getModifiers: () => ({ speedMultiplier: 1.12, turnMultiplier: 1.35, gravityMultiplier: 0.35 })
});

registerRacerPassive({
  id: "agile-landing",
  onLand: () => ({ recoveryMultiplier: 0.45 })
});

registerRacerAbility({
  id: "charge-ram",
  canActivate: ({ state }) => Boolean(state.grounded),
  activate: () => ({ duration: 0.9, cooldown: 2.2, staminaCost: 28, speedImpulse: 2.8, effect: "forward-displacement" }),
  getModifiers: () => ({ speedMultiplier: 1.32, turnMultiplier: 0.55, jumpImpulseMultiplier: 0 })
});

registerRacerPassive({
  id: "line-holder",
  modifySurfaceMultiplier: ({ targetMultiplier }) => 1 - (1 - targetMultiplier) * 0.65,
  onLand: () => ({ recoveryMultiplier: 0.8 })
});

registerRacerAbility({
  id: "roar-shockwave",
  canActivate: ({ state }) => Boolean(state.grounded),
  activate: () => ({ duration: 0.55, cooldown: 3.2, staminaCost: 26, speedImpulse: 1.2, effect: "radial-line-displacement" }),
  getModifiers: () => ({ speedMultiplier: 1.04, turnMultiplier: 0.82 })
});

registerRacerPassive({
  id: "heavy-momentum",
  modifyMovement: ({ state }) => ({
    speedMultiplier: 1.07 - Math.min(0.09, Math.abs(Number(state.steer ?? 0)) * 0.09),
    turnMultiplier: 0.94
  })
});

registerRacerAbility({
  id: "tail-sweep",
  canActivate: ({ state }) => Boolean(state.grounded),
  activate: () => ({ duration: 0.65, cooldown: 2.7, staminaCost: 22, effect: "wide-side-displacement" }),
  getModifiers: () => ({ speedMultiplier: 0.96, turnMultiplier: 1.28 })
});

registerRacerPassive({
  id: "wide-stability",
  modifyMovement: () => ({ turnMultiplier: 0.92 }),
  modifySurfaceMultiplier: ({ targetMultiplier }) => 1 - (1 - targetMultiplier) * 0.72
});

registerRacerAbility({
  id: "water-rush",
  activate: () => ({ duration: 1.05, cooldown: 2.5, staminaCost: 25, speedImpulse: 2, effect: "wet-line-rush" }),
  getModifiers: ({ state }) => ({ speedMultiplier: ["edge", "verge"].includes(state.region) ? 1.4 : 1.22, turnMultiplier: 1.08 })
});

registerRacerPassive({
  id: "amphibious",
  modifySurfaceMultiplier: ({ state, targetMultiplier }) => ["edge", "verge"].includes(state.region)
    ? Math.max(1.03, targetMultiplier)
    : targetMultiplier
});

registerRacerAbility({
  id: "tail-slam",
  canActivate: ({ state }) => Boolean(state.grounded),
  activate: () => ({ duration: 0.58, cooldown: 2.9, staminaCost: 21, effect: "rear-line-displacement" }),
  getModifiers: () => ({ speedMultiplier: 0.9, turnMultiplier: 0.7 })
});

registerRacerPassive({
  id: "armored-recovery",
  modifySurfaceMultiplier: ({ targetMultiplier }) => 1 - (1 - targetMultiplier) * 0.5,
  onLand: () => ({ recoveryMultiplier: 0.35 })
});

registerRacerAbility({
  id: "headbutt-redirect",
  activate: ({ intent }) => ({ duration: 0.52, cooldown: 1.9, staminaCost: 18, speedImpulse: 1.8, yawImpulse: Number(intent.steer || 1) * 0.14, effect: "impact-redirect" }),
  getModifiers: () => ({ speedMultiplier: 1.1, turnMultiplier: 1.75 })
});

registerRacerPassive({
  id: "impact-boost",
  onLand: ({ impactSpeed }) => ({ recoveryMultiplier: 0.6, speedBoost: Math.min(2.4, Number(impactSpeed ?? 0) * 0.12) })
});

registerRacerAbility({
  id: "sprint-burst",
  canActivate: ({ state }) => Boolean(state.grounded),
  activate: () => ({ duration: 0.72, cooldown: 2.15, staminaCost: 27, speedImpulse: 3.5, effect: "sprint-window" }),
  getModifiers: () => ({ speedMultiplier: 1.42, turnMultiplier: 0.74, accelerationMultiplier: 1.65 })
});

registerRacerPassive({
  id: "fast-acceleration",
  modifyMovement: () => ({ accelerationMultiplier: 1.28 })
});

registerRacerAbility({
  id: "momentum-run",
  canActivate: ({ state }) => Math.abs(Number(state.steer ?? 0)) < 0.45,
  activate: () => ({ duration: 1.45, cooldown: 2.35, staminaCost: 24, speedImpulse: 2.2, effect: "clean-line-pace" }),
  getModifiers: ({ state }) => ({ speedMultiplier: 1.2 - Math.min(0.12, Math.abs(Number(state.steer ?? 0)) * 0.12), turnMultiplier: 0.92 })
});

registerRacerPassive({
  id: "momentum-conservation",
  modifyMovement: ({ state }) => ({ speedMultiplier: 1.09 - Math.min(0.14, Math.abs(Number(state.steer ?? 0)) * 0.14) })
});

registerRacerAbility({
  id: "claw-vault",
  canActivate: ({ state }) => Boolean(state.grounded),
  activate: () => ({ duration: 0.95, cooldown: 2.2, staminaCost: 23, verticalImpulse: 13.5, speedImpulse: 1.5, effect: "vault-route" }),
  getModifiers: () => ({ speedMultiplier: 1.08, turnMultiplier: 1.22, gravityMultiplier: 0.72 })
});

registerRacerPassive({
  id: "long-reach",
  modifyMovement: () => ({ jumpImpulseMultiplier: 1.12 })
});

registerRacerAbility({
  id: "ground-stomp",
  canActivate: ({ state }) => Boolean(state.grounded),
  activate: () => ({ duration: 0.7, cooldown: 3.4, staminaCost: 30, effect: "terrain-line-pulse" }),
  getModifiers: () => ({ speedMultiplier: 0.86, turnMultiplier: 0.68 })
});

registerRacerPassive({
  id: "long-stride",
  modifyMovement: () => ({ speedMultiplier: 1.07, accelerationMultiplier: 0.92 }),
  modifySurfaceMultiplier: ({ targetMultiplier }) => 1 - (1 - targetMultiplier) * 0.7
});

registerRacerAbility({
  id: "glide-dive",
  activate: ({ state }) => ({
    duration: 1.35,
    cooldown: 2.45,
    staminaCost: 26,
    verticalImpulse: state.grounded ? 12 : 0,
    speedImpulse: 2,
    effect: "glide-dive-line"
  }),
  getModifiers: ({ state }) => ({ speedMultiplier: state.grounded ? 1.12 : 1.3, turnMultiplier: 1.42, gravityMultiplier: 0.42 })
});

registerRacerPassive({
  id: "air-control",
  modifyMovement: ({ state }) => state.grounded
    ? { turnMultiplier: 1 }
    : { turnMultiplier: 1.38, gravityMultiplier: 0.8 }
});
