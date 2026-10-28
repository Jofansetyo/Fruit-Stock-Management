<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Fruit;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockInTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_record_stock_in(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);
        $category = Category::create(['name' => 'Citrus']);
        $supplier = Supplier::create(['name' => 'CV Tani Makmur']);
        $fruit = Fruit::create([
            'category_id' => $category->id,
            'name' => 'Jeruk Medan',
            'unit' => 'kg',
            'price' => 18000,
            'current_stock' => 50,
            'minimum_stock' => 20,
        ]);

        $response = $this->actingAs($staff, 'sanctum')->postJson('/api/stock-ins', [
            'fruit_id' => $fruit->id,
            'supplier_id' => $supplier->id,
            'quantity' => 20,
            'purchase_price' => 15000,
            'date_in' => '2026-07-19',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('stock_ins', ['fruit_id' => $fruit->id, 'quantity' => 20]);
    }

    public function test_current_stock_increases_after_stock_in(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);
        $category = Category::create(['name' => 'Citrus']);
        $supplier = Supplier::create(['name' => 'CV Tani Makmur']);
        $fruit = Fruit::create([
            'category_id' => $category->id,
            'name' => 'Jeruk Medan',
            'unit' => 'kg',
            'price' => 18000,
            'current_stock' => 50,
            'minimum_stock' => 20,
        ]);

        $this->actingAs($staff, 'sanctum')->postJson('/api/stock-ins', [
            'fruit_id' => $fruit->id,
            'supplier_id' => $supplier->id,
            'quantity' => 20,
            'purchase_price' => 15000,
            'date_in' => '2026-07-19',
        ]);

        $this->assertEquals(70, $fruit->fresh()->current_stock);
    }
}