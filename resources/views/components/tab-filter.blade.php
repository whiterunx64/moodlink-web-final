{{-- time range tabs for switching --}}
@props([
  'tabs'          => ['Today', 'Weekly', 'Monthly'],
  'filters'       => [],
  'activeTab'     => 0,
  'activeFilter'  => 0,
])

<div class="flex bg-gray-100 rounded-lg p-1 mb-3 sm:mb-4">
  @foreach($tabs as $i => $tab)
    <button
      type="button"
      @click="setTab('{{ $tab }}')"
      :class="activeTab === '{{ $tab }}'
        ? 'bg-white shadow-sm text-text-dark'
        : 'text-text-muted hover:text-text-dark'"
      class="flex-1 py-1 sm:py-1.5 px-2 sm:px-3 text-[10px] sm:text-xs font-medium rounded-md transition-colors">
      {{ $tab }}
    </button>
  @endforeach
</div>

@if(count($filters))
  <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
    @foreach($filters as $filter)
      <button
        type="button"
        @click="setSection('{{ $filter }}')"
        :class="activeSection === '{{ $filter }}'
          ? 'bg-sidebar text-white'
          : 'bg-gray-100 text-text-muted hover:bg-gray-200'"
        class="px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full transition-colors">
        {{ $filter }}
      </button>
    @endforeach
  </div>
@endif