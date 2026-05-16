export const TIMEZONE = "Asia/Manila";

export const get_manila_now = () =>
    new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));

export const to_manila_time = (date = new Date()) =>
    new Date(date.toLocaleString("en-US", { timeZone: TIMEZONE }));

const pad = (n) => String(n).padStart(2, "0");

export const format_date = (date) => {
    const d = to_manila_time(date);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const format_month = (date) => {
    const d = to_manila_time(date);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
};

export const format_time = (datetime) => {
    const d = new Date(datetime);
    return isNaN(d)
        ? ""
        : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const format_date_label = (date = get_manila_now()) =>
    date.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });

// RANGE HELPERS
export function get_today_range() {
    const now = get_manila_now();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { startISO: start.toISOString(), endISO: end.toISOString() };
}

export function apply_today_range(query) {
    const { startISO, endISO } = get_today_range();
    return query.gte("datetime", startISO).lte("datetime", endISO);
}

// SCHEDULING
export function schedule_daily_refresh(callback) {
    const now = get_manila_now();
    const next_midnight = new Date(now);
    next_midnight.setHours(24, 0, 0, 0);
    const delay = next_midnight.getTime() - now.getTime();
    setTimeout(() => {
        callback();
        schedule_daily_refresh(callback);
    }, delay);
}