import { schedule_midnight_refresh } from "@/core/lib/date";
import { load_moodspace_feed } from "@/modules/dashboard/mood-space/mood-space-fetch";

export async function init_mood_space() {
    schedule_midnight_refresh(load_moodspace_feed);
    await load_moodspace_feed();
}