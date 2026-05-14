import * as echarts from "echarts";
import { seed_store, get_all, get_sections, upsert, remove } from "./store.js";
import { aggregate } from "./aggregator.js";
import { set_canvas, render, destroy_chart } from "./chart.js";
import { wire_filters, unwire_filters, get_active_tab, get_active_section } from "./filters.js";
import { on_post_event, off_post_event } from "@/modules/dashboard/supabase-ws";

window.echarts = echarts;

function rerender() {
    render(aggregate(get_all(), get_active_tab(), get_active_section()));
}

const on_insert = (post) => { upsert(post); rerender(); };
const on_update = (post) => { upsert(post); rerender(); };
const on_delete = ({ id }) => { if (!id) return; remove(id); rerender(); };

export async function init_mood_trends() {
    const canvas = document.querySelector("[data-mood-trends-chart]");
    if (!canvas) return;

    set_canvas(canvas);

    const widget = canvas.closest("[data-mood-trends]");
    wire_filters(widget, rerender);
    // Push sections into Alpine component data — no DOM injection needed
    await seed_store();

    widget.dispatchEvent(
        new CustomEvent("mood-trends:sections", {
            bubbles: false,
            detail: { sections: get_sections() },
        })
    );

    rerender();
}

export function init_moodtrends_listener() {
    on_post_event("insert", on_insert);
    on_post_event("update", on_update);
    on_post_event("delete", on_delete);
}

export function destroy_moodtrends_listener() {
    off_post_event("insert", on_insert);
    off_post_event("update", on_update);
    off_post_event("delete", on_delete);

    unwire_filters();
    destroy_chart();
}