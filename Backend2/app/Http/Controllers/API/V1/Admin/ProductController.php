<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\Video;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'images', 'videos'])->latest()->paginate(10);
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'brand' => 'nullable|string',
            'size' => 'nullable|string',
            'package_type' => 'nullable|string',
            'pieces_per_packet' => 'nullable|integer|min:1',
            'packets_per_peti' => 'nullable|integer|min:1',
            'purchase_price' => 'nullable|numeric',
            'selling_price_peti' => 'nullable|numeric',
            'selling_price_packet' => 'required|numeric',
            'selling_price_piece' => 'nullable|numeric',
            'stock' => 'required|integer',
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

        $validated['slug'] = Str::slug($validated['title']) . '-' . time();
        $validated['price'] = $validated['selling_price_packet']; 
        
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('products', 'public');
            // Use relative path to avoid host issues
            $validated['thumbnail_url'] = '/storage/' . $path;
        }
        
        $product = Product::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create(['url' => '/storage/' . $path]);
            }
        }

        if ($request->hasFile('videos')) {
            foreach ($request->file('videos') as $video) {
                $path = $video->store('videos', 'public');
                $product->videos()->create(['url' => '/storage/' . $path]);
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

        if (isset($validated['selling_price_packet'])) {
            $validated['price'] = $validated['selling_price_packet'];
        }

        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail
            if ($product->thumbnail_url) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $product->thumbnail_url));
            }
            $path = $request->file('thumbnail')->store('products', 'public');
            $validated['thumbnail_url'] = '/storage/' . $path;
        }

        $product->update($validated);

        if ($request->hasFile('images')) {
            // REPLACE: Delete existing images
            foreach ($product->images as $oldImage) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $oldImage->url));
                $oldImage->delete();
            }
             foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create(['url' => '/storage/' . $path]);
            }
        }

         if ($request->hasFile('videos')) {
            // REPLACE: Delete existing videos
            foreach ($product->videos as $oldVideo) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $oldVideo->url));
                $oldVideo->delete();
            }
            foreach ($request->file('videos') as $video) {
                $path = $video->store('videos', 'public');
                $product->videos()->create(['url' => '/storage/' . $path]);
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
