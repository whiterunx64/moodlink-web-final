{{-- Displays a metric card with $color-based background, showing $label, $value, and an associated $icon --}}
@props([
  'color' => 'orange',
  'icon' => 'fa-circle',
  'label' => '',
  'value' => 0,
])
@php
  $bg = match ($color) {
    'green' => 'bg-[var(--color-card-green)]',
    'red' => 'bg-[var(--color-card-red)]',
    'blue' => 'bg-[var(--color-card-blue)]',
    default => 'bg-[var(--color-card-orange)]',
  };
@endphp

<div class="metric-card {{ $bg }} rounded-xl p-5 text-white relative overflow-hidden">
  <div class="relative z-10">
    <p class="text-sm font-medium opacity-90">
      {{ $label }}
    </p>
    <p class="text-4xl font-bold mt-1">
      {{ $value }}
    </p>
  </div>
  <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">
    <i class="fas {{ $icon }} text-5xl"></i>
  </div>
</div>