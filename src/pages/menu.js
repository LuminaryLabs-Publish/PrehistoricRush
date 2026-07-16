import {
  loadPlayerCharacterProfile,
  subscribePlayerCharacterProfile
} from "../shared/player-character-store.js";
import { RUNTIME_URLS } from "../shared/runtime-versions.js";
import {
  TREE_FIDELITY_BUNDLE_ID,
  createPrehistoricTreeFidelityAssetRuntime
} from "../shared/tree-fidelity-assets.js";

const root = document.querySelector("#app") ?? document.body;

Object.assign(document.body.style, {
  margin: "0",
  minHeight: "100vh",
  background: "radial-gradient(circle at 70% 20%, #24452d 0, #10251a 42%, #07100b 100%)",
  color: "#fff3c8",
  fontFamily: "system-ui, sans-serif"
});

root.innerHTML = `
  <main style="min-height:100vh;display:grid;place-items:center;padding:24px;box-sizing:border-box">
    <section style="width:min(680px,100%);padding:34px;border:1px solid #ffffff22;border-radius:28px;background:#08130ddd;box-shadow:0 30px 80px #0008">
      <p style="margin:0 0 8px;color:#8fd487;font-weight:800;letter-spacing:.12em;text-transform:uppercase">Nexus Engine</p>
      <h1 style="margin:0;font-size:clamp(42px,8vw,82px);line-height:.92">Prehistoric<br>Rush</h1>
      <p style="max-width:560px;color:#d7e3cf;font-size:18px;line-height:1.55">Run a custom procedural raptor through a deterministic prehistoric forest.</p>
      <div id="profile-card" style="margin:24px 0;padding:18px;border-radius:18px;background:#ffffff0b;border:1px solid #ffffff17"></div>
      <nav style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
        <a href="./game.html" style="padding:13px 20px;border-radius:999px;background:#ffd37a;color:#211704;text-decoration:none;font-weight:900">Start Run</a>
        <a href="./charactercreator.html" style="padding:13px 20px;border-radius:999px;background:#69a94d;color:#071008;text-decoration:none;font-weight:900">Character Creator</a>
        <span id="tree-assets-status" style="font-size:13px;color:#aebca9">Preparing forest assets…</span>
      </nav>
    </section>
  </main>
`;

const card = document.querySelector("#profile-card");
const treeAssetsStatus = document.querySelector("#tree-assets-status");

function renderProfile(profile) {
  const preset = profile.creature.preset;
  card.innerHTML = `
    <div style="display:flex;align-items:center;gap:14px">
      <span style="width:44px;height:44px;border-radius:50%;background:${preset.material.skin};border:5px solid ${preset.material.underbelly};box-shadow:0 0 0 1px #ffffff33"></span>
      <div>
        <strong style="display:block;font-size:18px">Active Raptor</strong>
        <span style="color:#c1cfbc">Scale ${preset.proportions.bodyScale.toFixed(2)} · Tail ${preset.proportions.tailLength.toFixed(2)} · Revision ${profile.revision}</span>
      </div>
    </div>
  `;
}

async function preloadTreeFidelity() {
  try {
    const [NexusEngine, THREE] = await Promise.all([
      import(RUNTIME_URLS.nexus),
      import(RUNTIME_URLS.three)
    ]);
    const runtime = await createPrehistoricTreeFidelityAssetRuntime(NexusEngine, THREE);
    globalThis.PrehistoricRushMenuAssetRuntime = runtime;
    const receipt = await runtime.assets.requestBundle(TREE_FIDELITY_BUNDLE_ID, {
      priority: "background",
      onProgress(progress, detail) {
        treeAssetsStatus.textContent = `${detail ?? "Preparing forest assets"} · ${Math.round(progress * 100)}%`;
      }
    });
    treeAssetsStatus.textContent = receipt.cached ? "Forest assets cached" : "Forest assets ready";
  } catch (error) {
    console.warn("Tree fidelity preload did not complete in the menu.", error);
    treeAssetsStatus.textContent = "Forest assets will finish when the run starts";
  }
}

renderProfile(loadPlayerCharacterProfile());
subscribePlayerCharacterProfile(({ profile }) => renderProfile(profile));
requestAnimationFrame(() => preloadTreeFidelity());
