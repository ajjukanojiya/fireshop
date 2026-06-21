<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Delivery;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class MasterDemoSeeder extends Seeder
{
    public function run()
    {
        // 1. Create Core Users
        $admin = User::firstOrCreate(['email' => 'admin@fireshop.com'], [
            'name' => 'Ajay Admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '9999999999'
        ]);

        $deliveryBoy1 = User::firstOrCreate(['email' => 'delivery1@fireshop.com'], [
            'name' => 'Raju (Delivery Boy)',
            'password' => Hash::make('password'),
            'role' => 'delivery_boy',
            'phone' => '8888888881'
        ]);

        $deliveryBoy2 = User::firstOrCreate(['email' => 'delivery2@fireshop.com'], [
            'name' => 'Shyam (Delivery Boy)',
            'password' => Hash::make('password'),
            'role' => 'delivery_boy',
            'phone' => '8888888882'
        ]);

        $customer1 = User::firstOrCreate(['email' => 'customer1@demo.com'], [
            'name' => 'Ramesh Customer',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '7777777771'
        ]);
        
        $customer2 = User::firstOrCreate(['email' => 'customer2@demo.com'], [
            'name' => 'Suresh Customer',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '7777777772'
        ]);

        // 2. Seed Products & Categories
        $this->call(DemoProductSeeder::class);

        // 3. Create Orders and Deliveries
        $products = Product::inRandomOrder()->limit(10)->get();

        if ($products->count() > 0) {
            // Order 1: Pending, Online Paid
            $order1 = Order::create([
                'user_id' => $customer1->id,
                'total_amount' => 5500,
                'status' => 'pending',
                'address' => ['street' => '123 MG Road', 'city' => 'Mumbai', 'pincode' => '400001'],
                'created_at' => Carbon::now()->subHours(2)
            ]);

            OrderItem::create([
                'order_id' => $order1->id,
                'product_id' => $products[0]->id,
                'quantity' => 2,
                'price' => $products[0]->price
            ]);

            // Order 2: Shipped, COD - Assigned to Delivery Boy 1
            $order2 = Order::create([
                'user_id' => $customer2->id,
                'total_amount' => 2100,
                'status' => 'shipped',
                'address' => ['street' => '45 Andheri West', 'city' => 'Mumbai', 'pincode' => '400053'],
                'created_at' => Carbon::now()->subDays(1)
            ]);

            OrderItem::create([
                'order_id' => $order2->id,
                'product_id' => $products[1]->id,
                'quantity' => 1,
                'price' => $products[1]->price
            ]);

            Delivery::create([
                'order_id' => $order2->id,
                'user_id' => $deliveryBoy1->id,
                'status' => 'assigned',
                'collected_amount' => 0
            ]);

            // Order 3: Delivered, COD - Assigned to Delivery Boy 2
            $order3 = Order::create([
                'user_id' => $customer1->id,
                'total_amount' => 3200,
                'status' => 'delivered',
                'address' => ['street' => '123 MG Road', 'city' => 'Mumbai', 'pincode' => '400001'],
                'created_at' => Carbon::now()->subDays(3)
            ]);

            OrderItem::create([
                'order_id' => $order3->id,
                'product_id' => $products[2]->id,
                'quantity' => 4,
                'price' => $products[2]->price
            ]);

            Delivery::create([
                'order_id' => $order3->id,
                'user_id' => $deliveryBoy2->id,
                'status' => 'delivered',
                'collected_amount' => 3200
            ]);
        }
    }
}
