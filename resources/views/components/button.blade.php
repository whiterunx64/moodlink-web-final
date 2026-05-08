@props([
    'variant' => 'primary',
    'size' => 'md',
    'type' => 'button',
])

@php
    $variants = [
        'primary'   => 'bg-ml-btn hover:bg-ml-btn-hover text-white',
        'secondary' => 'bg-transparent border border-ml-btn text-ml-btn hover:bg-ml-btn/10',
    ];

    $sizes = [
        'sm'   => 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm',
        'md'   => 'px-4 py-2 text-sm sm:px-5 sm:py-3 sm:text-base',
        'lg'   => 'px-5 py-3 text-base sm:px-6 sm:py-4 sm:text-lg',
        'full' => 'w-full px-4 py-3 text-sm sm:py-4 sm:text-base',
    ];

    $variantClass = $variants[$variant] ?? $variants['primary'];
    $sizeClass = $sizes[$size] ?? $sizes['md'];
@endphp

<button
    type="{{ $type }}"
    {{ $attributes->class([
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ml-btn disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        $variantClass,
        $sizeClass,
    ]) }}
>
    {{ $slot }}
</button>