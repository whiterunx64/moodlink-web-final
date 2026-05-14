//
import "./bootstrap";
import Alpine from "alpinejs";

// Alpine components
import "@/modules/dashboard/mood-space/post-modal.js";
import "@/modules/dashboard/mood-trends/filter-switcher.js"

import { init_auth } from "@/modules/auth";
import { init_dashboard } from "@/modules/dashboard";

window.Alpine = Alpine;
Alpine.start();

document.addEventListener("DOMContentLoaded", () => {
    Promise.allSettled([
        init_auth(),
        init_dashboard(),
    ]).then(results => {
        results.forEach(({ status, reason }) => {
            if (status === "rejected") console.error(reason);
        });
    });
});