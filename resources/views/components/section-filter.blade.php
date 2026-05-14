{{-- Dynamic filter pills for switching active section --}}
<div class="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
  <template x-for="sec in sections" :key="sec">
    <button type="button" @click="setSection(sec)" :class="activeSection === sec
                        ? 'bg-sidebar text-white'
                        : 'bg-gray-100 text-text-muted hover:bg-gray-200'"
      class="px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full transition-colors">
      <span x-text="sec"></span>
    </button>
  </template>
</div>