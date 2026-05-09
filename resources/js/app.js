//
import Alpine from 'alpinejs'
import { init_auth } from "@/features/auth";
window.Alpine = Alpine
Alpine.start()
document.addEventListener("DOMContentLoaded", () => {
    init_auth();
});