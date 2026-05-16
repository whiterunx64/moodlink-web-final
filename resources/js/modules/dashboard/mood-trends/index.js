import { set_canvas, destroy_chart } from "./chart.js";
import { wire_filters, unwire_filters } from "./filters.js";
import {
    set_trends_widget,
    rerender,
    dispatch_sections,
    on_changed,
} from "./controller.js";
import { seed_store } from "./data-store.js";
import { on_live_event, off_live_event } from "@/modules/dashboard/supabase-ws";
import { debounce } from "@/core/lib/debounce.js";

const refresh = debounce(on_changed, 600);
const on_change = () => refresh.trigger();

export async function init_mood_trends() {
    const canvas = document.querySelector("[data-mood-trends-chart]");
    if (!canvas) return;

    const trends_widget = canvas.closest("[data-mood-trends]");
    set_trends_widget(trends_widget);
    set_canvas(canvas); // bind chart to canvas
    wire_filters(trends_widget, rerender);

    await seed_store();
    dispatch_sections();
    rerender(); // initial chart render
}
// listen to realtime event
export function init_moodtrends_listener() {
    on_live_event("posts:changed", on_change);
    on_live_event("students:changed", on_change);
}
// remove realtime listeners and cleanup
export function destroy_moodtrends_listener() {
    off_live_event("posts:changed", on_change);
    off_live_event("students:changed", on_change);
    refresh.cancel();
    unwire_filters();
    destroy_chart();
}
