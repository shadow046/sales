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
        return view('pages.generate_reports');
    }

    public function byBranch(Request $request){
        $data = Hdr::selectRaw('hdr.storecode AS branch_code, CONCAT(hdr.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch_name,
            company.company_name AS company_name, store_area.store_area AS store_area, store.region AS region,
            type.type AS type, group.group AS store_group, subgroup.subgroup AS subgroup, network_setup.network_setup AS network_setup,
            SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->leftjoin('store', 'store.branch_code', 'hdr.storecode')
            ->join('company', 'company.id', 'store.company_name')
            ->join('store_area', 'store_area.id', 'store.store_area')
            ->join('type', 'type.id', 'store.type')
            ->join('group', 'group.id', 'store.group')
            ->join('subgroup', 'subgroup.id', 'store.sub_group')
            ->join('network_setup', 'network_setup.id', 'store.network')
            ->groupBy('hdr.storecode','branch_code','branch_name','company_name','store_area','region','type','store_group','subgroup','network_setup')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byBranch_Date(Request $request){
        $data = Hdr::selectRaw("(STR_TO_DATE(tdate,'%m/%d/%Y')) AS date")
            ->selectRaw('SUM(gross) as gross_sales, SUM(totalsales) as total_sales, SUM(netsales) as net_sales')
            ->where('storecode', $request->colData)
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->groupBy('tdate','date')
            ->get();
        return DataTables::of($data)->make(true);
    }
}