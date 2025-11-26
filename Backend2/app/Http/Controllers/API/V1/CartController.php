<?php
namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use DB;

class CartController extends Controller
{
    // get cart for current user (or return empty)
    public function index(Request $r)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['data'=>[], 'total'=>0]);
        }
        $items = CartItem::with('product')->where('user_id', $user->id)->get();
        $total = $items->sum(fn($it) => $it->quantity * (float) ($it->product->price ?? 0));
        return response()->json(['data'=>$items, 'total'=>$total]);
    }

    // add item (if exists increment)
    public function add(Request $r)
    {
        $v = Validator::make($r->all(), [
            'product_id'=>'required|integer|exists:products,id',
            'quantity'=>'integer|min:1',
            'meta'=>'nullable|array'
        ]);
        if ($v->fails()) return response()->json($v->errors(), 422);

        $qty = $r->get('quantity', 1);
        $product = Product::findOrFail($r->product_id);
        $user = Auth::user();
    //  return ($user);
        // if not logged in, return 401 and frontend will use localStorage
        if (!$user) return response()->json(['message'=>'Unauthenticated'], 401);

        // check stock
        if ($product->stock < $qty) {
            return response()->json(['message'=>'Insufficient stock'], 422);
        }

        // transaction safe
        return DB::transaction(function() use($user,$product,$qty,$r){
            $item = CartItem::where('user_id',$user->id)->where('product_id',$product->id)->first();
            if ($item) {
                $item->quantity += $qty;
                $item->meta = $r->meta ? $r->meta : $item->meta;
                $item->save();
            } else {
                $item = CartItem::create([
                    'user_id'=>$user->id,
                    'product_id'=>$product->id,
                    'quantity'=>$qty,
                    'meta'=>$r->meta ?? null
                ]);
            }
            $item->load('product');
            return response()->json(['item'=>$item, 'message'=>'Added to cart']);
        });
    }

    // update quantity or meta
    public function update(Request $r, $id)
    {
        $v = Validator::make($r->all(), [
            'quantity'=>'integer|min:1',
            'meta'=>'nullable|array'
        ]);
        if ($v->fails()) return response()->json($v->errors(),422);

        $user = Auth::user();
        if (!$user) return response()->json(['message'=>'Unauthenticated'],401);

        $item = CartItem::where('id',$id)->where('user_id',$user->id)->firstOrFail();

        if ($r->has('quantity')) $item->quantity = $r->quantity;
        if ($r->has('meta')) $item->meta = $r->meta;
        $item->save();

        $item->load('product');
        return response()->json(['item'=>$item]);
    }

    // remove
    public function remove(Request $r, $id)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message'=>'Unauthenticated'],401);

        $item = CartItem::where('id',$id)->where('user_id',$user->id)->firstOrFail();
        $item->delete();
        return response()->json(['message'=>'Removed']);
    }

    // clear cart
    public function clear(Request $r)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message'=>'Unauthenticated'],401);
        CartItem::where('user_id',$user->id)->delete();
        return response()->json(['message'=>'Cleared']);
    }
}
