import {
  loadPlayerCharacterProfile,
  patchPlayerCharacterProfile,
  resetPlayerCharacterProfile,
  subscribePlayerCharacterProfile
} from "../shared/player-character-store.js";

const root = document.querySelector("#app") ?? document.body;
let draft = loadPlayerCharacterProfile();
let saveTimer = 0;

Object.assign(document.body.style, {
  margin: "0",
  minHeight: "100vh",
  background: "linear-gradient(135deg,#0a160f,#183322 55%,#09110c)",
  color: "#fff3c8",
  fontFamily: "system-ui,sans-serif"
});

root.innerHTML = `
  <main style="min-height:100vh;padding:24px;box-sizing:border-box">
    <section style="max-width:1080px;margin:0 auto">
      <header style="display:flex;justify-content:space-between;gap:18px;align-items:flex-start;flex-wrap:wrap;margin-bottom:22px">
        <div>
          <p style="margin:0 0 6px;color:#8fd487;font-weight:800;letter-spacing:.12em;text-transform:uppercase">Prehistoric Rush</p>
          <h1 style="margin:0;font-size:clamp(34px,6vw,64px)">Character Creator</h1>
          <p style="color:#c9d7c4;max-width:660px">Edits save automatically in this browser. The game reads the latest saved profile when a run page starts.</p>
        </div>
        <nav style="display:flex;gap:10px;flex-wrap:wrap">
          <a href="./menu.html" style="padding:11px 16px;border-radius:999px;background:#ffffff18;color:#fff3c8;text-decoration:none;font-weight:800">Menu</a>
          <a href="./game.html" style="padding:11px 16px;border-radius:999px;background:#ffd37a;color:#211704;text-decoration:none;font-weight:900">Play Raptor</a>
        </nav>
      </header>

      <div style="display:grid;grid-template-columns:minmax(280px,1fr) minmax(320px,1.2fr);gap:18px" id="creator-grid">
        <section style="padding:22px;border-radius:24px;background:#07110cdd;border:1px solid #ffffff18">
          <h2 style="margin-top:0">Live Profile</h2>
          <div id="preview" style="min-height:230px;border-radius:20px;background:radial-gradient(circle at 50% 35%,#ffffff18,#0004),#102318;display:grid;place-items:center;padding:20px;text-align:center"></div>
          <pre id="profile-json" style="white-space:pre-wrap;word-break:break-word;max-height:290px;overflow:auto;background:#0005;padding:14px;border-radius:14px;color:#bde5b7;font-size:12px"></pre>
        </section>

        <section style="padding:22px;border-radius:24px;background:#07110cdd;border:1px solid #ffffff18">
          <div id="controls" style="display:grid;gap:18px"></div>
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:22px;flex-wrap:wrap">
            <span id="save-status" style="color:#a9c8a4">Saved</span>
            <button id="reset-profile" type="button" style="padding:10px 16px;border:0;border-radius:999px;background:#5d2b26;color:#fff3e5;font-weight:800;cursor:pointer">Reset Defaults</button>
          </div>
        </section>
      </div>
    </section>
  </main>
`;

const controls = document.querySelector("#controls");
const preview = document.querySelector("#preview");
const profileJson = document.querySelector("#profile-json");
const saveStatus = document.querySelector("#save-status");

const definitions = [
  ["Body Scale", "proportions", "bodyScale", 0.55, 1.35, 0.01],
  ["Body Length", "proportions", "bodyLength", 0.85, 2.2, 0.01],
  ["Tail Length", "proportions", "tailLength", 0.8, 3.2, 0.01],
  ["Leg Length", "proportions", "legLength", 0.45, 1.35, 0.01],
  ["Head Forward", "proportions", "headForward", 0.65, 1.7, 0.01],
  ["Stride Swing", "animation", "strideSwing", 0.25, 1.5, 0.01],
  ["Tail Follow", "animation", "tailFollow", 0, 0.35, 0.01]
];

