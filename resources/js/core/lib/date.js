export function get_today_range_utc() {
    const now = new Date();
    return {
        startISO: new Date(Date.UTC(
            now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
            0, 0, 0, 0
        )).toISOString(),
        endISO: new Date(Date.UTC(
            now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
            23, 59, 59, 999
        )).toISOString(),
    };
}

export function apply_today_range(query) {
    const { startISO, endISO } = get_today_range_utc();
    return query.gte("datetime", startISO).lte("datetime", endISO);
}