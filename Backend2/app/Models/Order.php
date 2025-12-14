<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['user_id','total_amount','status','payment_id','address','guest_token','guest_phone'];
  protected $casts = ['address' => 'array'];
  public function items(){ return $this->hasMany(OrderItem::class); }
  public function user(){ return $this->belongsTo(User::class); }
  
  public function delivery()
  {
      // Get the latest delivery assignment
      return $this->hasOne(Delivery::class)->latest();
  }

  public function refund()
  {
      return $this->hasOne(Refund::class);
  }

  public function paymentTransactions()
  {
      return $this->hasMany(PaymentTransaction::class);
  }

  public function latestPaymentTransaction()
  {
      return $this->hasOne(PaymentTransaction::class)->latest();
  }
}
