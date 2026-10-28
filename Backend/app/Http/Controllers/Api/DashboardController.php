<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FruitResource;
use App\Http\Resources\StockInResource;
use App\Http\Resources\StockOutResource;
use App\Models\Fruit;
use App\Models\StockIn;
use App\Models\StockOut;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function summary()
    {
        $totalFruitTypes = Fruit::count();
        $totalStock = Fruit::sum('current_stock');
        $lowStockFruits = Fruit::whereColumn('current_stock', '<=', 'minimum_stock')->get();
        $todayStockIns = StockIn::whereDate('date_in', today())->count();
        $todayStockOuts = StockOut::whereDate('date_out', today())->count();

        return response()->json([
            'total_fruit_types' => $totalFruitTypes,
            'total_stock' => $totalStock,
            'low_stock_count' => $lowStockFruits->count(),
            'low_stock_fruits' => FruitResource::collection($lowStockFruits),
            'today_transactions' => $todayStockIns + $todayStockOuts,
        ]);
    }

    public function stockInReport(Request $request)
    {
        $query = StockIn::with(['fruit', 'supplier', 'user']);

        if ($request->filled('start')) {
            $query->whereDate('date_in', '>=', $request->start);
        }

        if ($request->filled('end')) {
            $query->whereDate('date_in', '<=', $request->end);
        }

        $stockIns = $query->latest()->get();

        return response()->json([
            'total_transaksi' => $stockIns->count(),
            'total_quantity' => $stockIns->sum('quantity'),
            'total_pembelian' => $stockIns->sum(fn ($item) => $item->quantity * $item->purchase_price),
            'data' => StockInResource::collection($stockIns),
        ]);
    }

    public function stockOutReport(Request $request)
    {
        $query = StockOut::with(['fruit', 'user']);

        if ($request->filled('start')) {
            $query->whereDate('date_out', '>=', $request->start);
        }

        if ($request->filled('end')) {
            $query->whereDate('date_out', '<=', $request->end);
        }

        $stockOuts = $query->latest()->get();

        return response()->json([
            'total_transaksi' => $stockOuts->count(),
            'total_quantity' => $stockOuts->sum('quantity'),
            'total_penjualan' => $stockOuts->where('type', 'sold')->sum(fn ($item) => $item->quantity * $item->selling_price),
            'data' => StockOutResource::collection($stockOuts),
        ]);
    }
}