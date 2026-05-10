import { supabase } from "@/core/lib/supabase";
import { get_single_moodspace } from "@/modules/dashboard/mood-space/mood-space-fetch";
import {
    add_moodspace_item,
    replace_moodspace_item,
    delete_moodspace_item,
} from "@/modules/dashboard/mood-space/mood-space-render";

export function start_moodspace_listener() {
    // initialize websocket connection listener to mood space feed
    const channel = supabase.channel("mood-space");
    channel
        // listen for post action 
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "posts" },
            async ({ new: r }) => {
                const data = await get_single_moodspace(r.id);
                if (data) add_moodspace_item(data);
            },
        )
        // listen for update action 
        .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "posts" },
            async ({ new: r }) => {
                const data = await get_single_moodspace(r.id);
                if (data) replace_moodspace_item(data);
            },
        )
        // Remove entry directly using its ID
        .on(
            "postgres_changes",
            { event: "DELETE", schema: "public", table: "posts" },
            ({ old }) => {
                if (old?.id) delete_moodspace_item(old.id);
            },
        )
        .subscribe();
        // check websocket supabase status
//       .subscribe((status) => {
//           console.log("status:", status);
//       });
    return channel;
}
export function stop_moodspace_listener(channel) {
    supabase.removeChannel(channel);
}
