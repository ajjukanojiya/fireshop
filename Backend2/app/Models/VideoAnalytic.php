<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VideoAnalytic extends Model
{
    protected $fillable = ['video_id','user_id','watched_seconds','event','ip'];
    public function video(){ return $this->belongsTo(Video::class); }
    public function user(){ return $this->belongsTo(User::class); }
}
