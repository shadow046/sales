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
        $transactions = Hdr::select('trantype')
            ->distinct()
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
        return view('pages.generate_reports', compact('stores','products','combos','promos','transactions','tenders'));
    }

    public function byBranch(Request $request){
        $data = Hdr::selectRaw('store.id AS store_id, hdr.storecode AS branch_code, store.branch_name AS store_name, CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name,
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
            ->groupBy('store_id','hdr.storecode','branch_code','store_name','branch_name','company_name','store_area_id','store_area','region','type','store_group','subgroup','network_setup');
            if($request->included){
                $data->whereIn('branch_code', $request->included);
            }
            $data->orderBy('net_sales', 'DESC')->get();
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
            ->where('itemcat', '!=', '');
            if($request->included){
                $data->whereIn('itemcode', $request->included);
            }
            if($request->byWhat == 'combo'){
                $data->where('category.category', '!=', 'PROMO')
                    ->where('category.enable_combo', 'Y');
            }
            if($request->byWhat == 'promo'){
                $data->where('category.category', '=', 'PROMO')
                    ->where('category.enable_combo', 'Y');
            }
            $data->join('products', 'products.item_code', 'dtl.itemcode')
                ->join('category', 'category.id', 'products.category')
                ->groupBy('category.category','short_desc','long_desc')
                ->groupBy('itemcat','itemcode','desc1','desc2');
            $data->orderBy('quantity', 'DESC')->get();
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

    public function byTransaction(Request $request){
        $data = Hdr::selectRaw('trantype as transaction_name, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date]);
                if($request->included){
                    $data->whereIn('trantype', $request->included);
                }
                $data->groupBy('transaction_name')
                    ->orderBy('net_sales', 'DESC')
                    ->get();
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

    public function byTender(Request $request){
        $data = Hdr::select('temp.tendname', DB::raw('SUM(temp.tendamnt) as total'))
            ->from(function($query) use($request){
                $query->select(
                    'tendname1 AS tendname', 'tendamnt1 AS tendamnt'
                )
                ->from('hdr')
                ->where('tendname1', '!=', '')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->unionAll(
                    DB::table('hdr')->select('tendname2', 'tendamnt2')
                        ->where('tendname2', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname3', 'tendamnt3')
                        ->where('tendname3', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname4', 'tendamnt4')
                        ->where('tendname4', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname5', 'tendamnt5')
                        ->where('tendname5', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname6', 'tendamnt6')
                        ->where('tendname6', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname7', 'tendamnt7')
                        ->where('tendname7', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname8', 'tendamnt8')
                        ->where('tendname8', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname9', 'tendamnt9')
                        ->where('tendname9', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname10', 'tendamnt10')
                        ->where('tendname10', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname11', 'tendamnt11')
                        ->where('tendname11', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select('tendname12', 'tendamnt12')
                        ->where('tendname12', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
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
        $data = Hdr::select('temp.tdate', 'temp.tendname', DB::raw('SUM(temp.tendamnt) as total'))
            ->from(function($query) use($request){
                $query->select(
                    DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                    'tendname1 AS tendname', 'tendamnt1 AS tendamnt'
                )
                ->from('hdr')
                ->where('tendname1', '!=', '')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname2', 'tendamnt2')
                        ->where('tendname2', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname3', 'tendamnt3')
                        ->where('tendname3', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname4', 'tendamnt4')
                        ->where('tendname4', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname5', 'tendamnt5')
                        ->where('tendname5', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname6', 'tendamnt6')
                        ->where('tendname6', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname7', 'tendamnt7')
                        ->where('tendname7', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname8', 'tendamnt8')
                        ->where('tendname8', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname9', 'tendamnt9')
                        ->where('tendname9', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname10', 'tendamnt10')
                        ->where('tendname10', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname11', 'tendamnt11')
                        ->where('tendname11', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw("STR_TO_DATE(tdate,'%m/%d/%Y') AS tdate"),
                        'tendname12', 'tendamnt12')
                        ->where('tendname12', '!=', '')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                );
            }, 'temp')
            ->where('tendname', $request->colData)
            ->groupBy('temp.tdate', 'temp.tendname')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTender_Branch(Request $request){
        $data = Hdr::select('temp.branch_name', 'temp.tendname', DB::raw('SUM(temp.tendamnt) as total'))
            ->from(function($query) use($request){
                $query->select(
                    DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                    'tendname1 AS tendname', 'tendamnt1 AS tendamnt'
                )
                ->from('hdr')
                ->where('tendname1', '!=', '')
                ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname2', 'tendamnt2')
                        ->where('tendname2', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname3', 'tendamnt3')
                        ->where('tendname3', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname4', 'tendamnt4')
                        ->where('tendname4', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname5', 'tendamnt5')
                        ->where('tendname5', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname6', 'tendamnt6')
                        ->where('tendname6', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname7', 'tendamnt7')
                        ->where('tendname7', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname8', 'tendamnt8')
                        ->where('tendname8', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname9', 'tendamnt9')
                        ->where('tendname9', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname10', 'tendamnt10')
                        ->where('tendname10', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname11', 'tendamnt11')
                        ->where('tendname11', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                )
                ->unionAll(
                    DB::table('hdr')->select(
                        DB::raw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name'),
                        'tendname12', 'tendamnt12')
                        ->where('tendname12', '!=', '')
                        ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                        ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                );
            }, 'temp')
            ->where('tendname', $request->datacode)
            ->groupBy('temp.branch_name','temp.tendname')
            ->get();
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
                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                ->where($request->tblType, $request->colData)
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
                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                ->where($request->tblType, $request->colData)
                ->whereTime('ttime', '>=', $start_hour)
                ->whereTime('ttime', '<=', $end_hour)
                ->first();
            if(!$result){
                $result = (object)[
                    'time_range_12hr' => $hour_range_12hr,
                    'time_range_24hr' => $hour_range_24hr,
                    'quantity' => 0,
                    'gross_sales' => 0,
                ];
            }
            if($result->gross_sales > 0){
                $data->push($result);
            }
        }
        return DataTables::of($data)->make(true);
    }

    public function byTimeC(Request $request){
        $data = collect();
        for($i = 0; $i < 24; $i++){
            $start_hour = sprintf("%02d:00:00", $i);
            $end_hour = sprintf("%02d:59:59", $i);
            $hour_range_12hr = date('h:i A', strtotime($start_hour)) . ' - ' . date('h:i A', strtotime($end_hour));
            $hour_range_24hr = date('H:i', strtotime($start_hour)) . ' - ' . date('H:i', strtotime($end_hour));
            $result = Hdr::selectRaw("'".$hour_range_24hr."' as time_range_24hr")
                ->selectRaw("'".$hour_range_12hr."' as time_range_12hr")
                ->selectRaw('COALESCE(SUM(t.tendamnt), 0) as total')
                ->from(function ($query) use ($request, $start_hour, $end_hour) {
                    $query->select('tendname1 as tendname', 'tendamnt1 as tendamnt')
                          ->from('hdr')
                          ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                          ->whereTime('ttime', '>=', $start_hour)
                          ->whereTime('ttime', '<=', $end_hour)
                          ->where('tendname1', '=', $request->colData)
                          ->unionAll(
                            Hdr::select('tendname2 as tendname', 'tendamnt2 as tendamnt')
                                ->where('tendname2', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                          )
                          ->unionAll(
                            Hdr::select('tendname3 as tendname', 'tendamnt3 as tendamnt')
                                ->where('tendname3', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                          )
                          ->unionAll(
                            Hdr::select('tendname4 as tendname', 'tendamnt4 as tendamnt')
                                ->where('tendname4', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                          )
                          ->unionAll(
                            Hdr::select('tendname5 as tendname', 'tendamnt5 as tendamnt')
                                ->where('tendname5', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                          )
                          ->unionAll(
                            Hdr::select('tendname6 as tendname', 'tendamnt6 as tendamnt')
                                ->where('tendname6', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                          )
                          ->unionAll(
                            Hdr::select('tendname7 as tendname', 'tendamnt7 as tendamnt')
                                ->where('tendname7', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                          )
                          ->unionAll(
                            Hdr::select('tendname8 as tendname', 'tendamnt8 as tendamnt')
                                ->where('tendname8', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                          )
                          ->unionAll(
                            Hdr::select('tendname9 as tendname', 'tendamnt9 as tendamnt')
                                ->where('tendname9', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                          )
                          ->unionAll(
                            Hdr::select('tendname10 as tendname', 'tendamnt10 as tendamnt')
                                ->where('tendname10', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                          )
                          ->unionAll(
                            Hdr::select('tendname11 as tendname', 'tendamnt11 as tendamnt')
                                ->where('tendname11', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                          )
                          ->unionAll(
                            Hdr::select('tendname12 as tendname', 'tendamnt12 as tendamnt')
                                ->where('tendname12', '=', $request->colData)
                                ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
                                ->whereTime('ttime', '>=', $start_hour)
                                ->whereTime('ttime', '<=', $end_hour)
                          );
                }, 't')
                ->first();
            if(!$result){
                $result = (object)[
                    'time_range_12hr' => $hour_range_12hr,
                    'time_range_24hr' => $hour_range_24hr,
                    'total' => 0,
                ];
            }
            if($result->total > 0){
                $data->push($result);
            }
        }
        return DataTables::of($data)->make(true);
    }

    public function byDayBranch(Request $request){
        if($request->sales_type == 'GROSS SALES'){
            $sales = 'gross';
        }
        if($request->sales_type == 'TOTAL SALES'){
            $sales = 'totalsales';
        }
        if($request->sales_type == 'NET SALES'){
            $sales = 'netsales';
        }
        $data = Hdr::selectRaw('hdr.storecode AS branch_code, store.branch_name AS store_name, CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name')
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 1 THEN ".$sales." ELSE 0 END) AS sunday_sales")
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 2 THEN ".$sales." ELSE 0 END) AS monday_sales")
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 3 THEN ".$sales." ELSE 0 END) AS tuesday_sales")
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 4 THEN ".$sales." ELSE 0 END) AS wednesday_sales")
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 5 THEN ".$sales." ELSE 0 END) AS thursday_sales")
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 6 THEN ".$sales." ELSE 0 END) AS friday_sales")
            ->selectRaw("SUM(CASE WHEN DAYOFWEEK(STR_TO_DATE(tdate,'%m/%d/%Y')) = 7 THEN ".$sales." ELSE 0 END) AS saturday_sales")
            ->selectRaw("SUM(".$sales.") AS total_sales")
            ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->groupBy('hdr.storecode','branch_code','store_name','branch_name')
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
            ->groupBy('product_code','product_name')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTimeBranch(Request $request){
        if($request->sales_type == 'GROSS SALES'){
            $sales = 'gross';
        }
        if($request->sales_type == 'TOTAL SALES'){
            $sales = 'totalsales';
        }
        if($request->sales_type == 'NET SALES'){
            $sales = 'netsales';
        }
        $data = Hdr::selectRaw('hdr.storecode AS branch_code, store.branch_name AS store_name, CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name')
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
            ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->groupBy('hdr.storecode','branch_code','store_name','branch_name')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTimeProduct(Request $request){
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
            ->groupBy('product_code','product_name')
            ->get();
        return DataTables::of($data)->make(true);
    }
}