<?php

namespace App\Observers;

use App\Models\StockIn;

class StockInObserver
{
    public function created(StockIn $stockIn): void
    {
        $stockIn->fruit()->increment('current_stock', $stockIn->quantity);
    }

    public function deleted(StockIn $stockIn): void
    {
        $stockIn->fruit()->decrement('current_stock', $stockIn->quantity);
    }

    public function updated(StockIn $stockIn): void
    {
        $original = $stockIn->getOriginal('quantity');
        $diff = $stockIn->quantity - $original;

        if ($diff !== 0) {
            $stockIn->fruit()->increment('current_stock', $diff);
        }
    }
}