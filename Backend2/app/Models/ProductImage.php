<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $fillable = ['product_id','url','is_primary'];

    public function getUrlAttribute($value) {
        if (!$value) return $value;
        if (str_starts_with($value, 'http')) return $value;
        return url($value);
    }

    public function product(){ return $this->belongsTo(Product::class); }
}
