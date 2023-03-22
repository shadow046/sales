<div class="modal fade in" id="editContactModal">
    <div class="modal-dialog modal-m modal-dialog-centered">
    <div class="modal-content">
        <div class="modal-header bg-default text-center" style="height: 45px; border-radius: 0px;">
            <h6 class="modal-title w-100">EDIT CONTACT DETAILS</h6>
            <button type="button" style="zoom: 80%;" class="btn-close btn-close-white close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" style="background-color: white; color: black;">
            <input type="hidden" id="contact_id"/>
            <div class="requiredNote requiredNote1 alert alert-primary p-2" role="alert" style="margin-top: -5px; display: none;">
                <i class='fa fa-exclamation-triangle'></i>
                <b>NOTE:</b> Please fill up all required fields.
            </div>
            <div class="changesNote changesNote1 alert alert-warning p-2" role="alert" style="margin-top: -5px; display: none;">
                <i class='fa fa-exclamation-triangle'></i>
                <b>WARNING:</b> Cannot proceed. No changes found.
            </div>
            <div class="f-outline mb-3">
                <input id="contact_person_edit" name="contact_person_edit" type="search" class="forminput form-control text-uppercase requiredField stringOnly" placeholder=" " autocomplete="off" >
                <label for="contact_person_edit" class="formlabels form-label">CONTACT PERSON
            </div>
            <div class="f-outline mb-3">
                <input id="position_edit" name="position_edit" type="search" class="forminput form-control requiredField stringOnly" placeholder=" " autocomplete="off" >
                <label for="position_edit" class="formlabels form-label">POSITION
            </div>
            <div class="f-outline mb-3">
                <input id="email_edit" name="email_edit" type="search" class="forminput form-control requiredField spacebar" placeholder=" " autocomplete="off" >
                <label for="email_edit" class="formlabels form-label">EMAIL-ADDRESS
            </div>
            <div class="f-outline mb-3">
                <input id="telephone_edit" name="telephone_edit" type="search" class="forminput form-control" placeholder=" " autocomplete="off" >
                <label for="telephone_edit" class="formlabels form-label">TELEPHONE
            </div>
            <div class="f-outline mb-3">
                <input id="mobile_edit" name="mobile_edit" type="search" class="forminput form-control requiredField numberOnly" placeholder=" " autocomplete="off">
                <label for="mobile_edit" class="formlabels form-label">MOBILE
            </div>
            <div style="zoom: 85%;">
                <button type="button" id="btnUpdateContact" class="btn btn-primary float-end bp btnRequired"><i class="fas fa-save"></i> UPDATE</button>
            </div>
        </div>
    </div>
    </div>
</div>