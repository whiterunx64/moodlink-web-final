//
import "./bootstrap";
import Alpine from 'alpinejs'
import { init_auth } from "@/modules/auth";
window.Alpine = Alpine
Alpine.start()
document.addEventListener("DOMContentLoaded", () => {
    init_auth();
});