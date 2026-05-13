{{-- This is for interactive popups for longer messages to fix overflow issues --}}
{{-- Opens when a post is truncated and the user clicks "See full message" --}}
<div x-data="post_modal()" x-show="open" x-transition.opacity.duration.200ms
  x-effect="document.body.style.overflow = open ? 'hidden' : ''" @open-moodspace-modal.window="show($event.detail)"
  @keydown.escape.window="close()" @click.self="close()" id="moodspace-modal-overlay"
  class="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950/55 backdrop-blur-md p-4"
  style="display: none;">

  {{-- Modal --}}
  <div
    class="relative flex w-full max-w-[540px] flex-col overflow-hidden rounded-[12px] bg-white border border-neutral-200/70 shadow-[0_30px_90px_rgba(0,0,0,0.20)]"
    x-transition:enter="transition ease-out duration-200"
    x-transition:enter-start="opacity-0 scale-[0.96] translate-y-2"
    x-transition:enter-end="opacity-100 scale-100 translate-y-0" x-transition:leave="transition ease-in duration-150"
    x-transition:leave-start="opacity-100 scale-100" x-transition:leave-end="opacity-0 scale-[0.97]">

    {{-- Header --}}
    <div class="flex items-center justify-between border-b border-neutral-100 px-5 py-4">

      <div class="flex items-center gap-3 min-w-0">

        {{-- Avatar --}}
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-sm">
          <span x-text="modal.initial"></span>
        </div>

        {{-- User info --}}
        <div class="min-w-0">
          <h2 x-text="modal.name" class="truncate text-sm font-semibold text-gray-900"></h2>
          <div class="mt-1 flex items-center gap-2 text-[12px] text-gray-400">
            <span x-text="modal.time"></span>
          </div>
        </div>

      </div>
      {{-- Flag --}}
      <template x-if="modal.flagged">
        <span
          class="inline-flex items-center gap-1 self-center bg-red-50 px-2 py-[2px] text-[14px] font-medium text-red-600">
          <span class="text-[10px]">⚑</span>
          Flagged
        </span>
      </template>

    </div>

    {{-- Content --}}
    <div class="max-h-[68vh] overflow-y-auto px-6 py-5">
      <div class="rounded-2xl bg-neutral-50 border border-neutral-100 px-5 py-4">
        <p x-text="modal.content" class="whitespace-pre-line break-words text-[15px] leading-8 text-neutral-700"></p>
      </div>
    </div>

    {{-- Footer --}}
    <div class="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/70 px-6 py-4">
      <div class="text-[12px] text-neutral-400">Student mood log</div>

      <button @click="close()"
        class="rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition hover:opacity-90 active:scale-[0.98]">
        Close
      </button>
    </div>

  </div>
</div>