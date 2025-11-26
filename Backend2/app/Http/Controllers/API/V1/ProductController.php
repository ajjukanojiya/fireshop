<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index() {
        $products = Product::with('images','videos')->paginate(12);
        return response()->json($products);
      }
      public function show($id) {
        $product = Product::with(['images','videos','category'])->find($id);
        if (!$product) return response()->json(['message'=>'Not found'],404);
        return response()->json($product);
      }
}
