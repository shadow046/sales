<div id="productsModal" class="modal fade">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
            <div class="modal-header bg-default">
                <h5 class="modal-title w-100 text-center">PRODUCT MAINTENANCE</h5>
                <button type="button" class="btn-close btn-close-white close btnClose" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="productsForm">
                    <input type="hidden" id="product_id" class="modal_id">
                    <ul class="nav nav-tabs" style="border: none;" role="tablist">
                        <li class="nav-item"style="margin-right:5px" >
                            <a class="nav-link pill bg-sub tab1 active" style="text-decoration: none; color: white;" id="tab1" data-bs-toggle="tab" href="#page1"> PAGE 1</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link pill bg-sub-light tab2" style="text-decoration: none; color: white;" id="tab2" data-bs-toggle="tab" href="#page2"> PAGE 2</a>
                        </li>
                        @can('toggle')
                            <span id="status" style="margin-left: 5px;"></span>
                        @endcan
                    </ul>
                    <div id="tabContent" class="tab-content">
                        @include('modals.addProductsTab1')
                        @include('modals.addProductsTab2')
                        <br>
                    </div>
                </form>
            </div>
            <hr>
            <div class="col-md form-group">
                <button class="btn btn-custom cancelBtn float-end" data-bs-dismiss="modal"><i class="fa-solid fa-xmark"></i> CANCEL</button>
                <button class="btn btn-custom saveBtn btnRequired float-end notUpdate" style="display: none;" btntype='SAVE'><i class="fas fa-save"></i> SAVE</button>
                <button class="btn btn-custom btnNextPage btnRequired float-end">NEXT PAGE <i class="fa-solid fa-arrow-right"></i></button>
                <button class="btn btn-custom btnPrevPage float-end" style="display: none;"><i class="fa-solid fa-arrow-left"></i> PREV PAGE</button>
            </div>
        </div>
    </div>
</div>