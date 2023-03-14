<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\Datatables\Datatables;

use App\Models\Role;
use App\Models\User;
use App\Models\UserLogs;

use App\Models\Promo;
use App\Models\PromoProductCombination;
use App\Models\Category;
use App\Models\Product;

class PromosController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }

    public function promos()
    {
        // $provinces = Province::orderBy('provDesc', 'asc')->get();
        $categories = Category::select('id','category')->orderBy('category','ASC')->get();
        return view('pages.promos', compact('categories'));
    }

    public function promo_data()
    {
        return DataTables::of(Promo::all())->make(true);
    }

    public function promo_reload(){
        if(Promo::count() == 0){
            return 'NULL';
        }
        $data_update = Promo::latest('updated_at')->first()->updated_at;
        return $data_update;
    }

    // public function promo_product_combination_data(Request $request)
    // {
    //     return DataTables::of(
    //         PromoProductCombination::selectRaw('promo_product_combination.id, promo_id, category.category as category_name, products.short_desc as short_description, products.long_desc as long_description, products.item_code AS item_code, products.dine_in, qty, promo_item_status, product_id')
    //         ->where('promo_id',$request->id)
    //         ->join('products','products.id','promo_product_combination.product_id')
    //         ->join('category','category.id','products.category')
    //         ->get())
    //         ->make(true);
    // }

    public function promo_product_combination_data(Request $request)
    {
        $items = PromoProductCombination::selectRaw('promo_product_combination.id, promo_id, category.category as category_name, products.short_desc as short_description, products.long_desc as long_description, products.item_code AS item_code, products.dine_in, qty, promo_item_status, product_id')
            ->where('promo_id',$request->id)
            ->join('products','products.id','promo_product_combination.product_id')
            ->join('category','category.id','products.category')
            ->get()
            ->toArray();
        return response()->json($items);
    }

    public function setShortDescription(Request $request){
        $list = Product::query()->select('products.id AS product_id','products.short_desc AS short_description','products.item_code as item_code','products.long_desc AS long_description','products.dine_in')
            ->where('products.category',$request->category_id)
            ->orderBy('item_code','ASC')
            ->get();

        return response()->json($list);
    }

    public function savePromo(Request $request){
        $promo = new Promo;
        $promo->promo_code = strtoupper($request->promo_code);
        $promo->description = strtoupper($request->description);
        $promo->price = $request->price;
        $save = $promo->save();

        if($save){
            $result = 'true';
            $id = $promo->id;
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "ADDED PROMO: User successfully added Promo '$promo->description' with Promo Code '$promo->promo_code'.";
            $userlogs->save();
        }
        else{
            $result = 'false';
            $id = '';
        }

        $data = array('result' => $result, 'id' => $id);
        return response()->json($data);
    }

    public function editPromo(Request $request){
        $promo = Promo::find($request->id);
        $promo->promo_code = strtoupper($request->promo_code);
        $promo->description = $request->description;
        $promo->price = $request->price;
        $save = $promo->save();

        if($save){
            $result = 'true';
            $id = $promo->id;
            $userlogs = new UserLogs;
            $userlogs->user_id = auth()->user()->id;
            $userlogs->activity = "UPDATED PROMO: User successfully updated Promo '$promo->description' with Promo Code '$promo->promo_code'.";
            $userlogs->save();
        }
        else{
            $result = 'false';
            $id = '';
        }
        $data = array('result' => $result, 'id' => $id);
        return response()->json($data);
    }

    public function savePromoProductCombination(Request $request){
        $promoProductCombination = new PromoProductCombination;
        $promoProductCombination->promo_id = $request->promo_id;
        $promoProductCombination->product_id = $request->product;
        $promoProductCombination->qty = $request->qty;
        $promoProductCombination->promo_item_status = $request->promo_item_status;
        $promoProductCombination->save();
    }

    public function promo_product_combination_delete(Request $request){
        PromoProductCombination::where('promo_id', $request->promo_id)
                                ->where('product_id', $request->product_id)
                                ->delete();
    }

    public function promo_product_combination_bulk_delete(Request $request){
        $product_id = explode(",",$request->product_id);
        foreach($product_id as $id){
            PromoProductCombination::where('product_id', $id)
                                    ->where('promo_id', $request->promo_id)
                                    ->delete();
        }
    }

    public function checkDuplicate(Request $request){
        if(Promo::where('promo_code',$request->promo_code)->count() > 0){
            return 'duplicate_promo_code';
        }
    }
}
