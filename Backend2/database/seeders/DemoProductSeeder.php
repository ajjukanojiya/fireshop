<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

class DemoProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $demoData = [
            'Sparklers' => [
                'image' => 'https://images.unsplash.com/photo-1498100152305-ec6b31e13e51?q=80&w=400',
                'products' => ['7cm Sparklers', '10cm Sparklers', '15cm Color Sparklers', 'Electric Sparklers']
            ],
            'Flower Pots' => [
                'image' => 'https://images.unsplash.com/photo-1541845157-a6d2d100c931?q=80&w=400',
                'products' => ['Small Anar', 'Giant Flower Pot', 'Color Changing Anar', 'Silver Showers']
            ],
            'Ground Spinners' => [
                'image' => 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?q=80&w=400',
                'products' => ['Zameen Chakri', 'Big Spinner', 'Whistling Spinner', 'Color Chakri']
            ],
            'Rockets' => [
                'image' => 'https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?q=80&w=400',
                'products' => ['Baby Rocket', 'Whistling Rocket', 'Parachute Rocket', 'Giant Sky Rocket']
            ],
            'Aerial Shots' => [
                'image' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400',
                'products' => ['12 Shots Cake', '30 Shots Multi-color', '100 Shots Mega Cake', '2 Inch Shell']
            ],
            'Bombs' => [
                'image' => 'https://images.unsplash.com/photo-1499596815340-0c4e70df5ea9?q=80&w=400',
                'products' => ['Atom Bomb', 'Hydro Bomb', 'Classic Green Bomb', 'Laxmi Bomb']
            ]
        ];

        $brands = ['Standard', 'Cock', 'Sony', 'Anil', 'Ajanta'];

        foreach ($demoData as $catName => $data) {
            $category = Category::firstOrCreate([
                'name' => $catName,
            ], [
                'slug' => Str::slug($catName),
                'description' => 'Premium ' . $catName . ' collection'
            ]);

            foreach ($data['products'] as $productName) {
                // Determine a base packet price
                $packetPrice = rand(50, 300);
                $petiPrice = $packetPrice * 40; // assuming 50 packets per peti with some discount

                Product::create([
                    'title' => $productName,
                    'slug' => Str::slug($productName) . '-' . rand(100, 999),
                    'description' => 'High-quality ' . strtolower($productName) . ' for your celebrations. Emits brilliant colors and is safe to use following guidelines.',
                    'price' => $packetPrice,
                    'cost_price' => $packetPrice * 0.6, // 40% margin
                    'mrp' => $packetPrice * 1.5,
                    'stock' => rand(100, 500),
                    'category_id' => $category->id,
                    'thumbnail_url' => $data['image'],
                    'is_featured' => false,
                    
                    // Professional Fields
                    'brand' => $brands[array_rand($brands)],
                    'size' => rand(5, 20) . ' cm',
                    'package_type' => 'Box',
                    'pieces_per_packet' => rand(5, 10),
                    'packets_per_peti' => 50,
                    'purchase_price' => $petiPrice * 0.6,
                    'selling_price_peti' => $petiPrice,
                    'selling_price_packet' => $packetPrice,
                    'selling_price_piece' => round($packetPrice / 10, 2),
                    
                    'noise_level' => in_array($catName, ['Bombs', 'Aerial Shots']) ? 'High' : 'Low',
                    'is_kids_safe' => in_array($catName, ['Sparklers', 'Flower Pots']) ? true : false,
                    'use_type' => 'Outdoor',
                    'season' => 'Diwali'
                ]);
            }
        }
    }
}
