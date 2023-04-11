<?php

namespace App\Http\Controllers;

use DB;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

use App\Models\DeliveryServingStore;
use App\Models\Setup;
use App\Models\Hdr;

class ReportsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function reports(){
        return view('pages.reports');
    }

    public function byArea(Request $request){
        if($request->type == 'standard'){
            $data = Hdr::selectRaw('store_area.store_area, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->join('store', 'store.branch_code', 'hdr.storecode')
                ->join('store_area', 'store_area.id', 'store.store_area')
                ->groupBy('store_area.store_area')
                ->get();
        }
        else{
            $data = Hdr::selectRaw("store_area.store_area,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN gross ELSE 0 END) as gross_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN totalsales ELSE 0 END) as total_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN netsales ELSE 0 END) as net_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN gross ELSE 0 END) as gross_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN totalsales ELSE 0 END) as total_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN netsales ELSE 0 END) as net_sales2")
                ->join('store', 'store.branch_code', 'hdr.storecode')
                ->join('store_area', 'store_area.id', 'store.store_area')
                ->groupBy('store_area.store_area')
                ->get();
        }
        return DataTables::of($data)->make(true);
    }

    public function byRegion(Request $request){
        if($request->type == 'standard'){
            $data = Hdr::selectRaw('store.region, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->join('store', 'store.branch_code', 'hdr.storecode')
                ->groupBy('store.region')
                ->get();
        }
        else{
            $data = Hdr::selectRaw("store.region,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN gross ELSE 0 END) as gross_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN totalsales ELSE 0 END) as total_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN netsales ELSE 0 END) as net_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN gross ELSE 0 END) as gross_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN totalsales ELSE 0 END) as total_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN netsales ELSE 0 END) as net_sales2")
                ->join('store', 'store.branch_code', 'hdr.storecode')
                ->groupBy('store.region')
                ->get();
        }
        return DataTables::of($data)->make(true);
    }

    public function byGroup(Request $request){
        if($request->type == 'standard'){
            $data = Hdr::selectRaw('subgroup.subgroup, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->join('store', 'store.branch_code', 'hdr.storecode')
                ->join('subgroup', 'subgroup.id', 'store.sub_group')
                ->groupBy('subgroup.subgroup')
                ->get();
        }
        else{
            $data = Hdr::selectRaw("subgroup.subgroup,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN gross ELSE 0 END) as gross_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN totalsales ELSE 0 END) as total_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN netsales ELSE 0 END) as net_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN gross ELSE 0 END) as gross_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN totalsales ELSE 0 END) as total_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN netsales ELSE 0 END) as net_sales2")
                ->join('store', 'store.branch_code', 'hdr.storecode')
                ->join('subgroup', 'subgroup.id', 'store.sub_group')
                ->groupBy('subgroup.subgroup')
                ->get();
        }
        return DataTables::of($data)->make(true);
    }

    public function bySetup(Request $request){
        if($request->type == 'standard'){
            $data = Hdr::selectRaw('store.setup, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->join('store', 'store.branch_code', 'hdr.storecode')
                ->groupBy('store.setup')
                ->get();
        }
        else{
            $data = Hdr::selectRaw("store.setup,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN gross ELSE 0 END) as gross_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN totalsales ELSE 0 END) as total_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN netsales ELSE 0 END) as net_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN gross ELSE 0 END) as gross_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN totalsales ELSE 0 END) as total_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN netsales ELSE 0 END) as net_sales2")
                ->join('store', 'store.branch_code', 'hdr.storecode')
                ->groupBy('store.setup')
                ->get();
        }
        return DataTables::of($data)
        ->addColumn('setup_name', function(Hdr $hdr){
            $setup_row = '';
            $array = explode(",", $hdr->setup);
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
        })
        ->make(true);
    }

    public function byDelivery(Request $request){
        if($request->type == 'standard'){
            $data = Hdr::selectRaw('store.serving_store, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->where('store.serving_store', '!=', '')
                ->join('store', 'store.branch_code', 'hdr.storecode')
                ->groupBy('store.serving_store')
                ->get();
        }
        else{
            $data = Hdr::selectRaw("store.serving_store,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN gross ELSE 0 END) as gross_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN totalsales ELSE 0 END) as total_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN netsales ELSE 0 END) as net_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN gross ELSE 0 END) as gross_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN totalsales ELSE 0 END) as total_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN netsales ELSE 0 END) as net_sales2")
                ->where('store.serving_store', '!=', '')
                ->join('store', 'store.branch_code', 'hdr.storecode')
                ->groupBy('store.serving_store')
                ->get();
        }
        return DataTables::of($data)
        ->addColumn('delivery_name', function(Hdr $hdr){
            $delivery_row = '';
            $array = explode(",", $hdr->serving_store);
            foreach($array as $value){
                $delivery_serving_store = DeliveryServingStore::where('id', $value)->first();
                if($delivery_row != ''){
                    $delivery_row = $delivery_row.', '.$delivery_serving_store->delivery_serving_store;
                }
                else{
                    $delivery_row = $delivery_serving_store->delivery_serving_store;
                }
            }
            return $delivery_row;
        })
        ->make(true);
    }
}