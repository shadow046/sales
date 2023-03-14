<div id="tenderTypeModal" class="modal fade">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-default">
                <h5 class="modal-title w-100 text-center">TENDER TYPE DETAILS</h5>
                <button type="button" class="btn-close btn-close-white close btnClose" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row mb-3">
                    <div class="col-md f-outline">
                        <input type="search" style="color: black" name="tender_type" id="tender_type" class="forminput form-control requiredField text-uppercase stringOnly" placeholder=" " autocomplete="off" >
                        <p class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="type" class="formlabels form-label">TENDER TYPE</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md f-outline">
                        @can('delete')
                            <button class="form-control btn btn-custom deleteBtn float-start" style="width:40px;"><i class="fas fa-trash-can"></i></button>
                        @endcan
                        <button class="form-control btn btn-custom cancelBtn float-end" data-bs-dismiss="modal"><i class="fa-solid fa-xmark"></i> CANCEL</button>
                        @can('update')
                            <button class="form-control btn btn-custom updateBtn btnRequired float-end"><i class="fas fa-save"></i> UPDATE</button>
                        @endcan
                        <button class="form-control btn btn-custom saveBtn btnRequired float-end"><i class="fas fa-save"></i> SAVE</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>