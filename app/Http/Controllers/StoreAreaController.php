<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;
//Maintenance
use App\Models\StoreArea;

class StoreAreaController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function store_area(){
        return view('maintenance.store_area');
    }

    public function store_area_data()
    {
        return DataTables::of(
            StoreArea::select()
                ->where('id','!=',0)
                ->where('store_area_status','!=','DELETED')
                ->get()
        )->make(true);
    }

    public function store_area_reload(){
        if(StoreArea::count() == 0){
            return 'NULL';
        }
        $data_update = StoreArea::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function saveStoreArea(Request $request){
        $store_area = new StoreArea;
        $store_area->store_area = strtoupper(trim($request->store_area));
        $save = $store_area->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED STORE AREA: User successfully added Store Area '$store_area->store_area'.";
            $userlogs->save();

            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function editStoreArea(Request $request){
        $store_area = StoreArea::find($request->store_area_id);
        $store_area->store_area = strtoupper($request->store_area);
        $save = $store_area->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED STORE AREA: User successfully updated Store Area '$store_area->store_area'.";
            $userlogs->save();
            
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function deleteStoreArea(Request $request){
        $store_area = StoreArea::find($request->store_area_id);
        $store_area->store_area_status = 'DELETED';
        $save = $store_area->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED STORE AREA: User successfully deleted Store Area '$store_area->store_area'.";
            $userlogs->save();
            
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function checkDuplicate(Request $request){
        return StoreArea::where('store_area',$request->store_area)->count() > 0 ? 'true': 'false';
    }
}
