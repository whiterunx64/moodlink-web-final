{{-- Shows a mood entry with $name, $time, $message, including initial avatar and optional flagged status --}}
@props([
  'name' => 'Anonymous',
  'time' => '',
  'message' => '',
  'flagged' => false,
])

@php
  $initial = strtoupper(substr($name, 0, 1));
@endphp

<div class="bg-gray-50 rounded-lg p-4">

  <div class="flex justify-between items-start mb-2">
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
        {{ $initial }}
      </div>
      <h4 class="font-semibold text-text-dark text-sm">
        {{ $name }}
      </h4>
    </div>
    <span class="text-xs text-text-muted">
      {{ $time }}
    </span>
  </div>

<p class="text-sm text-text-muted leading-relaxed">
    {{ $message }}
</p>

  @if($flagged)
    <span class="inline-block mt-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
      Flagged
    </span>
  @endif

</div>