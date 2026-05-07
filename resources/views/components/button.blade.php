<button {{ $attributes->merge([
  'class' => 'w-full bg-ml-btn hover:bg-ml-btn-hover cursor-pointer text-white
                font-bold rounded-xl py-3 sm:py-4 text-sm sm:text-base transition-colors'
]) }}>
  {{ $slot }}
</button>