{{-- renders a card section with header and content using $icon, $title, $subtitle and slot for body content --}}
@props(['icon' => 'fa-circle', 'title' => '', 'subtitle' => null])

<div {{ $attributes->merge(['class' => 'bg-white rounded-xl shadow-sm border border-gray-100']) }}>
  <x-card-header :icon="$icon" :title="$title" :subtitle="$subtitle" />
  <div class="p-5">
    {{ $slot }}
  </div>
</div>