import { init_moodspace, init_moodspace_listener, destroy_moodspace_listener } from "@/modules/dashboard/mood-space";
import { init_metrics, init_metrics_listener, destroy_metrics_listener } from "@/modules/dashboard/metrics";
import { start_realtime, stop_realtime } from "@/modules/dashboard/supabase-ws";

export async function init_dashboard() {
    await Promise.all([
        init_moodspace(),
        init_metrics(),
    ]);
    init_moodspace_listener();
    init_metrics_listener();

    start_realtime();
}

export async function destroy_dashboard() {
    destroy_moodspace_listener();
    destroy_metrics_listener();
    await stop_realtime();
}