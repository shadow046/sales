<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;
//Maintenance
use App\Models\TenderType;


class TenderTypeController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }


    public function tender_type(){
        return view('maintenance.tender_type');
    }
    public function tender_type_data()
    {
        return DataTables::of(
            TenderType::select()
                ->where('id','!=',0)
                ->where('tender_type_status','!=','DELETED')
                ->get()
        )->make(true);
    }

    public function tender_type_reload(){
        if(TenderType::count() == 0){
            return 'NULL';
        }
        $data_update = TenderType::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function saveTenderType(Request $request){
        // if(Type::where('type',$request->type)->count() > 0){
        //     return 'duplicate';
        // }
        $tender_type = new TenderType;
        $tender_type->tender_type = strtoupper(trim($request->tender_type));
        $save = $tender_type->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED TYPE: User successfully added Type '$tender_type->tender_type'.";
            $userlogs->save();

            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function editTenderType(Request $request){
        $tender_type = TenderType::find($request->tender_type_id);
        $tender_type->tender_type = strtoupper(trim($request->tender_type));
        $save = $tender_type->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED TYPE: User successfully updated Type '$tender_type->tender_type'.";
            $userlogs->save();
            
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function deleteTenderType(Request $request){
        $tender_type = TenderType::find($request->tender_type_id);
        $tender_type->tender_type_status = 'DELETED';
        $save = $tender_type->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED TYPE: User successfully deleted Type '$tender_type->tender_type'.";
            $userlogs->save();
            
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function checkDuplicate(Request $request){
        return TenderType::where('tender_type',$request->tender_type)->count() > 0 ? 'true': 'false';
    }
}
