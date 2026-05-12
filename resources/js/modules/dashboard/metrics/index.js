import { fetch_metrics } from "@/modules/dashboard/metrics/metrics-fetch";
import { update_metrics_ui } from "@/modules/dashboard/metrics/metrics-render";

export async function init_metrics() {
    const data = await fetch_metrics();
    update_metrics_ui(data);
}
