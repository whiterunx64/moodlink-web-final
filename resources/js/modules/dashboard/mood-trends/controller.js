import { seed_store, get_all, get_sections } from "./data-store.js";
import { aggregate } from "./aggregator.js";
import { render } from "./chart.js";
import { get_active_tab, get_active_section } from "./filters.js";

let trends_widget = null;

export function set_trends_widget(el) {
    trends_widget = el;
}

export function rerender() {
    render(
        aggregate(get_all(), get_active_tab(), get_active_section()),
        get_active_tab(),
    );
}

export function dispatch_sections() {
    trends_widget?.dispatchEvent(
        new CustomEvent("mood-trends:sections", {
            bubbles: false,
            detail: { sections: get_sections() },
        }),
    );
}

export async function on_changed() {
    await seed_store();
    dispatch_sections();
    rerender();
}
