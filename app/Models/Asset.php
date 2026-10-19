<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Asset extends Model
{
    protected $fillable = [
        'asset_code',
        'name',
        'category',
        'brand',
        'model',
        'serial_number',
        'location',
        'condition',
        'status',
        'purchase_date',
        'purchase_price',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'purchase_price' => 'integer',
        ];
    }

    public function conditionChecks(): HasMany
    {
        return $this->hasMany(ConditionCheck::class);
    }
}
