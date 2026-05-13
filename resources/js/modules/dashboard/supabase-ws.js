import { supabase } from "@/core/lib/supabase";
import { init_metrics } from "@/modules/dashboard/metrics";
import { fetch_single_post } from "@/modules/dashboard/mood-space/post-service";
import {
    add_moodspace_item,
    replace_moodspace_item,
    delete_moodspace_item,
} from "@/modules/dashboard/mood-space/entries-manager";
import { debounce } from "@/core/lib/debounce";

// CENTRALIZE WEBSOCKET

let mood_channel = null;
let metrics_channel = null;
let metrics_timer = null;
const debounce_ms = 100; // reduce multiple call in short period

// stop realtime on channel failure
const on_channel_error = (status) => {
    if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") stop_realtime();
};

function refresh_metrics() {
    clearTimeout(metrics_timer);
    metrics_timer = setTimeout(() => init_metrics(), debounce_ms);
}

export function start_realtime() {
    if (mood_channel || metrics_channel) return; // only one active channel
    // Mood Listener Submodule
    mood_channel = supabase.channel("mood-space");
    mood_channel
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "posts" },
            async ({ new: r }) => {
                try {
                    const data = await fetch_single_post(r.id);
                    if (data) add_moodspace_item(data);
                } catch (err) {
                    console.error(
                        "[realtime] INSERT failed for post",
                        r.id,
                        err,
                    );
                }
            },
        )
        .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "posts" },
            async ({ new: r }) => {
                try {
                    const data = await fetch_single_post(r.id);
                    if (data) replace_moodspace_item(data);
                } catch (err) {
                    console.error(
                        "[realtime] UPDATE failed for post",
                        r.id,
                        err,
                    );
                }
            },
        )
        .on(
            "postgres_changes",
            { event: "DELETE", schema: "public", table: "posts" },
            ({ old }) => {
                if (old?.id) delete_moodspace_item(old.id);
            },
        )
        .subscribe(on_channel_error);
    // Metric Listener Submodule
    metrics_channel = supabase.channel("metrics");
    metrics_channel
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "posts" },
            refresh_metrics,
        )
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "students" },
            refresh_metrics,
        )
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "appointments" },
            refresh_metrics,
        )
        .subscribe(on_channel_error);
}

export async function stop_realtime() {
    clearTimeout(metrics_timer); // stop pending refresh
    if (mood_channel) {
        await supabase.removeChannel(mood_channel);
        mood_channel = null;
    }
    if (metrics_channel) {
        await supabase.removeChannel(metrics_channel);
        metrics_channel = null;
    }
}
