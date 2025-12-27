<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\Video;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        // Pagination
        $products = Product::with(['category', 'images', 'videos'])->latest()->paginate(10);
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required|numeric',
            'cost_price' => 'nullable|numeric',
            'mrp' => 'nullable|numeric',
            'stock' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'unit' => 'nullable|string',
            'unit_value' => 'nullable|integer',
            'inner_unit' => 'nullable|string',
            'inner_unit_value' => 'nullable|integer',
            'is_featured' => 'nullable|boolean',
            'thumbnail' => 'nullable|image|max:5120', // Increased to 5MB
            'images.*' => 'nullable|image|max:5120',
            'videos.*' => 'nullable|mimes:mp4,mov,avi,mkv,webm|max:51200', // Increased to 50MB
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . time();

        // Handle Thumbnail Upload
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('products', 'public');
            $validated['thumbnail_url'] = url('storage/' . $path);
        }
        
        $product = Product::create($validated);

        // Handle Gallery Images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create(['url' => url('storage/' . $path)]);
            }
        }

        // Handle Videos
        if ($request->hasFile('videos')) {
            foreach ($request->file('videos') as $video) {
                $path = $video->store('videos', 'public');
                $product->videos()->create(['url' => url('storage/' . $path)]);
            }
        }

        return response()->json(['message' => 'Product created', 'product' => $product], 201);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'images', 'videos'])->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric',
            'cost_price' => 'nullable|numeric',
            'mrp' => 'nullable|numeric',
            'stock' => 'sometimes|integer',
            'category_id' => 'sometimes|exists:categories,id',
            'description' => 'nullable|string',
            'unit' => 'nullable|string',
            'unit_value' => 'nullable|integer',
            'inner_unit' => 'nullable|string',
            'inner_unit_value' => 'nullable|integer',
            'is_featured' => 'nullable|boolean',
            'thumbnail' => 'nullable|image|max:5120',
            'images.*' => 'nullable|image|max:5120',
            'videos.*' => 'nullable|mimes:mp4,mov,avi,mkv,webm|max:51200',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . $product->id;
        }

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('products', 'public');
            $validated['thumbnail_url'] = url('storage/' . $path);
        }

        $product->update($validated);

        // Append new images/videos (simple implementation)
        if ($request->hasFile('images')) {
             foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create(['url' => url('storage/' . $path)]);
            }
        }

         if ($request->hasFile('videos')) {
            foreach ($request->file('videos') as $video) {
                $path = $video->store('videos', 'public');
                $product->videos()->create(['url' => url('storage/' . $path)]);
            }
        }

        return response()->json(['message' => 'Product updated', 'product' => $product]);
    }


    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }

    public function destroyVideo($id)
    {
        $video = Video::findOrFail($id);
        $video->delete();
        return response()->json(['message' => 'Video deleted']);
    }
}
