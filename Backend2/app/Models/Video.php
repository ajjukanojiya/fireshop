<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = ['product_id','title','url','duration_seconds'];
    public function product(){ return $this->belongsTo(Product::class); }
    public function analytics(){ return $this->hasMany(VideoAnalytics::class); }
}
