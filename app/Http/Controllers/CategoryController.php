<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;

use App\Models\Category;


class CategoryController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function category(){
        return view('maintenance.category');
    }
    public function category_data(){
        return DataTables::of(
            Category::select()
                ->where('category_status','!=','DELETED')
                ->get()
        )->make(true);
    }

    public function category_reload(){
        if(Category::count() == 0){
            return 'NULL';
        }
        $data_update = Category::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function categoryCombo(Request $request){
        if($request->status == 'Y'){
            $status1 = 'ON';
            $status2 = 'OFF';
        }
        else{
            $status1 = 'OFF';
            $status2 = 'ON';
        }

        $category = Category::find($request->id);
        $category->enable_combo = $request->status;
        $sql = $category->save();

        if(!$sql){
            $result = 'false';
        }
        else {
            $result = 'true';

            $status = "【Combo ON/OFF: FROM '$status2' TO '$status1'】";

            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "CATEGORY UPDATED: User successfully updated $category->category with the following CHANGES: $status.";
            $userlogs->save();
        }
        return response($result);
    }

    public function saveCategory(Request $request){
        $category_name = strtoupper(trim($request->category));
        if(Category::where('category',$category_name)->where('category_status','DELETED')->count() == 0){
            $category = new Category;
            $category->category = strtoupper(trim($request->category));
            $save = $category->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED CATEGORY: User successfully added Category '$request->category'.";
                $userlogs->save();
                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            $save = Category::where('category', $category_name)->update([
                'category_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "ADDED CATEGORY: User successfully added Category '$category_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }
    public function editCategory(Request $request){
        $category_name = strtoupper(trim($request->category));
        if(Category::where('category',$category_name)->where('category_status','DELETED')->count() == 0){
            $category = Category::find($request->category_id);
            $category->category = strtoupper(trim($request->category));
            $save = $category->save();

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED CATEGORY: User successfully updated Category '$request->category'.";
                $userlogs->save();
                return 'true';
            }
            else{
                return 'false';
            }
        }
        else{
            $save = Category::where('category', $category_name)->update([
                'category_status' => 'ACTIVE'
            ]);

            if($save){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED CATEGORY: User successfully updated Category '$category_name'.";
                $userlogs->save();

                return 'true';
            }
            else{
                return 'false';
            }
        }
    }

    public function deleteCategory(Request $request){
        $category = Category::find($request->category_id);
        $category->category_status = 'DELETED';
        $save = $category->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "DELETED CATEGORY: User successfully deleted Category  '$request->category'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }

    public function checkDuplicate(Request $request){
        return Category::where('category',$request->category)->where('category_status','!=','DELETED')->count() > 0 ? 'true': 'false';
    }
}
