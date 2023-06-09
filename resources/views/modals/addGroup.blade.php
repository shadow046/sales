<div id="groupModal" class="modal fade">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-default">
                <h5 class="modal-title w-100 text-center">GROUP DETAILS</h5>
                <button type="button" class="btn-close btn-close-white close btnClose" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row mb-3">
                    <div class="col-md f-outline">
                        <input type="search" style="color: black" name="group" id="group" class="forminput form-control requiredField text-uppercase stringOnly" placeholder=" " autocomplete="off" >
                        <label for="group" class="formlabels form-label">GROUP</label>
                        <p class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md f-outline">
                        @can('delete')
                            <button class="btn btn-custom deleteBtn float-start" style="width:40px;"><i class="fas fa-trash"></i></button>
                        @endcan
                        <button class="btn btn-custom cancelBtn float-end" data-bs-dismiss="modal"><i class="fa-solid fa-xmark"></i> CANCEL</button>
                        @can('update')
                            <button class="btn btn-custom updateBtn btnRequired float-end"><i class="fas fa-save"></i> UPDATE</button>
                        @endcan
                        <button class="btn btn-custom saveBtn btnRequired float-end"><i class="fas fa-save"></i> SAVE</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>