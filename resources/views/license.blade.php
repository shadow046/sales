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
<body onload="checkTextarea()" style="font-family: Arial, Helvetica, sans-serif">
    <center>
        <img src="{{asset('apsoft.png')}}" style="zoom:50%"><br>
        <b style="font-size: 35px;">HEADQUARTERS CONSOLE SYSTEM</b><b class="ml-1"></b>
        <p style="font-size: 20px">Please e-mail the QR Code together with your Company Name, Full Name and Position to license@apsoft.com.ph.</p>
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
            <div style="position: relative;">
                <center>
                    {{QrCode::size(200)->style('dot', 0.9)->merge(public_path('dd-logo.png'), 0.5, true)->generate($data)}}<br><br>
                    <a href="data:image/png;base64,{{ base64_encode(QrCode::format('png')->size(230)->margin(1)->generate($data)) }}" download="qrcode.png" style="cursor:pointer;"><button type="button">DOWNLOAD</button></a>
                </center>
            </div>
            <br>
            <label for="license_key">Enter License Key:</label>
            <div class="container-fluid row">
            <center><textarea name="license_key" id="license_key" rows="3" cols="120"></textarea><br>
            {{-- <div class="container-fluid row"><center><label for="expiry">Valid until:</label> --}}
            {{-- <input type="date" id="expiry" name="expiry"></center></div> --}}
            <br>
            <button type="submit">Verify License</button>
            </div>
        </form>
    </center>
</body>
</html>
