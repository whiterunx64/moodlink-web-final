let active_tab = "Today";
let active_section = "All";
let filter_card = null;
let on_filter_change = null;

export const get_active_tab = () => active_tab;
export const get_active_section = () => active_section;

function on_event(e) {
    const { tab, section } = e.detail ?? {};
    const tab_changed = tab !== undefined && tab !== active_tab;
    const section_changed = section !== undefined && section !== active_section;

    if (!tab_changed && !section_changed) return;
    if (tab_changed) active_tab = tab;
    if (section_changed) active_section = section;

    on_filter_change?.();
}

export function wire_filters(card, onChange) {
    if (filter_card) unwire_filters();
    filter_card = card;
    on_filter_change = onChange;
    card.addEventListener("mood-trends:filter", on_event);
}

export function unwire_filters() {
    filter_card?.removeEventListener("mood-trends:filter", on_event);
    filter_card = null;
    on_filter_change = null;
    active_tab = "Today";
    active_section = "All";
}
