<div id="roleModal" class="modal fade">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-default">
                <h5 class="modal-title w-100 text-center">USER ROLE DETAILS</h5>
                <button type="button" class="btn-close btn-close-white close btnClose" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row mb-4">
                    <div class="col-md f-outline">
                        <input type="search" style="color: black" name="role" id="role" class="forminput form-control requiredField text-uppercase stringOnly" placeholder=" " autocomplete="off" >
                        <label for="role" class="formlabels form-label">USER ROLE NAME</label>
                        <p class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-m f-outline">
                        <b class="text-default">USER PERMISSIONS</b>
                        <div class="form-check">
                            @foreach($permissions as $permission)
                                <input class="form-check-input permission" type="checkbox" value="{{$permission->id}}"/>
                                <label class="form-check-label">{{$permission->desc}}</label><br>
                            @endforeach
                        </div>
                        <div class="form-check">
                            <input type="radio" class="form-check-input assignment" id="radio1" name="optradio" value="" checked>NO COMPANY/AREA assignment in user accounts.
                            <label class="form-check-label" for="radio1"></label>
                        </div>
                        <div class="form-check">
                            <input type="radio" class="form-check-input assignment" id="radio2" name="optradio" value="7">COMPANY and AREA assignment in user accounts.
                            <label class="form-check-label" for="radio2"></label>
                        </div>
                        <div class="form-check">
                            <input type="radio" class="form-check-input assignment" id="radio3" name="optradio" value="28">COMPANY ONLY assignment in user accounts.
                            <label class="form-check-label" for="radio3"></label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-m f-outline">
                        <b class="text-default">USER ACCESS</b>
                        <div class="form-check">
                            @foreach($accesses as $access)
                                <input class="form-check-input permission" type="checkbox" value="{{$access->id}}"/>
                                <label class="form-check-label">{{$access->desc}}</label><br>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md f-outline mb-3">
                @can('delete')
                    <button id="deleteBtn" class="form-control btn btn-outline-danger float-start" style="width:40px;"><i class="fas fa-trash"></i></button>
                @endcan
                <button class="form-control btn btn-custom cancelBtn float-end" data-bs-dismiss="modal"><i class="fa-solid fa-xmark"></i> CANCEL</button>
                <button class="form-control btn btn-custom updateBtn float-end btnRequired"><i class="fas fa-save"></i> UPDATE</button>
                <button class="form-control btn btn-custom saveBtn float-end btnRequired"><i class="fas fa-save"></i> SAVE</button>
            </div>
        </div>
    </div>
</div>