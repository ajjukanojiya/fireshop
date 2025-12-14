<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserAddress;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    // List all addresses for authenticated user
    public function index()
    {
        $user = Auth::user();
        $addresses = UserAddress::where('user_id', $user->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $addresses]);
    }

    // Store new address
    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required|string|max:50',
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'street' => 'required|string',
            'city' => 'required|string|max:100',
            'zip' => 'required|string|max:10',
            'is_default' => 'boolean',
        ]);

        $user = Auth::user();

        return DB::transaction(function() use ($request, $user) {
            // If setting as default, unset other defaults
            if ($request->is_default) {
                UserAddress::where('user_id', $user->id)
                    ->update(['is_default' => false]);
            }

            $address = UserAddress::create([
                'user_id' => $user->id,
                'label' => $request->label,
                'name' => $request->name,
                'phone' => $request->phone,
                'street' => $request->street,
                'city' => $request->city,
                'zip' => $request->zip,
                'is_default' => $request->is_default ?? false,
            ]);

            return response()->json([
                'message' => 'Address saved successfully',
                'data' => $address
            ], 201);
        });
    }

    // Update address
    public function update(Request $request, $id)
    {
        $request->validate([
            'label' => 'required|string|max:50',
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'street' => 'required|string',
            'city' => 'required|string|max:100',
            'zip' => 'required|string|max:10',
            'is_default' => 'boolean',
        ]);

        $user = Auth::user();
        $address = UserAddress::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return DB::transaction(function() use ($request, $address, $user) {
            // If setting as default, unset other defaults
            if ($request->is_default) {
                UserAddress::where('user_id', $user->id)
                    ->where('id', '!=', $address->id)
                    ->update(['is_default' => false]);
            }

            $address->update([
                'label' => $request->label,
                'name' => $request->name,
                'phone' => $request->phone,
                'street' => $request->street,
                'city' => $request->city,
                'zip' => $request->zip,
                'is_default' => $request->is_default ?? false,
            ]);

            return response()->json([
                'message' => 'Address updated successfully',
                'data' => $address
            ]);
        });
    }

    // Delete address
    public function destroy($id)
    {
        $user = Auth::user();
        $address = UserAddress::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $address->delete();

        return response()->json(['message' => 'Address deleted successfully']);
    }

    // Set default address
    public function setDefault($id)
    {
        $user = Auth::user();
        $address = UserAddress::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return DB::transaction(function() use ($address, $user) {
            // Unset all defaults
            UserAddress::where('user_id', $user->id)
                ->update(['is_default' => false]);

            // Set this as default
            $address->update(['is_default' => true]);

            return response()->json([
                'message' => 'Default address updated',
                'data' => $address
            ]);
        });
    }
}
