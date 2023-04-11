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
                ->get()
        )->make(true);
    }

    public function transaction_type_reload(){
        if(TransactionType::count() == 0){
            return 'NULL';
        }
        $data_update = TransactionType::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function saveDiscount(Request $request){

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

    public function editDiscount(Request $request){
        $discount = Discount::find($request->discount_id);
        $discount->discount = strtoupper(trim($request->discount));
        $save = $discount->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED DISCOUNT: User successfully updated Discount '$discount->discount'.";
            $userlogs->save();

            return 'true';
        }
        else{
            return 'false';
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
        return Type::where('type',$request->type)->count() > 0 ? 'true': 'false';
    }
}
