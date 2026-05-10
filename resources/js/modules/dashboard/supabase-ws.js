import { supabase } from "@/core/lib/supabase";
import { init_metrics } from "@/modules/dashboard/metrics";
import { get_single_moodspace } from "@/modules/dashboard/mood-space/mood-space-fetch";
import {
    add_moodspace_item,
    replace_moodspace_item,
    delete_moodspace_item,
} from "@/modules/dashboard/mood-space/mood-space-render";

// CENTRALIZE WEBSOCKET

let channel = null;
let metrics_timer = null;
const debounce_ms = 200; // reduce multiple call in short period

// websocket call debouncer
function refresh_metrics() {
    clearTimeout(metrics_timer);
    metrics_timer = setTimeout(() => init_metrics(), debounce_ms);
}

export function start_realtime() {
    if (channel) return channel; // only one active channel
    channel = supabase.channel("dashboard");
    channel
        // posts — mood-space UI + metrics
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "posts" },
            async ({ new: r }) => {
                const data = await get_single_moodspace(r.id);
                if (data) add_moodspace_item(data);
                refresh_metrics();
            },
        )
        .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "posts" },
            async ({ new: r }) => {
                const data = await get_single_moodspace(r.id);
                if (data) replace_moodspace_item(data);
                refresh_metrics();
            },
        )
        .on(
            "postgres_changes",
            { event: "DELETE", schema: "public", table: "posts" },
            ({ old }) => {
                if (old?.id) delete_moodspace_item(old.id);
                refresh_metrics();
            },
        )
        // students — metrics count, moodspace display names
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "students" },
            () => refresh_metrics(),
        )
        // appointments — metrics only
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "appointments" },
            () => refresh_metrics(),
        )
        .subscribe((status, err) => {
            if (err) console.error("[realtime]", err.message);
        });

    return channel;
}

export async function stop_realtime() {
    if (!channel) return; // channel protection
    clearTimeout(metrics_timer);
    await supabase.removeChannel(channel);
    channel = null;
}
