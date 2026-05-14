// handles tab change and emits filter event
document.addEventListener("alpine:init", () => {
    window.Alpine.data("filter_tab", () => ({
        activeTab: "Today",
        activeSection: "All",
        sections: [],

        init() {
            this.$el.addEventListener("mood-trends:sections", (e) => {
                this.sections = e.detail.sections;
            });
        },

        setTab(tab) {
            this.activeTab = tab;
            this._emit();
        },

        setSection(section) {
            this.activeSection = section;
            this._emit();
        },

        _emit() {
            this.$el.dispatchEvent(
                new CustomEvent("mood-trends:filter", {
                    bubbles: true,
                    detail: { tab: this.activeTab, section: this.activeSection },
                })
            );
        },
    }));
});