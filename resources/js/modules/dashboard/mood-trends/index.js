import { seed_store, get_all, get_sections } from "./store.js";
import { aggregate } from "./aggregator.js";
import { set_canvas, render, destroy_chart } from "./chart.js";
import {
    wire_filters,
    unwire_filters,
    get_active_tab,
    get_active_section,
} from "./filters.js";
import { on_live_event, off_live_event } from "@/modules/dashboard/supabase-ws";

let _widget = null;

function rerender() {
    render(
        aggregate(get_all(), get_active_tab(), get_active_section()),
        get_active_tab(),
    );
}

function dispatch_sections() {
    _widget?.dispatchEvent(
        new CustomEvent("mood-trends:sections", {
            bubbles: false,
            detail: { sections: get_sections() }, // sections payload
        }),
    );
}

async function on_changed() {
    await seed_store();
    dispatch_sections();
    rerender();
}

export async function init_mood_trends() {
    const canvas = document.querySelector("[data-mood-trends-chart]");
    if (!canvas) return;

    _widget = canvas.closest("[data-mood-trends]");
    set_canvas(canvas); // bind chart to canvas
    wire_filters(_widget, rerender);

    await seed_store();
    dispatch_sections();
    rerender(); // initial chart render
}
// listen to realtime event
export function init_moodtrends_listener() {
    on_live_event("posts:changed", on_changed);
    on_live_event("students:changed", on_changed);
}
// remove realtime listeners and cleanup
export function destroy_moodtrends_listener() {
    off_live_event("posts:changed", on_changed);
    off_live_event("students:changed", on_changed);
    unwire_filters();
    destroy_chart();
    _widget = null;
}
