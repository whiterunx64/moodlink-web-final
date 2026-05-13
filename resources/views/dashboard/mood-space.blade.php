<x-card variant="panel" class="lg:col-span-2">
  {{-- Dynamically will know the time --}}
    <x-card-header icon="fa-file-alt" title="MoodSpace" subtitle_id="moodspace-subtitle" />
    
    <div id="mood-space-container" class="p-5 space-y-4 max-h-[400px] overflow-y-auto scroll-ui flex flex-col"></div>

  </x-card>

<x-dashboard-modals.posts-modal />