// date filtering utilities

function get_pht_date() {

    const now = new Date();
    const phtOffset = 8 * 60 * 60 * 1000;
    const pht = new Date(now.getTime() + phtOffset);
    const pad = (n) => String(n).padStart(2, "0");

    return {
        year: pht.getUTCFullYear(),
        month: pad(pht.getUTCMonth() + 1),
        day: pad(pht.getUTCDate()),
    };
}

export function get_today_range() {
    const { year, month, day } = get_pht_date();
    return {
        startISO: `${year}-${month}-${day}T00:00:00.000+08:00`,
        endISO:   `${year}-${month}-${day}T23:59:59.999+08:00`,
    };
}

export function apply_today_range(query) {
    const { startISO, endISO } = get_today_range();
    return query.gte("datetime", startISO).lt("datetime", endISO);
}

// Runs a callback when the next day starts
export function schedule_daily_refresh(callback) {
    const now = new Date();
    const phtOffset = 8 * 60 * 60 * 1000;
    const phtNow = new Date(now.getTime() + phtOffset);

    const phtMidnight = new Date(Date.UTC(
        phtNow.getUTCFullYear(),
        phtNow.getUTCMonth(),
        phtNow.getUTCDate() + 1,
        0, 0, 0, 0
    ) - phtOffset);

    const delay = phtMidnight - now;

    setTimeout(() => {
        callback();
        schedule_daily_refresh(callback); // callback reset
    }, delay);
}