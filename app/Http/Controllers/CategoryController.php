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

    public function categoryMealType(Request $request){
        if($request->status == 'Y'){
            $status1 = 'COMBO';
            $status2 = 'REGULAR';
        }
        else{
            $status1 = 'REGULAR';
            $status2 = 'COMBO';
        }

        $category = Category::find($request->id);
        $category->enable_combo = $request->status;
        $sql = $category->save();

        if(!$sql){
            $result = 'false';
        }
        else {
            $result = 'true';

            $status = "【Category Type: FROM '$status2' TO '$status1'】";

            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "PRODUCT STATUS UPDATED: User successfully updated status of $category->category with the following CHANGES: $status.";
            $userlogs->save();
        }
        return response($result);
    }

    public function saveCategory(Request $request){
        if(Category::where('category',$request->category)->count() > 0){
            return 'duplicate';
        }
        $category = new Category;
        $category->category = strtoupper(trim($request->category));
        $save = $category->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED CATEGORY: User successfully added Category  '$request->category'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
        }
    }
    public function editCategory(Request $request){
        $category = Category::find($request->category_id);
        $category->category = strtoupper(trim($request->category));
        $save = $category->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED CATEGORY: User successfully updated Category  '$request->category'.";
            $userlogs->save();
            return 'true';
        }
        else{
            return 'false';
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
        return Category::where('category',$request->category)->count() > 0 ? 'true': 'false';
    }
}
