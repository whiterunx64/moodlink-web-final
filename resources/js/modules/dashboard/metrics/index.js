import { fetch_metrics } from "@/modules/dashboard/metrics/metrics-service";
import { sync_metrics } from "@/modules/dashboard/metrics/metrics-updater";
import { on_post_event, off_post_event, on_live_event, off_live_event } from "@/modules/dashboard/supabase-ws";
import { debounce } from "@/core/lib/debounce";

export async function init_metrics() {
    const data = await fetch_metrics();
    sync_metrics(data);
}

const refresh = debounce(init_metrics, 600);
const on_change = () => refresh.trigger();

export function init_metrics_listener() {
    on_live_event("students:changed", on_change);
    on_live_event("appointments:changed", on_change);
    on_post_event("insert", on_change);
    on_post_event("update", on_change);
    on_post_event("delete", on_change);
}

export function destroy_metrics_listener() {
    off_live_event("students:changed", on_change);
    off_live_event("appointments:changed", on_change);
    off_post_event("insert", on_change);
    off_post_event("update", on_change);
    off_post_event("delete", on_change);
    refresh.cancel();
}