{{-- Dynamic filter pills for switching active section --}}
<div class="flex flex-wrap gap-1.5">
  <template x-for="sec in sections" :key="sec">
    <button type="button" @click="setSection(sec)" :class="activeSection === sec
                ? 'bg-sidebar text-white shadow-sm'
                : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'"
      class="px-3 py-1 text-xs font-medium rounded-full transition-all duration-150" x-text="sec">
    </button>
  </template>
</div>