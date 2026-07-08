import { createEventBus } from "./domain-runtime/event-bus.js";
import { createDomainHost } from "./domain-runtime/domain-host.js";
import { createTickScheduler } from "./domain-runtime/tick-scheduler.js";
import { createDinoFormDomainKit, createDinoPoseDomainKit, createDinoMaterialDomainKit } from "./domains/dino/index.js";
import { createCameraDomainKit } from "./domains/camera/camera-domain-kit.js";
import { createHudDomainKit } from "./domains/hud/hud-domain-kit.js";

const eventBus = createEventBus();
const domainHost = createDomainHost({ eventBus });
const scheduler = createTickScheduler({ host: domainHost, eventBus });

const domains = [
  createDinoFormDomainKit({ entityId: "dino" }),
  createDinoPoseDomainKit({ entityId: "dino" }),
  createDinoMaterialDomainKit({ entityId: "dino" }),
  createCameraDomainKit(),
  createHudDomainKit()
];

for (const domain of domains) domainHost.install(domain);

function styleHud(ui) {
  if (!ui?.status || ui.status.dataset.readabilityHud === "on") return;
  ui.status.dataset.readabilityHud = "on";
  Object.assign(ui.status.style, {
    marginTop: "8px",
    fontSize: "12px",
    lineHeight: "1.25",
    color: "#fff5d1"
  });
  Object.assign(ui.button.style, {
    marginTop: "12px",
    padding: "10px 16px",
    borderRadius: "999px",
    background: "linear-gradient(180deg,#ffe08a,#ffbd45)",
    boxShadow: "0 8px 20px rgba(0,0,0,.24)",
    border: "1px solid rgba(255,239,174,.9)"
  });
}

function renderHud(app) {
  const s = app.state;
  const snap = app.physics?.getSnapshot?.();
  const target = 3600;
  const progress = Math.max(0, Math.min(1, s.distance / target));
  const bar = `<div style="height:8px;border-radius:999px;background:rgba(255,255,255,.18);overflow:hidden;margin:7px 0 8px"><div style="height:100%;width:${(progress * 100).toFixed(1)}%;background:linear-gradient(90deg,#ffd37a,#8fe8ff);"></div></div>`;
  app.ui.status.innerHTML = [
    `<div style="font-size:14px;font-weight:800;color:#ffd37a;margin-bottom:2px">Prehistoric Rush</div>`,
    `<div style="font-size:11px;opacity:.82;text-transform:uppercase;letter-spacing:.06em">${app.scene}</div>`,
    bar,
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 12px">`,
    `<span>${Math.floor(s.distance)}m / ${target}m</span><span>Shards ${s.shards}</span>`,
    `<span>Speed ${s.speed.toFixed(1)} m/s</span><span>Best ${Math.floor(s.best)}m</span>`,
    `</div>`,
    `<div style="opacity:.68;font-size:11px;margin-top:6px">Debug: chunks ${app.view.terrain.chunks.length} / heading ${Math.round(s.yaw * 180 / Math.PI)}° / Rapier ${snap?.enabled ? "on" : "fallback"}</div>`,
    `<div style="opacity:.8;font-size:11px;margin-top:2px">Close camera + bigger stride + DSK HUD</div>`
  ].join("");
}

function applyCloseCamera(app, THREE, dt) {
  const s = app.state;
  const v = app.view;
  const y = s.y + s.jumpY + 0.08;
  const back = new THREE.Vector3(-Math.sin(s.yaw), 0, -Math.cos(s.yaw));
  const forward = new THREE.Vector3(Math.sin(s.yaw), 0, Math.cos(s.yaw));
  const target = new THREE.Vector3(s.x, y + 3.0, s.z).addScaledVector(back, 7.2);
  v.camera.position.lerp(target, Math.min(1, dt * 8.5));
  v.camera.lookAt(new THREE.Vector3(s.x, y + 1.25, s.z).addScaledVector(forward, 10.5));
}

function applyReadableStride(app) {
  const s = app.state;
  const rig = app.view.player?.userData;
  if (!rig?.legL || !rig?.legR) return;
  const phase = s.time * Math.max(8, s.speed * 0.95);
  const stride = Math.sin(phase);
  const leftLift = Math.max(0, stride) * 0.18;
  const rightLift = Math.max(0, -stride) * 0.18;
  rig.legL.rotation.x = stride * 0.9;
  rig.legR.rotation.x = -stride * 0.9;
  rig.legL.position.y = leftLift;
  rig.legR.position.y = rightLift;
  rig.armL.rotation.x = -stride * 0.35 - 0.18;
  rig.armR.rotation.x = stride * 0.35 - 0.18;
  rig.hips.position.y = 0.95 + Math.abs(stride) * 0.11 + Math.min(1, s.jumpY / 2) * 0.12;
  rig.head.rotation.x = 0.08 - Math.abs(stride) * 0.07;
  rig.tail?.forEach((seg, i) => {
    const k = i / Math.max(1, rig.tail.length - 1);
    seg.rotation.y = -s.turn * (0.28 + k * 0.38) + Math.sin(s.time * 4 - i * 0.45) * (0.09 + k * 0.04);
  });
}

function startPresentationPass() {
  let last = performance.now();
  requestAnimationFrame(function pass(now) {
    const host = globalThis.PrehistoricRushHost;
    const app = host?.app;
    if (app?.THREE && app?.view && app?.state) {
      const dt = Math.min(0.05, (now - last) / 1000);
      styleHud(app.ui);
      applyReadableStride(app);
      applyCloseCamera(app, app.THREE, dt);
      renderHud(app);
      app.view.renderer.render(app.view.scene, app.view.camera);
    }
    last = now;
    requestAnimationFrame(pass);
  });
}

globalThis.PrehistoricRushComposition = {
  version: "dsk-composition-v3-presentation-pass",
  mode: "legacy-visual-runtime-with-camera-hud-dino-presentation-domains",
  eventBus,
  domainHost,
  scheduler,
  snapshot() {
    return {
      version: this.version,
      mode: this.mode,
      domains: domainHost.snapshot(),
      events: eventBus.snapshot(),
      scheduler: scheduler.snapshot()
    };
  }
};

eventBus.emit("composition.ready", {
  version: globalThis.PrehistoricRushComposition.version,
  domains: domainHost.snapshot().domains
});

// Keep the live game playable while the monolith is cut apart one domain at a time.
await import("./runtime-terrain-v6.mjs");
startPresentationPass();
