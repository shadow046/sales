<?php

namespace App\Http\Controllers;

use DB;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;
use Maatwebsite\Excel\Facades\Excel;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;
use App\Imports\StoreImport;

use App\Models\Store;
use App\Models\StoreContactDetails;
use App\Models\StorePosInformation;
use App\Models\Province;
use App\Models\Pos;
use App\Models\Type;
use App\Models\Setup;
use App\Models\Group;
use App\Models\Subgroup;
use App\Models\NetworkSetup;
use App\Models\DeliveryServingStore;
use App\Models\Company;
use App\Models\StoreArea;

class StoreController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function store()
    {
        $provinces = Province::orderBy('provDesc', 'asc')->get();
        $companies = Company::select('id','company_name')->where('id','!=','0')->get()->sortBy('company_name');
        $poss = Pos::select('id', 'model')->where('id','!=','0')->where('pos_status','!=','DELETED')->get()->sortBy('model');
        $types = Type::select('id', 'type')->where('id','!=','0')->where('type_status','!=','DELETED')->get()->sortBy('type');
        $setups = Setup::select('id', 'setup')->where('id','!=','0')->where('setup_status','!=','DELETED')->get()->sortBy('setup');
        $groups = Group::select('id', 'group')->where('id','!=','0')->where('group_status','!=','DELETED')->get()->sortBy('group');
        $subgroups = Subgroup::select('id', 'subgroup')->where('id','!=','0')->where('subgroup_status','!=','DELETED')->get()->sortBy('subgroup');
        $network_setups = NetworkSetup::select('id', 'network_setup')->where('id','!=','0')->where('network_setup_status','!=','DELETED')->get()->sortBy('network_setup');
        $delivery_serving_stores = DeliveryServingStore::select('id', 'delivery_serving_store')->where('id','!=','0')->where('delivery_serving_store_status','!=','DELETED')->get()->sortBy('delivery_serving_store');
        $store_areas = StoreArea::select('id', 'store_area')->where('id','!=','0')->where('store_area_status','!=','DELETED')->get()->sortBy('store_area');
        return view('pages.store', compact('provinces','companies','poss','types','setups','groups','subgroups','network_setups','delivery_serving_stores','store_areas'));
    }

    public function store_data(Request $request)
    {
        if($request->filter == 'coowned'){
            $list = Store::selectRaw('store.id AS id, store.company_name, tin, branch_code, branch_name, store.address AS address_name, store.province AS province_name, store.city AS city_name, store.region AS region_name, store.type, store.setup, store.group, store.sub_group, store.network, store.serving_store, store.status')
                ->selectRaw('company.company_name AS comp_name, type.type AS type_name, group.group AS group_name, subgroup.subgroup AS subgroup_name, network_setup.network_setup AS network_setup_name, store_area.store_area AS store_area_name, store_area.id AS store_area')
                ->where('store.type','1')
                ->join('company', 'company.id','store.company_name')
                ->join('type', 'type.id','store.type')
                ->join('group', 'group.id','store.group')
                ->join('subgroup','subgroup.id','store.sub_group')
                ->join('network_setup','network_setup.id','store.network')
                ->join('store_area','store_area.id','store.store_area')
                ->get();
        }
        else if($request->filter == 'franchise'){
            $list = Store::selectRaw('store.id AS id, store.company_name, tin, branch_code, branch_name, store.address AS address_name, store.province AS province_name, store.city AS city_name, store.region AS region_name, store.type, store.setup, store.group, store.sub_group, store.network, store.serving_store, store.status')
                ->selectRaw('company.company_name AS comp_name, type.type AS type_name, group.group AS group_name, subgroup.subgroup AS subgroup_name, network_setup.network_setup AS network_setup_name, store_area.store_area AS store_area_name, store_area.id AS store_area')
                ->where('store.type','2')
                ->join('company', 'company.id','store.company_name')
                ->join('type', 'type.id','store.type')
                ->join('group', 'group.id','store.group')
                ->join('subgroup','subgroup.id','store.sub_group')
                ->join('network_setup','network_setup.id','store.network')
                ->join('store_area','store_area.id','store.store_area')
                ->get();
        }
        else if($request->filter == 'full_store' || $request->filter == 'drive_thru' || $request->filter == 'kiosks'){
            $stores = Store::selectRaw('store.id AS id, store.company_name, tin, branch_code, branch_name, store.address AS address_name, store.province AS province_name, store.city AS city_name, store.region AS region_name, store.type, store.setup, store.group, store.sub_group, store.network, store.serving_store, store.status')
                ->selectRaw('company.company_name AS comp_name, type.type AS type_name, group.group AS group_name, subgroup.subgroup AS subgroup_name, network_setup.network_setup AS network_setup_name, store_area.store_area AS store_area_name, store_area.id AS store_area')
                ->join('company', 'company.id','store.company_name')
                ->join('type', 'type.id','store.type')
                ->join('group', 'group.id','store.group')
                ->join('subgroup','subgroup.id','store.sub_group')
                ->join('network_setup','network_setup.id','store.network')
                ->join('store_area','store_area.id','store.store_area')
                ->get();
        }
        else{
            $list = Store::selectRaw('store.id AS id, store.company_name, tin, branch_code, branch_name, store.address AS address_name, store.province AS province_name, store.city AS city_name, store.region AS region_name, store.type, store.setup, store.group, store.sub_group, store.network, store.serving_store, store.status')
                ->selectRaw('company.company_name AS comp_name, type.type AS type_name, group.group AS group_name, subgroup.subgroup AS subgroup_name, network_setup.network_setup AS network_setup_name, store_area.store_area AS store_area_name, store_area.id AS store_area')
                ->join('company', 'company.id','store.company_name')
                ->join('type', 'type.id','store.type')
                ->join('group', 'group.id','store.group')
                ->join('subgroup','subgroup.id','store.sub_group')
                ->join('network_setup','network_setup.id','store.network')
                ->join('store_area','store_area.id','store.store_area')
                ->get();
        }

        if($request->filter == 'full_store'){
            $setup_query = DB::table('setup')
                        ->select('id')
                        ->where('setup_status', 'ACTIVE')
                        ->where('setup', 'like', '%FULL STORE%')
                        ->get();
            $idArray = array();
            foreach(json_decode($setup_query, true) as $row){
                $idArray[] = strval($row['id']);
            }
            $list = [];
            foreach($stores as $store){
                $x = 0;
                if($store['setup']){
                    foreach(array_map('trim', explode(",",$store['setup'])) as $store_setup){
                        if(in_array($store_setup, $idArray) && $x == 0){
                            $list[]=$store;
                            $x++;
                        }
                    }
                }
            }
        }
        else if($request->filter == 'drive_thru'){
            $setup_query = DB::table('setup')
                        ->select('id')
                        ->where('setup_status', 'ACTIVE')
                        ->where('setup', 'like', '%DRIVE THRU%')
                        ->orWhere('setup', 'like', '%BIKE THRU%')
                        ->get();
            $idArray = array();
            foreach(json_decode($setup_query, true) as $row){
                $idArray[] = strval($row['id']);
            }
            $list = [];
            foreach($stores as $store){
                $x = 0;
                if($store['setup']){
                    foreach(explode(",",$store['setup']) as $store_setup){
                        if(in_array($store_setup, $idArray) && $x == 0){
                            $list[]=$store;
                            $x++;
                        }
                    }
                }
            }
        }
        else if($request->filter == 'kiosks'){
            $setup_query = DB::table('setup')
                        ->select('id')
                        ->where('setup_status', 'ACTIVE')
                        ->where('setup', 'like', '%KIOSKS%')
                        ->get();
            $idArray = array();
            foreach(json_decode($setup_query, true) as $row){
                $idArray[] = strval($row['id']);
            }
            $list = [];
            foreach($stores as $store){
                $x = 0;
                if($store['setup']){
                    foreach(array_map('trim', explode(",",$store['setup'])) as $store_setup){
                        if(in_array($store_setup, $idArray) && $x == 0){
                            $list[]=$store;
                            $x++;
                        }
                    }
                }
            }
        }

        return DataTables::of($list)
        ->addColumn('setup_name', function(Store $list){
            if(!$list->setup){
                return '';
            }
            else{
                $setup_row = '';
                $array = array_map('trim', explode(",", $list->setup));
                foreach($array as $value){
                    $setup = Setup::where('id', $value)->first();
                    if($setup_row != ''){
                        $setup_row = $setup_row.', '.$setup->setup;
                    }
                    else{
                        $setup_row = $setup->setup;
                    }
                }
                return $setup_row;
            }
        })
        ->addColumn('delivery_serving_store_name', function(Store $list){
            if(!$list->serving_store){
                return '';
            }
            else{
                $setup_row = '';
                $array = array_map('trim', explode(",", $list->serving_store));
                foreach($array as $value){
                    $setup = DeliveryServingStore::where('id', $value)->first();
                    if($setup_row != ''){
                        $setup_row = $setup_row.', '.$setup->delivery_serving_store;
                    }
                    else{
                        $setup_row = $setup->delivery_serving_store;
                    }
                }
                return $setup_row;
            }
        })
        ->make(true);
    }

    public function store_reload(){
        if(Store::count() == 0){
            return 'NULL';
        }
        $data_update = Store::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function store_status(Request $request){
        if($request->status == 'ACTIVE'){
            $status1 = 'ACTIVE';
            $status2 = 'INACTIVE';
        }
        else{
            $status1 = 'INACTIVE';
            $status2 = 'ACTIVE';
        }
        $name = strtoupper($request->name);

        $stores = Store::find($request->id);
        $stores->status = $request->status;
        $sql = $stores->save();

        if(!$sql){
            $result = 'false';
        }
        else {
            $result = 'true';

            $status = "【Status: FROM '$status2' TO '$status1'】";

            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "STORE STATUS UPDATED: User successfully updated status of $name with Branch Code: $request->branch_code with the following CHANGES: $status.";
            $userlogs->save();
        }
        return response($result);
    }

    public function store_contact_details_data(Request $request)
    {
        return DataTables::of(StoreContactDetails::where('store_id',$request->id)->get())->make(true);
    }

    public function store_pos_information_data(Request $request)
    {
        return DataTables::of(
            StorePosInformation::selectRaw('store_pos_information.id, store_id, store_pos_information.model, pos.model as model_name, serial, min, ptu, date_issued, status, remarks')
            ->where('store_id',$request->id)
            ->join('pos','pos.id','store_pos_information.model')
            ->get())
            ->make(true);
    }

    public function saveStore(Request $request){
        $store = new Store;
        $store->branch_code = strtoupper($request->branch_code);
        $store->company_name = $request->company_name;
        $store->tin = $request->tin;
        $store->branch_name = strtoupper($request->branch_name);
        $store->store_area = $request->store_area;
        $store->address = strtoupper($request->address);
        $store->province = $request->province;
        $store->city = $request->city;
        $store->region = $request->region;
        $store->type = $request->type;
        $store->setup = implode(",",$request->setup);
        $store->group = $request->group;
        $store->sub_group = $request->sub_group ?? 0;
        $store->network = $request->network;
        $store->serving_store = $request->serving_store ? implode(",",$request->serving_store) : '';
        $save = $store->save();

        if($save){
            $result = 'true';
            $id = $store->id;
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED STORE: User successfully added Store '$store->company_name - $store->branch_name' with Store Code '$store->branch_code'.";
            $userlogs->save();
        }
        else{
            $result = 'false';
            $id = '';
        }

        $data = array('result' => $result, 'id' => $id);
        return response()->json($data);
    }

    public function editStore(Request $request){
        $branch_code_orig = Store::where('id', $request->id)->first()->branch_code;
        $company_name_orig = Store::where('id', $request->id)->first()->company_name;
        $tin_orig = Store::where('id', $request->id)->first()->tin;
        $branch_name_orig = Store::where('id', $request->id)->first()->branch_name;
        $address_orig = Store::where('id', $request->id)->first()->address;
        $store_area_orig = Store::where('id', $request->id)->first()->store_area;
        $province_orig = Store::where('id', $request->id)->first()->province;
        $city_orig = Store::where('id', $request->id)->first()->city;
        $region_orig = Store::where('id', $request->id)->first()->region;
        $type_orig = Store::where('id', $request->id)->first()->type;
        $setup_orig = Store::where('id', $request->id)->first()->setup;
        $group_orig = Store::where('id', $request->id)->first()->group;
        $sub_group_orig = Store::where('id', $request->id)->first()->sub_group;//
        $network_orig = Store::where('id', $request->id)->first()->network;
        $serving_store_orig = Store::where('id', $request->id)->first()->serving_store;

        if(strtoupper($request->branch_code) !=  $branch_code_orig){
            $branch_code_new = strtoupper($request->branch_code);
            $branch_code = "【Store Code: FROM '$branch_code_orig' TO '$branch_code_new'】";
        }
        else{
            $branch_code = NULL;
        }

        if($request->company_name !=  $company_name_orig){
            $company_name_orig = Company::where('id', $company_name_orig)->first()->company_name;
            $company_name_new = Company::where('id', $request->company_name)->first()->company_name;
            $company_name = "【Company Name: FROM '$company_name_orig' TO '$company_name_new'】";
        }
        else{
            $company_name = NULL;
        }

        if(strtoupper($request->tin) !=  $tin_orig){
            $tin_new = strtoupper($request->tin);
            $tin = "【TIN: FROM '$tin_orig' TO '$tin_new'】";
        }
        else{
            $tin = NULL;
        }

        if(strtoupper($request->branch_name) !=  $branch_name_orig){
            $branch_name_new = strtoupper($request->branch_name);
            $branch_name = "【Branch Name: FROM '$branch_name_orig' TO '$branch_name_new'】";
        }
        else{
            $branch_name = NULL;
        }

        if(strtoupper($request->address) !=  $address_orig){
            $address_new = strtoupper($request->address);
            $address = "【Address: FROM '$address_orig' TO '$address_new'】";
        }
        else{
            $address = NULL;
        }

        if($request->store_area !=  $store_area_orig){
            $store_area_orig = StoreArea::where('id', $store_area_orig)->first()->store_area;
            $store_area_new = StoreArea::where('id', $request->store_area)->first()->store_area;
            $store_area = "【Store Area: FROM '$store_area_orig' TO '$store_area_new'】";
        }
        else{
            $store_area = NULL;
        }

        if($request->province !=  $province_orig){
            $province_new = strtoupper($request->province);
            $province = "【Province: FROM '$province_orig' TO '$province_new'】";
        }
        else{
            $province = NULL;
        }

        if($request->city !=  $city_orig){
            $city_new = strtoupper($request->city);
            $city = "【City: FROM '$city_orig' TO '$city_new'】";
        }
        else{
            $city = NULL;
        }

        if($request->region !=  $region_orig){
            $region_new = strtoupper($request->region);
            $region = "【Region: FROM '$region_orig' TO '$region_new'】";
        }
        else{
            $region = NULL;
        }

        if($request->type !=  $type_orig){
            $type_orig = Type::where('id', $type_orig)->first()->type;
            $type_new = Type::where('id', $request->type)->first()->type;
            $type = "【Store Type: FROM '$type_orig' TO '$type_new'】";
        }
        else{
            $type = NULL;
        }

        if(($request->setup) != array_map('trim', (explode(',', $setup_orig)))){
            $setup_orig = Setup::where('id', $setup_orig)->first()->setup;
            $setup_array = array();
            $setup = Setup::all();
            foreach($setup as $setupkey => $setupvalue){
                if(in_array($setupvalue['id'], $request->setup)){
                    array_push($setup_array, $setupvalue['setup']);
                }
            }
            $setup_new = implode(', ', $setup_array);
            $setup_change = "【Store Setup: FROM '$setup_orig' TO '$setup_new'】";
        }
        else{
            $setup_change = NULL;
        }

        if(($request->serving_store) != array_map('trim', (explode(',', $serving_store_orig)))){
            if(!$serving_store_orig){
                $serving_store_orig = 'N/A';
            }
            else{
                $serving_store_orig = DeliveryServingStore::where('id', $serving_store_orig)->first()->delivery_serving_store;
            }
            if($request->serving_store){
                $serving_store_array = array();
                $serving_store = DeliveryServingStore::all();
                foreach($serving_store as $serving_store_key => $serving_store_value){
                    if(in_array($serving_store_value['id'], $request->serving_store)){
                        array_push($serving_store_array, $serving_store_value['delivery_serving_store']);
                    }
                }
                $serving_store_new = implode(', ', $serving_store_array);
            }
            else{
                $serving_store_new = 'N/A';
            }
            $serving_store_change = "【Delivery Channel: FROM '$serving_store_orig' TO '$serving_store_new'】";
        }
        else{
            $serving_store_change = NULL;
        }

        if($request->group !=  $group_orig){
            $group_orig = Group::where('id', $group_orig)->first()->group;
            $group_new = Group::where('id', $request->group)->first()->group;
            $group = "【Store Group: FROM '$group_orig' TO '$group_new'】";
        }
        else{
            $group = NULL;
        }

        if($request->group == $request->group){
            if($request->sub_group !=  $sub_group_orig){
                $sub_group_orig = SubGroup::where('id', $sub_group_orig)->first()->subgroup;
                $sub_group_new = SubGroup::where('id', $request->sub_group)->first()->subgroup;
                $sub_group = "【Mall Sub-Group: FROM '$sub_group_orig' TO '$sub_group_new'】";
            }
            else{
                $sub_group = NULL;
            }
        }
        else{
            $sub_group = NULL;
        }
        
        if($request->network !=  $network_orig){
            $network_orig = NetworkSetup::where('id', $network_orig)->first()->network_setup;
            $network_new = NetworkSetup::where('id', $request->network)->first()->network_setup;
            $network = "【Store Network Setup: FROM '$network_orig' TO '$network_new'】";
        }
        else{
            $network = NULL;
        }

        if($request->contact_person_change ==  'CHANGED'){
            $contact_person = "【Contact Person: List of Contact Person/s have been changed】";
        }
        else{
            $contact_person = NULL;
        }
        
        $store = Store::find($request->id);
        $store->branch_code = strtoupper($request->branch_code);
        $store->company_name = $request->company_name;
        $store->tin = $request->tin;
        $store->branch_name = strtoupper($request->branch_name);
        $store->address = strtoupper($request->address);
        $store->store_area = $request->store_area;
        $store->province = $request->province;
        $store->city = $request->city;
        $store->region = $request->region;
        $store->type = $request->type;
        $store->setup = implode(",",$request->setup);
        $store->group = $request->group;
        $store->sub_group = $request->sub_group ?? 0;
        $store->network = $request->network;
        $store->serving_store = $request->serving_store ? implode(",",$request->serving_store) : '';
        $save = $store->save();

        if($save){
            $result = 'true';
            $id = $store->id;
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED STORE: User successfully updated Store '$store->company_name - $store->branch_name' with Store Code '$store->branch_code' with the following CHANGES: $branch_code $company_name $tin $branch_name $address $store_area $province $city $region $type $setup_change $group $network $serving_store_change $sub_group $contact_person";
            $userlogs->save();
        }
        else{
            $result = 'false';
            $id = '';
        }
        $data = array('result' => $result, 'id' => $id);
        return response()->json($data);
    }

    public function saveStoreContactDetails(Request $request){
        $storeContactDetails = new StoreContactDetails;
        $storeContactDetails->store_id = $request->store_id;
        $storeContactDetails->contact_person = ucwords($request->contact_person);
        $storeContactDetails->position = $request->position;
        $storeContactDetails->email = $request->email;
        $storeContactDetails->telephone = $request->telephone;
        $storeContactDetails->mobile = $request->mobile;
        $storeContactDetails->save();
    }

    public function saveStorePosInformation(Request $request){
        $storePosInformation = new StorePosInformation;
        $storePosInformation->store_id = $request->store_id;
        $storePosInformation->model = $request->model;
        $storePosInformation->serial = strtoupper($request->serial);
        $storePosInformation->min = strtoupper($request->min);
        $storePosInformation->ptu = strtoupper($request->ptu);
        $storePosInformation->date_issued = $request->date_issued;
        $storePosInformation->save();
    }

    public function StoreContactDetails_delete(Request $request){
        $contact_id = array_map('trim', explode(",", $request->id));
        foreach($contact_id as $id){
            StoreContactDetails::where('id', $id)->delete();
        }
    }

    public function StorePosInformation_delete(Request $request){
        $pos_id = array_map('trim', explode(",", $request->id));
        foreach($pos_id as $id){
            StorePosInformation::where('id', $id)->delete();
        }
    }

    public function checkDuplicate(Request $request){
        if(Store::where('branch_code', $request->branch_code)->count() > 0){
            return 'duplicate_branch_code';
        }

        if(Store::where('tin', $request->tin)->count() > 0){
            return 'duplicate_tin';
        }

        if(Store::where('branch_name', $request->branch_name)->count() > 0){
            return 'duplicate_branch_name';
        }
    }

    public function checkDuplicate_Pos(Request $request){
        if(StorePosInformation::where('ptu',$request->ptu)->count() > 0){
            return 'duplicate_ptu';
        }
        else if(StorePosInformation::where('min',$request->min)->count() > 0){
            return 'duplicate_min';
        }
    }

    public function editStorePosInformation(Request $request){
        $sql = StorePosInformation::where('id',$request->pos_id)->update([
            'store_id' => $request->store_id,
            'model' => $request->model_id,
            'serial' => strtoupper($request->serial),
            'min' => $request->min,
            'ptu' => $request->ptu,
            'date_issued' => $request->date_issued,
            'status' => $request->status,
            'remarks' => strtoupper($request->remarks)
        ]);

        if(!$sql){
            return 'false';
        }
        else{
            if($request->model_id_orig != $request->model_id){
                $model1 = Pos::where('id', $request->model_id_orig)->first()->model;
                $model2 = Pos::where('id', $request->model_id)->first()->model;
                $model3 = Pos::where('id', $request->model_id)->first()->model;
                $model = "【POS Model: FROM '$model1' TO '$model2'】";
            }
            else{
                $model3 = Pos::where('id', $request->model_id_orig)->first()->model;
                $model = NULL;
            }
            if($request->serial_orig != strtoupper($request->serial)){
                $serial1 = strtoupper($request->serial_orig);
                $serial2 = strtoupper($request->serial);
                $serial3 = strtoupper($request->serial);
                $serial = "【Serial: FROM '$serial1' TO '$serial2'】";
            }
            else{
                $serial3 = strtoupper($request->serial_orig);
                $serial = NULL;
            }
            if($request->min_orig != $request->min){
                $min = "【MIN: FROM '$request->min_orig' TO '$request->min'】";
            }
            else{
                $min = NULL;
            }
            if($request->ptu_orig != $request->ptu){
                $ptu = "【PTU: FROM '$request->ptu_orig' TO '$request->ptu'】";
            }
            else{
                $ptu = NULL;
            }
            if($request->date_issued_orig != $request->date_issued){
                $date_issued1 = Carbon::parse($request->date_issued_orig)->format('M. d, Y');
                $date_issued2 = Carbon::parse($request->date_issued)->format('M. d, Y');
                $date_issued = "【Date Issued: FROM '$date_issued1' TO '$date_issued2'】";
            }
            else{
                $date_issued = NULL;
            }
            if($request->status_orig != $request->status){
                $status = "【Status: FROM '$request->status_orig' TO '$request->status'】";
            }
            else{
                $status = NULL;
            }
            if($request->remarks_orig != strtoupper($request->remarks)){
                $remarks1 = strtoupper($request->remarks_orig);
                $remarks2 = strtoupper($request->remarks);
                $remarks = "【Remarks: FROM '$remarks1' TO '$remarks2'】";
            }
            else{
                $remarks = NULL;
            }

            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED STORE POS: User successfully updated details of $model3 with Serial#$serial3 with the following CHANGES: $model $serial $min $ptu $date_issued $status $remarks.";
            $userlogs->save();

            return 'true';
        }
    }

    public function import(Request $request){
        $file = $request->file('xlsx');
        $import = new StoreImport;
        $data = Excel::toArray($import, $file);
        if(count($data[0]) == 0){
            return redirect()->to('/store?import=failed');
        }
        $failed_rows = [];
        $row_num = 2;
        foreach($data[0] as $key => $value){
            if(!$value['company_name'] && 
                !$value['branch_code'] && 
                !$value['branch_name'] && 
                !$value['address'] && 
                !$value['store_area'] && 
                !$value['type'] && 
                !$value['setup'] && 
                !$value['group'] && 
                !$value['network_setup'] && 
                !$value['contact_person'] && 
                !$value['position'] && 
                !$value['email'] && 
                !$value['mobile'] &&
                !$value['pos_model'] &&
                !$value['serial'] &&
                !$value['min']
                ){   
                echo(null);
            }
            else if(!$value['company_name'] || 
                !$value['branch_code'] || 
                !$value['branch_name'] || 
                !$value['address'] || 
                !$value['store_area'] || 
                !$value['type'] || 
                !$value['setup'] || 
                !$value['group'] || 
                !$value['network_setup'] || 
                !$value['pos_model'] ||
                !$value['serial'] ||
                !$value['min']
                ){   
                array_push($failed_rows, '【Row: '.$row_num.' => Error: Fill Required Fields!】');
            }
            else{
                $branch_code = strtoupper(trim($value['branch_code']));
                if(!Store::where('branch_code', $branch_code)->first()){
                    $type = Type::where('type', strtoupper(trim($value['type'])))->first()->id;
                    $group = Group::where('group', strtoupper(trim($value['group'])))->first()->id;
                    $subgroup = SubGroup::where('subgroup', strtoupper(trim($value['subgroup'])))->first()->id ?? '0';
                    $network_setup = NetworkSetup::where('network_setup', strtoupper(trim($value['network_setup'])))->first()->id;
                    $store_area = StoreArea::where('store_area', strtoupper(trim($value['store_area'])))->first()->id;
                    $company_name = Company::where('company_name', strtoupper(trim($value['company_name'])))->first()->id;
                    
                    $store_setup = array();
                    $setup_array = array_map('trim', explode(',', strtoupper($value['setup'])));
                    $setup_list = Setup::where('setup_status', 'ACTIVE')->get();
                    foreach($setup_list as $key => $val){
                        if(in_array(strtoupper(trim($val['setup'])), $setup_array)){
                            array_push($store_setup, $val['id']);
                        }
                    }
                    
                    $delivery_channel = array();
                    $delivery_array = array_map('trim', explode(',', strtoupper($value['delivery_channel'])));
                    $delivery_list = DeliveryServingStore::where('delivery_serving_store_status', 'ACTIVE')->get();
                    foreach($delivery_list as $key => $val){
                        if(in_array(strtoupper(trim($val['delivery_serving_store'])), $delivery_array)){
                            array_push($delivery_channel, $val['id']);
                        }
                    }
    
                    $store = new Store;
                    $store->company_name = $company_name;
                    $store->tin = strtoupper($value['tin']);
                    $store->branch_code = $branch_code;
                    $store->branch_name = strtoupper($value['branch_name']);
                    $store->address = strtoupper($value['address']);
                    $store->store_area = $store_area;
                    $store->type = $type;
                    $store->setup = implode(',', $store_setup);
                    $store->group = $group;
                    $store->sub_group = $subgroup;
                    $store->network = $network_setup;
                    $store->serving_store = count($delivery_channel) != 0 ? implode(',', $delivery_channel) : '0';
                    $sql = $store->save();
                    $id = $store->id;
    
                    if(!$sql){
                        array_push($failed_rows, '【Row: '.$row_num.', Error: Save Failed!】');
                    }
                    else{
                        if($value['contact_person'] && $value['position']){
                            $error_log = 0;
                            $storeContactDetails = new StoreContactDetails;
                            $storeContactDetails->store_id = $id;
                            $storeContactDetails->contact_person = ucwords($value['contact_person']);
                            $storeContactDetails->position = ucwords($value['position']);
                            $storeContactDetails->email = strtolower($value['email']);
                            $storeContactDetails->telephone = $value['telephone'];
                            $storeContactDetails->mobile = $value['mobile'];
                            $sql2 = $storeContactDetails->save();
                            if(!$sql2){
                                array_push($failed_rows, '【Row: '.$row_num.', Error: Save Failed in Store Contact Details!】');
                                $error_log++;
                            }
                        }
    
                        if(!strstr($value['pos_model'], ',') && !strstr($value['serial'], ',') && !strstr($value['min'], ',') && !strstr($value['ptu'], ',')){
                            $model = Pos::where('model', strtoupper(trim($value['pos_model'])))->first()->id;
                            if($model){
                                $storePosInformation = new StorePosInformation;
                                $storePosInformation->store_id = $id;
                                $storePosInformation->model = $model;
                                $storePosInformation->serial = trim(strtoupper($value['serial']));
                                $storePosInformation->min = trim(strtoupper($value['min']));
                                $storePosInformation->ptu = trim(strtoupper($value['ptu']));
                                $storePosInformation->date_issued = 'YYYY-MM-DD';
                                $sql3 = $storePosInformation->save();
                                if(!$sql3){
                                    array_push($failed_rows, '【Row: '.$row_num.', Error: Save Failed in Store POS Information!】');
                                    $error_log++;
                                }
                            }
                            else{
                                array_push($failed_rows, '【Row: '.$row_num.', Error: Save Failed in Store POS Information!】');
                                $error_log++;
                            }
                        }
                        else if(!strstr($value['pos_model'], ',') && strstr($value['serial'], ',') && (strstr($value['min'], ',') || strstr($value['ptu'], ','))){
                            $model = Pos::where('model', strtoupper(trim($value['pos_model'])))->first()->id;
                            if($model){
                                if(!$value['ptu'] && substr_count($value['serial'], ',') == substr_count($value['min'], ',')){
                                    $serial_array = array_map('trim', explode(',', $value['serial']));
                                    $min_array = array_map('trim', explode(',', $value['min']));
                                    for($i = 0; $i < count($serial_array); $i++){
                                        if($error_log == 0){
                                            $storePosInformation = new StorePosInformation;
                                            $storePosInformation->store_id = $id;
                                            $storePosInformation->model = $model;
                                            $storePosInformation->serial = trim(strtoupper($serial_array[$i]));
                                            $storePosInformation->min = trim(strtoupper($min_array[$i]));
                                            $storePosInformation->date_issued = 'YYYY-MM-DD';
                                            $sql3 = $storePosInformation->save();
                                            if(!$sql3){
                                                array_push($failed_rows, '【Row: '.$row_num.', Error: Save Failed in Store POS Information!】');
                                                $error_log++;
                                            }
                                        }
                                    }
                                }
                                else if(substr_count($value['serial'], ',') == substr_count($value['min'], ',') && substr_count($value['serial'], ',') == substr_count($value['ptu'], ',')){
                                    $serial_array = array_map('trim', explode(',', $value['serial']));
                                    $min_array = array_map('trim', explode(',', $value['min']));
                                    $ptu_array = array_map('trim', explode(',', $value['ptu']));
                                    for($i = 0; $i < count($serial_array); $i++){
                                        if($error_log == 0){
                                            $storePosInformation = new StorePosInformation;
                                            $storePosInformation->store_id = $id;
                                            $storePosInformation->model = $model;
                                            $storePosInformation->serial = trim(strtoupper($serial_array[$i]));
                                            $storePosInformation->min = trim(strtoupper($min_array[$i]));
                                            $storePosInformation->ptu = trim(strtoupper($ptu_array[$i]));
                                            $storePosInformation->date_issued = 'YYYY-MM-DD';
                                            $sql3 = $storePosInformation->save();
                                            if(!$sql3){
                                                array_push($failed_rows, '【Row: '.$row_num.', Error: Save Failed in Store POS Information!】');
                                                $error_log++;
                                            }
                                        }
                                    }
                                }
                                else{
                                    array_push($failed_rows, '【Row: '.$row_num.', Error: Save Failed in Store POS Information!】');
                                    $error_log++;
                                }
                            }
                            else{
                                array_push($failed_rows, '【Row: '.$row_num.', Error: Save Failed in Store POS Information!】');
                                $error_log++;
                            }
                        }
                        else if(strstr($value['pos_model'], ',') && strstr($value['serial'], ',') && (strstr($value['min'], ',') || strstr($value['ptu'], ','))){
                            $totnum = 0;
                            $pos_model = array();
                            $pos_array = array_map('trim', explode(',', $value['pos_model']));
                            foreach($pos_array as $pos){
                                $slash = strpos($pos, '/');
                                $num = substr($pos, $slash + 1);
                                $totnum += $num;
                                $model = substr($pos, 0, $slash);
                                for($j = 0; $j < $num; $j++){
                                    array_push($pos_model, Pos::where('model', strtoupper(trim($model)))->first()->id);
                                }
                            }
                            if(count($pos_model) != $totnum || count($pos_model) == 0){
                                array_push($failed_rows, '【Row: '.$row_num.', Error: Save Failed in Store POS Information!】');
                                $error_log++;
                            }
                            else{
                                if(!$value['ptu'] && substr_count($value['serial'], ',') == substr_count($value['min'], ',')){
                                    $serial_array = array_map('trim', explode(',', $value['serial']));
                                    $min_array = array_map('trim', explode(',', $value['min']));
                                    for($i = 0; $i < count($serial_array); $i++){
                                        if($error_log == 0){
                                            $storePosInformation = new StorePosInformation;
                                            $storePosInformation->store_id = $id;
                                            $storePosInformation->model = trim($pos_model[$i]);
                                            $storePosInformation->serial = trim(strtoupper($serial_array[$i]));
                                            $storePosInformation->min = trim(strtoupper($min_array[$i]));
                                            $storePosInformation->date_issued = 'YYYY-MM-DD';
                                            $sql3 = $storePosInformation->save();
                                            if(!$sql3){
                                                array_push($failed_rows, '【Row: '.$row_num.', Error: Save Failed in Store POS Information!】');
                                                $error_log++;
                                            }
                                        }
                                    }
                                }
                                else if(substr_count($value['serial'], ',') == substr_count($value['min'], ',') && substr_count($value['serial'], ',') == substr_count($value['ptu'], ',')){
                                    $serial_array = array_map('trim', explode(',', $value['serial']));
                                    $min_array = array_map('trim', explode(',', $value['min']));
                                    $ptu_array = array_map('trim', explode(',', $value['ptu']));
                                    for($i = 0; $i < count($serial_array); $i++){
                                        if($error_log == 0){
                                            $storePosInformation = new StorePosInformation;
                                            $storePosInformation->store_id = $id;
                                            $storePosInformation->model = trim($pos_model[$i]);
                                            $storePosInformation->serial = trim(strtoupper($serial_array[$i]));
                                            $storePosInformation->min = trim(strtoupper($min_array[$i]));
                                            $storePosInformation->ptu = trim(strtoupper($ptu_array[$i]));
                                            $storePosInformation->date_issued = 'YYYY-MM-DD';
                                            $sql3 = $storePosInformation->save();
                                            if(!$sql3){
                                                array_push($failed_rows, '【Row: '.$row_num.', Error: Save Failed in Store POS Information!】');
                                                $error_log++;
                                            }
                                        }
                                    }
                                }
                                else{
                                    array_push($failed_rows, '【Row: '.$row_num.', Error: Save Failed in Store POS Information!】');
                                    $error_log++;
                                }
                            }
                        }
    
                        if($error_log == 0){
                            $userlogs = new UserLogs;
                            $userlogs->user_id = auth()->user()->id;
                            $userlogs->activity = "ADDED STORE: User successfully added Store '$store->company_name - $store->branch_name' with Store Code '$store->branch_code'.";
                            $userlogs->save();
                        }
                        else{
                            Store::where('id', $id)->delete();
                        }
                    }
                }
                else{
                    array_push($failed_rows, '【Row: '.$row_num.' => Error: Store already exists!】');
                }
            }
            $row_num++;
        }
        if(count($failed_rows) == count($data[0])){
            $errors = implode(', ', $failed_rows);
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "STORE FILE IMPORT [FAILED]: User attempt failed to import file data into Store with the following errors: $errors.";
            $userlogs->save();

            return redirect()->to('/store?import=failed');
        }
        else if(count($failed_rows) == 0){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "STORE FILE IMPORT [NO ERRORS]: User successfully imported file data into Store without any errors.";
            $userlogs->save();

            return redirect()->to('/store?import=success_without_errors');
        }
        else{
            $errors = implode(', ', $failed_rows);
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "STORE FILE IMPORT [WITH ERRORS]: User successfully imported file data into Store with the following errors: $errors.";
            $userlogs->save();

            return redirect()->to('/store?import=success_with_errors');
        }
    }
}