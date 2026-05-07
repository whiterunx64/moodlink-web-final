@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
    @include('dashboard.metrics')
     <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    @include('dashboard.mood-space')
    @include('dashboard.mood-trends')
    </div>
@endsection