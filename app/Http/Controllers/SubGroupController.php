<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;
//Maintenance
use App\Models\Subgroup;


class SubGroupController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function subgroup(){
        return view('maintenance.subgroup');
    }

    public function subgroup_data()
    {
        return DataTables::of(
            SubGroup::select()
                ->where('id','!=',0)
                ->where('subgroup_status','!=','DELETED')
                ->get()
        )->make(true);
    }

    public function subgroup_reload(){
        if(Subgroup::count() == 0){
            return 'NULL';
        }
        $data_update = Subgroup::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function saveSubgroup(Request $request){
        $subgroup_name = strtoupper(trim($request->subgroup));
        if(Subgroup::where('subgroup',$subgroup_name)->where('subgroup_status','DELETED')->count() == 0){
            $subgroup = new Subgroup;
            $subgroup->subgroup = strtoupper(trim($request->subgroup));
            $save = $subgroup->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED MALL SUB-GROUP: User successfully added Mall Sub-Group '$subgroup->subgroup'.";
                $userlogs->save();
                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            $save = Subgroup::where('subgroup', $subgroup_name)->update([
                'subgroup_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED SUB-GROUP: User successfully added Sub-Group '$subgroup_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function editSubgroup(Request $request){
        $subgroup_name_orig = Subgroup::where('id', $request->subgroup_id)->first()->subgroup;
        $subgroup_name = strtoupper(trim($request->subgroup));
        if(Subgroup::where('subgroup',$subgroup_name)->where('subgroup_status','DELETED')->count() == 0){
            if($subgroup_name != $subgroup_name_orig){
                $subgroup_new = $subgroup_name;
                $subgroup_change = "'FROM '$subgroup_name_orig' TO '$subgroup_new'";
            }
            else{
                $subgroup_change = NULL;
            }

            $subgroup = Subgroup::find($request->subgroup_id);
            $subgroup->subgroup = strtoupper(trim($request->subgroup));
            $save = $subgroup->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED MALL SUB-GROUP: User successfully updated Mall Sub-Group '$subgroup_change'.";
                $userlogs->save();
                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            if($subgroup_name != $subgroup_name_orig){
                $subgroup_new = $subgroup_name;
                $subgroup_change = "'FROM '$subgroup_name_orig' TO '$subgroup_new'";
            }
            else{
                $subgroup_change = NULL;
            }

            $subgroup = Subgroup::find($request->subgroup_id);
            $subgroup->subgroup_status = 'DELETED';
            $subgroup->save();

            $save = Subgroup::where('subgroup', $subgroup_name)->update([
                'subgroup_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED SUB-GROUP: User successfully updated Sub-Group '$subgroup_change'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function deleteSubGroup(Request $request){
        $subgroup = Subgroup::find($request->subgroup_id);
        $subgroup->subgroup_status = 'DELETED';
        $save = $subgroup->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED MALL SUB-GROUP: User successfully deleted Mall Sub-Group '$subgroup->subgroup'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function checkDuplicate(Request $request){
        return Subgroup::where('subgroup',$request->subgroup)->where('subgroup_status','!=','DELETED')->count() > 0 ? 'true': 'false';
    }
}
