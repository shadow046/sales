<div id="priceUpdateModal" class="modal fade">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-default">
                <h5 class="modal-title w-100 text-center">PRICE UPDATE DETAILS</h5>
                <button type="button" class="btn-close btn-close-white close btnClose" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body mb-2">
                <div class="alert alert-primary requiredNote p-2 mb-4" role="alert" style="display: none;">
                    <i class='fa fa-exclamation-triangle'></i>
                    <b>NOTE:</b> Please fill up all required fields to proceed.
                </div>
                <div class="row mb-3">
                    <div class="col-md-8 f-outline">
                        <select id="product" name="product" class="forminput form-control form-select requiredField" style="color: black">
                            <option value="" selected disabled>Select Product</option>
                            @foreach($products as $product)
                                <option value="{{$product->fcode}}" desc="{{$product->desc1}}">{{$product->fcode}}: {{$product->desc1}}</option>
                            @endforeach
                        </select>
                        <label for="product" class="formlabels form-label">PRODUCT CODE / DESCRIPTION
                    </div>
                    <div class="col-md-4 f-outline">
                        <input type="date" name="effdate" id="effdate" class="forminput form-control inputFields requiredField" min="{{date('Y-m-d')}}" placeholder=" ">
                        <label for="effdate" class="formlabels form-label">EFFECTIVITY DATE</label>
                    </div>
                </div>

                <div id="divPriceUpdate">
                    <ul class="nav nav-tabs {{ env('APP_SYS') != 'DD' ? 'd-none' : '' }}" style="border: none; zoom: 90%;" role="tablist">
                        <li class="nav-item"style="margin-right:5px" >
                            <a class="nav-link pill bg-sub tab_regular active" style="text-decoration: none; color: white;" id="tab_regular" data-bs-toggle="tab" href="#page_regular"> REGULAR</a>
                        </li>
                        <li class="nav-item" style="margin-right:5px" >
                            <a class="nav-link pill bg-sub tab_airport active" style="text-decoration: none; color: white;" id="tab_airport" data-bs-toggle="tab" href="#page_airport"> AIRPORT</a>
                        </li>
                        <li class="nav-item d-none" style="margin-right:5px" >
                            <a class="nav-link pill bg-sub tab_discount active" style="text-decoration: none; color: white;" id="tab_discount" data-bs-toggle="tab" href="#page_discount"> DISCOUNTS</a>
                        </li>
                    </ul>

                    <div id="priceContent">
                        <br>
                        <div id="page_regular" class="tab-pane active">
                            <div class="row">
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa1" id="upa1" class="forminput form-control inputFields decimalNumber requiredField" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa1" class="formlabels form-label">DINE-IN PRICE</label>
                                </div>
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa2" id="upa2" class="forminput form-control inputFields decimalNumber requiredField" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa2" class="formlabels form-label">TAKE-OUT PRICE</label>
                                </div>
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa3" id="upa3" class="forminput form-control inputFields decimalNumber" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa3" class="formlabels form-label">PICK-UP PRICE</label>
                                </div>
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa4" id="upa4" class="forminput form-control inputFields decimalNumber" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa4" class="formlabels form-label">DELIVERY PRICE</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa5" id="upa5" class="forminput form-control inputFields decimalNumber" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa5" class="formlabels form-label">BULK ORDER</label>
                                </div>
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa6" id="upa6" class="forminput form-control inputFields decimalNumber" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa6" class="formlabels form-label">FDS PRICE</label>
                                </div>
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa7" id="upa7" class="forminput form-control inputFields decimalNumber" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa7" class="formlabels form-label">DRIVE-THRU PRICE</label>
                                </div>
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa8" id="upa8" class="forminput form-control inputFields decimalNumber" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa8" class="formlabels form-label">ADD. MEAL TYPE</label>
                                </div>
                            </div>
                        </div>

                        <div id="page_airport" class="tab-pane">
                            <div class="row">
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa1_airport" id="upa1_airport" class="forminput form-control inputFields decimalNumber requiredField" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa1_airport" class="formlabels form-label">DINE-IN PRICE</label>
                                </div>
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa2_airport" id="upa2_airport" class="forminput form-control inputFields decimalNumber requiredField" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa2_airport" class="formlabels form-label">TAKE-OUT PRICE</label>
                                </div>
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa3_airport" id="upa3_airport" class="forminput form-control inputFields decimalNumber" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa3_airport" class="formlabels form-label">PICK-UP PRICE</label>
                                </div>
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa4_airport" id="upa4_airport" class="forminput form-control inputFields decimalNumber" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa4_airport" class="formlabels form-label">DELIVERY PRICE</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa5_airport" id="upa5_airport" class="forminput form-control inputFields decimalNumber" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa5_airport" class="formlabels form-label">BULK ORDER</label>
                                </div>
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa6_airport" id="upa6_airport" class="forminput form-control inputFields decimalNumber" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa6_airport" class="formlabels form-label">FDS PRICE</label>
                                </div>
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa7_airport" id="upa7_airport" class="forminput form-control inputFields decimalNumber" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa7_airport" class="formlabels form-label">DRIVE-THRU PRICE</label>
                                </div>
                                <div class="col f-outline mb-3">
                                    <input type="number" name="upa8_airport" id="upa8_airport" class="forminput form-control inputFields decimalNumber" value="0.00" min="0.00" placeholder=" ">
                                    <label for="upa8_airport" class="formlabels form-label">ADD. MEAL TYPE</label>
                                </div>
                            </div>
                        </div>

                        <div id="page_discount" class="tab-pane d-none">
                            <div class="row mb-3">
                                <div class="col-md-3 f-outline">
                                    <input type="number" value="0.00" style="color: black" name="senior" id="senior" class="forminput form-control requiredField priceField" placeholder=" " autocomplete="off" >
                                    <label for="senior" class="formlabels form-label">SENIOR
                                </div>
                                <div class="col-md-3 f-outline">
                                    <input type="number" value="0.00" style="color: black" name="pwd" id="pwd" class="forminput form-control requiredField priceField" placeholder=" " autocomplete="off" >
                                    <label for="pwd" class="formlabels form-label">PWD
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md f-outline mb-3">
                <button class="form-control btn btn-custom cancelBtn float-end" data-bs-dismiss="modal"><i class="fa-solid fa-xmark"></i> CANCEL</button>
                @can('update')
                    <button class="form-control btn btn-custom updateBtn btnRequired float-end"><i class="fas fa-save"></i> UPDATE</button>
                @endcan
                <button class="form-control btn btn-custom saveBtn btnRequired float-end"><i class="fas fa-save"></i> SAVE</button>
            </div>
        </div>
    </div>
</div>