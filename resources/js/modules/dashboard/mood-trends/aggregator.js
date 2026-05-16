import { get_today_range } from "@/core/lib/date.js";
import { ALL_MOODS, MOOD_META, PHT_MS } from "./mood-trends-config";

// Date configure
const pht_now = () => new Date(get_today_range().startISO);
const to_date_str = (utc) => {
    const d = new Date(utc.getTime() + PHT_MS);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};
const get_section = (post) => {
    const s = post.students;
    return Array.isArray(s) ? s[0]?.section : s?.section;
};
// GET START AND END DATE FOR SELECTED TAB
function get_range(tab, today) {
    const start = new Date(today);
    if (tab === "Weekly") start.setUTCDate(start.getUTCDate() - 6);
    else if (tab === "Monthly") start.setUTCDate(start.getUTCDate() - 29);
    return [start, new Date(get_today_range().endISO)];
}
// BUILD DAILY BUCKETS FOR TODAY TAB
function today_buckets(today) {
    const elapsed = Date.now() + PHT_MS - (today.getTime() + PHT_MS);
    const slot_count = Math.floor(elapsed / (60 * 1000) / 10) + 1;
    const slots = Array.from({ length: slot_count }, (_, i) => i * 10);

    return {
        labels: slots.map((min) => {
            const h = Math.floor(min / 60);
            const m = min % 60;
            const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
            return `${hh}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
        }),
        bucket_keys: slots.map(String),
        key_fn: (d) => {
            const pht = new Date(d.getTime() + PHT_MS);
            return String(
                Math.floor(
                    (pht.getUTCHours() * 60 + pht.getUTCMinutes()) / 10,
                ) * 10,
            );
        },
    };
}
// BUILD DAILY BUCKETS FOR WEEKLY TAB
function weekly_buckets(today) {
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setUTCDate(today.getUTCDate() - (6 - i));
        return d;
    });
    return {
        labels: days.map(
            (d) => DAYS[new Date(d.getTime() + PHT_MS).getUTCDay()],
        ),
        bucket_keys: days.map(to_date_str),
        key_fn: (d) => to_date_str(d),
    };
}
// BUILD DAILY BUCKETS FOR MONTHLY TAB
function monthly_buckets(today) {
    const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setUTCDate(today.getUTCDate() - (29 - i));
        return d;
    });
    return {
        labels: days.map((d) => {
            const p = new Date(d.getTime() + PHT_MS);
            return `${p.getUTCMonth() + 1}/${p.getUTCDate()}`;
        }),
        bucket_keys: days.map(to_date_str),
        key_fn: (d) => to_date_str(d),
    };
}

const build_buckets = (tab, today) =>
    tab === "Today"
        ? today_buckets(today)
        : tab === "Weekly"
          ? weekly_buckets(today)
          : monthly_buckets(today);

// GROUP POSTS BY TIME AND COUNT MOODS
export function aggregate(posts, tab, section = "All") {
    const today = pht_now();
    const [start, end] = get_range(tab, today);
    const { labels, bucket_keys, key_fn } = build_buckets(tab, today);

    let filtered = posts.filter((p) => {
        const dt = new Date(p.datetime);
        return dt >= start && dt <= end;
    });

    if (section !== "All")
        filtered = filtered.filter((p) => get_section(p) === section);

    const datasets = ALL_MOODS.map((mood) => {
        const counts = Object.fromEntries(bucket_keys.map((k) => [k, 0]));

        for (const p of filtered) {
            if (p.mood?.toLowerCase() !== mood) continue;
            const k = key_fn(new Date(p.datetime));
            if (k in counts) counts[k]++;
        }

        const { emoji = "😶" } = MOOD_META[mood] ?? {};
        return {
            label: `${emoji} ${mood.charAt(0).toUpperCase()}${mood.slice(1)}`,
            data: bucket_keys.map((k) => counts[k]),
        };
    });

    return { labels, datasets, total: filtered.length };
}
