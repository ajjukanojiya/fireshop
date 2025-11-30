<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
  
    public function index() {
      try{
        $products = Product::with('images','videos')->paginate(12);
        return response()->json($products);
      }catch (\Exception $e) {
        // If an exception occurs, return a JSON response with the error message
        return response()->json(['error' => $e->getMessage()], 500);
    }
      }
      public function show($id) {
        $product = Product::with(['images','videos','category'])->find($id);
        if (!$product) return response()->json(['message'=>'Not found'],404);
        return response()->json($product);
      }
}
