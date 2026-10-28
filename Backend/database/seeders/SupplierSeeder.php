<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        Supplier::create([
            'name' => 'CV Tani Makmur',
            'phone' => '081234567890',
            'address' => 'Jl. Raya Madiun No. 12',
        ]);

        Supplier::create([
            'name' => 'UD Buah Segar Jaya',
            'phone' => '082198765432',
            'address' => 'Jl. Pahlawan No. 45, Madiun',
        ]);

        Supplier::create([
            'name' => 'Kelompok Tani Sumber Rejeki',
            'phone' => '085711223344',
            'address' => 'Ds. Sukorejo, Kab. Madiun',
        ]);
    }
}