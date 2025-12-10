<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@fireshop.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'phone' => '9999999990',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
