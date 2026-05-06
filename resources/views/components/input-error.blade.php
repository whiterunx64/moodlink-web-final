@props(['messages' => null])

@if ($messages)
  @php $list = array_filter((array) $messages); @endphp

  @if (count($list) === 1)
    <p {{ $attributes->merge(['class' => 'text-sm text-red-500 mt-1']) }}>
      {{ reset($list) }}
    </p>
  @elseif (count($list) > 1)
    <ul {{ $attributes->merge(['class' => 'text-sm text-red-500 mt-1 list-disc list-inside space-y-0.5']) }}>
      @foreach ($list as $message)
        <li>{{ $message }}</li>
      @endforeach
    </ul>
  @endif
@endif