<div {{ $attributes->merge([
    'class' => 'login-card bg-ml-card rounded-2xl px-8 py-8 w-screen max-w-sm sm:max-w-md lg:max-w-lg'
]) }}>
    {{ $slot }}
</div>