<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Fruit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockOutTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_record_stock_out(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);
        $category = Category::create(['name' => 'Citrus']);
        $fruit = Fruit::create([
            'category_id' => $category->id,
            'name' => 'Jeruk Medan',
            'unit' => 'kg',
            'price' => 18000,
            'current_stock' => 50,
            'minimum_stock' => 20,
        ]);

        $response = $this->actingAs($staff, 'sanctum')->postJson('/api/stock-outs', [
            'fruit_id' => $fruit->id,
            'quantity' => 10,
            'type' => 'sold',
            'selling_price' => 20000,
            'date_out' => '2026-07-19',
        ]);

        $response->assertStatus(201);
        $this->assertEquals(40, $fruit->fresh()->current_stock);
    }

    public function test_stock_out_rejected_when_exceeds_current_stock(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);
        $category = Category::create(['name' => 'Citrus']);
        $fruit = Fruit::create([
            'category_id' => $category->id,
            'name' => 'Anggur Import',
            'unit' => 'kg',
            'price' => 45000,
            'current_stock' => 8,
            'minimum_stock' => 10,
        ]);

        $response = $this->actingAs($staff, 'sanctum')->postJson('/api/stock-outs', [
            'fruit_id' => $fruit->id,
            'quantity' => 999,
            'type' => 'sold',
            'selling_price' => 50000,
            'date_out' => '2026-07-19',
        ]);

        $response->assertStatus(422);
        $this->assertEquals(8, $fruit->fresh()->current_stock);
    }
}