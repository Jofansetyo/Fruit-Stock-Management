<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FruitResource;
use App\Models\Fruit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FruitController extends Controller
{
    public function index()
    {
        return FruitResource::collection(Fruit::with('category')->latest()->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:20',
            'price' => 'required|numeric|min:0',
            'current_stock' => 'nullable|integer|min:0',
            'minimum_stock' => 'nullable|integer|min:0',
            'image' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $fruit = Fruit::create($request->only(
            'category_id', 'name', 'unit', 'price', 'current_stock', 'minimum_stock', 'image'
        ));

        return response()->json([
            'message' => 'Buah berhasil ditambahkan',
            'data' => new FruitResource($fruit->load('category')),
        ], 201);
    }

    public function show(Fruit $fruit)
    {
        return new FruitResource($fruit->load('category'));
    }

    public function update(Request $request, Fruit $fruit)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:20',
            'price' => 'required|numeric|min:0',
            'minimum_stock' => 'nullable|integer|min:0',
            'image' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $fruit->update($request->only(
            'category_id', 'name', 'unit', 'price', 'minimum_stock', 'image'
        ));

        return response()->json([
            'message' => 'Buah berhasil diperbarui',
            'data' => new FruitResource($fruit->load('category')),
        ]);
    }

    public function destroy(Fruit $fruit)
    {
        $fruit->delete();

        return response()->json([
            'message' => 'Buah berhasil dihapus',
        ]);
    }
}