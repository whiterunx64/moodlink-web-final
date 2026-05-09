<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:col-span-3">

  <x-appointment-stat icon="fa-calendar" variant="neutral" label="Upcoming Appointments" :value="$stats['appointments'] ?? null" :state="$state ?? 'idle'" format="number">
    <x-slot:badges>

      <span class="text-xs font-medium text-red-500">
        Urgent: {{ $stats['urgent'] ?? 0 }}
      </span>

      <span class="text-xs text-text-muted">
        Consultation: {{ $stats['consultation'] ?? 0 }}
      </span>

    </x-slot:badges>
  </x-appointment-stat>

  <x-appointment-stat icon="fa-exclamation-circle" variant="danger" label="Escalation Requests"
    :value="$stats['escalations'] ?? null" :state="$state ?? 'idle'" format="number" />

</div>