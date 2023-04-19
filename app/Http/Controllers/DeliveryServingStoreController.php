<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;
//Maintenance
use App\Models\DeliveryServingStore;


class DeliveryServingStoreController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function delivery_serving_store(){
        return view('maintenance.delivery_serving_store');
    }

    public function delivery_serving_store_data()
    {
        return DataTables::of(
            DeliveryServingStore::select()
                ->where('id','!=',0)
                ->where('delivery_serving_store_status','!=','DELETED')
                ->get()
        )->make(true);
    }

    public function serving_store_reload(){
        if(DeliveryServingStore::count() == 0){
            return 'NULL';
        }
        $data_update = DeliveryServingStore::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function saveDeliveryServingStore(Request $request){
        $delivery_name = strtoupper(trim($request->delivery_serving_store));
        if(DeliveryServingStore::where('delivery_serving_store',$request->delivery_serving_store)->where('delivery_serving_store_status','DELETED')->count() == 0){
            $delivery_serving_store = new DeliveryServingStore;
            $delivery_serving_store->delivery_serving_store = strtoupper(trim($request->delivery_serving_store));
            $save = $delivery_serving_store->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED DELIVERY CHANNEL: User successfully added Delivery Channel  '$delivery_serving_store->delivery_serving_store'.";
                $userlogs->save();
                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            $save = DeliveryServingStore::where('delivery_serving_store', $delivery_name)->update([
                'delivery_serving_store_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED DELIVERY CHANNEL: User successfully added Delivery Channel '$delivery_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function editDeliveryServingStore(Request $request){
        $delivery_name = strtoupper(trim($request->delivery_serving_store));
        if(DeliveryServingStore::where('delivery_serving_store',$request->delivery_serving_store)->where('delivery_serving_store_status','DELETED')->count() == 0){
            $delivery_serving_store = DeliveryServingStore::find($request->delivery_serving_store_id);
            $delivery_serving_store->delivery_serving_store = strtoupper(trim($request->delivery_serving_store));
            $save = $delivery_serving_store->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED DELIVERY CHANNEL: User successfully updated Delivery Channel  '$delivery_serving_store->delivery_serving_store'.";
                $userlogs->save();
                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            $delivery_serving_store = DeliveryServingStore::find($request->delivery_serving_store_id);
            $delivery_serving_store->delivery_serving_store_status = 'DELETED';
            $delivery_serving_store->save();

            $save = DeliveryServingStore::where('delivery_serving_store', $delivery_name)->update([
                'delivery_serving_store_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED DELIVERY CHANNEL: User successfully updated Delivery Channel '$delivery_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function deleteDeliveryServingStore(Request $request){
        $delivery_serving_store = DeliveryServingStore::find($request->delivery_serving_store_id);
        $delivery_serving_store->delivery_serving_store_status = 'DELETED';
        $save = $delivery_serving_store->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED DELIVERY CHANNEL: User successfully deleted Delivery Channel '$delivery_serving_store->delivery_serving_store'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function checkDuplicate(Request $request){
        return DeliveryServingStore::where('delivery_serving_store',$request->delivery_serving_store)->where('delivery_serving_store_status','!=','DELETED')->count() > 0 ? 'true': 'false';
    }
}
