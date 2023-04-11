<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;
//Maintenance
use App\Models\TransactionType;


class TransactionTypeController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function transaction_type(){
        return view('maintenance.transaction_type');
    }

    public function transaction_type_data()
    {
        return DataTables::of(
            TransactionType::select()
                ->where('id','!=',0)
                ->where('transaction_type_status','!=','DELETED')
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

    public function saveTransactionType(Request $request){

        $transaction_type = new TransactionType;
        $transaction_type->transaction_type = strtoupper(trim($request->transaction_type));
        $save = $transaction_type->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED TRANSACTION TYPE: User successfully added Transaction Type '$transaction_type->transaction_type'.";
            $userlogs->save();

            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function editTransactionType(Request $request){
        $transaction_type = TransactionType::find($request->transaction_type_id);
        $transaction_type->transaction_type = strtoupper(trim($request->transaction_type));
        $save = $transaction_type->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED TRANSACTION TYPE: User successfully updated Transaction Type '$transaction_type->transaction_type'.";
            $userlogs->save();

            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function deleteTransactionType(Request $request){
        $transaction_type = TransactionType::find($request->transaction_type_id);
        $transaction_type->transaction_type_status = 'DELETED';
        $save = $transaction_type->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED TRANSACTION TYPE: User successfully deleted Transaction Type '$transaction_type->transaction_type'.";
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
