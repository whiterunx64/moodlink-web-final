
import { supabase } from "@/core/lib/supabase";

export function init_login() {
    const form = document.getElementById("login-form");
    if (!form) return;

    const error_el = document.getElementById("js-login-error");
    const button = document.getElementById("login-btn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const form_data = new FormData(form);
        const email = form_data.get("email");
        const password = form_data.get("password");

        error_el.classList.add("hidden");
        error_el.textContent = "";

        button.disabled = true;
        button.textContent = "Signing in...";

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            window.location.href = "/dashboard";
        } catch (err) {
            error_el.textContent = err.message || "Login failed";
            error_el.classList.remove("hidden");
        } finally {
            button.disabled = false;
            button.textContent = "Sign In";
        }
    });
}
