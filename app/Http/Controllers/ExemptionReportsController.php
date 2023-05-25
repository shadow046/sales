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
use App\Models\Setup;
use App\Models\DeliveryServingStore;
use App\Models\TransactionType;

class ExemptionReportsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function reports(){
        return view('pages.exemption_reports');
    }

    public function byTransaction(Request $request){
        $data = Hdr::selectRaw('
                IF(void != 0, "VOID",
                IF(refund != 0, "REFUND",
                IF(cancelled != 0, "CANCELLED", ""))) AS exname,
                COUNT(DISTINCT tnumber) AS tno,
                SUM(gross) AS amount
            ')
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->groupBy('exname')
            ->get();
        $filteredData = $data->filter(function($item){
            return $item->exname !== '';
        });
        return DataTables::of($filteredData)->make(true);
    }

    public function byTransaction_Date(Request $request){
        $data = Hdr::select(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y')) as date, tnumber, trantype, hdr.storecode AS branch_code, store.branch_name AS store_name, CONCAT(hdr.storecode, IFNULL(CONCAT(': ', store.branch_name), '')) AS branch_name, SUM(gross) AS amount"))
            ->whereBetween(DB::raw("(STR_TO_DATE(tdate,'%m/%d/%Y'))"), [$request->start_date, $request->end_date])
            ->where($request->report_category, '!=', '0')
            ->leftJoin('store', 'store.branch_code', 'hdr.storecode')
            ->groupBy('date', 'tnumber', 'trantype', 'hdr.storecode', 'branch_code', 'store_name', 'branch_name')
            ->orderBy('store_name', 'DESC')
            ->orderBy('tnumber', 'DESC')
            ->get();
        return DataTables::of($data)->make(true);
    }

    public function byTransactionDetails(Request $request){
        $data = Dtl::selectRaw('itemcat, itemcode, desc1, desc2, SUM(qty) AS quantity, SUM(unitprice * qty) AS gross_sales')
            ->where('tnumber', $request->transcode)
            ->where($request->report_category, '!=', '0')
            ->groupBy('tdate','itemcat','itemcode','desc1','desc2')
            ->get();
        return DataTables::of($data)->make(true);
    }
}