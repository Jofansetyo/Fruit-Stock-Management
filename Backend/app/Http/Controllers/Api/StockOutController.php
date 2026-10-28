<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StockOutResource;
use App\Models\Fruit;
use App\Models\StockOut;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StockOutController extends Controller
{
    public function index()
    {
        $stockOuts = StockOut::with(['fruit', 'user'])->latest()->get();

        return StockOutResource::collection($stockOuts);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fruit_id' => 'required|exists:fruits,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:sold,damaged,expired',
            'selling_price' => 'nullable|numeric|min:0',
            'date_out' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $fruit = Fruit::findOrFail($request->fruit_id);

        if ($request->quantity > $fruit->current_stock) {
            return response()->json([
                'message' => 'Stok tidak mencukupi',
                'errors' => [
                    'quantity' => ["Stok tersedia hanya {$fruit->current_stock} {$fruit->unit}, tidak bisa keluar {$request->quantity} {$fruit->unit}"],
                ],
            ], 422);
        }

        $stockOut = StockOut::create([
            'fruit_id' => $request->fruit_id,
            'user_id' => $request->user()->id,
            'quantity' => $request->quantity,
            'type' => $request->type,
            'selling_price' => $request->type === 'sold' ? $request->selling_price : null,
            'date_out' => $request->date_out,
        ]);

        return response()->json([
            'message' => 'Stok keluar berhasil dicatat',
            'data' => new StockOutResource($stockOut->load(['fruit', 'user'])),
        ], 201);
    }

    public function show(StockOut $stockOut)
    {
        return new StockOutResource($stockOut->load(['fruit', 'user']));
    }

    public function destroy(StockOut $stockOut)
    {
        $stockOut->delete();

        return response()->json([
            'message' => 'Data stok keluar berhasil dihapus',
        ]);
    }
}