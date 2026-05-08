<x-card variant="panel" class="lg:col-span-2">

  <x-card-header icon="fa-file-alt" title="MoodSpace" subtitle="March 10, 2026" />

  <div class="p-5 space-y-4 max-h-[400px] overflow-y-auto scroll-ui">

    <x-mood-entry name="Anonymous Tabayoyon" time="12:00 PM"
      message="Group study session was productive today. Feeling more confident about the upcoming exam." />

    <x-mood-entry name="Anonymous Mountain" time="11:30 AM"
      message="Having a hard time adjusting. Feeling isolated from everyone and thinking about giving up."
      :flagged="true" />

    <x-mood-entry name="Anonymous River" time="11:00 AM"
      message="Starting to enjoy my new course! The professor is very engaging and the topics are interesting." />

    <x-mood-entry name="Anonymous Storm" time="10:00 AM"
      message="I don't know how to cope anymore. Everything feels like it's falling apart." :flagged="true" />

  </div>

</x-card>