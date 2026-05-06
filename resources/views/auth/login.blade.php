@extends('layouts.auth')

@section('title', 'Login')

@section('content')

  <h1 class="text-white text-3xl font-bold mb-6 fade-up fade-up-1">
    Moodlink
  </h1>

  <x-card class="fade-up fade-up-2">

    <h2 class="text-ml-text text-2xl font-bold text-center mb-7">
      Login
    </h2>

    <form id="login-form" method="POST" action="#">
      @csrf

      <div class="space-y-4">

        <div>
          <x-input-label value="Username" />
          <x-text-input name="username" class="fade-up fade-up-3" />
          <x-input-error :messages="$errors->get('username')" />
        </div>

        <div>
          <x-input-label value="Password" />
          <x-text-input type="password" name="password" class="fade-up fade-up-4" />
          <x-input-error :messages="$errors->get('password')" />
        </div>

        <p id="js-login-error" class="text-red-600 text-xs font-semibold hidden"></p>

        <x-button type="submit" class="fade-up fade-up-4 mt-2">
          Sign In
        </x-button>

      </div>
    </form>

  </x-card>

@endsection