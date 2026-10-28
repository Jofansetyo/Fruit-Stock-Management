<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Fruit;
use Illuminate\Database\Seeder;

class FruitSeeder extends Seeder
{
    public function run(): void
    {
        $citrus = Category::where('name', 'Citrus')->first();
        $tropis = Category::where('name', 'Tropis')->first();
        $berry = Category::where('name', 'Berry')->first();
        $pome = Category::where('name', 'Pome')->first();
        $melon = Category::where('name', 'Melon')->first();

        $fruits = [
            ['category_id' => $citrus->id, 'name' => 'Jeruk Medan', 'unit' => 'kg', 'price' => 18000, 'current_stock' => 64, 'minimum_stock' => 20],
            ['category_id' => $citrus->id, 'name' => 'Jeruk Lemon', 'unit' => 'kg', 'price' => 25000, 'current_stock' => 30, 'minimum_stock' => 15],
            ['category_id' => $tropis->id, 'name' => 'Nanas Madu', 'unit' => 'pcs', 'price' => 12000, 'current_stock' => 42, 'minimum_stock' => 10],
            ['category_id' => $tropis->id, 'name' => 'Mangga Harum', 'unit' => 'kg', 'price' => 20000, 'current_stock' => 6, 'minimum_stock' => 15],
            ['category_id' => $berry->id, 'name' => 'Anggur Import', 'unit' => 'kg', 'price' => 45000, 'current_stock' => 8, 'minimum_stock' => 10],
            ['category_id' => $berry->id, 'name' => 'Strawberry', 'unit' => 'kg', 'price' => 35000, 'current_stock' => 12, 'minimum_stock' => 10],
            ['category_id' => $pome->id, 'name' => 'Apel Malang', 'unit' => 'kg', 'price' => 22000, 'current_stock' => 15, 'minimum_stock' => 20],
            ['category_id' => $pome->id, 'name' => 'Pir Yali', 'unit' => 'kg', 'price' => 28000, 'current_stock' => 18, 'minimum_stock' => 10],
            ['category_id' => $melon->id, 'name' => 'Semangka Merah', 'unit' => 'kg', 'price' => 8000, 'current_stock' => 50, 'minimum_stock' => 20],
            ['category_id' => $melon->id, 'name' => 'Melon Golden', 'unit' => 'kg', 'price' => 15000, 'current_stock' => 25, 'minimum_stock' => 15],
        ];

        foreach ($fruits as $fruit) {
            Fruit::create($fruit);
        }
    }
}