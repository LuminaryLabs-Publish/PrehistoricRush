export function createTickScheduler({ host, eventBus }) {
  let last = performance.now();
  let frame = 0;
  let running = false;

  function start(context = {}) {
    if (running) return;
    running = true;
    eventBus.emit("scheduler.started", {});
    requestAnimationFrame(function loop(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      frame += 1;
      host.tick(dt, { ...context, frame, now });
      requestAnimationFrame(loop);
    });
  }

  function stop() {
    running = false;
    eventBus.emit("scheduler.stopped", { frame });
  }

  function snapshot() {
    return { running, frame };
  }

  return { start, stop, snapshot };
}
