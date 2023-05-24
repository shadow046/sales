<!-- resources/views/license.blade.php -->

<!DOCTYPE html>
<html>
<head>
    <title>License Page</title>
    <style>
        textarea {
            height: auto;
            resize: none;
            overflow-y: scroll;
            position: relative;
            padding-right: 10px; /* Add space for the button */
        }
    </style>
    <script>
        function copyToClipboard() {
            var code = document.getElementById("code");
            code.select();
            document.execCommand("copy");
            alert("Copied to clipboard!");
        }
        function checkTextarea() {
            var textarea = document.getElementById("code");
            if (textarea.value === '') {
                window.location.href = '/';
            }
        }
    </script>
</head>
<body onload="checkTextarea()">
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li style="color:red">{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
    @if (session('message'))
        <div class="alert alert-danger">
            <ul>
                <li style="color:red">{{ session('message') }}</li>
            </ul>
        </div>
    @endif
    
    <form method="POST" action="{{ route('verify-license') }}">
        @csrf
        <br>
        <p for="code">Please copy the codes below and send via email to request for the license key.</p>
        <div style="position: relative;">
            <center>
                {{QrCode::size(230)->generate($data);}}
                <textarea name="code" id="code" rows="15" cols="120">{{ $data }}</textarea><br>
                <button class="copy-button" type="button" onclick="copyToClipboard()">Copy</button></center>
        </div>
        <br>
        
        <label for="license_key">Enter License Key:</label>
        <div class="container-fluid row">
        <center><textarea name="license_key" id="license_key" rows="3" cols="120"></textarea><br><br>
        <div class="container-fluid row"><center><label for="expiry">Valid until:</label>
        <input type="date" id="expiry" name="expiry"></center></div>
        <br>
        <button type="submit">Verify License</button>
        </div>
    </form>
</body>
</html>
