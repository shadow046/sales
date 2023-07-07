<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dtl extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'dtl';
    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(Product::class, 'itemcode', 'item_code');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'storecode', 'branch_code');
    }
}
