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
        $tender_name = strtoupper(trim($request->tender_type));
        if(TenderType::where('tender_type',$tender_name)->where('tender_type_status','DELETED')->count() == 0){
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
        else{
            $save = TenderType::where('tender_type', $tender_name)->update([
                'tender_type_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED TENDER TYPE: User successfully added Tender Type '$tender_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function editTenderType(Request $request){
        $tender_name_orig = TenderType::where('id', $request->tender_type_id)->first()->tender_type;
        $tender_name = strtoupper(trim($request->tender_type));
        if(TenderType::where('tender_type',$tender_name)->where('tender_type_status','DELETED')->count() == 0){
            if($tender_name != $tender_name_orig){
                $tender_name_new = $tender_name;
                $tender_name_change = "'FROM '$tender_name_orig' TO '$tender_name_new'";
            }
            else{
                $tender_name_change = NULL;
            }

            $tender_type = TenderType::find($request->tender_type_id);
            $tender_type->tender_type = strtoupper(trim($request->tender_type));
            $save = $tender_type->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED TYPE: User successfully updated Type '$tender_name_change'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            if($tender_name != $tender_name_orig){
                $tender_name_new = $tender_name;
                $tender_name_change = "'FROM '$tender_name_orig' TO '$tender_name_new'";
            }
            else{
                $tender_name_change = NULL;
            }

            $tender_type = TenderType::find($request->tender_type_id);
            $tender_type->tender_type_status = 'DELETED';
            $tender_type->save();

            $save = TenderType::where('tender_type', $tender_name)->update([
                'tender_type_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED TENDER TYPE: User successfully updated Tender Type '$tender_name_change'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
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
        return TenderType::where('tender_type',$request->tender_type)->where('tender_type_status','!=','DELETED')->count() > 0 ? 'true': 'false';
    }
}
