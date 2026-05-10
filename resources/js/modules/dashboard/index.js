import { init_mood_space } from "@/modules/dashboard/mood-space";
import { init_metrics } from "@/modules/dashboard/metrics";
import { start_realtime, stop_realtime } from "@/modules/dashboard/supabase-ws";

export function init_dashboard() {
    init_mood_space();
    init_metrics();
    start_realtime();
}

export async function destroy_dashboard() {
    await stop_realtime();
}
