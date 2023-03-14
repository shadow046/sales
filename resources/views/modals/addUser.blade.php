<div class="modal fade in" id="addUser">
    <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
        <div class="modal-header bg-default text-center" style="height: 45px; border-radius: 0px;">
            <h6 class="modal-title w-100">ADD NEW USER</h6>
            <button type="button" style="zoom: 80%;" class="btn-close btn-close-white close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" style="background-color: white; color: black;">
            <form>
                <div class="mb-4">
                    <div class="f-outline">
                        <input class="forminput form-control requiredField bg-white text-uppercase" type="search" id="name" name="name" placeholder=" ">
                        <label for="name" class="formlabel form-label">Full Name</label>
                    </div>
                </div>
                <div class="mb-4">
                    <div class="f-outline">
                        <input class="forminput form-control requiredField bg-white text-lowercase" type="search" id="email" name="email" placeholder=" ">
                        <label for="email" class="formlabel form-label">Email Address</label>
                    </div>
                </div>
                <div class="mb-4">
                    <div class="f-outline">
                        <select class="forminput form-control form-select requiredField bg-white" id="role" name="role">
                            <option value="" selected disabled style="color: Gray;">Select User Level</option>
                            @foreach($role as $roles)
                                <option value="{{$roles->id}}" style="color: Black;">{{strtoupper($roles->name)}}</option>
                            @endforeach
                        </select>
                        <label for="role" class="formlabel form-label">User Level</label>
                    </div>
                </div>
                <div class="mb-4 classBranch" style="display: none;">
                    <br>
                    <div class="f-outline">
                        <select class="forminput form-control form-select requiredField" id="branch" name="branch">
                            <option value="" selected disabled>SELECT COMPANY</option>
                            @foreach($branches as $branch)
                                <option value="{{$branch->id}}">{{$branch->company_name}}</option>
                            @endforeach
                        </select>
                        <label for="branch" class="formlabel form-label">COMPANY</label>
                    </div>
                </div>
                <div class="mb-4 classCompany" style="display: none;">
                    <div style="height: 10px;">&nbsp;</div>
                    <div class="f-outline">
                        <select class="forminput form-control form-select requiredField" id="company" name="company" multiple data-placeholder="SELECT COMPANY">
                            @foreach($companies as $company)
                                <option value="{{$company->id}}">{{$company->company_name}}</option>
                            @endforeach
                        </select>
                        <label for="company" class="formlabel form-label">COMPANY</label>
                    </div>
                </div>
                <div class="mb-4 classArea" style="display: none;">
                    <div style="height: 10px;">&nbsp;</div>
                    <div class="f-outline">
                        <select class="forminput form-control form-select requiredField" id="area" name="area" multiple data-placeholder="SELECT STORE AREA">
                            @foreach($areas as $area)
                                <option value="{{$area->id}}">{{$area->store_area}}</option>
                            @endforeach
                        </select>
                        <label for="area" class="formlabel form-label">Store Area</label>
                    </div>
                </div>
                {{-- <div class="mb-3 classCompany" style="display: none;">
                    <div class="f-outline mb-3">
                        <select class="forminput form-control form-select requiredField" id="company" name="company">
                            <option value="" selected disabled>SELECT COMPANY</option>
                            @foreach($companies as $company)
                                <option value="{{$company->id}}">{{$company->company_name}}</option>
                            @endforeach
                        </select>
                        <label for="company" class="formlabel form-label">COMPANY</label>
                    </div>

                    <div class="f-outline mb-3">
                        <select id="province_user" name="province_user" class="forminput form-control form-select requiredField" style="color: black">
                            <option selected disabled>SELECT PROVINCE</option>
                            @foreach ($provinces as $province)
                                <option class="province_user" value="{{ $province->provCode }}">{{ mb_strtoupper($province->provDesc) }}</option>
                            @endforeach
                        </select>
                        <label for="province_user" class="formlabels form-label">PROVINCE
                    </div>

                    <div class="f-outline mb-3" style="display: none;" id="city_div">
                        <select id="city_user" name="city_user" multiple class="forminput form-control form-select requiredField" style="color: black;" disabled>
                        </select>
                        <label for="city_user" class="formlabels form-label">BRANCH
                    </div>
                </div> --}}
                <div style="zoom: 85%;">
                    <button type="button" id="btnClear" class="btn btn-outline-danger" onclick="$('#name').focus();"><i class="fas fa-eraser"></i> CLEAR</button>
                    <button type="button" id="btnSave" class="btn btn-primary float-end bp btnRequired"><i class="fas fa-save"></i> SAVE</button>
                </div>
            </form>
        </div>
    </div>
    </div>
</div>