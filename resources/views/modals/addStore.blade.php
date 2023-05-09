<div id="storeModal" class="modal fade">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
            <div class="modal-header bg-default">
                <h5 class="modal-title w-100 text-center">STORE DETAILS</h5>
                <button type="button" class="btn-close btn-close-white close btnClose" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="storeForm">
                <hr>
                <div class="row mb-2">
                    <div class="col-3">
                        <h4>STORE INFORMATION</h4>
                    </div>
                    @can('toggle')
                    <div class="col-1 m-0 p-0">
                        <span id="status"></span>
                    </div>
                    @endcan
                </div>
                <div id="storeRequired" class="alert alert-primary requiredAlert" role="alert" style="display: none;">
                    <i class='fa fa-exclamation-triangle'></i>
                    <b>NOTE:</b> Please fill up all required fields to proceed.
                </div>

                <hr style="margin-top: -4px;">
                <div class="row pt-1">
                    <div class="col-md-4 f-outline">
                        <input type="search" style="color: black" name="branch_code" id="branch_code" class="forminput form-control text-uppercase requiredField" placeholder=" " autocomplete="off" onkeyup="alpha_numeric(this)">
                        <p id="duplicate_branch_code" class="validation"><i class="fas fa-exclamation-triangle"></i> STORE CODE ALREADY EXIST!</p>
                        <label for="branch_code" class="formlabels form-label">STORE CODE
                    </div>
                    <div class="col-md f-outline">
                        <select id="company_name" name="company_name" class="forminput form-control form-select requiredField single_field" style="color: black">
                            <option value="" selected disabled>SELECT COMPANY NAME</option>
                            @foreach($companies as $company)
                                <option value="{{$company->id}}">{{$company->company_name}}</option>
                            @endforeach
                        </select>
                        <label for="company_name" class="formlabels form-label">COMPANY NAME
                    </div>
                    <div class="col-md-4 f-outline">
                        <input type="search" style="color: black" name="tin" id="tin" class="forminput form-control text-uppercase" placeholder=" " autocomplete="off" >
                        <p id="duplicate_tin" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="tin" class="formlabels form-label">TAX IDENTIFICATION NUMBER
                    </div>
                </div>
                <div class="row pt-3">
                    <div class="col-md-4 f-outline">
                        <input type="search" style="color: black" name="branch_name" id="branch_name" class="forminput form-control requiredField text-uppercase stringOnly" placeholder=" " autocomplete="off" >
                        <p id="duplicate_branch_name" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="branch_name" class="formlabels form-label">BRANCH NAME
                    </div>
                    <div class="col-md-4 f-outline">
                        <input type="search" style="color: black" name="address" id="address" class="forminput form-control requiredField text-uppercase" placeholder=" " autocomplete="off" >
                        <label for="address" class="formlabels form-label">ADDRESS
                    </div>
                    <div class="col-md-4 f-outline">
                        <select id="store_area" name="store_area" class="forminput form-control form-select requiredField single_field" style="color: black">
                            <option value="" selected disabled>SELECT STORE AREA</option>
                            @foreach($store_areas as $store_area)
                                <option value="{{$store_area->id}}">{{$store_area->store_area}}</option>
                            @endforeach
                        </select>
                        <label for="store_area" class="formlabels form-label">STORE AREA
                    </div>
                </div>
                <div class="row pt-3">
                    <div class="col-md f-outline">
                        <select id="province" name="province" class="forminput form-control form-select" style="color: black">
                            <option selected disabled>SELECT PROVINCE</option>
                            @foreach ($provinces as $province)
                                <option class="province" value="{{ $province->provCode }}">{{ mb_strtoupper($province->provDesc) }}</option>
                            @endforeach
                        </select>
                        <label for="province" class="formlabels form-label">PROVINCE
                    </div>
                    <div class="col-md f-outline">
                        <select id="city" name="city" class="forminput form-control form-select" style="color: black" disabled>
                            <option selected disabled>SELECT CITY/MUNICIPALITY</option>
                        </select>
                        <label for="city" class="formlabels form-label">CITY/MUNICIPALITY
                    </div>
                    <div class="col-md f-outline">
                        <input id="region" name="region" type="text" class="forminput form-control" placeholder="AUTOFILL" autocomplete="off" disabled>
                        <label for="region" class="formlabels form-label">REGION
                    </div>
                </div>
                <div class="row pt-3">
                    <div class="col-md f-outline">
                        <select id="type" name="type" class="forminput form-control form-select requiredField single_field" style="color: black">
                            <option value="" selected disabled>SELECT STORE TYPE</option>
                            @foreach($types as $type)
                                <option value="{{$type->id}}">{{$type->type}}</option>
                            @endforeach
                        </select>
                        <label for="type" class="formlabels form-label">STORE TYPE
                    </div>

                    <div class="col-md f-outline">
                        <select class="forminput form-control form-select requiredField multiple_field" multiple id="setup" name="setup" data-placeholder="Select Setup">
                            @foreach($setups as $setup)
                                <option value="{{$setup->id}}">{{$setup->setup}}</option>
                            @endforeach
                        </select>
                        <label for="setup" class="formlabel form-label" style="margin-left: 15px;">STORE SETUP</label>
                    </div>

                    <div class="col-md f-outline">
                        <select id="group" name="group" class="forminput form-control form-select requiredField single_field" style="color: black">
                            <option value="" selected disabled>SELECT STORE GROUP</option>
                            @foreach($groups as $group)
                                <option value="{{$group->id}}">{{$group->group}}</option>
                            @endforeach
                        </select>
                        <label for="group" class="formlabels form-label">STORE GROUP
                    </div>
                </div>

                <div class="row pt-3">
                    <div class="col-md f-outline sub_group_div" style="display:none;">
                        <select id="sub_group" name="sub_group" class="forminput form-control form-select requiredField single_field" style="color: black" data-placholder="Select Mall Sub-group">
                            <option value="0" selected disabled>SELECT MALL SUB-GROUP</option>
                            @foreach($subgroups as $subgroup)
                                <option value="{{$subgroup->id}}">{{$subgroup->subgroup}}</option>
                            @endforeach
                        </select>
                        <label for="sub_group" class="formlabels form-label">MALL SUB-GROUP
                    </div>
                    <div class="col-md f-outline">
                        <select id="network" name="network" class="forminput form-control form-select requiredField single_field" style="color: black">
                            <option value="" selected disabled>SELECT STORE NETWORK SETUP</option>
                            @foreach($network_setups as $network_setup)
                                <option value="{{$network_setup->id}}">{{$network_setup->network_setup}}</option>
                            @endforeach
                        </select>
                        <label for="network" class="formlabels form-label">STORE NETWORK SETUP
                    </div>
                    <div class="col-md f-outline">
                        <select id="serving_store" name="serving_store" class="forminput form-control form-select requiredField" style="color: black" data-placeholder="Select Delivery Channel" multiple>
                            @foreach($delivery_serving_stores as $delivery_serving_store)
                                <option value="{{$delivery_serving_store->id}}">{{$delivery_serving_store->delivery_serving_store}}</option>
                            @endforeach
                        </select>
                        <label for="serving_store" class="formlabels form-label">DELIVERY CHANNEL
                    </div>
                </div>

                <hr>
                <h4>CONTACT PERSON</h4>
                <hr>
                <div class="row pt-3 notUpdate">
                    <div class="col-md-2 f-outline">
                        <input id="contact_person" name="contact_person" type="search" class="forminput form-control text-uppercase stringOnly" placeholder=" " autocomplete="off" >
                        <p id="duplicate_contact_person" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="contact_person" class="formlabels form-label">CONTACT PERSON
                    </div>
                    <div class="col-md-2 f-outline">
                        <input id="position" name="position" type="search" class="forminput form-control text-uppercase stringOnly" placeholder=" " autocomplete="off" >
                        <label for="position" class="formlabels form-label">POSITION
                    </div>
                    <div class="col-md-2 f-outline">
                        <input id="email" name="email" type="search" class="forminput form-control text-lowercase spacebar" placeholder=" " autocomplete="off" >
                        <p id="duplicate_email" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="email" class="formlabels form-label">EMAIL-ADDRESS
                    </div>
                    <div class="col-md-2 f-outline">
                        <input id="telephone" name="telephone" type="search" class="forminput form-control" placeholder=" " autocomplete="off" >
                        <p id="duplicate_telephone" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="telephone" class="formlabels form-label">TELEPHONE
                    </div>
                    <div class="col-md-2 f-outline">
                        <input id="mobile" name="mobile" type="search" class="forminput form-control numberOnly" placeholder=" " autocomplete="off">
                        <p id="duplicate_mobile" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="mobile" class="formlabels form-label">MOBILE
                    </div>
                    <div class="col-md-2 f-outline">
                        <button class="form-control btn btn-custom addStoreContactDetailsBtn"><i class="fa-solid fa-plus"></i> ADD</button>
                    </div>
                </div>
                <br>
                <div id="storeContactDetails_div" style="overflow-x: scroll; display:none;">
                    <table id="storeContactDetails" class="table table-bordered table-striped table-hover align-middle">
                        <thead>
                            <tr style="display: none;" class="bg-default storeContactDetails">
                                <th>CONTACT PERSON</th>
                                <th>POSITION</th>
                                <th>EMAIL ADDRESS</th>
                                <th>TELEPHONE</th>
                                <th>MOBILE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>

                <div id="storeContactDetails_orig_div" style="overflow-x: scroll; display:none;">
                    <table id="storeContactDetails_orig" class="table table-bordered table-striped table-hover align-middle storeContactDetails_orig">
                        <thead>
                            <tr class="bg-default storeContactDetails_orig">
                                <th>CONTACT PERSON</th>
                                <th>POSITION</th>
                                <th>EMAIL ADDRESS</th>
                                <th>TELEPHONE</th>
                                <th>MOBILE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody id="storeContactDetails_tbody">
                        </tbody>
                    </table>
                </div>

                <hr>
                <h4>POS INFORMATION</h4>
                <hr>
                <div class="row pt-3 notUpdate">
                    <div class="col-md-2 f-outline">
                        <select id="model" name="model" class="forminput form-control form-select" style="color: black">
                            <option value="" disabled selected>SELECT POS Model </option>
                                @foreach($poss as $pos)
                                    <option value="{{$pos->id}}">{{$pos->model}}</option>
                                @endforeach
                        </select>
                        <label for="model" class="formlabels form-label">POS Model
                    </div>
                    <div class="col-md-2 f-outline">
                        <input id="serial" name="serial" type="text" class="forminput form-control text-uppercase" placeholder=" " autocomplete="off" onkeyup="alpha_numeric(this)">
                        <label for="serial" class="formlabels form-label">SERIAL
                    </div>
                     <div class="col-md-2 f-outline">
                        <input id="min" name="min" type="text" class="forminput form-control text-uppercase" placeholder=" " autocomplete="off" maxlength="20" onkeyup="alpha_numeric(this)">
                        <p id="duplicate_min" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="min" class="formlabels form-label">MIN
                    </div>
                     <div class="col-md-2 f-outline">
                        <input id="ptu" name="ptu" type="text" class="forminput form-control text-uppercase" placeholder=" " autocomplete="off" maxlength="30" onkeyup="alpha_numeric(this)">
                        <p id="duplicate_ptu" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="ptu" class="formlabels form-label">PTU No.
                    </div>
                     <div class="col-md-2 f-outline">
                        <input id="date_issued" name="date_issued" type="date" class="forminput form-control" placeholder=" " autocomplete="off" >
                        <label for="date_issued" class="formlabels form-label">Date Issued
                    </div>
                    <div class="col-md-2">
                        <button class="form-control btn btn-custom addPosInformationBtn" style="float: left;"><i class="fa-solid fa-plus"></i> ADD</button>
                    </div>
                </div>
                <br>

                <div id="storePosInformation_div" style="overflow-x: scroll; display:none;">
                    <table id="storePosInformation" class="table table-bordered table-striped table-hover align-middle">
                        <thead>
                            <tr style="display: none;" class="bg-default storePosInformation_thead">
                                <th class="d-none">POS MODEL</th>
                                <th>POS MODEL</th>
                                <th>SERIAL</th>
                                <th>MIN</th>
                                <th>PTU NO.</th>
                                <th>DATE ISSUED</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>

                <div id="storePosInformation_orig_div" style="overflow-x: scroll; display:none;">
                    <table id="storePosInformation_orig" class="table table-bordered table-striped table-hover align-middle storePosInformation_orig">
                        <thead>
                            <tr class="bg-default storePosInformation_orig">
                                <th>POS ID</th>
                                <th>STORE ID</th>
                                <th>MODEL ID</th>
                                <th>POS MODEL</th>
                                <th>SERIAL</th>
                                <th>MIN</th>
                                <th>PTU NO.</th>
                                <th>DATE ISSUED</th>
                                <th>ACTION</th>
                                <th>STATUS</th>
                                <th>REMARKS</th>
                            </tr>
                        </thead>
                        <tbody id="storePosInformation_tbody">
                        </tbody>
                    </table>
                </div>

                </form>
                <hr>
                <div class="row">
                    <div class="col-md form-group">
                        <button class="form-control btn btn-custom cancelBtn float-end" data-bs-dismiss="modal"><i class="fa-solid fa-xmark"></i> CANCEL</button>
                        <button class="form-control btn btn-custom saveBtn btnRequired float-end"><i class="fas fa-save"></i> SAVE</button>
                        @can('update')
                            <button class="form-control btn btn-custom updateBtn btnRequired float-end"><i class="fas fa-save"></i> UPDATE</button>
                        @endcan
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>