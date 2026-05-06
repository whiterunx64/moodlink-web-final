@props(['messages'])

@if ($messages)
    <p {{ $attributes->merge([
        'class' => 'text-sm text-red-500 mt-1'
    ]) }}>
        {{ implode(', ', (array) $messages) }}
    </p>
@endif