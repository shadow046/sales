<div id="companyModal" class="modal fade">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
            <div class="modal-header bg-default">
                <h5 class="modal-title w-100 text-center">COMPANY MAINTENANCE</h5>
                <button type="button" class="btn-close btn-close-white close btnClose" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="companyForm">
                <hr>
                <h4>COMPANY PROFILE</h4>

                <div id="companyRequired" class="alert alert-primary requiredAlert mt-2" role="alert" style="display: none;">
                    <i class='fa fa-exclamation-triangle'></i>
                    <b>NOTE:</b> Please fill up all required fields to proceed.
                </div>
                <hr>
                <div class="row pt-1">
                    <div class="col-md f-outline">
                        <input type="search" style="color: black" name="company_code" id="company_code" class="forminput form-control requiredField text-uppercase" placeholder=" " autocomplete="off" onkeyup="alpha_numeric(this)">
                        <p id="duplicate_company_code" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="company_code" class="formlabels form-label">COMPANY CODE</label>
                    </div>
                    <div class="col-md f-outline">
                        <input type="search" style="color: black" name="company_name" id="company_name" class="forminput form-control requiredField text-uppercase stringOnly" placeholder=" " autocomplete="off" >
                        <p id="duplicate_company_name" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="company_name" class="formlabels form-label">COMPANY NAME</label>
                    </div>
                    <div class="col-md f-outline">
                        <input type="search" style="color: black" name="trade_name" id="trade_name" class="forminput form-control requiredField text-uppercase stringOnly" placeholder=" " autocomplete="off" >
                        <label for="trade_name" class="formlabels form-label">TRADE NAME</label>
                    </div>
                    <div class="col-md f-outline">
                        <input type="search" style="color: black" name="tax" id="tax" class="forminput form-control requiredField formatTIN" placeholder=" " autocomplete="off">
                        <p id="duplicate_tax" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="tax" class="formlabels form-label">TAX IDENTIFICATION NUMBER</label>
                    </div>
                </div>
                <div class="row pt-3">
                    <div class="col-md f-outline">
                        <input type="search" style="color: black" name="address" id="address" class="forminput form-control requiredField" placeholder=" " autocomplete="off" >
                        <label for="address" class="formlabels form-label">ADDRESS</label>
                    </div>
                    <div class="col-md f-outline">
                        <select id="province" name="province" class="forminput form-control form-select requiredField" style="color: black">
                            <option value="" selected disabled>SELECT PROVINCE</option>
                            @foreach ($provinces as $province)
                                <option class="province" value="{{ $province->provCode }}">{{ mb_strtoupper($province->provDesc) }}</option>
                            @endforeach
                        </select>
                        <label for="province" class="formlabels form-label">PROVINCE
                    </div>
                    <div class="col-md f-outline">
                        <select id="city" name="city" class="forminput form-control form-select requiredField" style="color: black" disabled>
                            <option selected disabled>SELECT CITY/MUNICIPALITY</option>
                        </select>
                        <label for="city" class="formlabels form-label">CITY/MUNICIPALITY
                    </div>
                    <div class="col-md f-outline">
                        <input id="region" name="region" type="text" class="forminput form-control requiredField" placeholder="AUTOFILL" autocomplete="off" disabled>
                        <label for="region" class="formlabels form-label">REGION
                    </div>
                </div>
                <hr>

                <h4>CONTACT PERSON</h4>
                <hr>
                <div class="row pt-3 notUpdate">
                    <div class="col-md-2 f-outline">
                        <input type="search" style="color: black" name="person" id="person" class="forminput form-control text-uppercase stringOnly" placeholder=" " autocomplete="off" >
                        <p id="duplicate_person" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="person" class="formlabels form-label">CONTACT PERSON</label>
                    </div>
                    <div class="col-md-2 f-outline">
                        <input type="search" style="color: black" name="position" id="position" class="forminput form-control text-uppercase stringOnly" placeholder=" " autocomplete="off" >
                        <label for="position" class="formlabels form-label">POSITION</label>
                    </div>
                    <div class="col-md-2 f-outline">
                        <input type="search" style="color: black" name="email_address" id="email_address" class="forminput form-control text-lowercase" placeholder=" " autocomplete="off" >
                        <p id="duplicate_email_address" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="email_address" class="formlabels form-label">EMAIL-ADDRESS</label>
                    </div>
                    <div class="col-md-2 f-outline">
                        <input type="number" style="color: black" name="telephone" id="telephone" class="forminput form-control numberOnly" placeholder=" " autocomplete="off" >
                        <p id="duplicate_telephone" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="telephone" class="formlabels form-label">TELEPHONE</label>
                    </div>
                    <div class="col-md-2 f-outline">
                        <input type="search" style="color: black" name="mobile" id="mobile" class="forminput form-control numberOnly" placeholder=" " autocomplete="off">
                        <p id="duplicate_mobile" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="mobile" class="formlabels form-label">MOBILE</label>
                    </div>
                    <div class="col-md-2 f-outline">
                        <button class="form-control btn btn-custom addCompanyContactPersonBtn" style="float: left;"><i class="fas fa-plus"></i> ADD</button>
                    </div>
                </div>
                <br>
                <div id="company_div" style="overflow-x: scroll; display:none;">
                    <table id="companyContactPerson" class="table table-bordered table-striped table-hover">
                        <thead>
                            <tr style="display: none;" class="bg-default companyContactPerson">
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

                <div id="company_orig_div" style="overflow-x: scroll; display:none;">
                    <table id="companyContactPerson_orig" class="table table-bordered table-striped table-hover align-middle companyContactPerson_orig">
                        <thead>
                            <tr class="bg-default companyContactPerson_orig">
                                <th>CONTACT PERSON</th>
                                <th>POSITION</th>
                                <th>EMAIL ADDRESS</th>
                                <th>TELEPHONE</th>
                                <th>MOBILE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody id="companyContactPerson_tbody">
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