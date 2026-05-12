// date filtering utilities
export function get_today_range() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    
    // always updates dynamically when the date changes, so it always reflects today in the user's local timezone
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    return {
        startISO: `${date}T00:00:00.000`,
        endISO: `${date}T23:59:59.999`,
    };
}

export function apply_today_range(query) {
    const { startISO, endISO } = get_today_range();
    return query.gte("datetime", startISO).lt("datetime", endISO);
}

export function schedule_midnight_refresh(callback) {
    const now = new Date();
    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
    );
    const delay = midnight - now;

    setTimeout(() => {
        callback();
        schedule_midnight_refresh(callback);
    }, delay);
}