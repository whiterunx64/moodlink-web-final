import { purifyText } from "@/core/lib/xss-guard";

const CONTAINER_ID = "mood-space-container";

export function get_moodspace_container() {
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

export function format_today_label() {
    return new Date().toLocaleDateString([], {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    //always reflects today in the user's locale
}

// 1 BUILDS A MOOD ENTRY CARD NODE

export function build_moodspace_node(moodspace) {
    const flagged = is_flagged(moodspace.status);
    const name = resolve_name(moodspace.students, flagged);
    const initial = purifyText(name)?.[0]?.toUpperCase() || "?";
    const time = format_time(moodspace.datetime);

    const root = document.createElement("div");
    root.className = "mood-entry-item bg-gray-50 rounded-[10px] p-[14px_16px] hover:bg-zinc-100 transition-colors duration-200";
    root.dataset.moodspaceId = moodspace.id;

    const header = document.createElement("div");
    header.className = "flex justify-between items-center mb-[10px]";

    const left = document.createElement("div");
    left.className = "flex items-center gap-[10px]";

    const avatar = document.createElement("div");
    avatar.className = "w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0";
    avatar.textContent = initial;

    const meta = document.createElement("div");

    const title = document.createElement("h4");
    title.className = "font-semibold text-text-dark text-sm m-0";
    title.textContent = purifyText(name);

    const timeEl = document.createElement("span");
    timeEl.className = "text-text-muted text-[11px] block mt-px";
    timeEl.textContent = time;

    meta.appendChild(title);
    meta.appendChild(timeEl);
    left.appendChild(avatar);
    left.appendChild(meta);
    header.appendChild(left);

    if (flagged) {
        const flag = document.createElement("span");
        flag.className = "bg-red-100 text-red-600 text-[11px] px-2 py-[3px] font-medium rounded";
        flag.textContent = "⚑ Flagged";
        header.appendChild(flag);
    }

    const content = document.createElement("p");
    content.className = "text-text-muted content-clamp";
    content.textContent = moodspace.content ?? "";

    root.appendChild(header);
    root.appendChild(content);

    requestAnimationFrame(() => {
        const isTruncated = content.scrollHeight > content.clientHeight;
        if (!isTruncated) return;

        root.classList.add("cursor-pointer");

        const indicator = document.createElement("div");
        indicator.className = "inline-flex items-center gap-1 mt-2 text-[12px] font-semibold text-gray-900 opacity-55 hover:opacity-100 transition-opacity duration-150 select-none";
        indicator.innerHTML = `
            <span>See full message</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
            </svg>
        `;

        root.appendChild(indicator);
        root.addEventListener("click", () =>
            open_moodspace_modal(moodspace, name, initial, time, flagged)
        );
    });

    return root;
}

// 2 BUILDS AND OPENS A FULL-MESSAGE MODAL

function open_moodspace_modal(moodspace, name, initial, time, flagged) {
    document.getElementById("moodspace-modal-overlay")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "moodspace-modal-overlay";
    overlay.className = "ms-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/45";

    const modal = document.createElement("div");
    modal.className = "ms-modal bg-white rounded-xl w-full max-w-[500px] max-h-[80vh] flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)]";

    const header = document.createElement("div");
    header.className = "flex justify-between items-center px-5 py-4 border-b border-gray-100";

    const left = document.createElement("div");
    left.className = "flex items-center gap-3";

    const avatar = document.createElement("div");
    avatar.className = "w-[38px] h-[38px] rounded-full flex items-center justify-center text-[15px] font-bold text-white bg-accent shrink-0";
    avatar.textContent = initial;

    const meta = document.createElement("div");

    const mName = document.createElement("p");
    mName.className = "m-0 font-bold text-sm text-gray-900";
    mName.textContent = purifyText(name);

    const mTime = document.createElement("p");
    mTime.className = "m-0 text-[12px] text-gray-400";
    mTime.textContent = time;

    meta.appendChild(mName);
    meta.appendChild(mTime);
    left.appendChild(avatar);
    left.appendChild(meta);

    const closeBtn = document.createElement("button");
    closeBtn.className = "w-[30px] h-[30px] rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 border-none cursor-pointer text-lg flex items-center justify-center transition-colors duration-150";
    closeBtn.innerHTML = "&times;";

    header.appendChild(left);
    header.appendChild(closeBtn);

    const bodyWrap = document.createElement("div");
    bodyWrap.className = "px-5 py-5 overflow-y-auto text-sm text-gray-700 leading-[1.8] whitespace-pre-wrap break-words";

    if (flagged) {
        const flag = document.createElement("div");
        flag.className = "inline-flex items-center gap-1 mb-[14px] px-3 py-[5px] bg-red-100 text-red-600 text-[12px] font-semibold rounded-full";
        flag.textContent = "⚑ Flagged";
        bodyWrap.appendChild(flag);
    }

    const content = document.createElement("p");
    content.textContent = moodspace.content ?? "";

    bodyWrap.appendChild(content);
    modal.appendChild(header);
    modal.appendChild(bodyWrap);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();

    closeBtn.onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    document.addEventListener("keydown", function onKey(e) {
        if (e.key === "Escape") {
            close();
            document.removeEventListener("keydown", onKey);
        }
    });
}


// 3 BUILDS A SKELETON CARD NODE

export function build_skeleton_card() {
    const root = document.createElement("div");
    root.className =
        "bg-gray-100 rounded-[10px] p-[14px_16px] w-full relative overflow-hidden animate-pulse";
    root.setAttribute("aria-hidden", "true");
    root.dataset.type = "loading";

    const header = document.createElement("div");
    header.className = "flex justify-between items-center mb-[10px]";

    const left = document.createElement("div");
    left.className = "flex items-center gap-[10px]";

    const avatar = document.createElement("div");
    avatar.className = "w-7 h-7 shrink-0 rounded-full bg-gray-300";

    // mirrors the real card's meta block (name + time stacked)
    const meta = document.createElement("div");

    const name = document.createElement("div");
    name.className = "h-3 w-24 bg-gray-300 rounded";

    const time = document.createElement("div");
    time.className = "h-2.5 w-10 bg-gray-300 rounded mt-1";

    meta.appendChild(name);
    meta.appendChild(time);
    left.appendChild(avatar);
    left.appendChild(meta);
    header.appendChild(left);

    const badge = document.createElement("div");
    badge.className = "h-5 w-14 bg-gray-300 rounded shrink-0";
    header.appendChild(badge);

    const line1 = document.createElement("div");
    line1.className = "h-3 w-full bg-gray-300 rounded mt-1";

    const line2 = document.createElement("div");
    line2.className = "h-3 w-3/4 bg-gray-300 rounded mt-2";

    root.appendChild(header);
    root.appendChild(line1);
    root.appendChild(line2);

    return root;
}


// 4 RETURNS THE EMPTY STATE NODE (rendered by Blade, with fallback)
 
export function build_moodspace_empty_node() {
    const el = document.getElementById("mood-space-empty");
    if (el) return el;
 
    // fallback if Blade template is missing
    const fallback = document.createElement("div");
    fallback.id = "mood-space-empty";
    fallback.className =
        "flex flex-col items-center justify-center h-full min-h-[200px] text-text-muted text-sm text-center gap-2";
    fallback.innerHTML = `
        <p class="font-medium text-text-dark">No mood entries today</p>
        <p class="text-xs text-text-muted">Students haven't submitted any entries yet.</p>
    `;
    return fallback;
}

// 5 PREPENDS A NODE TO THE POST

export function add_moodspace_item(moodspace) {
    const c = get_moodspace_container();
    if (!c) return;

    document.getElementById("mood-space-empty")?.remove();

    const node = build_moodspace_node(moodspace);
    node.classList.add("ms-enter");
    c.prepend(node);

    void node.offsetHeight; // force reflow

    node.classList.remove("ms-enter");
    node.classList.add("ms-enter-active");

    node.addEventListener("transitionend", () => {
        node.classList.remove("ms-enter-active");
    }, { once: true });
}

// 6 REPLACES A NODE IN THE POST

export function replace_moodspace_item(moodspace) {
    const c = get_moodspace_container();
    if (!c) return;

    const existing = c.querySelector(`[data-moodspace-id="${moodspace.id}"]`);
    if (!existing?.isConnected) return add_moodspace_item(moodspace);

    existing.classList.add("ms-exit");

    existing.addEventListener("transitionend", () => {
        if (!existing.isConnected) return;

        const node = build_moodspace_node(moodspace);
        node.classList.add("ms-enter");
        existing.replaceWith(node);

        void node.offsetHeight;

        node.classList.remove("ms-enter");
        node.classList.add("ms-enter-active");

        node.addEventListener("transitionend", () => {
            node.classList.remove("ms-enter-active");
        }, { once: true });
    }, { once: true });
}

// 7 REMOVES A NODE FROM THE POST

export function delete_moodspace_item(id) {
    const c = get_moodspace_container();
    if (!c) return;

    const node = c.querySelector(`[data-moodspace-id="${id}"]`);
    if (!node) return;

    node.style.height = node.offsetHeight + "px";
    node.style.overflow = "hidden";

    void node.getBoundingClientRect(); // force reflow

    node.classList.add("ms-exit-collapse");

    node.addEventListener("transitionend", (e) => {
        if (e.propertyName !== "height") return;
        if (!node.isConnected) return;
        node.remove();
        if (!c.children.length) c.appendChild(build_moodspace_empty_node());
    }, { once: true });
}