<link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx"
    crossorigin="anonymous"
/>
<link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx"
    crossorigin="anonymous"
/>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- JavaScript Bundle with Popper -->
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa"
      crossorigin="anonymous"
      defer
    ></script>
    <!-- Qr Code Generator CDN -->
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
      integrity="sha512-CNgIRecGo7nphbeZ04Sc13ka07paqdeTu0WR1IM4kNcpmBAUSHSQX0FslNhTDadL4O5SAGapGt4FodqL8My0mA=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
      defer
    ></script>
    <!-- Font Awesome Library -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"
      integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<div class="modal fade" id="keyModal" tabindex="-1" role="dialog" aria-labelledby="keyModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="keyModalLabel">Verify License</h5>
                <button type="button" style="color:black" class="btn-close close" data-bs-dismiss="modal" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div id="inputDiv" class="input-group d-flex flex-wrap justify-content-center" style="display:none">
                    <center>
                        <textarea name="license_key" id="license_key" rows="3" cols="120" style="width: 100%; max-width: 100%;" placeholder="Please input valid license key."></textarea>
                    </center>
                </div>
                <form id="uploadFrm">
                    <div class="input-group d-flex flex-wrap justify-content-center">
                        <a href="#" class="d-block" onclick="document.getElementById('upload').click(); return false;">
                            <div class="input-group-text form-control w-100 mb-2 p-1" style="max-width: 130px;zoom:150%;height:130px" multiple accept="image/*">
                                <img src="images/qr-code-scan.svg" alt="qr code" id="scanned-image" class="mw-100 w-100"/>
                                <span style="max-height: 1px !important">
                                    <div id="laser-scan" class="laser-scan card-img-overlay bg-danger" ></div>
                                </span>
                            </div>
                        </a>
                    </div>
                    <div class="d-flex flex-wrap justify-content-center" style="cursor: pointer">
                        <input type="file" name="upload" id="upload" class="d-none" multiple accept="image/*"/>
                        <label for="upload" type="file" class="info d-flex justify-content-center align-items-center border border-5 border-primary rounded-2 flex-grow-1" multiple accept="image/*">
                            <h6 class="pe-none user-select-none text-center p-2 mt-2">
                                Drag and drop or upload your QR.
                            </h6>
                        </label>
                    </div>
                    <div hidden>
                        <div class="input-group mt-2">
                        <label for="result" class="input-group-text text-bg-secondary" >Result</label>
                        <input type="text" class="form-control form-control-plaintext ps-2" readonly id="result" value="Upload QR Code to Scan"/>
                        <div class="input-group-text btn btn-primary" id="copy">Copy</div>
                        </div>
                    </div>
                </form>
                <center class="mt-2">
                    <form id="keyForm" style="display:none">
                        <button type="button" id="subBtn" class="btn btn-primary bp ml-3"><b>VERIFY</b></button>
                    </form>
                </center>
            </div>
            <div class="modal-footer" style="display:none">
                <label for="hash" class="mr-auto">License key:</label>
                <textarea class="form-control" rows="3" id="hash" name="hash" readonly></textarea>
            </div>
        </div>
    </div>
</div>