import { purifyText } from "@/core/lib/xss-guard";

const CONTAINER_ID = "mood-space-feed";

export function get_container() {
    return document.getElementById(CONTAINER_ID);
}

export function format_time(datetime) {
    const d = new Date(datetime);
    return isNaN(d)
        ? ""
        : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function is_flagged(status) {
    return String(status).toLowerCase() === "flagged";
}

export function resolve_name(student, flagged) {
    if (!flagged) return "Anonymous";
    const name =
        `${student?.first_name ?? ""} ${student?.last_name ?? ""}`.trim();
    return name || student?.anonymous_name || "Unknown";
}


// 1 BUILDS A MOOD ENTRY CARD NODE

export function build_moodspace_node(moodspace) {
    const flagged = is_flagged(moodspace.status);
    const name = resolve_name(moodspace.students, flagged);
    const initial = purifyText(name)?.[0]?.toUpperCase() || "?";
    const time = format_time(moodspace.datetime);

    const root = document.createElement("div");
    root.className = "bg-gray-50 rounded-lg p-4 mood-entry-item";
    root.dataset.moodspaceId = moodspace.id;

    const header = document.createElement("div");
    header.className = "flex justify-between items-start mb-2";

    const left = document.createElement("div");
    left.className = "flex items-center gap-2";

    const avatar = document.createElement("div");
    avatar.className =
        "w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold";
    avatar.textContent = initial;

    const title = document.createElement("h4");
    title.className = "font-semibold text-text-dark text-sm";
    title.textContent = purifyText(name);

    left.appendChild(avatar);
    left.appendChild(title);

    const timeEl = document.createElement("span");
    timeEl.className = "text-xs text-text-muted";
    timeEl.textContent = time;

    header.appendChild(left);
    header.appendChild(timeEl);

    const content = document.createElement("p");
    content.className = "text-sm text-text-muted leading-relaxed";
    content.textContent = moodspace.content ?? "";

    root.appendChild(header);
    root.appendChild(content);

    if (flagged) {
        const flag = document.createElement("span");
        flag.className =
            "inline-block mt-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded";
        flag.textContent = "Flagged";
        root.appendChild(flag);
    }

    return root;
}

// 2 BUILDS A SKELETON CARD NODE

export function build_moodspace_loading_node() {
    const root = document.createElement("div");
    root.className = "bg-gray-50 rounded-lg p-4 mood-entry-item animate-pulse";
    root.setAttribute("aria-hidden", "true");
    root.dataset.type = "loading";

    const header = document.createElement("div");
    header.className = "flex justify-between items-start mb-2";

    const left = document.createElement("div");
    left.className = "flex items-center gap-2";

    const avatar = document.createElement("div");
    avatar.className = "w-7 h-7 rounded-full bg-gray-200";

    const name = document.createElement("div");
    name.className = "h-3 w-24 bg-gray-200 rounded";

    left.appendChild(avatar);
    left.appendChild(name);

    const time = document.createElement("div");
    time.className = "h-3 w-10 bg-gray-200 rounded";

    header.appendChild(left);
    header.appendChild(time);

    const line1 = document.createElement("div");
    line1.className = "h-3 w-full bg-gray-200 rounded mb-2 mt-3";

    const line2 = document.createElement("div");
    line2.className = "h-3 w-2/3 bg-gray-200 rounded";

    root.appendChild(header);
    root.appendChild(line1);
    root.appendChild(line2);

    return root;
}

// 3 BUILDS AN EMPTY STATE NODE

export function build_moodspace_empty_node() {
    const el = document.createElement("div");
    el.id = "mood-space-empty";
    el.className = "text-center py-10 text-text-muted text-sm";
    el.textContent = "No mood entries yet.";
    return el;
}

// 4 PREPENDS A NODE TO THE FEED

export function add_moodspace_item(moodspace) {
    const c = get_container();
    if (!c) return;

    document.getElementById("mood-space-empty")?.remove();

    const node = build_moodspace_node(moodspace);

    node.style.opacity = "0";
    node.style.transform = "translateY(-10px)";
    node.style.transition = "none";

    c.prepend(node);

    void node.offsetHeight; // force reflow before transition

    node.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    node.style.opacity = "1";
    node.style.transform = "translateY(0)";
}

// 5 REPLACES A NODE IN THE FEED

export function replace_moodspace_item(moodspace) {
    const c = get_container();
    if (!c) return;

    const existing = c.querySelector(`[data-moodspace-id="${moodspace.id}"]`);
    if (!existing || !existing.isConnected) {
        return add_moodspace_item(moodspace);
    }

    existing.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    existing.style.opacity = "0";
    existing.style.transform = "translateY(-6px)";

    existing.addEventListener(
        "transitionend",
        () => {
            if (!existing.isConnected) return;

            const node = build_moodspace_node(moodspace);

            node.style.opacity = "0";
            node.style.transform = "translateY(-10px)";
            node.style.transition = "none";

            existing.replaceWith(node);

            node.offsetHeight;

            node.style.transition = "opacity 0.25s ease, transform 0.25s ease";
            node.style.opacity = "1";
            node.style.transform = "translateY(0)";
        },
        { once: true },
    );
}

// 6 REMOVES A NODE FROM THE FEED

export function delete_moodspace_item(id) {
    const c = get_container();
    if (!c) return;
    const node = c.querySelector(`[data-moodspace-id="${id}"]`);
    if (!node) return;
    node.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    node.style.opacity = "0";
    node.style.transform = "translateY(-6px)";
    node.addEventListener(
        "transitionend",
        () => {
            if (!node.isConnected) return;
            node.remove();
            if (!c.children.length) {
                c.appendChild(build_moodspace_empty_node());
            }
        },
        { once: true },
    );
}
