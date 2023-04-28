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
            SUM(gross) AS gross_sales, SUM(totalsales) AS total_sales, SUM(netsales) AS net_sales')
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
            ->selectRaw('SUM(gross) AS gross_sales, SUM(totalsales) AS total_sales, SUM(netsales) AS net_sales')
            ->where('storecode', $request->colData)
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->groupBy('tdate','date')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byBranch_Product(Request $request){
        $data = Dtl::selectRaw('category.category AS itemcat, itemcode AS itemcode, short_desc AS desc1, long_desc AS desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->where('itemcat', '!=', '')
            ->where('storecode', $request->branchcode)
            ->where(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), $request->selected_date)
            ->join('products', 'products.item_code', 'dtl.itemcode')
            ->join('category', 'category.id', 'products.category')
            ->groupBy('category.category','short_desc','long_desc')
            ->groupBy('tdate','itemcat','itemcode','desc1','desc2')
            ->get();
        return DataTables::of($data)->make(true);
    }
}