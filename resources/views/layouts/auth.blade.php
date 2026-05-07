<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Auth - @yield('title')</title>

  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="bg-ml-bg min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden relative">

  <x-background-shapes />
  <div class="relative z-10 flex flex-col items-center">
    @yield('content')
  </div>

</body>

</html>