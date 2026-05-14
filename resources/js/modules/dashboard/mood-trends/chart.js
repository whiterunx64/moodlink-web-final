import { get_zoom, build_series, STATIC_OPTION, labels_changed, series_changed, tab_changed, sync_empty_state } from "./mood-trends-config.js";

let _chart = null;
let _container = null;
let _resize_ob = null;
let _last = { tab: null, labels: null, datasets: null };

export function set_canvas(el) {
    destroy_chart();
    _container = el;
}

export function render({ labels, datasets, total }, tab = "Today") {
    sync_empty_state(_container, total);
    if (!total) return;

    const echarts = window.echarts;
    if (!echarts) {
        console.warn("[mood-trends/chart] ECharts not found on window.");
        return;
    }

    if (!_chart) {
        _chart = echarts.init(_container, null, { renderer: "canvas" });
        _chart.setOption(STATIC_OPTION);
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
    if (dirty_tab || dirty_labels) patch.dataZoom = get_zoom(tab, labels, datasets);

    _chart.setOption(patch, false);

    _last = {
        tab,
        labels: [...labels],
        datasets: datasets.map((ds) => ({ label: ds.label, data: [...ds.data] })),
    };
}

export function destroy_chart() {
    _resize_ob?.disconnect();
    _resize_ob = null;
    _chart?.dispose();
    _chart = null;
    _container = null;
    _last = { tab: null, labels: null, datasets: null };
}