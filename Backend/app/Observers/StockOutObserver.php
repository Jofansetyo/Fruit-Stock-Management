<?php

namespace App\Observers;

use App\Models\StockOut;

class StockOutObserver
{
    public function created(StockOut $stockOut): void
    {
        $stockOut->fruit()->decrement('current_stock', $stockOut->quantity);
    }

    public function deleted(StockOut $stockOut): void
    {
        $stockOut->fruit()->increment('current_stock', $stockOut->quantity);
    }

    public function updated(StockOut $stockOut): void
    {
        $original = $stockOut->getOriginal('quantity');
        $diff = $stockOut->quantity - $original;

        if ($diff !== 0) {
            $stockOut->fruit()->decrement('current_stock', $diff);
        }
    }
}