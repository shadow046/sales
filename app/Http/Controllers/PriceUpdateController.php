<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;

use App\Models\PriceUpdate;


class PriceUpdateController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function price_update(){
        $products = Product::selectRaw('item_code AS fcode, short_desc AS desc1')->where('status', 'ACTIVE')->get()->sortBy('item_code');
        return view('pages.price_update', compact('products'));
    }

    public function price_update_data(){
        return DataTables::of(
            PriceUpdate::select()
                ->where('price_update_status','=','0')
                ->orderBy('effdate', 'DESC')
                ->orderBy('fcode', 'ASC')
                ->get()
        )->make(true);
    }

    public function fetchCurrentPrices(Request $request){
        return Product::where('item_code', $request->item_code)->first();
    }

    public function savePriceUpdate(Request $request){
        if(PriceUpdate::where('fcode', $request->fcode)
            ->where('price_update_status', '0')
            ->first()
            ){
            return 'pending';
        }
        $priceUpdate = new PriceUpdate;
        $priceUpdate->fcode = $request->fcode;
        $priceUpdate->desc1 = $request->desc1;
        $priceUpdate->effdate = $request->effdate;
        $priceUpdate->upa1 = $request->upa1;
        $priceUpdate->upa2 = $request->upa2;
        $priceUpdate->upa3 = $request->upa3;
        $priceUpdate->upa4 = $request->upa4;
        $priceUpdate->upa5 = $request->upa5;
        $priceUpdate->upa6 = $request->upa6;
        $priceUpdate->upa7 = $request->upa7;
        $priceUpdate->upa8 = $request->upa8;
        $sql = $priceUpdate->save();

        if($sql){
            $upa1_orig = Product::where('item_code', $request->fcode)->first()->dine_in;
            $upa2_orig = Product::where('item_code', $request->fcode)->first()->take_out;
            $upa3_orig = Product::where('item_code', $request->fcode)->first()->pick_up;
            $upa4_orig = Product::where('item_code', $request->fcode)->first()->delivery;
            $upa5_orig = Product::where('item_code', $request->fcode)->first()->bulk_order;
            $upa6_orig = Product::where('item_code', $request->fcode)->first()->fds;
            $upa7_orig = Product::where('item_code', $request->fcode)->first()->drive_thru;
            $upa8_orig = Product::where('item_code', $request->fcode)->first()->meal_type;

            if($upa1_orig !=  $request->upa1){
                $upa1_1 = number_format($upa1_orig, 2);
                $upa1_2 = number_format($request->upa1, 2);
                $upa1 = "【Dine-In Price: FROM '$upa1_1' TO '$upa1_2'】";
            }
            else{
                $upa1 = NULL;
            }
            if($upa2_orig !=  $request->upa2){
                $upa2_1 = number_format($upa2_orig, 2);
                $upa2_2 = number_format($request->upa2, 2);
                $upa2 = "【Take-Out Price: FROM '$upa2_1' TO '$upa2_2'】";
            }
            else{
                $upa2 = NULL;
            }
            if($upa3_orig !=  $request->upa3){
                $upa3_1 = number_format($upa3_orig, 2);
                $upa3_2 = number_format($request->upa3, 2);
                $upa3 = "【Pick-Up Price: FROM '$upa3_1' TO '$upa3_2'】";
            }
            else{
                $upa3 = NULL;
            }
            if($upa4_orig !=  $request->upa4){
                $upa4_1 = number_format($upa4_orig, 2);
                $upa4_2 = number_format($request->upa4, 2);
                $upa4 = "【Delivery Price: FROM '$upa4_1' TO '$upa4_2'】";
            }
            else{
                $upa4 = NULL;
            }
            if($upa5_orig !=  $request->upa5){
                $upa5_1 = number_format($upa5_orig, 2);
                $upa5_2 = number_format($request->upa5, 2);
                $upa5 = "【Bulk Order: FROM '$upa5_1' TO '$upa5_2'】";
            }
            else{
                $upa5 = NULL;
            }
            if($upa6_orig !=  $request->upa6){
                $upa6_1 = number_format($upa6_orig, 2);
                $upa6_2 = number_format($request->upa6, 2);
                $upa6 = "【PDS Price: FROM '$upa6_1' TO '$upa6_2'】";
            }
            else{
                $upa6 = NULL;
            }
            if($upa7_orig !=  $request->upa7){
                $upa7_1 = number_format($upa7_orig, 2);
                $upa7_2 = number_format($request->upa7, 2);
                $upa7 = "【Drive-Thru Price: FROM '$upa7_1' TO '$upa7_2'】";
            }
            else{
                $upa7 = NULL;
            }
            if($upa8_orig !=  $request->upa8){
                $upa8_1 = number_format($upa8_orig, 2);
                $upa8_2 = number_format($request->upa8, 2);
                $upa8 = "【Add. Meal Type: FROM '$upa8_1' TO '$upa8_2'】";
            }
            else{
                $upa8 = NULL;
            }

            $date = Carbon::parse($request->effdate)->isoformat('dddd, MMMM DD, YYYY');
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED PRICE UPDATE: User successfully added Price Update for '$request->desc1' effective on $date with the following CHANGES: $upa1 $upa2 $upa3 $upa4 $upa5 $upa6 $upa7 $upa8";
            $userlogs->save();

            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function editPriceUpdate(Request $request){
        $fcode_orig = PriceUpdate::where('recid', $request->id)->first()->fcode;
        $desc1_orig = PriceUpdate::where('recid', $request->id)->first()->desc1;
        $effdate_orig = PriceUpdate::where('recid', $request->id)->first()->effdate;
        $upa1_orig = PriceUpdate::where('recid', $request->id)->first()->upa1;
        $upa2_orig = PriceUpdate::where('recid', $request->id)->first()->upa2;
        $upa3_orig = PriceUpdate::where('recid', $request->id)->first()->upa3;
        $upa4_orig = PriceUpdate::where('recid', $request->id)->first()->upa4;
        $upa5_orig = PriceUpdate::where('recid', $request->id)->first()->upa5;
        $upa6_orig = PriceUpdate::where('recid', $request->id)->first()->upa6;
        $upa7_orig = PriceUpdate::where('recid', $request->id)->first()->upa7;
        $upa8_orig = PriceUpdate::where('recid', $request->id)->first()->upa8;
        if($fcode_orig != $request->fcode){
            if(PriceUpdate::where('fcode', $request->fcode)
                ->where('price_update_status', '0')
                ->first()
                ){
                return 'pending';
            }
        }
        if(
            $fcode_orig == $request->fcode &&
            $desc1_orig == $request->desc1 &&
            $effdate_orig == $request->effdate &&
            $upa1_orig == $request->upa1 &&
            $upa2_orig == $request->upa2 &&
            $upa3_orig == $request->upa3 &&
            $upa4_orig == $request->upa4 &&
            $upa5_orig == $request->upa5 &&
            $upa6_orig == $request->upa6 &&
            $upa7_orig == $request->upa7 &&
            $upa8_orig == $request->upa8
            ){
            return 'nochanges';
        }

        if($fcode_orig !=  $request->fcode){
            $fcode = "【Product: FROM '$fcode_orig: $desc1_orig' TO '$request->fcode: $request->desc1'】";
        }
        else{
            $fcode = NULL;
        }
        if($effdate_orig !=  $request->effdate){
            $effdate1 = Carbon::parse($effdate_orig)->isoformat('MMM. DD, YYYY');
            $effdate2 = Carbon::parse($request->effdate)->isoformat('MMM. DD, YYYY');
            $effdate = "【Effectivity Date: FROM '$effdate1' TO '$effdate2'】";
        }
        else{
            $effdate = NULL;
        }
        if($upa1_orig !=  $request->upa1){
            $upa1_1 = number_format($upa1_orig, 2);
            $upa1_2 = number_format($request->upa1, 2);
            $upa1 = "【Dine-In Price: FROM '$upa1_1' TO '$upa1_2'】";
        }
        else{
            $upa1 = NULL;
        }
        if($upa2_orig !=  $request->upa2){
            $upa2_1 = number_format($upa2_orig, 2);
            $upa2_2 = number_format($request->upa2, 2);
            $upa2 = "【Take-Out Price: FROM '$upa2_1' TO '$upa2_2'】";
        }
        else{
            $upa2 = NULL;
        }
        if($upa3_orig !=  $request->upa3){
            $upa3_1 = number_format($upa3_orig, 2);
            $upa3_2 = number_format($request->upa3, 2);
            $upa3 = "【Pick-Up Price: FROM '$upa3_1' TO '$upa3_2'】";
        }
        else{
            $upa3 = NULL;
        }
        if($upa4_orig !=  $request->upa4){
            $upa4_1 = number_format($upa4_orig, 2);
            $upa4_2 = number_format($request->upa4, 2);
            $upa4 = "【Delivery Price: FROM '$upa4_1' TO '$upa4_2'】";
        }
        else{
            $upa4 = NULL;
        }
        if($upa5_orig !=  $request->upa5){
            $upa5_1 = number_format($upa5_orig, 2);
            $upa5_2 = number_format($request->upa5, 2);
            $upa5 = "【Bulk Order: FROM '$upa5_1' TO '$upa5_2'】";
        }
        else{
            $upa5 = NULL;
        }
        if($upa6_orig !=  $request->upa6){
            $upa6_1 = number_format($upa6_orig, 2);
            $upa6_2 = number_format($request->upa6, 2);
            $upa6 = "【PDS Price: FROM '$upa6_1' TO '$upa6_2'】";
        }
        else{
            $upa6 = NULL;
        }
        if($upa7_orig !=  $request->upa7){
            $upa7_1 = number_format($upa7_orig, 2);
            $upa7_2 = number_format($request->upa7, 2);
            $upa7 = "【Drive-Thru Price: FROM '$upa7_1' TO '$upa7_2'】";
        }
        else{
            $upa7 = NULL;
        }
        if($upa8_orig !=  $request->upa8){
            $upa8_1 = number_format($upa8_orig, 2);
            $upa8_2 = number_format($request->upa8, 2);
            $upa8 = "【Add. Meal Type: FROM '$upa8_1' TO '$upa8_2'】";
        }
        else{
            $upa8 = NULL;
        }
        $sql = PriceUpdate::where('recid', $request->id)
            ->update([
                'fcode' => $request->fcode,
                'desc1' => $request->desc1,
                'effdate' => $request->effdate,
                'upa1' => $request->upa1,
                'upa2' => $request->upa2,
                'upa3' => $request->upa3,
                'upa4' => $request->upa4,
                'upa5' => $request->upa5,
                'upa6' => $request->upa6,
                'upa7' => $request->upa7,
                'upa8' => $request->upa8
            ]);
        if($sql){
            $date = Carbon::parse($request->effdate)->isoformat('dddd, MMMM DD, YYYY');
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED PRICE UPDATE: User successfully updated Price Update for '$request->desc1' with the following CHANGES: $fcode $effdate $upa1 $upa2 $upa3 $upa4 $upa5 $upa6 $upa7 $upa8";
            $userlogs->save();

            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function deletePriceUpdate(Request $request){
        $desc1 = PriceUpdate::where('recid', $request->id)->first()->desc1;
        $effdate = PriceUpdate::where('recid', $request->id)->first()->effdate;
        $sql = PriceUpdate::where('recid', $request->id)->delete();
        if($sql){
            $date = Carbon::parse($effdate)->isoformat('dddd, MMMM DD, YYYY');
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED PRICE UPDATE: User successfully deleted Price Update for '$desc1' which was supposedly effective on $date.";
            $userlogs->save();

            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function sendPriceUpdate(Request $request){
        $sql = PriceUpdate::where('price_update_status','=','0')->update(['price_update_status' => '1']);
        if($sql){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "SENT PRICE UPDATE: User successfully sent Price Updates for processing.";
            $userlogs->save();

            return 'true';
        }
        else{
            return 'false';
        }
    }
}