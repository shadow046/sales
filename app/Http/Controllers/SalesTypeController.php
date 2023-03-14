<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;

use App\Models\SalesType;


class SalesTypeController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function sales_type(){
        return view('maintenance.sales_type');
    }

    public function sales_type_data(){
        return DataTables::of(
            SalesType::select()
                ->where('id','!=',0)
                ->where('sales_type_status','!=','DELETED')
                ->get()
        )->make(true);
    }

    public function sales_type_reload(){
        if(SalesType::count() == 0){
            return 'NULL';
        }
        $data_update = SalesType::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function saveSalesType(Request $request){
        if(SalesType::where('sales_type',$request->sales_type)->count() > 0){
            return 'duplicate';
        }
        $sales_type = new SalesType;
        $sales_type->sales_type = strtoupper(trim($request->sales_type));
        $save = $sales_type->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED SALES TYPE: User successfully added Sales Type  '$request->sales_type'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function editSalesType(Request $request){
        $sales_type = SalesType::find($request->sales_type_id);
        $sales_type->sales_type = strtoupper(trim($request->sales_type));
        $save = $sales_type->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED SALES TYPE: User successfully updated Sales Type  '$request->sales_type'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function deleteSalesType(Request $request){
        $sales_type = SalesType::find($request->sales_type_id);
        $sales_type->sales_type_status = 'DELETED';
        $save = $sales_type->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED SALES TYPE: User successfully deleted Sales Type  '$request->sales_type'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function checkDuplicate(Request $request){
        return SalesType::where('sales_type',$request->sales_type)->count() > 0 ? 'true': 'false';
    }
}
