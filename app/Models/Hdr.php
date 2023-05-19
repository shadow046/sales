<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hdr extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'hdr';
    public $timestamps = false;

    public function store()
    {
        return $this->belongsTo(Store::class, 'storecode', 'branch_code');
    }
}
