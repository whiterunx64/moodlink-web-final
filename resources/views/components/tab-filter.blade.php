{{-- time period tabs for switching --}}
@props([
    'tabs' => ['Today', 'Weekly', 'Monthly'],
])

<div class="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1">
    @foreach($tabs as $tab)
        <button
            type="button"
            @click="setTab('{{ $tab }}')"
            :class="activeTab === '{{ $tab }}'
                ? 'bg-white dark:bg-white/10 shadow-sm text-gray-900 dark:text-white'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
            class="flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all duration-150">
            {{ $tab }}
        </button>
    @endforeach
</div>