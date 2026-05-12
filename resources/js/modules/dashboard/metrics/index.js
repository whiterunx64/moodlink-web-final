import { fetch_metrics } from "@/modules/dashboard/metrics/metrics-fetch";
import { sync_metrics } from "@/modules/dashboard/metrics/metrics-render";

export async function init_metrics() {
    const data = await fetch_metrics();
    sync_metrics(data);
}
