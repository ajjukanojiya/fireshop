<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder {
  public function run() {


    DB::statement('SET FOREIGN_KEY_CHECKS=0;');

DB::table('videos')->truncate();
DB::table('products')->truncate();
DB::table('categories')->truncate();

DB::statement('SET FOREIGN_KEY_CHECKS=1;');


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
          'title'=>'Fireworks Pack A','slug'=>Str::slug('Fireworks Pack A'),
          'description'=>'Amazing fireworks pack A','price'=>500,'mrp'=>600,'stock'=>50,
          'thumbnail_url'=>'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
          'category_id'=>1,'created_at'=>now(),'updated_at'=>now()
      ],
      [
          'title'=>'Fireworks Pack B','slug'=>Str::slug('Fireworks Pack B'),
          'description'=>'Great pack B','price'=>800,'mrp'=>900,'stock'=>30,
          'thumbnail_url'=>'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
          'category_id'=>2,'created_at'=>now(),'updated_at'=>now()
      ],
  ]);
  

    DB::table('videos')->insert([
      ['product_id'=>1,'title'=>'Demo Video A','url'=>'sample-5s.mp4'],
      ['product_id'=>2,'title'=>'Demo Video B','url'=>'sample-15s.mp4'],
    ]);
  }
}
