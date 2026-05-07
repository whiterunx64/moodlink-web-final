<x-card-section icon="fa-heartbeat" title="Mood Trends">

<x-tab-filter
  :tabs="['Today', 'Weekly', 'Monthly']"
  :filters="['All', 'DW31', 'DX30', 'DX31A']"
/>

  <x-empty-state message="No mood data available" hint="0 logs" />

</x-card-section>