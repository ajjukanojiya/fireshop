<?php
namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Google_Client;
use App\Models\User;

class GoogleAuthController extends Controller
{
    public function loginWithGoogle(Request $r)
    {
        $r->validate(['id_token' => 'required|string']);
        $idToken = $r->id_token;

        // verify id_token using Google Client
        $client = new \Google_Client(['client_id' => config('services.google.client_id')]);
        $payload = $client->verifyIdToken($idToken);

        if (!$payload) {
            return response()->json(['message' => 'Invalid Google token'], 422);
        }

        // payload contains sub, email, name, picture, email_verified
        $googleId = $payload['sub'] ?? null;
        $email = $payload['email'] ?? null;
        $name = $payload['name'] ?? null;

        // find or create user
        $user = User::where('provider','google')->where('provider_id',$googleId)->first();
        if (!$user && $email) {
            $user = User::where('email', $email)->first();
        }
        if (!$user) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'provider' => 'google',
                'provider_id' => $googleId,
                'email_verified_at' => now(),
            ]);
        } else {
            // attach provider if missing
            if (!$user->provider) {
                $user->provider = 'google';
                $user->provider_id = $googleId;
                $user->save();
            }
        }

        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user]);
    }
}
