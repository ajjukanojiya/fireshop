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
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            
            // Payment Gateway Details
            $table->string('payment_gateway')->default('razorpay'); // razorpay, paytm, etc.
            $table->string('payment_id')->unique(); // razorpay_payment_id
            $table->string('order_id_gateway')->nullable(); // razorpay_order_id
            $table->string('signature')->nullable(); // razorpay_signature for verification
            
            // Transaction Details
            $table->decimal('amount', 10, 2); // Total amount
            $table->decimal('gateway_fee', 10, 2)->default(0); // Payment gateway charges
            $table->decimal('gst_on_fee', 10, 2)->default(0); // GST on gateway fee
            $table->decimal('net_amount', 10, 2); // Amount after deducting fees
            $table->string('currency')->default('INR');
            
            // Status Tracking
            $table->enum('status', ['pending', 'success', 'failed', 'refunded', 'disputed'])->default('pending');
            $table->string('payment_method')->nullable(); // card, upi, netbanking, wallet
            $table->string('card_network')->nullable(); // Visa, Mastercard, etc.
            $table->string('bank')->nullable(); // Bank name for netbanking/UPI
            
            // Reconciliation
            $table->boolean('is_reconciled')->default(false);
            $table->timestamp('reconciled_at')->nullable();
            $table->date('settlement_date')->nullable(); // When Razorpay settles to bank
            $table->string('settlement_id')->nullable(); // Razorpay settlement ID
            
            // Additional Data
            $table->json('gateway_response')->nullable(); // Full response from gateway
            $table->text('notes')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('customer_phone')->nullable();
            
            // Failure/Error Tracking
            $table->string('error_code')->nullable();
            $table->text('error_description')->nullable();
            $table->integer('retry_count')->default(0);
            
            $table->timestamps();
            
            // Indexes for faster queries
            $table->index('payment_id');
            $table->index('status');
            $table->index('settlement_date');
            $table->index('is_reconciled');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
