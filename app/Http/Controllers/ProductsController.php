<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Yajra\Datatables\Datatables;

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


class ProductsController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function products()
    {
        $products = Product::orderBy('item_code', 'asc')->get();
        $categories = Category::select('id', 'category')->where('category_status','!=','DELETED')->get()->sortBy('category');
        $product_categories = Category::select('id', 'category')->where('id','!=','0')->where('category_status','!=','DELETED')->get()->sortBy('category');
        $sales_types = SalesType::select('id','sales_type')->where('id','!=','0')->where('sales_type_status','!=','DELETED')->get()->sortBy('sales_type');
        $setups = Setup::select('id', 'setup')->where('id','!=','0')->where('setup_status','!=','DELETED')->get()->sortBy('setup');
        // $companies = Company::select('id','company_name')->where('id','!=','0')->get();
        $areas = StoreArea::where('id', '!=', '0')->where('store_area_status', 'ACTIVE')->get()->sortBy('store_area');
        return view('pages.products', compact('products','categories','product_categories','sales_types','setups','areas'));
    }

    public function products_data()
    {
        $products = Product::selectRaw('products.id AS id, category.id AS category, category.category AS category_name, item_code, intro_date, short_desc, long_desc, sku, modifier_code, setup, area, store, status, product_image, product_update_status')
            ->selectRaw('dine_in, take_out, pick_up, delivery, bulk_order, fds, drive_thru, meal_type')
            ->selectRaw('dine_in_airport, take_out_airport, pick_up_airport, delivery_airport, bulk_order_airport, fds_airport, drive_thru_airport, meal_type_airport')
            ->selectRaw('pos_setup, max_modifier, seq, kitchen_printer, promo_start, promo_end, promo_price, promo_item_not_allow, sales_type, promo_setup, start_date, start_time, end_date, end_time, days_available')
            ->selectRaw('dine_sml, dine_med, dine_large, dine_xl, dine_zero, takeout_sml, takeout_med, takeout_large, takeout_xl, takeout_zero, pickup_sml, pickup_med, pickup_large, pickup_xl, pickup_zero, delivery_sml, delivery_med, delivery_large, delivery_xl, delivery_zero')
            ->join('category','category.id','products.category')
            ->get();
        return DataTables::of($products)
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
        // ->addColumn('company_name', function(Product $products){
        //     if(!$products->company){
        //         return 'NONE';
        //     }
        //     else{
        //         $user_row = '';
        //         $array = explode("|", $products->company);
        //         foreach($array as $value){
        //             $user = Company::where('id', $value)->first();
        //             if($user_row != ''){
        //                 $user_row = $user_row.'|'.$user->company_name;
        //             }
        //             else{
        //                 $user_row = $user->company_name;
        //             }
        //         }
        //         return $user_row;
        //     }
        // })
        ->addColumn('area_name', function(Product $products){
            if(!$products->area){
                return 'NONE';
            }
            else{
                $user_row = '';
                $array = explode("|", $products->area);
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

        $product->pos_setup = $request->pos_setup;
        $product->max_modifier = $request->max_modifier;
        $product->setup = $request->setup ? implode(",",$request->setup) : '';
        // $product->company = $request->company == '0' ? '0' : implode("|", $request->company);
        $product->area = $request->area == '0' ? '0' : implode("|", $request->area);
        $product->store = $request->store == '0' ? '0' : implode("|", $request->store);
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

        $product = Product::find($request->id);
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

        $product->pos_setup = $request->pos_setup;
        $product->max_modifier = $request->max_modifier;
        $product->setup = $request->setup ? implode(",",$request->setup) : '';
        // $product->company = $request->company == '0' ? '0' : implode("|", $request->company);
        $product->area = $request->area == '0' ? '0' : implode("|", $request->area);
        $product->store = $request->store == '0' ? '0' : implode("|", $request->store);
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
            $userlogs->activity = "UPDATED PRODUCT: User successfully updated Product '$product->short_desc' with Item Code '$product->item_code'.";
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

    public function insertImage(Request $request){

        $productImageFile = $request->file('product_image');
        $productImageExtension = $productImageFile->getClientOriginalExtension();
        $productImageFileName = time().rand(1,100).'_Product_Image.'.$productImageExtension;
        $productImageFile->storeAs('public/product_images',$productImageFileName);

        return $productImageFileName;
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
        $sql = Product::where('product_update_status','=','0')->update(['product_update_status' => '1']);
        if($sql){
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "SENT PRODUCT UPDATE: User successfully sent Product Updates for processing.";
            $userlogs->save();

            return 'true';
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