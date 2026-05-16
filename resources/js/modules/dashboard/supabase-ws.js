import { supabase } from "@/core/lib/supabase";
import { fetch_single_post } from "@/modules/dashboard/mood-space/post-service.js";
import { create_bus } from "@/core/lib/event-bus";

// CENTRALIZE WEBSOCKET

let posts_channel = null;
let live_channel = null;

// BUSES — one per channel, exposed via controlled API
const posts_bus = create_bus();
const live_bus = create_bus();

export const on_post_event = (event, fn) => posts_bus.on(event, fn);
export const off_post_event = (event, fn) => posts_bus.off(event, fn);
export const on_live_event = (event, fn) => live_bus.on(event, fn);
export const off_live_event = (event, fn) => live_bus.off(event, fn);

// stop realtime on channel failure
const on_channel_error = (status) => {
    if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        stop_realtime().catch(console.error);
    }
};

export function start_realtime() {
    if (posts_channel || live_channel) return;

    // POSTS CHANNEL
    posts_channel = supabase.channel("posts");
    posts_channel
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "posts" },
            async ({ new: r }) => {
                try {
                    const data = await fetch_single_post(r.id);
                    if (data) posts_bus.emit("insert", data);
                } catch (err) {
                    console.error(`[post:${r.id}] INSERT failed`, err);
                }
            },
        )
        .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "posts" },
            async ({ new: r }) => {
                try {
                    const data = await fetch_single_post(r.id);
                    if (data) posts_bus.emit("update", data);
                } catch (err) {
                    console.error(`[post:${r.id}] UPDATE failed`, err);
                }
            },
        )
        .on(
            "postgres_changes",
            { event: "DELETE", schema: "public", table: "posts" },
            ({ old }) => {
                if (old?.id) posts_bus.emit("delete", { id: old.id });
            },
        )

        .subscribe(on_channel_error);

    // LIVE CHANNEL
    live_channel = supabase.channel("live");
    live_channel
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "students" },
            () => live_bus.emit("students:changed"), // refresh student count
        )
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "posts" },
            () => live_bus.emit("posts:changed"), // refresh posts data
        )
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "appointments" },
            () => live_bus.emit("appointments:changed"), // refresh appointment data
            // logs the data
            // (payload) => { console.log("[metrics] appointments fired", payload); refresh_metrics.trigger(); },
        )
        // check logs channel subscription status
        // .subscribe((status) => { console.log("[metrics] channel status →", status); on_channel_error(status); });
        .subscribe(on_channel_error);
}

export async function stop_realtime() {
    if (posts_channel) {
        await supabase.removeChannel(posts_channel);
        posts_channel = null;
    }
    if (live_channel) {
        await supabase.removeChannel(live_channel);
        live_channel = null;
    }
}