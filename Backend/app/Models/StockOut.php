<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockOut extends Model
{
    use HasFactory;

    protected $fillable = [
        'fruit_id',
        'user_id',
        'quantity',
        'type',
        'selling_price',
        'date_out',
    ];

    protected function casts(): array
    {
        return [
            'selling_price' => 'decimal:2',
            'date_out' => 'date',
        ];
    }

    public function fruit()
    {
        return $this->belongsTo(Fruit::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}