<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

  <x-metric-card id="metric-logs" color="orange" icon="fa-heartbeat" label="Total Mood Logs Today" :value="0" />

  <x-metric-card id="metric-students" color="green" icon="fa-user-graduate" label="Total Active Students" :value="0" />

  <x-metric-card id="metric-flagged" color="red" icon="fa-exclamation-triangle" label="Flagged Posts" :value="0" />

  <x-metric-card id="metric-requests" color="blue" icon="fa-clock" label="Escalation Requests" :value="0" />

</div>