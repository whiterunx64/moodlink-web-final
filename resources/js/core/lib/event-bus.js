// event-bus - broadcaster for realtime updates across submodules 
export function create_bus() {
  const listeners = {};

  return {
    on(event, fn) {
      (listeners[event] ??= []).push(fn);
    },
    off(event, fn) {
      listeners[event] = listeners[event]?.filter(l => l !== fn);
    },
    emit(event, data) {
      listeners[event]?.forEach(fn => {
        try {
          fn(data);
        } catch (err) {
          console.error(`[bus:${event}] ${fn.name || "anonymous"} failed`, err);
        }
      });
    },
  };
}