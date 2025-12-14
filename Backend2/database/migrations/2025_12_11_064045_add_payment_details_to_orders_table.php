<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('orders')) {
        return;
    }
        Schema::table('orders', function (Blueprint $table) {
            // add payment_method if not exists (some old logic might have added it)
            if (!Schema::hasColumn('orders', 'payment_method')) {
                $table->string('payment_method')->nullable();
            }
            // add payment_details for storing JSON (upi_id, transaction_ref, etc)
            if (!Schema::hasColumn('orders', 'payment_details')) {
                $table->json('payment_details')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_method', 'payment_details']);
        });
    }
};
