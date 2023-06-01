<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Yajra\Datatables\Datatables;
use Carbon\Carbon;

use App\Imports\ProductsImport;
use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;

use App\Models\Product;
use App\Models\Category;
use App\Models\SalesType;
use App\Models\Setup;
use App\Models\PromoProductCombination;
use App\Models\Company;
use App\Models\StoreArea;
use App\Models\Store;
use App\Models\Type;
use App\Models\Update;
use App\Models\UpdateData;
use App\Models\SendUpdate;

use Illuminate\Support\Facades\File;
use Str;
class ProductsController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function products()
    {
        $products = Product::orderBy('item_code', 'asc')->get();
        $categories = Category::select('id', 'category', 'enable_combo')->where('category_status','!=','DELETED')->get()->sortBy('category');
        $product_categories = Category::select('id', 'category')->where('id','!=','0')->where('category_status','!=','DELETED')->get()->sortBy('category');
        $sales_types = SalesType::select('id','sales_type')->where('id','!=','0')->where('sales_type_status','!=','DELETED')->get()->sortBy('sales_type');
        $setups = Setup::select('id', 'setup')->where('id','!=','0')->where('setup_status','!=','DELETED')->get()->sortBy('setup');
        $areas = StoreArea::where('id', '!=', '0')->where('store_area_status', 'ACTIVE')->get()->sortBy('store_area');
        $companies = Company::select('id','company_name')->where('id','!=','0')->where('status','!=','INACTIVE')->get()->sortBy('company_name');
        $types = Type::select('id', 'type')->where('id','!=','0')->where('type_status','!=','DELETED')->get()->sortBy('type');
        return view('pages.products', compact('products','categories','product_categories','sales_types','setups','areas','companies','types'));
    }

    public function products_data()
    {
        $products = Product::query()
            ->selectRaw('products.id AS id, category.id AS category, category.category AS category_name, item_code, intro_date, short_desc, long_desc, sku, modifier_code, setup, area, store, status, product_image, product_update_status')
            ->selectRaw('dine_in, take_out, pick_up, delivery, bulk_order, fds, drive_thru, meal_type')
            ->selectRaw('dine_in_airport, take_out_airport, pick_up_airport, delivery_airport, bulk_order_airport, fds_airport, drive_thru_airport, meal_type_airport')
            ->selectRaw('pos_setup, max_modifier, seq, kitchen_printer, promo_start, promo_end, promo_price, promo_item_not_allow, sales_type, promo_setup, start_date, start_time, end_date, end_time, days_available')
            ->selectRaw('senior, pwd')
            ->selectRaw('company, type, store_code')
            ->selectRaw('dine_sml, dine_med, dine_large, dine_xl, dine_zero, takeout_sml, takeout_med, takeout_large, takeout_xl, takeout_zero, pickup_sml, pickup_med, pickup_large, pickup_xl, pickup_zero, delivery_sml, delivery_med, delivery_large, delivery_xl, delivery_zero')
            ->join('category','category.id','products.category')
            ->orderBy('product_update_status','ASC')
            ->orderBy('category_name','ASC')
            ->orderBy('item_code','ASC');
        return DataTables::of($products)
        ->addColumn('company_name' ,function(Product $products){
            if($products->company == '0'){
                $company_row = Company::where('id','!=','0')->pluck('company_name')->toArray();
                $company_separated = implode(', ', $company_row);
                return $company_separated;
            }
            else{
                $company_row = '';
                $array = explode("|", $products->company);
                foreach ($array as $value){
                    $company = Company::where('id',$value)->first();
                    if($company_row != ''){
                        $company_row = $company_row.', '.$company->company_name;
                    }
                    else{
                        $company_row = $company->company_name;
                    }
                }
                return $company_row;
            }
        })
        ->addColumn('type_name' ,function(Product $products){
            if($products->type == '0'){
                $type_row = Type::where('id','!=','0')->pluck('type')->toArray();
                $type_separated = implode(', ', $type_row);
                return $type_separated;
            }
            else{
                $type_row = '';
                $array = explode("|", $products->type);
                foreach ($array as $value) {
                    $type = Type::where('id',$value)->first();
                    if($type_row != ''){
                        $type_row = $type_row.', '.$type->type;
                    }
                    else{
                        $type_row = $type->type;
                    }
                }
                return $type_row;
            }
        })
        ->addColumn('setup_name', function(Product $products){
            if(!$products->setup){
                return '';
            }
            else{
                $setup_row = '';
                $array = explode(",", $products->setup);
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
        ->addColumn('area_name', function(Product $products){
            if(!$products->area){
                return 'NONE';
            }
            else{
                $user_row = '';
                $array = explode("|", $products->area);
                foreach($array as $value){
                    if($value == '-1'){
                        $user_row = 'ALL';
                    }
                    else{
                        $user = StoreArea::where('id', $value)->first();
                        if($user_row != ''){
                            $user_row = $user_row.'|'.$user->store_area;
                        }
                        else{
                            $user_row = $user->store_area;
                        }
                    }
                }
                return $user_row;
            }
        })
        ->addColumn('store_name', function(Product $products){
            if(!$products->store){
                return 'NONE';
            }
            else{
                $user_row = '';
                $array = explode("|", $products->store);
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

    public function products_reload(){
        if(Product::count() == 0){
            return 'NULL';
        }
        $data_update = Product::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    public function products_status(Request $request){
        if($request->status == 'ACTIVE'){
            $status1 = 'ACTIVE';
            $status2 = 'INACTIVE';
        }
        else{
            $status1 = 'INACTIVE';
            $status2 = 'ACTIVE';
        }
        $short_desc = strtoupper($request->short_desc);

        $products = Product::find($request->id);
        $products->status = $request->status;
        $products->product_update_status = '0';
        $sql = $products->save();

        if(!$sql){
            $result = 'false';
        }
        else {
            $result = 'true';

            $status = "【Status: FROM '$status2' TO '$status1'】";

            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "PRODUCT STATUS UPDATED: User successfully updated status of $short_desc with Item Code: $request->item_code with the following CHANGES: $status.";
            $userlogs->save();
        }
        return response($result);
    }

    public function products_save(Request $request){
        $product = new Product;
        // Page 1
        $product->product_image = $request->product_image == 'N/A' ? '' : $request->product_image;
        $product->item_code = strtoupper($request->item_code);
        $product->category = $request->category;
        $product->intro_date = $request->intro_date;
        $product->short_desc = strtoupper($request->short_desc);
        $product->long_desc = strtoupper($request->long_desc);
        $product->sku = strtoupper($request->sku);
        $product->modifier_code = $request->modifier_code;

        $product->dine_in = $request->dine_in;
        $product->take_out = $request->take_out;
        $product->pick_up = $request->pick_up;
        $product->delivery = $request->delivery;
        $product->bulk_order = $request->bulk_order;
        $product->fds = $request->fds;
        $product->drive_thru = $request->drive_thru;
        $product->meal_type = $request->meal_type;
        $product->dine_in_airport = $request->dine_in;
        $product->take_out_airport = $request->take_out_airport;
        $product->pick_up_airport = $request->pick_up_airport;
        $product->delivery_airport = $request->delivery_airport;
        $product->bulk_order_airport = $request->bulk_order_airport;
        $product->fds_airport = $request->fds_airport;
        $product->drive_thru_airport = $request->drive_thru_airport;
        $product->meal_type_airport = $request->meal_type_airport;
        $product->senior = $request->senior;
        $product->pwd = $request->pwd;
        $product->pos_setup = $request->pos_setup;
        $product->max_modifier = $request->max_modifier;
        $product->setup = $request->setup ? implode(",",$request->setup) : '';
        $product->company = !$request->company || $request->company == '0' ? '0' : implode("|", $request->company);
        $product->type = !$request->type || $request->type == '0' ? '0' : implode("|", $request->type);
        $product->area = $request->area == '0' ? '0' : implode("|", $request->area);
        $product->store = $request->store == '0' ? '0' : implode("|", $request->store);
        $product->store_code = implode(",",$request->store_code);
        $product->seq = $request->seq;
        $product->kitchen_printer = $request->kitchen_printer;
        // Page 2
        $product->promo_start = $request->promo_start;
        $product->promo_end = $request->promo_end;
        $product->promo_price = $request->promo_price;
        $product->promo_item_not_allow = $request->promo_item_not_allow;
        $product->sales_type = $request->sales_type;
        $product->promo_setup = $request->promo_setup;
        $product->start_date = $request->start_date;
        $product->start_time = $request->start_time;
        $product->end_date = $request->end_date;
        $product->end_time = $request->end_time;
        $product->days_available = $request->days_available;
        $product->dine_sml = $request->dine_sml;
        $product->dine_med = $request->dine_med;
        $product->dine_large = $request->dine_large;
        $product->dine_xl = $request->dine_xl;
        $product->dine_zero = $request->dine_zero;
        $product->takeout_sml = $request->takeout_sml;
        $product->takeout_med = $request->takeout_med;
        $product->takeout_large = $request->takeout_large;
        $product->takeout_xl = $request->takeout_xl;
        $product->takeout_zero = $request->takeout_zero;
        $product->pickup_sml = $request->pickup_sml;
        $product->pickup_med = $request->pickup_med;
        $product->pickup_large = $request->pickup_large;
        $product->pickup_xl = $request->pickup_xl;
        $product->pickup_zero = $request->pickup_zero;
        $product->delivery_sml = $request->delivery_sml;
        $product->delivery_med = $request->delivery_med;
        $product->delivery_large = $request->delivery_large;
        $product->delivery_xl = $request->delivery_xl;
        $product->delivery_zero = $request->delivery_zero;
        $product->product_update_status = '0';
        $save = $product->save();

        if($save){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED PRODUCT: User successfully added Product '$product->short_desc' with Item Code '$product->item_code'.";
            $userlogs->save();

            $result = 'true';
            $id = $product->id;
        }
        else{
            $result = 'false';
            $id = '';
        }

        $data = array('result' => $result, 'id' => $id);
        return response()->json($data);
    }

    public function products_update(Request $request){
        if($request->filename_delete){
            if(file_exists(public_path('storage/product_images/'.$request->filename_delete))){
                unlink(public_path('storage/product_images/'.$request->filename_delete));
            }
        }

        PromoProductCombination::where('promo_id',$request->id)->delete();

        // Page 1
        $item_code_orig = Product::where('id', $request->id)->first()->item_code;
        $category_orig = Product::where('id', $request->id)->first()->category;
        $intro_date_orig = Product::where('id', $request->id)->first()->intro_date;
        $short_desc_orig = Product::where('id', $request->id)->first()->short_desc;
        $long_desc_orig = Product::where('id', $request->id)->first()->long_desc;
        $sku_orig = Product::where('id', $request->id)->first()->sku;
        $modifier_code_orig = Product::where('id', $request->id)->first()->modifier_code;

        $dine_in_orig = Product::where('id', $request->id)->first()->dine_in;
        $take_out_orig = Product::where('id', $request->id)->first()->take_out;
        $pick_up_orig = Product::where('id', $request->id)->first()->pick_up;
        $delivery_orig = Product::where('id', $request->id)->first()->delivery;
        $bulk_order_orig = Product::where('id', $request->id)->first()->bulk_order;
        $fds_orig = Product::where('id', $request->id)->first()->fds;
        $drive_thru_orig = Product::where('id', $request->id)->first()->drive_thru;
        $meal_type_orig = Product::where('id', $request->id)->first()->meal_type;

        $dine_in_airport_orig = Product::where('id', $request->id)->first()->dine_in_airport;
        $take_out_airport_orig = Product::where('id', $request->id)->first()->take_out_airport;
        $pick_up_airport_orig = Product::where('id', $request->id)->first()->pick_up_airport;
        $delivery_airport_orig = Product::where('id', $request->id)->first()->delivery_airport;
        $bulk_order_airport_orig = Product::where('id', $request->id)->first()->bulk_order_airport;
        $fds_airport_orig = Product::where('id', $request->id)->first()->fds_airport;
        $drive_thru_airport_orig = Product::where('id', $request->id)->first()->drive_thru_airport;
        $meal_type_airport_orig = Product::where('id', $request->id)->first()->meal_type_airport;

        $company_orig = Product::where('id', $request->id)->first()->company;
        $type_orig = Product::where('id', $request->id)->first()->type;
        $setup_orig = Product::where('id', $request->id)->first()->setup;
        $area_orig = Product::where('id', $request->id)->first()->area;
        $store_orig = Product::where('id', $request->id)->first()->store;
        $sales_type_orig = Product::where('id', $request->id)->first()->sales_type;

        $max_modifier_orig = Product::where('id', $request->id)->first()->max_modifier;
        $seq_orig = Product::where('id', $request->id)->first()->seq;
        $kitchen_printer_orig = Product::where('id', $request->id)->first()->kitchen_printer;

        // Page 2
        $promo_start_orig = Product::where('id', $request->id)->first()->promo_start;
        $promo_end_orig = Product::where('id', $request->id)->first()->promo_end;
        $promo_price_orig = Product::where('id', $request->id)->first()->promo_price;
        $start_date_orig = Product::where('id', $request->id)->first()->start_date;
        $start_time_orig = Product::where('id', $request->id)->first()->start_time;
        $end_date_orig = Product::where('id', $request->id)->first()->end_date;
        $end_time_orig = Product::where('id', $request->id)->first()->end_time;

        if($request->promo_start != $promo_start_orig){
            $promo_start1 = Carbon::parse($promo_start_orig)->format('F d, Y');
            $promo_start2 = Carbon::parse($request->promo_start)->format('F d, Y');
            $promo_start_change = "【PROMO START: FROM '$promo_start1' TO '$promo_start2'】";
        }
        else{
            $promo_start_change = NULL;
        }

        if($request->promo_end != $promo_end_orig){
            $promo_end1 = Carbon::parse($promo_end_orig)->format('F d, Y');
            $promo_end2 = Carbon::parse($request->promo_end)->format('F d, Y');
            $promo_end_change = "【PROMO END: FROM '$promo_end1' TO '$promo_end2'】";
        }
        else{
            $promo_end_change = NULL;
        }

        if($request->promo_price != $promo_price_orig){
            $promo_price_new = strtoupper($request->promo_price);
            $promo_price_change = "【PROMO PRICE: FROM '₱$promo_price_orig' TO '₱$promo_price_new'】";
        }
        else{
            $promo_price_change = NULL;
        }

        if($request->start_date != $start_date_orig){
            $start_date1 = Carbon::parse($start_date_orig)->format('F d, Y');
            $start_date2 = Carbon::parse($request->start_date)->format('F d, Y');
            $start_date_change = "【START DATE: FROM '$start_date1' TO '$start_date2'】";
        }
        else{
            $start_date_change = NULL;
        }

        if($request->start_time != $start_time_orig){
            $start_time_new = strtoupper($request->start_time);
            if($start_time_orig == null){
                $start_time_orig = 'N/A';
            }
                $start_time_change = "【START TIME: FROM '$start_time_orig' TO '$start_time_new'】";
        }
        else{
            $start_time_change = NULL;
        }

        if($request->end_date != $end_date_orig){
            $end_date1 = Carbon::parse($end_date_orig)->format('F d, Y');
            $end_date2 = Carbon::parse($request->end_date)->format('F d, Y');
            $end_date_change = "【END DATE: FROM '$end_date1' TO '$end_date2'】";
        }
        else{
            $end_date_change = NULL;
        }

        if($request->end_time != $end_time_orig){
            $end_time_new = strtoupper($request->end_time);
            if($end_time_orig == null){
                $end_time_orig = 'N/A';
            }
                $end_time_change = "【END TIME: FROM '$end_time_orig' TO '$end_time_new'】";
        }
        else{
            $end_time_change = NULL;
        }

        if($request->sales_type != $sales_type_orig){
            $sales_type_orig = ($sales_type_orig !== null) ? SalesType::where('id', $sales_type_orig)->first()->sales_type : 'N/A';
            $sales_type_new = SalesType::where('id', $request->sales_type)->first()->sales_type;
            $sales_type_change = "【SALES TYPE: FROM '$sales_type_orig' TO '$sales_type_new'】";
        }
        else{
            $sales_type_change = NULL;
        }
        // Page 2 end

        if($request->max_modifier != $max_modifier_orig){
            $max_modifier_new = strtoupper($request->max_modifier);
            $max_modifier_change = "【MAX MODIFIER: FROM '$max_modifier_orig' TO '$max_modifier_new'】";
        }
        else{
            $max_modifier_change = NULL;
        }

        if($request->seq != $seq_orig){
            $seq_new = strtoupper($request->seq);
            $seq_change = "【SEQ: FROM '$seq_orig' TO '$seq_new'】";
        }
        else{
            $seq_change = NULL;
        }

        if($request->kitchen_printer != $kitchen_printer_orig){
            $kitchen_printer_new = strtoupper($request->kitchen_printer);
            $kitchen_printer_change = "【KITCHEN PRINTER: FROM '$kitchen_printer_orig' TO '$kitchen_printer_new'】";
        }
        else{
            $kitchen_printer_change = NULL;
        }

        if(($request->company) != array_map('trim', (explode('|', $company_orig)))){
            if($company_orig == '0'){
                $company_orig == 'ALL';
            }
            else{
                if(!$company_orig){
                    $company_orig = 'N/A';
                }
                else{
                    $company_filter = array_map('trim', (explode('|', $company_orig)));
                    $company_array = Company::selectRaw('company_name')->whereIn('id', $company_filter)->get()->toArray();
                    $company_orig = array_map(function($item) {
                        return $item['company_name'];
                    }, $company_array);
                    $company_orig = implode(', ', $company_orig);
                }
            }
            if($request->company == ['0']){
                $company_new = 'ALL';
            }
            else{
                $company_array = array();
                $company = Company::all();
                foreach($company as $companykey => $companyvalue){
                    if(in_array($companyvalue['id'], $request->company)){
                        array_push($company_array, $companyvalue['company_name']);
                    }
                }
                $company_new = implode(', ', $company_array);
            }
            $company_change = "【COMPANY: FROM '$company_orig' TO '$company_new'】";
        }
        else{
            $company_change = NULL;
        }

        if(($request->type) != array_map('trim', (explode('|', $type_orig)))){
            if($type_orig == '0'){
                $type_orig == 'ALL';
            }
            else{
                if(!$type_orig){
                    $type_orig = 'N/A';
                }
                else{
                    $type_filter = array_map('trim', (explode('|', $type_orig)));
                    $type_array = Type::selectRaw('type')->whereIn('id', $type_filter)->get()->toArray();
                    $type_orig = array_map(function($item) {
                        return $item['type'];
                    }, $type_array);
                    $type_orig = implode(', ', $type_orig);
                }
            }
            if($request->type == ['0']){
                $type_new = 'ALL';
            }
            else{
                $type_array = array();
                $type = Type::all();
                foreach($type as $typekey => $typevalue){
                    if(in_array($typevalue['id'], $request->type)){
                        array_push($type_array, $typevalue['type']);
                    }
                }
                $type_new = implode(', ', $type_array);
            }
            $type_change = "【STORE TYPE: FROM '$type_orig' TO '$type_new'】";
        }
        else{
            $type_change = NULL;
        }

        if(($request->setup) != array_map('trim', (explode(',', $setup_orig)))){
            if($setup_orig == '0'){
                $setup_orig = 'ALL';
            }
            else{
                if(!$setup_orig){
                    $setup_orig = 'N/A';
                }
                else{
                    $setup_filter = array_map('trim', (explode(',', $setup_orig)));
                    $setup_array = Setup::selectRaw('setup')->whereIn('id', $setup_filter)->get()->toArray();
                    $setup_orig = array_map(function($item) {
                        return $item['setup'];
                    }, $setup_array);
                    $setup_orig = implode(', ', $setup_orig);
                }
            }
            if($request->setup == ['0']){
                $setup_new = 'ALL';
            }
            else{
                $setup_array = array();
                $setup = Setup::all();
                foreach($setup as $setupkey => $setupvalue){
                    if(in_array($setupvalue['id'], $request->setup)){
                        array_push($setup_array, $setupvalue['setup']);
                    }
                }
                $setup_new = implode(', ', $setup_array);
            }
            $setup_change = "【STORE SETUP: FROM '$setup_orig' TO '$setup_new'】";
        }
        else{
            $setup_change = NULL;
        }

        if(($request->area) != array_map('trim', (explode('|', $area_orig)))){
            if($area_orig == '0'){
                $area_orig = 'ALL';
            }
            else{
                if(!$area_orig){
                    $area_orig = 'N/A';
                }
                else{
                    $area_filter = array_map('trim', (explode('|', $area_orig)));
                    $area_array = StoreArea::selectRaw('store_area')->whereIn('id', $area_filter)->get()->toArray();
                    $area_orig = array_map(function($item) {
                        return $item['store_area'];
                    }, $area_array);
                    $area_orig = implode(', ', $area_orig);
                }
            }
            if($request->area == ['0']){
                $area_new = 'ALL';
            }
            else{
                $area_array = array();
                $area = StoreArea::all();
                foreach($area as $areakey => $areavalue){
                    if(in_array($areavalue['id'], $request->area)){
                        array_push($area_array, $areavalue['store_area']);
                    }
                }
                $area_new = implode(', ', $area_array);
            }
            $area_change = "【STORE AREA: FROM '$area_orig' TO '$area_new'】";
        }
        else{
            $area_change = NULL;
        }

        if(($request->store) != array_map('trim', (explode('|', $store_orig)))){
            if($store_orig == '0-0'){
                $store_orig = 'ALL (ALL BRANCHES)';
            }
            else{
                if(!$store_orig){
                    $store_orig = 'N/A';
                }
                else{
                    $user_row = '';
                    $array = array_map('trim', (explode('|', $store_orig)));
                    foreach($array as $value){
                        if(!str_contains($value, '-0')){
                            $user = Store::where('id', $value)->first();
                            if($user_row != ''){
                                $user_row = $user_row.', '.$user->branch_code.': '.$user->branch_name;
                            }
                            else{
                                $user_row = $user->branch_code.': '.$user->branch_name;
                            }
                        }
                        else{
                            $user = StoreArea::where('id', substr($value, 0, -2))->first();
                            if($user_row != ''){
                                $user_row = $user_row.', '.$user->store_area.' (ALL BRANCHES)';
                            }
                            else{
                                $user_row = $user->store_area.' (ALL BRANCHES)';
                            }
                        }
                    }
                    $store_orig = $user_row;
                }
            }
            if($request->store == ['0-0']){
                $store_new = 'ALL (ALL BRANCHES)';
                $store_change = "【STORE BRANCHES: FROM '$store_orig' TO '$store_new'】";
            }
            else{
                $store_array = array();
                $store = Store::all();
                foreach($request->store as $value){
                    if(str_contains($value, '-0')){
                        $user = StoreArea::where('id', substr($value, 0, -2))->first();
                        array_push($store_array, $user->store_area.' (ALL BRANCHES)');
                    }
                }
                foreach($store as $storekey => $storevalue){
                    if(in_array($storevalue['id'], $request->store)){
                        array_push($store_array, $storevalue['branch_code'] . ': ' . $storevalue['branch_name']);
                    }
                }
                $store_new = implode(', ', $store_array);
                $store_change = "【STORE BRANCHES: FROM '$store_orig' TO '$store_new'】";
            }
        }
        else{
            $store_change = NULL;
        }

        //-
        if($request->item_code != $item_code_orig){
            $item_code_new = strtoupper($request->item_code);
            $item_code_change = "【ITEM CODE: FROM '$item_code_orig' TO '$item_code_new'】";
        }
        else{
            $item_code_change = NULL;
        }

        if($request->category != $category_orig){
            $category_orig = Category::where('id', $category_orig)->first()->category;
            $category_new = Category::where('id', $request->category)->first()->category;
            $category_change = "【PRODUCT CATEGORY: FROM '$category_orig' TO '$category_new'】";
        }
        else{
            $category_change = NULL;
        }

        if($request->intro_date != $intro_date_orig){
            $intro_date1 = Carbon::parse($intro_date_orig)->format('F d, Y');
            $intro_date2 = Carbon::parse($request->intro_date)->format('F d, Y');
            $intro_date_change = "【INTRO DATE: FROM '$intro_date1' TO '$intro_date2'】";
        }
        else{
            $intro_date_change = NULL;
        }

        if($request->short_desc != $short_desc_orig){
            $short_desc_new = strtoupper($request->short_desc);
            $short_desc_change = "【SHORT DESCRIPTION: FROM '$short_desc_orig' TO '$short_desc_new'】";
        }
        else{
            $short_desc_change = NULL;
        }

        if($request->long_desc != $long_desc_orig){
            $long_desc_new = strtoupper($request->long_desc);
            $long_desc_change = "【LONG DESCRIPTION: FROM '$long_desc_orig' TO '$long_desc_new'】";
        }
        else{
            $long_desc_change = NULL;
        }

        if($request->sku != $sku_orig){
            $sku_new = strtoupper($request->sku);
            $sku_change = "【SKU: FROM '$sku_orig' TO '$sku_new'】";
        }
        else{
            $sku_change = NULL;
        }

        if($request->modifier_code != $modifier_code_orig){
            $modifier_code_new = strtoupper($request->modifier_code);
            $modifier_code_change = "【MODIFIER CODE: FROM '$modifier_code_orig' TO '$modifier_code_new'】";
        }
        else{
            $modifier_code_change = NULL;
        }
        // REGULAR
        if($request->dine_in != $dine_in_orig){
            $dine_in_new = strtoupper($request->dine_in);
            $dine_in_change = "【REGULAR - DINE IN PRICE: FROM '₱$dine_in_orig' TO '₱$dine_in_new'】";
        }
        else{
            $dine_in_change = NULL;
        }

        if($request->take_out != $take_out_orig){
            $take_out_new = strtoupper($request->take_out);
            $take_out_change = "【REGULAR - TAKE OUT PRICE: FROM '₱$take_out_orig' TO '₱$take_out_new'】";
        }
        else{
            $take_out_change = NULL;
        }

        if($request->pick_up != $pick_up_orig){
            $pick_up_new = strtoupper($request->pick_up);
            $pick_up_change = "【REGULAR - PICK UP PRICE: FROM '₱$pick_up_orig' TO '₱$pick_up_new'】";
        }
        else{
            $pick_up_change = NULL;
        }

        if($request->delivery != $delivery_orig){
            $delivery_new = strtoupper($request->delivery);
            $delivery_change = "【REGULAR - DELIVERY PRICE: FROM '₱$delivery_orig' TO '₱$delivery_new'】";
        }
        else{
            $delivery_change = NULL;
        }

        if($request->bulk_order != $bulk_order_orig){
            $bulk_order_new = strtoupper($request->bulk_order);
            $bulk_order_change = "【REGULAR - BULK ORDER PRICE: FROM '₱$bulk_order_orig' TO '₱$bulk_order_new'】";
        }
        else{
            $bulk_order_change = NULL;
        }

        if($request->fds != $fds_orig){
            $fds_new = strtoupper($request->fds);
            $fds_change = "【REGULAR - FDS PRICE: FROM '₱$fds_orig' TO '₱$fds_new'】";
        }
        else{
            $fds_change = NULL;
        }

        if($request->drive_thru != $drive_thru_orig){
            $drive_thru_new = strtoupper($request->drive_thru);
            $drive_thru_change = "【REGULAR - DRIVE THRU PRICE: FROM '₱$drive_thru_orig' TO '₱$drive_thru_new'】";
        }
        else{
            $drive_thru_change = NULL;
        }

        if($request->meal_type != $meal_type_orig){
            $meal_type_new = strtoupper($request->meal_type);
            $meal_type_change = "【REGULAR - MEAL TYPE PRICE: FROM '₱$meal_type_orig' TO '₱$meal_type_new'】";
        }
        else{
            $meal_type_change = NULL;
        }
        // AIRPORT
        if($request->dine_in_airport != $dine_in_airport_orig){
            $dine_in_airport_new = strtoupper($request->dine_in_airport);
            $dine_in_airport_change = "【AIRPORT - DINE IN PRICE: FROM '₱$dine_in_airport_orig' TO '₱$dine_in_airport_new'】";
        }
        else{
            $dine_in_airport_change = NULL;
        }

        if($request->take_out_airport != $take_out_airport_orig){
            $take_out_airport_new = strtoupper($request->take_out_airport);
            $take_out_airport_change = "【AIRPORT - TAKE OUT PRICE: FROM '₱$take_out_airport_orig' TO '₱$take_out_airport_new'】";
        }
        else{
            $take_out_airport_change = NULL;
        }

        if($request->pick_up_airport != $pick_up_airport_orig){
            $pick_up_airport_new = strtoupper($request->pick_up_airport);
            $pick_up_airport_change = "【AIRPORT - PICK UP PRICE: FROM '₱$pick_up_airport_orig' TO '₱$pick_up_airport_new'】";
        }
        else{
            $pick_up_airport_change = NULL;
        }

        if($request->delivery_airport != $delivery_airport_orig){
            $delivery_airport_new = strtoupper($request->delivery_airport);
            $delivery_airport_change = "【AIRPORT - DELIVERY PRICE: FROM '₱$delivery_airport_orig' TO '₱$delivery_airport_new'】";
        }
        else{
            $delivery_airport_change = NULL;
        }

        if($request->bulk_order_airport != $bulk_order_airport_orig){
            $bulk_order_airport_new = strtoupper($request->bulk_order_airport);
            $bulk_order_airport_change = "【AIRPORT - BULK ORDER PRICE: FROM '₱$bulk_order_airport_orig' TO '₱$bulk_order_airport_new'】";
        }
        else{
            $bulk_order_airport_change = NULL;
        }

        if($request->fds_airport != $fds_airport_orig){
            $fds_airport_new = strtoupper($request->fds_airport);
            $fds_airport_change = "【AIRPORT - FDS PRICE: FROM '₱$fds_airport_orig' TO '₱$fds_airport_new'】";
        }
        else{
            $fds_airport_change = NULL;
        }

        if($request->drive_thru_airport != $drive_thru_airport_orig){
            $drive_thru_airport_new = strtoupper($request->drive_thru_airport);
            $drive_thru_airport_change = "【AIRPORT - DRIVE THRU PRICE: FROM '₱$drive_thru_airport_orig' TO '₱$drive_thru_airport_new'】";
        }
        else{
            $drive_thru_airport_change = NULL;
        }

        if($request->meal_type_airport != $meal_type_airport_orig){
            $meal_type_airport_new = strtoupper($request->meal_type_airport);
            $meal_type_airport_change = "【AIRPORT - MEAL TYPE PRICE: FROM '₱$meal_type_airport_orig' TO '₱$meal_type_airport_new'】";
        }
        else{
            $meal_type_airport_change = NULL;
        }

        if($request->product_composition_change == 'CHANGED'){
            $composition_change = "【PRODUCT COMPOSITION: LIST OF PRODUCT COMPOSITION HAVE BEEN CHANGED】";
        }
        else{
            $composition_change = NULL;
        }

        if($request->product_image_change == 'CHANGED'){
            $image_change = "【IMAGE CHANGED: PRODUCT '$request->short_desc' IMAGE HAS BEEN CHANGED】";
        }
        else{
            $image_change = NULL;
        }

        $product = Product::find($request->id);
        $product->product_image = $request->product_image == 'N/A' ? '' : $request->product_image;
        $product->item_code = strtoupper($request->item_code);
        $product->category = $request->category;
        $product->intro_date = $request->intro_date;
        $product->short_desc = strtoupper($request->short_desc);
        $product->long_desc = strtoupper($request->long_desc);
        $product->sku = strtoupper($request->sku);
        $product->modifier_code = $request->modifier_code;

        $product->dine_in = $request->dine_in;
        $product->take_out = $request->take_out;
        $product->pick_up = $request->pick_up;
        $product->delivery = $request->delivery;
        $product->bulk_order = $request->bulk_order;
        $product->fds = $request->fds;
        $product->drive_thru = $request->drive_thru;
        $product->meal_type = $request->meal_type;
        $product->dine_in_airport = $request->dine_in_airport;
        $product->take_out_airport = $request->take_out_airport;
        $product->pick_up_airport = $request->pick_up_airport;
        $product->delivery_airport = $request->delivery_airport;
        $product->bulk_order_airport = $request->bulk_order_airport;
        $product->fds_airport = $request->fds_airport;
        $product->drive_thru_airport = $request->drive_thru_airport;
        $product->meal_type_airport = $request->meal_type_airport;
        $product->senior = $request->senior;
        $product->pwd = $request->pwd;

        $product->pos_setup = $request->pos_setup;
        $product->max_modifier = $request->max_modifier;
        $product->setup = $request->setup ? implode(",",$request->setup) : '';
        $product->company = !$request->company || $request->company == '0' ? '0' : implode("|", $request->company);
        $product->type = !$request->type || $request->type == '0' ? '0' : implode("|", $request->type);
        $product->area = $request->area == '0' ? '0' : implode("|", $request->area);
        $product->store = $request->store == '0' || $request->store == '' ? '0' : implode("|", $request->store);
        $product->store_code = implode(",",$request->store_code);
        $product->seq = $request->seq;
        $product->kitchen_printer = $request->kitchen_printer;
        // Page 2
        $product->promo_start = $request->promo_start;
        $product->promo_end = $request->promo_end;
        $product->promo_price = $request->promo_price;
        $product->promo_item_not_allow = $request->promo_item_not_allow;
        $product->sales_type = $request->sales_type;
        $product->promo_setup = $request->promo_setup;
        $product->start_date = $request->start_date;
        $product->start_time = $request->start_time;
        $product->end_date = $request->end_date;
        $product->end_time = $request->end_time;
        $product->days_available = $request->days_available;
        $product->dine_sml = $request->dine_sml;
        $product->dine_med = $request->dine_med;
        $product->dine_large = $request->dine_large;
        $product->dine_xl = $request->dine_xl;
        $product->dine_zero = $request->dine_zero;
        $product->takeout_sml = $request->takeout_sml;
        $product->takeout_med = $request->takeout_med;
        $product->takeout_large = $request->takeout_large;
        $product->takeout_xl = $request->takeout_xl;
        $product->takeout_zero = $request->takeout_zero;
        $product->pickup_sml = $request->pickup_sml;
        $product->pickup_med = $request->pickup_med;
        $product->pickup_large = $request->pickup_large;
        $product->pickup_xl = $request->pickup_xl;
        $product->pickup_zero = $request->pickup_zero;
        $product->delivery_sml = $request->delivery_sml;
        $product->delivery_med = $request->delivery_med;
        $product->delivery_large = $request->delivery_large;
        $product->delivery_xl = $request->delivery_xl;
        $product->delivery_zero = $request->delivery_zero;
        $product->product_update_status = '0';
        $save = $product->save();

        if($save){

            if($request->item_code != $item_code_orig ||
                $request->category != $category_orig ||
                $request->intro_date != $intro_date_orig ||
                $request->short_desc != $short_desc_orig ||
                $request->long_desc != $long_desc_orig ||
                $request->sku != $sku_orig ||
                $request->modifier_code != $modifier_code_orig ||
                $request->dine_in != $dine_in_orig ||
                $request->take_out != $take_out_orig ||
                $request->pick_up != $pick_up_orig ||
                $request->delivery != $delivery_orig ||
                $request->bulk_order != $bulk_order_orig ||
                $request->fds != $fds_orig ||
                $request->drive_thru != $drive_thru_orig ||
                $request->meal_type != $meal_type_orig ||
                $request->dine_in_airport != $dine_in_airport_orig ||
                $request->take_out_airport != $take_out_airport_orig ||
                $request->pick_up_airport != $pick_up_airport_orig ||
                $request->delivery_airport != $delivery_airport_orig ||
                $request->bulk_order_airport != $bulk_order_airport_orig ||
                $request->fds_airport != $fds_airport_orig ||
                $request->drive_thru_airport != $drive_thru_airport_orig ||
                $request->meal_type_airport != $meal_type_airport_orig ||
                $request->product_composition_change == 'CHANGED' ||
                $request->company != array_map('trim', (explode('|', $company_orig))) ||
                $request->type != array_map('trim', (explode('|', $type_orig))) ||
                $request->setup != array_map('trim', (explode(',', $setup_orig))) ||
                $request->area != array_map('trim', (explode('|', $area_orig))) ||
                $request->store != array_map('trim', (explode('|', $store_orig))) ||
                $request->product_image_change == 'CHANGED' ||
                $request->promo_start != $promo_start_orig ||
                $request->promo_end != $promo_end_orig ||
                $request->promo_price != $promo_price_orig ||
                $request->start_date != $start_date_orig ||
                $request->start_time != $start_time_orig ||
                $request->end_date != $end_date_orig ||
                $request->end_time != $end_time_orig ||
                $request->max_modifier != $max_modifier_orig ||
                $request->seq != $seq_orig ||
                $request->kitchen_printer != $kitchen_printer_orig
            ){
                $userlogs = new UserLogs;
                $userlogs->user_id = auth()->user()->id;
                $userlogs->activity = "UPDATED PRODUCT: User successfully updated Product '$product->short_desc' with Item Code '$item_code_orig' with the following CHANGES:
                                        $item_code_change
                                        $category_change
                                        $intro_date_change
                                        $short_desc_change
                                        $long_desc_change
                                        $sku_change
                                        $modifier_code_change
                                        $dine_in_change
                                        $take_out_change
                                        $pick_up_change
                                        $delivery_change
                                        $bulk_order_change
                                        $fds_change
                                        $drive_thru_change
                                        $meal_type_change
                                        $dine_in_airport_change
                                        $take_out_airport_change
                                        $pick_up_airport_change
                                        $delivery_airport_change
                                        $bulk_order_airport_change
                                        $fds_airport_change
                                        $drive_thru_airport_change
                                        $meal_type_airport_change
                                        $composition_change
                                        $company_change
                                        $type_change
                                        $setup_change
                                        $area_change
                                        $store_change
                                        $image_change
                                        $promo_start_change
                                        $promo_end_change
                                        $promo_price_change
                                        $start_date_change
                                        $start_time_change
                                        $end_date_change
                                        $end_time_change
                                        $sales_type_change
                                        $max_modifier_change
                                        $seq_change
                                        $kitchen_printer_change
                                        ";
                $userlogs->save();
            }

            $result = 'true';
            $id = $product->id;
        }
        else{
            $result = 'false';
            $id = '';
        }

        $data = array('result' => $result, 'id' => $id);
        return response()->json($data);
    }

    public function insertImage(Request $request){

        $productImageFile = $request->file('product_image');
        $productImageExtension = $productImageFile->getClientOriginalExtension();
        $productImageFileName = time().rand(1,100).'_Product_Image.'.$productImageExtension;
        $productImageFile->storeAs('public/product_images',$productImageFileName);

        return $productImageFileName;
    }

    public function products_stores(Request $request){

        if($request->area_id == ['0']){
            $area_array = StoreArea::select('id')->get()->toArray();
            $areas = array_map(function($item) {
                return $item['id'];
            }, $area_array);
        }
        else{
            $areas = $request->area_id;
            if($request->area_all){
                $areas = array_diff($request->area_id, $request->area_all);
            }
            else{
                $areas = $request->area_id;
            }
        }

        if($request->company_id == ['0']){
            $company_array = Company::select('id')->get()->toArray();
            $companies = array_map(function($item) {
                return $item['id'];
            }, $company_array);
        }
        else{
            $companies = $request->company_id;
        }

        if($request->type_id == ['0']){
            $type_array = Type::select('id')->get()->toArray();
            $types = array_map(function($item) {
                return $item['id'];
            }, $type_array);
        }
        else{
            $types = $request->type_id;
        }

        $list = array();
        $stores = Store::query()
            ->whereIn('company_name', $companies)
            ->whereIn('type', $types)
            ->whereIn('store_area', $areas)
            ->orderBy('branch_code', 'asc')
            ->get();
        foreach($stores as $store){
            if($request->setup_id == ['0']){
                array_push($list, $store);
            }
            else{
                $setup_array = explode(',',$store->setup);
                $x = 0;
                foreach($request->setup_id as $setup_id){
                    if($x == 0){
                        if(in_array($setup_id, $setup_array)){
                            array_push($list, $store);
                            $x++;
                        }
                    }
                }
            }
        }
        return response()->json($list);
    }

    public function checkDuplicate(Request $request){
        if(Product::where('item_code',$request->item_code)->count() > 0){
            return 'duplicate_item_code';
        }

        if($request->sku){
            if(Product::where('sku',$request->sku)->count() > 0){
                return 'duplicate_sku';
            }
        }
        if($request->modifier_code){
            if(Product::where('modifier_code',$request->modifier_code)->count() > 0){
                return 'duplicate_modifier_code';
            }
        }
    }

    public function sendProductUpdate(Request $request){
        $products = Product::where('product_update_status', '=', '0')->get();
        $date = Carbon::now()->format('Y-m-d');

        if ($products) {
            try {
                foreach ($products as $product) {
                    $sendupdate = SendUpdate::where('type', 'product')->whereDate('date', Carbon::now()->format('Y-m-d'))->latest();
                    if($sendupdate){
                        $seqno = 1;
                        SendUpdate::create([
                            'date'=> Carbon::now()->format('Y-m-d'),
                            'type'=> 'product',
                            'seqno'=>$seqno
                        ]);
                    }
                    else{
                        $seqno = $sendupdate->seqno + 1;
                        SendUpdate::create([
                            'date'=> Carbon::now()->format('Y-m-d'),
                            'type'=> 'product',
                            'seqno'=> $seqno
                        ]);
                    }
                    $count = Str::random(4);
                    $fname = 'sqlfooditem-'.$date.'-'.$seqno.'-'.$count;
                    if (env('APP_SYS') == 'MG') {
                        $filename = '/'.'var/www/html/mary_grace/public/storage/productupdate/'.$fname;
                    }
                    else if (env('APP_SYS') == 'DD') {
                        $filename = '/'.'var/www/html/dd/public/storage/productupdate/'.$fname;
                    }
                    $file = fopen($filename.'.sql', 'w');
                    $days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
                    $number = '';
                    foreach ($days as $day) {
                        if (in_array($day, explode(',',$product->days_available))) {
                            $number .= array_search($day, $days) + 1;
                        }
                    }
                    $status = $product->status == 'active' ? 1 : 0;
                    $showKiosk = in_array('Show On Kiosk',explode(',',$product->pos_setup)) ? 1 : 0;
                    $SetMealItem = in_array('Set Meal Item',explode(',',$product->pos_setup)) ? 1 : 0;
                    $AllowDiscount = in_array('Allow Discount',explode(',',$product->pos_setup)) ? 1 : 0;
                    $AllowLessVat = in_array('Allow Less Vat',explode(',',$product->pos_setup)) ? 1 : 0;
                    $ItemVatable = in_array('Item Vatable',explode(',',$product->pos_setup)) ? 1 : 0;
                    $ModifierMenu = in_array('Force Give / Display  SI / Modifier Menu',explode(',',$product->pos_setup)) ? 1 : 0;
                    $NeedsManagerAuthorization = in_array('Needs Manager Authorization',explode(',',$product->pos_setup)) ? 1 : 0;
                    $ItemforFree = in_array('Item for Free',explode(',',$product->promo_setup)) ? 1 : 0;
                    $NotSubject = in_array('Not Subject to %',explode(',',$product->promo_setup)) ? 1 : 0;
                    $KioskAddOn = in_array('Kiosk Add-On',explode(',',$product->pos_setup)) ? 1 : 0;
                    $promo_price = number_format($product->promo_price,2);
                    // $promo_price = $product->promo_price ? number_format($product->promo_price,2) : '0.00';
                    $intro_date = $product->intro_date ? $product->intro_date : '0000-00-00';
                    $start_date = $product->start_date ? $product->start_date : '0000-00-00';
                    $end_date = $product->end_date ? $product->end_date : '0000-00-00';
                    $promo_start = $product->promo_start ? $product->promo_start : '0000-00-00';
                    $promo_end = $product->promo_end ? $product->promo_end : '0000-00-00';
                    $line = "REPLACE INTO `sqlfooditem` (
                                `fcode`,
                                `skuno`,
                                `desc1`,
                                `desc2`,
                                `upa1`,
                                `upa2`,
                                `upa3`,
                                `upa4`,
                                `upa5`,
                                `upa6`,
                                `upa7`,
                                `upa8`,
                                `stockonhand`,
                                `kprinter`,
                                `dayallowed`,
                                `suspend`,
                                `showinkiosk`,
                                `amtreach`,
                                `promodisc`,
                                `promoprice`,
                                `submenu`,
                                `setmeal`,
                                `discount`,
                                `lessvat`,
                                `eds_rate`,
                                `vatable`,
                                `ifree`,
                                `prmnotalow`,
                                `authorizn`,
                                `forcemodi`,
                                `introdate`,
                                `startdate`,
                                `enddate`,
                                `promostart`,
                                `promoend`,
                                `starttime`,
                                `endtime`,
                                `sizenable`,
                                `diprice1`,
                                `diprice2`,
                                `diprice3`,
                                `diprice4`,
                                `diprice5`,
                                `toprice1`,
                                `toprice2`,
                                `toprice3`,
                                `toprice4`,
                                `toprice5`,
                                `puprice1`,
                                `puprice2`,
                                `puprice3`,
                                `puprice4`,
                                `puprice5`,
                                `dvprice1`,
                                `dvprice2`,
                                `dvprice3`,
                                `dvprice4`,
                                `dvprice5`,
                                `min_modi`,
                                `max_modi`,
                                `tenable`,
                                `delivchrg`,
                                `kscode`,
                                `promocode`,
                                `seq`,
                                `sales_type`,
                                `promotag`,
                                `addontag`,
                                `notsubject`,
                                `foodcombo`
                            ) VALUES (
                                '$product->item_code',
                                '$product->sku',
                                '$product->short_desc',
                                '$product->long_desc',
                                '$product->dine_in',
                                '$product->take_out',
                                '$product->pick_up',
                                '$product->delivery',
                                '$product->bulk_order',
                                '$product->fds',
                                '$product->drive_thru',
                                '$product->meal_type',
                                0,
                                '$product->kitchen_printer',
                                '$number',
                                '$status',
                                $showKiosk,
                                0.00,
                                0.00,
                                '$promo_price',
                                '',
                                $SetMealItem,
                                $AllowDiscount,
                                $AllowLessVat,
                                0.00,
                                $ItemVatable,
                                $ItemforFree,
                                '\r\n',
                                $NeedsManagerAuthorization,
                                $ModifierMenu,
                                '$intro_date',
                                '$start_date',
                                '$end_date',
                                '$promo_start',
                                '$promo_end',
                                '$product->start_time',
                                '$product->end_time',
                                0,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0.00,
                                0,
                                '$product->max_modifier',
                                0,
                                1,
                                '',
                                '',
                                '$product->seq',
                                '$product->sales_type',
                                0,
                                $KioskAddOn,
                                $NotSubject,
                                0
                            );\n";
                    fwrite($file, $line);
                    fclose($file);

                    $file = fopen($filename.'.txt', 'w');
                    if ($product->store_code == "ALL (ALL BRANCHES)") {
                        $line = "$product->store_code";
                    }
                    else{
                        $stores = explode(',', $product->store_code);
                        $line = '';
                        foreach ($stores as $store) {
                            if ($line == '') {
                                $line .= $store;
                            }
                            else{
                                $line .= "\n".$store;
                            }
                        }
                    }
                    fwrite($file, $line);
                    fclose($file);

                    $update = Update::create([
                        'filename' => $fname,
                        'branch_code' => $product->store_code
                    ]);

                    UpdateData::create([
                        'updates_id' => $update->id,
                        'data' => $line
                    ]);

                    Product::where('id',$product->id)->update(['product_update_status' => '1']);

                    $userlogs = new UserLogs;
                    $userlogs->user_id = auth()->user()->id;
                    $userlogs->activity = "SENT PRODUCT UPDATE: User successfully sent Product Updates ($date-$count) for processing.";
                    $userlogs->save();
                    return 'true';
                }
            } catch (exception $e) {
                return 'false';
            }
            // Close the SQL file
        }
        else{
            return 'false';
        }
    }

    public function import(Request $request){
        $file = $request->file('xlsx');
        $import = new ProductsImport;
        $data = Excel::toArray($import, $file);
        if(count($data[0]) == 0){
            return redirect()->to('/products?import=failed');
        }
        $failed_rows = [];
        $row_num = 2;
        foreach($data[0] as $key => $value){
            if(!$value['item_code'] && !$value['category'] && !$value['short_description'] && !$value['long_description'] && !$value['dine_in'] && !$value['take_out'] && !$value['pick_up'] && !$value['delivery'] && !$value['bulk_order'] && !$value['fds'] && !$value['drive_thru'] && !$value['add_meal_type']){
                echo(null);
            }
            else if(!$value['item_code'] || !$value['category'] || !$value['short_description'] || !$value['long_description'] || !$value['dine_in'] || !$value['take_out'] || !$value['pick_up'] || !$value['delivery'] || !$value['bulk_order'] || !$value['fds'] || !$value['drive_thru'] || !$value['add_meal_type']){
                array_push($failed_rows, '[Row: '.$row_num.' => Error: Fill Required Fields!]');
            }
            else{
                $category = Category::where('category', $value['category'])->first()->id;
                if(!$category){
                    array_push($failed_rows, '[Row: '.$row_num.' => Error: Category not found in the database!]');
                }
                else{
                    if($value['intro_date']){
                        $intro_date = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject(intval($value['intro_date']))->format('Y-m-d');
                    }
                    else{
                        $intro_date = 'YYYY-MM-DD';
                    }
                    $pos_setup_array = array();
                    if(strtoupper($value['force_give_display_si_modifier_menu']) == 'Y'){
                        array_push($pos_setup_array, 'Force Give / Display  SI / Modifier Menu');
                    }
                    if(strtoupper($value['set_meal_item']) == 'Y'){
                        array_push($pos_setup_array, 'Set Meal Item');
                    }
                    if(strtoupper($value['allow_discount']) == 'Y'){
                        array_push($pos_setup_array, 'Allow Discount');
                    }
                    if(strtoupper($value['item_vatable']) == 'Y'){
                        array_push($pos_setup_array, 'Item Vatable');
                    }
                    if(strtoupper($value['allow_less_vat']) == 'Y'){
                        array_push($pos_setup_array, 'Allow Less Vat');
                    }
                    if(strtoupper($value['kiosk_new_item']) == 'Y'){
                        array_push($pos_setup_array, 'Kiosk New Item');
                    }
                    if(strtoupper($value['kiosk_add_on']) == 'Y'){
                        array_push($pos_setup_array, 'Kiosk Add-On');
                    }
                    if(strtoupper($value['show_on_kiosk']) == 'Y'){
                        array_push($pos_setup_array, 'Show On Kiosk');
                    }
                    if(count($pos_setup_array) == 0){
                        $pos_setup = '';
                    }
                    else{
                        $pos_setup = implode(',', $pos_setup_array);
                    }

                    if(!$value['setup']){
                        $store_setup = '';
                    }
                    else{
                        $store_setup = array();
                        $setup_array = array_map('trim', explode(',', $value['setup']));
                        $setup_list = Setup::where('setup_status', 'ACTIVE')->get();
                        foreach($setup_list as $key => $val){
                            if(in_array($val['setup'], $setup_array)){
                                array_push($store_setup, $val['id']);
                            }
                        }
                    }

                    $stores = array();
                    $store_array = array_map('trim', explode(',', $value['branch_codes']));
                    $store_list = Store::where('status', 'ACTIVE')->get();
                    foreach($store_list as $key => $val){
                        if(in_array($val['branch_code'], $store_array)){
                            array_push($stores, $val['id']);
                        }
                    }

                    if(count($stores)){
                        // $companies = array();
                        $areas = array();
                        foreach($stores as $store){
                            // $company_id = Store::where('id', $store)->first()->company_name;
                            // if(!in_array($company_id, $companies)){
                            //     array_push($companies, $company_id);
                            // }
                            $area_id = Store::where('id', $store)->first()->store_area;
                            if(!in_array($area_id, $areas)){
                                array_push($areas, $area_id);
                            }
                        }
                    }
                    else{
                        // $companies = '';
                        $areas = '';
                    }

                    $item_code = strtoupper(trim($value['item_code']));
                    if(Product::where('item_code', $item_code)->first()){
                        $product = Product::where('item_code', $item_code)->first();
                        $product->item_code = $item_code;
                        $product->category = $category;
                        $product->intro_date = $intro_date;
                        $product->short_desc = strtoupper($value['short_description']);
                        $product->long_desc = strtoupper($value['long_description']);
                        $product->sku = strtoupper($value['sku']);
                        $product->modifier_code = $value['si_modifier_code'];
                        $product->setup = $store_setup ? implode(',', $store_setup) : '';
                        // $product->company = $companies ? implode('|', $companies) : '';
                        $product->area = $areas ? implode('|', $areas) : '';
                        $product->store = $stores ? implode('|', $stores) : '';
                        $product->status = 'ACTIVE';
                        $product->dine_in = str_replace(',', '', number_format($value['dine_in'], 2));
                        $product->take_out = str_replace(',', '', number_format($value['take_out'], 2));
                        $product->pick_up = str_replace(',', '', number_format($value['pick_up'], 2));
                        $product->delivery = str_replace(',', '', number_format($value['delivery'], 2));
                        $product->bulk_order = str_replace(',', '', number_format($value['bulk_order'], 2));
                        $product->fds = str_replace(',', '', number_format($value['fds'], 2));
                        $product->drive_thru = str_replace(',', '', number_format($value['drive_thru'], 2));
                        $product->meal_type = str_replace(',', '', number_format($value['add_meal_type'], 2));
                        $product->dine_in_airport = !$value['dine_in_airport'] ? '0.00' : str_replace(',', '', number_format($value['dine_in_airport'], 2));
                        $product->take_out_airport = !$value['take_out_airport'] ? '0.00' : str_replace(',', '', number_format($value['take_out_airport'], 2));
                        $product->pick_up_airport = !$value['pick_up_airport'] ? '0.00' : str_replace(',', '', number_format($value['pick_up_airport'], 2));
                        $product->delivery_airport = !$value['delivery_airport'] ? '0.00' : str_replace(',', '', number_format($value['delivery_airport'], 2));
                        $product->bulk_order_airport = !$value['bulk_order_airport'] ? '0.00' : str_replace(',', '', number_format($value['bulk_order_airport'], 2));
                        $product->fds_airport = !$value['fds_airport'] ? '0.00' : str_replace(',', '', number_format($value['fds_airport'], 2));
                        $product->drive_thru_airport = !$value['drive_thru_airport'] ? '0.00' : str_replace(',', '', number_format($value['drive_thru_airport'], 2));
                        $product->meal_type_airport = !$value['meal_type_airport'] ? '0.00' : str_replace(',', '', number_format($value['add_meal_type_airport'], 2));
                        $product->pos_setup = $pos_setup;
                        $sql = $product->save();
                        if(!$sql){
                            array_push($failed_rows, '[Row: '.$row_num.', Error: Update Failed!]');
                        }
                        else{
                            $userlogs = new UserLogs;
                            $userlogs->user_id = auth()->user()->id;
                            $userlogs->activity = "UPDATED PRODUCT: User successfully updated Product '$product->short_desc' with Item Code '$product->item_code'.";
                            $userlogs->save();
                        }
                    }
                    else{
                        $product = new Product;
                        $product->item_code = $item_code;
                        $product->category = $category;
                        $product->intro_date = $intro_date;
                        $product->short_desc = strtoupper($value['short_description']);
                        $product->long_desc = strtoupper($value['long_description']);
                        $product->sku = strtoupper($value['sku']);
                        $product->modifier_code = $value['si_modifier_code'];
                        $product->setup = $store_setup ? implode(',', $store_setup) : '';
                        // $product->company = $companies ? implode('|', $companies) : '';
                        $product->area = $areas ? implode('|', $areas) : '';
                        $product->store = $stores ? implode('|', $stores) : '';
                        $product->status = 'ACTIVE';
                        $product->dine_in = str_replace(',', '', number_format($value['dine_in'], 2));
                        $product->take_out = str_replace(',', '', number_format($value['take_out'], 2));
                        $product->pick_up = str_replace(',', '', number_format($value['pick_up'], 2));
                        $product->delivery = str_replace(',', '', number_format($value['delivery'], 2));
                        $product->bulk_order = str_replace(',', '', number_format($value['bulk_order'], 2));
                        $product->fds = str_replace(',', '', number_format($value['fds'], 2));
                        $product->drive_thru = str_replace(',', '', number_format($value['drive_thru'], 2));
                        $product->meal_type = str_replace(',', '', number_format($value['add_meal_type'], 2));
                        $product->dine_in_airport = !$value['dine_in_airport'] ? '0.00' : str_replace(',', '', number_format($value['dine_in_airport'], 2));
                        $product->take_out_airport = !$value['take_out_airport'] ? '0.00' : str_replace(',', '', number_format($value['take_out_airport'], 2));
                        $product->pick_up_airport = !$value['pick_up_airport'] ? '0.00' : str_replace(',', '', number_format($value['pick_up_airport'], 2));
                        $product->delivery_airport = !$value['delivery_airport'] ? '0.00' : str_replace(',', '', number_format($value['delivery_airport'], 2));
                        $product->bulk_order_airport = !$value['bulk_order_airport'] ? '0.00' : str_replace(',', '', number_format($value['bulk_order_airport'], 2));
                        $product->fds_airport = !$value['fds_airport'] ? '0.00' : str_replace(',', '', number_format($value['fds_airport'], 2));
                        $product->drive_thru_airport = !$value['drive_thru_airport'] ? '0.00' : str_replace(',', '', number_format($value['drive_thru_airport'], 2));
                        $product->meal_type_airport = !$value['meal_type_airport'] ? '0.00' : str_replace(',', '', number_format($value['add_meal_type_airport'], 2));
                        $product->pos_setup = $pos_setup;
                        $sql = $product->save();
                        if(!$sql){
                            array_push($failed_rows, '[Row: '.$row_num.', Error: Save Failed!]');
                        }
                        else{
                            $userlogs = new UserLogs;
                            $userlogs->user_id = auth()->user()->id;
                            $userlogs->activity = "ADDED PRODUCT: User successfully added Product '$product->short_desc' with Item Code '$product->item_code'.";
                            $userlogs->save();
                        }
                    }
                }
            }
            $row_num++;
        }
        if(count($failed_rows) == count($data[0])){
            $errors = implode(', ', $failed_rows);
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "PRODUCTS FILE IMPORT [FAILED]: User attempt failed to import file data into Products with the following errors: $errors.";
            $userlogs->save();

            return redirect()->to('/products?import=failed');
        }
        else if(count($failed_rows) == 0){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "PRODUCTS FILE IMPORT [NO ERRORS]: User successfully imported file data into Products without any errors.";
            $userlogs->save();

            return redirect()->to('/products?import=success_without_errors');
        }
        else{
            $errors = implode(', ', $failed_rows);
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "PRODUCTS FILE IMPORT [WITH ERRORS]: User successfully imported file data into Products with the following errors: $errors.";
            $userlogs->save();

            return redirect()->to('/products?import=success_with_errors');
        }
    }
}