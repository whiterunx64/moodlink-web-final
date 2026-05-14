import { schedule_daily_refresh } from "@/core/lib/date";
import { load_moodspace_posts } from "@/modules/dashboard/mood-space/post-service";
import { add_moodspace_item, replace_moodspace_item, delete_moodspace_item } from "@/modules/dashboard/mood-space/entries-manager";
import { on_post_event, off_post_event } from "@/modules/dashboard/supabase-ws";

const on_delete = ({ id }) => { if (!id) return; delete_moodspace_item(id); };

export async function init_moodspace() {
  schedule_daily_refresh(load_moodspace_posts);
  await load_moodspace_posts();
}

export function init_moodspace_listener() {
  on_post_event("insert", add_moodspace_item);
  on_post_event("update", replace_moodspace_item);
  on_post_event("delete", on_delete); // keep this one, it destructures
}

export function destroy_moodspace_listener() {
  off_post_event("insert", add_moodspace_item);
  off_post_event("update", replace_moodspace_item);
  off_post_event("delete", on_delete);
}