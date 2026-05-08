@props(['variant' => 'panel'])

<div {{ $attributes->class([
    'rounded-2xl',
    'bg-white rounded-xl shadow-sm border border-gray-100' => $variant === 'panel',
    'login-card bg-ml-card px-8 py-8 w-screen max-w-sm sm:max-w-md lg:max-w-lg' => $variant === 'login',
    'bg-transparent border border-white/10 px-6 py-6' => $variant === 'outlined',
]) }}>
    {{ $slot }}
</div>