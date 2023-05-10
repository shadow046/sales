<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;
//Maintenance
use App\Models\Discount;


class DiscountController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function discount(){
        return view('maintenance.discount');
    }

    public function discount_data()
    {
        return DataTables::of(
            Discount::select()
                ->where('id','!=',0)
                ->where('discount_status','!=','DELETED')
                ->orderBy('id','ASC')
                ->get()
        )->make(true);
    }

    public function discount_reload(){
        if(Discount::count() == 0){
            return 'NULL';
        }
        $data_update = Discount::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function saveDiscount(Request $request){
        $discount_name = strtoupper(trim($request->discount));
        if(Discount::where('discount',$discount_name)->where('discount_status','DELETED')->count() == 0){
            $discount = new Discount;
            $discount->discount = strtoupper(trim($request->discount));
            $save = $discount->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED DISCOUNT: User successfully added Discount '$discount->discount'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            $save = Discount::where('discount', $discount_name)->update([
                'discount_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED DISCOUNT: User successfully added Discount '$discount_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function editDiscount(Request $request){
        $discount_orig = Discount::where('id', $request->discount_id)->first()->discount;
        $discount_name = strtoupper(trim($request->discount));
        if(Discount::where('discount',$discount_name)->where('discount_status','DELETED')->count() == 0){
            if($discount_name != $discount_orig){
                $discount_new = $discount_name;
                $discount_change = "'FROM '$discount_orig' TO '$discount_new'";
            }
            else{
                $discount_change = NULL;
            }

            $discount = Discount::find($request->discount_id);
            $discount->discount = strtoupper(trim($request->discount));
            $save = $discount->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED DISCOUNT: User successfully updated Discount '$discount_change'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            if($discount_name != $discount_orig){
                $discount_new = $discount_name;
                $discount_change = "'FROM '$discount_orig' TO '$discount_new'";
            }
            else{
                $discount_change = NULL;
            }

            $discount = Discount::find($request->discount_id);
            $discount->discount_status = 'DELETED';
            $discount->save();

            $save = Discount::where('discount', $discount_name)->update([
                'discount_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED DISCOUNT: User successfully updated Discount '$discount_change'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function deleteDiscount(Request $request){
        $discount = Discount::find($request->discount_id);
        $discount->discount_status = 'DELETED';
        $save = $discount->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED DISCOUNT: User successfully deleted Discount '$discount->discount'.";
            $userlogs->save();

            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function checkDuplicate(Request $request){
        return Discount::where('discount',$request->discount)->where('discount_status','!=','DELETED')->count() > 0 ? 'true': 'false';
    }
}
