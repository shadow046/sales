@extends('layouts.app')
@section('content')
<!-- Modal -->
<div class="modal fade" id="keyModal" tabindex="-1" role="dialog" aria-labelledby="keyModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="keyModalLabel">Generate Key</h5>
            </div>
            <div class="modal-body">
                <form id="keyForm" action="{{ route('generateKey') }}" method="POST">
                    @csrf
                    <div class="form-group">
                        <label for="inputKey">Current Admin count:</label>
                        <input type="number" class="form-control" id="inputKey" name="admin">
                    </div>
                    <div class="form-group">
                        <label for="generatedKey">Generated Key:</label>
                        <textarea class="form-control" rows="5" id="generatedKey" readonly></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="submit" form="keyForm" class="btn btn-primary">Generate</button>
            </div>
        </div>
    </div>
</div>


<!-- JavaScript -->
<script>
    $(document).ready(function() {
        $('#keyForm').on('submit', function(e) {
            e.preventDefault(); // Prevent the form from submitting normally

            // Perform AJAX request
            $.ajax({
                url: $(this).attr('action'),
                method: $(this).attr('method'),
                data: $(this).serialize(),
                success: function(response) {
                    $('#generatedKey').val(response); // Set the response in the generatedKey textarea
                    var code = document.getElementById("generatedKey");
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
        $('#keyModal').modal('show');
    });
</script>

@endsection