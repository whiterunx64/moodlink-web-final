<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolvePageTitle
{
    protected array $titles = [
        'dashboard' => 'Dashboard',
    ];
    public function handle(Request $request, Closure $next): Response
    {
        $route = $request->route()?->getName() ?? '';
        view()->share('title', $this->titles[$route] ?? 'Dashboard');
        return $next($request);
    }
}
