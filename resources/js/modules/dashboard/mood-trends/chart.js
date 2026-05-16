import * as echarts from "echarts";
import {
    CHART_OPTION,
    MOOD_META,
    build_series,
    get_zoom,
    tab_changed,
    labels_changed,
    series_changed,
    label_to_mood,
} from "./mood-trends-config.js";

let _chart = null; // ECharts instance
let _container = null; // chart DOM container
let _resize_ob = null; // handles auto resize
let _last = { tab: null, labels: null, datasets: null }; // render cache for diffing
const _hidden = new Set(); // tracks hidden moods

// find legend container near chart
function legend_el() {
    return (
        _container
            ?.closest("[data-mood-trends]")
            ?.querySelector("[data-mood-trends-legend]") ?? null
    );
}

// builds clickable legend that toggles and remembers hidden moods
function render_legend(datasets) {
    const el = legend_el();
    if (!el) return;

    const pills = datasets
        .map((ds) => {
            const mood = label_to_mood(ds.label);
            const color = MOOD_META[mood]?.color ?? "#94a3b8"; // fallback color
            const dimmed = _hidden.has(mood);

            return `<button
            type="button"
            data-legend="${mood}"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.2 text-xs font-medium rounded transition-all duration-150"
            style="
                background:${dimmed ? "transparent" : `${color}22`};
                color:${dimmed ? "#475569" : color};
                opacity:${dimmed ? "0.5" : "1"};
                text-decoration:${dimmed ? "line-through" : "none"};">
            <span style="width:7px;height:7px;border-radius:50%;flex-shrink:0;display:inline-block;
                background:${dimmed ? "#334155" : color};"></span>
            ${ds.label}
        </button>`;
        })
        .join("");

    const reset =
        _hidden.size > 0 // show reset if something hidden
            ? `<button
            type="button"
            data-legend-reset
            class="inline-flex items-center gap-1.5 px-2.5 py-0.2 text-xs font-medium rounded transition-all duration-150"
            style="color:#000000;opacity:0.7;border: 1px solid #000000">
            ↺ Reset
           </button>`
            : "";

    el.innerHTML = pills + reset;

    el.querySelectorAll("[data-legend]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const mood = btn.dataset.legend;
            _hidden.has(mood) ? _hidden.delete(mood) : _hidden.add(mood);
            apply_visibility();
            render_legend(datasets); // refresh legend state
        });
    });

    el.querySelector("[data-legend-reset]")?.addEventListener("click", () => {
        _hidden.clear();
        apply_visibility();
        render_legend(datasets);
    });
}

function apply_visibility() {
    if (!_chart) return; // no chart yet
    _chart.setOption({
        series: (_chart.getOption().series ?? []).map((s) => {
            const hidden = _hidden.has(label_to_mood(s.name));
            return {
                ...s,
                itemStyle: { ...s.itemStyle, opacity: hidden ? 0 : 1 },
                silent: hidden,
            };
        }),
    });
}

function sync_empty_state(total) {
    const card = _container?.closest("[data-mood-trends]");
    const empty = card?.querySelector("[data-empty-state]");
    if (!_container || !empty) return;
    _container.style.display = total > 0 ? "block" : "none";
    empty.style.display = total > 0 ? "none" : "flex";
}

export function set_canvas(el) {
    destroy_chart();
    _container = el;
}

// update changed chart parts and keep hidden lines
export function render({ labels, datasets, total }, tab = "Today") {
    sync_empty_state(total);
    if (!total) return;

    if (!_chart) {
        _chart = echarts.init(_container, null, { renderer: "canvas" }); // create chart
        _chart.setOption(CHART_OPTION);
        _resize_ob = new ResizeObserver(() => _chart?.resize());
        _resize_ob.observe(_container);
    }

    const dirty_tab = tab_changed(_last, tab);
    const dirty_labels = labels_changed(_last, labels);
    const dirty_series = series_changed(_last, datasets);

    if (!dirty_tab && !dirty_labels && !dirty_series) return;

    const patch = {};
    if (dirty_labels) patch.xAxis = { data: labels };
    if (dirty_series) patch.series = build_series(datasets);
    if (dirty_tab || dirty_labels)
        patch.dataZoom = get_zoom(tab, labels, datasets);

    _chart.setOption(patch, { replaceMerge: ["series"] });
    render_legend(datasets);
    if (_hidden.size) apply_visibility();

    _last = {
        tab,
        labels: [...labels],
        datasets: datasets.map((ds) => ({
            label: ds.label,
            data: [...ds.data],
        })),
    };
}

export function destroy_chart() {
    _resize_ob?.disconnect();
    _chart?.dispose(); // prevent memory leaks
    _chart = null;
    _container = null;
    _resize_ob = null;
    _last = { tab: null, labels: null, datasets: null };
    _hidden.clear();
}
