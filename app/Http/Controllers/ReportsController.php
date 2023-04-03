<?php

namespace App\Http\Controllers;

use DB;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

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
        $data = Hdr::selectRaw('store_area.store_area, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, sum(netsales) as net_sales')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->join('store', 'store.branch_code', 'hdr.storecode')
            ->join('store_area', 'store_area.id', 'store.store_area')
            ->groupBy('store_area.store_area')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byRegion(Request $request){
        $data = Hdr::selectRaw('store.region, SUM(gross) as gross_sales, SUM(totalsales) as total_sales, sum(netsales) as net_sales')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->join('store', 'store.branch_code', 'hdr.storecode')
            ->groupBy('store.region')
            ->get();
        return DataTables::of($data)->make(true);
    }
}