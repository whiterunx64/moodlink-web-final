import { schedule_daily_refresh } from "@/core/lib/date";
import { load_moodspace_posts } from "@/modules/dashboard/mood-space/post-service";

export async function init_mood_space() {
  schedule_daily_refresh(load_moodspace_posts);
  await load_moodspace_posts();
}