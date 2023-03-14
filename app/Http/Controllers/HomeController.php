<?php

namespace App\Http\Controllers;

use DB;
use PDO;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Yajra\DataTables\Facades\DataTables;

use App\Models\Store;
use App\Models\Company;
use App\Models\Promo;
use App\Models\Pos;
use App\Models\Province;
use App\Models\City;
use App\Models\Product;
use App\Models\Item;
use App\Models\Data;
use App\Models\Hdr;
use App\Models\Dtl;
use App\Models\Region;
use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;

use App\Models\Type;
use App\Models\Setup;
use App\Models\Group;
use App\Models\Subgroup;
use App\Models\NetworkSetup;
use App\Models\DeliveryServingStore;
use App\Models\Category;
use App\Models\SalesType;
use App\Models\HasPermission;

class HomeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(){
        $check = 0;
        $roles = HasPermission::select('permission_id')->where('role_id',auth()->user()->userlevel)->get();
        foreach($roles as $key => $value){
            if(in_array("27",explode(",",$value['permission_id']))){
                $check++;
            }
        }

        if($check > 0){
            DB::table('old_gt')->update([
                'oldgt' => DB::raw("REPLACE(REPLACE(oldgt, '\r', ''), '\n', '')")
            ]);
            $items = Store::where('status', 'ACTIVE')->get();
            $fullstores = 0;
            $drivethru = 0;
            $kiosks = 0;

            foreach($items as $itemkey => $itemvalue){
                if($itemvalue['setup']){
                    foreach(explode(",",$itemvalue['setup']) as $setup){
                        $setup_val = Setup::where('id', $setup)->first()->setup;
                        if(str_contains($setup_val, 'FULL STORE')){
                            $fullstores++;
                        }
                        if(str_contains($setup_val, 'DRIVE THRU') || str_contains($setup_val, 'BIKE THRU')){
                            $drivethru++;
                        }
                        if(str_contains($setup_val, 'KIOSKS')){
                            $kiosks++;
                        }
                    }
                }
            }

            $coowned = Store::where('status', 'ACTIVE')->where('type','1')->count();
            $franchise = Store::where('status', 'ACTIVE')->where('type','2')->count();
            $products = Product::where('status', 'ACTIVE')->count();
            return view('pages/index', compact('coowned','franchise','fullstores','drivethru','kiosks','products'));
        }
        else{
            DB::table('old_gt')->update([
                'oldgt' => DB::raw("REPLACE(REPLACE(oldgt, '\r', ''), '\n', '')")
            ]);
            return redirect('/sales/index');
        }
    }

    public function logs(){
        $role = Role::query()->select()->get()->sortBy('name');
        return view('pages/logs', compact('role'));
    }

    public function index_data(){
        $list = UserLogs::selectRaw('users.id AS user_id, users.name AS username, users.email AS email,
        UPPER(roles.name) AS role, user_logs.activity AS activity, user_logs.created_at AS date,
        DATE_FORMAT(user_logs.created_at, "%b. %d, %Y, %h:%i %p") AS datetime')
            ->join('users', 'users.id', 'user_logs.user_id')
            ->join('roles', 'roles.id', 'users.userlevel')
            ->orderBy('user_logs.id', 'DESC')
            ->get();
        return DataTables::of($list)->make(true);
    }

    public function logs_reload(){
        $logs = UserLogs::select()->count();
        return $logs;
    }

    public function getCities(Request $request)
    {
        $cities = City::query()->where('provCode', $request->provCode)->orderBy('citymunDesc', 'asc')->get();
        return response()->json($cities);
    }

    public function getRegion(Request $request)
    {
        $cities = City::query()->where('citymunCode', $request->citymunCode)->first();
        $region = Region::query()->where('regCode', $cities->regCode)->get();
        return response()->json($region);
    }
}
