<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;

use App\Models\Setup;

class SetupController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function setup(){
        return view('maintenance.setup');
    }

    public function setup_data()
    {
        return DataTables::of(
            Setup::select()
                ->where('id','!=',0)
                ->where('setup_status','!=','DELETED')
                ->get()
        )->make(true);
    }

    public function setup_reload(){
        if(Setup::count() == 0){
            return 'NULL';
        }
        $data_update = Setup::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function saveSetup(Request $request){
        $setup_name = strtoupper(trim($request->setup));
        if(Setup::where('setup',$setup_name)->where('setup_status','DELETED')->count() == 0){
            $setup = new Setup;
            $setup->setup = strtoupper(trim($request->setup));
            $save = $setup->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED SETUP: User successfully added Setup '$setup->setup'.";
                $userlogs->save();
                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            $save = Setup::where('setup', $setup_name)->update([
                'setup_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED SETUP: User successfully added Setup '$setup_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function editSetup(Request $request){
        $setup_orig = Setup::where('id', $request->setup_id)->first()->setup;
        $setup_name = strtoupper(trim($request->setup));
        if(Setup::where('setup',$request->setup)->where('setup_status','DELETED')->count() == 0){
            if($setup_name != $setup_orig){
                $setup_new = $setup_name;
                $setup_change = "'FROM '$setup_orig' TO '$setup_new'";
            }
            else{
                $setup_change = NULL;
            }

            $setup = Setup::find($request->setup_id);
            $setup->setup = strtoupper(trim($request->setup));
            $save = $setup->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UDPATED SETUP: User successfully updated Setup '$setup_change'.";
                $userlogs->save();
                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            if($setup_name != $setup_orig){
                $setup_new = $setup_name;
                $setup_change = "'FROM '$setup_orig' TO '$setup_new'";
            }
            else{
                $setup_change = NULL;
            }

            $setup = Setup::find($request->setup_id);
            $setup->setup_status = 'DELETED';
            $setup->save();

            $save = Setup::where('setup', $setup_name)->update([
                'setup_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED SETUP: User successfully added Setup '$setup_change'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function deleteSetup(Request $request){
        $setup = Setup::find($request->setup_id);
        $setup->setup_status = 'DELETED';
        $save = $setup->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED SETUP: User successfully deleted Setup '$setup->setup'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function checkDuplicate(Request $request){
        return Setup::where('setup',$request->setup)->where('setup_status','!=','DELETED')->count() > 0 ? 'true': 'false';
    }
}
