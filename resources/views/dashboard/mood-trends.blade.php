<x-card variant="panel" class="flex flex-col h-full">
    <x-card-header icon="fa-heartbeat" title="Mood Trends" />
    <div class="p-5 flex-1 flex flex-col min-h-0 min-h-[300px] lg:min-h-0">
        <x-tab-filter :tabs="['Today', 'Weekly', 'Monthly']" :filters="['All', 'DW31', 'DX30', 'DX31A']" />
        <div class="flex-1 flex flex-col min-h-0">
            <x-empty-state message="No mood data available" hint="0 logs" />
        </div>
    </div>
</x-card>