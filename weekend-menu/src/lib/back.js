// Makes the phone's system «Back» close what was opened last (a sheet, the dish editor,
// a non-menu tab) instead of leaving the app.
//
// While anything is open we keep exactly one extra «guard» entry on top of the history.
// Back pops the guard → we close the top layer and, if more layers are open, re-arm the guard.
// Closing the last layer from the UI removes the guard with one history.back(), whose
// popstate is ignored (and re-arms if a new layer opened meanwhile).
const stack = [];
let armed = false;
let ignoreNext = false;

function arm() {
  try { history.pushState({ guard: true }, ''); armed = true; } catch { armed = false; }
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    armed = false;
    if (ignoreNext) {
      ignoreNext = false;
    } else {
      const top = stack.pop();
      top?.close();
    }
    if (stack.length && !armed) arm();
  });
}

/** Register an open layer. Returns a function to call when the layer is closed from the UI. */
export function pushLayer(close) {
  const entry = { close };
  stack.push(entry);
  if (!armed) arm();
  return () => {
    const i = stack.indexOf(entry);
    if (i === -1) return; // already closed by Back
    stack.splice(i, 1);
    if (stack.length === 0 && armed && !ignoreNext) {
      ignoreNext = true;
      try { history.back(); } catch { ignoreNext = false; }
    }
  };
}
