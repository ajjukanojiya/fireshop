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
        Schema::table('products', function (Blueprint $table) {
            $table->string('unit')->nullable()->after('stock'); // e.g., Unit, Peti
            $table->integer('unit_value')->nullable()->after('unit')->default(1);
            $table->string('inner_unit')->nullable()->after('unit_value'); // e.g., Packet, Piece
            $table->integer('inner_unit_value')->nullable()->after('inner_unit'); // e.g., 10
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['unit', 'unit_value', 'inner_unit', 'inner_unit_value']);
        });
    }
};
