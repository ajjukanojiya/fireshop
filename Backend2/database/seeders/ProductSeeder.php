<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder {
  public function run() {


    \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();

DB::table('videos')->truncate();
DB::table('products')->truncate();
DB::table('categories')->truncate();

    \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();


    DB::table('categories')->insert([
      ['name'=>'Rockets','slug'=>Str::slug('Rockets')],
      ['name'=>'Sparklers','slug'=>Str::slug('Sparklers')],
    ]);
    // DB::table('products')->insert([
    //   [
    //     'title'=>'Fireworks Pack A','slug'=>Str::slug('Fireworks Pack A'),
    //     'description'=>'Amazing fireworks pack A','price'=>500,'mrp'=>600,'stock'=>50,
    //     'thumbnail_url'=>'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    //     'category_id'=>1,'created_at'=>now(),'updated_at'=>now()
    //   ],
    //   [
    //     'title'=>'Fireworks Pack B','slug'=>Str::slug('Fireworks Pack B'),
    //     'description'=>'Great pack B','price'=>800,'stock'=>30,
    //     'thumbnail_url'=>'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    //     'category_id'=>2,'created_at'=>now(),'updated_at'=>now()
    //   ],
    // ]);

    DB::table('products')->insert([
      [
          'title'=>'Sky Shot Golden 1000','slug'=>Str::slug('Sky Shot Golden 1000'),
          'description'=>'Premium multi-shot golden sky fireworks. Perfect for grand festivals and weddings.','price'=>1200,'mrp'=>1500,'stock'=>50,
          'thumbnail_url'=>'https://images.unsplash.com/photo-1533202970425-06ab45009088?w=800&q=80',
          'category_id'=>1,'created_at'=>now(),'updated_at'=>now()
      ],
      [
          'title'=>'Classic Color Sparklers','slug'=>Str::slug('Classic Color Sparklers'),
          'description'=>'Safe and bright colorful sparklers for kids. Contains 5 boxes per pack.','price'=>150,'mrp'=>200,'stock'=>200,
          'thumbnail_url'=>'https://images.unsplash.com/photo-1498855926480-d98e83099315?w=800&q=80',
          'category_id'=>2,'created_at'=>now(),'updated_at'=>now()
      ],
      [
          'title'=>'Grand Finale Rocket Assortment','slug'=>Str::slug('Grand Finale Rocket Assortment'),
          'description'=>'A collection of 12 high-flying colorful rockets.','price'=>800,'mrp'=>1000,'stock'=>100,
          'thumbnail_url'=>'https://images.unsplash.com/photo-1543886518-294b0d061988?w=800&q=80',
          'category_id'=>1,'created_at'=>now(),'updated_at'=>now()
      ],
      [
          'title'=>'Diwali Special Chakri (Ground Spinner)','slug'=>Str::slug('Diwali Special Chakri'),
          'description'=>'Fast spinning, long lasting colorful ground spinners.','price'=>300,'mrp'=>400,'stock'=>150,
          'thumbnail_url'=>'https://images.unsplash.com/photo-1506045412240-22980140a405?w=800&q=80',
          'category_id'=>2,'created_at'=>now(),'updated_at'=>now()
      ]
  ]);
  

    DB::table('videos')->insert([
      ['product_id'=>1,'title'=>'Sky Shot Demo Video','url'=>'sample-5s.mp4'],
      ['product_id'=>2,'title'=>'Sparkler Demo Video','url'=>'sample-15s.mp4'],
    ]);
  }
}
