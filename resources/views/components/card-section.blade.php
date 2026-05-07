{{-- renders a card section with header and content using $icon, $title, $subtitle and slot for body content --}}
@props(['icon' => 'fa-circle', 'title' => '', 'subtitle' => null])

<div class="bg-white rounded-xl shadow-sm border border-gray-100">
  <div class="p-5 border-b border-gray-100">
    <div class="flex items-center gap-2">
      <i class="fas {{ $icon }} text-textMuted"></i>
      <h3 class="text-lg font-semibold text-textDark">{{ $title }}</h3>
    </div>
    @if($subtitle)
      <p class="text-xs text-textMuted mt-1">{{ $subtitle }}</p>
    @endif
  </div>
  <div {{ $attributes->merge(['class' => 'p-5']) }}>
    {{ $slot }}
  </div>
</div>