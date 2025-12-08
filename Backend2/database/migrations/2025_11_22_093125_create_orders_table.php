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
        // Schema::create('orders', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
        //     $table->decimal('total_amount', 12, 2);
        //     $table->string('status')->default('pending');
        //     $table->string('payment_id')->nullable();
        //     $table->json('address')->nullable();
        //     $table->timestamps();
        // });


        // new migration: add guest_token and guest_phone and allow user_id nullable
            Schema::table('orders', function (Blueprint $table) {
                if (!Schema::hasColumn('orders','user_id')) {
                    $table->unsignedBigInteger('user_id')->nullable()->index();
                } else {
                    $table->unsignedBigInteger('user_id')->nullable()->change();
                }
                if (!Schema::hasColumn('orders','guest_token')) {
                    $table->string('guest_token')->nullable()->index();
                }
                if (!Schema::hasColumn('orders','guest_phone')) {
                    $table->string('guest_phone')->nullable()->index();
                }
            });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
