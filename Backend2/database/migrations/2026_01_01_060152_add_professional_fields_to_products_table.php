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
            $table->string('brand')->nullable();
            $table->string('size')->nullable(); // Size/Type/Shots (e.g., 6 Inch, 12 Shots)
            
            // Packing Hierarchy
            $table->string('package_type')->default('Box'); // Peti/Box/Carton
            $table->integer('pieces_per_packet')->default(1);
            $table->integer('packets_per_peti')->default(1);
            
            // Pricing Tiers
            $table->decimal('purchase_price', 10, 2)->nullable(); // Cost per Peti
            $table->decimal('selling_price_peti', 10, 2)->nullable();
            $table->decimal('selling_price_packet', 10, 2)->nullable();
            $table->decimal('selling_price_piece', 10, 2)->nullable();
            
            // Attributes
            $table->string('noise_level')->nullable(); // Low/Medium/High
            $table->boolean('is_kids_safe')->default(false);
            $table->string('use_type')->nullable(); // Indoor/Outdoor
            $table->string('season')->nullable(); // Diwali, Wedding
            
            // Tax & Legal
            $table->string('hsn_code')->nullable();
            $table->decimal('gst_percentage', 5, 2)->nullable();
            
            // Media Options
            $table->boolean('video_downloadable')->default(false);
            
            // Dynamic Attributes (JSON for flexibility)
            $table->json('attributes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'brand', 'size', 'package_type', 'pieces_per_packet', 'packets_per_peti',
                'purchase_price', 'selling_price_peti', 'selling_price_packet', 'selling_price_piece',
                'noise_level', 'is_kids_safe', 'use_type', 'season',
                'hsn_code', 'gst_percentage', 'video_downloadable', 'attributes'
            ]);
        });
    }
};
