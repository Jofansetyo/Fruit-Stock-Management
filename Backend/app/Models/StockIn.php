<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockIn extends Model
{
    use HasFactory;

    protected $fillable = [
        'fruit_id',
        'supplier_id',
        'user_id',
        'quantity',
        'purchase_price',
        'date_in',
    ];

    protected function casts(): array
    {
        return [
            'purchase_price' => 'decimal:2',
            'date_in' => 'date',
        ];
    }

    public function fruit()
    {
        return $this->belongsTo(Fruit::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}