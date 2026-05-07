<button {{ $attributes->merge([
  'class' => 'w-full bg-ml-btn hover:bg-ml-btn-hover text-white
                font-bold rounded-xl py-3 text-sm transition-colors'
]) }}>
  {{ $slot }}
</button>