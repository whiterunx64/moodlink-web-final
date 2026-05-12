import { supabase } from "@/core/lib/supabase";
import { apply_today_range } from "@/core/lib/date"; // time helper
import { dashboard_moodspace_schema } from "@/core/lib/schema";
import {
    get_container,
    build_moodspace_node,
    build_moodspace_loading_node,
    build_moodspace_empty_node,
    format_today_label,
} from "@/modules/dashboard/mood-space/mood-space-render";

let active_feed_controller = null; // abort control

export function moodspace_query() {
    return supabase.from("posts").select(`
        id, mood, content, datetime, status,
        students ( anonymous_name, first_name, last_name )
    `);
}

export async function get_moodspace_data(query) {
    const { data, error } = await query;
    if (error) throw error; // let caller handle it
    const rows = Array.isArray(data) ? data : data ? [data] : [];
    return rows
        .map((r) => dashboard_moodspace_schema.safeParse(r))
        .filter((r) => r.success) // discard invalid payloads
        .map((r) => r.data);
}

// 1 RENDER SKELETON UI

export async function load_moodspace_feed() {
    const c = get_container();
    if (!c) return;

    // abort any in-flight fetch
    if (active_feed_controller) active_feed_controller.abort();
    active_feed_controller = new AbortController();
    const { signal } = active_feed_controller;

    const subtitle = document.getElementById("moodspace-subtitle");
    if (subtitle) subtitle.textContent = format_today_label();

    c.replaceChildren();
    Array(3)
        .fill(null)
        .forEach(() => c.appendChild(build_moodspace_loading_node()));

    try {
        const data = await get_moodspace_data(
            apply_today_range(moodspace_query()).order("datetime", {
                ascending: false, // newest posts first
            }),
        );

        if (signal.aborted) return; // stale response, discard

        c.replaceChildren();

        if (!data.length) {
            c.appendChild(build_moodspace_empty_node());
            return;
        }

        data.forEach((item) => c.appendChild(build_moodspace_node(item)));
    } catch (err) {
        if (signal.aborted) return; // expected, ignore
        console.error("[moodspace] failed to load feed", err);

        c.replaceChildren();
        const error_node = document.createElement("div");
        error_node.className =
            "flex items-center justify-center h-full min-h-[200px] text-red-400 text-sm";
        error_node.textContent = "Failed to load entries. Please try again.";
        c.appendChild(error_node);
    } finally {
        active_feed_controller = null;
    }
}

// 2 FETCH SINGLE MOODSPACE DATA

export async function get_single_moodspace(id) {
    try {
        const data = await get_moodspace_data(
            moodspace_query().eq("id", id).limit(1),
        );
        return data[0] ?? null;
    } catch (err) {
        console.error("[moodspace] failed to fetch single post", id, err);
        return null;
    }
}