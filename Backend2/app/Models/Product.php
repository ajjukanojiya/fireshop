<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
  protected $fillable = ['title','slug','description','price','mrp','stock','category_id','thumbnail_url'];
  public function category(){ return $this->belongsTo(Category::class); }
  public function images(){ return $this->hasMany(ProductImage::class); }
  public function videos(){ return $this->hasMany(Video::class); }
  public function orderItems(){ return $this->hasMany(OrderItem::class); }
}
