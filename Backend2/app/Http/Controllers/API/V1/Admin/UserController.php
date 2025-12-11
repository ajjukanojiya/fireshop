<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // List users by role (default: delivery_boy)
    public function index(Request $request)
    {
        $role = $request->query('role', 'delivery_boy');
        $users = User::where('role', $role)->latest()->get();
        return response()->json(['data' => $users]);
    }

    // Create a new user (admin creates delivery boy)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone',
            'role' => 'nullable|string|in:delivery_boy,admin,user'
        ]);

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'role' => $request->role ?? 'delivery_boy',
            // 'phone_verified_at' => now() // Auto-verify if admin creates? Maybe safer.
        ]);
        
        // Mark verified immediately so they can just login via OTP
        $user->forceFill(['phone_verified_at' => now()])->save();

        return response()->json(['message' => 'User created successfully', 'data' => $user], 201);
    }
}
