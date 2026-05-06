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
