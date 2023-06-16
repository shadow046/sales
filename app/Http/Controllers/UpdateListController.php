<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Update;
use App\Models\UpdateData;

class UpdateListController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function update_list(){
        return view('pages.update_list');
    }

    public function update_list_data(){
        $list = Update::selectRaw(
            'updates.id,
            updated_by,
            filename,
            branch_code,
            updates.created_at AS date,
            DATE_FORMAT(updates.created_at, "%M %d, %Y, %h:%i%p") AS datetime')
            ->orderBy('id','DESC')
            ->get();
        return DataTables::of($list)->make(true);
    }

    public function update_data(Request $request){
        return UpdateData::where('updates_id', $request->id)->select('data')->get();
    }
}
