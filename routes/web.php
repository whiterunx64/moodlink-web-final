<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
// Route::get('/', function () {
//    return view('welcome');
//});
Route::get('/', [LoginController::class, 'show_login'])->name('login');