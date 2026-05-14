const MOOD_COLORS = {
  happy: "#22c55e", sad: "#3b82f6", angry: "#ef4444",
  anxious: "#eab308", neutral: "#8b5cf6", stressed: "#f97316",
  motivated: "#10b981", content: "#6366f1", excited: "#ec4899",
  drained: "#64748b", tired: "#78716c",
};

export const STATIC_OPTION = {
  grid: { top: 20, right: 16, bottom: 100, left: 36, containLabel: true },
  tooltip: {
    trigger: "axis", axisPointer: { type: "shadow" },
    backgroundColor: "#0f172a", borderColor: "#1e293b", borderWidth: 1,
    padding: [8, 12], textStyle: { color: "#f1f5f9", fontSize: 12 },
    extraCssText: "box-shadow:0 4px 16px rgba(0,0,0,0.4)",
  },
  legend: {
    bottom: 42, left: "center", itemWidth: 12, itemHeight: 12,
    textStyle: { color: "#635e5e", fontSize: 12 }, inactiveColor: "#334155",
  },
  xAxis: {
    type: "category", axisLine: { show: true }, axisTick: { show: true },
    axisLabel: { color: "#64748b", fontSize: 12, margin: 20 }, splitLine: { show: true },
  },
  yAxis: {
    type: "value", minInterval: 1,
    axisLabel: { color: "#64748b", fontSize: 10 },
    splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
    axisLine: { show: true }, axisTick: { show: true },
  },
};

export function build_series(datasets) {
  return datasets.map((ds) => {
    const mood = ds.label.replace(/^\S+\s/, "").toLowerCase();
    const color = MOOD_COLORS[mood] ?? "#94a3b8";
    return {
      name: ds.label, type: "bar",
      barMaxWidth: 24, barMinWidth: 12, barCategoryGap: "30%",
      data: ds.data,
      itemStyle: { color },
      emphasis: { focus: "series", itemStyle: { opacity: 1 } },
      blur: { itemStyle: { opacity: 0.25 } },
    };
  });
}

export function get_zoom(tab, labels, datasets) {
  if (tab !== "Today") {
    return [
      { type: "inside", start: 0, end: 100 },
      slider_config(0, 100),
    ];
  }

  const total_hours = labels.length;
  const current_hour = new Date().getHours();
  let first_entry_hour = current_hour;

  for (const ds of datasets) {
    for (let i = 0; i < ds.data.length; i++) {
      if (ds.data[i] > 0) { first_entry_hour = Math.min(first_entry_hour, i); break; }
    }
  }

  const pad = 2;
  const start = Math.round((Math.max(0, first_entry_hour - pad) / (total_hours - 1)) * 100);
  const end = Math.round((Math.min(total_hours - 1, current_hour + pad) / (total_hours - 1)) * 100);

  return [{ type: "inside", start, end }, slider_config(start, end)];
}

function slider_config(start, end) {
  return {
    type: "slider", bottom: 10, left: "10%", right: "10%", height: 16,
    start, end, showDetail: true, showDataShadow: true, handleSize: 28,
    handleStyle: { color: "#ffffff", borderColor: "#3b82f6", borderWidth: 4 },
    moveHandleSize: 6,
    dataBackground: {
      lineStyle: { color: "rgba(148,163,184,0.35)", width: 1 },
      areaStyle: { color: "red" },
    },
  };
}

export function tab_changed(last, next) { return last.tab !== next; }

export function labels_changed(last, next) {
  if (!last.labels) return true;
  if (last.labels.length !== next.length) return true;
  return next.some((l, i) => l !== last.labels[i]);
}

export function series_changed(last, next) {
  if (!last.datasets) return true;
  if (last.datasets.length !== next.length) return true;
  return next.some((ds, i) => {
    const prev = last.datasets[i];
    if (ds.label !== prev.label) return true;
    if (ds.data.length !== prev.data.length) return true;
    return ds.data.some((v, j) => v !== prev.data[j]);
  });
}

export function sync_empty_state(container, total) {
  const card = container?.closest("[data-mood-trends]") ?? null;
  const empty = card?.querySelector("[data-empty-state]");
  if (!container || !empty) return;
  container.style.display = total > 0 ? "block" : "none";
  empty.style.display = total > 0 ? "none" : "flex";
}