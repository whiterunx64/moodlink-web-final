//
import "./bootstrap";
import { init_auth } from "@/features/auth";
import "@/runtime";
document.addEventListener("DOMContentLoaded", () => {
    init_auth();
});