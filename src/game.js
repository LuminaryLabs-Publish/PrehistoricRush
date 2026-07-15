const appRoot = document.querySelector("#app") ?? document.body;

function removeLegacyHud(node) {
  if (!(node instanceof Element)) return;
  if (node.matches("aside")) node.remove();
  else node.querySelectorAll("aside").forEach((element) => element.remove());
}

removeLegacyHud(appRoot);
const hudObserver = new MutationObserver((records) => {
  for (const record of records) {
    for (const node of record.addedNodes) removeLegacyHud(node);
  }
});
hudObserver.observe(appRoot, { childList: true, subtree: true });

await import("./game-runtime-lod.js");

function createPauseMenuHost(root, pauseMenu) {
  let overlay = null;
  let renderedSequence = -1;

  function button(label, action) {
    const element = document.createElement("button");
    element.type = "button";
    element.textContent = label;
    Object.assign(element.style, {
      width: "100%",
      minHeight: "44px",
      border: "1px solid rgba(255,255,255,.16)",
      borderRadius: "12px",
      background: "rgba(255,255,255,.1)",
      color: "#fff3c8",
      font: "800 16px system-ui,sans-serif",
      cursor: "pointer"
    });
    element.addEventListener("click", action);
    return element;
  }

  function destroyOverlay() {
    overlay?.remove();
    overlay = null;
  }

  function sync() {
    const state = pauseMenu.getState();
    if (state.sequence === renderedSequence) return;
    renderedSequence = state.sequence;
    if (!state.open) {
      destroyOverlay();
      return;
    }

    destroyOverlay();
    overlay = document.createElement("section");
    overlay.dataset.presentationId = "prehistoric-rush-pause-overlay";
    overlay.setAttribute("aria-label", "Pause menu");
    overlay.setAttribute("aria-modal", "false");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "20",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "clamp(18px,4vw,48px)",
      background: "rgba(2,10,6,.28)",
      pointerEvents: "auto"
    });

    const panel = document.createElement("div");
    Object.assign(panel.style, {
      width: "min(240px,calc(100vw - 36px))",
      padding: "18px",
      border: "1px solid rgba(255,255,255,.14)",
      borderRadius: "18px",
      background: "rgba(5,15,9,.88)",
      boxShadow: "0 18px 48px rgba(0,0,0,.34)",
      backdropFilter: "blur(10px)"
    });

    const title = document.createElement("h1");
    title.textContent = state.view === "settings" ? "Settings" : "Pause";
    Object.assign(title.style, { margin: "0 0 14px", font: "800 26px/1 system-ui,sans-serif", color: "#ffd37a" });
    panel.append(title);

    if (state.view === "settings") {
      const message = document.createElement("p");
      message.textContent = "No adjustable settings are currently exposed.";
      Object.assign(message.style, { margin: "0 0 14px", color: "#d7dfd1", font: "14px/1.45 system-ui,sans-serif" });
      panel.append(message);
    }

    const actions = document.createElement("div");
    Object.assign(actions.style, { display: "grid", gap: "10px" });
    actions.append(
      button("Settings", () => {
        pauseMenu.showSettings();
        sync();
      }),
      button("Exit", () => {
        pauseMenu.requestExit();
        sync();
        globalThis.location.href = "./menu.html";
      })
    );
    panel.append(actions);
    overlay.append(panel);
    root.append(overlay);
  }

  return Object.freeze({ sync, destroy: destroyOverlay });
}

function attachPauseMenuHost() {
  const runtime = globalThis.PrehistoricRushHost;
  const pauseMenu = runtime?.engine?.n?.prehistoricRushPauseMenu;
  if (!pauseMenu) {
    requestAnimationFrame(attachPauseMenuHost);
    return;
  }

  hudObserver.disconnect();
  removeLegacyHud(appRoot);
  const host = createPauseMenuHost(appRoot, pauseMenu);
  addEventListener("keydown", (event) => {
    if (event.code !== "Escape" || event.repeat) return;
    event.preventDefault();
    pauseMenu.toggle();
    host.sync();
  });
  host.sync();
  globalThis.PrehistoricRushPauseMenuHost = Object.freeze({ pauseMenu, host });
}

attachPauseMenuHost();
