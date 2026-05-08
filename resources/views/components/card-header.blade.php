{{-- reusable card header using $icon, $title, and optional $subtitle to provide consistent section labeling --}}
@props([
  'icon' => 'fa-circle',
  'title' => '',
  'subtitle' => null,
])

<div class="p-5 border-b border-gray-100">
  <div class="flex items-center gap-2">
  <i class="fas {{ $icon }} text-text-muted"></i>
    <h3 class="text-lg font-semibold text-text-dark">{{ $title }}</h3>
  </div>
  @if($subtitle)
    <p class="text-xs text-text-muted mt-1">{{ $subtitle }}</p>
  @endif
</div>