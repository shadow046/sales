<div id="posModal" class="modal fade">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
            <div class="modal-header bg-default">
                <h5 class="modal-title w-100 text-center">POS DETAILS</h5>
                <button type="button" class="btn-close btn-close-white close btnClose" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="posForm">
                    <input type="hidden" id="pos_id" class="modal_id">
                    <input type="hidden" id="model_orig">
                    <input type="hidden" id="brand_orig">
                    <input type="hidden" id="vendor_orig">
                <hr>
                <h4>POS INFORMATION</h4>
                <div id="posRequired" class="alert alert-primary requiredAlert mt-2" role="alert" style="display: none;">
                    <i class='fa fa-exclamation-triangle'></i>
                    <b>NOTE:</b> Please fill up all required fields to proceed.
                </div>
                <hr>
                <div class="row pt-1">
                    <div id="x1" class="col-md f-outline">
                        <input type="search" style="color: black" name="model" id="model" class="forminput form-control requiredField text-uppercase" placeholder=" " autocomplete="off" >
                        <p id="duplicate_model" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="model" class="formlabels form-label">MODEL</label>
                    </div>
                    <div class="col-md f-outline">
                        <input type="search" style="color: black" name="brand" id="brand" class="forminput form-control requiredField text-uppercase stringOnly" placeholder=" " autocomplete="off" >
                        <label for="brand" class="formlabels form-label">BRAND</label>
                    </div>
                    <div class="col-md f-outline">
                        <input type="search" style="color: black" name="vendor" id="vendor" class="forminput form-control requiredField text-uppercase stringOnly" placeholder=" " autocomplete="off" >
                        <label for="vendor" class="formlabels form-label">VENDOR</label>
                    </div>
                </div>
                <br>
                <h4>SPECIFICATIONS</h4><hr>
                <div class="row pt-1 notUpdate">
                    <div class="col-md f-outline">
                        <input type="search" style="color: black" name="short_description" id="short_description" class="forminput form-control text-uppercase" placeholder=" " autocomplete="off">
                        <label for="short_description" class="formlabels form-label">SHORT DESCRIPTION</label>
                    </div>
                    <div class="col-md f-outline">
                        <input type="search" style="color: black" name="capacity" id="capacity" class="forminput form-control text-uppercase" placeholder=" " autocomplete="off">
                        <label for="capacity" class="formlabels form-label">CAPACITY</label>
                    </div>
                    <div class="col-md f-outline">
                        <input type="number" style="color: black" name="quantity" id="quantity" class="forminput form-control" placeholder=" " autocomplete="off">
                        <label for="quantity" class="formlabels form-label">QUANTITY</label>
                    </div>
                    <div class="col-md form-group">
                        <button class="form-control btn btn-custom addPosSpecificationBtn" style="float: left;">ADD</button>
                    </div>
                </div>

                <div id="posSpecs_orig_div" style="overflow-x: scroll; display:none;">
                    <table id="posSpecification_orig" class="table table-hover table-bordered table-striped align-middle posSpecification_orig">
                        <thead>
                            <tr class="bg-default posSpecification_orig">
                                <th style='width:375px !important'>SHORT DESCRIPTION</th>
                                <th style='width:275px !important'>CAPACITY</th>
                                <th style='width:275px !important'>QUANTITY</th>
                                <th style='width:175px !important'>ACTION</th>
                            </tr>
                        </thead>
                        <tbody id="posSpecification_tbody">
                        </tbody>
                    </table>
                </div>

                <div id="posSpecs_div" style="overflow-x: scroll; display:none;">
                    <table id="posSpecification" class="table table-hover table-bordered table-striped align-middle">
                        <thead class="posSpecification_thead">
                            <tr style="display: none;" class="bg-default posSpecification">
                                <th>SHORT DESCRIPTION</th>
                                <th>CAPACITY</th>
                                <th>QUANTITY</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                
                </form>
                <hr>
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