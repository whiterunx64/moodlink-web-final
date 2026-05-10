import { load_moodspace_feed } from "@/modules/dashboard/mood-space/mood-space-fetch";

export async function init_mood_space() {
    await load_moodspace_feed();
}