<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Http;
// use Illuminate\Support\Facades\Log;
class VerifySupabaseToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? $request->input('access_token');

// token request checker  DEBOGER
//       Log::info('Incoming request', [
//            'token_present' => $token ? true : false,
//        ]);

        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $supabase_url = config('services.supabase.url');
            $supabase_key = config('services.supabase.service_key');

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
                'apikey'        => $supabase_key,
            ])->get("{$supabase_url}/auth/v1/user");

            if (!$response->successful()) {
//                \Log::error('Supabase token check failed', ['body' => $response->body()]); DEBOGER
                return response()->json(['error' => 'Unauthorized'], 401);
            }
// check if cred exist in supabase auth  DEBOGER
//            Log::info('Supabase response', [
//                'status' => $response->status(),
//                'body' => $response->json(),
//            ]);

            $user = $response->json();

            $request->attributes->set('supabase_user', [
                'id'       => $user['id'] ?? null,
                'email'    => $user['email'] ?? null,
                'role'     => $user['role'] ?? 'authenticated',
                'metadata' => $user['app_metadata'] ?? [],
            ]);

            } catch (\Exception $e) {
                \Log::error('JWT verify failed', ['message' => $e->getMessage()]);
                return response()->json(['error' => 'Invalid or expired token'], 401);
            }
        //$claims = $jwt->claims();
        return $next($request);
    }
}
