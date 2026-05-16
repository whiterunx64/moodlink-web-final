// handle tab and section changes and emit filter event
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
            this.activeTab = tab; // update active time period tab
            this._emit();
        },

        setSection(section) {
            this.activeSection = section; // update active section
            this._emit();
        },

        _emit() {
            this.$el.dispatchEvent(
                new CustomEvent("mood-trends:filter", {
                    bubbles: true, // allow event to propagate
                    detail: {
                        tab: this.activeTab,
                        section: this.activeSection, // current section value
                    },
                }),
            );
        },
    }));
});
