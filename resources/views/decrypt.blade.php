@extends('layouts.app')

@section('content')
    <div class="modal fade" id="keyModal" tabindex="-1" role="dialog" aria-labelledby="keyModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="keyModalLabel">Generate License Key</h5>
                </div>
                <div class="modal-body">
                    <div>
                        <form id="keyForm" action="/gkey" method="GET">
                            <label for="key">Enter Key:</label>
                            <textarea class="form-control" rows="5" id="key" name="key" required></textarea>
                            <br>
                            <label for="expiry_date">Expiry Date:</label>
                            <input type="date" id="expiry_date" name="expiry_date" required>
                            <br><br>
                            <label for="hash">License key</label>
                            <textarea class="form-control" rows="3" id="hash" name="hash" readonly></textarea>
                        </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" form="keyForm" class="btn btn-primary">Generate</button>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        $(document).ready(function() {
            $('#keyModal').modal('show');
            $('#keyForm').on('submit', function(e) {
                e.preventDefault(); // Prevent the form from submitting normally

                // Perform AJAX request
                $.ajax({
                    url: $(this).attr('action'),
                    method: $(this).attr('method'),
                    data: $(this).serialize(),
                    success: function(response) {
                        $('#hash').val(response); // Set the response in the generatedKey textarea
                        var code = document.getElementById("hash");
                        code.select();
                        document.execCommand("copy");
                        setTimeout(() => {
                            alert("Copied to clipboard!");
                        }, 500);
                    },
                    error: function(xhr, status, error) {
                        // Handle any error that occurred during the AJAX request
                        console.error(error);
                    }
                });
            });
        });
    </script>
@endsection
