{{-- Creates a sidebar link using $route or $href, highlights active state, and renders label through slot --}}
@props(['href' => null, 'icon' => 'fa-circle', 'route' => null])

@php
  $url = $route ? route($route) : ($href ?? '#');
  $isActive = $route ? request()->routeIs($route . '*') : false;
@endphp

<a href="{{ $url }}" class="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
    {{ $isActive ? 'active' : 'text-white/80 hover:text-white' }}">
  <i class="fas {{ $icon }} w-5" aria-hidden="true"></i>
  {{ $slot }}
</a>