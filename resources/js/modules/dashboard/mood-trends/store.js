import { supabase } from "@/core/lib/supabase";
import { dashboard_mood_trends_schema } from "@/core/lib/schema";

const _store = new Map();

export function get_all() {
    return [..._store.values()];
}

export function upsert(post) {
    if (!post?.id) return;
    _store.set(post.id, {
        id: post.id,
        mood: post.mood,
        datetime: post.datetime,
        students: { section: post.students?.section ?? null },
    });
}

export function remove(id) {
    _store.delete(id);
}

export async function seed_store() {
    const { data, error } = await supabase
        .from("posts")
        .select("id, mood, datetime, students(section)")
        .not("mood", "is", null)
        .order("datetime", { ascending: false });

    if (error) {
        console.error("[mood-trends/store] seed failed", error);
        return;
    }

    data.forEach((row) => {
        const result = dashboard_mood_trends_schema.safeParse(row);
        if (!result.success) {
            console.warn("[mood-trends/store] invalid row", row, result.error);
            return;
        }
        _store.set(result.data.id, result.data);
    });
}

export function get_sections() {
    const sections = [..._store.values()]
        .map((p) => p.students?.section)  // ← nested path
        .filter(Boolean);
    return ["All", ...new Set(sections)].sort();
}