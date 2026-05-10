//
import "./bootstrap";
import Alpine from 'alpinejs'
import { init_auth } from "@/modules/auth";
import { init_dashboard } from "@/modules/dashboard"
window.Alpine = Alpine
Alpine.start()
document.addEventListener("DOMContentLoaded", () => {
    init_auth();
    init_dashboard();
});