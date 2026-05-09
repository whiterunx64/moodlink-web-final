{{-- maps icon color formats value then shows loading error or result based on state --}}

@props([
  'icon' => 'fa-circle',
  'variant' => 'neutral',
  'value' => null,
  'label',
  'format' => null,
  'state' => 'idle', // idle | loading | error
])

@php
  $variants = [
    'neutral' => ['bg-gray-100', 'text-gray-400'],
    'danger'  => ['bg-red-50', 'text-red-500'],
    'success' => ['bg-green-50', 'text-green-500'],
    'info'    => ['bg-blue-50', 'text-blue-500'],
  ];

  $states = ['idle', 'loading', 'error'];

  $state = in_array($state, $states, true)
    ? $state
    : 'idle';

  [$bgClass, $textClass] = $variants[$variant] ?? $variants['neutral'];

  $displayValue = match ($format) {
    'number'  => is_numeric($value) ? number_format((int) $value) : '—',
    'decimal' => is_numeric($value) ? number_format((float) $value, 2) : '—',
    'percent' => is_numeric($value) ? number_format((float) $value, 1) . '%' : '—',
    default   => filled($value) ? e((string) $value) : '—',
  };
@endphp

<div {{ $attributes->merge([
  'class' => 'bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4'
]) }}>

  <div class="w-12 h-12 rounded-lg {{ $bgClass }} flex items-center justify-center shrink-0">
    <i class="fas {{ $icon }} {{ $textClass }} text-lg" aria-hidden="true"></i>
  </div>
  
  <div class="flex-1 min-w-0">

    <p class="text-xs font-medium uppercase tracking-wide text-text-muted truncate">
      {{ $label }}
    </p>

    <div
      class="flex items-baseline gap-3 mt-1"
      aria-live="polite"
      aria-busy="{{ $state === 'loading' ? 'true' : 'false' }}"
    >

      @if($state === 'loading')

        <div class="w-20 h-7 rounded bg-gray-100 animate-pulse"></div>

      @elseif($state === 'error')

        <span class="flex items-center gap-1.5 text-sm text-red-400">
          <i class="fas fa-exclamation-circle text-xs" aria-hidden="true"></i>
          Failed to load
        </span>

      @else

        <span class="text-2xl font-bold text-text-dark tabular-nums">
          {{ $displayValue }}
        </span>

      @endif

      @isset($badges)
        <div class="flex items-center gap-2 flex-wrap">
          {{ $badges }}
        </div>
      @endisset

    </div>

  </div>

</div>





