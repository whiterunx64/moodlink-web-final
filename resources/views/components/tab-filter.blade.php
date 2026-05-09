{{-- Tabs for switching + filters for refining data --}}
@props([
  'tabs' => ['Today', 'Weekly', 'Monthly'],
  'filters' => [],
  'activeTab' => 0,
  'activeFilter' => 0,
])
    
<div class="flex bg-gray-100 rounded-lg p-1 mb-3 sm:mb-4">
  @foreach($tabs as $i => $tab)
    <button class="flex-1 py-1 sm:py-1.5 px-2 sm:px-3 text-[10px] sm:text-xs font-medium rounded-md transition-colors
      {{ $i === $activeTab ? 'bg-white shadow-sm text-text-dark' : 'text-text-muted hover:text-text-dark' }}">
      {{ $tab }}
    </button>
  @endforeach
</div>


@if(count($filters))
  <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
    @foreach($filters as $i => $filter)
      <button class="px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full transition-colors
        {{ $i === $activeFilter ? 'bg-sidebar text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200' }}">
        {{ $filter }}
      </button>
    @endforeach
  </div>
@endif