<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;
//Maintenance
use App\Models\Group;


class GroupController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }
    public function group(){
        return view('maintenance.group');
    }

    public function group_data()
    {
        return DataTables::of(
            Group::select()
                ->where('id','!=',0)
                ->where('group_status','!=','DELETED')
                ->get()
        )->make(true);
    }

    public function group_reload(){
        if(Group::count() == 0){
            return 'NULL';
        }
        $data_update = Group::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function saveGroup(Request $request){
        $group_name = strtoupper(trim($request->group));
        if(Group::where('group',$group_name)->where('group_status','DELETED')->count() == 0){
            $group = new Group;
            $group->group = strtoupper(trim($request->group));
            $save = $group->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED GROUP: User successfully added Group '$group->group'.";
                $userlogs->save();
                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            $save = Group::where('group', $group_name)->update([
                'group_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED GROUP: User successfully added Group '$group_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function editGroup(Request $request){
        $group_name = strtoupper(trim($request->group));
        if(Group::where('group',$group_name)->where('group_status','DELETED')->count() == 0){
            $group = Group::find($request->group_id);
            $group->group = strtoupper(trim($request->group));
            $save = $group->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED GROUP: User successfully updated Group '$group->group'.";
                $userlogs->save();
                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            $save = Group::where('group', $group_name)->update([
                'group_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED GROUP: User successfully added Group '$group_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function deleteGroup(Request $request){
        $group = Group::find($request->group_id);
        $group->group_status = 'DELETED';
        $save = $group->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED GROUP: User successfully deleted Group '$group->group'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function checkDuplicate(Request $request){
        return Group::where('group',$request->group)->where('group_status','!=','DELETED')->count() > 0 ? 'true': 'false';
    }
}
