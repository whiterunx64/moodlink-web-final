import { ALL_MOODS, MOOD_META } from "./chart-config";
import {
    get_today_range,
    to_manila_time,
    get_manila_now,
    format_date,
    format_month,
} from "@/core/lib/date.js";
// Date configure
const get_post_section = (post) => {
    const section_data = post.students;
    return Array.isArray(section_data)
        ? section_data[0]?.section
        : section_data?.section;
};

// GET START AND END DATE FOR SELECTED TAB
function get_range(tab) {
    const { startISO, endISO } = get_today_range();

    let range_start = new Date(startISO);
    let range_end = new Date(endISO);

    if (tab === "Weekly") range_start.setDate(range_start.getDate() - 6);
    else if (tab === "Monthly")
        range_start.setMonth(range_start.getMonth() - 5);

    return [range_start, range_end];
}

// BUILD DAILY BUCKETS FOR TODAY TAB
function today_buckets() {
    const now = get_manila_now();
    const elapsed_minutes = now.getHours() * 60 + now.getMinutes();
    const slot_count = Math.floor(elapsed_minutes / 10) + 1;
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
            const manila = to_manila_time(d);
            const elapsed = manila.getHours() * 60 + manila.getMinutes();
            return String(Math.floor(elapsed / 10) * 10);
        },
    };
}

// BUILD DAILY BUCKETS FOR WEEKLY TAB
function weekly_buckets(range_start) {
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const week_days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(range_start);
        d.setDate(range_start.getDate() + i);
        return d;
    });

    return {
        labels: week_days.map((d) => DAYS[to_manila_time(d).getDay()]),
        bucket_keys: week_days.map(format_date),
        key_fn: format_date,
    };
}
// BUILD DAILY BUCKETS FOR MONTHLY TAB
function monthly_buckets() {
    const now = get_manila_now();
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now);
        d.setMonth(now.getMonth() - (5 - i));
        return to_manila_time(d);
    });

    return {
        labels: months.map((d) =>
            d.toLocaleString("en-US", { month: "short" }),
        ),
        bucket_keys: months.map(format_month),
        key_fn: format_month,
    };
}

const build_buckets = (tab, range_start) =>
    tab === "Today"
        ? today_buckets()
        : tab === "Weekly"
          ? weekly_buckets(range_start)
          : monthly_buckets();

// GROUP POSTS BY TIME AND COUNT MOODS
export function aggregate(posts, tab, section = "All") {
    const [range_start, range_end] = get_range(tab);
    const { labels, bucket_keys, key_fn } = build_buckets(tab, range_start);

    let posts_in_range = posts.filter((p) => {
        const post_date = new Date(p.datetime);
        return post_date >= range_start && post_date <= range_end;
    });

    if (section !== "All")
        posts_in_range = posts_in_range.filter(
            (p) => get_post_section(p) === section,
        );

    const datasets = ALL_MOODS.map((mood) => {
        const mood_counts = Object.fromEntries(bucket_keys.map((k) => [k, 0]));

        for (const p of posts_in_range) {
            if (p.mood?.toLowerCase() !== mood) continue;
            const matched_key = key_fn(new Date(p.datetime));
            if (matched_key in mood_counts) mood_counts[matched_key]++;
        }

        const { emoji = "😶" } = MOOD_META[mood] ?? {};
        return {
            label: `${emoji} ${mood}`,
            data: bucket_keys.map((k) => mood_counts[k]),
        };
    });

    return { labels, datasets, total: posts_in_range.length };
}