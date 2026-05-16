export const PHT_MS = 8 * 60 * 60 * 1000;

// HARDCODED LIST OF AVAILABLE MOODS
export const ALL_MOODS = [
    "happy",
    "sad",
    "angry",
    "anxious",
    "neutral",
    "stressed",
    "motivated",
    "content",
    "excited",
    "drained",
    "tired",
];

// MOOD CHROMA
export const MOOD_META = {
    happy: { color: "#16a34a", emoji: "😊" }, // darker green
    sad: { color: "#2563eb", emoji: "😢" }, // deep blue
    angry: { color: "#dc2626", emoji: "😠" }, // strong red
    anxious: { color: "#ca8a04", emoji: "😰" }, // amber/gold
    neutral: { color: "#6b21a8", emoji: "😐" }, // deep purple
    stressed: { color: "#ea580c", emoji: "😫" }, // bright orange
    motivated: { color: "#059669", emoji: "💪" }, // teal/green
    content: { color: "#4338ca", emoji: "😌" }, // royal blue
    excited: { color: "#be185d", emoji: "🤩" }, // magenta
    drained: { color: "#334155", emoji: "😔" }, // slate/dark gray-blue
    tired: { color: "#4b5563", emoji: "😴" },
};

export const CHART_OPTION = {
    grid: { top: 12, right: 46, bottom: 52, left: 32, containLabel: true },
    legend: { show: false },
    tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "#0f172a",
        borderColor: "#1e293b",
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: "#f1f5f9", fontSize: 12 },
        extraCssText: "box-shadow:0 4px 16px rgba(0,0,0,0.4)",
    },
    xAxis: {
        type: "category",
        axisLine: { show: true },
        axisTick: { show: true },
        axisLabel: { color: "#64748b", fontSize: 12, margin: 20 },
        splitLine: { show: true },
    },
    yAxis: {
        type: "value",
        minInterval: 1,
        max: 15,
        axisLabel: { color: "#2cd4c9", fontSize: 14, fontWeight: "bold" },
        splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
        axisLine: { show: true },
        axisTick: { show: true },
    },
};
// MAP DATASETS TO ECHART SERIES
export function build_series(datasets) {
    return datasets.map((ds) => {
        const mood = label_to_mood(ds.label);
        const color = MOOD_META[mood]?.color ?? "#94a3b8";

        return {
            name: ds.label,
            type: "bar",
            barMaxWidth: 24,
            barMinWidth: 12,
            barCategoryGap: "30%",
            data: ds.data,
            itemStyle: { color },
            emphasis: { focus: "series", itemStyle: { opacity: 1 } },
            blur: { itemStyle: { opacity: 0.25 } },
        };
    });
}
// CALCULATE ZOOM RANGE BASED ON TIME/DATA
export function get_zoom(tab, labels, datasets) {
    if (tab !== "Today") return [inside(0, 100), slider(0, 100)];

    const total = labels.length;
    const cur_hour = Math.floor((Date.now() + PHT_MS) / (60 * 60 * 1000)) % 24;
    let first_slot = cur_hour;

    for (const ds of datasets) {
        const i = ds.data.findIndex((v) => v > 0);
        if (i !== -1) first_slot = Math.min(first_slot, i);
    }

    const safe = Math.max(total - 1, 1);
    const pad = 2;
    const s = Math.round((Math.max(0, first_slot - pad) / safe) * 100);
    const e = Math.round((Math.min(total - 1, cur_hour + pad) / safe) * 100);

    return [inside(s, e), slider(s, e)];
}
// CREATE INSIDE ZOOM CONFIG
function inside(start, end) {
    return { type: "inside", start, end };
}
// SLIDER CONTROL
function slider(start, end) {
    return {
        type: "slider",
        bottom: 10,
        left: "10%",
        right: "10%",
        height: 22,
        start,
        end,
        showDetail: true,
        showDataShadow: true,
        handleSize: 22,
        handleStyle: { color: "#fff", borderColor: "#3b82f6", borderWidth: 2 },
        moveHandleSize: 6,
        dataBackground: {
            lineStyle: { color: "rgba(148,163,184,0.35)", width: 1 },
            areaStyle: { color: "red" },
        },
    };
}

export function tab_changed(last, next) {
    return last.tab !== next;
}

export function labels_changed(last, next) {
    if (!last.labels || last.labels.length !== next.length) return true;
    return next.some((l, i) => l !== last.labels[i]);
}

// CHECK IF DATA VALUES OR LABELS CHANGED
export function series_changed(last, next) {
    if (!last.datasets || last.datasets.length !== next.length) return true;
    return next.some((ds, i) => {
        const p = last.datasets[i];
        return (
            ds.label !== p.label ||
            ds.data.length !== p.data.length ||
            ds.data.some((v, j) => v !== p.data[j])
        );
    });
}

export function label_to_mood(label) {
    return label.replace(/^\S+\s/, "").toLowerCase();
}
