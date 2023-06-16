<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Yajra\Datatables\Datatables;
use Carbon\Carbon;

use App\Imports\ProductsImport;
use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;

use App\Models\Product;
use App\Models\Category;
use App\Models\SalesType;
use App\Models\Setup;
use App\Models\PromoProductCombination;
use App\Models\Company;
use App\Models\StoreArea;
use App\Models\Store;
use App\Models\Type;
use App\Models\Update;
use App\Models\UpdateData;
use App\Models\SendUpdate;

use Illuminate\Support\Facades\File;
use Str;
class ProductsController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }
}