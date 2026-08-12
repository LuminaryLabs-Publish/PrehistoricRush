import {
  loadPlayerCharacterProfile,
  subscribePlayerCharacterProfile
} from "../shared/player-character-store.js";
import { RUNTIME_URLS } from "../shared/runtime-versions.js";
import {
  TREE_FIDELITY_BUNDLE_ID,
  TREE_FIDELITY_PROVIDER_ID,
  createPrehistoricTreeFidelityAssetRuntime
} from "../shared/prehistoric-tree-fidelity-runtime.js";
import {
  PREHISTORIC_WORLD_RECIPES,
  getPrehistoricRushWorldRecipe,
  resolvePrehistoricRushWorldId
} from "../domains/prehistoric-rush/world-recipes.js";

const root = document.querySelector("#app") ?? document.body;
let selectedWorldId = resolvePrehistoricRushWorldId(globalThis.location);

Object.assign(document.body.style, {
  margin: "0",
  minHeight: "100vh",
  background: "radial-gradient(circle at 70% 20%, #24452d 0, #10251a 42%, #07100b 100%)",
  color: "#fff3c8",
  fontFamily: "system-ui, sans-serif"
});

root.innerHTML = `
  <main style="min-height:100vh;display:grid;place-items:center;padding:24px;box-sizing:border-box">
    <section style="width:min(820px,100%);padding:34px;border:1px solid #ffffff22;border-radius:28px;background:#08130ddd;box-shadow:0 30px 80px #0008">
      <p style="margin:0 0 8px;color:#8fd487;font-weight:800;letter-spacing:.12em;text-transform:uppercase">Nexus Engine</p>
      <h1 style="margin:0;font-size:clamp(42px,8vw,82px);line-height:.92">Prehistoric<br>Rush</h1>
      <p style="max-width:620px;color:#d7e3cf;font-size:18px;line-height:1.55">Choose a procedural world, then run the same Prehistoric Rush game scene through that world recipe.</p>
      <div id="profile-card" style="margin:24px 0;padding:18px;border-radius:18px;background:#ffffff0b;border:1px solid #ffffff17"></div>
      <section aria-labelledby="world-selector-title" style="margin:0 0 24px">
        <h2 id="world-selector-title" style="margin:0 0 12px;font-size:18px">World</h2>
        <div id="world-selector" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px"></div>
        <div id="world-detail" style="margin-top:12px;padding:14px 16px;border-radius:14px;background:#ffffff09;border:1px solid #ffffff12;color:#cdd9c8"></div>
      </section>
      <nav style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
        <a id="start-run" href="./game.html" style="padding:13px 20px;border-radius:999px;background:#ffd37a;color:#211704;text-decoration:none;font-weight:900">Start Run</a>
        <a href="./charactercreator.html" style="padding:13px 20px;border-radius:999px;background:#69a94d;color:#071008;text-decoration:none;font-weight:900">Character Creator</a>
        <span id="tree-assets-status" style="font-size:13px;color:#aebca9">Preparing shared vegetation assets…</span>
      </nav>
    </section>
  </main>
`;

const card = document.querySelector("#profile-card");
const treeAssetsStatus = document.querySelector("#tree-assets-status");
const worldSelector = document.querySelector("#world-selector");
const worldDetail = document.querySelector("#world-detail");
const startRun = document.querySelector("#start-run");

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

function renderWorldSelection() {
  worldSelector.replaceChildren();
  for (const recipe of PREHISTORIC_WORLD_RECIPES) {
    const selected = recipe.id === selectedWorldId;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.worldId = recipe.id;
    button.setAttribute("aria-pressed", String(selected));
    button.textContent = recipe.name;
    Object.assign(button.style, {
      minHeight: "48px",
      padding: "10px 12px",
      borderRadius: "12px",
      border: selected ? "1px solid #ffd37a" : "1px solid #ffffff1c",
      background: selected ? "#ffd37a1f" : "#ffffff08",
      color: selected ? "#ffe5a7" : "#d8e2d3",
      font: "800 14px system-ui,sans-serif",
      textAlign: "left",
      cursor: "pointer"
    });
    button.addEventListener("click", () => {
      selectedWorldId = recipe.id;
      const url = new URL(globalThis.location.href);
      url.searchParams.set("world", selectedWorldId);
      globalThis.history?.replaceState?.({}, "", url);
      renderWorldSelection();
    });
    worldSelector.append(button);
  }

  const recipe = getPrehistoricRushWorldRecipe(selectedWorldId);
  startRun.href = `./game.html?world=${encodeURIComponent(recipe.id)}`;
  worldDetail.innerHTML = `
    <strong style="display:block;color:#ffd37a;margin-bottom:4px">${recipe.name}</strong>
    <span>${recipe.description}</span>
    <small style="display:block;margin-top:8px;color:#9fb09a">Seed ${recipe.seed} · Goal ${recipe.runtime.goalDistance}m · Recipe r${recipe.revision}</small>
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
        treeAssetsStatus.textContent = `${detail ?? "Preparing shared vegetation assets"} · ${Math.round(progress * 100)}%`;
      }
    });
    runtime.assets.unregisterProvider(TREE_FIDELITY_PROVIDER_ID);
    treeAssetsStatus.textContent = receipt.cached ? "Shared vegetation cached" : "Shared vegetation ready";
  } catch (error) {
    console.warn("Tree fidelity preload did not complete in the menu.", error);
    treeAssetsStatus.textContent = "Shared vegetation will finish when the run starts";
  }
}

renderProfile(loadPlayerCharacterProfile());
renderWorldSelection();
subscribePlayerCharacterProfile(({ profile }) => renderProfile(profile));
requestAnimationFrame(() => preloadTreeFidelity());
