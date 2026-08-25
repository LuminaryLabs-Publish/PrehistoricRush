try {
  await import("../game-runtime-shared-gpu-v3.js");
} catch (reason) {
  const detail = reason instanceof Error ? reason.message : String(reason);
  const error = new Error(`Could not start PrehistoricRush: ${detail}`);
  console.error(error);
  document.body.textContent = error.message;
  throw error;
}
