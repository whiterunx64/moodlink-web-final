@props(['type' => 'text', 'name'])

<input type="{{ $type }}" name="{{ $name }}" {{ $attributes->merge([
  'class' => 'w-full bg-ml-input text-ml-text placeholder-ml-placeholder
                    rounded-xl px-4 py-3 sm:py-4 text-sm sm:text-base
                    focus:outline-none focus:ring-2 focus:ring-ml-btn'
]) }}>