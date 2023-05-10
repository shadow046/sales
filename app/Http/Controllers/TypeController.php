<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;
//Maintenance
use App\Models\Type;


class TypeController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }


    public function type(){
        return view('maintenance.type');
    }
    public function type_data()
    {
        return DataTables::of(
            Type::select()
                ->where('id','!=',0)
                ->where('type_status','!=','DELETED')
                ->get()
        )->make(true);
    }

    public function type_reload(){
        if(Type::count() == 0){
            return 'NULL';
        }
        $data_update = Type::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function saveType(Request $request){
        $type_name = strtoupper(trim($request->type));
        if(Type::where('type',$type_name)->where('type_status','DELETED')->count() == 0){
            $type = new Type;
            $type->type = strtoupper(trim($request->type));
            $save = $type->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED TYPE: User successfully added Type '$type->type'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            $save = Type::where('type', $type_name)->update([
                'type_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED TYPE: User successfully added Type '$type_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function editType(Request $request){
        $type_orig = Type::where('id', $request->type_id)->first()->type;
        $type_name = strtoupper(trim($request->type));
        if(Type::where('type',$type_name)->where('type_status','DELETED')->count() == 0){
            if($type_name != $type_orig){
                $type_new = $type_name;
                $type_change = "'FROM '$type_orig' TO '$type_new'";
            }
            else{
                $type_change = NULL;
            }

            $type = Type::find($request->type_id);
            $type->type = strtoupper(trim($request->type));
            $save = $type->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED TYPE: User successfully updated Type '$type_change'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            if($type_name != $type_orig){
                $type_new = $type_name;
                $type_change = "'FROM '$type_orig' TO '$type_new'";
            }
            else{
                $type_change = NULL;
            }

            $type = Type::find($request->type_id);
            $type->type_status = 'DELETED';
            $type->save();

            $save = Type::where('type', $type_name)->update([
                'type_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED TYPE: User successfully updated Type '$type_change'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function deleteType(Request $request){
        $type = Type::find($request->type_id);
        $type->type_status = 'DELETED';
        $save = $type->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED TYPE: User successfully deleted Type '$type->type'.";
            $userlogs->save();

            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function checkDuplicate(Request $request){
        return Type::where('type',$request->type)->where('type_status','!=','DELETED')->count() > 0 ? 'true': 'false';
    }
}
