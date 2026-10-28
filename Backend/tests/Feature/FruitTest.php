<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Fruit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FruitTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_fruit(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create(['name' => 'Citrus']);

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/fruits', [
            'category_id' => $category->id,
            'name' => 'Jeruk Bali',
            'unit' => 'kg',
            'price' => 20000,
            'current_stock' => 50,
            'minimum_stock' => 10,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('fruits', ['name' => 'Jeruk Bali']);
    }

    public function test_staff_cannot_create_fruit(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);
        $category = Category::create(['name' => 'Citrus']);

        $response = $this->actingAs($staff, 'sanctum')->postJson('/api/fruits', [
            'category_id' => $category->id,
            'name' => 'Jeruk Bali',
            'unit' => 'kg',
            'price' => 20000,
        ]);

        $response->assertStatus(403);
    }

    public function test_can_list_fruits(): void
    {
        $staff = User::factory()->create(['role' => 'staff']);
        $category = Category::create(['name' => 'Citrus']);
        Fruit::create([
            'category_id' => $category->id,
            'name' => 'Jeruk Medan',
            'unit' => 'kg',
            'price' => 18000,
            'current_stock' => 64,
            'minimum_stock' => 20,
        ]);

        $response = $this->actingAs($staff, 'sanctum')->getJson('/api/fruits');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_admin_can_delete_fruit(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create(['name' => 'Citrus']);
        $fruit = Fruit::create([
            'category_id' => $category->id,
            'name' => 'Jeruk Medan',
            'unit' => 'kg',
            'price' => 18000,
            'current_stock' => 64,
            'minimum_stock' => 20,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/fruits/{$fruit->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('fruits', ['id' => $fruit->id]);
    }
}