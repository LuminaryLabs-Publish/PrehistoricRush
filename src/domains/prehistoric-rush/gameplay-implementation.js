const clone = (value) => value === undefined ? undefined : structuredClone(value);

export function createPrehistoricRushGameplayImplementation({ player, goalDistance = 3600 } = {}) {
  if (!player?.tick) throw new TypeError("Gameplay requires the PrehistoricRush Player implementation.");
  let input = { steer: 0, boost: false, jump: false };
  let run = null;

  function resetRun(status = "game") {
    const playerState = player.reset();
    run = { runId: Number(run?.runId ?? 0) + 1, status, elapsed: 0, shards: 0, ...playerState };
    return clone(run);
  }

  function setInput(next = {}) {
    input = { ...input, ...next };
    return clone(input);
  }

  function tick(dt) {
    if (!run || run.status !== "game") return clone(run);
    const nextPlayer = player.tick(dt, input);
    input.jump = false;
    run = { ...run, ...nextPlayer, elapsed: Number(run.elapsed ?? 0) + Number(dt || 0) };
    if (run.distance >= goalDistance) run.status = "win";
    return clone(run);
  }

  resetRun("game");
  return Object.freeze({
    start: () => resetRun("game"),
    setInput,
    tick,
    getState: () => clone(run),
    snapshot: () => ({ run: clone(run), input: clone(input), goalDistance: Number(goalDistance) })
  });
}
