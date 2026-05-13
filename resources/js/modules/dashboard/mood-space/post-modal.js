import { purifyText } from "@/core/lib/xss-guard";

document.addEventListener("alpine:init", () => {
    window.Alpine.data("post_modal", () => ({
        open: false,
        modal: {
            name:    "", 
            initial: "",
            time:    "",
            flagged: false,
            content: "",
        },
        show(detail) {
            this.modal = {
                name:    purifyText(detail.name),
                initial: purifyText(detail.initial),
                time:    detail.time,
                flagged: Boolean(detail.flagged),
                content: purifyText(detail.content ?? ""),
            };
            this.open = true;
        },
        close() {
            this.open = false;
        },
    }));
});