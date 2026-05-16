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
} from "./chart-config.js";

let chart_instance = null;
let chart_container = null;
let resize_observer = null;
// cache for dirty-checking
let render_cache = { tab: null, labels: null, datasets: null };

const hidden_moods = new Set(); // moods toggled off by the user

// stored for removeEventListener in destroy_chart
let legend_click_handler = null;
let legend_container = null;

// find legend container near chart
function legend_el() {
    return (
        chart_container
            ?.closest("[data-mood-trends]")
            ?.querySelector("[data-mood-trends-legend]") ?? null
    );
}
// event delegation on the stable parent element
function wire_legend_delegation(el, get_datasets) {
    legend_container = el; // stored for removeEventListener in destroy_chart

    legend_click_handler = (e) => {
        const btn = e.target.closest("[data-legend]"); // bubble up to pill
        const reset = e.target.closest("[data-legend-reset]");

        if (reset) {
            hidden_moods.clear();
        } else if (btn) {
            const mood_name = btn.dataset.legend;
            hidden_moods.has(mood_name)
                ? hidden_moods.delete(mood_name)
                : hidden_moods.add(mood_name); // toggle
        } else return; // outside any pill — ignore

        apply_visibility();
        render_legend(get_datasets());
    };

    el.addEventListener("click", legend_click_handler); // one listener, survives innerHTML swaps
}

// builds clickable legend that toggles and remembers hidden moods
function render_legend(datasets) {
    const el = legend_el();
    if (!el) return;

    const pills = datasets
        .map((ds) => {
            const mood_name = label_to_mood(ds.label);
            const mood_color = MOOD_META[mood_name]?.color ?? "#94a3b8";
            const is_dimmed = hidden_moods.has(mood_name);

            return `<button
            type="button"
            data-legend="${mood_name}"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.2 text-xs font-medium rounded transition-all duration-150"
            style="
                background:${is_dimmed ? "transparent" : `${mood_color}22`};
                color:${is_dimmed ? "#475569" : mood_color};
                opacity:${is_dimmed ? "0.5" : "1"};
                text-decoration:${is_dimmed ? "line-through" : "none"};">
            <span style="width:7px;height:7px;border-radius:50%;flex-shrink:0;display:inline-block;
                background:${is_dimmed ? "#334155" : mood_color};"></span>
            ${ds.label}
        </button>`;
        })
        .join("");

    const reset =
        hidden_moods.size > 0 // show reset if something hidden
            ? `<button
            type="button"
            data-legend-reset
            class="inline-flex items-center gap-1.5 px-2.5 py-0.2 text-xs font-medium rounded transition-all duration-150"
            style="color:#000000;opacity:0.7;border: 1px solid #000000">
            ↺ Reset
           </button>`
            : "";

    el.innerHTML = pills + reset;
}

function apply_visibility() {
    if (!chart_instance) return; // no chart yet
    chart_instance.setOption({
        series: (chart_instance.getOption().series ?? []).map((s) => {
            const is_mood_hidden = hidden_moods.has(label_to_mood(s.name));
            return {
                ...s,
                itemStyle: { ...s.itemStyle, opacity: is_mood_hidden ? 0 : 1 },
                silent: is_mood_hidden,
            };
        }),
    });
}

function sync_empty_state(total) {
    const trends_card = chart_container?.closest("[data-mood-trends]");
    const empty_state = trends_card?.querySelector("[data-empty-state]");
    if (!chart_container || !empty_state) return;
    chart_container.style.display = total > 0 ? "block" : "none";
    empty_state.style.display = total > 0 ? "none" : "flex";
}

export function set_canvas(el) {
    destroy_chart();
    chart_container = el;
}

// update changed chart parts and keep hidden moods visible state
export function render({ labels, datasets, total }, tab = "Today") {
    sync_empty_state(total);
    if (!total) return;

    if (!chart_instance) {
        chart_instance = echarts.init(chart_container, null, {
            renderer: "canvas",
        });
        chart_instance.setOption(CHART_OPTION);

        resize_observer = new ResizeObserver(() => chart_instance?.resize());
        resize_observer.observe(chart_container);

        // wired once here — inside if (!chart_instance) so it never double-registers
        const legend = legend_el();
        if (legend) {
            wire_legend_delegation(legend, () => render_cache.datasets ?? []);
        }
    }

    const is_tab_dirty = tab_changed(render_cache, tab);
    const are_labels_dirty = labels_changed(render_cache, labels);
    const is_series_dirty = series_changed(render_cache, datasets);

    if (!is_tab_dirty && !are_labels_dirty && !is_series_dirty) return;

    const chart_patch = {};
    if (are_labels_dirty) chart_patch.xAxis = { data: labels };
    if (is_series_dirty) chart_patch.series = build_series(datasets);
    if (is_tab_dirty || are_labels_dirty)
        chart_patch.dataZoom = get_zoom(tab, labels, datasets);

    // replaceMerge prevents echarts from blending old and new series
    chart_instance.setOption(chart_patch, { replaceMerge: ["series"] });
    render_legend(datasets);
    if (hidden_moods.size) apply_visibility();

    render_cache = {
        tab,
        labels: [...labels],
        datasets: datasets.map((ds) => ({
            label: ds.label,
            data: [...ds.data],
        })),
    };
}

export function destroy_chart() {
    resize_observer?.disconnect();
    chart_instance?.dispose();
    // detach delegated listener before nulling refs
    if (legend_container && legend_click_handler) {
        legend_container.removeEventListener("click", legend_click_handler);
    }
    legend_container = null;
    legend_click_handler = null;
    chart_instance = null;
    chart_container = null;
    resize_observer = null;
    render_cache = { tab: null, labels: null, datasets: null };
    hidden_moods.clear();
}
