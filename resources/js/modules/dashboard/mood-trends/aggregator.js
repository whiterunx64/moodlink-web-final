import { ALL_MOODS, MOOD_META } from "./mood-trends-config";
import { get_today_range, TIMEZONE } from "@/core/lib/date.js";

// Date configure
const pht_from_utc = (d) =>
    new Date(d.toLocaleString("en-US", { timeZone: TIMEZONE }));

const to_date_str = (utc) => {
    const d = pht_from_utc(utc);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const get_section = (post) => {
    const s = post.students;
    return Array.isArray(s) ? s[0]?.section : s?.section;
};

// GET START AND END DATE FOR SELECTED TAB
function get_range(tab) {
    const { startISO, endISO } = get_today_range();

    let start = new Date(startISO);
    let end = new Date(endISO);

    if (tab === "Weekly") {
        start.setDate(start.getDate() - 6);
    } else if (tab === "Monthly") {
        start.setMonth(start.getMonth() - 5);
    }

    return [start, end];
}

// BUILD DAILY BUCKETS FOR TODAY TAB
function today_buckets() {
    const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: TIMEZONE }),
    );

    const minutes = now.getHours() * 60 + now.getMinutes();
    const slot_count = Math.floor(minutes / 10) + 1;

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
            const pht = pht_from_utc(d);
            const minutes = pht.getHours() * 60 + pht.getMinutes();
            return String(Math.floor(minutes / 10) * 10);
        },
    };
}

// BUILD DAILY BUCKETS FOR WEEKLY TAB
function weekly_buckets(start) {
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });

    return {
        labels: days.map((d) => {
            const p = pht_from_utc(d);
            return DAYS[p.getDay()];
        }),
        bucket_keys: days.map(to_date_str),
        key_fn: (d) => to_date_str(d),
    };
}

// BUILD DAILY BUCKETS FOR MONTHLY TAB
function monthly_buckets() {
    const months = [];
    const labels = [];
    const now = new Date();

    const pad = (n) => String(n).padStart(2, "0");

    for (let i = 5; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(now.getMonth() - i);

        const p = pht_from_utc(d);

        const key = `${p.getFullYear()}-${pad(p.getMonth() + 1)}`;
        months.push(key);

        const label = p.toLocaleString("en-US", { month: "short" });
        labels.push(label);
    }

    return {
        labels,
        bucket_keys: months,
        key_fn: (d) => {
            const p = pht_from_utc(d);
            return `${p.getFullYear()}-${pad(p.getMonth() + 1)}`;
        },
    };
}

const build_buckets = (tab, start) =>
    tab === "Today"
        ? today_buckets()
        : tab === "Weekly"
          ? weekly_buckets(start)
          : monthly_buckets();

// GROUP POSTS BY TIME AND COUNT MOODS
export function aggregate(posts, tab, section = "All") {
    const [start, end] = get_range(tab);

    const { labels, bucket_keys, key_fn } = build_buckets(tab, start);

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

            const key = key_fn(new Date(p.datetime));
            if (key in counts) counts[key]++;
        }

        const { emoji = "😶" } = MOOD_META[mood] ?? {};

        return {
            label: `${emoji} ${mood}`,
            data: bucket_keys.map((k) => counts[k]),
        };
    });

    return { labels, datasets, total: filtered.length };
}