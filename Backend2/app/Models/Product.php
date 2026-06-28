<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'title','slug','description','price','cost_price','mrp','stock','category_id','thumbnail_url', 
        'unit', 'unit_value', 'inner_unit', 'inner_unit_value', 'is_featured',
        // Professional Fields
        'brand', 'size', 'package_type', 'pieces_per_packet', 'packets_per_peti',
        'purchase_price', 'selling_price_peti', 'selling_price_packet', 'selling_price_piece',
        'noise_level', 'is_kids_safe', 'use_type', 'season',
        'hsn_code', 'gst_percentage', 'video_downloadable', 'attributes', 'is_bundle'
    ];
    protected $casts = [
        'is_featured' => 'boolean',
        'is_bundle' => 'boolean',
        'is_kids_safe' => 'boolean',
        'video_downloadable' => 'boolean',
        'json' => 'array'
    ];

    public function getThumbnailUrlAttribute($value) {
        if (!$value) return $value;
        if (str_starts_with($value, 'http')) return $value;
        return url($value);
    }

    public function category(){ return $this->belongsTo(Category::class); }
    public function images(){ return $this->hasMany(ProductImage::class); }
    public function videos(){ return $this->hasMany(Video::class); }
    public function orderItems(){ return $this->hasMany(OrderItem::class); }
    public function bundleItems(){ return $this->hasMany(BundleItem::class, 'bundle_id'); }
}
