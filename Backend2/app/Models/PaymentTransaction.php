<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentTransaction extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'payment_gateway',
        'payment_id',
        'order_id_gateway',
        'signature',
        'amount',
        'gateway_fee',
        'gst_on_fee',
        'net_amount',
        'currency',
        'status',
        'payment_method',
        'card_network',
        'bank',
        'is_reconciled',
        'reconciled_at',
        'settlement_date',
        'settlement_id',
        'gateway_response',
        'notes',
        'customer_email',
        'customer_phone',
        'error_code',
        'error_description',
        'retry_count'
    ];

    protected $casts = [
        'gateway_response' => 'array',
        'is_reconciled' => 'boolean',
        'reconciled_at' => 'datetime',
        'settlement_date' => 'date',
        'amount' => 'decimal:2',
        'gateway_fee' => 'decimal:2',
        'gst_on_fee' => 'decimal:2',
        'net_amount' => 'decimal:2'
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Helper Methods
    public function markAsSuccess()
    {
        $this->update(['status' => 'success']);
    }

    public function markAsFailed($errorCode = null, $errorDescription = null)
    {
        $this->update([
            'status' => 'failed',
            'error_code' => $errorCode,
            'error_description' => $errorDescription
        ]);
    }

    public function markAsReconciled($settlementId = null, $settlementDate = null)
    {
        $this->update([
            'is_reconciled' => true,
            'reconciled_at' => now(),
            'settlement_id' => $settlementId,
            'settlement_date' => $settlementDate ?? now()->toDateString()
        ]);
    }

    // Scopes
    public function scopeSuccess($query)
    {
        return $query->where('status', 'success');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeUnreconciled($query)
    {
        return $query->where('is_reconciled', false);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }
}
