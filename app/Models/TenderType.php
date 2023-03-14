<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TenderType extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'tender_type';
}
