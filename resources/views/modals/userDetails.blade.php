<div id="userDetailsModal" class="modal fade">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-default">
                <h5 class="modal-title w-100 text-center">USER DETAILS</h5>
                <button type="button" class="btn-close btn-close-white close btnClose" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body" id="user_details" onclick="$('.btnCopyDetails').click();">
                        FULL NAME: <span id="dtlName"></span><br>
                        EMAIL: <span id="dtlEmail"></span><br>
                        VERIFICATION KEY: {{strtoupper(Str::random(5))}}-{{App\Models\User::where('userlevel', 1)->count()+1}}-{{strtoupper(Str::random(5))}}<br>
                        USER LEVEL: ADMIN
                    </div>
                </div>
            </div>
                <div class="alert alert-primary text-center mx-3" role="alert">
                    <span style="zoom:110%;">To create a new Administrator level user account,<br>you will need to copy the credentials above<br>and send a request to <b>admin@apsoft.com.ph</b></span>
                </div>
            <hr>
            <div class="col-md form-group">
                <button class="btn btn-custom btnCancelDetails float-end" data-bs-dismiss="modal"><i class="fa-solid fa-xmark"></i> CANCEL</button>
                <button class="btn btn-custom btnCopyDetails float-end"><i class="fa-solid fa-copy"></i> COPY</button>
            </div>
        </div>
    </div>
</div>