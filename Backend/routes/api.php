<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FruitController;
use App\Http\Controllers\Api\StockInController;
use App\Http\Controllers\Api\StockOutController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::middleware('role:admin,staff')->group(function () {
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::get('/categories/{category}', [CategoryController::class, 'show']);
        Route::get('/suppliers', [SupplierController::class, 'index']);
        Route::get('/suppliers/{supplier}', [SupplierController::class, 'show']);
        Route::get('/fruits', [FruitController::class, 'index']);
        Route::get('/fruits/{fruit}', [FruitController::class, 'show']);

        Route::get('/stock-ins', [StockInController::class, 'index']);
        Route::post('/stock-ins', [StockInController::class, 'store']);
        Route::get('/stock-ins/{stockIn}', [StockInController::class, 'show']);

        Route::get('/stock-outs', [StockOutController::class, 'index']);
        Route::post('/stock-outs', [StockOutController::class, 'store']);
        Route::get('/stock-outs/{stockOut}', [StockOutController::class, 'show']);

        Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
        Route::get('/reports/stock-in', [DashboardController::class, 'stockInReport']);
        Route::get('/reports/stock-out', [DashboardController::class, 'stockOutReport']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::post('/suppliers', [SupplierController::class, 'store']);
        Route::put('/suppliers/{supplier}', [SupplierController::class, 'update']);
        Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy']);

        Route::get('/users', [UserController::class, 'index']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);

        Route::post('/fruits', [FruitController::class, 'store']);
        Route::put('/fruits/{fruit}', [FruitController::class, 'update']);
        Route::delete('/fruits/{fruit}', [FruitController::class, 'destroy']);

        Route::delete('/stock-ins/{stockIn}', [StockInController::class, 'destroy']);
        Route::delete('/stock-outs/{stockOut}', [StockOutController::class, 'destroy']);
    });
});