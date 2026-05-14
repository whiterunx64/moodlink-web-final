@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
    @include('dashboard.metrics')
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 min-h-[400px] lg:min-h-[60vh]">
        @include('dashboard.mood-space')
        @include('dashboard.mood-trends')
    </div>
    @include('dashboard.appointments-overview')
@endsection