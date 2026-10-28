<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Citrus', 'Tropis', 'Berry', 'Pome', 'Melon'];

        foreach ($categories as $name) {
            Category::create(['name' => $name]);
        }
    }
}