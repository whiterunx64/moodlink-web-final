let _tab = "Today";
let _section = "All";
let _card = null;
let _onChange = null;

export const get_active_tab = () => _tab;
export const get_active_section = () => _section;

function on_event(e) {
    const { tab, section } = e.detail ?? {};
    const diff_tab = tab !== undefined && tab !== _tab;
    const diff_section = section !== undefined && section !== _section;

    if (!diff_tab && !diff_section) return;
    if (diff_tab) _tab = tab;
    if (diff_section) _section = section;

    _onChange?.();
}

export function wire_filters(card, onChange) {
    if (_card) unwire_filters();
    _card = card;
    _onChange = onChange;
    card.addEventListener("mood-trends:filter", on_event);
}

export function unwire_filters() {
    _card?.removeEventListener("mood-trends:filter", on_event);
    _card = null;
    _onChange = null;
    _tab = "Today";
    _section = "All";
}