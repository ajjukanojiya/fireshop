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
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            // New Fields Validation
            'brand' => 'nullable|string',
            'size' => 'nullable|string', // Shots/Size
            'package_type' => 'nullable|string', // Peti/Box
            'pieces_per_packet' => 'nullable|integer|min:1',
            'packets_per_peti' => 'nullable|integer|min:1',
            // Prices
            'purchase_price' => 'nullable|numeric',
            'selling_price_peti' => 'nullable|numeric',
            'selling_price_packet' => 'required|numeric', // Main price usually
            'selling_price_piece' => 'nullable|numeric',
            // Stock
            'stock' => 'required|integer', // Total Packets (base unit for safe keeping)
            // Attributes
            'noise_level' => 'nullable|string',
            'is_kids_safe' => 'nullable|boolean',
            'use_type' => 'nullable|string',
            'season' => 'nullable|string',
            'hsn_code' => 'nullable|string',
            'gst_percentage' => 'nullable|numeric',
            'video_downloadable' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            // Media
            'thumbnail' => 'nullable|image|max:5120',
            'images.*' => 'nullable|image|max:5120',
            'videos.*' => 'nullable|mimes:mp4,mov,avi,mkv,webm|max:51200',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . time();
        // Map 'price' to selling_price_packet for legacy compatibility if needed, or just save as is.
        // The migration kept 'price', we should populate it with packet price for frontend consistency
        $validated['price'] = $validated['selling_price_packet']; 
        
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
            'category_id' => 'sometimes|exists:categories,id',
            'description' => 'nullable|string',
             // New Fields Validation
            'brand' => 'nullable|string',
            'size' => 'nullable|string',
            'package_type' => 'nullable|string',
            'pieces_per_packet' => 'nullable|integer|min:1',
            'packets_per_peti' => 'nullable|integer|min:1',
            'purchase_price' => 'nullable|numeric',
            'selling_price_peti' => 'nullable|numeric',
            'selling_price_packet' => 'sometimes|numeric',
            'selling_price_piece' => 'nullable|numeric',
            'stock' => 'sometimes|integer',
            'noise_level' => 'nullable|string',
            'is_kids_safe' => 'nullable|boolean',
            'use_type' => 'nullable|string',
            'season' => 'nullable|string',
            'hsn_code' => 'nullable|string',
            'gst_percentage' => 'nullable|numeric',
            'video_downloadable' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'thumbnail' => 'nullable|image|max:5120',
            'images.*' => 'nullable|image|max:5120',
            'videos.*' => 'nullable|mimes:mp4,mov,avi,mkv,webm|max:51200',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . $product->id;
        }

        if (isset($validated['selling_price_packet'])) {
            $validated['price'] = $validated['selling_price_packet'];
        }

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('products', 'public');
            $validated['thumbnail_url'] = url('storage/' . $path);
        }

        $product->update($validated);

        // Append new images/videos
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
