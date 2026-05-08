{{-- Displays user profile using $name and $role with initial-based avatar --}}
@props([
  'name' => 'Admin',
  'role' => 'Administrator',
  'avatar' => null,
])
<div class="p-4 border-t border-white/10">
  <div class="flex items-center gap-3 px-4 py-3">

    @if($avatar)
      <img src="{{ $avatar }}" alt="{{ $name }}" class="w-8 h-8 rounded-full object-cover">
    @else
      <div class="w-8 h-8 rounded-full bg-accent text-sidebar flex items-center justify-center font-bold text-sm">
        {{ strtoupper(substr($name, 0, 1)) }}
      </div>
    @endif

    <div>
      <p class="text-sm font-medium">{{ e($name) }}</p>
      <p class="text-xs text-white/60">{{ e($role) }}</p>
    </div>

  </div>
</div>