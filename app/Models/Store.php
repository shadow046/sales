<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'store';

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_name', 'id');
    }

    public function storeArea()
    {
        return $this->belongsTo(StoreArea::class, 'store_area', 'id');
    }

    public function type()
    {
        return $this->belongsTo(Type::class, 'type', 'id');
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'group', 'id');
    }

    public function subGroup()
    {
        return $this->belongsTo(SubGroup::class, 'sub_group', 'id');
    }

    public function network()
    {
        return $this->belongsTo(NetworkSetup::class, 'network', 'id');
    }
}
