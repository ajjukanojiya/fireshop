<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;

class CartController extends Controller
{
    public function index(Request $r) {
        $userId = $r->user()?->id;
        $items = CartItem::with('product')->when($userId, fn($q)=>$q->where('user_id',$userId))->get();
        return response()->json($items);
      }
      public function add(Request $r) {
        $r->validate(['product_id'=>'required','quantity'=>'required|int|min:1','price_at_add'=>'required']);
        $item = CartItem::create($r->only('user_id','product_id','quantity','price_at_add'));
        return response()->json($item,201);
      }
      public function remove($id) { CartItem::findOrFail($id)->delete(); return response()->json(['deleted'=>true]); }
}
