export function createEventBus() {
  const listeners = new Map();
  const history = [];

  function on(type, handler) {
    const bucket = listeners.get(type) ?? new Set();
    bucket.add(handler);
    listeners.set(type, bucket);
    return () => bucket.delete(handler);
  }

  function emit(type, payload = {}) {
    const event = { type, payload, at: performance.now() };
    history.push(event);
    for (const handler of listeners.get(type) ?? []) handler(event);
    for (const handler of listeners.get("*") ?? []) handler(event);
    return event;
  }

  function snapshot() {
    return {
      listenerTypes: [...listeners.keys()],
      eventCount: history.length,
      recent: history.slice(-24)
    };
  }

  return { on, emit, snapshot };
}
