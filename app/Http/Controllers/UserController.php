<?php

namespace App\Http\Controllers;

use Illuminate\Mail\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Yajra\Datatables\Datatables;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\HasPermission;
use App\Models\Company;
use App\Models\Store;
use App\Models\StoreArea;
use App\Models\Province;
use App\Models\City;
use App\Models\Setup;
use App\Models\User;
use App\Models\UserLogs;

class UserController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function users(Request $request){
        $role = Role::select()->where('status', 'ACTIVE')->get()->sortBy('name');
        $areas = StoreArea::where('id', '!=', '0')->where('store_area_status', 'ACTIVE')->get()->sortBy('store_area');
        $branches = Company::where('id', '!=', '0')->get()->sortBy('company_name');
        $companies = Company::select('id','company_name')->where('id','!=','0')->get();
        return view('pages/users', compact('role','areas','branches','companies'));
    }

    public function users_data(){
        $list = User::query()->selectRaw('users.id AS user_id, users.name AS user_name, users.email AS user_email,
        UPPER(roles.name) AS role_name, roles.id AS role, company.company_name AS branch_name, company.id AS branch, users.area AS area, users.store AS store, users.status AS user_status,
        users.company AS company')
            ->join('roles', 'roles.id', 'users.userlevel')
            ->join('company', 'company.id', 'users.branch')
            ->orderBy('user_status', 'ASC')
            ->orderBy('role_name', 'ASC')
            ->orderBy('user_name', 'ASC')
            ->orderBy('users.id', 'ASC')
            ->get();

        return DataTables::of($list)
        ->addColumn('company_name', function(User $list){
            $user_row = '';
            $array = explode("|", $list->company);
            foreach($array as $value){
                $user = Company::where('id', $value)->first();
                if($user_row != ''){
                    $user_row = $user_row.'|'.$user->company_name;
                }
                else{
                    $user_row = $user->company_name;
                }
            }
            return $user_row;
        })
        ->addColumn('area_name', function(User $list){
            $user_row = '';
            $array = explode("|", $list->area);
            foreach($array as $value){
                $user = StoreArea::where('id', $value)->first();
                if($user_row != ''){
                    $user_row = $user_row.'|'.$user->store_area;
                }
                else{
                    $user_row = $user->store_area;
                }
            }
            return $user_row;
        })
        ->addColumn('store_name', function(User $list){
            if($list->store == 'X'){
                return 'N/A';
            }
            else if($list->store == '0'){
                return 'ALL BRANCHES';
            }
            else{
                $user_row = '';
                $array = explode("|", $list->store);
                foreach($array as $value){
                    if(!str_contains($value, '-0')){
                        $user = Store::where('id', $value)->first();
                        if($user_row != ''){
                            $user_row = $user_row.'|'.$user->branch_code.': '.$user->branch_name;
                        }
                        else{
                            $user_row = $user->branch_code.': '.$user->branch_name;
                        }
                    }
                    else{
                        $user = StoreArea::where('id', substr($value, 0, -2))->first();
                        if($user_row != ''){
                            $user_row = $user_row.'|'.$user->store_area.' (ALL BRANCHES)';
                        }
                        else{
                            $user_row = $user->store_area.' (ALL BRANCHES)';
                        }
                    }
                }
                return $user_row;
            }
        })
        ->make(true);
    }

    public function users_reload(){
        if(User::count() == 0){
            return 'NULL';
        }
        $data_update = User::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function validate_users_save(Request $request){
        $email = User::query()->select()
            ->where('email',$request->email)
            ->count();
        if(!filter_var($request->email, FILTER_VALIDATE_EMAIL)){
            $data = array('result' => 'invalid');
            return response()->json($data);
        }
        else if($email > 0){
            $data = array('result' => 'duplicate');
            return response()->json($data);
        }
        else {
            $data = array('result' => 'true');
            return response()->json($data);
        }
    }

    public function users_save(Request $request){
        $char = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array();
        $charLength = strlen($char) - 1;
        for($i = 0; $i < 8; $i++){
            $n = rand(0, $charLength);
            $pass[] = $char[$n];
        }
        $password = implode($pass);

        $name = strtoupper($request->name);

        $users = new User;
        $users->name = $name;
        $users->email = strtolower($request->email);
        $users->password = Hash::make($password);
        $users->userlevel = $request->role;
        $users->branch = $request->branch;
        $users->company = $request->company == '0' ? '0' : implode("|", $request->company);
        $users->area = $request->area == '0' ? '0' : implode("|", $request->area);
        if($request->store == 'X'){
            $users->store = 'X';
        }
        else{
            $users->store = $request->store == '0' ? '0' : implode("|", $request->store);
        }
        $users->status = 'ACTIVE';
        $sql = $users->save();
        $id = $users->id;
        $users->assignRole($request->role);

        if(!$sql){
            $result = 'false';
        }
        else {
            $result = 'true';

            Password::broker()->sendResetLink(['email'=>strtolower($request->email)]);

            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED USER: User successfully saved details of $name with UserID#$id.";
            $userlogs->save();
        }

        return response($result);
    }

    public function validate_users_update(Request $request){
        if(strtolower($request->email1) != strtolower($request->email2)){
            $email = User::query()->select()
                ->where('email',$request->email1)
                ->count();
        }
        else{
            $email = 0;
        }
        if(!filter_var($request->email1, FILTER_VALIDATE_EMAIL)){
            return response('invalid');
        }
        else if($email > 0){
            return response('duplicate');
        }
        else {
            return response('true');
        }
    }

    public function users_update(Request $request){

        $name1 = strtoupper($request->name1);
        $email1 = strtolower($request->email1);

        $users = User::find($request->input('id1'));
        $users->name = $name1;
        $users->email = $email1;
        $users->userlevel = $request->role1;
        $users->branch = $request->branch1;
        $users->company = $request->company1 == '0' ? '0' : implode("|", $request->company1);
        $users->area = $request->area1 == '0' ? '0' : implode("|", $request->area1);
        if($request->store1 == 'X'){
            $users->store = 'X';
        }
        else{
            $users->store = $request->store1 == '0' ? '0' : implode("|", $request->store1);
        }
        $sql = $users->save();
        $users->syncRoles($request->role1);

        if(!$sql){
            $result = 'false';
        }
        else {
            $result = 'true';
        }

        if($result == 'true'){
            if($name1 != $request->name2){
                $name = "【Full Name: FROM '$request->name2' TO '$name1'】";
            }
            else{
                $name = NULL;
            }
            if($email1 != $request->email2){
                $email = "【Email: FROM '$request->email2' TO '$email1'】";
            }
            else{
                $email = NULL;
            }
            if($request->role1 != $request->role2){
                $role_orig = Role::where('id', $request->role2)->first()->name;
                $role_new = Role::where('id', $request->role1)->first()->name;
                $userlevel = "【User Level: FROM '$role_orig' TO '$role_new'】";
            }
            else{
                $userlevel = NULL;
            }

            if($request->branch1 != '0'){
                if($request->branch1 != $request->branch2){
                    $branch1 = Company::where('id', $request->branch1)->first()->company_name;
                    $branch2 = Company::where('id', $request->branch2)->first()->company_name;
                    $branch = "【Branch: FROM '$branch2' TO '$branch1'】";
                }
                else{
                    $branch = NULL;
                }
            }
            else{
                $branch = NULL;
            }

            if($request->company1 != '0' && $request->area1 != '0'){
                if(($request->company1) != (explode('|', $request->company2))){
                    $company1_array = array();
                    $list1 = Company::all();
                    foreach($list1 as $list1key => $list1value){
                        if(in_array($list1value['id'], $request->company1)){
                            array_push($company1_array, $list1value['company_name']);
                        }
                    }
                    $company1 = implode(', ', $company1_array);
                    $company2_array = array();
                    $list2 = Company::all();
                    foreach($list2 as $list2key => $list2value){
                        if(in_array($list2value['id'], explode('|', $request->company2))){
                            array_push($company2_array, $list2value['company_name']);
                        }
                    }
                    $company2 = implode(', ', $company2_array);
                    $company = "【Company: FROM '$company2' TO '$company1'】";
                }
                else{
                    $company = NULL;
                }

                if(($request->area1) != (explode('|', $request->area2))){
                    $area1_array = array();
                    $list1 = StoreArea::all();
                    foreach($list1 as $list1key => $list1value){
                        if(in_array($list1value['id'], $request->area1)){
                            array_push($area1_array, $list1value['store_area']);
                        }
                    }
                    $area1 = implode(', ', $area1_array);
                    $area2_array = array();
                    $list2 = StoreArea::all();
                    foreach($list2 as $list2key => $list2value){
                        if(in_array($list2value['id'], explode('|', $request->area2))){
                            array_push($area2_array, $list2value['store_area']);
                        }
                    }
                    $area2 = implode(', ', $area2_array);
                    $area = "【Store Area: FROM '$area2' TO '$area1'】";
                }
                else{
                    $area = NULL;
                }
            }
            else{
                $company = NULL;
                $area = NULL;
            }

            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED USER: User successfully updated details of $request->name2 with UserID#$request->id1 with the following CHANGES: $name $email $userlevel $branch $company $area.";
            $userlogs->save();
        }

        return response($result);
    }

    public function users_status(Request $request){
        if($request->status == 'ACTIVE'){
            $status1 = 'ACTIVE';
            $status2 = 'INACTIVE';
        }
        else{
            $status1 = 'INACTIVE';
            $status2 = 'ACTIVE';
        }
        $name = strtoupper($request->name);

        $users = User::find($request->id);
        $users->status = $request->status;
        $sql = $users->save();

        if(!$sql){
            $result = 'false';
        }
        else {
            $result = 'true';

            $status = "【Status: FROM '$status2' TO '$status1'】";

            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "USER UPDATED: User successfully updated details of $name with UserID#$request->id with the following CHANGES: $status.";
            $userlogs->save();
        }
        return response($result);
    }

    public function users_permissions(Request $request){
        return HasPermission::select('permission_id')->where('role_id', $request->role_id)->get();
    }

    public function users_stores(Request $request)
    {
        if($request->area_all){
            $areas = array_diff($request->area_id, $request->area_all);
        }
        else{
            $areas = $request->area_id;
        }

        if(!$request->company_id){
            $stores = Store::query()
                ->whereIn('store_area', $areas)
                ->orderBy('branch_code', 'asc')
                ->get();
        }
        else{
            $stores = Store::query()
                ->whereIn('company_name', $request->company_id)
                ->whereIn('store_area', $areas)
                ->orderBy('branch_code', 'asc')
                ->get();
        }

        return response()->json($stores);
    }

    public function change_validate(Request $request){
        return Hash::check($request->current, auth()->user()->password) ? 'true' : 'false';
    }

    public function change_password(Request $request){
        do{
            $users = User::find(auth()->user()->id);
            $users->password = Hash::make($request->new);
            $sql = $users->save();
        }
        while(!$sql);

        if(!$sql){
            $result = 'false';
        }
        else{
            $result = 'true';

            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "CHANGE PASSWORD: User successfully changed own account password.";
            $userlogs->save();
        }

        return response($result);
    }
}
