import { supabase } from "@/core/lib/supabase";
import { apply_today_range } from "@/core/lib/date"; // time helper
import { dashboard_moodspace_schema } from "@/core/lib/schema";
import {
    get_container,
    build_moodspace_node,
    build_moodspace_loading_node,
    build_moodspace_empty_node,
} from "@/modules/dashboard/mood-space/mood-space-render";

export function moodspace_query() {
    return supabase.from("posts").select(`
        id, mood, content, datetime, status,
        students ( anonymous_name, first_name, last_name )
    `);
}

export async function get_moodspace_data(query) {
    const { data, error } = await query;
    if (error) return [];
    const rows = Array.isArray(data) ? data : data ? [data] : [];
    return rows
        .map((r) => dashboard_moodspace_schema.safeParse(r))
        .filter((r) => r.success) // discard invalid payloads
        .map((r) => r.data); 
}
// render skeleton UI
export async function load_moodspace_feed() {
    const c = get_container();
    if (!c) return;

    c.innerHTML = "";
    Array(3)
        .fill(null)
        .forEach(() => c.appendChild(build_moodspace_loading_node()));

    const data = await get_moodspace_data(
        apply_today_range(moodspace_query()).order("datetime", {
            ascending: false,
        }), // date.js wrap helper
    );

    c.innerHTML = "";

    if (!data.length) {
        c.appendChild(build_moodspace_empty_node());
        return;
    }

    data.forEach((item) => c.appendChild(build_moodspace_node(item)));
}

export async function get_single_moodspace(id) {
    const data = await get_moodspace_data(
        moodspace_query().eq("id", id).limit(1),
    );
    return data[0] ?? null;
}
