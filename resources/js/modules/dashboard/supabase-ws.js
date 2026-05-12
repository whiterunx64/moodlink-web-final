import { supabase } from "@/core/lib/supabase";
import { init_metrics } from "@/modules/dashboard/metrics";
import { get_single_moodspace } from "@/modules/dashboard/mood-space/mood-space-fetch";
import {
    add_moodspace_item,
    replace_moodspace_item,
    delete_moodspace_item,
} from "@/modules/dashboard/mood-space/mood-space-render";
import { debounce } from "@/core/lib/debounce";

// CENTRALIZE WEBSOCKET

let mood_channel = null;
let metrics_channel = null;
let counts_channel = null;
const debounce_ms = 100; // reduce multiple call in short period

// DASHBOARD SUBMODULE REFRESH HANDLER -- check core/lib/debounce.js

const refresh_metrics = debounce(init_metrics, debounce_ms);

// stop realtime on channel failure
const on_channel_error = (status) => {
    if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") stop_realtime();
};

export function start_realtime() {
    if (mood_channel || metrics_channel || counts_channel) return; // only one active channel
    // Mood Listener Submodule
    mood_channel = supabase.channel("mood-space");
    mood_channel
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "posts" },
            async ({ new: r }) => {
                try {
                    const data = await get_single_moodspace(r.id);
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
                    const data = await get_single_moodspace(r.id);
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
            { event: "*", schema: "public", table: "students" },
            () => refresh_metrics.trigger(), // student count changed
        )
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "appointments" },
            // logs the data
            // (payload) => { console.log("[metrics] appointments fired", payload); refresh_metrics.trigger(); },
            () => refresh_metrics.trigger(), // appointment count changed
        )
        // check logs channel subscription status
        // .subscribe((status) => { console.log("[metrics] channel status →", status); on_channel_error(status); });
        .subscribe(on_channel_error);
    // Count Listener Submodule
    counts_channel = supabase.channel("counts");
    counts_channel
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "posts" },
            () => refresh_metrics.trigger(), // post affects log + flagged count
        )
        // .on("postgres_changes", { event: "*", schema: "public", table: "escalations" }, () => refresh_metrics.trigger())
        .subscribe(on_channel_error);
}

export async function stop_realtime() {
    refresh_metrics.cancel(); // clear any pending debounced refresh
    if (mood_channel) {
        await supabase.removeChannel(mood_channel);
        mood_channel = null;
    }
    if (metrics_channel) {
        await supabase.removeChannel(metrics_channel);
        metrics_channel = null;
    }
    if (counts_channel) {
        await supabase.removeChannel(counts_channel);
        counts_channel = null;
    }
}
