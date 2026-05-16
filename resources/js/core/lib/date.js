export const TIMEZONE = "Asia/Manila";

// date filtering utilities
export function get_today_range() {
    const now = new Date();

    const phtNow = new Date(
        now.toLocaleString("en-US", { timeZone: TIMEZONE }),
    );

    const start = new Date(phtNow);
    start.setHours(0, 0, 0, 0);

    const end = new Date(phtNow);
    end.setHours(23, 59, 59, 999);

    return {
        startISO: start.toISOString(),
        endISO: end.toISOString(),
    };
}

export function apply_today_range(query) {
    const { startISO, endISO } = get_today_range();
    return query.gte("datetime", startISO).lte("datetime", endISO);
}

// Runs a callback when the next day starts
export function schedule_daily_refresh(callback) {
    const now = new Date();

    const phtNow = new Date(
        now.toLocaleString("en-US", { timeZone: TIMEZONE }),
    );

    const nextMidnight = new Date(phtNow);
    nextMidnight.setHours(24, 0, 0, 0);

    const delay = nextMidnight.getTime() - phtNow.getTime();

    setTimeout(() => {
        callback();
        schedule_daily_refresh(callback);
    }, delay);
}
