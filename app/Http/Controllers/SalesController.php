<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Yajra\DataTables\Facades\DataTables;
use App\Models\Hdr;
use App\Models\Dtl;
use App\Models\Data;
use App\Models\Store;
use App\Models\StoreArea;
use App\Models\Oldgt;
use App\Models\TenderType;

use App\Models\PosSpecification;
use App\Models\PromoProductCombination;
use App\Models\CompanyContactPerson;
use App\Models\StoreContactDetails;
use App\Models\StorePosInformation;

use Carbon\Carbon;
use DB;

class SalesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function company()
    {
        
    }

    public function index()
    {
        //
    }


    public function sales()
    {
        $categories = Dtl::query()
            ->select('itemcat')
            ->groupBy('itemcat')
            ->get();
        return view('pages.sales', compact('categories'));
    }

    

    public function tender_data(Request $request)
    {
        $tendertype = TenderType::select('tender_type')->get();
        $query = '';
        foreach ($tendertype as $tender) {
            if ($query == '') {
                $query = $query.
                "SUM(CASE 
                    WHEN tendname1='$tender->tender_type' THEN totalsales 
                    WHEN tendname2='$tender->tender_type' THEN totalsales 
                    WHEN tendname3='$tender->tender_type' THEN totalsales 
                    WHEN tendname4='$tender->tender_type' THEN totalsales 
                    WHEN tendname5='$tender->tender_type' THEN totalsales 
                    WHEN tendname6='$tender->tender_type' THEN totalsales 
                    WHEN tendname7='$tender->tender_type' THEN totalsales 
                    WHEN tendname8='$tender->tender_type' THEN totalsales 
                    WHEN tendname9='$tender->tender_type' THEN totalsales 
                    WHEN tendname10='$tender->tender_type' THEN totalsales  
                    WHEN tendname11='$tender->tender_type' THEN totalsales  
                    WHEN tendname12='$tender->tender_type' THEN totalsales  
                    ELSE 0
                    END) as '$tender->tender_type'";
            }
            else{
                $query = $query.
                ",SUM(CASE 
                    WHEN tendname1='$tender->tender_type' THEN totalsales 
                    WHEN tendname2='$tender->tender_type' THEN totalsales 
                    WHEN tendname3='$tender->tender_type' THEN totalsales 
                    WHEN tendname4='$tender->tender_type' THEN totalsales 
                    WHEN tendname5='$tender->tender_type' THEN totalsales 
                    WHEN tendname6='$tender->tender_type' THEN totalsales 
                    WHEN tendname7='$tender->tender_type' THEN totalsales 
                    WHEN tendname8='$tender->tender_type' THEN totalsales 
                    WHEN tendname9='$tender->tender_type' THEN totalsales 
                    WHEN tendname10='$tender->tender_type' THEN totalsales  
                    WHEN tendname11='$tender->tender_type' THEN totalsales  
                    WHEN tendname12='$tender->tender_type' THEN totalsales  
                    ELSE 0
                    END) as '$tender->tender_type'";
            }
        }
        $tender = Hdr::query()
            ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->date)
            ->where('storecode', $request->storecode)
            ->where('refund', '0')
            ->where('void', '0')
            ->where('cancelled', '0')
            ->selectRaw("$query")
        ->get();
        $data = array();
        foreach ($tendertype as $tt) {
            foreach ($tender as $t) {
                if ($tt->tender_type) {
                    $var = $tt->tender_type;
                    if ($t->$var) {
                        array_push($data, [$var => $t->$var]);
                    }
                }
                
            }
        }
        // return $data;
        return view('pages.sales.tender', compact('data'))->render();
    }

    public function tender_pie_data(Request $request)
    {
        $tendertype = TenderType::select('tender_type')->get();
        $query = '';
        foreach ($tendertype as $tender) {
            if ($query == '') {
                $query = $query.
                "SUM(CASE 
                    WHEN tendname1='$tender->tender_type' THEN totalsales 
                    WHEN tendname2='$tender->tender_type' THEN totalsales 
                    WHEN tendname3='$tender->tender_type' THEN totalsales 
                    WHEN tendname4='$tender->tender_type' THEN totalsales 
                    WHEN tendname5='$tender->tender_type' THEN totalsales 
                    WHEN tendname6='$tender->tender_type' THEN totalsales 
                    WHEN tendname7='$tender->tender_type' THEN totalsales 
                    WHEN tendname8='$tender->tender_type' THEN totalsales 
                    WHEN tendname9='$tender->tender_type' THEN totalsales 
                    WHEN tendname10='$tender->tender_type' THEN totalsales  
                    WHEN tendname11='$tender->tender_type' THEN totalsales  
                    WHEN tendname12='$tender->tender_type' THEN totalsales  
                    ELSE 0
                    END) as '$tender->tender_type'";
            }
            else{
                $query = $query.
                ",SUM(CASE 
                    WHEN tendname1='$tender->tender_type' THEN totalsales 
                    WHEN tendname2='$tender->tender_type' THEN totalsales 
                    WHEN tendname3='$tender->tender_type' THEN totalsales 
                    WHEN tendname4='$tender->tender_type' THEN totalsales 
                    WHEN tendname5='$tender->tender_type' THEN totalsales 
                    WHEN tendname6='$tender->tender_type' THEN totalsales 
                    WHEN tendname7='$tender->tender_type' THEN totalsales 
                    WHEN tendname8='$tender->tender_type' THEN totalsales 
                    WHEN tendname9='$tender->tender_type' THEN totalsales 
                    WHEN tendname10='$tender->tender_type' THEN totalsales  
                    WHEN tendname11='$tender->tender_type' THEN totalsales  
                    WHEN tendname12='$tender->tender_type' THEN totalsales  
                    ELSE 0
                    END) as '$tender->tender_type'";
            }
        }
        $data = Hdr::query()
            ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->date)
            ->where('storecode', $request->storecode)
            ->where('refund', '0')
            ->where('void', '0')
            ->where('cancelled', '0')
            ->selectRaw("$query")
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function daily_data(Request $request)
    {
        $sales = Hdr::query()
            ->selectraw('STR_TO_DATE(tdate, "%m/%d/%Y") as tdate, sum(gross) as gross, sum(totalsales) as totalsales, sum(netsales) as netsales')
            ->where('storecode', $request->storecode)
            ->where('refund', '0')
            ->where('void', '0')
            ->where('cancelled', '0')
            ->groupBy('tdate')
            ->get();
        return DataTables::of($sales)->make(true);
    }

    public function discount_data(Request $request)
    {
        $sales = Hdr::query()
            ->selectraw('discname, sum(discamt) as discamt')
            ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->date)
            ->where('storecode', $request->storecode)
            ->where('refund', '0')
            ->where('void', '0')
            ->where('cancelled', '0')
            ->where('discname', '!=', '')
            ->groupBy('discname')
            ->get();
        return DataTables::of($sales)->make(true);
    }

    public function category_data(Request $request)
    {
        $data = Dtl::query()
            ->selectRaw('category.category, products.long_desc, sum(qty) as qty, sum(qty * unitprice) as totalsales')
            ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->date)
            ->where('storecode', $request->storecode)
            ->where('refund', '!=', '1')
            ->where('void', '!=', '1')
            ->where('cancelled', '!=', '1')
            ->join('products', 'item_code', 'itemcode')
            ->join('category', 'category.id', 'products.category')
            ->groupBy('category.category', 'products.long_desc')
            ->get();
        return DataTables::of($data)
            ->make(true);
    }

    public function pie_data(Request $request)
    {
        $data = Dtl::query()
            ->selectRaw('itemcat, sum(qty) as qty')
            ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->date)
            ->where('storecode', $request->storecode)
            ->where('refund', '!=', '1')
            ->where('void', '!=', '1')
            ->where('cancelled', '!=', '1')
            ->join('products', 'item_code', 'itemcode')
            ->groupBy('itemcat')
            ->get();
        return DataTables::of($data)->make(true);
    }
    

    public function barchart(Request $request)
    {
        $store = StoreArea::query()
            ->select('id', 'store_area')
            ->where('id', '!=', 0)
            ->get();

        return DataTables::of($store)
            ->addColumn('totalsales', function(StoreArea $store) {
                $stores = Store::select('branch_code')->where('store_area', $store->id)->get('id');
                $store_id = array();
                $area_gt = 0;
                foreach ($stores as $store) {
                    array_push($store_id, $store->branch_code);
                    // $oldgt = Oldgt::where('storecode', $store->branch_code)->where('tid', '0')->orderBy('id', 'desc')->first();
                    // if ($oldgt) {
                    //     $area_gt = $area_gt+$oldgt->oldgt;
                    // }
                }
                // $oldgt = Oldgt::whereIN('storecode', $store_id)
                //     ->where('tid', '0')->orderBy('old_gt.id', 'desc')->sum('oldgt');
                // if ($oldgt) {
                $totalsales = Hdr::whereIN('storecode', $store_id)
                    ->where('refund', '!=', '1')
                    ->where('void', '!=', '1')
                    ->where('cancelled', '!=', '1')
                    ->sum('totalsales');
                // return $totalsales+$area_gt;
                return $totalsales+$area_gt;
                // }
                return 'none';
            })
            ->make(true);
    }

    public function data(Request $request)
    {
        // $Dtlcol = Schema::getColumnListing('Dtl');
        // $hdrcol = Schema::getColumnListing('hdr');
        // $get_columns = array_diff($hdrcol, $Dtlcol);
        // $datacol = array_merge($Dtlcol, $get_columns);
        
        // return App\Oldgt::query()
        //     ->select('branch_name', 'oldgt')
        //     ->join('oldgt', 'storecode', 'branch_code')
        //     ->
        if ($request->type == "ALL") {
            $store = Store::query()
                ->select('branch_code', 'city', 'branch_name', 'subgroup', 'store_area.store_area')
                ->join('subgroup', 'subgroup.id', 'sub_group')
                ->join('store_area', 'store_area.id', 'store.store_area')
                ->get();
            return DataTables::of($store)
                ->addColumn('totalsales', function(Store $store) {
                    // $oldgt = Oldgt::where('storecode', $store->branch_code)->where('tid', '0')->orderBy('id', 'desc')->first();
                    // if ($oldgt) {
                    //     $totalsales = Hdr::where('storecode', $store->branch_code)
                    //         // ->where('tdate', $oldgt->tdate)
                    //         ->where('refund', '!=', '1')
                    //         ->where('void', '!=', '1')
                    //         ->where('cancelled', '!=', '1')
                    //         ->sum('totalsales');
                    //     return $totalsales+$oldgt->oldgt;
                    // }
                    $totalsales = Hdr::where('storecode', $store->branch_code)
                            ->where('refund', '!=', '1')
                            ->where('void', '!=', '1')
                            ->where('cancelled', '!=', '1')
                            ->sum('totalsales');
                    return $totalsales;
                })
                ->make(true);
        }

        if ($request->type == "category") {
            if ($request->yfrom && $request->yto) {
                $start = Carbon::parse($request->yfrom."-".$request->mfrom."-01")->startOfMonth()->format('Y-m-d H:i:s');
                $end = Carbon::parse($request->yto."-".$request->mto."-01")->endOfMonth()->format('Y-m-d H:i:s');
                $data = Dtl::query()
                    ->selectRaw('itemcat, sum(qty) as qty')
                    ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$start, $end])
                    ->groupBy('itemcat')
                    ->get();
            }
            else if ($request->dfrom && $request->dto) {
                $start = Carbon::parse($request->dfrom)->startOfMonth()->format('Y-m-d H:i:s');
                $end = Carbon::parse($request->dto)->endOfMonth()->format('Y-m-d H:i:s');
                if ($request->transtype == "transaction") {
                    $option = 'sum(qty) AS qty';
                    if ($request->option == "sales") {
                        $option = 'sum(qty * unitprice) AS totalsales';
                    }
                    $data = Dtl::query()
                        ->selectRaw("trantype, $option")
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$start, $end])
                        ->groupBy('trantype')
                        ->get();
                }
                else{
                    $start = Carbon::parse($request->dfrom)->format('Y-m-d H:i:s');
                    $end = Carbon::parse($request->dto)->format('Y-m-d H:i:s');
                    $data = Dtl::query()
                        ->selectRaw('itemcat, sum(qty) as qty')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$start, $end])
                        ->where('storecode', $request->storecode)
                        ->groupBy('itemcat')
                        ->get();
                }
                
            }
            else if ($request->date) {
                if ($request->transtype) {
                    $data = Dtl::query()
                        ->selectRaw('itemcat, sum(qty) as qty')
                        ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), '=', Carbon::parse($request->date))
                        ->where('trantype', $request->transtype)
                        ->groupBy('itemcat')
                        ->get();
                }
                else{
                    $data = Dtl::query()
                        ->selectRaw('itemcat, sum(qty) as qty')
                        ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), '=', Carbon::parse($request->date))
                        ->groupBy('itemcat')
                        ->get();
                }
            }
            else if ($request->month) {
                // $date = Carbon::parse($request->month);
                $start = Carbon::parse($request->month)->startOfMonth()->format('Y-m-d H:i:s');
                // $date = Carbon::parse($request->month);
                $end = Carbon::parse($request->month)->endOfMonth()->format('Y-m-d H:i:s');

                $data = Dtl::query()
                    ->selectRaw('itemcat, sum(qty) as qty')
                    ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$start, $end])
                    ->groupBy('itemcat')
                    ->get();
            }
            // else if ($request->option){
            //     $data = Dtl::query()
            //         ->selectRaw('itemcat, sum(qty) as qty')
            //         ->groupBy('itemcat')
            //         ->get();
            // }
            else{
                $data = Dtl::query()
                    ->selectRaw('itemcat, sum(qty) as qty')
                    ->groupBy('itemcat')
                    ->get();
            }
        }

        if ($request->type == "savory") {
            $data = Dtl::query()
            ->selectRaw('desc1, sum(qty) as qty')
            ->where('itemcat', 'SAVORY')
            ->groupBy('desc1')
            ->get();
        }

        if ($request->type == "daily") {
            // return DB::table('data')->select('tdate')->get();
            if ($request->range == 'month') {
                // $date = Carbon::parse($request->date);
                $start = Carbon::parse($request->date)->startOfMonth()->format('Y-m-d H:i:s');
                // $date = Carbon::parse($request->date);
                $end = Carbon::parse($request->date)->endOfMonth()->format('Y-m-d H:i:s');
                if ($request->option == 'sales') {
                    $data = Dtl::query()
                        ->selectRaw('desc1, sum(qty * unitprice) as qty')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$start, $end])
                        ->where('itemcat', $request->category)
                        ->groupBy('desc1')
                        ->get();
                }
                else{
                    $data = Dtl::query()
                        ->selectRaw('desc1, sum(qty) as qty')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$start, $end])
                        ->where('itemcat', $request->category)
                        ->groupBy('desc1')
                        ->get();
                }
            }
            else{
                if ($request->category == 'ALL') {
                    if ($request->option == 'sales') {
                        $data = Dtl::query()
                            ->selectRaw('itemcat as desc1, sum(qty * unitprice) AS totalsales')
                            ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"),'=', Carbon::parse($request->date))
                            ->groupBy('itemcat')
                            ->get();
                    }
                    else{
                        $data = Dtl::query()
                            ->selectRaw('itemcat as desc1, sum(qty) AS totalsales')
                            ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"),'=', Carbon::parse($request->date))
                            ->groupBy('itemcat')
                            ->get();
                    }
                }
                else{
                    if ($request->option == 'sales') {
                        $data = Dtl::query()
                            ->selectRaw('desc1, sum(qty * unitprice) AS totalsales')
                            ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"),'=', Carbon::parse($request->date))
                            ->where('itemcat', $request->category)
                            ->groupBy('desc1')
                            ->get();
                    }
                    else{
                        $data = Dtl::query()
                            ->selectRaw('desc1, sum(qty) AS totalsales')
                            ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"),'=', Carbon::parse($request->date))
                            ->where('itemcat', $request->category)
                            ->groupBy('desc1')
                            ->get();
                    }
                }
                
                
            }
            // return DataTables::of($data)
            //     // ->editColumn('totalsales', function($r) {
            //     //     return number_format($r->totalsales,2);
            //     // })
            //     ->make(true);
        }

        if ($request->type == "date") {
            // return DB::table('data')->select('tdate')->get();
            if ($request->category != '') {
                // $date = Carbon::parse($request->dfrom);
                $start = Carbon::parse($request->dfrom)->startOfMonth()->format('Y-m-d H:i:s');
                // $date = Carbon::parse($request->dto);
                $end = Carbon::parse($request->dto)->endOfMonth()->format('Y-m-d H:i:s');
                if ($request->category == 'ALL') {
                    $data = Dtl::query()
                        ->selectRaw('tdate as date, sum(qty * unitprice) as qty')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$start, $end])
                        ->groupBy('date')
                        ->get();
                }
                else{
                    $data = Dtl::query()
                        ->selectRaw('tdate as date, sum(qty * unitprice) as qty')
                        ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$start, $end])
                        ->where('itemcat', $request->category)
                        ->groupBy('date')
                        ->get();
                }
            }
            else{
                $data = Dtl::query()
                    ->selectRaw('tdate as date, sum(qty) as qty')
                    ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"),'>=', Carbon::parse($request->from))
                    ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"),'<=', Carbon::parse($request->to))
                    ->where('itemcat', 'DONUTS')
                    ->groupBy('date')
                    ->get();
            }
            
        }

        if ($request->type == "month") {
            $date = Carbon::parse($request->yfrom."-".$request->mfrom."-01");
            $start = $date->startOfMonth()->format('Y-m-d H:i:s');
            $date = Carbon::parse($request->yto."-".$request->mto."-01");
            $end = $date->endOfMonth()->format('Y-m-d H:i:s');

            if ($request->category == 'ALL') {
                $data = Dtl::query()
                ->selectRaw('monthname(STR_TO_DATE(tdate,"%m/%d/%Y")) as month,sum(qty) as qty')
                // ->select(DB::raw("monthname(STR_TO_DATE(tdate,'%m/%d/%Y')) month"))
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$start, $end])
                // ->whereMonth(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"),'>=', $request->from)
                // ->whereMonth(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"),'<=', $request->to)
                ->groupBy('month')
                ->get()->sort(function ($a, $b) {
                    $monthA = date_parse($a['month']);
                    $monthB = date_parse($b['month']);
                    return $monthA["month"] - $monthB["month"];
                });
            }
            else{
                $data = Dtl::query()
                    ->selectRaw('monthname(STR_TO_DATE(tdate,"%m/%d/%Y")) as month,sum(qty) as qty')
                    // ->select(DB::raw("monthname(STR_TO_DATE(tdate,'%m/%d/%Y')) month"))
                    ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$start, $end])
                    // ->whereMonth(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"),'>=', $request->from)
                    // ->whereMonth(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"),'<=', $request->to)
                    ->where('itemcat', $request->category)
                    ->groupBy('month')
                    ->get()->sort(function ($a, $b) {
                        $monthA = date_parse($a['month']);
                        $monthB = date_parse($b['month']);
                        return $monthA["month"] - $monthB["month"];
                    });
            }
        }

        if ($request->trantype) {
            $option = 'sum(qty) AS qty';
            $start = Carbon::parse($request->dfrom)->startOfMonth()->format('Y-m-d H:i:s');
            $end = Carbon::parse($request->dto)->endOfMonth()->format('Y-m-d H:i:s');
            if ($request->option == "sales") {
                $option = 'sum(qty * unitprice) AS totalsales';
            }
            
            $data = Dtl::query()
                ->selectRaw("desc1, $option")
                // ->whereDate(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"),'=', Carbon::parse($request->date))
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$start, $end])
                // ->where('itemcat', $request->category)
                ->groupBy('desc1')
                ->get();
        }

        if ($request->type == "trantype") {
            $data = Dtl::query()
            ->selectRaw('trantype, as trantype, sum(qty) as qty')
            ->groupBy('trantype')
            ->get();
        }

        if ($request->type == "tendertype") {
            $start = Carbon::parse($request->dfrom)->format('Y-m-d H:i:s');
            $end = Carbon::parse($request->dto)->format('Y-m-d H:i:s');
            $data = Hdr::query()
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$start, $end])
                ->where('storecode', $request->storecode)
                ->selectRaw('SUM(CASE 
                    WHEN tendname1= \'CASH\' THEN totalsales 
                    WHEN tendname2= \'CASH\' THEN totalsales 
                    WHEN tendname3= \'CASH\' THEN totalsales 
                    WHEN tendname4= \'CASH\' THEN totalsales 
                    WHEN tendname5= \'CASH\' THEN totalsales 
                    WHEN tendname6= \'CASH\' THEN totalsales 
                    WHEN tendname7= \'CASH\' THEN totalsales 
                    WHEN tendname8= \'CASH\' THEN totalsales 
                    WHEN tendname9= \'CASH\' THEN totalsales 
                    WHEN tendname10= \'CASH\' THEN totalsales  
                    WHEN tendname11= \'CASH\' THEN totalsales  
                    WHEN tendname12= \'CASH\' THEN totalsales  
                    ELSE 0
                    END) as CASH,
                    SUM(CASE 
                    WHEN tendname1= \'MAYA\' THEN totalsales 
                    WHEN tendname2= \'MAYA\' THEN totalsales 
                    WHEN tendname3= \'MAYA\' THEN totalsales 
                    WHEN tendname4= \'MAYA\' THEN totalsales 
                    WHEN tendname5= \'MAYA\' THEN totalsales 
                    WHEN tendname6= \'MAYA\' THEN totalsales 
                    WHEN tendname7= \'MAYA\' THEN totalsales 
                    WHEN tendname8= \'MAYA\' THEN totalsales 
                    WHEN tendname9= \'MAYA\' THEN totalsales 
                    WHEN tendname10= \'MAYA\' THEN totalsales 
                    WHEN tendname11= \'MAYA\' THEN totalsales 
                    WHEN tendname12= \'MAYA\' THEN totalsales 
                    ELSE 0
                    END) as MAYA,
                    SUM(CASE 
                    WHEN tendname1= \'GCASH\' THEN totalsales 
                    WHEN tendname2= \'GCASH\' THEN totalsales 
                    WHEN tendname3= \'GCASH\' THEN totalsales 
                    WHEN tendname4= \'GCASH\' THEN totalsales 
                    WHEN tendname5= \'GCASH\' THEN totalsales 
                    WHEN tendname6= \'GCASH\' THEN totalsales 
                    WHEN tendname7= \'GCASH\' THEN totalsales 
                    WHEN tendname8= \'GCASH\' THEN totalsales 
                    WHEN tendname9= \'GCASH\' THEN totalsales 
                    WHEN tendname10= \'GCASH\' THEN totalsales 
                    WHEN tendname11= \'GCASH\' THEN totalsales 
                    WHEN tendname12= \'GCASH\' THEN totalsales 
                    ELSE 0
                    END) as GCASH'
                )
                ->get();
        }

        if ($request->type == "tender") {
            if ($request->category) {
                if ($request->tender) {
                    $option = 'sum(qty) AS qty';
                    if ($request->option == "sales") {
                        $option = 'sum(qty * unitprice) AS totalsales';
                    }
                    $data = Hdr::query()
                        ->selectRaw("desc1, $option")
                        ->join('dtl', function($join)
                            {
                                $join->on('dtl.tid', '=', 'hdr.tid')
                                    ->on('dtl.tnumber','=', 'hdr.tnumber');
                            })
                        ->where('tendname1', $request->tender)
                        ->where('itemcat', $request->category)
                        ->whereDate(DB::raw("(STR_TO_DATE(dtl.tdate,'%m/%d/%Y'))"),'=', Carbon::parse($request->date))
                        ->groupBy('desc1')
                        ->get();
                        // dd($data); JOIN DTL HDR
                }
            }
            elseif ($request->tender) {
                $data = Hdr::query()
                    ->select('itemcat')
                    ->join('dtl', function($join)
                        {
                            $join->on('dtl.tid', '=', 'hdr.tid')
                                ->on('dtl.tnumber','=', 'hdr.tnumber');
                        })
                    ->where('tendname1', $request->tender)
                    ->whereDate(DB::raw("(STR_TO_DATE(dtl.tdate,'%m/%d/%Y'))"),'=', Carbon::parse($request->date))
                    ->groupBy('itemcat')
                    ->get();
            }
            else{
                $data = Hdr::query()
                ->selectRaw('SUM(CASE 
                    WHEN tendname1= \'CASH\' THEN 1 
                    WHEN tendname2= \'CASH\' THEN 1 
                    WHEN tendname3= \'CASH\' THEN 1 
                    WHEN tendname4= \'CASH\' THEN 1 
                    WHEN tendname5= \'CASH\' THEN 1 
                    WHEN tendname6= \'CASH\' THEN 1 
                    WHEN tendname7= \'CASH\' THEN 1 
                    WHEN tendname8= \'CASH\' THEN 1 
                    WHEN tendname9= \'CASH\' THEN 1 
                    WHEN tendname10= \'CASH\' THEN 1 
                    WHEN tendname11= \'CASH\' THEN 1 
                    WHEN tendname12= \'CASH\' THEN 1 
                    ELSE 0
                    END) as CASH,
                    SUM(CASE 
                    WHEN tendname1= \'MAYA\' THEN 1 
                    WHEN tendname2= \'MAYA\' THEN 1 
                    WHEN tendname3= \'MAYA\' THEN 1 
                    WHEN tendname4= \'MAYA\' THEN 1 
                    WHEN tendname5= \'MAYA\' THEN 1 
                    WHEN tendname6= \'MAYA\' THEN 1 
                    WHEN tendname7= \'MAYA\' THEN 1 
                    WHEN tendname8= \'MAYA\' THEN 1 
                    WHEN tendname9= \'MAYA\' THEN 1 
                    WHEN tendname10= \'MAYA\' THEN 1 
                    WHEN tendname11= \'MAYA\' THEN 1 
                    WHEN tendname12= \'MAYA\' THEN 1 
                    ELSE 0
                    END) as MAYA,
                    SUM(CASE 
                    WHEN tendname1= \'GCASH\' THEN 1 
                    WHEN tendname2= \'GCASH\' THEN 1 
                    WHEN tendname3= \'GCASH\' THEN 1 
                    WHEN tendname4= \'GCASH\' THEN 1 
                    WHEN tendname5= \'GCASH\' THEN 1 
                    WHEN tendname6= \'GCASH\' THEN 1 
                    WHEN tendname7= \'GCASH\' THEN 1 
                    WHEN tendname8= \'GCASH\' THEN 1 
                    WHEN tendname9= \'GCASH\' THEN 1 
                    WHEN tendname10= \'GCASH\' THEN 1 
                    WHEN tendname11= \'GCASH\' THEN 1 
                    WHEN tendname12= \'GCASH\' THEN 1 
                    ELSE 0
                    END) as GCASH'
                )
                ->get();
            }
        }

        return DataTables::of($data)
            ->make(true);
    }

    public function daily()
    {
        $categories = Dtl::query()
            ->select('itemcat')
            ->groupBy('itemcat')
            ->get();
        return view('pages.sales.daily', compact('categories'));
    }

    public function monthly()
    {
        $categories = Dtl::query()
            ->select('itemcat')
            ->groupBy('itemcat')
            ->get();
        return view('pages.sales.monthly', compact('categories'));
    }

    public function dine_in()
    {
        $categories = Dtl::query()
            ->select('itemcat')
            ->groupBy('itemcat')
            ->get();
        return view('pages.sales.dine-in', compact('categories'));
    }

    public function transaction()
    {
        return view('pages.sales.transaction');
    }

    public function take_out()
    {
        $categories = Dtl::query()
            ->select('itemcat')
            ->groupBy('itemcat')
            ->get();
        return view('pages.sales.take-out', compact('categories'));
    }

    public function drive_thru()
    {
        $categories = Dtl::query()
            ->select('itemcat')
            ->groupBy('itemcat')
            ->get();
        return view('pages.sales.drive-thru', compact('categories'));
    }

    public function cash()
    {
        $categories = Dtl::query()
            ->select('itemcat')
            ->groupBy('itemcat')
            ->get();
        return view('pages.sales.cash', compact('categories'));
    }

    public function gcash()
    {
        $categories = Dtl::query()
            ->select('itemcat')
            ->groupBy('itemcat')
            ->get();
        return view('pages.sales.gcash', compact('categories'));
    }

    public function debit()
    {
        $categories = Dtl::query()
            ->select('itemcat')
            ->groupBy('itemcat')
            ->get();
        return view('pages.sales.debit', compact('categories'));
    }

    public function maya()
    {
        $categories = Dtl::query()
            ->select('itemcat')
            ->groupBy('itemcat')
            ->get();
        return view('pages.sales.maya', compact('categories'));
    }

    // public function pos_specification_data(Request $request)
    // {
    //     return DataTables::of(PosSpecification::where('pos_id',$request->id)->get())->make(true);
    // }
    // public function promo_product_combination_data(Request $request)
    // {
    //     return DataTables::of(PromoProductCombination::where('promo_id',$request->id)->get())->make(true);
    // }
    // public function company_contact_person_data(Request $request)
    // {
    //     return DataTables::of(CompanyContactPerson::where('company_id',$request->id)->get())->make(true);
    // }
    // public function store_contact_details_data(Request $request)
    // {
    //     return DataTables::of(StoreContactDetails::where('store_id',$request->id)->get())->make(true);
    // }
}
