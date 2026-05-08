<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\Clock\SystemClock;
use DateTimeZone;


class VerifySupabaseToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? $request->input('access_token');

        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $jwt = $this->verify($token);
            $claims = $jwt->claims();
            $role = $claims->get('role');

            if ($role !== 'authenticated') {
                return response()->json(['message' => 'Unauthorized role'], 403);
            }

            $request->attributes->set('supabase_user', [
                'id' => $claims->get('sub'),
                'email' => $claims->get('email'),
                'role' => $role,
                'metadata' => $claims->get('app_metadata', []),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token or expired token'], 401);
        }
        //$claims = $jwt->claims();
        return $next($request);
    }
    private function verify(string $token)
    {
        $secret = config('services.supabase.jwt_secret');
        if (empty($secret)) {
            throw new \RuntimeException('Supabase JWT secret is not configured.');
        }

        $config = Configuration::forSymmetricSigner(
            new Sha256(),
            InMemory::plainText($secret)
        );
        $config->setValidationConstraints(
            new SignedWith($config->signer(), $config->signingKey()),
            new LooseValidAt(new SystemClock(new DateTimeZone('UTC')))
        );

        $parsed = $config->parser()->parse($token);
        $config->validator()->assert($parsed, ...$config->validationConstraints());

        return $parsed;
    }
}
