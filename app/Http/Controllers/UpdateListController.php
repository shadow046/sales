<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Update;

class UpdateListController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function update_list(){
        return view('pages.update_list');
    }

    // public function update_list_data(){
    //     return DataTables::of(Update::all()->make(true));
    // }
}
