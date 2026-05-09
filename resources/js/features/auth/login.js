import axios from "axios";
import { login_schema } from "@/core/lib/schema";
import { supabase } from "@/core/lib/supabase";

export function init_login() {
    const form = document.getElementById("login-form");
    if (!form) return;

    const error_el = document.getElementById("js-login-error");
    const button = document.getElementById("login-btn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const form_data = new FormData(form);
        // Uses Zod schema to validate raw user input
        const raw = {
            email: form_data.get("email"),
            password: form_data.get("password"),
        };

        error_el.classList.add("hidden");
        error_el.textContent = "";
        const parsed = login_schema.safeParse(raw); // validate raw input if it follows login_schema rules

        if (!parsed.success) {
            const error_divs = parsed.error.issues.map(({ message }) => {
                const div = document.createElement("div");
                div.textContent = `• ${message}`;
                return div;
            });
            error_el.replaceChildren(...error_divs);
            error_el.classList.remove("hidden");
            return;
        }
        const { email, password } = parsed.data;
        button.disabled = true;
        button.textContent = "Signing in...";

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            // After Successful sign in, request backend to create session cookie
            await axios.post(
                "/auth/session",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${data.session.access_token}`,
                    },
                },
            );
            window.location.href = "/dashboard";
        } catch (err) {
            error_el.textContent = "Invalid email or password";
            error_el.classList.remove("hidden");
        } finally {
            button.disabled = false;
            button.textContent = "Sign In";
        }
    });
}
