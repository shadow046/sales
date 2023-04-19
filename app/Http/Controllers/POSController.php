<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;
//Maintenance
use App\Models\Province;
use App\Models\Pos;
use App\Models\PosSpecification;
use App\Models\PromoProductCombination;


class POSController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function pos()
    {
        $provinces = Province::orderBy('provDesc', 'asc')->get();
        return view('maintenance.pos', compact('provinces'));
    }

    public function pos_data()
    {
        return DataTables::of(
            Pos::select()
                ->where('pos_status','!=','DELETED')
                ->get()
        )->make(true);
    }

    public function pos_reload(){
        if(Pos::count() == 0){
            return 'NULL';
        }
        $data_update = Pos::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function pos_specification_data(Request $request)
    {
        return DataTables::of(PosSpecification::where('pos_id',$request->id)->get())->make(true);
    }
    public function promo_product_combination_data(Request $request)
    {
        return DataTables::of(
            PromoProductCombination::selectRaw('promo_product_combination.id, promo_id, category.category as category_name, products.short_desc as short_description, products.item_code AS item_code')
            ->where('promo_id',$request->id)
            ->join('products','products.id','promo_product_combination.product_id')
            ->join('category','category.id','products.category')
            ->get())
            ->make(true);
    }

    public function savePos(Request $request){
        $model_name = strtoupper(trim($request->model));
        if(Pos::where('model',$model_name)->where('pos_status','DELETED')->count() > 0){
            $pos_id = Pos::where('model',$model_name)->where('pos_status','DELETED')->first()->id;
        }
        else{
            $pos_id = 'X';
        }
        $pos = new Pos;
        $pos->model = strtoupper(trim($request->model));
        $pos->brand = strtoupper(trim($request->brand));
        $pos->vendor = strtoupper(trim($request->vendor));
        $save = $pos->save();

        if($save){
            $result = 'true';
            $id = $pos->id;
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED POS: User successfully added POS Model '$pos->model' under Brand '$pos->brand'.";
            $userlogs->save();

            if($pos_id != 'X'){
                Pos::where('id',$pos_id)->delete();

                Pos::where('id',$id)->update([
                    'id' => $pos_id
                ]);

                $id = $pos_id;
            }
        }
        else{
            $result = 'false';
            $id = '';
        }
        $data = array('result' => $result, 'id' => $id);
        return response()->json($data);
    }

    public function savePosSpecification(Request $request){
        $posSpecification = new PosSpecification;
        $posSpecification->pos_id = $request->pos_id;
        $posSpecification->short_description = strtoupper(trim($request->short_description));
        $posSpecification->capacity = strtoupper(trim($request->capacity));
        $posSpecification->quantity = $request->quantity;
        $posSpecification->save();
    }

    public function syncPosSpecification(Request $request){
        PosSpecification::where('pos_id', $request->pos_id)->delete();
    }

    public function editPos(Request $request){
        $model_name = strtoupper(trim($request->model));
        $brand_name = strtoupper(trim($request->brand));
        $vendor_name = strtoupper(trim($request->vendor));
        if(Pos::where('model',$model_name)->where('pos_status','DELETED')->count() > 0){
            $pos_id = Pos::where('model',$model_name)->where('pos_status','DELETED')->first()->id;
            $save = 'X';
        }
        else{
            $pos_id = 'X';
            $pos = Pos::find($request->id);
            $pos->model = $model_name;
            $pos->brand = $brand_name;
            $pos->vendor = $vendor_name;
            $save = $pos->save();
            $id = $pos->id;
        }

        if($save){
            $result = 'true';
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED POS: User successfully updated POS Model '$model_name' under Brand '$brand_name'.";
            $userlogs->save();

            if($pos_id != 'X'){
                Pos::where('id',$request->id)->update([
                    'pos_status' => 'DELETED'
                ]);

                Pos::where('id',$pos_id)->update([
                    'brand' => $brand_name,
                    'vendor' => $vendor_name,
                    'pos_status' => 'ACTIVE'
                ]);

                $id = $pos_id;
            }
        }
        else{
            $result = 'false';
            $id = '';
        }
        $data = array('result' => $result, 'id' => $id);
        return response()->json($data);
    }

    public function deletePos(Request $request){
        $pos = Pos::find($request->id);
        $pos->model = $request->model;
        $pos->brand = ucwords($request->brand);
        $pos->vendor = ucwords($request->vendor);
        $pos->pos_status = 'DELETED';
        $save = $pos->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED POS: User successfully deleted POS Model '$pos->model' under Brand '$pos->brand'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function pos_specification_delete(Request $request){
        $pos_id = explode(",",$request->id);
        foreach($pos_id as $id){
            PosSpecification::where('id', $id)->delete();
        }
    }

    public function checkDuplicate(Request $request){
        return Pos::where('model',$request->model)->where('pos_status','!=','DELETED')->count() > 0 ? 'duplicate_model': '';
    }
}
