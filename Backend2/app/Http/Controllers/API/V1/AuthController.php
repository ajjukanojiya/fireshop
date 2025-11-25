<?php
namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use App\Models\User;
use Twilio\Rest\Client;

class AuthController extends Controller
{
    public function sendOtp(Request $r)
    {
        $r->validate(['phone'=>'required']);
        $phone = $r->phone;

        // rate limit: max 3 per hour (simple)
        $keyRate = "otp:rate:{$phone}";
        $count = Cache::get($keyRate, 0);
        if ($count >= 3) {
            return response()->json(['message'=>'OTP request limit reached'], 429);
        }

        // generate 4-digit OTP
        $otp = random_int(1000,9999);
        $cacheKey = "otp:login:{$phone}";
        Cache::put($cacheKey, $otp, now()->addMinutes(3));
        Cache::put($keyRate, $count+1, now()->addHour());

        // send via Twilio (or other provider)
        try {
            $sid = config('services.twilio.sid');
            $token = config('services.twilio.token');
            $from = config('services.twilio.from');
            if ($sid && $token && $from) {
                $client = new Client($sid, $token);
                $client->messages->create($phone, [
                    'from' => $from,
                    'body' => "Your verification code is: {$otp}"
                ]);
            } else {
                // dev: log the OTP
                \Log::info("OTP for {$phone}: {$otp}");
            }
        } catch (\Throwable $e) {
            \Log::error("Twilio error: ".$e->getMessage());
            // still allow (dev) or return error for production
        }

        return response()->json(['message'=>'OTP sent (if provider available)']);
    }

    public function verifyOtp(Request $r)
    {
        $r->validate(['phone'=>'required','otp'=>'required']);
        $cacheKey = "otp:login:{$r->phone}";
        $cached = Cache::get($cacheKey);
        if (!$cached || (string)$cached !== (string)$r->otp) {
            return response()->json(['message'=>'Invalid or expired OTP'], 422);
        }

        // OTP ok — find or create user
        $user = User::firstOrCreate(
            ['phone' => $r->phone],
            ['name' => null]
        );
        $user->phone_verified_at = now();
        $user->save();

        // delete OTP
        Cache::forget($cacheKey);

        // login using Sanctum cookie or token
        // If you use Sanctum (cookie), you need /sanctum/csrf-cookie on client and Auth::login
        // For simplicity return a token here (personal access token)
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Verified',
            'token' => $token,
            'user' => $user
        ]);
    }
}
