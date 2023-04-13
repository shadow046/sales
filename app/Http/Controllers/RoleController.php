<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\HasPermission;
use App\Models\User;
use App\Models\UserLogs;


class RoleController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }
    public function roles(){
        $roles = Role::all();
        $permissions = Permission::whereNotIn('id', ['1','7','28','30'])->where('type', 'permissions')->get();
        $accesses = Permission::whereNotIn('id', ['8','24','25','26','27'])->where('type', 'access')->get();
        return view('pages/roles', compact('roles', 'permissions','accesses'));
    }

    public function roles_data()
    {
        $list = Role::selectRaw('roles.name AS name, roles.id AS id, roles.type')
            ->where('status','!=','DELETED')
            ->get();
        return DataTables::of($list)
        ->addColumn('permissions', function(Role $list){
            $permission = HasPermission::select('desc')
                ->where('role_id', $list->id)
                ->where('type', 'permissions')
                ->join('permissions', 'permissions.id', 'permission_id')
                ->orderBy('permissions.id', 'ASC')
                ->get();
            return $permission;
        })
        ->addColumn('access', function(Role $list){
            $permission = HasPermission::select('desc')
                ->where('role_id', $list->id)
                ->where('type', 'access')
                ->join('permissions', 'permissions.id', 'permission_id')
                ->orderBy('permissions.id', 'ASC')
                ->get();
            return $permission;
        })
        ->make(true);
    }

    public function roles_reload(){
        if(Role::count() == 0){
            return 'NULL';
        }
        $data_update = Role::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function saveRole(Request $request){
        if(Role::where('name', $request->role)->count() > 0){
            return 'duplicate';
        }
        $role = new Role;
        $role->name = $request->role;
        $role->guard_name = 'web';
        $sql = $role->save();

        $role->syncPermissions($request->input('permission'));
        $role->givePermissionTo(1);
        $role->givePermissionTo(8);
        $role->givePermissionTo(26);
        if($role->id == 1){
            $role->givePermissionTo(24);
            $role->givePermissionTo(25);
        }

        if($sql){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED ROLE: User successfully added User Role '$request->role'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function editRole(Request $request){
        $role = Role::find($request->role_id);
        $role->name = $request->role;
        $sql = $role->save();

        $role->syncPermissions($request->input('permission'));
        $role->givePermissionTo(1);
        $role->givePermissionTo(8);
        $role->givePermissionTo(26);
        if($role->id == 1){
            $role->givePermissionTo(24);
            $role->givePermissionTo(25);
        }

        if($sql){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED ROLE: User successfully updated User Role '$request->role'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function deleteRole(Request $request){
        $role = Role::find($request->role_id);
        $role->status = 'DELETED';
        $sql = $role->save();

        if($sql){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED ROLE: User successfully deleted User Role '$request->role'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function users(Request $request){
        return User::where('userlevel', $request->role_id)->count();
    }

    public function permissions(Request $request){
        return HasPermission::select('permission_id')->where('role_id', $request->role_id)->get();
    }

    public function checkDuplicate(Request $request){
        return Role::where('name', $request->role)->count() > 0 ? 'true': 'false';
    }
}
