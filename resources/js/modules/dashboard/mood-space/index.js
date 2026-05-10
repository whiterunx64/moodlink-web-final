import { load_moodspace_feed } from "@/modules/dashboard/mood-space/mood-space-fetch";
import { start_moodspace_listener, stop_moodspace_listener } from "@/modules/dashboard/mood-space/mood-space-realtime";

export async function init_mood_space() {
    await load_moodspace_feed();
    const channel = start_moodspace_listener();

    window.addEventListener("beforeunload", () => {
        stop_moodspace_listener(channel);
    });
}