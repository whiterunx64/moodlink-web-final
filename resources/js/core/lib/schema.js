import { z } from "zod";

// Zod schema login validation
export const login_schema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .max(254, "Email is too long")
        .email("Invalid email address"),

    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password is too long"),
});
// Zod schema post & students DB supabase
export const dashboard_moodspace_schema = z.object({
    // fields from post table
    id: z.number(),
    mood: z.string().nullable(),
    content: z.string(),
    datetime: z.string(),
    status: z.string(),
    // required fields from students table connected to post table
    students: z.object({
        anonymous_name: z.string().nullable(),
        first_name: z.string(),
        last_name: z.string(),
        // removed        is_deactivated: z.boolean(),
    }),
});
// Zod schema posts, students & appointments DB supabase
export const dashboard_metrics_schema = z.object({
    logs: z.number().int().nonnegative(),
    students: z.number().int().nonnegative(),
    flagged: z.number().int().nonnegative(),
    requests: z.number().int().nonnegative(),
});
// Zod schema mood trends DB supabase
export const dashboard_mood_trends_schema = z.object({
    id: z.number(),
    mood: z.string().nullable(),
    datetime: z.string(),
    students: z.object({
        section: z.string().nullable(),
    }),
});