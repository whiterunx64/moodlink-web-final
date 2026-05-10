@props([
  'id' => '',
  'color' => 'orange',
  'icon' => 'fa-circle',
  'label' => '',
  'value' => 0,
])
@php
  $bg = match ($color) {
    'green' => 'bg-card-green',
    'red' => 'bg-card-red',
    'blue' => 'bg-card-blue',
    default => 'bg-card-orange',
  };
@endphp

<div id="{{ $id }}" class="metric-card {{ $bg }} rounded-xl p-5 text-white relative overflow-hidden">
  <div class="relative z-10">
    <p class="text-sm font-medium opacity-90">
      {{ $label }}
    </p>
    <p class="text-4xl font-bold mt-1 hidden"></p>
    {{-- skeleton shown until JS loads the real value --}}
    <div class="metric-skeleton h-9 w-16 mt-1 rounded-md bg-white/20 animate-pulse"></div>
  </div>
  <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">
    <i class="fas {{ $icon }} text-5xl"></i>
  </div>
</div>