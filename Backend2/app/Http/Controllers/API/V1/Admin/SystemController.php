<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class SystemController extends Controller
{
    /**
     * Reset and re-seed the demo database.
     * This action is destructive and will wipe all existing data.
     */
    public function resetDatabase(Request $request)
    {
        // Admin middleware ensures only admins can reach this
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admins can perform this action.'], 403);
        }

        try {
            Log::info('Admin user ' . $request->user()->id . ' initiated a demo database reset.');

            // Run migrate:fresh with --seed to reset and re-populate standard demo data
            Artisan::call('migrate:fresh', [
                '--force' => true,
                '--seed' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Demo database has been successfully reset and re-seeded with professional standard data.'
            ]);
        } catch (\Exception $e) {
            Log::error('Demo Database Reset Failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset database: ' . $e->getMessage()
            ], 500);
        }
    }
}
