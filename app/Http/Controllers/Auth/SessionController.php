<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SessionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->attributes->get('supabase_user');

        if (!$user) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }

        $request->session()->regenerate();

        $request->session()->put([
            'admin_id' => $user['id'],
            'admin_email' => $user['email'],
            'admin_role' => $user['role'],
            'admin_meta' => $user['metadata'],
            'last_activity' => time(),
            'logged_in_at' => time(),
        ]);

        return response()->json([
            'success' => true
        ]);
    }
}