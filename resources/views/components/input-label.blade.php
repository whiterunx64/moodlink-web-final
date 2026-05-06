@props(['value'])

<label {{ $attributes->merge([
  'class' => 'block text-sm font-medium text-ml-text mb-1'
]) }}>
  {{ $value ?? $slot }}
</label>