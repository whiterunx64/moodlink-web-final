{{--
  Reusable Empty State Component
  Props:
    $message  - string: primary message
    $hint     - string|null: secondary hint text
--}}
@props([
    'message' => 'No data available',
    'hint'    => null,
])
 
<div class="flex flex-col items-center justify-center py-12 text-center">
  <p class="text-text-muted text-sm">{{ $message }}</p>
  @if($hint)
    <p class="text-text-muted text-xs mt-1">{{ $hint }}</p>
  @endif
</div>
 