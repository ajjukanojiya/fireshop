<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BundleItem extends Model
{
    protected $fillable = [
        'bundle_id',
        'product_id',
        'quantity'
    ];

    public function bundle()
    {
        return $this->belongsTo(Product::class, 'bundle_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
