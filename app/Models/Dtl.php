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
}
