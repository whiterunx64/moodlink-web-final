<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
class LoginController extends Controller
{
  //TODO create middleware when multiple guest routes exist, to redirect authenticated users away from login page
  public function show_login(Request $request): View|RedirectResponse
  {
    if ($request->session()->has('admin_id')) {
      return redirect()->route('dashboard');
    }
    return view('auth.login');
  }
}