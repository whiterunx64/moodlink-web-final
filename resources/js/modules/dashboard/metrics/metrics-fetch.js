import { supabase } from "@/core/lib/supabase";
import { dashboard_metrics_schema } from "@/core/lib/schema";

export async function fetch_metrics() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    const range = (q) => q.gte("datetime", startISO).lte("datetime", endISO);

    const [
        { count: logs, error: logsErr },
        { count: students, error: stuErr },
        { count: flagged, error: flagErr },
        { count: requests, error: reqErr },
    ] = await Promise.all([
        range(
            supabase.from("posts").select("*", { count: "exact", head: true }),
        ),

        supabase.from("students").select("*", { count: "exact", head: true }),

        range(
            supabase
                .from("posts")
                .select("*", { count: "exact", head: true })
                .eq("status", "flagged"),
        ),

        supabase
            .from("appointments")
            .select("*", { count: "exact", head: true }),
    ]);

    if (logsErr) console.error(logsErr);
    if (stuErr) console.error(stuErr);
    if (flagErr) console.error(flagErr);
    if (reqErr) console.error(reqErr);

    // debug: fetch full rows DEBOGGER
    //    const [
    //        { data: logsData },
    //        { data: studentsData },
    //        { data: flaggedData },
    //        { data: requestsData },
    //    ] = await Promise.all([
    //        range(supabase.from("posts").select("*")),
    //        supabase.from("students").select("*"),
    //        range(supabase.from("posts").select("*").eq("status", "flagged")),
    //        supabase.from("appointments").select("*"),
    //    ]);
    //    console.log("[students]", studentsData); // students table
    //    console.log("[flagged]",  flaggedData); // posts table
    //    console.log("[requests]", requestsData); // appointment table

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
