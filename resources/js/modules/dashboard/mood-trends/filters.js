let _active_tab = "Today";
let _active_section = "All";
let _card = null;
let _on_change = null;

export function get_active_tab() {
    return _active_tab;
}

export function get_active_section() {
    return _active_section;
}

function on_filter_event(e) {
    const { tab, section } = e.detail ?? {};

    const tab_changed = tab && tab !== _active_tab;
    const section_changed = section && section !== _active_section;

    if (!tab_changed && !section_changed) return;

    if (tab_changed) _active_tab = tab;
    if (section_changed) _active_section = section;

    _on_change?.();
}

export function wire_filters(card, on_change) {
    _card = card;
    _on_change = on_change;
    card.addEventListener("mood-trends:filter", on_filter_event);
}

export function unwire_filters() {
    _card?.removeEventListener("mood-trends:filter", on_filter_event);
    _card = null;
    _on_change = null;
    _active_tab = "Today";
    _active_section = "All";
}