function controlMarkup() {
  const numeric = definitions.map(([label, group, key, min, max, step]) => `
    <label style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center">
      <span>${label}</span>
      <output data-output="${group}.${key}" style="color:#a9d79e"></output>
      <input data-group="${group}" data-key="${key}" type="range" min="${min}" max="${max}" step="${step}" style="grid-column:1/-1;width:100%">
    </label>
  `).join("");
  return `
    <div style="display:grid;gap:15px">
      <h2 style="margin:0">Body and Motion</h2>
      ${numeric}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <label style="display:grid;gap:8px">Skin Color<input data-color="skin" type="color" style="width:100%;height:48px;border:0;background:none"></label>
      <label style="display:grid;gap:8px">Underbelly<input data-color="underbelly" type="color" style="width:100%;height:48px;border:0;background:none"></label>
    </div>
  `;
}

controls.innerHTML = controlMarkup();

function readValue(group, key) {
  return draft.creature.preset[group][key];
}

function render() {
  const preset = draft.creature.preset;
  for (const input of controls.querySelectorAll("input[data-group]")) {
    const value = readValue(input.dataset.group, input.dataset.key);
    input.value = String(value);
    const output = controls.querySelector(`[data-output="${input.dataset.group}.${input.dataset.key}"]`);
    if (output) output.textContent = Number(value).toFixed(2);
  }
  for (const input of controls.querySelectorAll("input[data-color]")) input.value = preset.material[input.dataset.color];

  preview.innerHTML = `
    <div>
      <div style="width:${Math.round(92 * preset.proportions.bodyScale)}px;height:${Math.round(58 * preset.proportions.bodyScale)}px;margin:0 auto 18px;border-radius:55% 48% 45% 55%;background:${preset.material.skin};position:relative;box-shadow:inset 0 -16px 0 ${preset.material.underbelly}55,0 18px 30px #0008">
        <span style="position:absolute;width:${Math.round(80 * preset.proportions.tailLength / 1.8)}px;height:18px;right:82%;top:23px;background:${preset.material.skin};transform:rotate(-10deg);transform-origin:right center;border-radius:100% 0 0 100%"></span>
        <span style="position:absolute;width:46px;height:34px;left:82%;top:-8px;background:${preset.material.skin};border-radius:55%"></span>
      </div>
      <strong style="display:block;font-size:20px">${draft.profileId}</strong>
      <span style="color:#c3d4bd">Revision ${draft.revision} · ${preset.material.skin}</span>
    </div>
  `;
  profileJson.textContent = JSON.stringify(draft, null, 2);
}

function scheduleSave(patch) {
  draft = {
    ...draft,
    creature: {
      ...draft.creature,
      preset: {
        ...draft.creature.preset,
        ...patch
      }
    }
  };
  render();
  saveStatus.textContent = "Saving…";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    draft = patchPlayerCharacterProfile({ creature: { preset: patch } });
    saveStatus.textContent = `Saved revision ${draft.revision}`;
    render();
  }, 140);
}

controls.addEventListener("input", (event) => {
  const input = event.target;
  if (input.dataset.group && input.dataset.key) {
    scheduleSave({
      [input.dataset.group]: {
        ...draft.creature.preset[input.dataset.group],
        [input.dataset.key]: Number(input.value)
      }
    });
  } else if (input.dataset.color) {
    scheduleSave({
      material: {
        ...draft.creature.preset.material,
        [input.dataset.color]: input.value
      }
    });
  }
});

document.querySelector("#reset-profile").addEventListener("click", () => {
  clearTimeout(saveTimer);
  draft = resetPlayerCharacterProfile();
  saveStatus.textContent = `Reset to revision ${draft.revision}`;
  render();
});

subscribePlayerCharacterProfile(({ source, profile }) => {
  if (source === "local") return;
  draft = profile;
  saveStatus.textContent = `Updated from ${source}`;
  render();
});

render();
