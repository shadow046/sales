<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Pdf;
use App\Models\Store;
use Carbon\Carbon;
use DataTables;
use DB;

class PdfController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function pdf(){
        return view('pages.pdf_reports');
    }

    public function pdf_data(Request $request){
        $date_string = $request->month_range;
        $date_parts = explode('-', $date_string);
        $year = $date_parts[0];
        $month = $date_parts[1];
        $start_date = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $end_date = Carbon::createFromDate($year, $month, 1)->endOfMonth();
        $pdf_data = Pdf::selectRaw('CONCAT(uploads.storecode, IFNULL(CONCAT(": ", store.branch_name), "")) AS branch, filename, date AS dt')
                    ->selectRaw("DATE_FORMAT(CONCAT(date), '%M %d, %Y') AS date")
                    ->where('uploads.file',$request->pdf)
                    ->whereBetween(DB::raw("(STR_TO_DATE(date,'%Y-%m-%d'))"), [$start_date, $end_date])
                    ->join('store', 'store.branch_code', 'uploads.storecode')
                    ->get();
        return DataTables::of($pdf_data)->make(true);
    }
}
