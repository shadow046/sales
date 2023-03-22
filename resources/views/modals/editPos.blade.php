<div class="modal fade in" id="editPosModal">
    <div class="modal-dialog modal-m modal-dialog-centered">
    <div class="modal-content">
        <div class="modal-header bg-default text-center" style="height: 45px; border-radius: 0px;">
            <h6 class="modal-title w-100">EDIT POS DETAILS</h6>
            <button type="button" style="zoom: 80%;" class="btn-close btn-close-white close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" style="background-color: white; color: black;">
            <input type="hidden" id="posStore_id"/>
            <input type="hidden" id="posPos_id"/>
            <div class="requiredNote requiredNote2 alert alert-primary p-2" role="alert" style="margin-top: -5px; display: none;">
                <i class='fa fa-exclamation-triangle'></i>
                <b>NOTE:</b> Please fill up all required fields.
            </div>
            <div class="changesNote changesNote2 alert alert-warning p-2" role="alert" style="margin-top: -5px; display: none;">
                <i class='fa fa-exclamation-triangle'></i>
                <b>WARNING:</b> Cannot proceed. No changes found.
            </div>
            <div class="mb-3">
                <div class="f-outline">
                    <select class="forminput form-control form-select requiredField bg-white" id="posModel" name="posModel">
                        <option value="" selected disabled style="color: Gray;">Select POS Model</option>
                        @foreach($poss as $pos)
                            <option value="{{$pos->id}}" style="color: Black;">{{$pos->model}}</option>
                        @endforeach
                    </select>
                    <label for="posModel" class="formlabel form-label">POS Model</label>
                </div>
            </div>
            <div class="mb-3">
                <div class="f-outline">
                    <input class="forminput form-control requiredField bg-white spChar" type="search" id="posSerial" name="posSerial" placeholder=" ">
                    <label for="posSerial" class="formlabel form-label">Serial</label>
                </div>
            </div>
            <div class="mb-3">
                <div class="f-outline">
                    <input class="forminput form-control requiredField bg-white" type="search" id="posMin" name="posMin" placeholder=" ">
                    <label for="posMin" class="formlabel form-label">MIN</label>
                </div>
            </div>
            <div class="mb-3">
                <div class="f-outline">
                    <input class="forminput form-control bg-white" type="search" id="posPtu" name="posPtu" placeholder=" ">
                    <label for="posPtu" class="formlabel form-label">PTU No.</label>
                </div>
            </div>
            <div class="mb-3">
                <div class="f-outline">
                    <input class="forminput form-control bg-white" type="date" id="posDateIssued" name="posDateIssued" placeholder=" ">
                    <label for="posDateIssued" class="formlabel form-label">Date Issued</label>
                </div>
            </div>
            <div class="mb-3">
                <div class="f-outline">
                    <select class="forminput form-control form-select requiredField bg-white" id="posStatus" name="posStatus">
                        <option value="" selected disabled style="color: Gray;">Select Status</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="TRANSFERRED">TRANSFERRED</option>
                    </select>
                    <label for="posStatus" class="formlabel form-label">Status</label>
                </div>
            </div>
            <div class="mb-3 divPosRemarks">
                <div class="f-outline">
                    <input class="forminput form-control requiredField bg-white" type="search" id="posRemarks" name="posRemarks" placeholder=" ">
                    <label for="posRemarks" class="formlabel form-label">Remarks</label>
                </div>
            </div>
            <div style="zoom: 85%;">
                <button type="button" id="btnUpdatePosModel" class="btn btn-primary float-end bp btnRequired"><i class="fas fa-save"></i> UPDATE</button>
            </div>
        </div>
    </div>
    </div>
</div>