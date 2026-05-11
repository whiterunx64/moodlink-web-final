import { count_query } from "@/core/lib/supabase";
import { apply_today_range } from "@/core/lib/date";
import { dashboard_metrics_schema } from "@/core/lib/schema";

export async function fetch_metrics() {
    const [
        { count: logs, error: logsErr },
        { count: students, error: stuErr },
        { count: flagged, error: flagErr },
        { count: requests, error: reqErr },
    ] = await Promise.all([
        apply_today_range(count_query("posts")),
        count_query("students"),
        apply_today_range(count_query("posts")).eq("status", "flagged"),
        count_query("appointments"),
    ]);

    if (logsErr) console.error(logsErr);
    if (stuErr) console.error(stuErr);
    if (flagErr) console.error(flagErr);
    if (reqErr) console.error(reqErr);

    const parsed = dashboard_metrics_schema.safeParse({
        logs: logs ?? 0,
        students: students ?? 0,
        flagged: flagged ?? 0,
        requests: requests ?? 0,
    });

    return parsed.success
        ? parsed.data
        : { logs: 0, students: 0, flagged: 0, requests: 0 };
}
