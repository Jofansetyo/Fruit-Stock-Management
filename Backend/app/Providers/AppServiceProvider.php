<?php

namespace App\Providers;

use App\Models\StockIn;
use App\Models\StockOut;
use App\Observers\StockInObserver;
use App\Observers\StockOutObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        StockIn::observe(StockInObserver::class);
        StockOut::observe(StockOutObserver::class);
    }
}