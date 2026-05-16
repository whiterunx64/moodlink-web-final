import { supabase } from "@/core/lib/supabase";
import { dashboard_mood_trends_schema } from "@/core/lib/schema";

const post_store = new Map();

export const get_all = () => [...post_store.values()];

export function get_sections() {
    const seen_sections = new Set(
        [...post_store.values()]
            .map((p) => {
                const section_data = p.students;
                return Array.isArray(section_data)
                    ? section_data[0]?.section
                    : section_data?.section;
            })
            .filter(Boolean),
    );
    return ["All", ...[...seen_sections].sort()];
}

export async function seed_store() {
    post_store.clear();

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
        const parsed_row = dashboard_mood_trends_schema.safeParse(row);
        if (parsed_row.success)
            post_store.set(parsed_row.data.id, parsed_row.data);
        else console.warn("[mood-trends] invalid row", row, parsed_row.error);
    }
}
