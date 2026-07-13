const clone = (value) => value === undefined ? undefined : structuredClone(value);

export const PREHISTORIC_RUSH_PAUSE_MENU_DESCRIPTOR = Object.freeze({
  id: "prehistoric-rush-pause-menu",
  kind: "menu",
  modal: false,
  blocksSimulation: false,
  items: Object.freeze([
    Object.freeze({ id: "settings", label: "Settings" }),
    Object.freeze({ id: "exit", label: "Exit" })
  ])
});

export const PREHISTORIC_RUSH_PAUSE_OVERLAY_DESCRIPTOR = Object.freeze({
  id: "prehistoric-rush-pause-overlay",
  layer: "overlay",
  visibleWhen: "pause-menu.open",
  backdrop: "soft",
  capturesPointer: true,
  blocksSimulation: false
});

function initialState() {
  return {
    open: false,
    view: "main",
    selectedAction: null,
    sequence: 0
  };
}

export function createPrehistoricRushPauseMenuDomainKit(NexusEngine, config = {}) {
  const { defineDomainServiceKit, defineResource, defineEvent } = NexusEngine;
  const State = defineResource("prehistoric-rush.pause-menu.state");
  const Opened = defineEvent("prehistoric-rush.pause-menu.opened");
  const Closed = defineEvent("prehistoric-rush.pause-menu.closed");
  const SettingsShown = defineEvent("prehistoric-rush.pause-menu.settings-shown");
  const ExitRequested = defineEvent("prehistoric-rush.pause-menu.exit-requested");
  const Reset = defineEvent("prehistoric-rush.pause-menu.reset");

  return defineDomainServiceKit({
    id: config.id ?? "prehistoric-rush-pause-menu-domain-kit",
    domain: "prehistoric-rush-pause-menu",
    domainPath: "n:prehistoric-rush:pause-menu",
    parentDomainPath: "n:prehistoric-rush",
    apiName: config.apiName ?? "prehistoricRushPauseMenu",
    version: "1.0.0",
    stability: "game",
    services: ["state", "commands", "snapshot"],
    requires: ["n:core-ui", "n:presentation"],
    resources: { State },
    events: { Opened, Closed, SettingsShown, ExitRequested, Reset },
    initWorld({ world }) {
      world.setResource(State, initialState());
    },
    createApi({ engine, world }) {
      engine.n.coreUI?.setDescriptor?.(
        "menus",
        PREHISTORIC_RUSH_PAUSE_MENU_DESCRIPTOR.id,
        PREHISTORIC_RUSH_PAUSE_MENU_DESCRIPTOR
      );
      const presentation = engine.n.corePresentation;
      const overlays = presentation?.getState?.().config?.overlays ?? {};
      presentation?.configure?.({
        overlays: {
          ...overlays,
          [PREHISTORIC_RUSH_PAUSE_OVERLAY_DESCRIPTOR.id]: PREHISTORIC_RUSH_PAUSE_OVERLAY_DESCRIPTOR
        }
      });

      const getState = () => world.getResource(State);
      const commit = (patch, event, payload = {}) => {
        const current = getState();
        const next = {
          ...current,
          ...clone(patch),
          sequence: Number(current?.sequence ?? 0) + 1
        };
        world.setResource(State, next);
        world.emit(event, { state: clone(next), ...clone(payload) });
        return clone(next);
      };

      return {
        open() {
          const current = getState();
          if (current.open && current.view === "main" && current.selectedAction === null) return clone(current);
          return commit({ open: true, view: "main", selectedAction: null }, Opened);
        },
        close() {
          const current = getState();
          if (!current.open && current.view === "main" && current.selectedAction === null) return clone(current);
          return commit({ open: false, view: "main", selectedAction: null }, Closed);
        },
        toggle() {
          const current = getState();
          return current.open
            ? commit({ open: false, view: "main", selectedAction: null }, Closed)
            : commit({ open: true, view: "main", selectedAction: null }, Opened);
        },
        showSettings() {
          const current = getState();
          if (current.open && current.view === "settings" && current.selectedAction === "settings") return clone(current);
          return commit({ open: true, view: "settings", selectedAction: "settings" }, SettingsShown);
        },
        requestExit() {
          const current = getState();
          if (current.selectedAction === "exit") return clone(current);
          return commit({ selectedAction: "exit" }, ExitRequested, { actionId: "exit" });
        },
        getState: () => clone(getState()),
        snapshot: () => clone(getState()),
        reset() {
          const next = initialState();
          world.setResource(State, next);
          world.emit(Reset, { state: clone(next) });
          return clone(next);
        }
      };
    },
    metadata: {
      purpose: "Non-blocking PrehistoricRush pause-menu state and command authority.",
      owns: ["pause-menu visibility", "pause-menu view", "settings command", "exit request"],
      doesNotOwn: ["engine clock", "simulation", "player control", "physics", "world streaming", "animation", "DOM rendering", "browser navigation"],
      blocksSimulation: false,
      rendererAgnostic: true,
      deterministic: true,
      snapshot: true,
      reset: true
    }
  });
}

export default createPrehistoricRushPauseMenuDomainKit;
