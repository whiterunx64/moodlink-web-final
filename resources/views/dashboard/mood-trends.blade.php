<x-card variant="panel">
  <x-card-header icon="fa-heartbeat" title="Mood Trends" />
  <div class="p-5">
    <x-tab-filter :tabs="['Today', 'Weekly', 'Monthly']" :filters="['All', 'DW31', 'DX30', 'DX31A']" />

    <x-empty-state message="No mood data available" hint="0 logs" />
  </div>
  </x-card-section>