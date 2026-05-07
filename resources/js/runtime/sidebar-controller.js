(() => {
    document.addEventListener("DOMContentLoaded", () => {
        const control = {
            sidebar: document.getElementById("sidebar"),
            overlay: document.getElementById("sidebar-overlay"),
            open_btn: document.getElementById("sidebar-open"),
            close_btn: document.getElementById("sidebar-close"),
        };

        const required = [control.sidebar, control.overlay, control.open_btn];
        if (required.some((v) => !v)) return; // stop sidebar init
        let is_open = false;
        // sidebar state visibility begins
        const set_state = (state) => {
            is_open = state;
            control.sidebar.classList.toggle("-translate-x-full", !state);
            control.overlay.classList.toggle("hidden", !state);
            document.body.classList.toggle("overflow-hidden", state);
            // accessibility state
            control.sidebar.setAttribute("aria-hidden", String(!state));
            control.open_btn.setAttribute("aria-expanded", String(state));
        };

        const focus_first = () => {
            const target =
                control.sidebar.querySelector("button, a, input, [tabindex]") ||
                control.close_btn ||
                control.open_btn;
            console.log("test:", target); // debug
            target?.focus(); // focus element if it exist
        };
        const open = () => {
            if (is_open) return;
            set_state(true);
            focus_first();
        };
        const close = () => {
            if (!is_open) return;
            set_state(false);
            control.open_btn.focus();
        };
        const toggle = () => (is_open ? close() : open());

        // collapse if the user trigger it
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && is_open) close();
        });
        // click event
        control.open_btn.addEventListener("click", toggle);
        control.close_btn?.addEventListener("click", close);
        control.overlay.addEventListener("click", close);
    });
})();