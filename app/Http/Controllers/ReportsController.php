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

class ReportsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function reports(){
        return view('pages.reports');
    }

    public function byBranch(Request $request){
        if($request->type == 'standard'){
            $data = Hdr::selectRaw('CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                ->groupBy('storecode','branch_name','branch')
                ->get();
        }
        else{
            $data = Hdr::selectRaw("CONCAT(hdr.storecode, IFNULL(CONCAT(': ', store.branch_name), '')) AS branch,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN gross ELSE 0 END) as gross_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN totalsales ELSE 0 END) as total_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN netsales ELSE 0 END) as net_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN gross ELSE 0 END) as gross_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN totalsales ELSE 0 END) as total_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN netsales ELSE 0 END) as net_sales2")
                ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
                ->groupBy('storecode','branch_name','branch')
                ->get();
        }
        return DataTables::of($data)->make(true);
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

    public function byAreaManager(Request $request){
        $data = User::selectRaw('users.name AS area_manager, users.area AS area, users.store AS branch')
            ->where('userlevel', '4')
            ->get();
        if($request->type == 'standard'){
            return DataTables::of($data)
            ->addColumn('gross_sales', function(User $hdr) use($request){
                $gross_sales = 0;
                $area_array = explode("|", $hdr->area);
                $branch_array = explode("|", $hdr->branch);
                foreach($branch_array as $branch){
                    if(strpos($branch, '-0') == false){
                        $branch_code = Store::where('id', $branch)->first()->branch_code;
                        $total = Hdr::selectRaw('SUM(gross) as gross_sales')
                            ->where('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                            ->first()
                            ->gross_sales;
                        $gross_sales = $gross_sales + $total;
                    }
                    else{
                        $area_id = str_replace('-0', '', $branch);
                        $branch_code_array = Store::select('branch_code')->where('store_area', $area_id)->get()->toArray();
                        $branch_code = array_map(function($item) {
                            return $item['branch_code'];
                        }, $branch_code_array);
                        $total = Hdr::selectRaw('SUM(gross) as gross_sales')
                            ->whereIn('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                            ->first()
                            ->gross_sales;
                        $gross_sales = $gross_sales + $total;
                    }
                }
                return $gross_sales;
            })
            ->addColumn('total_sales', function(User $hdr) use($request){
                $total_sales = 0;
                $area_array = explode("|", $hdr->area);
                $branch_array = explode("|", $hdr->branch);
                foreach($branch_array as $branch){
                    if(strpos($branch, '-0') == false){
                        $branch_code = Store::where('id', $branch)->first()->branch_code;
                        $total = Hdr::selectRaw('SUM(totalsales) as total_sales')
                            ->where('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                            ->first()
                            ->total_sales;
                        $total_sales = $total_sales + $total;
                    }
                    else{
                        $area_id = str_replace('-0', '', $branch);
                        $branch_code_array = Store::select('branch_code')->where('store_area', $area_id)->get()->toArray();
                        $branch_code = array_map(function($item) {
                            return $item['branch_code'];
                        }, $branch_code_array);
                        $total = Hdr::selectRaw('SUM(totalsales) as total_sales')
                            ->whereIn('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                            ->first()
                            ->total_sales;
                        $total_sales = $total_sales + $total;
                    }
                }
                return $total_sales;
            })
            ->addColumn('net_sales', function(User $hdr) use($request){
                $net_sales = 0;
                $area_array = explode("|", $hdr->area);
                $branch_array = explode("|", $hdr->branch);
                foreach($branch_array as $branch){
                    if(strpos($branch, '-0') == false){
                        $branch_code = Store::where('id', $branch)->first()->branch_code;
                        $total = Hdr::selectRaw('SUM(netsales) as net_sales')
                            ->where('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                            ->first()
                            ->net_sales;
                        $net_sales = $net_sales + $total;
                    }
                    else{
                        $area_id = str_replace('-0', '', $branch);
                        $branch_code_array = Store::select('branch_code')->where('store_area', $area_id)->get()->toArray();
                        $branch_code = array_map(function($item) {
                            return $item['branch_code'];
                        }, $branch_code_array);
                        $total = Hdr::selectRaw('SUM(netsales) as net_sales')
                            ->whereIn('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                            ->first()
                            ->net_sales;
                        $net_sales = $net_sales + $total;
                    }
                }
                return $net_sales;
            })
            ->make(true);
        }
        else{
            return DataTables::of($data)
            ->addColumn('gross_sales1', function(User $hdr) use($request){
                $gross_sales = 0;
                $area_array = explode("|", $hdr->area);
                $branch_array = explode("|", $hdr->branch);
                foreach($branch_array as $branch){
                    if(strpos($branch, '-0') == false){
                        $branch_code = Store::where('id', $branch)->first()->branch_code;
                        $total = Hdr::selectRaw('SUM(gross) as gross_sales')
                            ->where('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->date1A, $request->date1B])
                            ->first()
                            ->gross_sales;
                        $gross_sales = $gross_sales + $total;
                    }
                    else{
                        $area_id = str_replace('-0', '', $branch);
                        $branch_code_array = Store::select('branch_code')->where('store_area', $area_id)->get()->toArray();
                        $branch_code = array_map(function($item) {
                            return $item['branch_code'];
                        }, $branch_code_array);
                        $total = Hdr::selectRaw('SUM(gross) as gross_sales')
                            ->whereIn('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->date1A, $request->date1B])
                            ->first()
                            ->gross_sales;
                        $gross_sales = $gross_sales + $total;
                    }
                }
                return $gross_sales;
            })
            ->addColumn('total_sales1', function(User $hdr) use($request){
                $total_sales = 0;
                $area_array = explode("|", $hdr->area);
                $branch_array = explode("|", $hdr->branch);
                foreach($branch_array as $branch){
                    if(strpos($branch, '-0') == false){
                        $branch_code = Store::where('id', $branch)->first()->branch_code;
                        $total = Hdr::selectRaw('SUM(totalsales) as total_sales')
                            ->where('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->date1A, $request->date1B])
                            ->first()
                            ->total_sales;
                        $total_sales = $total_sales + $total;
                    }
                    else{
                        $area_id = str_replace('-0', '', $branch);
                        $branch_code_array = Store::select('branch_code')->where('store_area', $area_id)->get()->toArray();
                        $branch_code = array_map(function($item) {
                            return $item['branch_code'];
                        }, $branch_code_array);
                        $total = Hdr::selectRaw('SUM(totalsales) as total_sales')
                            ->whereIn('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->date1A, $request->date1B])
                            ->first()
                            ->total_sales;
                        $total_sales = $total_sales + $total;
                    }
                }
                return $total_sales;
            })
            ->addColumn('net_sales1', function(User $hdr) use($request){
                $net_sales = 0;
                $area_array = explode("|", $hdr->area);
                $branch_array = explode("|", $hdr->branch);
                foreach($branch_array as $branch){
                    if(strpos($branch, '-0') == false){
                        $branch_code = Store::where('id', $branch)->first()->branch_code;
                        $total = Hdr::selectRaw('SUM(netsales) as net_sales')
                            ->where('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->date1A, $request->date1B])
                            ->first()
                            ->net_sales;
                        $net_sales = $net_sales + $total;
                    }
                    else{
                        $area_id = str_replace('-0', '', $branch);
                        $branch_code_array = Store::select('branch_code')->where('store_area', $area_id)->get()->toArray();
                        $branch_code = array_map(function($item) {
                            return $item['branch_code'];
                        }, $branch_code_array);
                        $total = Hdr::selectRaw('SUM(netsales) as net_sales')
                            ->whereIn('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->date1A, $request->date1B])
                            ->first()
                            ->net_sales;
                        $net_sales = $net_sales + $total;
                    }
                }
                return $net_sales;
            })
            ->addColumn('gross_sales2', function(User $hdr) use($request){
                $gross_sales = 0;
                $area_array = explode("|", $hdr->area);
                $branch_array = explode("|", $hdr->branch);
                foreach($branch_array as $branch){
                    if(strpos($branch, '-0') == false){
                        $branch_code = Store::where('id', $branch)->first()->branch_code;
                        $total = Hdr::selectRaw('SUM(gross) as gross_sales')
                            ->where('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->date2A, $request->date2B])
                            ->first()
                            ->gross_sales;
                        $gross_sales = $gross_sales + $total;
                    }
                    else{
                        $area_id = str_replace('-0', '', $branch);
                        $branch_code_array = Store::select('branch_code')->where('store_area', $area_id)->get()->toArray();
                        $branch_code = array_map(function($item) {
                            return $item['branch_code'];
                        }, $branch_code_array);
                        $total = Hdr::selectRaw('SUM(gross) as gross_sales')
                            ->whereIn('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->date2A, $request->date2B])
                            ->first()
                            ->gross_sales;
                        $gross_sales = $gross_sales + $total;
                    }
                }
                return $gross_sales;
            })
            ->addColumn('total_sales2', function(User $hdr) use($request){
                $total_sales = 0;
                $area_array = explode("|", $hdr->area);
                $branch_array = explode("|", $hdr->branch);
                foreach($branch_array as $branch){
                    if(strpos($branch, '-0') == false){
                        $branch_code = Store::where('id', $branch)->first()->branch_code;
                        $total = Hdr::selectRaw('SUM(totalsales) as total_sales')
                            ->where('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->date2A, $request->date2B])
                            ->first()
                            ->total_sales;
                        $total_sales = $total_sales + $total;
                    }
                    else{
                        $area_id = str_replace('-0', '', $branch);
                        $branch_code_array = Store::select('branch_code')->where('store_area', $area_id)->get()->toArray();
                        $branch_code = array_map(function($item) {
                            return $item['branch_code'];
                        }, $branch_code_array);
                        $total = Hdr::selectRaw('SUM(totalsales) as total_sales')
                            ->whereIn('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->date2A, $request->date2B])
                            ->first()
                            ->total_sales;
                        $total_sales = $total_sales + $total;
                    }
                }
                return $total_sales;
            })
            ->addColumn('net_sales2', function(User $hdr) use($request){
                $net_sales = 0;
                $area_array = explode("|", $hdr->area);
                $branch_array = explode("|", $hdr->branch);
                foreach($branch_array as $branch){
                    if(strpos($branch, '-0') == false){
                        $branch_code = Store::where('id', $branch)->first()->branch_code;
                        $total = Hdr::selectRaw('SUM(netsales) as net_sales')
                            ->where('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->date2A, $request->date2B])
                            ->first()
                            ->net_sales;
                        $net_sales = $net_sales + $total;
                    }
                    else{
                        $area_id = str_replace('-0', '', $branch);
                        $branch_code_array = Store::select('branch_code')->where('store_area', $area_id)->get()->toArray();
                        $branch_code = array_map(function($item) {
                            return $item['branch_code'];
                        }, $branch_code_array);
                        $total = Hdr::selectRaw('SUM(netsales) as net_sales')
                            ->whereIn('storecode', $branch_code)
                            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->date2A, $request->date2B])
                            ->first()
                            ->net_sales;
                        $net_sales = $net_sales + $total;
                    }
                }
                return $net_sales;
            })
            ->make(true);
        }
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
        $delivery_array = array();
        $items = DeliveryServingStore::all();
        foreach($items as $item){
            array_push($delivery_array, $item->delivery_serving_store);
        }
        if($request->type == 'standard'){
            $data = Hdr::selectRaw('trantype as delivery_name, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->whereIn('hdr.trantype', $delivery_array)
                ->groupBy('delivery_name')
                ->get();
        }
        else{
            $data = Hdr::selectRaw("trantype as delivery_name,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN gross ELSE 0 END) as gross_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN totalsales ELSE 0 END) as total_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN netsales ELSE 0 END) as net_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN gross ELSE 0 END) as gross_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN totalsales ELSE 0 END) as total_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN netsales ELSE 0 END) as net_sales2")
                ->whereIn('hdr.trantype', $delivery_array)
                ->groupBy('delivery_name')
                ->get();
        }
        return DataTables::of($data)->make(true);
    }

    public function byTransaction(Request $request){
        if($request->type == 'standard'){
            $data = Hdr::selectRaw('trantype as transaction_name, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->groupBy('transaction_name')
                ->get();
        }
        else{
            $data = Hdr::selectRaw("trantype as transaction_name,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN gross ELSE 0 END) as gross_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN totalsales ELSE 0 END) as total_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN netsales ELSE 0 END) as net_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN gross ELSE 0 END) as gross_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN totalsales ELSE 0 END) as total_sales2,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN netsales ELSE 0 END) as net_sales2")
                ->groupBy('transaction_name')
                ->get();
        }
        return DataTables::of($data)->make(true);
    }

    public function byProduct(Request $request){
        if($request->type == 'standard'){
            $data = Dtl::selectRaw('itemcode as item_code, desc1 as short_desc, desc2 as long_desc, SUM(unitprice * qty) as gross_sales')
                ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
                ->groupBy('item_code','short_desc','long_desc')
                ->get();
        }
        else{
            $data = Dtl::selectRaw("itemcode as item_code, desc1 as short_desc, desc2 as long_desc,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date1A' AND '$request->date1B' THEN (unitprice * qty) ELSE 0 END) as gross_sales1,
                        SUM(CASE WHEN STR_TO_DATE(tdate, '%m/%d/%Y') BETWEEN '$request->date2A' AND '$request->date2B' THEN (unitprice * qty) ELSE 0 END) as gross_sales2")
                ->groupBy('item_code','short_desc','long_desc')
                ->get();
        }
        return DataTables::of($data)->make(true);
    }
}