<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockInResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'purchase_price' => $this->purchase_price,
            'date_in' => $this->date_in,
            'fruit' => new FruitResource($this->whenLoaded('fruit')),
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
            'user' => [
                'id' => $this->whenLoaded('user', fn () => $this->user->id),
                'name' => $this->whenLoaded('user', fn () => $this->user->name),
            ],
            'created_at' => $this->created_at,
        ];
    }
}