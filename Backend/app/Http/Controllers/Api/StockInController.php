<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StockInResource;
use App\Models\Fruit;
use App\Models\StockIn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StockInController extends Controller
{
    public function index()
    {
        $stockIns = StockIn::with(['fruit', 'supplier', 'user'])->latest()->get();

        return StockInResource::collection($stockIns);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fruit_id' => 'required|exists:fruits,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'quantity' => 'required|integer|min:1',
            'purchase_price' => 'required|numeric|min:0',
            'date_in' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $stockIn = StockIn::create([
            'fruit_id' => $request->fruit_id,
            'supplier_id' => $request->supplier_id,
            'user_id' => $request->user()->id,
            'quantity' => $request->quantity,
            'purchase_price' => $request->purchase_price,
            'date_in' => $request->date_in,
        ]);

        return response()->json([
            'message' => 'Stok masuk berhasil dicatat',
            'data' => new StockInResource($stockIn->load(['fruit', 'supplier', 'user'])),
        ], 201);
    }

    public function show(StockIn $stockIn)
    {
        return new StockInResource($stockIn->load(['fruit', 'supplier', 'user']));
    }

    public function destroy(StockIn $stockIn)
    {
        $stockIn->delete();

        return response()->json([
            'message' => 'Data stok masuk berhasil dihapus',
        ]);
    }
}