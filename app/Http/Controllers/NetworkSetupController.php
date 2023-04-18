<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;
//Maintenance
use App\Models\NetworkSetup;


class NetworkSetupController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function network_setup(){
        return view('maintenance.network_setup');
    }

    public function network_setup_data()
    {
        return DataTables::of(
            NetworkSetup::select()
                ->where('id','!=',0)
                ->where('network_setup_status','!=','DELETED')
                ->get()
        )->make(true);
    }

    public function network_setup_reload(){
        if(NetworkSetup::count() == 0){
            return 'NULL';
        }
        $data_update = NetworkSetup::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function saveNetworkSetup(Request $request){
        $network_name = strtoupper(trim($request->network_setup));
        if(NetworkSetup::where('network_setup',$network_name)->where('network_setup_status','DELETED')->count() == 0){
            $network_setup = new NetworkSetup;
            $network_setup->network_setup = strtoupper(trim($request->network_setup));
            $save = $network_setup->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED NETWORK SETUP: User successfully added Network Setup '$network_setup->network_setup'.";
                $userlogs->save();
                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            $save = NetworkSetup::where('network_setup', $network_name)->update([
                'network_setup_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED NETWORK SETUP: User successfully added Network Setup '$network_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function editNetworkSetup(Request $request){
        $network_name = strtoupper(trim($request->network_setup));
        if(NetworkSetup::where('network_setup',$network_name)->where('network_setup_status','DELETED')->count() == 0){
            $network_setup = new NetworkSetup;
            $network_setup->network_setup = strtoupper(trim($request->network_setup));
            $save = $network_setup->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED NETWORK SETUP: User successfully updated Network Setup '$network_setup->network_setup'.";
                $userlogs->save();
                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            $save = NetworkSetup::where('network_setup', $network_name)->update([
                'network_setup_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED NETWORK SETUP: User successfully updated Network Setup '$network_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function deleteNetworkSetup(Request $request){
        $network_setup = NetworkSetup::find($request->network_setup_id);
        $network_setup->network_setup_status = 'DELETED';
        $save = $network_setup->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED NETWORK SETUP: User successfully deleted Network Setup  '$network_setup->network_setup'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function checkDuplicate(Request $request){
        return NetworkSetup::where('network_setup',$request->network_setup)->where('network_setup_status','!=','DELETED')->count() > 0 ? 'true': 'false';
    }
}
