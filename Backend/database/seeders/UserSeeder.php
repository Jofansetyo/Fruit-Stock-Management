<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Toko',
            'email' => 'admin@stokbuah.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Staff Gudang',
            'email' => 'staff@stokbuah.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
        ]);
    }
}