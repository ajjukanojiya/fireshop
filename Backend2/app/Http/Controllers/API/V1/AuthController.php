<?php
namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Order;
use Twilio\Rest\Client;

class AuthController extends Controller
{
    public function sendOtp(Request $r)
    {
        $r->validate(['phone'=>'required|string','guest_token'=>'nullable|string','purpose'=>'nullable|string']);
        $phone = $r->phone;
        $guestToken = $r->guest_token ?? null;

        $key = "otp:login:{$phone}";
        $rateKey = "otp:rate:{$phone}";
        $count = Cache::get($rateKey,0);
        if ($count >= 6) return response()->json(['message'=>'OTP rate limit reached'],429);

        $otp = random_int(1000,9999);
        Cache::put($key, $otp, now()->addMinutes(3));
        Cache::put($rateKey, $count+1, now()->addHour());

        // send via Twilio if configured, otherwise log
        // try {
        //     $sid = config('services.twilio.sid');
        //     $token = config('services.twilio.token');
        //     $from = config('services.twilio.from');
        //     if ($sid && $token && $from) {
        //         $client = new Client($sid, $token);
        //         $client->messages->create($phone, ['from'=>$from,'body'=>"Your code: {$otp}"]);
        //     } else {
        //         Log::info("OTP for {$phone}: {$otp}");
        //     }
        // } catch (\Throwable $e) {
        //     Log::error("Twilio error: ".$e->getMessage());
        // }
        return response()->json(['message'=>$otp]);

        $exists = User::where('phone',$phone)->exists();
        return response()->json(['message'=>'OTP sent','user_exists'=>$exists,'guest_token'=>$guestToken]);
    }

    public function verifyOtp(Request $r)
    {
        $r->validate(['phone'=>'required|string','otp'=>'required','guest_token'=>'nullable|string']);
        $phone = $r->phone;
        $otp = $r->otp;
        $guestToken = $r->guest_token ?? null;

        $key = "otp:login:{$phone}";
        $cached = Cache::get($key);
        if (!$cached || (string)$cached !== (string)$otp) {
            return response()->json(['message'=>'Invalid or expired OTP'],422);
        }

        // find or create user
        $user = User::where('phone',$phone)->first();
        if (!$user) {
            $user = User::create(['phone'=>$phone,'phone_verified_at'=>now(),'name'=>null]);
        } else {
            $user->phone_verified_at = now();
            $user->save();
        }

        // claim by guest_token
        if ($guestToken) {
            Order::where('guest_token',$guestToken)->whereNull('user_id')
                 ->update(['user_id'=>$user->id,'guest_token'=>null,'guest_phone'=>null]);
        }

        // claim by guest_phone as fallback
        Order::where('guest_phone',$phone)->whereNull('user_id')
             ->update(['user_id'=>$user->id,'guest_token'=>null,'guest_phone'=>null]);

        Cache::forget($key);

        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json(['message'=>'Verified','token'=>$token,'user'=>$user]);
    }
}
