import { get_today_range } from "@/core/lib/date.js";

export const MOOD_COLORS = {
    happy: { line: "#4ade80", fill: "rgba(74,222,128,0.15)" },
    sad: { line: "#60a5fa", fill: "rgba(96,165,250,0.15)" },
    angry: { line: "#f87171", fill: "rgba(248,113,113,0.15)" },
    anxious: { line: "#facc15", fill: "rgba(250,204,21,0.15)" },
    neutral: { line: "#a78bfa", fill: "rgba(167,139,250,0.15)" },
    stressed: { line: "#fb923c", fill: "rgba(251,146,60,0.15)" },
    motivated: { line: "#34d399", fill: "rgba(52,211,153,0.15)" },
    content: { line: "#818cf8", fill: "rgba(129,140,248,0.15)" },
    excited: { line: "#f472b6", fill: "rgba(244,114,182,0.15)" },
    drained: { line: "#94a3b8", fill: "rgba(148,163,184,0.15)" },
    tired: { line: "#a8a29e", fill: "rgba(168,162,158,0.15)" },
};

const MOOD_EMOJI = {
    happy: "😊", sad: "😢", angry: "😠", anxious: "😰",
    neutral: "😐", stressed: "😫", motivated: "💪", content: "😌",
    excited: "🤩", drained: "😔", tired: "😴",
};

function get_now() {
    const { startISO } = get_today_range();
    // Append +00:00 so JS parses it as UTC, matching the DB's +00 datetimes
    return new Date(`${startISO}+00:00`);
}

function get_range(tab, now) {
    const start = new Date(now); // already UTC midnight from get_now()

    if (tab === "Weekly") {
        start.setUTCDate(start.getUTCDate() - 6);
    } else if (tab === "Monthly") {
        start.setUTCDate(start.getUTCDate() - 29);
    }
    // "Today": start is already UTC midnight, no change needed

    const end = new Date(`${get_today_range().endISO}+00:00`);
    return [start, end];
}

function build_buckets(tab, now) {
    if (tab === "Today") {
        // Show all 24h slots but only up to current UTC hour
        const current_hour = new Date().getUTCHours();
        const hours = Array.from({ length: current_hour + 1 }, (_, h) => h);

        const labels = hours.map((h) => {
            if (h === 0) return "12 AM";
            if (h < 12) return `${h} AM`;
            if (h === 12) return "12 PM";
            return `${h - 12} PM`;
        });

        return {
            labels,
            bucket_keys: hours.map(String),
            key_fn: (d) => String(d.getUTCHours()),
        };
    }

    if (tab === "Weekly") {
        const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(now);
            d.setUTCDate(now.getUTCDate() - (6 - i));
            return d;
        });

        return {
            labels: days.map((d) => DAY[d.getUTCDay()]),
            bucket_keys: days.map((d) => d.toISOString().slice(0, 10)),
            key_fn: (d) => d.toISOString().slice(0, 10),
        };
    }

    // Monthly
    const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(now);
        d.setUTCDate(now.getUTCDate() - (29 - i));
        return d;
    });

    return {
        labels: days.map((d) => `${d.getUTCMonth() + 1}/${d.getUTCDate()}`),
        bucket_keys: days.map((d) => d.toISOString().slice(0, 10)),
        key_fn: (d) => d.toISOString().slice(0, 10),
    };
}

export function aggregate(posts, tab, section = "All") {
    const now = get_now();
    const [start, end] = get_range(tab, now);
    const { labels, bucket_keys, key_fn } = build_buckets(tab, now);

    let filtered = posts.filter((p) => {
        const dt = new Date(p.datetime);
        return dt >= start && dt <= end;
    });

    if (section && section !== "All") {
        filtered = filtered.filter((p) => p.students?.section === section);
    }

    const mood_set = new Set(
        filtered.map((p) => p.mood?.toLowerCase()).filter(Boolean)
    );

    if (!mood_set.size) {
        return { labels, datasets: [], total: 0 };
    }

    const datasets = [...mood_set].map((mood) => {
        const counts = Object.fromEntries(bucket_keys.map((k) => [k, 0]));

        filtered.forEach((p) => {
            if (p.mood?.toLowerCase() !== mood) return;
            const k = key_fn(new Date(p.datetime));
            if (k in counts) counts[k]++;
        });

        const color = MOOD_COLORS[mood] ?? { line: "#94a3b8", fill: "rgba(148,163,184,0.15)" };
        const emoji = MOOD_EMOJI[mood] ?? "😶";
        const label = mood.charAt(0).toUpperCase() + mood.slice(1);

        return {
            label: `${emoji} ${label}`,
            data: bucket_keys.map((k) => counts[k]),
            borderColor: color.line,
            backgroundColor: color.fill,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 2,
        };
    });

    return { labels, datasets, total: filtered.length };
}