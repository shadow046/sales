<?php

namespace App\Http\Controllers;

use DB;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

use App\Models\Dtl;
use App\Models\Hdr;
use App\Models\User;
use App\Models\Product;
use App\Models\Store;
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
            ->where('status', 'ACTIVE')
            ->get()
            ->sortBy('branch_code');
        $products = Product::selectRaw('item_code AS fcode, short_desc AS desc1')
            ->where('category.enable_combo', 'N')
            ->where('category.category', '!=', 'PROMO')
            ->join('category', 'category.id', 'products.category')
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
        return view('pages.generate_reports', compact('stores','products','combos','promos'));
    }

    public function byBranch(Request $request){
        $data = Hdr::selectRaw('store.id AS store_id, hdr.storecode AS branch_code, CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name,
            company.company_name AS company_name, store_area.id AS store_area_id, store_area.store_area AS store_area, store.region AS region,
            type.type AS type, group.group AS store_group, subgroup.subgroup AS subgroup, network_setup.network_setup AS network_setup,
            SUM(gross) AS gross_sales, SUM(totalsales) AS total_sales, SUM(netsales) AS net_sales')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
            ->join('company', 'company.id', 'store.company_name')
            ->join('store_area', 'store_area.id', 'store.store_area')
            ->join('type', 'type.id', 'store.type')
            ->join('group', 'group.id', 'store.group')
            ->join('subgroup', 'subgroup.id', 'store.sub_group')
            ->join('network_setup', 'network_setup.id', 'store.network')
            ->groupBy('store_id','hdr.storecode','branch_code','branch_name','company_name','store_area_id','store_area','region','type','store_group','subgroup','network_setup');
            if($request->included){
                $data->whereIn('branch_code', $request->included);
            }
            $data->orderBy('net_sales', 'DESC');
        return DataTables::of($data)
        ->addColumn('area_manager', function(Hdr $hdr){
            $area_managers = User::where('userlevel', '4')
                ->orWhere('area', '=', $hdr->store_area_id)
                ->orWhere('area', 'LIKE', $hdr->store_area_id.'-"%')
                ->orWhere('area', 'LIKE', '%-"'.$hdr->store_area_id)
                ->orWhere('area', 'LIKE', '%-"'.$hdr->store_area_id.'-"%')
                ->get();
            foreach($area_managers as $area_manager){
                if($area_manager->store == $hdr->store_area_id.'-0'){
                    return $area_manager->name;
                }
                else if(substr($area_manager->store, 0, strlen($hdr->store_area_id)+1) === $hdr->store_area_id.'-0|'){
                    return $area_manager->name;
                }
                else if(strpos($area_manager->store, '|'.$hdr->store_area_id.'-0') !== false){
                    return $area_manager->name;
                }
                else if(strpos($area_manager->store, '|'.$hdr->store_area_id.'-0|') !== false){
                    return $area_manager->name;
                }

                else if($area_manager->store == $hdr->store_id){
                    return $area_manager->name;
                }
                else if(substr($area_manager->store, 0, strlen($hdr->store_id)+1) === $hdr->store_area_id.'|'){
                    return $area_manager->name;
                }
                else if(strpos($area_manager->store, '|'.$hdr->store_id) !== false){
                    return $area_manager->name;
                }
                else if(strpos($area_manager->store, '|'.$hdr->store_id.'|') !== false){
                    return $area_manager->name;
                }
            }
        })
        ->make(true);
    }

    public function byBranch_Date(Request $request){
        $data = Hdr::selectRaw("(STR_TO_DATE(tdate,'%m/%d/%Y')) AS date")
            ->selectRaw('SUM(gross) AS gross_sales, SUM(totalsales) AS total_sales, SUM(netsales) AS net_sales')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('storecode', $request->colData)
            ->groupBy('tdate','date')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byBranch_Time(Request $request){
        $data = collect();
        for($i = 0; $i < 24; $i++){
            $start_hour = sprintf("%02d:00:00", $i);
            $end_hour = sprintf("%02d:59:59", $i);
            $hour_range_12hr = date('h:i A', strtotime($start_hour)) . ' - ' . date('h:i A', strtotime($end_hour));
            $hour_range_24hr = date('H:i', strtotime($start_hour)) . ' - ' . date('H:i', strtotime($end_hour));
            $result = Hdr::selectRaw("'".$hour_range_24hr."' as time_range_24hr")
                ->selectRaw("'".$hour_range_12hr."' as time_range_12hr")
                ->selectRaw('COALESCE(SUM(gross), 0) AS gross_sales, COALESCE(SUM(totalsales), 0) AS total_sales, COALESCE(SUM(netsales), 0) AS net_sales')
                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                ->where('storecode', $request->colData)
                ->whereTime('ttime', '>=', $start_hour)
                ->whereTime('ttime', '<=', $end_hour)
                ->first();
            if(!$result){
                $result = (object)[
                    'time_range_12hr' => $hour_range_12hr,
                    'time_range_24hr' => $hour_range_24hr,
                    'gross_sales' => 0,
                    'total_sales' => 0,
                    'net_sales' => 0,
                ];
            }
            $data->push($result);
        }
        return DataTables::of($data)->make(true);
    }

    public function byBranch_Product(Request $request){
        $data = Dtl::selectRaw('category.category AS itemcat, itemcode AS itemcode, short_desc AS desc1, long_desc AS desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
            ->where('itemcat', '!=', '')
            ->where('storecode', $request->datacode)
            ->join('products', 'products.item_code', 'dtl.itemcode')
            ->join('category', 'category.id', 'products.category')
            ->groupBy('category.category','short_desc','long_desc')
            ->groupBy('tdate','itemcat','itemcode','desc1','desc2')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byProduct(Request $request){
        $data = Dtl::selectRaw('category.category AS itemcat, itemcode AS itemcode, short_desc AS desc1, long_desc AS desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('itemcat', '!=', '')
            ->where('category.category', '!=', 'PROMO')
            ->where('category.enable_combo', 'N')
            ->join('products', 'products.item_code', 'dtl.itemcode')
            ->join('category', 'category.id', 'products.category')
            ->groupBy('category.category','short_desc','long_desc')
            ->groupBy('itemcat','itemcode','desc1','desc2');
            if($request->included){
                $data->whereIn('itemcode', $request->included);
            }
            $data->orderBy('quantity', 'DESC');
        return DataTables::of($data)->make(true);
    }

    public function byProduct_Date(Request $request){
        $data = Dtl::selectRaw("(STR_TO_DATE(tdate,'%m/%d/%Y')) AS date, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales")
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('itemcode', $request->colData)
            ->where('itemcat', '!=', '')
            ->groupBy('tdate','date')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byProduct_Branch(Request $request){
        $data = Dtl::selectRaw('CONCAT(dtl.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
            ->where('itemcode', $request->datacode)
            ->leftjoin('store', 'store.branch_code', 'dtl.storecode')
            ->groupBy('dtl.storecode','branch_name')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byCombo(Request $request){
        $data = Dtl::selectRaw('category.category AS itemcat, itemcode AS itemcode, short_desc AS desc1, long_desc AS desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('itemcat', '!=', '')
            ->where('category.category', '!=', 'PROMO')
            ->where('category.enable_combo', 'Y')
            ->join('products', 'products.item_code', 'dtl.itemcode')
            ->join('category', 'category.id', 'products.category')
            ->groupBy('category.category','short_desc','long_desc')
            ->groupBy('itemcat','itemcode','desc1','desc2');
            if($request->included){
                $data->whereIn('itemcode', $request->included);
            }
            $data->orderBy('quantity', 'DESC');
        return DataTables::of($data)->make(true);
    }

    public function byPromo(Request $request){
        $data = Dtl::selectRaw('category.category AS itemcat, itemcode AS itemcode, short_desc AS desc1, long_desc AS desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('itemcat', '!=', '')
            ->where('category.category', '=', 'PROMO')
            ->where('category.enable_combo', 'Y')
            ->join('products', 'products.item_code', 'dtl.itemcode')
            ->join('category', 'category.id', 'products.category')
            ->groupBy('category.category','short_desc','long_desc')
            ->groupBy('itemcat','itemcode','desc1','desc2');
            if($request->included){
                $data->whereIn('itemcode', $request->included);
            }
            $data->orderBy('quantity', 'DESC');
        return DataTables::of($data)->make(true);
    }

    public function byTransaction(Request $request){
        $data = Hdr::selectRaw('trantype as transaction_name, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->groupBy('transaction_name')
                ->orderBy('net_sales', 'DESC');
        return DataTables::of($data)->make(true);
    }

    public function byTransaction_Date(Request $request){
        $data = Hdr::selectRaw("(STR_TO_DATE(tdate,'%m/%d/%Y')) AS date")
            ->selectRaw('SUM(gross) AS gross_sales, SUM(totalsales) AS total_sales, SUM(netsales) AS net_sales')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where('trantype', $request->colData)
            ->groupBy('tdate','date')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTransaction_Branch(Request $request){
        $data = Hdr::selectRaw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name,
            SUM(gross) AS gross_sales, SUM(totalsales) AS total_sales, SUM(netsales) AS net_sales')
            ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
            ->where('trantype', $request->datacode)
            ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
            ->groupBy('hdr.storecode','branch_name')
            ->get();
        return DataTables::of($data)->make(true);
    }
}