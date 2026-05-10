<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthorizeAdminSession
{
    private const IDLE_TIMEOUT = 60; // session idle limit
    public function handle(Request $request, Closure $next): Response
    {

        if (!$request->session()->has('admin_id')) {
            return redirect()->route('login');
        }
        // check last activity time
        $last_activity = $request->session()->get('last_activity');
        // block if idle timeout reached
        if ($last_activity && (time() - $last_activity) > (self::IDLE_TIMEOUT * 60)) {
            $request->session()->invalidate();

            return redirect()->route('login')->withErrors([
                'session' => 'Your session has expired. Please log in again.'
            ]);

        }
        $request->session()->put('last_activity', time()); // refresh last activity
        return $next($request);
    }
}
