<div class="modal fade in" id="importProducts">
    <div class="modal-dialog modal-m modal-dialog-centered">
        <div class="modal-content card">
            <div class="modal-header bg-default text-center" style="border-radius: 0px;">
                <h5 class="modal-title w-100">ADD PRODUCTS VIA IMPORT FILE</h5>
                <button type="button" class="btn-close btn-close-white close" data-bs-dismiss="modal" data-dismiss="modal"></button>
            </div>
            <div class="modal-body" style="background-color: white; color: black;">
                <form id="formUpload" action="/products/import" method="post" enctype="multipart/form-data">
                    @csrf
                    <div class="row no-margin">
                        <div class="col-md-12 form-group">
                            <input type="file" id="xlsx" name="xlsx" class="form-control requiredField" accept=".xls,.xlsx" onchange="validate_xlsx(this);" required/>
                        </div>
                        <span style="color: Red; font-size: 14px;">Please upload an EXCEL (.xls/.xlsx) file with less than 10MB.</span>
                    </div>
                    <br>
                    <button type="reset" id="btnDetach" class="btn btn-primary bp">RESET</button>
                    <button type="button" id="btnUpload" class="btn btn-primary bp float-end">UPLOAD</button>
                    <a href="/templates/import_product_23032801.xlsx" class="btn btn-primary bp float-end mr-1">DOWNLOAD TEMPLATE</a>
                    <input type="submit" id="btnSubmit" class="btn btn-primary bp float-end d-none"/>
                </form>
            </div>
        </div>
    </div>
</div>