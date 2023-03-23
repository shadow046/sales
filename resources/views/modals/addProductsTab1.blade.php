<div id="page1" class="tab-pane active" style="border-radius:0px;margin-bottom:-20px;">
    <hr>
    <div class="row">
        <div class="col-2 ml-3 p-0 border border-dark text-center" style="height:146px !important;">
            <input type="hidden" id="filename">
            <input type="hidden" id="filename_delete">
            <img id="product_image_preview" class="text-center" style="display: none;line-height:145px;height:145px;width:145px;margin-right:-8px;" title="VIEW IMAGE" data-bs-target="#modal_product_image_preview" data-bs-toggle="modal" onclick="modal_product_image_preview(this)">
            <span class="remove_image m-1" style="cursor: pointer;"><i class="fas fa-times float-end text-pink" style="zoom: 150%; margin-right: 3px;"></i></span>
            <span id="span_upload_image" style="line-height: 145px; height: 145px; margin-left: -25px;"><button type="button" id="upload_image" class="btn bg-pink" style="margin-left:15%;" onclick="$('#product_image').click()">Upload Image</button></span>
            <input type="file" id="product_image" name="product_image" accept="image/*" style="display: none;" onchange="ProductImageValidation(product_image)">
        </div>

        <div class="col row">
            <div class="col-12 row mb-3">
                <div class="col-md-4 f-outline">
                    <input type="search" style="color: black" name="item_code" id="item_code" class="forminput form-control spChar requiredField" placeholder=" " autocomplete="off" >
                    <p id="duplicate_item_code" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                    <label for="item_code" class="formlabels form-label">Item Code
                </div>
                <div class="col-md-4 f-outline">
                    <select id="category" name="category" class="forminput form-control form-select requiredField" style="color: black">
                        <option value="" selected disabled>Select Category</option>
                        @foreach($categories as $category)
                            <option value="{{$category->id}}" style="color: Black;">{{strtoupper($category->category)}}</option>
                        @endforeach
                    </select>
                    <label for="category" class="formlabels form-label">Category
                </div>
                <div class="col-md-4 f-outline">
                    <input type="date" style="color: black" name="intro_date" id="intro_date" class="forminput form-control" placeholder=" " autocomplete="off" >
                    <label for="intro_date" class="formlabels form-label">Intro Date
                </div>
            </div>
            <div class="col-12 row mb-3">
                <div class="col-md-4 f-outline">
                    <input type="search" style="color: black" name="short_desc" id="short_desc" class="forminput form-control requiredField text-uppercase" placeholder=" " autocomplete="off" >
                    <label for="short_desc" class="formlabels form-label">Short Description
                </div>
                <div class="col-md f-outline">
                    <input type="search" style="color: black" name="long_desc" id="long_desc" class="forminput form-control requiredField text-uppercase" placeholder=" " autocomplete="off" >
                    <label for="long_desc" class="formlabels form-label">Long Description
                </div>
            </div>
            <div class="col-12 row mb-4">
                <div class="col-md-4 f-outline">
                    <input type="search" style="color: black" name="sku" id="sku" class="forminput form-control text-uppercase" placeholder=" " autocomplete="off" >
                    <p id="duplicate_sku" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                    <label for="sku" class="formlabels form-label">SKU
                </div>
                <div class="col-md-4 f-outline">
                    <input type="number" style="color: black" name="modifier_code" id="modifier_code" class="forminput form-control numberOnly" placeholder=" " autocomplete="off" >
                    <p id="duplicate_modifier_code" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                    <label for="modifier_code" class="formlabels form-label">SI / Modifier Code
                </div>
                <div class="col-md-4 f-outline">
                    <select class="forminput form-control form-select" multiple id="setup" name="setup" data-placeholder="Select Setup">
                        @foreach($setups as $setup)
                            <option value="{{$setup->id}}">{{$setup->setup}}</option>
                        @endforeach
                    </select>
                    <label for="setup" class="formlabel form-label" style="margin-left: 15px;">STORE SETUP</label>
                </div>
            </div>

            <div class="col-12 row mt-1">
                {{-- <div class="col-md-4 f-outline">
                    <div class="f-outline">
                        <select class="forminput form-control form-select" id="company" name="company" multiple data-placeholder="SELECT COMPANY">
                            @foreach($companies as $company)
                                <option value="{{$company->id}}">{{$company->company_name}}</option>
                            @endforeach
                        </select>
                        <label for="company" class="formlabel form-label">COMPANY</label>
                    </div>
                </div> --}}
                <div class="col-md-6 f-outline">
                    <div class="f-outline">
                        <select class="forminput form-control form-select" id="area" name="area" multiple data-placeholder="SELECT STORE AREA">
                            @foreach($areas as $area)
                                <option value="{{$area->id}}">{{$area->store_area}}</option>
                            @endforeach
                        </select>
                        <label for="area" class="formlabel form-label">Store Area</label>
                    </div>
                </div>
                <div class="col-md-6 f-outline">
                    <div class="f-outline">
                        <select class="forminput form-control form-select" id="store" name="store" multiple data-placeholder="SELECT STORE BRANCHES">
                        </select>
                        <label for="store" class="formlabel form-label">Store Branches</label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row mt-2" id="set_meal_div" style="display:none;">
        <div class="col">
            <hr>
            <h4>SET MEAL - PRODUCT COMBINATIONS</h4>
            <hr>
            <div class="row pt-3">
                <div class="col-md-2 f-outline">
                    <select id="product_category" name="product_category" class="forminput form-control form-select " style="color: black">
                        <option value="" selected disabled>Select Category</option>
                        @foreach($product_categories as $category)
                            <option value="{{$category->id}}">{{$category->category}}</option>
                        @endforeach
                    </select>
                    <label for="product_category" class="formlabels form-label">CATEGORY</label>
                </div>
                <div class="col-md-4 f-outline">
                    <select id="short_description" name="short_description" class="forminput form-control form-select" style="color: black" disabled>
                        <option value="" selected disabled>SELECT SHORT DESCRIPTION</option>
                    </select>
                    <label for="short_description" class="formlabels form-label">SHORT DESCRIPTION</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" style="color: black" name="qty" id="qty" class="forminput form-control numbersOnly number_limit" placeholder=" " min="1" autocomplete="off">
                    <label for="qty" class="formlabels form-label">QTY</label>
                </div>
                <div class="col-md f-outline d-none">
                    <input type="search" style="color: black" name="product_code" id="product_code" class="forminput form-control" placeholder=" " autocomplete="off">
                    <label for="product_code" class="formlabels form-label">ITEM CODE</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="search" style="color: black" name="price" id="price" class="forminput form-control" placeholder=" " autocomplete="off" readonly>
                    <label for="price" class="formlabels form-label">PRICE</label>
                </div>
                <div class="col-md-2 f-outline">
                    <button class="form-control btn btn-custom addPromoCombinationBtn"><i class="fas fa-plus"></i> ADD</button>
                </div>
            </div>

            <br>
            <div id="set_meal_table_div" style="overflow-x: scroll;display:none;">
                <table id="promoProductCombination" class="table table-bordered table-striped table-hover align-middle mt-2">
                    <thead>
                        <tr style="display: none;" class="bg-default promoProductCombination_thead">
                            <th class="d-none"></th>
                            <th>CATEGORY</th>
                            <th>SHORT DESCRIPTION</th>
                            <th>UNIT PRICE</th>
                            <th>QTY</th>
                            <th>AMOUNT</th>
                            <th>SUSPEND</th>
                            <th>DELETE</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colspan="4"></th>
                            <th class="td_totalAmount"></th>
                            <th colspan="2"></th>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div id="set_meal_table_orig_div" style="overflow-x: scroll;display:none;">
                <table id="promoProductCombination_orig" class="table table-bordered table-striped table-hover align-middle promoProductCombination_orig mt-2">
                    <thead>
                        <tr class="bg-default promoProductCombination">
                            <th class="d-none"></th>
                            <th>CATEGORY</th>
                            <th>SHORT DESCRIPTION</th>
                            <th>UNIT PRICE</th>
                            <th>QTY</th>
                            <th>AMOUNT</th>
                            <th>SUSPEND</th>
                            <th>DELETE</th>
                        </tr>
                    </thead>
                    <tbody id="promoProductCombination_tbody">
                    </tbody>
                    <tfoot>
                        <tr style="border-top: 2px solid black;">
                            <th class="text-right" colspan="4">TOTAL AMOUNT:</th>
                            <th class="text-right td_totalAmount"></th>
                            <th colspan="2"></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
    <hr>
    <h4>PRICING</h4>
    <hr>
    <div class="row mb-3">
        <div class="col-md f-outline">
            <input type="number" value="0.00" style="color: black" name="dine_in" id="dine_in" class="forminput form-control requiredField priceField" placeholder=" " autocomplete="off" >
            <label for="dine_in" class="formlabels form-label">DINE-IN
        </div>
        <div class="col-md f-outline">
            <input type="number" value="0.00" style="color: black" name="take_out" id="take_out" class="forminput form-control requiredField priceField" placeholder=" " autocomplete="off" >
            <label for="take_out" class="formlabels form-label">TAKE-OUT
        </div>
        <div class="col-md f-outline">
            <input type="number" value="0.00" style="color: black" name="pick_up" id="pick_up" class="forminput form-control requiredField priceField" placeholder=" " autocomplete="off" >
            <label for="pick_up" class="formlabels form-label">PICK-UP
        </div>
    </div>

    <div class="row mb-3">
        <div class="col-md f-outline">
            <input type="number" value="0.00" style="color: black" name="delivery" id="delivery" class="forminput form-control requiredField priceField" placeholder=" " autocomplete="off" >
            <label for="delivery" class="formlabels form-label">DELIVERY
        </div>
        <div class="col-md f-outline">
            <input type="number" value="0.00" style="color: black" name="bulk_order" id="bulk_order" class="forminput form-control requiredField priceField" placeholder=" " autocomplete="off" >
            <label for="bulk_order" class="formlabels form-label">BULK ORDER
        </div>
        <div class="col-md f-outline">
            <input type="number" value="0.00" style="color: black" name="fds" id="fds" class="forminput form-control requiredField priceField" placeholder=" " autocomplete="off" >
            <label for="fds" class="formlabels form-label">FDS
        </div>
    </div>

    <div class="row">
        <div class="col-md f-outline">
            <input type="number" value="0.00" style="color: black" name="drive_thru" id="drive_thru" class="forminput form-control requiredField priceField" placeholder=" " autocomplete="off" >
            <label for="drive_thru" class="formlabels form-label">DRIVE-THRU
        </div>
        <div class="col-md f-outline">
            <input type="number" value="0.00" style="color: black" name="meal_type" id="meal_type" class="forminput form-control requiredField priceField" placeholder=" " autocomplete="off" >
            <label for="meal_type" class="formlabels form-label">ADD MEAL TYPE
        </div>
        <div class="col-md f-outline">
            <input type="number" value="0.00" style="color: black" name="airport" id="airport" class="forminput form-control requiredField priceField" placeholder=" " autocomplete="off" >
            <label for="airport" class="formlabels form-label">AIRPORT
        </div>
    </div>

    <hr>
    <h4>POS SETUP</h4>
    <hr>
    <form id="posSetupForm">
        <div class="row">
            <div class="col-md-6">
                <div class="container-fluid">
                    <input type="checkbox" id="modifier_menu" class="pos_setup" value="Force Give / Display  SI / Modifier Menu"/>
                    <label for="modifier_menu"> FORCE GIVE / DISPLAY  SI / MODIFIER MENU</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="set_meal_item" class="pos_setup" value="Set Meal Item"/>
                    <label for="set_meal_item"> SET MEAL ITEM</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="allow_discount" class="pos_setup" value="Allow Discount" checked/>
                    <label for="allow_discount"> ALLOW DISCOUNT</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="item_vatable" class="pos_setup" value="Item Vatable" checked/>
                    <label for="item_vatable"> ITEM VATABLE</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="allow_less_vat" class="pos_setup" value="Allow Less Vat" checked/>
                    <label for="allow_less_vat"> ALLOW LESS VAT</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="kiosk_new_item" class="pos_setup" value="Kiosk New Item"/>
                    <label for="kiosk_new_item"> KIOSK NEW ITEM</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="kiosk_add_on" class="pos_setup" value="Kiosk Add-On"/>
                    <label for="kiosk_add_on"> KIOSK ADD-ON</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="show_on_kiosk" class="pos_setup" value="Show On Kiosk"/>
                    <label for="show_on_kiosk"> SHOW ON KIOSK</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="needs_manager_authorization" class="promo_setup" value="Needs Manager Authorization"/>
                    <label for="needs_manager_authorization"> NEEDS MANAGER AUTHORIZATION</label><br>
                </div>
                <br>
                <br>
                <br>
            </div>
    </form>
        <div class="col-md-6">
            <div class="col-md-7 mb-3 f-outline">
                <select id="sales_type" name="sales_type" class="forminput form-control form-select" style="color: black">
                    <option value="" selected disabled>Select Sales Type</option>
                    @foreach($sales_types as $sales_type)
                        <option value="{{$sales_type->id}}">{{$sales_type->sales_type}}</option>
                    @endforeach
                </select>
                <label for="sales_type" class="formlabels form-label">SALES TYPE <span class="span_sales_type"></span></label>
            </div>
            <div class="col-md-7 f-outline">
                <input type="number" style="color: black" min="0" name="max_modifier" id="max_modifier" class="forminput form-control numberOnly" placeholder=" " value="0" autocomplete="off" >
                <label for="max_modifier" class="formlabels form-label">MAX MODIFIER
            </div><br>
            <div class="col-md-7 f-outline">
                <input type="search" style="color: black" name="seq" id="seq" class="forminput form-control" placeholder="" autocomplete="off" value="999999999">
                <label for="seq" class="formlabels form-label">SEQ
            </div><br>
            <div class="col-md-7 f-outline mb-3">
                <input type="search" style="color: black" name="kitchen_printer" id="kitchen_printer" class="forminput form-control" placeholder="" autocomplete="off" value="0">
                <label for="kitchen_printer" class="formlabels form-label">KITCHEN PRINTER
            </div>
            <div class="col-md-7">
                <input type="checkbox" id="item_for_free" class="promo_setup" value="Item for Free"/>
                <label for="item_for_free"> ITEM FOR FREE</label><br>
            </div>
            <div class="col-md-7">
                <input type="checkbox" id="not_subject_to_%" class="promo_setup" value="Not Subject to %"/>
                <label for="not_subject_to_%"> NOT SUBJECT TO %</label><br>
            </div>
        </div>
    </div>
</div>