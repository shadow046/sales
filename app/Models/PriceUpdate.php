<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceUpdate extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'sqlpriceupdate';
    public $timestamps = false;
}
