import { supabase } from "@/core/lib/supabase";
import { dashboard_mood_trends_schema } from "@/core/lib/schema";

const _store = new Map();

export const get_all = () => [..._store.values()];

export function get_sections() {
    const seen = new Set(
        [..._store.values()]
            .map((p) => {
                const s = p.students;
                return Array.isArray(s) ? s[0]?.section : s?.section;
            })
            .filter(Boolean),
    );
    return ["All", ...[...seen].sort()];
}

export async function seed_store() {
    _store.clear();

    const { data, error } = await supabase
        .from("posts")
        .select("id, mood, datetime, students(section)")
        .not("mood", "is", null) // exclude rows where mood is null
        .order("datetime", { ascending: false }); // sort by datetime descending

    if (error) {
        console.error("[mood-trends] seed failed", error);
        return;
    }

    for (const row of data) {
        const result = dashboard_mood_trends_schema.safeParse(row);
        if (result.success) _store.set(result.data.id, result.data);
        else console.warn("[mood-trends] invalid row", row, result.error);
    }
}
