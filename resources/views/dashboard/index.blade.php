@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
    @include('dashboard.metrics')
    @include('dashboard.mood-space')
@endsection