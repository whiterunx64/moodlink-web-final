// debounce utilities
// prevents multiple rapid calls from triggering redundant re-fetches
// usage: const refresh_x = debounce(init_x, 100);
// trigger → schedules fn, resets timer if called again within delay
// cancel  → clears pending call (used on cleanup)
export function debounce(fn, delay) {
    let timer = null;
    const trigger = () => {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
    const cancel = () => clearTimeout(timer);
    return { trigger, cancel };
}