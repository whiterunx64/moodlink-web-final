<x-card variant="panel"
    class="flex flex-col w-full h-full min-h-[320px] sm:min-h-[360px] md:min-h-[420px] lg:min-h-[500px]"
    data-mood-trends x-data="filter_tab()">
    <x-card-header icon="fa-heartbeat" title="Mood Trends" />
    <div class="p-3 sm:p-4 md:p-5 flex flex-col flex-1 min-h-0 w-full">

        {{-- Tab switcher --}}
        <div class="mb-2 sm:mb-3 text-xs sm:text-sm">
            <x-tab-filter :tabs="['Today', 'Weekly', 'Monthly']" />
        </div>
        <x-section-filter />
        <div class="flex-1 min-h-0 w-full flex flex-col">
            <div data-mood-trends-chart
                class="flex-1 w-full min-h-[180px] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[300px]"></div>
        </div>
    </div>
</x-card>