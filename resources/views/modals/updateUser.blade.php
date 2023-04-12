<div class="modal fade in" id="updateUser">
    <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
        <div class="modal-header bg-default text-center" style="height: 45px; border-radius: 0px;">
            <h6 class="modal-title w-100">UPDATE USER DETAILS</h6>
            <button type="button" style="zoom: 80%;" class="btn-close btn-close-white close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" style="background-color: white; color: black;">
            <input type="hidden" name="id1" id="id1">
            <input type="hidden" name="name2" id="name2">
            <input type="hidden" name="email2" id="email2">
            <input type="hidden" name="role2" id="role2">
            <input type="hidden" name="branch2" id="branch2">
            <input type="hidden" name="company2" id="company2">
            <input type="hidden" name="area2" id="area2">
            <input type="hidden" name="store2" id="store2">
            <input type="hidden" name="province2" id="province2">
            <input type="hidden" name="district2" id="district2">
            <div class="mb-4">
                <div class="f-outline">
                    <input class="forminput form-control requiredField bg-white text-uppercase" type="search" id="name1" name="name1" placeholder=" ">
                    <label for="name1" class="formlabel form-label">Full Name</label>
                </div>
            </div>
            <div class="mb-4">
                <div class="f-outline">
                    <input class="forminput form-control requiredField bg-white text-lowercase" type="search" id="email1" name="email1" placeholder=" ">
                    <label for="email1" class="formlabel form-label">Email Address</label>
                </div>
            </div>
            <div class="mb-4">
                <div class="f-outline">
                    <select class="forminput form-control form-select requiredField bg-white" id="role1" name="role1">
                        <option value="" selected disabled>Select User Level</option>
                        @foreach($role as $roles)
                            <option value="{{$roles->id}}">{{strtoupper($roles->name)}}</option>
                        @endforeach
                    </select>
                    <label for="role1" class="formlabel form-label">User Level</label>
                </div>
            </div>
            <div class="mb-4 classBranch classFranchisee" style="display: none;">
                <br>
                <div class="f-outline">
                    <select class="forminput form-control form-select requiredField" id="branch1" name="branch1">
                        <option value="" selected disabled>SELECT COMPANY</option>
                        @foreach($branches as $branch)
                            <option value="{{$branch->id}}">{{$branch->company_name}}</option>
                        @endforeach
                    </select>
                    <label for="branch1" class="formlabel form-label">Company</label>
                </div>
            </div>
            <div class="mb-4 classCompany classAreaManager" style="display: none;">
                <div style="height: 10px;">&nbsp;</div>
                <div class="f-outline">
                    <select class="forminput form-control form-select requiredField" id="company1" name="company1" multiple data-placeholder="SELECT COMPANY">
                        @foreach($companies as $company)
                            <option value="{{$company->id}}">{{$company->company_name}}</option>
                        @endforeach
                    </select>
                    <label for="company1" class="formlabel form-label">Company</label>
                </div>
            </div>
            <div class="mb-4 classArea classAreaManager" style="display: none;">
                <div style="height: 10px;">&nbsp;</div>
                <div class="f-outline">
                    <select class="forminput form-control form-select requiredField" id="area1" name="area1" multiple data-placeholder="SELECT STORE AREA">
                        @foreach($areas as $area)
                            <option value="{{$area->id}}">{{$area->store_area}}</option>
                        @endforeach
                    </select>
                    <label for="area1" class="formlabel form-label">Store Area</label>
                </div>
            </div>
            <div class="mb-2 classStore classAreaManager" style="display: none;">
                <div class="form-check mb-4 d-none">
                    <input type="checkbox" class="form-check-input" id="branchAll1" name="branchAll1" value="0">
                    <label class="form-check-label text-default" for="branchAll1">ALL BRANCHES (<span class="branchCount1">0</span>)</label>
                </div>
                <div class="hideStore1">
                    <div style="height: 10px;">&nbsp;</div>
                    <div class="f-outline">
                        <select class="forminput form-control form-select requiredField" id="store1" name="store1" multiple data-placeholder="SELECT STORE BRANCHES">
                        </select>
                        <label for="store1" class="formlabel form-label">Store Branches (<span id="store1_count">0</span>)</label>
                    </div>
                </div>
            </div>
            <div class="mb-2 classProvince classDistrictManager" style="display: none;">
                <div class="f-outline">
                    <select class="forminput form-control form-select requiredField" id="province1" name="province1">
                        <option value="" selected disabled style="color: Gray;">Select Province</option>
                        <option value="NATIONAL CAPITAL REGION (NCR)">NATIONAL CAPITAL REGION (NCR)</option>
                    </select>
                    <label for="province1" class="formlabel form-label">Province</label>
                </div>
            </div>
            <div class="mb-2 classDistrict classDistrictManager" style="display: none;">
                <div style="height: 10px;">&nbsp;</div>
                <div class="f-outline">
                    <select class="forminput form-control form-select requiredField" id="district1" name="district1">
                        <option value="" selected disabled style="color: Gray;">Select Province</option>
                        <option value="NATIONAL CAPITAL REGION (NCR) [ALL]">NATIONAL CAPITAL REGION (NCR) (ALL DISTRICTS)</option>
                        <option value="NCR, CITY OF MANILA, FIRST DISTRICT">FIRST DISTRICT</option>
                        <option value="NCR, SECOND DISTRICT">SECOND DISTRICT</option>
                        <option value="NCR, THIRD DISTRICT">THIRD DISTRICT</option>
                        <option value="NCR, FOURTH DISTRICT">FOURTH DISTRICT</option>
                    </select>
                    <label for="district1" class="formlabel form-label">District (<span id="district_count">4</span>)</label>
                </div>
            </div>
            <div class="mt-4" style="zoom: 85%;">
                <button id="btnReset" type="button" class="btn btn-outline-danger" onclick="$('#name1').focus();"><i class="fas fa-eraser"></i> RESET</button>
                <button type="button" id="btnUpdate" class="btn btn-primary bp float-end btnRequired"><i class="fas fa-save"></i> UPDATE</button>
            </div>
        </div>
    </div>
    </div>
</div>