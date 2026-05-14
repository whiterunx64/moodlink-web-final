import { init_moodspace, init_moodspace_listener, destroy_moodspace_listener } from "@/modules/dashboard/mood-space";
import { init_metrics, init_metrics_listener, destroy_metrics_listener } from "@/modules/dashboard/metrics";
import { init_mood_trends, init_moodtrends_listener, destroy_moodtrends_listener } from "@/modules/dashboard/mood-trends";
import { start_realtime, stop_realtime } from "@/modules/dashboard/supabase-ws";

export async function init_dashboard() {
    await Promise.all([
        init_moodspace(),
        init_metrics(),
        init_mood_trends(),
    ]);

    init_moodspace_listener();
    init_metrics_listener();
    init_moodtrends_listener();

    start_realtime();
}

export async function destroy_dashboard() {
    destroy_moodspace_listener();
    destroy_metrics_listener();
    destroy_moodtrends_listener();
    await stop_realtime();
}