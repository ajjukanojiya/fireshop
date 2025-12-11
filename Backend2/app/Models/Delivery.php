<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    protected $fillable = ['order_id', 'user_id', 'status', 'proof_image', 'collected_amount'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function deliveryBoy()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
