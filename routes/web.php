<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\SessionController;
// Route::get('/', function () {
//    return view('welcome');
//});
Route::get('/', [LoginController::class, 'show_login'])->name('login');

Route::post('/auth/session', [SessionController::class, 'store'])
    ->middleware('supabase.token');

Route::middleware('admin.session')->group(function () {
    Route::get('/dashboard', fn() => view('dashboard.index'))->name('dashboard');
});