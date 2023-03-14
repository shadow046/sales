<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyContactPerson extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'company_contact_person';
}
