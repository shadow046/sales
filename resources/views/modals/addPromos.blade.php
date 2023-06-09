<div id="promosModal" class="modal fade">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
            <div class="modal-header bg-default">
                <h5 class="modal-title w-100 text-center">PROMO DETAILS</h5>
                <button type="button" class="btn-close btn-close-white close btnClose" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="promosForm">
                <hr>
                <h4>PROMO INFORMATION</h4>

                <div id="promosRequired" class="alert alert-primary requiredAlert mt-2" role="alert" style="display: none;">
                    <i class='fa fa-exclamation-triangle'></i>
                    <b>NOTE:</b> Please fill up all required fields to proceed.
                </div>
                <hr>
                
                <div class="row pt-1">
                    <div class="col-md-3 f-outline">
                        <input type="hidden" id="promo_code_new">
                        <input type="search" style="color: black" name="promo_code" id="promo_code" class="forminput form-control spChar requiredField" placeholder=" " autocomplete="off" >
                        <p id="duplicate_promo_code" class="validation"><i class="fas fa-exclamation-triangle"></i> ALREADY EXIST!</p>
                        <label for="promo_code" class="formlabels form-label">Promo Code</label>
                    </div>
                    <div class="col-md-6 f-outline">
                        <input type="search" style="color: black" name="description" id="description" class="forminput form-control text-uppercase requiredField" placeholder=" " autocomplete="off" >
                        <label for="description" class="formlabels form-label">Description</label>
                    </div>
                    <div class="col-md-3 f-outline">
                        <input type="number" style="color: black" name="price" id="price" class="forminput form-control requiredField numberOnly" placeholder=" " autocomplete="off" >
                        <label for="price" class="formlabels form-label">Price</label>
                    </div>
                </div>
                <hr>
                <h4>PRODUCT COMBINATIONS</h4>
                <hr>
                <div class="row pt-3">
                    <div class="col-md-3 f-outline">
                        <select id="category" name="category" class="forminput form-control form-select " style="color: black">
                            <option value="" selected disabled>Select Category</option>
                            @foreach($categories as $category)
                                <option value="{{$category->id}}">{{$category->category}}</option>
                            @endforeach
                        </select>
                        <label for="category" class="formlabels form-label">CATEGORY</label>
                    </div>
                    <div class="col-md-3 f-outline">
                        <select id="short_description" name="short_description" class="forminput form-control form-select" style="color: black" disabled>
                            <option value="" selected disabled>Select Short Description</option>
                        </select>
                        <label for="short_description" class="formlabels form-label">SHORT DESCRIPTION</label>
                    </div>
                    <div class="col-md-2 f-outline">
                        <input type="search" style="color: black" name="item_code" id="item_code" class="forminput spChar form-control" placeholder="AUTOFILL" autocomplete="off" disabled>
                        <label for="item_code" class="formlabels form-label">Item Code</label>
                    </div>
                    <div class="col-md-2 f-outline">
                        <button class="btn btn-custom addPromoCombinationBtn"><i class="fas fa-plus"></i> ADD</button>
                    </div>
                </div>

                <br>
                <div style="overflow-x: scroll;">
                    <table id="promoProductCombination" class="table table-bordered table-striped table-hover align-middle">
                        <thead>
                            <tr style="display: none;" class="bg-default promoProductCombination_thead">
                                <th class="d-none">CATEGORY</th>
                                <th>CATEGORY</th>
                                <th>SHORT DESCRIPTION</th>
                                <th>ITEM CODE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>

                <div style="overflow-x: scroll;">
                    <table id="promoProductCombination_orig" class="table table-bordered table-striped table-hover align-middle promoProductCombination_orig">
                        <thead>
                            <tr class="bg-default promoProductCombination">
                                <th class="d-none">CATEGORY</th>
                                <th>CATEGORY</th>
                                <th>SHORT DESCRIPTION</th>
                                <th>ITEM CODE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody id="promoProductCombination_tbody">
                        </tbody>
                    </table>
                </div>
            </form>
                <hr>
                <div class="col-md form-group">
                    <button class="btn btn-custom cancelBtn float-end" data-bs-dismiss="modal"><i class="fa-solid fa-xmark"></i> CANCEL</button>
                    <button class="btn btn-custom saveBtn btnRequired float-end"><i class="fas fa-save"></i> SAVE</button>
                    <button class="btn btn-custom updateBtn btnRequired float-end"><i class="fas fa-save"></i> UPDATE</button>
                </div>
            </div>
        </div>
    </div>
</div>