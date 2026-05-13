import { fetch_metrics } from "@/modules/dashboard/metrics/metrics-service";
import { sync_metrics } from "@/modules/dashboard/metrics/metrics-updater";

export async function init_metrics() {
    const data = await fetch_metrics();
    sync_metrics(data);
}