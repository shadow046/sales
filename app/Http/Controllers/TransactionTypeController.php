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
                ->orderBy('transaction_type.id', 'ASC')
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
        $tran_type = strtoupper(trim($request->transaction_type));
        if(TransactionType::where('transaction_type',$request->transaction_type)->where('transaction_type_status','DELETED')->count() == 0){
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
        else{
            $save = TransactionType::where('transaction_type', $tran_type)->update([
                'transaction_type_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED TRANSACTION TYPE: User successfully added Transaction Type '$tran_type'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function editTransactionType(Request $request){
        $tran_type_orig = TransactionType::where('id', $request->transaction_type_id)->first()->transaction_type;
        $tran_type = strtoupper(trim($request->transaction_type));
        if(TransactionType::where('transaction_type',$request->transaction_type)->where('transaction_type_status','DELETED')->count() == 0){
            if($tran_type != $tran_type_orig){
                $tran_type_new = $tran_type;
                $tran_type_change = "'FROM '$tran_type_orig' TO '$tran_type_new'";
            }
            else{
                $tran_type_change = NULL;
            }

            $transaction_type = TransactionType::find($request->transaction_type_id);
            $transaction_type->transaction_type = strtoupper(trim($request->transaction_type));
            $save = $transaction_type->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED TRANSACTION TYPE: User successfully updated Transaction Type '$tran_type_change'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            if($tran_type != $tran_type_orig){
                $tran_type_new = $tran_type;
                $tran_type_change = "'FROM '$tran_type_orig' TO '$tran_type_new'";
            }
            else{
                $tran_type_change = NULL;
            }

            $transaction_type = TransactionType::find($request->transaction_type_id);
            $transaction_type->transaction_type_status = 'DELETED';
            $transaction_type->save();

            $save = TransactionType::where('transaction_type', $tran_type)->update([
                'transaction_type_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED TRANSACTION TYPE: User successfully added Transaction Type '$tran_type_change'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
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
        return TransactionType::where('transaction_type',$request->transaction_type)->where('transaction_type_status','!=','DELETED')->count() > 0 ? 'true': 'false';
    }
}
