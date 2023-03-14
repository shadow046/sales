<div id="page2" class="tab-pane" style="border-radius:0px;margin-bottom:-20px;">
    <hr>
    <h4>PROMO SETUP</h4>
    <hr>
    <div class="row">
        <div class="col row">
            <div class="col-md-3 f-outline">
                <input type="date" style="color:black" name="promo_start" id="promo_start" class="forminput form-control" placeholder=" " autocomplete="off" >
                <label for="promo_start" class="formlabels form-label">PROMO START <span class="span_promo_start"></span></label>
            </div>
            <div class="col-md-3 f-outline">
                <input type="date" style="color:black" name="promo_end" id="promo_end" class="forminput form-control" placeholder=" " autocomplete="off" >
                <label for="promo_end" class="formlabels form-label">PROMO END <span class="span_promo_end"></span></label>
            </div>
            <div class="col-md-3 f-outline">
                <input type="number" value="0.00" style="color:black" min="0" name="promo_price" id="promo_price" class="forminput form-control" placeholder=" " autocomplete="off" >
                <label for="promo_price" class="formlabels form-label">PROMO PRICE <span class="span_promo_price"></span></label>
            </div>
        </div>
    </div><br>
    <div class="row">
        <div class="col-md-6 row">
            <div class="col-md f-outline">
                <textarea style="color:black" name="promo_item_not_allow" id="promo_item_not_allow" rows="10" class="forminput form-control" placeholder="" autocomplete="off" ></textarea>
                <label for="promo_item_not_allow" class="formlabels form-label">PROMOTIONAL ITEMS NOT ALLOWED <span class="span_promo_item_not_allow"></span></label>
            </div>
        </div>
        <div class="col-md-6">
            <div class="container-fluid">
                <input type="checkbox" id="needs_manager_authorization" class="promo_setup" value="Needs Manager Authorization"/>
                <label for="needs_manager_authorization"> NEEDS MANAGER AUTHORIZATION</label><br>
            </div>
            <div class="container-fluid">
                <input type="checkbox" id="enable_item_sizes" class="promo_setup" value="Enable Item Sizes"/>
                <label for="enable_item_sizes"> ENABLE ITEM SIZES</label><br>
            </div>
            <div class="container-fluid">
                <input type="checkbox" id="item_for_free" class="promo_setup" value="Item for Free"/>
                <label for="item_for_free"> ITEM FOR FREE</label><br>
            </div>
            <div class="container-fluid">
                <input type="checkbox" id="not_subject_to_%" class="promo_setup" value="Not Subject to %"/>
                <label for="not_subject_to_%"> NOT SUBJECT TO %</label><br>
            </div>
            <br>
            <br>
        </div>
    </div><br>
    <div class="row">
        <div class="col-md-4 f-outline">
            <select id="sales_type" name="sales_type" class="forminput form-control form-select" style="color: black">
                <option value="" selected disabled>Select Sales Type</option>
                @foreach($sales_types as $sales_type)
                    <option value="{{$sales_type->id}}">{{$sales_type->sales_type}}</option>
                @endforeach
            </select>
            <label for="sales_type" class="formlabels form-label">SALES TYPE <span class="span_sales_type"></span></label>
        </div>
    </div><br>
    <hr>
    <h4>AVAILABILITY</h4>
    <hr>
    <div class="row">
        <div class="col-md-3 f-outline">
            <input type="date" style="color: black" name="start_date" id="start_date" class="forminput form-control" placeholder=" " autocomplete="off" >
            <label for="start_date" class="formlabels form-label">START DATE <span class="span_start_date"></span></label>
        </div>
        <div class="col-md-3 f-outline">
            <input type="time" style="color: black" name="start_time" id="start_time" class="forminput form-control" placeholder=" " autocomplete="off" >
            <label for="start_time" class="formlabels form-label">START TIME <span class="span_start_time"></span></label>
        </div>
        <div class="col-md-3 f-outline">
            <input type="date" style="color: black" name="end_date" id="end_date" class="forminput form-control" placeholder=" " autocomplete="off" >
            <label for="end_date" class="formlabels form-label">END DATE <span class="span_end_date"></span></label>
        </div>
        <div class="col-md-3 f-outline">
            <input type="time" style="color: black" name="end_time" id="end_time" class="forminput form-control" placeholder=" " autocomplete="off" >
            <label for="end_time" class="formlabels form-label">END TIME <span class="span_end_time"></span></label>
        </div>
    </div><br>
    <h6 class="container-fluid">DAYS AVAILABLE</h6>
    <div class="row">
        <div class="col-md-6 row">
            <div class="col-md-6">
                <div class="container-fluid">
                    <input type="checkbox" id="daily" value="Daily" checked/>
                    <label for="daily"> DAILY</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="monday" class="days_available" value="Monday" checked disabled/>
                    <label for="monday"> MON</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="tuesday" class="days_available" value="Tuesday" checked disabled/>
                    <label for="tuesday"> TUE</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="wednesday" class="days_available" value="Wednesday" checked disabled/>
                    <label for="wednesday"> WED</label><br>
                </div>
            </div>
            <div class="col-md-6">
                <div class="container-fluid">
                    <input type="checkbox" id="thursday" class="days_available" value="Thursday" checked disabled/>
                    <label for="thursday"> THU</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="friday" class="days_available" value="Friday" checked disabled/>
                    <label for="friday"> FRI</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="saturday" class="days_available" value="Saturday" checked disabled/>
                    <label for="saturday"> SAT</label><br>
                </div>
                <div class="container-fluid">
                    <input type="checkbox" id="sunday" class="days_available" value="Sunday" checked disabled/>
                    <label for="sunday"> SUN</label><br>
                </div>
            </div>
        </div>
        <div class="col-md">
            <h6 class="text-center">DINE-IN</h6>
            <hr>
            <div class="row">
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="dine_sml" id="dine_sml" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="dine_sml" class="formlabels form-label">SML <span class="span_dine_sml"></span></label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="dine_med" id="dine_med" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="dine_med" class="formlabels form-label">MED <span class="span_dine_med"></span></label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="dine_large" id="dine_large" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="dine_large" class="formlabels form-label">LRG <span class="span_dine_large"></span></label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="dine_xl" id="dine_xl" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="dine_xl" class="formlabels form-label">XLR <span class="span_dine_xl"></span></label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="dine_zero" id="dine_zero" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                </div>
            </div>
            <hr>

            <h6 class="text-center">TAKE OUT</h6>
            <hr>
            <div class="row">
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="takeout_sml" id="takeout_sml" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="takeout_sml" class="formlabels form-label">SML</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="takeout_med" id="takeout_med" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="takeout_med" class="formlabels form-label">MED</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="takeout_large" id="takeout_large" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="takeout_large" class="formlabels form-label">LRG</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="takeout_xl" id="takeout_xl" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="takeout_xl" class="formlabels form-label">XLR</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="takeout_zero" id="takeout_zero" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                </div>
            </div>
            <hr>
            <h6 class="text-center">PICK-UP</h6>
            <hr>
            <div class="row">
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="pickup_sml" id="pickup_sml" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="pickup_sml" class="formlabels form-label">SML</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="pickup_med" id="pickup_med" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="pickup_med" class="formlabels form-label">MED</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="pickup_large" id="pickup_large" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="pickup_large" class="formlabels form-label">LRG</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="pickup_xl" id="pickup_xl" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="pickup_xl" class="formlabels form-label">XLR</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="pickup_zero" id="pickup_zero" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                </div>
            </div>
            <hr>
            <h6 class="text-center">DELIVERY</h6>
            <hr>
            <div class="row">
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="delivery_sml" id="delivery_sml" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="delivery_sml" class="formlabels form-label">SML</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="delivery_med" id="delivery_med" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="delivery_med" class="formlabels form-label">MED</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="delivery_large" id="delivery_large" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="delivery_large" class="formlabels form-label">LRG</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="delivery_xl" id="delivery_xl" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                    <label for="delivery_xl" class="formlabels form-label">XLR</label>
                </div>
                <div class="col-md-2 f-outline">
                    <input type="number" value="0.00" style="color: black" name="delivery_zero" id="delivery_zero" class="forminput form-control numberOnly" placeholder="" autocomplete="off" >
                </div>
            </div>
            <hr>
        </div>
    </div>
</div>