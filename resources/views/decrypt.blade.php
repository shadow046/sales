@extends('layouts.app')
@section('content')
    <link rel="stylesheet" href="css/qr/style.css" />
    <script src="js/script.js" defer></script>
    <div class="modal fade" id="keyModal" tabindex="-1" role="dialog" aria-labelledby="keyModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="keyModalLabel">Generate License Key</h5>
                </div>
                <div class="modal-body">
                    <div>
                        <form>
                            <div class="input-group d-flex flex-wrap justify-content-center">
                            <div class="input-group-text form-control w-100 m-1 " style="max-width: 100px;zoom:150%;height:100px">
                                <img src="images/qr-code-scan.svg" alt="qr code" id="scanned-image" class="mw-100 w-100"/>
                                <div id="laser-scan" class="laser-scan card-img-overlay bg-danger"></div>
                            </div>
                            <input type="file" name="upload" id="upload" class="d-none" multiple accept="image/*"/>
                            <label for="upload" type="file" class="info d-flex justify-content-center align-items-center border border-5 border-primary rounded-2 flex-grow-1" multiple accept="image/*">
                                <h6 class="pe-none user-select-none text-center p-2 mt-2">
                                    Drag and drop or upload your file.
                                </h6>
                            </label>
                            </div><br>
                            <div hidden>
                                <div class="input-group mt-2">
                                <label for="result" class="input-group-text text-bg-secondary" >Result</label>
                                <input type="text" class="form-control form-control-plaintext ps-2" readonly id="result" value="Upload QR Code to Scan"/>
                                <div class="input-group-text btn btn-primary" id="copy">Copy</div>
                                </div>
                            </div>
                        </form>
                        <center>
                            <form id="keyForm" action="/gkey" method="GET" style="display:none">
                                <input type="text" id="key" name="key" hidden>
                                <label for="expiry_date">Expiry Date:</label>
                                <input type="date" id="expiry_date" name="expiry_date" required>
                                <button type="submit" id="subBtn" form="keyForm" class="btn btn-primary ml-3" disabled>Generate</button>
                            </form>
                        </center>
                    </div>
                </div>
                <div class="modal-footer" style="display:none">
                    <label for="hash" class="mr-auto">License key:</label>
                    <textarea class="form-control" rows="3" id="hash" name="hash" readonly></textarea>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/jsqr/dist/jsQR.js"></script>

    <script>
        $(document).on('change', '#expiry_date', (e) => {
            $('#subBtn').prop('disabled', false);
        });

        $(document).ready(function() {
            $('#keyModal').modal('show');
            $('#keyForm').on('submit', function(e) {
                $('#subBtn').prop('disabled', true);
                $('#expiry_date').prop('disabled', true);
                $('#upload').prop('disabled', true);
                e.preventDefault(); // Prevent the form from submitting normally
                fetchRequest(formData).then(() => {
                    // Perform AJAX request
                    $.ajax({
                        url: $(this).attr('action'),
                        method: $(this).attr('method'),
                        data: $(this).serialize(),
                        success: function(response) {
                            if (response == "Invalid QR" || response == "Incorrect Code") {
                                alert(response);
                            }
                            else{
                                $('#hash').val(response); // Set the response in the generatedKey textarea
                                $('.modal-footer').show();
                                var code = document.getElementById("hash");
                                code.select();
                                document.execCommand("copy");
                                setTimeout(() => {
                                    alert("Copied to clipboard!");
                                }, 500);
                            }
                        },
                        error: function(xhr, status, error) {
                            // Handle any error that occurred during the AJAX request
                            console.error(error);
                        }
                    });
                    $('#subBtn').prop('disabled', false);
                    $('#expiry_date').prop('disabled', false);
                    $('#upload').prop('disabled', false);
                })
                .catch((error) => {
                    // Handle the error from fetchRequest
                    console.error(error);
                });
            });
            
        });
    </script>
@endsection
