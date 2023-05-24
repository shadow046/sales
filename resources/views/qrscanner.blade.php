<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/dd-logo.ico" rel="icon" type="image/x-icon"/>
    <link href="/dd-logo.ico" rel="shortcut icon" type="image/x-icon"/>
    <title>QR Code Generator & Reader</title>
    <!-- CSS only -->
    <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx"
    crossorigin="anonymous"
    />
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
    <link rel="stylesheet" href="css/qr/style.css" />
    <script src="js/script.js" defer></script>
</head>
<body>
    <div class="container pt-5">
        <div class="row my-5">
            <div class="col m-auto">
            <form>
                <div class="input-group d-flex flex-wrap justify-content-center">
                <div class="input-group-text form-control w-100" style="max-width: 250px">
                    <img src="images/qr-code-scan.svg" alt="qr code" id="scanned-image" class="mw-100 w-100"/> 
                    <div id="laser-scan" class="laser-scan card-img-overlay bg-danger"></div>
                </div>
                <input type="file" name="upload" id="upload" class="d-none" multiple accept="image/*"/>
                <label for="upload" type="file" class="info d-flex justify-content-center align-items-center border border-5 border-primary rounded-2 flex-grow-1" multiple accept="image/*">
                    <h2 class="pe-none user-select-none text-center p-2">
                        Drag and drop or upload your file.
                    </h2>
                </label>
                </div>
                <div class="input-group mt-2">
                <label for="result" class="input-group-text text-bg-secondary" >Result</label>
                <input type="text" class="form-control form-control-plaintext ps-2" readonly id="result" value="Upload QR Code to Scan"/>
                <div class="input-group-text btn btn-primary" id="copy">Copy</div>
                </div>
            </form>
            </div>
        </div>
    </div>
</body>
</html>