<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>@yield('title', 'MoodLink')</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  @vite(['resources/css/app.css', 'resources/js/app.js'])
  @stack('styles')
</head>

<body class="bg-bg-main min-h-screen">
  <div class="flex h-screen">

    <!-- Mobile Overlay -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-20 lg:hidden hidden"></div>

    <!-- Sidebar -->
    <aside id="sidebar" class="fixed lg:static inset-y-0 left-0 z-30
             w-64 bg-sidebar text-white flex flex-col flex-shrink-0
             -translate-x-full lg:translate-x-0
             transition-transform duration-300 ease-in-out">

      <div class="p-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-accent">MoodLink</h1>
        <button id="sidebar-close" class="lg:hidden text-white/80 hover:text-white">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <nav class="flex-1 px-4 space-y-1" role="navigation" aria-label="Main navigation">
        <x-sidebar-item route="dashboard" icon="fa-th-large">Dashboard</x-sidebar-item>
        <x-sidebar-item icon="fa-user">User's Account</x-sidebar-item>
        <x-sidebar-item icon="fa-file-alt">Post Management</x-sidebar-item>
        <x-sidebar-item icon="fa-chart-bar">Summary Reports</x-sidebar-item>
        <x-sidebar-item icon="fa-calendar">Appointments</x-sidebar-item>
        <x-sidebar-item icon="fa-cog">Account</x-sidebar-item>
      </nav>

      <x-sidebar-user :name="session('user_name', 'Admin')" :role="session('user_role', 'Administrator')"
        :avatar="session('user_avatar')" />

    </aside>

    <main class="flex-1 flex flex-col overflow-hidden">
      {{-- TODO: unfinished header function --}}
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <button id="sidebar-open" class="lg:hidden text-gray-500 hover:text-gray-700">
          <i class="fas fa-bars text-xl"></i>
        </button>

        <div>
          <h2 class="text-2xl font-bold text-text-dark">{{ $title }}</h2>
          <p id="realtime-clock" class="text-sm text-text-muted"></p>
        </div>

        <div class="text-sm text-text-muted">Admin</div>
      </header>

      <div class="flex-1 overflow-y-auto p-8 scroll-hide">
        @yield('content')
      </div>

    </main>
  </div>
  @stack('scripts')
</body>

</html>