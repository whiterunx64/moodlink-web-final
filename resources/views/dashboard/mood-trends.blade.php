<x-card variant="panel" class="flex flex-col w-full h-full" data-mood-trends x-data="filter_tab()">

    <x-card-header icon="fa-heartbeat" title="Mood Trends" />

    <div class="flex flex-col flex-1 min-h-0 px-5 pb-5 pt-3 gap-3">

        <x-tab-filter :tabs="['Today', 'Weekly', 'Monthly']" />
        <x-section-filter />

        {{-- Legend --}}
        <div data-mood-trends-legend
            class="flex flex-wrap justify-center gap-2 px-2 py-1 max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        </div>

        {{-- Chart --}}
        <div class="relative flex-1 min-h-0 w-full min-h-[280px] sm:min-h-[320px] md:min-h-[360px]">
            <div data-mood-trends-chart class="absolute inset-0 w-full h-full"></div>
            <div data-empty-state class="absolute inset-0 hidden items-center justify-center flex-col gap-2">
                <span class="text-3xl opacity-30">📊</span>
                <span class="text-xs text-gray-400">No mood data for this period</span>
            </div>
        </div>
    </div>
</x-card>