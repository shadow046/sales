<?php

namespace App\Http\Controllers;

use DB;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

use App\Models\Dtl;
use App\Models\Hdr;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\StoreArea;
use App\Models\Setup;
use App\Models\DeliveryServingStore;
use App\Models\TransactionType;

class GenerateReportsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function reports(){
        $stores = Store::selectRaw('branch_code AS fcode, branch_name AS desc1')
            ->where('status', 'ACTIVE');
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $stores->whereIn('branch_code', $store_codes);
            }
        $stores = $stores->get()->sortBy('branch_code');
        $products = Product::selectRaw('item_code AS fcode, short_desc AS desc1')
            ->where('status', 'ACTIVE')
            ->get()
            ->sortBy('item_code');
        $combos = Product::selectRaw('item_code AS fcode, short_desc AS desc1')
            ->where('category.enable_combo', 'Y')
            ->where('category.category', '!=', 'PROMO')
            ->join('category', 'category.id', 'products.category')
            ->where('status', 'ACTIVE')
            ->get()
            ->sortBy('item_code');
        $promos = Product::selectRaw('item_code AS fcode, short_desc AS desc1')
            ->where('category.category', '=', 'PROMO')
            ->join('category', 'category.id', 'products.category')
            ->where('status', 'ACTIVE')
            ->get()
            ->sortBy('item_code');
        $transactions = Hdr::select('trantype')
            ->distinct()
            ->whereNotNull('trantype')
            ->where('trantype', '!=', '')
            ->get()
            ->sortBy('trantype');
        $tenders = Hdr::select('tendname')
            ->from(DB::raw('(SELECT tendname1 AS tendname FROM hdr UNION ALL
                            SELECT tendname2 FROM hdr UNION ALL
                            SELECT tendname3 FROM hdr UNION ALL
                            SELECT tendname4 FROM hdr UNION ALL
                            SELECT tendname5 FROM hdr UNION ALL
                            SELECT tendname6 FROM hdr UNION ALL
                            SELECT tendname7 FROM hdr UNION ALL
                            SELECT tendname8 FROM hdr UNION ALL
                            SELECT tendname9 FROM hdr UNION ALL
                            SELECT tendname10 FROM hdr UNION ALL
                            SELECT tendname11 FROM hdr UNION ALL
                            SELECT tendname12 FROM hdr) AS subquery'))
            ->whereNotNull('tendname')
            ->where('tendname', '!=', '')
            ->distinct()
            ->get()
            ->sortBy('tendname');
        $discounts = Hdr::select('discname')
            ->distinct()
            ->whereNotNull('discname')
            ->where('discname', '!=', '')
            ->get()
            ->sortBy('discname');
        return view('pages.generate_reports', compact('stores','products','combos','promos','transactions','tenders','discounts'));
    }

    public function byBranch1(Request $request){
        $data = Hdr::with('store', 'store.company', 'store.storeArea', 'store.type', 'store.group', 'store.subGroup', 'store.network')
            ->select('store.id AS store_id', 'hdr.storecode AS branch_code', 'store.branch_name AS store_name', 'store.setup AS setup',
                DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                'company.company_name AS company_name', 'store_area.id AS store_area_id', 'store_area.store_area AS store_area',
                'store.region AS region', 'type.type AS type', 'group.group AS store_group', 'subgroup.subgroup AS subgroup',
                'network_setup.network_setup AS network_setup', DB::raw('SUM(gross) AS gross_sales'),
                DB::raw('SUM(totalsales) AS total_sales'), DB::raw('SUM(netsales) AS net_sales')
            )
            ->selectRaw('COUNT(DISTINCT tnumber) as tno')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0')
            ->leftJoin('store', 'store.branch_code', 'hdr.storecode')
            ->join('company', 'company.id', 'store.company_name')
            ->join('store_area', 'store_area.id', 'store.store_area')
            ->join('type', 'type.id', 'store.type')
            ->join('group', 'group.id', 'store.group')
            ->join('subgroup', 'subgroup.id', 'store.sub_group')
            ->join('network_setup', 'network_setup.id', 'store.network')
            ->groupBy('store_id', 'hdr.storecode', 'branch_code', 'store_name', 'branch_name', 'company_name',
                'store_area_id', 'store_area', 'region', 'type', 'setup', 'store_group', 'subgroup', 'network_setup');

        if($request->included){
            $data->whereIn('branch_code', $request->included);
        }
        else if(auth()->user()->store != 'X'){
            if(auth()->user()->store == '0'){
                echo(null);
            }
            else{
                $store_codes = array();
                $array = explode("|", auth()->user()->store);
                foreach($array as $value){
                    if(!str_contains($value, '-0')){
                        $user = Store::where('id', $value)->first();
                        array_push($store_codes, $user->branch_code);
                    }
                    else{
                        $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                        $store_codes_add = array_map(function($item){
                            return $item['branch_code'];
                        }, $user_array);
                        $store_codes = array_merge($store_codes, $store_codes_add);
                    }
                }
            }
            $data->whereIn('branch_code', $store_codes);
        }

        $data->orderBy('net_sales', 'DESC');

        $results = $data->get();

        return DataTables::of($results)
            ->addColumn('area_manager', function (Hdr $hdr) {
                $area_managers = User::where('userlevel', '4')
                    ->where(function ($query) use ($hdr) {
                        $query->where('area', '=', $hdr->store_area_id)
                            ->orWhere('area', 'LIKE', $hdr->store_area_id . '-%"')
                            ->orWhere('area', 'LIKE', '%"-' . $hdr->store_area_id)
                            ->orWhere('area', 'LIKE', '%"-' . $hdr->store_area_id . '-%"');
                    })
                    ->get();

                foreach ($area_managers as $area_manager) {
                    if ($area_manager->store == $hdr->store_area_id . '-0' ||
                        substr($area_manager->store, 0, strlen($hdr->store_area_id) + 1) === $hdr->store_area_id . '-0|' ||
                        strpos($area_manager->store, '|' . $hdr->store_area_id . '-0') !== false ||
                        strpos($area_manager->store, '|' . $hdr->store_area_id . '-0|') !== false) {
                        return $area_manager->name;
                    } else if ($area_manager->store == $hdr->store_id ||
                        substr($area_manager->store, 0, strlen($hdr->store_id) + 1) === $hdr->store_area_id . '|' ||
                        strpos($area_manager->store, '|' . $hdr->store_id) !== false ||
                        strpos($area_manager->store, '|' . $hdr->store_id . '|') !== false) {
                        return $area_manager->name;
                    }
                }
            })
            ->make(true);
    }

    public function byBranch(Request $request){
        $data = Hdr::with('store', 'store.company', 'store.storeArea', 'store.type', 'store.group', 'store.subGroup', 'store.network')
        ->select('store.id AS store_id', 'hdr.storecode AS branch_code', 'store.branch_name AS store_name', 'store.setup AS setup',
            DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
            'company.company_name AS company_name', 'store_area.id AS store_area_id', 'store_area.store_area AS store_area',
            'store.region AS region', 'type.type AS type', 'group.group AS store_group', 'subgroup.subgroup AS subgroup',
            'network_setup.network_setup AS network_setup',
            DB::raw('SUM(gross) AS gross_sales'),
            DB::raw('SUM(totalsales) AS total_sales'),
            DB::raw('SUM(netsales) AS net_sales'),
            DB::raw('COUNT(DISTINCT tnumber) as tno'),
            DB::raw('(SELECT users.name FROM users WHERE users.userlevel = "4" AND (
                users.area = store_area.id OR
                users.area LIKE CONCAT(store_area.id, "-%") OR
                users.area LIKE CONCAT("%-", store_area.id) OR
                users.area LIKE CONCAT("%-", store_area.id, "-%") OR
                users.store = CONCAT(store_area.id, "-0") OR
                users.store LIKE CONCAT(store_area.id, "-0|") OR
                users.store LIKE CONCAT("|", store_area.id, "-0") OR
                users.store LIKE CONCAT("|", store_area.id, "-0|") OR
                users.store = store.id OR
                users.store LIKE CONCAT(store_area.id, "|") OR
                users.store LIKE CONCAT("|", store.id) OR
                users.store LIKE CONCAT("|", store.id, "|")
            ) LIMIT 1) AS area_manager')
        )
        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
        ->where('refund', '=', '0')
        ->where('cancelled', '=', '0')
        ->where('void', '=', '0')
        ->leftJoin('store', 'store.branch_code', 'hdr.storecode')
        ->join('company', 'company.id', 'store.company_name')
        ->join('store_area', 'store_area.id', 'store.store_area')
        ->join('type', 'type.id', 'store.type')
        ->join('group', 'group.id', 'store.group')
        ->join('subgroup', 'subgroup.id', 'store.sub_group')
        ->join('network_setup', 'network_setup.id', 'store.network')
        ->groupBy('store_id', 'hdr.storecode', 'branch_code', 'store_name', 'branch_name', 'company_name',
            'store_area_id', 'store_area', 'region', 'type', 'setup', 'store_group', 'subgroup', 'network_setup');

        if($request->included){
            $data->whereIn('branch_code', $request->included);
        }
        else if(auth()->user()->store != 'X'){
            if(auth()->user()->store == '0'){
                echo(null);
            }
            else{
                $store_codes = array();
                $array = explode("|", auth()->user()->store);
                foreach($array as $value){
                    if(!str_contains($value, '-0')){
                        $user = Store::where('id', $value)->first();
                        array_push($store_codes, $user->branch_code);
                    }
                    else{
                        $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                        $store_codes_add = array_map(function($item){
                            return $item['branch_code'];
                        }, $user_array);
                        $store_codes = array_merge($store_codes, $store_codes_add);
                    }
                }
            }
            $data->whereIn('branch_code', $store_codes);
        }

        $data->orderBy('net_sales', 'DESC');

        $results = $data->get();

        return DataTables::of($results)->make(true);
    }

    public function byBranch_Date(Request $request){
        $data = Hdr::selectRaw("(STR_TO_DATE(tdate,'%m/%d/%Y')) AS date")
            ->selectRaw('SUM(gross) AS gross_sales, SUM(totalsales) AS total_sales, SUM(netsales) AS net_sales')
            ->selectRaw('COUNT(DISTINCT tnumber) as tno')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('storecode', $request->colData)
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0')
            ->groupBy('tdate','date')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byBranch_Product(Request $request){
        $data = Dtl::selectRaw('itemcat, itemcode, desc1, desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
            ->where('itemcat', '!=', '')
            ->where('storecode', $request->datacode)
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0')
            ->groupBy('tdate','itemcat','itemcode','desc1','desc2')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byProduct(Request $request){
        if(($request->byWhat == 'combo') || ($request->byWhat == 'promo')){
            $item_code_array = Product::select('item_code')
                ->join('category', 'category.id', 'products.category');
                if($request->byWhat == 'combo'){
                    $item_code_array->where('category.category', '!=', 'PROMO')
                        ->where('category.enable_combo', 'Y');
                }
                if($request->byWhat == 'promo'){
                    $item_code_array->where('category.category', '=', 'PROMO');
                }
                $item_code_array = $item_code_array->get()->toArray();

            $item_codes = array_map(function($item){
                return $item['item_code'];
            }, $item_code_array);
        }

        $data = Dtl::selectRaw('itemcat, itemcode, desc1, desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('itemcat', '!=', '')
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');
            if($request->included){
                $data->whereIn('itemcode', $request->included);
            }
            else if($request->byWhat == 'combo' || $request->byWhat == 'promo'){
                $data->whereIn('itemcode', $item_codes);
            }
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data->groupBy('itemcat','itemcode','desc1','desc2');
            $data->orderBy('quantity', 'DESC');
            $data = $data->get();
        return DataTables::of($data)->make(true);
    }

    public function byProduct_Date(Request $request){
        $data = Dtl::selectRaw("(STR_TO_DATE(tdate,'%m/%d/%Y')) AS date, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales")
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('itemcode', $request->colData)
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0')
            ->where('itemcat', '!=', '');
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data->groupBy('tdate','date');
            $data = $data->get();
        return DataTables::of($data)->make(true);
    }

    public function byProduct_Branch(Request $request){
        $data = Dtl::selectRaw('CONCAT(dtl.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
            ->where('itemcode', $request->datacode)
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0')
            ->leftjoin('store', 'store.branch_code', 'dtl.storecode');
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data->groupBy('dtl.storecode','branch_name');
            $data = $data->get();
        return DataTables::of($data)->make(true);
    }

    public function byTransaction(Request $request){
        $data = Hdr::selectRaw('trantype as transaction_name, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->selectRaw('COUNT(DISTINCT tnumber) as tno')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0');
                if($request->included){
                    $data->whereIn('trantype', $request->included);
                }
                if(auth()->user()->store != 'X'){
                    if(auth()->user()->store == '0'){
                        echo(null);
                    }
                    else{
                        $store_codes = array();
                        $array = explode("|", auth()->user()->store);
                        foreach($array as $value){
                            if(!str_contains($value, '-0')){
                                $user = Store::where('id', $value)->first();
                                array_push($store_codes, $user->branch_code);
                            }
                            else{
                                $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                                $store_codes_add = array_map(function($item){
                                    return $item['branch_code'];
                                }, $user_array);
                                $store_codes = array_merge($store_codes, $store_codes_add);
                            }
                        }
                    }
                    $data->whereIn('storecode', $store_codes);
                }
                $data = $data->groupBy('transaction_name')
                    ->orderBy('net_sales', 'DESC')
                    ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTransaction_Date(Request $request){
        $data = Hdr::selectRaw("(STR_TO_DATE(tdate,'%m/%d/%Y')) AS date")
            ->selectRaw('SUM(gross) AS gross_sales, SUM(totalsales) AS total_sales, SUM(netsales) AS net_sales')
            ->selectRaw('COUNT(DISTINCT tnumber) as tno')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('trantype', $request->colData)
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->groupBy('tdate','date')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTransaction_Product(Request $request){
        $data = Dtl::selectRaw('itemcat, itemcode, desc1, desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
            ->where('trantype', $request->datacode)
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->groupBy('tdate','itemcat','itemcode','desc1','desc2')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTender(Request $request){
        $store_array = Store::get()->toArray();
        $store_codes_all = array_map(function($item){
            return $item['branch_code'];
        }, $store_array);

        $store_codes = array();
        if(auth()->user()->store != 'X'){
            if(auth()->user()->store == '0'){
                echo(null);
            }
            else{
                $array = explode("|", auth()->user()->store);
                foreach($array as $value){
                    if(!str_contains($value, '-0')){
                        $user = Store::where('id', $value)->first();
                        array_push($store_codes, $user->branch_code);
                    }
                    else{
                        $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                        $store_codes_add = array_map(function($item){
                            return $item['branch_code'];
                        }, $user_array);
                        $store_codes = array_merge($store_codes, $store_codes_add);
                    }
                }
            }
        }
        else{
            $store_codes = $store_codes_all;
        }
        $store_codes_final = array_diff($store_codes_all, $store_codes);

        $data = Hdr::select('temp.tendname', DB::raw('SUM(temp.tendamnt) as total'))
            ->selectRaw('COUNT(DISTINCT temp.tnumber) as tno')
            ->from(function($query) use($request, $store_codes_final){
                $query->select(
                    'tendname1 AS tendname', 'tendamnt1 AS tendamnt', 'tnumber AS tnumber'
                )
                ->from('hdr')
                ->where('tendname1', '!=', '')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0')
                ->whereNotIn('storecode', $store_codes_final)
                ->unionAll(
                    DB::table('hdr')->select('tendname2', 'tendamnt2', 'tnumber')
                        ->where('tendname2', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname3', 'tendamnt3', 'tnumber')
                        ->where('tendname3', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname4', 'tendamnt4', 'tnumber')
                        ->where('tendname4', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname5', 'tendamnt5', 'tnumber')
                        ->where('tendname5', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname6', 'tendamnt6', 'tnumber')
                        ->where('tendname6', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname7', 'tendamnt7', 'tnumber')
                        ->where('tendname7', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname8', 'tendamnt8', 'tnumber')
                        ->where('tendname8', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname9', 'tendamnt9', 'tnumber')
                        ->where('tendname9', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname10', 'tendamnt10', 'tnumber')
                        ->where('tendname10', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname11', 'tendamnt11', 'tnumber')
                        ->where('tendname11', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname12', 'tendamnt12', 'tnumber')
                        ->where('tendname12', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                );
            }, 'temp')
            ->groupBy('temp.tendname');
            if($request->included){
                $data->whereIn('tendname', $request->included);
            }
            $data->get();
        return DataTables::of($data)->make(true);
    }

    public function byTender_Date(Request $request){
        $store_array = Store::get()->toArray();
        $store_codes_all = array_map(function($item){
            return $item['branch_code'];
        }, $store_array);

        $store_codes = array();
        if(auth()->user()->store != 'X'){
            if(auth()->user()->store == '0'){
                echo(null);
            }
            else{
                $array = explode("|", auth()->user()->store);
                foreach($array as $value){
                    if(!str_contains($value, '-0')){
                        $user = Store::where('id', $value)->first();
                        array_push($store_codes, $user->branch_code);
                    }
                    else{
                        $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                        $store_codes_add = array_map(function($item){
                            return $item['branch_code'];
                        }, $user_array);
                        $store_codes = array_merge($store_codes, $store_codes_add);
                    }
                }
            }
        }
        else{
            $store_codes = $store_codes_all;
        }
        $store_codes_final = array_diff($store_codes_all, $store_codes);

        $data = Hdr::select('temp.tdate', 'temp.tendname', DB::raw('SUM(temp.tendamnt) as total'))
            ->selectRaw('COUNT(DISTINCT temp.tnumber) as tno')
            ->from(function($query) use($request, $store_codes_final){
                $query->select(
                    DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                    'tendname1 AS tendname', 'tendamnt1 AS tendamnt', 'tnumber AS tnumber'
                )
                ->from('hdr')
                ->where('tendname1', '!=', '')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0')
                ->whereNotIn('storecode', $store_codes_final)
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname2', 'tendamnt2', 'tnumber')
                        ->where('tendname2', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname3', 'tendamnt3', 'tnumber')
                        ->where('tendname3', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname4', 'tendamnt4', 'tnumber')
                        ->where('tendname4', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname5', 'tendamnt5', 'tnumber')
                        ->where('tendname5', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname6', 'tendamnt6', 'tnumber')
                        ->where('tendname6', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname7', 'tendamnt7', 'tnumber')
                        ->where('tendname7', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname8', 'tendamnt8', 'tnumber')
                        ->where('tendname8', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname9', 'tendamnt9', 'tnumber')
                        ->where('tendname9', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname10', 'tendamnt10', 'tnumber')
                        ->where('tendname10', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname11', 'tendamnt11', 'tnumber')
                        ->where('tendname11', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname12', 'tendamnt12', 'tnumber')
                        ->where('tendname12', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                );
            }, 'temp')
            ->where('tendname', $request->colData)
            ->groupBy('temp.tdate', 'temp.tendname')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTender_Branch(Request $request){
        $store_array = Store::get()->toArray();
        $store_codes_all = array_map(function($item){
            return $item['branch_code'];
        }, $store_array);

        $store_codes = array();
        if(auth()->user()->store != 'X'){
            if(auth()->user()->store == '0'){
                echo(null);
            }
            else{
                $array = explode("|", auth()->user()->store);
                foreach($array as $value){
                    if(!str_contains($value, '-0')){
                        $user = Store::where('id', $value)->first();
                        array_push($store_codes, $user->branch_code);
                    }
                    else{
                        $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                        $store_codes_add = array_map(function($item){
                            return $item['branch_code'];
                        }, $user_array);
                        $store_codes = array_merge($store_codes, $store_codes_add);
                    }
                }
            }
        }
        else{
            $store_codes = $store_codes_all;
        }
        $store_codes_final = array_diff($store_codes_all, $store_codes);

        $data = Hdr::select('temp.branch_name', 'temp.tendname', DB::raw('SUM(temp.tendamnt) as total'))
            ->selectRaw('COUNT(DISTINCT temp.tnumber) as tno')
            ->from(function($query) use($request, $store_codes_final){
                $query->select(
                    DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                    'tendname1 AS tendname', 'tendamnt1 AS tendamnt', 'tnumber AS tnumber'
                )
                ->from('hdr')
                ->where('tendname1', '!=', '')
                ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0')
                ->whereNotIn('storecode', $store_codes_final)
                ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname2', 'tendamnt2', 'tnumber')
                        ->where('tendname2', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname3', 'tendamnt3', 'tnumber')
                        ->where('tendname3', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname4', 'tendamnt4', 'tnumber')
                        ->where('tendname4', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname5', 'tendamnt5', 'tnumber')
                        ->where('tendname5', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname6', 'tendamnt6', 'tnumber')
                        ->where('tendname6', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname7', 'tendamnt7', 'tnumber')
                        ->where('tendname7', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname8', 'tendamnt8', 'tnumber')
                        ->where('tendname8', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname9', 'tendamnt9', 'tnumber')
                        ->where('tendname9', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname10', 'tendamnt10', 'tnumber')
                        ->where('tendname10', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname11', 'tendamnt11', 'tnumber')
                        ->where('tendname11', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname12', 'tendamnt12', 'tnumber')
                        ->where('tendname12', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->where('refund', '=', '0')
                        ->where('cancelled', '=', '0')
                        ->where('void', '=', '0')
                        ->whereNotIn('storecode', $store_codes_final)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                );
            }, 'temp')
            ->where('tendname', $request->datacode)
            ->groupBy('temp.branch_name','temp.tendname')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byDiscount(Request $request){
        $data = Hdr::selectRaw('discname as discount_name, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->selectRaw('COUNT(DISTINCT tnumber) as tno')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->where('discname', '!=', '')
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0');
                if($request->included){
                    $data->whereIn('discname', $request->included);
                }
                if(auth()->user()->store != 'X'){
                    if(auth()->user()->store == '0'){
                        echo(null);
                    }
                    else{
                        $store_codes = array();
                        $array = explode("|", auth()->user()->store);
                        foreach($array as $value){
                            if(!str_contains($value, '-0')){
                                $user = Store::where('id', $value)->first();
                                array_push($store_codes, $user->branch_code);
                            }
                            else{
                                $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                                $store_codes_add = array_map(function($item){
                                    return $item['branch_code'];
                                }, $user_array);
                                $store_codes = array_merge($store_codes, $store_codes_add);
                            }
                        }
                    }
                    $data->whereIn('storecode', $store_codes);
                }
                $data = $data->groupBy('discount_name')
                    ->orderBy('net_sales', 'DESC')
                    ->get();
        return DataTables::of($data)->make(true);
    }

    public function byDiscount_Date(Request $request){//
        $data = Hdr::selectRaw("(STR_TO_DATE(tdate,'%m/%d/%Y')) AS date")
            ->selectRaw('SUM(gross) AS gross_sales, SUM(totalsales) AS total_sales, SUM(netsales) AS net_sales')
            ->selectRaw('COUNT(DISTINCT tnumber) as tno')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('discname', $request->colData)
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->groupBy('tdate','date')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byDiscount_Branch(Request $request){
        $data = Hdr::selectRaw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name,
            SUM(gross) AS gross_sales, SUM(totalsales) AS total_sales, SUM(netsales) AS net_sales')
            ->selectRaw('COUNT(DISTINCT tnumber) as tno')
            ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
            ->where('discname', $request->datacode)
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->leftjoin('store', 'store.branch_code', 'hdr.storecode')
            ->groupBy('hdr.storecode','branch_name')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function bySubBranchA1(Request $request){
        $data = Hdr::with('store', 'store.company', 'store.storeArea', 'store.type', 'store.group', 'store.subGroup', 'store.network')
            ->select('store.id AS store_id', 'hdr.storecode AS branch_code', 'store.branch_name AS store_name', 'store.setup AS setup',
                DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                'company.company_name AS company_name', 'store_area.id AS store_area_id', 'store_area.store_area AS store_area',
                'store.region AS region', 'type.type AS type', 'group.group AS store_group', 'subgroup.subgroup AS subgroup',
                'network_setup.network_setup AS network_setup', DB::raw('SUM(gross) AS gross_sales'),
                DB::raw('SUM(totalsales) AS total_sales'), DB::raw('SUM(netsales) AS net_sales')
            )
            ->selectRaw('COUNT(DISTINCT tnumber) as tno')
            ->where($request->tblType, $request->datacode)
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->leftJoin('store', 'store.branch_code', 'hdr.storecode')
            ->join('company', 'company.id', 'store.company_name')
            ->join('store_area', 'store_area.id', 'store.store_area')
            ->join('type', 'type.id', 'store.type')
            ->join('group', 'group.id', 'store.group')
            ->join('subgroup', 'subgroup.id', 'store.sub_group')
            ->join('network_setup', 'network_setup.id', 'store.network')
            ->groupBy('store_id', 'hdr.storecode', 'branch_code', 'store_name', 'branch_name', 'company_name',
                'store_area_id', 'store_area', 'region', 'type', 'setup', 'store_group', 'subgroup', 'network_setup')
            ->orderBy('net_sales', 'DESC')
            ->get();

        return DataTables::of($data)
            ->addColumn('area_manager', function (Hdr $hdr) {
                $area_managers = User::where('userlevel', '4')
                    ->where(function ($query) use ($hdr) {
                        $query->where('area', '=', $hdr->store_area_id)
                            ->orWhere('area', 'LIKE', $hdr->store_area_id . '-%"')
                            ->orWhere('area', 'LIKE', '%"-' . $hdr->store_area_id)
                            ->orWhere('area', 'LIKE', '%"-' . $hdr->store_area_id . '-%"');
                    })
                    ->get();

                foreach ($area_managers as $area_manager) {
                    if ($area_manager->store == $hdr->store_area_id . '-0' ||
                        substr($area_manager->store, 0, strlen($hdr->store_area_id) + 1) === $hdr->store_area_id . '-0|' ||
                        strpos($area_manager->store, '|' . $hdr->store_area_id . '-0') !== false ||
                        strpos($area_manager->store, '|' . $hdr->store_area_id . '-0|') !== false) {
                        return $area_manager->name;
                    } else if ($area_manager->store == $hdr->store_id ||
                        substr($area_manager->store, 0, strlen($hdr->store_id) + 1) === $hdr->store_area_id . '|' ||
                        strpos($area_manager->store, '|' . $hdr->store_id) !== false ||
                        strpos($area_manager->store, '|' . $hdr->store_id . '|') !== false) {
                        return $area_manager->name;
                    }
                }
            })
            ->make(true);
    }

    public function bySubBranchA(Request $request){
        $data = Hdr::with('store', 'store.company', 'store.storeArea', 'store.type', 'store.group', 'store.subGroup', 'store.network')
                ->select('store.id AS store_id', 'hdr.storecode AS branch_code', 'store.branch_name AS store_name', 'store.setup AS setup',
                    DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                    'company.company_name AS company_name', 'store_area.id AS store_area_id', 'store_area.store_area AS store_area',
                    'store.region AS region', 'type.type AS type', 'group.group AS store_group', 'subgroup.subgroup AS subgroup',
                    'network_setup.network_setup AS network_setup', DB::raw('SUM(gross) AS gross_sales'),
                    DB::raw('SUM(totalsales) AS total_sales'), DB::raw('SUM(netsales) AS net_sales'),
                    DB::raw('COUNT(DISTINCT tnumber) as tno'),
                    DB::raw('(SELECT users.name FROM users WHERE users.userlevel = "4" AND (
                        users.area = store_area.id OR
                        users.area LIKE CONCAT(store_area.id, "-%") OR
                        users.area LIKE CONCAT("%-", store_area.id) OR
                        users.area LIKE CONCAT("%-", store_area.id, "-%") OR
                        users.store = CONCAT(store_area.id, "-0") OR
                        users.store LIKE CONCAT(store_area.id, "-0|") OR
                        users.store LIKE CONCAT("|", store_area.id, "-0") OR
                        users.store LIKE CONCAT("|", store_area.id, "-0|") OR
                        users.store = store.id OR
                        users.store LIKE CONCAT(store_area.id, "|") OR
                        users.store LIKE CONCAT("|", store.id) OR
                        users.store LIKE CONCAT("|", store.id, "|")
                    ) LIMIT 1) AS area_manager')
                )
                ->leftJoin('store', 'store.branch_code', 'hdr.storecode')
                ->join('company', 'company.id', 'store.company_name')
                ->join('store_area', 'store_area.id', 'store.store_area')
                ->join('type', 'type.id', 'store.type')
                ->join('group', 'group.id', 'store.group')
                ->join('subgroup', 'subgroup.id', 'store.sub_group')
                ->join('network_setup', 'network_setup.id', 'store.network')
                ->where($request->tblType, $request->datacode)
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0')
                ->groupBy('store_id', 'hdr.storecode', 'branch_code', 'store_name', 'branch_name', 'company_name',
                    'store_area_id', 'store_area', 'region', 'type', 'setup', 'store_group', 'subgroup', 'network_setup')
                ->orderBy('net_sales', 'DESC')
                ->get();

            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }

        return DataTables::of($data)->make(true);
    }

    public function bySubBranchB1(Request $request){
        $data = Dtl::with('store', 'store.company', 'store.storeArea', 'store.type', 'store.group', 'store.subGroup', 'store.network')
            ->select('store.id AS store_id', 'dtl.storecode AS branch_code', 'store.branch_name AS store_name', 'store.setup AS setup',
                DB::raw('CONCAT(dtl.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                'company.company_name AS company_name', 'store_area.id AS store_area_id', 'store_area.store_area AS store_area',
                'store.region AS region', 'type.type AS type', 'group.group AS store_group', 'subgroup.subgroup AS subgroup',
                'network_setup.network_setup AS network_setup', DB::raw('SUM(qty) AS quantity'), DB::raw('SUM(unitprice * qty) AS gross_sales'),
            )
            ->where($request->tblType, $request->datacode)
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->leftJoin('store', 'store.branch_code', 'dtl.storecode')
            ->join('company', 'company.id', 'store.company_name')
            ->join('store_area', 'store_area.id', 'store.store_area')
            ->join('type', 'type.id', 'store.type')
            ->join('group', 'group.id', 'store.group')
            ->join('subgroup', 'subgroup.id', 'store.sub_group')
            ->join('network_setup', 'network_setup.id', 'store.network')
            ->groupBy('store_id', 'dtl.storecode', 'branch_code', 'store_name', 'branch_name', 'company_name',
                'store_area_id', 'store_area', 'region', 'type', 'setup', 'store_group', 'subgroup', 'network_setup')
            ->orderBy('quantity', 'DESC')
            ->get();

        return DataTables::of($data)
            ->addColumn('area_manager', function (Dtl $hdr) {
                $area_managers = User::where('userlevel', '4')
                    ->where(function ($query) use ($hdr) {
                        $query->where('area', '=', $hdr->store_area_id)
                            ->orWhere('area', 'LIKE', $hdr->store_area_id . '-%"')
                            ->orWhere('area', 'LIKE', '%"-' . $hdr->store_area_id)
                            ->orWhere('area', 'LIKE', '%"-' . $hdr->store_area_id . '-%"');
                    })
                    ->get();

                foreach ($area_managers as $area_manager) {
                    if ($area_manager->store == $hdr->store_area_id . '-0' ||
                        substr($area_manager->store, 0, strlen($hdr->store_area_id) + 1) === $hdr->store_area_id . '-0|' ||
                        strpos($area_manager->store, '|' . $hdr->store_area_id . '-0') !== false ||
                        strpos($area_manager->store, '|' . $hdr->store_area_id . '-0|') !== false) {
                        return $area_manager->name;
                    } else if ($area_manager->store == $hdr->store_id ||
                        substr($area_manager->store, 0, strlen($hdr->store_id) + 1) === $hdr->store_area_id . '|' ||
                        strpos($area_manager->store, '|' . $hdr->store_id) !== false ||
                        strpos($area_manager->store, '|' . $hdr->store_id . '|') !== false) {
                        return $area_manager->name;
                    }
                }
            })
            ->make(true);
    }

    public function bySubBranchB(Request $request){
        // return 'error';
        $data = Dtl::with('store', 'store.company', 'store.storeArea', 'store.type', 'store.group', 'store.subGroup', 'store.network')
                ->select('store.id AS store_id', 'dtl.storecode AS branch_code', 'store.branch_name AS store_name', 'store.setup AS setup',
                    DB::raw('CONCAT(dtl.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                    'company.company_name AS company_name', 'store_area.id AS store_area_id', 'store_area.store_area AS store_area',
                    'store.region AS region', 'type.type AS type', 'group.group AS store_group', 'subgroup.subgroup AS subgroup',
                    'network_setup.network_setup AS network_setup', DB::raw('SUM(qty) AS quantity'), DB::raw('SUM(unitprice * qty) AS gross_sales'),
                    DB::raw('(SELECT users.name FROM users WHERE users.userlevel = "4" AND (
                        users.area = store_area.id OR
                        users.area LIKE CONCAT(store_area.id, "-%") OR
                        users.area LIKE CONCAT("%-", store_area.id) OR
                        users.area LIKE CONCAT("%-", store_area.id, "-%") OR
                        users.store = CONCAT(store_area.id, "-0") OR
                        users.store LIKE CONCAT(store_area.id, "-0|") OR
                        users.store LIKE CONCAT("|", store_area.id, "-0") OR
                        users.store LIKE CONCAT("|", store_area.id, "-0|") OR
                        users.store = store.id OR
                        users.store LIKE CONCAT(store_area.id, "|") OR
                        users.store LIKE CONCAT("|", store.id) OR
                        users.store LIKE CONCAT("|", store.id, "|")
                    ) LIMIT 1) AS area_manager')
                )
                ->leftJoin('store', 'store.branch_code', 'dtl.storecode')
                ->join('company', 'company.id', 'store.company_name')
                ->join('store_area', 'store_area.id', 'store.store_area')
                ->join('type', 'type.id', 'store.type')
                ->join('group', 'group.id', 'store.group')
                ->join('subgroup', 'subgroup.id', 'store.sub_group')
                ->join('network_setup', 'network_setup.id', 'store.network')
                ->where($request->tblType, $request->datacode)
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0')
                ->groupBy('store_id', 'dtl.storecode', 'branch_code', 'store_name', 'branch_name', 'company_name',
                    'store_area_id', 'store_area', 'region', 'type', 'setup', 'store_group', 'subgroup', 'network_setup')
                ->orderBy('quantity', 'DESC')
                ->get();
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }

        return DataTables::of($data)->make(true);
    }

    public function bySubProduct(Request $request){
        $data = Dtl::selectRaw('itemcat, itemcode, desc1, desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->where($request->tblType, $request->datacode)
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('itemcat', '!=', '')
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data->groupBy('itemcat','itemcode','desc1','desc2');
            $data->orderBy('quantity', 'DESC');
            $data = $data->get();
        return DataTables::of($data)->make(true);
    }

    public function bySubTransactionA(Request $request){
        $data = Hdr::selectRaw('trantype as transaction_name, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->selectRaw('COUNT(DISTINCT tnumber) as tno')
                ->where($request->tblType, $request->datacode)
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0');
                if(auth()->user()->store != 'X'){
                    if(auth()->user()->store == '0'){
                        echo(null);
                    }
                    else{
                        $store_codes = array();
                        $array = explode("|", auth()->user()->store);
                        foreach($array as $value){
                            if(!str_contains($value, '-0')){
                                $user = Store::where('id', $value)->first();
                                array_push($store_codes, $user->branch_code);
                            }
                            else{
                                $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                                $store_codes_add = array_map(function($item){
                                    return $item['branch_code'];
                                }, $user_array);
                                $store_codes = array_merge($store_codes, $store_codes_add);
                            }
                        }
                    }
                    $data->whereIn('storecode', $store_codes);
                }
                $data = $data->groupBy('transaction_name')
                    ->orderBy('net_sales', 'DESC')
                    ->get();
        return DataTables::of($data)->make(true);
    }

    public function bySubTransactionB(Request $request){
        $data = Dtl::selectRaw('trantype as transaction_name, SUM(qty) as quantity, SUM(unitprice * qty) as gross_sales')
                ->where($request->tblType, $request->datacode)
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0');
                if(auth()->user()->store != 'X'){
                    if(auth()->user()->store == '0'){
                        echo(null);
                    }
                    else{
                        $store_codes = array();
                        $array = explode("|", auth()->user()->store);
                        foreach($array as $value){
                            if(!str_contains($value, '-0')){
                                $user = Store::where('id', $value)->first();
                                array_push($store_codes, $user->branch_code);
                            }
                            else{
                                $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                                $store_codes_add = array_map(function($item){
                                    return $item['branch_code'];
                                }, $user_array);
                                $store_codes = array_merge($store_codes, $store_codes_add);
                            }
                        }
                    }
                    $data->whereIn('storecode', $store_codes);
                }
                $data = $data->groupBy('transaction_name')
                    ->orderBy('quantity', 'DESC')
                    ->get();
        return DataTables::of($data)->make(true);
    }

    public function bySubTimeA(Request $request){
        $data = collect();
        for($i = 0; $i < 24; $i++){
            $start_hour = sprintf("%02d:00:00", $i);
            $end_hour = sprintf("%02d:59:59", $i);
            $hour_range_12hr = date('h:i A', strtotime($start_hour)) . ' - ' . date('h:i A', strtotime($end_hour));
            $hour_range_24hr = date('H:i', strtotime($start_hour)) . ' - ' . date('H:i', strtotime($end_hour));
            $result = Hdr::selectRaw("'".$hour_range_24hr."' as time_range_24hr")
                ->selectRaw("'".$hour_range_12hr."' as time_range_12hr")
                ->selectRaw('COALESCE(SUM(gross), 0) AS gross_sales, COALESCE(SUM(totalsales), 0) AS total_sales, COALESCE(SUM(netsales), 0) AS net_sales')
                ->selectRaw('COUNT(DISTINCT tnumber) as tno')
                ->where($request->tblType, $request->datacode)
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->whereTime('ttime', '>=', $start_hour)
                ->whereTime('ttime', '<=', $end_hour)
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0');
                if(auth()->user()->store != 'X'){
                    if(auth()->user()->store == '0'){
                        echo(null);
                    }
                    else{
                        $store_codes = array();
                        $array = explode("|", auth()->user()->store);
                        foreach($array as $value){
                            if(!str_contains($value, '-0')){
                                $user = Store::where('id', $value)->first();
                                array_push($store_codes, $user->branch_code);
                            }
                            else{
                                $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                                $store_codes_add = array_map(function($item){
                                    return $item['branch_code'];
                                }, $user_array);
                                $store_codes = array_merge($store_codes, $store_codes_add);
                            }
                        }
                    }
                    $result->whereIn('storecode', $store_codes);
                }
                $result = $result->first();
            if(!$result){
                $result = (object)[
                    'time_range_12hr' => $hour_range_12hr,
                    'time_range_24hr' => $hour_range_24hr,
                    'gross_sales' => 0,
                    'total_sales' => 0,
                    'net_sales' => 0,
                    'tno' => 0,
                ];
            }
            if($result->gross_sales > 0){
                $data->push($result);
            }
        }
        return DataTables::of($data)->make(true);
    }

    public function bySubTimeB(Request $request){
        $data = collect();
        for($i = 0; $i < 24; $i++){
            $start_hour = sprintf("%02d:00:00", $i);
            $end_hour = sprintf("%02d:59:59", $i);
            $hour_range_12hr = date('h:i A', strtotime($start_hour)) . ' - ' . date('h:i A', strtotime($end_hour));
            $hour_range_24hr = date('H:i', strtotime($start_hour)) . ' - ' . date('H:i', strtotime($end_hour));
            $result = Dtl::selectRaw("'".$hour_range_24hr."' as time_range_24hr")
                ->selectRaw("'".$hour_range_12hr."' as time_range_12hr")
                ->selectRaw('COALESCE(SUM(qty), 0) AS quantity, COALESCE(SUM(unitprice * qty), 0) AS gross_sales')
                ->selectRaw('COUNT(DISTINCT tnumber) as tno')
                ->where($request->tblType, $request->datacode)
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->whereTime('ttime', '>=', $start_hour)
                ->whereTime('ttime', '<=', $end_hour)
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0');
                if(auth()->user()->store != 'X'){
                    if(auth()->user()->store == '0'){
                        echo(null);
                    }
                    else{
                        $store_codes = array();
                        $array = explode("|", auth()->user()->store);
                        foreach($array as $value){
                            if(!str_contains($value, '-0')){
                                $user = Store::where('id', $value)->first();
                                array_push($store_codes, $user->branch_code);
                            }
                            else{
                                $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                                $store_codes_add = array_map(function($item){
                                    return $item['branch_code'];
                                }, $user_array);
                                $store_codes = array_merge($store_codes, $store_codes_add);
                            }
                        }
                    }
                    $result->whereIn('storecode', $store_codes);
                }
                $result = $result->first();
            if(!$result){
                $result = (object)[
                    'time_range_12hr' => $hour_range_12hr,
                    'time_range_24hr' => $hour_range_24hr,
                    'quantity' => 0,
                    'gross_sales' => 0,
                    'tno' => 0,
                ];
            }
            if($result->gross_sales > 0){
                $data->push($result);
            }
        }
        return DataTables::of($data)->make(true);
    }

    public function byTimeA(Request $request){
        $data = collect();
        for($i = 0; $i < 24; $i++){
            $start_hour = sprintf("%02d:00:00", $i);
            $end_hour = sprintf("%02d:59:59", $i);
            $hour_range_12hr = date('h:i A', strtotime($start_hour)) . ' - ' . date('h:i A', strtotime($end_hour));
            $hour_range_24hr = date('H:i', strtotime($start_hour)) . ' - ' . date('H:i', strtotime($end_hour));
            $result = Hdr::selectRaw("'".$hour_range_24hr."' as time_range_24hr")
                ->selectRaw("'".$hour_range_12hr."' as time_range_12hr")
                ->selectRaw('COALESCE(SUM(gross), 0) AS gross_sales, COALESCE(SUM(totalsales), 0) AS total_sales, COALESCE(SUM(netsales), 0) AS net_sales')
                ->selectRaw('COUNT(DISTINCT tnumber) as tno')
                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                ->where($request->tblType, $request->colData)
                ->whereTime('ttime', '>=', $start_hour)
                ->whereTime('ttime', '<=', $end_hour)
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0');
                if(auth()->user()->store != 'X'){
                    if(auth()->user()->store == '0'){
                        echo(null);
                    }
                    else{
                        $store_codes = array();
                        $array = explode("|", auth()->user()->store);
                        foreach($array as $value){
                            if(!str_contains($value, '-0')){
                                $user = Store::where('id', $value)->first();
                                array_push($store_codes, $user->branch_code);
                            }
                            else{
                                $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                                $store_codes_add = array_map(function($item){
                                    return $item['branch_code'];
                                }, $user_array);
                                $store_codes = array_merge($store_codes, $store_codes_add);
                            }
                        }
                    }
                    $result->whereIn('storecode', $store_codes);
                }
                $result = $result->first();
            if(!$result){
                $result = (object)[
                    'time_range_12hr' => $hour_range_12hr,
                    'time_range_24hr' => $hour_range_24hr,
                    'gross_sales' => 0,
                    'total_sales' => 0,
                    'net_sales' => 0,
                    'tno' => 0,
                ];
            }
            if($result->gross_sales > 0){
                $data->push($result);
            }
        }
        return DataTables::of($data)->make(true);
    }

    public function byTimeB(Request $request){
        $data = collect();
        for($i = 0; $i < 24; $i++){
            $start_hour = sprintf("%02d:00:00", $i);
            $end_hour = sprintf("%02d:59:59", $i);
            $hour_range_12hr = date('h:i A', strtotime($start_hour)) . ' - ' . date('h:i A', strtotime($end_hour));
            $hour_range_24hr = date('H:i', strtotime($start_hour)) . ' - ' . date('H:i', strtotime($end_hour));
            $result = Dtl::selectRaw("'".$hour_range_24hr."' as time_range_24hr")
                ->selectRaw("'".$hour_range_12hr."' as time_range_12hr")
                ->selectRaw('COALESCE(SUM(qty), 0) AS quantity, COALESCE(SUM(unitprice * qty), 0) AS gross_sales')
                ->selectRaw('COUNT(DISTINCT tnumber) as tno')
                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                ->where($request->tblType, $request->colData)
                ->whereTime('ttime', '>=', $start_hour)
                ->whereTime('ttime', '<=', $end_hour)
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0');
                if(auth()->user()->store != 'X'){
                    if(auth()->user()->store == '0'){
                        echo(null);
                    }
                    else{
                        $store_codes = array();
                        $array = explode("|", auth()->user()->store);
                        foreach($array as $value){
                            if(!str_contains($value, '-0')){
                                $user = Store::where('id', $value)->first();
                                array_push($store_codes, $user->branch_code);
                            }
                            else{
                                $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                                $store_codes_add = array_map(function($item){
                                    return $item['branch_code'];
                                }, $user_array);
                                $store_codes = array_merge($store_codes, $store_codes_add);
                            }
                        }
                    }
                    $result->whereIn('storecode', $store_codes);
                }
                $result = $result->first();
            if(!$result){
                $result = (object)[
                    'time_range_12hr' => $hour_range_12hr,
                    'time_range_24hr' => $hour_range_24hr,
                    'quantity' => 0,
                    'gross_sales' => 0,
                    'tno' => 0,
                ];
            }
            if($result->gross_sales > 0){
                $data->push($result);
            }
        }
        return DataTables::of($data)->make(true);
    }

    public function byTimeC(Request $request){
        $store_array = Store::get()->toArray();
        $store_codes_all = array_map(function($item){
            return $item['branch_code'];
        }, $store_array);

        $store_codes = array();
        if(auth()->user()->store != 'X'){
            if(auth()->user()->store == '0'){
                echo(null);
            }
            else{
                $array = explode("|", auth()->user()->store);
                foreach($array as $value){
                    if(!str_contains($value, '-0')){
                        $user = Store::where('id', $value)->first();
                        array_push($store_codes, $user->branch_code);
                    }
                    else{
                        $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                        $store_codes_add = array_map(function($item){
                            return $item['branch_code'];
                        }, $user_array);
                        $store_codes = array_merge($store_codes, $store_codes_add);
                    }
                }
            }
        }
        else{
            $store_codes = $store_codes_all;
        }
        $store_codes_final = array_diff($store_codes_all, $store_codes);

        $data = collect();
        for($i = 0; $i < 24; $i++){
            $start_hour = sprintf("%02d:00:00", $i);
            $end_hour = sprintf("%02d:59:59", $i);
            $hour_range_12hr = date('h:i A', strtotime($start_hour)) . ' - ' . date('h:i A', strtotime($end_hour));
            $hour_range_24hr = date('H:i', strtotime($start_hour)) . ' - ' . date('H:i', strtotime($end_hour));
            $result = Hdr::selectRaw("'".$hour_range_24hr."' as time_range_24hr")
                ->selectRaw("'".$hour_range_12hr."' as time_range_12hr")
                ->selectRaw('COUNT(DISTINCT t.tnumber) as tno')
                ->selectRaw('COALESCE(SUM(t.tendamnt), 0) as total')
                ->from(function ($query) use ($request, $store_codes_final, $start_hour, $end_hour) {
                    $query->select('tendname1 as tendname', 'tendamnt1 as tendamnt', 'tnumber as tnumber')
                          ->from('hdr')
                          ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                          ->whereTime('ttime', '>=', $start_hour)
                          ->whereTime('ttime', '<=', $end_hour)
                          ->where('tendname1', '=', $request->colData)
                          ->where('refund', '=', '0')
                          ->where('cancelled', '=', '0')
                          ->where('void', '=', '0')
                          ->whereNotIn('storecode', $store_codes_final)
                          ->unionAll(
                            Hdr::select('tendname2 as tendname', 'tendamnt2 as tendamnt', 'tnumber')
                                ->where('tendname2', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                                ->where('refund', '=', '0')
                                ->where('cancelled', '=', '0')
                                ->where('void', '=', '0')
                                ->whereNotIn('storecode', $store_codes_final)
                          )
                          ->unionAll(
                            Hdr::select('tendname3 as tendname', 'tendamnt3 as tendamnt', 'tnumber')
                                ->where('tendname3', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                                ->where('refund', '=', '0')
                                ->where('cancelled', '=', '0')
                                ->where('void', '=', '0')
                                ->whereNotIn('storecode', $store_codes_final)
                          )
                          ->unionAll(
                            Hdr::select('tendname4 as tendname', 'tendamnt4 as tendamnt', 'tnumber')
                                ->where('tendname4', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                                ->where('refund', '=', '0')
                                ->where('cancelled', '=', '0')
                                ->where('void', '=', '0')
                                ->whereNotIn('storecode', $store_codes_final)
                          )
                          ->unionAll(
                            Hdr::select('tendname5 as tendname', 'tendamnt5 as tendamnt', 'tnumber')
                                ->where('tendname5', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                                ->where('refund', '=', '0')
                                ->where('cancelled', '=', '0')
                                ->where('void', '=', '0')
                                ->whereNotIn('storecode', $store_codes_final)
                          )
                          ->unionAll(
                            Hdr::select('tendname6 as tendname', 'tendamnt6 as tendamnt', 'tnumber')
                                ->where('tendname6', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                                ->where('refund', '=', '0')
                                ->where('cancelled', '=', '0')
                                ->where('void', '=', '0')
                                ->whereNotIn('storecode', $store_codes_final)
                          )
                          ->unionAll(
                            Hdr::select('tendname7 as tendname', 'tendamnt7 as tendamnt', 'tnumber')
                                ->where('tendname7', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                                ->where('refund', '=', '0')
                                ->where('cancelled', '=', '0')
                                ->where('void', '=', '0')
                                ->whereNotIn('storecode', $store_codes_final)
                          )
                          ->unionAll(
                            Hdr::select('tendname8 as tendname', 'tendamnt8 as tendamnt', 'tnumber')
                                ->where('tendname8', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                                ->where('refund', '=', '0')
                                ->where('cancelled', '=', '0')
                                ->where('void', '=', '0')
                                ->whereNotIn('storecode', $store_codes_final)
                          )
                          ->unionAll(
                            Hdr::select('tendname9 as tendname', 'tendamnt9 as tendamnt', 'tnumber')
                                ->where('tendname9', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                                ->where('refund', '=', '0')
                                ->where('cancelled', '=', '0')
                                ->where('void', '=', '0')
                                ->whereNotIn('storecode', $store_codes_final)
                          )
                          ->unionAll(
                            Hdr::select('tendname10 as tendname', 'tendamnt10 as tendamnt', 'tnumber')
                                ->where('tendname10', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                                ->where('refund', '=', '0')
                                ->where('cancelled', '=', '0')
                                ->where('void', '=', '0')
                                ->whereNotIn('storecode', $store_codes_final)
                          )
                          ->unionAll(
                            Hdr::select('tendname11 as tendname', 'tendamnt11 as tendamnt', 'tnumber')
                                ->where('tendname11', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                                ->where('refund', '=', '0')
                                ->where('cancelled', '=', '0')
                                ->where('void', '=', '0')
                                ->whereNotIn('storecode', $store_codes_final)
                          )
                          ->unionAll(
                            Hdr::select('tendname12 as tendname', 'tendamnt12 as tendamnt', 'tnumber')
                                ->where('tendname12', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                                ->where('refund', '=', '0')
                                ->where('cancelled', '=', '0')
                                ->where('void', '=', '0')
                                ->whereNotIn('storecode', $store_codes_final)
                          );
                }, 't')
                ->first();
            if(!$result){
                $result = (object)[
                    'time_range_12hr' => $hour_range_12hr,
                    'time_range_24hr' => $hour_range_24hr,
                    'total' => 0
                ];
            }
            if($result->total > 0){
                $data->push($result);
            }
        }
        return DataTables::of($data)->make(true);
    }

    public function byDateTimeA(Request $request){
        $tnumber_array = Hdr::select('tnumber')
            ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
            ->whereTime('ttime', '>=', $request->start_hour)
            ->whereTime('ttime', '<=', $request->end_hour.':59')
            ->where($request->tblType, $request->datacode)
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $tnumber_array->whereIn('storecode', $store_codes);
            }
            $tnumber_array = $tnumber_array->get()
            ->toArray();
        $tnumbers = array_map(function($a){
            return $a['tnumber'];
        }, $tnumber_array);
        $data = Dtl::selectRaw('itemcat, itemcode, desc1, desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->whereIn('tnumber', $tnumber_array)
            ->groupBy('tdate','itemcat','itemcode','desc1','desc2')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTransactionA(Request $request){
        $data = Hdr::selectRaw("(STR_TO_DATE(tdate,'%m/%d/%Y')) AS date, ttime, tnumber AS transcode")
            ->selectRaw('SUM(gross) AS gross_sales, SUM(totalsales) AS total_sales, SUM(netsales) AS net_sales')
            ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
            ->whereTime('ttime', '>=', $request->start_hour)
            ->whereTime('ttime', '<=', $request->end_hour.':59')
            ->where($request->tblType, $request->colData)
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->groupBy('tdate','date','ttime','transcode')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTransactionDetails(Request $request){
        $data = Dtl::selectRaw('itemcat, itemcode, desc1, desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->where('tnumber', $request->transcode)
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0')
            ->groupBy('tdate','itemcat','itemcode','desc1','desc2')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byDayBranch(Request $request){
        if($request->sales_type == 'NO. OF TRANSACTIONS'){
            $func = 'COUNT(DISTINCT ';
            $sales = 'tnumber';
        }
        if($request->sales_type == 'GROSS SALES'){
            $func = 'SUM(';
            $sales = 'gross';
        }
        if($request->sales_type == 'TOTAL SALES'){
            $func = 'SUM(';
            $sales = 'totalsales';
        }
        if($request->sales_type == 'NET SALES'){
            $func = 'SUM(';
            $sales = 'netsales';
        }
        $data = Hdr::selectRaw('hdr.storecode AS branch_code, store.branch_name AS store_name, CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name')
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 1 THEN ".$sales." ELSE 0 END) AS sunday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 2 THEN ".$sales." ELSE 0 END) AS monday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 3 THEN ".$sales." ELSE 0 END) AS tuesday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 4 THEN ".$sales." ELSE 0 END) AS wednesday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 5 THEN ".$sales." ELSE 0 END) AS thursday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 6 THEN ".$sales." ELSE 0 END) AS friday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 7 THEN ".$sales." ELSE 0 END) AS saturday_sales")
            ->selectRaw("".$func."".$sales.") AS total_sales")
            ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');

            if($request->included){
                $data->whereIn('branch_code', $request->included);
            }
            else if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('branch_code', $store_codes);
            }

            $data = $data->groupBy('hdr.storecode','branch_code','store_name','branch_name')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byDayProduct(Request $request){
        if($request->sales_type == 'SALES QUANTITY'){
            $sales = 'qty';
        }
        if($request->sales_type == 'SALES AMOUNT'){
            $sales = 'unitprice * qty';
        }
        $data = Dtl::selectRaw('itemcode AS product_code, desc1 AS product_name')
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 1 THEN ".$sales." ELSE 0 END) AS sunday_sales")
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 2 THEN ".$sales." ELSE 0 END) AS monday_sales")
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 3 THEN ".$sales." ELSE 0 END) AS tuesday_sales")
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 4 THEN ".$sales." ELSE 0 END) AS wednesday_sales")
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 5 THEN ".$sales." ELSE 0 END) AS thursday_sales")
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 6 THEN ".$sales." ELSE 0 END) AS friday_sales")
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 7 THEN ".$sales." ELSE 0 END) AS saturday_sales")
            ->selectRaw("SUM(".$sales.") AS total_sales")
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');

            if($request->included){
                $data->whereIn('itemcode', $request->included);
            }

            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->groupBy('product_code','product_name')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byDayTransaction(Request $request){
        if($request->sales_type == 'NO. OF TRANSACTIONS'){
            $func = 'COUNT(DISTINCT ';
            $sales = 'tnumber';
        }
        if($request->sales_type == 'GROSS SALES'){
            $func = 'SUM(';
            $sales = 'gross';
        }
        if($request->sales_type == 'TOTAL SALES'){
            $func = 'SUM(';
            $sales = 'totalsales';
        }
        if($request->sales_type == 'NET SALES'){
            $func = 'SUM(';
            $sales = 'netsales';
        }
        $data = Hdr::selectRaw('trantype')
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 1 THEN ".$sales." ELSE 0 END) AS sunday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 2 THEN ".$sales." ELSE 0 END) AS monday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 3 THEN ".$sales." ELSE 0 END) AS tuesday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 4 THEN ".$sales." ELSE 0 END) AS wednesday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 5 THEN ".$sales." ELSE 0 END) AS thursday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 6 THEN ".$sales." ELSE 0 END) AS friday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 7 THEN ".$sales." ELSE 0 END) AS saturday_sales")
            ->selectRaw("".$func."".$sales.") AS total_sales")
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');

            if($request->included){
                $data->whereIn('trantype', $request->included);
            }

            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->groupBy('trantype')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byDayDiscount(Request $request){
        if($request->sales_type == 'NO. OF TRANSACTIONS'){
            $func = 'COUNT(DISTINCT ';
            $sales = 'tnumber';
        }
        if($request->sales_type == 'GROSS SALES'){
            $func = 'SUM(';
            $sales = 'gross';
        }
        if($request->sales_type == 'TOTAL SALES'){
            $func = 'SUM(';
            $sales = 'totalsales';
        }
        if($request->sales_type == 'NET SALES'){
            $func = 'SUM(';
            $sales = 'netsales';
        }
        $data = Hdr::selectRaw('discname AS discount_name')
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 1 THEN ".$sales." ELSE 0 END) AS sunday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 2 THEN ".$sales." ELSE 0 END) AS monday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 3 THEN ".$sales." ELSE 0 END) AS tuesday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 4 THEN ".$sales." ELSE 0 END) AS wednesday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 5 THEN ".$sales." ELSE 0 END) AS thursday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 6 THEN ".$sales." ELSE 0 END) AS friday_sales")
            ->selectRaw("".$func."CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 7 THEN ".$sales." ELSE 0 END) AS saturday_sales")
            ->selectRaw("".$func."".$sales.") AS total_sales")
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('discname', '!=', '')
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');

            if($request->included){
                $data->whereIn('discname', $request->included);
            }

            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->groupBy('discount_name')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTimeBranch(Request $request){
        if($request->sales_type == 'NO. OF TRANSACTIONS'){
            $func = 'COUNT(DISTINCT ';
            $sales = 'tnumber';
        }
        if($request->sales_type == 'GROSS SALES'){
            $func = 'SUM(';
            $sales = 'gross';
        }
        if($request->sales_type == 'TOTAL SALES'){
            $func = 'SUM(';
            $sales = 'totalsales';
        }
        if($request->sales_type == 'NET SALES'){
            $func = 'SUM(';
            $sales = 'netsales';
        }
        $data = Hdr::selectRaw('hdr.storecode AS branch_code, store.branch_name AS store_name, CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name')
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 0 THEN ".$sales." ELSE 0 END) AS sales0")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 1 THEN ".$sales." ELSE 0 END) AS sales1")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 2 THEN ".$sales." ELSE 0 END) AS sales2")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 3 THEN ".$sales." ELSE 0 END) AS sales3")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 4 THEN ".$sales." ELSE 0 END) AS sales4")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 5 THEN ".$sales." ELSE 0 END) AS sales5")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 6 THEN ".$sales." ELSE 0 END) AS sales6")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 7 THEN ".$sales." ELSE 0 END) AS sales7")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 8 THEN ".$sales." ELSE 0 END) AS sales8")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 9 THEN ".$sales." ELSE 0 END) AS sales9")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 10 THEN ".$sales." ELSE 0 END) AS sales10")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 11 THEN ".$sales." ELSE 0 END) AS sales11")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 12 THEN ".$sales." ELSE 0 END) AS sales12")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 13 THEN ".$sales." ELSE 0 END) AS sales13")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 14 THEN ".$sales." ELSE 0 END) AS sales14")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 15 THEN ".$sales." ELSE 0 END) AS sales15")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 16 THEN ".$sales." ELSE 0 END) AS sales16")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 17 THEN ".$sales." ELSE 0 END) AS sales17")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 18 THEN ".$sales." ELSE 0 END) AS sales18")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 19 THEN ".$sales." ELSE 0 END) AS sales19")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 20 THEN ".$sales." ELSE 0 END) AS sales20")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 21 THEN ".$sales." ELSE 0 END) AS sales21")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 22 THEN ".$sales." ELSE 0 END) AS sales22")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 23 THEN ".$sales." ELSE 0 END) AS sales23")
            ->selectRaw("".$func."".$sales.") AS total_sales")
            ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');

            if($request->included){
                $data->whereIn('branch_code', $request->included);
            }
            else if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('branch_code', $store_codes);
            }

            $data = $data->groupBy('hdr.storecode','branch_code','store_name','branch_name')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTimeProduct(Request $request){//
        if($request->sales_type == 'SALES QUANTITY'){
            $sales = 'qty';
        }
        if($request->sales_type == 'SALES AMOUNT'){
            $sales = 'unitprice * qty';
        }
        $data = Dtl::selectRaw('itemcode AS product_code, desc1 AS product_name')
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 0 THEN ".$sales." ELSE 0 END) AS sales0")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 1 THEN ".$sales." ELSE 0 END) AS sales1")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 2 THEN ".$sales." ELSE 0 END) AS sales2")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 3 THEN ".$sales." ELSE 0 END) AS sales3")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 4 THEN ".$sales." ELSE 0 END) AS sales4")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 5 THEN ".$sales." ELSE 0 END) AS sales5")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 6 THEN ".$sales." ELSE 0 END) AS sales6")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 7 THEN ".$sales." ELSE 0 END) AS sales7")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 8 THEN ".$sales." ELSE 0 END) AS sales8")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 9 THEN ".$sales." ELSE 0 END) AS sales9")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 10 THEN ".$sales." ELSE 0 END) AS sales10")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 11 THEN ".$sales." ELSE 0 END) AS sales11")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 12 THEN ".$sales." ELSE 0 END) AS sales12")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 13 THEN ".$sales." ELSE 0 END) AS sales13")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 14 THEN ".$sales." ELSE 0 END) AS sales14")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 15 THEN ".$sales." ELSE 0 END) AS sales15")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 16 THEN ".$sales." ELSE 0 END) AS sales16")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 17 THEN ".$sales." ELSE 0 END) AS sales17")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 18 THEN ".$sales." ELSE 0 END) AS sales18")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 19 THEN ".$sales." ELSE 0 END) AS sales19")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 20 THEN ".$sales." ELSE 0 END) AS sales20")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 21 THEN ".$sales." ELSE 0 END) AS sales21")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 22 THEN ".$sales." ELSE 0 END) AS sales22")
            ->selectRaw("SUM(CASE WHEN HOUR(ttime) = 23 THEN ".$sales." ELSE 0 END) AS sales23")
            ->selectRaw("SUM(".$sales.") AS total_sales")
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');

            if($request->included){
                $data->whereIn('itemcode', $request->included);
            }

            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->groupBy('product_code','product_name')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTimeTransaction(Request $request){
        if($request->sales_type == 'NO. OF TRANSACTIONS'){
            $func = 'COUNT(DISTINCT ';
            $sales = 'tnumber';
        }
        if($request->sales_type == 'GROSS SALES'){
            $func = 'SUM(';
            $sales = 'gross';
        }
        if($request->sales_type == 'TOTAL SALES'){
            $func = 'SUM(';
            $sales = 'totalsales';
        }
        if($request->sales_type == 'NET SALES'){
            $func = 'SUM(';
            $sales = 'netsales';
        }
        $data = Hdr::selectRaw('trantype')
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 0 THEN ".$sales." ELSE 0 END) AS sales0")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 1 THEN ".$sales." ELSE 0 END) AS sales1")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 2 THEN ".$sales." ELSE 0 END) AS sales2")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 3 THEN ".$sales." ELSE 0 END) AS sales3")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 4 THEN ".$sales." ELSE 0 END) AS sales4")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 5 THEN ".$sales." ELSE 0 END) AS sales5")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 6 THEN ".$sales." ELSE 0 END) AS sales6")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 7 THEN ".$sales." ELSE 0 END) AS sales7")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 8 THEN ".$sales." ELSE 0 END) AS sales8")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 9 THEN ".$sales." ELSE 0 END) AS sales9")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 10 THEN ".$sales." ELSE 0 END) AS sales10")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 11 THEN ".$sales." ELSE 0 END) AS sales11")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 12 THEN ".$sales." ELSE 0 END) AS sales12")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 13 THEN ".$sales." ELSE 0 END) AS sales13")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 14 THEN ".$sales." ELSE 0 END) AS sales14")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 15 THEN ".$sales." ELSE 0 END) AS sales15")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 16 THEN ".$sales." ELSE 0 END) AS sales16")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 17 THEN ".$sales." ELSE 0 END) AS sales17")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 18 THEN ".$sales." ELSE 0 END) AS sales18")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 19 THEN ".$sales." ELSE 0 END) AS sales19")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 20 THEN ".$sales." ELSE 0 END) AS sales20")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 21 THEN ".$sales." ELSE 0 END) AS sales21")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 22 THEN ".$sales." ELSE 0 END) AS sales22")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 23 THEN ".$sales." ELSE 0 END) AS sales23")
            ->selectRaw("".$func."".$sales.") AS total_sales")
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');

            if($request->included){
                $data->whereIn('trantype', $request->included);
            }
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->groupBy('trantype')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTimeDiscount(Request $request){
        if($request->sales_type == 'NO. OF TRANSACTIONS'){
            $func = 'COUNT(DISTINCT ';
            $sales = 'tnumber';
        }
        if($request->sales_type == 'GROSS SALES'){
            $func = 'SUM(';
            $sales = 'gross';
        }
        if($request->sales_type == 'TOTAL SALES'){
            $func = 'SUM(';
            $sales = 'totalsales';
        }
        if($request->sales_type == 'NET SALES'){
            $func = 'SUM(';
            $sales = 'netsales';
        }
        $data = Hdr::selectRaw('discname AS discount_name')
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 0 THEN ".$sales." ELSE 0 END) AS sales0")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 1 THEN ".$sales." ELSE 0 END) AS sales1")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 2 THEN ".$sales." ELSE 0 END) AS sales2")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 3 THEN ".$sales." ELSE 0 END) AS sales3")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 4 THEN ".$sales." ELSE 0 END) AS sales4")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 5 THEN ".$sales." ELSE 0 END) AS sales5")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 6 THEN ".$sales." ELSE 0 END) AS sales6")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 7 THEN ".$sales." ELSE 0 END) AS sales7")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 8 THEN ".$sales." ELSE 0 END) AS sales8")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 9 THEN ".$sales." ELSE 0 END) AS sales9")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 10 THEN ".$sales." ELSE 0 END) AS sales10")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 11 THEN ".$sales." ELSE 0 END) AS sales11")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 12 THEN ".$sales." ELSE 0 END) AS sales12")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 13 THEN ".$sales." ELSE 0 END) AS sales13")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 14 THEN ".$sales." ELSE 0 END) AS sales14")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 15 THEN ".$sales." ELSE 0 END) AS sales15")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 16 THEN ".$sales." ELSE 0 END) AS sales16")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 17 THEN ".$sales." ELSE 0 END) AS sales17")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 18 THEN ".$sales." ELSE 0 END) AS sales18")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 19 THEN ".$sales." ELSE 0 END) AS sales19")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 20 THEN ".$sales." ELSE 0 END) AS sales20")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 21 THEN ".$sales." ELSE 0 END) AS sales21")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 22 THEN ".$sales." ELSE 0 END) AS sales22")
            ->selectRaw("".$func."CASE WHEN HOUR(ttime) = 23 THEN ".$sales." ELSE 0 END) AS sales23")
            ->selectRaw("".$func."".$sales.") AS total_sales")
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('discname', '!=', '')
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');

            if($request->included){
                $data->whereIn('discname', $request->included);
            }
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $data->whereIn('storecode', $store_codes);
            }
            $data = $data->groupBy('discount_name')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTransBranch1(Request $request){
        if($request->sales_type == 'NO. OF TRANSACTIONS'){
            $func = 'COUNT(DISTINCT ';
            $sales = 'tnumber';
        }
        if($request->sales_type == 'GROSS SALES'){
            $func = 'SUM(';
            $sales = 'gross';
        }
        if($request->sales_type == 'TOTAL SALES'){
            $func = 'SUM(';
            $sales = 'totalsales';
        }
        if($request->sales_type == 'NET SALES'){
            $func = 'SUM(';
            $sales = 'netsales';
        }
        $data = Hdr::with('store', 'store.company', 'store.storeArea', 'store.type', 'store.group', 'store.subGroup', 'store.network')
            ->select('store.id AS store_id', 'hdr.storecode AS branch_code', 'store.branch_name AS store_name', 'store.setup AS setup',
                DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                'company.company_name AS company_name', 'store_area.id AS store_area_id', 'store_area.store_area AS store_area',
                'store.region AS region', 'type.type AS type', 'group.group AS store_group', 'subgroup.subgroup AS subgroup',
                'network_setup.network_setup AS network_setup'
            )
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0')
            ->leftJoin('store', 'store.branch_code', 'hdr.storecode')
            ->join('company', 'company.id', 'store.company_name')
            ->join('store_area', 'store_area.id', 'store.store_area')
            ->join('type', 'type.id', 'store.type')
            ->join('group', 'group.id', 'store.group')
            ->join('subgroup', 'subgroup.id', 'store.sub_group')
            ->join('network_setup', 'network_setup.id', 'store.network')
            ->groupBy('store_id', 'hdr.storecode', 'branch_code', 'store_name', 'branch_name', 'company_name',
                'store_area_id', 'store_area', 'region', 'type', 'setup', 'store_group', 'subgroup', 'network_setup');

        if($request->included != ['ALL']){
            $data->whereIn('branch_code', $request->included);
        }
        else if(auth()->user()->store != 'X'){
            if(auth()->user()->store == '0'){
                echo(null);
            }
            else{
                $store_codes = array();
                $array = explode("|", auth()->user()->store);
                foreach($array as $value){
                    if(!str_contains($value, '-0')){
                        $user = Store::where('id', $value)->first();
                        array_push($store_codes, $user->branch_code);
                    }
                    else{
                        $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                        $store_codes_add = array_map(function($item){
                            return $item['branch_code'];
                        }, $user_array);
                        $store_codes = array_merge($store_codes, $store_codes_add);
                    }
                }
            }
            $data->whereIn('branch_code', $store_codes);
        }

        foreach($request->tblcolumns as $column){
            $columnKey = strtolower(preg_replace('/[^A-Za-z0-9_]/', '_', $column));
            $data->selectRaw("".$func."CASE WHEN trantype = '".$column."' THEN ".$sales." ELSE 0 END) AS $columnKey");
        }

        $data->orderBy('store_name', 'ASC');

        $results = $data->get();

        return DataTables::of($results)
            ->addColumn('area_manager', function (Hdr $hdr) {
                $area_managers = User::where('userlevel', '4')
                    ->where(function ($query) use ($hdr) {
                        $query->where('area', '=', $hdr->store_area_id)
                            ->orWhere('area', 'LIKE', $hdr->store_area_id . '-%"')
                            ->orWhere('area', 'LIKE', '%"-' . $hdr->store_area_id)
                            ->orWhere('area', 'LIKE', '%"-' . $hdr->store_area_id . '-%"');
                    })
                    ->get();

                foreach ($area_managers as $area_manager) {
                    if ($area_manager->store == $hdr->store_area_id . '-0' ||
                        substr($area_manager->store, 0, strlen($hdr->store_area_id) + 1) === $hdr->store_area_id . '-0|' ||
                        strpos($area_manager->store, '|' . $hdr->store_area_id . '-0') !== false ||
                        strpos($area_manager->store, '|' . $hdr->store_area_id . '-0|') !== false) {
                        return $area_manager->name;
                    } else if ($area_manager->store == $hdr->store_id ||
                        substr($area_manager->store, 0, strlen($hdr->store_id) + 1) === $hdr->store_area_id . '|' ||
                        strpos($area_manager->store, '|' . $hdr->store_id) !== false ||
                        strpos($area_manager->store, '|' . $hdr->store_id . '|') !== false) {
                        return $area_manager->name;
                    }
                }
            })
            ->make(true);
    }

    public function byTransBranch(Request $request){
        if($request->sales_type == 'NO. OF TRANSACTIONS'){
            $func = 'COUNT(DISTINCT ';
            $sales = 'tnumber';
        }
        if($request->sales_type == 'GROSS SALES'){
            $func = 'SUM(';
            $sales = 'gross';
        }
        if($request->sales_type == 'TOTAL SALES'){
            $func = 'SUM(';
            $sales = 'totalsales';
        }
        if($request->sales_type == 'NET SALES'){
            $func = 'SUM(';
            $sales = 'netsales';
        }
        $data = Hdr::with('store', 'store.company', 'store.storeArea', 'store.type', 'store.group', 'store.subGroup', 'store.network')
            ->select('store.id AS store_id', 'hdr.storecode AS branch_code', 'store.branch_name AS store_name', 'store.setup AS setup',
                DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                'company.company_name AS company_name', 'store_area.id AS store_area_id', 'store_area.store_area AS store_area',
                'store.region AS region', 'type.type AS type', 'group.group AS store_group', 'subgroup.subgroup AS subgroup',
                'network_setup.network_setup AS network_setup',
                DB::raw('(SELECT users.name FROM users WHERE users.userlevel = "4" AND (
                    users.area = store_area.id OR
                    users.area LIKE CONCAT(store_area.id, "-%") OR
                    users.area LIKE CONCAT("%-", store_area.id) OR
                    users.area LIKE CONCAT("%-", store_area.id, "-%") OR
                    users.store = CONCAT(store_area.id, "-0") OR
                    users.store LIKE CONCAT(store_area.id, "-0|") OR
                    users.store LIKE CONCAT("|", store_area.id, "-0") OR
                    users.store LIKE CONCAT("|", store_area.id, "-0|") OR
                    users.store = store.id OR
                    users.store LIKE CONCAT(store_area.id, "|") OR
                    users.store LIKE CONCAT("|", store.id) OR
                    users.store LIKE CONCAT("|", store.id, "|")
                ) LIMIT 1) AS area_manager'))
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0')
                ->leftJoin('store', 'store.branch_code', 'hdr.storecode')
                ->join('company', 'company.id', 'store.company_name')
                ->join('store_area', 'store_area.id', 'store.store_area')
                ->join('type', 'type.id', 'store.type')
                ->join('group', 'group.id', 'store.group')
                ->join('subgroup', 'subgroup.id', 'store.sub_group')
                ->join('network_setup', 'network_setup.id', 'store.network')
                ->groupBy('store_id', 'hdr.storecode', 'branch_code', 'store_name', 'branch_name', 'company_name',
                    'store_area_id', 'store_area', 'region', 'type', 'setup', 'store_group', 'subgroup', 'network_setup');

        if($request->included != ['ALL']){
            $data->whereIn('branch_code', $request->included);
        }
        else if(auth()->user()->store != 'X'){
            if(auth()->user()->store == '0'){
                echo(null);
            }
            else{
                $store_codes = array();
                $array = explode("|", auth()->user()->store);
                foreach($array as $value){
                    if(!str_contains($value, '-0')){
                        $user = Store::where('id', $value)->first();
                        array_push($store_codes, $user->branch_code);
                    }
                    else{
                        $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                        $store_codes_add = array_map(function($item){
                            return $item['branch_code'];
                        }, $user_array);
                        $store_codes = array_merge($store_codes, $store_codes_add);
                    }
                }
            }
            $data->whereIn('branch_code', $store_codes);
        }

        foreach($request->tblcolumns as $column){
            $columnKey = strtolower(preg_replace('/[^A-Za-z0-9_]/', '_', $column));
            $data->selectRaw("".$func."CASE WHEN trantype = '".$column."' THEN ".$sales." ELSE 0 END) AS $columnKey");
        }

        $data->orderBy('store_name', 'ASC');

        $results = $data->get();

        return DataTables::of($results)->make(true);
    }

    public function byTransProduct(Request $request){
        if($request->sales_type == 'SALES QUANTITY'){
            $sales = 'qty';
        }
        if($request->sales_type == 'SALES AMOUNT'){
            $sales = 'unitprice * qty';
        }
        $products = Dtl::selectRaw('itemcat, itemcode, desc1, desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->selectRaw('products.setup, products.area, products.store')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->join('products', 'products.item_code', 'dtl.itemcode')
            ->join('category','category.id','products.category')
            ->where('itemcat', '!=', '')
            ->where('refund', '=', '0')
            ->where('cancelled', '=', '0')
            ->where('void', '=', '0');
            if($request->included != ['ALL']){
                $products->whereIn('itemcode', $request->included);
            }
            if(auth()->user()->store != 'X'){
                if(auth()->user()->store == '0'){
                    echo(null);
                }
                else{
                    $store_codes = array();
                    $array = explode("|", auth()->user()->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            array_push($store_codes, $user->branch_code);
                        }
                        else{
                            $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                            $store_codes_add = array_map(function($item){
                                return $item['branch_code'];
                            }, $user_array);
                            $store_codes = array_merge($store_codes, $store_codes_add);
                        }
                    }
                }
                $products->whereIn('storecode', $store_codes);
            }
            $products->groupBy('itemcat','itemcode','desc1','desc2','setup','area','store');
            foreach($request->tblcolumns as $column){
                $columnKey = strtolower(preg_replace('/[^A-Za-z0-9_]/', '_', $column));
                $products->selectRaw("SUM(CASE WHEN trantype = '".$column."' THEN ".$sales." ELSE 0 END) AS $columnKey");
            }
            $products->orderBy('quantity', 'DESC');
            $products = $products->get();
        return DataTables::of($products)
            ->addColumn('setup_name', function(Dtl $products){
                if(!$products->setup){
                    return '';
                }
                else{
                    $setup_row = '';
                    $array = explode(",", $products->setup);
                    foreach($array as $value){
                        $setup = Setup::where('id', $value)->first();
                        if($setup_row != ''){
                            $setup_row = $setup_row.', '.$setup->setup;
                        }
                        else{
                            $setup_row = $setup->setup;
                        }
                    }
                    return $setup_row;
                }
            })
            ->addColumn('area_name', function(Dtl $products){
                if(!$products->area){
                    return 'NONE';
                }
                else{
                    $user_row = '';
                    $array = explode("|", $products->area);
                    foreach($array as $value){
                        if($value == '-1'){
                            $user_row = 'ALL';
                        }
                        else{
                            $user = StoreArea::where('id', $value)->first();
                            if($user_row != ''){
                                $user_row = $user_row.'|'.$user->store_area;
                            }
                            else{
                                $user_row = $user->store_area;
                            }
                        }
                    }
                    return $user_row;
                }
            })
            ->addColumn('store_name', function(Dtl $products){
                if(!$products->store){
                    return 'NONE';
                }
                else{
                    $user_row = '';
                    $array = explode("|", $products->store);
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            if($user_row != ''){
                                $user_row = $user_row.'|'.$user->branch_code.': '.$user->branch_name;
                            }
                            else{
                                $user_row = $user->branch_code.': '.$user->branch_name;
                            }
                        }
                        else{
                            $user = StoreArea::where('id', substr($value, 0, -2))->first();
                            if($user_row != ''){
                                $user_row = $user_row.'|'.$user->store_area.' (ALL BRANCHES)';
                            }
                            else{
                                $user_row = $user->store_area.' (ALL BRANCHES)';
                            }
                        }
                    }
                    return $user_row;
                }
            })
        ->make(true);
    }

    public function byTransDiscount(Request $request){
        if($request->sales_type == 'NO. OF TRANSACTIONS'){
            $func = 'COUNT(DISTINCT ';
            $sales = 'tnumber';
        }
        if($request->sales_type == 'GROSS SALES'){
            $func = 'SUM(';
            $sales = 'gross';
        }
        if($request->sales_type == 'TOTAL SALES'){
            $func = 'SUM(';
            $sales = 'totalsales';
        }
        if($request->sales_type == 'NET SALES'){
            $func = 'SUM(';
            $sales = 'netsales';
        }
        $data = Hdr::selectRaw('discname as discount_name')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->where('discname', '!=', '')
                ->where('refund', '=', '0')
                ->where('cancelled', '=', '0')
                ->where('void', '=', '0');
                if($request->included != ['ALL']){
                    $data->whereIn('discname', $request->included);
                }
                if(auth()->user()->store != 'X'){
                    if(auth()->user()->store == '0'){
                        echo(null);
                    }
                    else{
                        $store_codes = array();
                        $array = explode("|", auth()->user()->store);
                        foreach($array as $value){
                            if(!str_contains($value, '-0')){
                                $user = Store::where('id', $value)->first();
                                array_push($store_codes, $user->branch_code);
                            }
                            else{
                                $user_array = Store::where('store_area', substr($value, 0, -2))->get()->toArray();
                                $store_codes_add = array_map(function($item){
                                    return $item['branch_code'];
                                }, $user_array);
                                $store_codes = array_merge($store_codes, $store_codes_add);
                            }
                        }
                    }
                    $data->whereIn('storecode', $store_codes);
                }
                $data = $data->groupBy('discount_name');

                foreach($request->tblcolumns as $column){
                    $columnKey = strtolower(preg_replace('/[^A-Za-z0-9_]/', '_', $column));
                    $data->selectRaw("".$func."CASE WHEN trantype = '".$column."' THEN ".$sales." ELSE 0 END) AS $columnKey");
                }
                $data->orderBy('discount_name', 'DESC');
                $results = $data->get();
        return DataTables::of($results)->make(true);
    }

    public function byReference(Request $request){
        if(strpos($request->datatype, 'TRANSACTION') !== false || $request->datatype == 'DISCOUNT' || $request->datatype == 'VOID' || $request->datatype == 'CANCELLED' || $request->datatype == 'REFUND'){
            $data = Hdr::select(DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'))
                    ->leftJoin('store', 'store.branch_code', 'hdr.storecode')
                    ->where('tnumber', $request->tnumber)
                    ->first()
                    ->branch_name;
            return $data;
        }
        else{
            $data = Hdr::select('trantype')
                    ->where('tnumber', $request->tnumber)
                    ->first()
                    ->trantype;
            return $data;
        }
    }

    public function getStoreSetup(){
        return Setup::select('id', 'setup')->get();
    }
}