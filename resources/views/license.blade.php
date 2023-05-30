<!-- resources/views/license.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>License Page</title>
    <link rel="stylesheet" href="/css/license/bootstrap.min.css">
    <style>
        textarea {
            height: auto;
            resize: none;
            overflow-y: scroll;
            position: relative;
            padding-right: 10px;
        }
    </style>
    <script src="/js/license/jquery-3.6.0.min.js"></script>
    <!-- JavaScript Bundle with Popper -->
    <script src="/js/license/bootstrap.bundle.min.js"></script>
    <!-- Qr Code Generator CDN -->
    <script src="/js/license/qrcode.min.js"></script>
    <!-- Font Awesome Library -->
    <link href="/fontawesome-free-6.1.2-web/css/all.min.css" rel="stylesheet" type="text/css"/>
    <script src="/js/license/sweetalert2@11.js"></script>
    <link rel="stylesheet" href="css/qr/style.css" />
    @if(env('APP_SYS') == 'DD')
        <link href="/css/dd-styles.css" rel="stylesheet" type="text/css">
    @else
        <link href="/css/mg-styles.css" rel="stylesheet" type="text/css">
    @endif
    <script src="/js/script.js" defer></script>
</head>
<body style="font-family: Arial, Helvetica, sans-serif">
    <center>
        <a href="/license">
            <div>
                <img src="{{asset('apsoft.png')}}" style="zoom:50%"><br>
            </div>
        </a>
        <div class="bg-sublight" style="height: 15px;"></div>
        <div class="bg-default py-2">
            <b style="font-size: 35px;">HEADQUARTERS CONSOLE SYSTEM</b><b class="ml-1"></b>
        </div>
        <p class="bg-orange py-1" style="font-size: 20px">Please e-mail the QR Code together with your Company Name, Full Name and Position to license@apsoft.com.ph.</p>
        @if ($errors->any())
            <div class="alert alert-danger">
                @foreach ($errors->all() as $error)
                    {{ $error }}
                @endforeach
            </div>
        @endif
        @if (session('message'))
            <div class="alert alert-danger">
                {{ session('message') }}
            </div>
        @endif
        <form method="POST" action="{{ route('verify-license') }}">
            @csrf
            <div style="position: relative;">
                <center>
                    <select id="select" name="select" class="form-control form-select defaultInput" style="width: 300px; color: black;">
                        <option value="" selected disabled>SELECT VERIFICATION METHOD</option>
                        <option value="upload">UPLOAD LICENSE QR</option>
                        <option value="input">INPUT LICENSE KEY</option>
                    </select><br>
                    <div class="card" style="width: 300px;">
                        <div class="card-body pt-4">
                            {{-- <button type="button" id="verifyBtn" style="display:none">Verify License</button><br><br> --}}
                            {{QrCode::size(200)
                                ->style('dot', 0.9)
                                ->generate($data)}}<br><br>
                            <a href="data:image/png;base64,{{ base64_encode(QrCode::format('png')->size(230)->margin(1)->generate($data)) }}" download="qrcode.png" style="cursor:pointer;"><button type="button" class="btn btn-primary bp"><b>DOWNLOAD QR CODE</b></button></a>
                        </div>
                    </div>
                </center>
            </div>
            {{-- <div class="container-fluid" style="display:none">
                <center><textarea name="license_key" id="license_key" rows="3" cols="120"></textarea></center>
            </div> --}}
        </form>
    </center>
    @include('modals.qr')
    <script src="/js/license/axios.min.js"></script>
    <script src="/js/license/jsQR.js"></script>
    <script>
        $(document).on('click', '#verifyBtn', (e) => {
            $('#keyModal').modal('show');
        });

        $(document).on('change', '#select', function () {
            if ($(this).val() == 'input') {
                $('#license_key').show();
                $('#uploadFrm').hide();
                $('#keyForm').show();
            }
            else{
                $('#license_key').hide();
                $('#uploadFrm').show();
                $('#keyForm').hide();
            }
            $('#keyModal').modal('show');
        });

        $(document).ready(function() {
            $('#keyForm').on('click', () => {
                $('#subBtn').prop('disabled', true);
                $('#upload').prop('disabled', true);
                if (!$('#license_key').is(':visible')) {
                    fetchRequest(formData).then(() => {
                        $('#subBtn').prop('disabled', false);
                        $('#upload').prop('disabled', false);
                        if ($('#license_key').val() == "false") {
                            Swal.fire({
                                title: 'Invalid QR',
                                icon: "error"
                            });
                        }
                        $.ajax({
                            url:'/license/verify',
                            type:"GET",
                            data:{
                                license_key: $('#license_key').val()
                            },
                            success:function(data){
                                if (data == 'Invalid QR') {
                                    Swal.fire({
                                        title: data,
                                        icon: "error"
                                    });
                                    return false;
                                }else if (data == 'Invalid license key') {
                                    Swal.fire({
                                        title: data,
                                        icon: "error"
                                    });
                                    return false;
                                }
                                window.location.href = "/"
                            }
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: 'Invalid QR',
                            icon: "error"
                        });
                    });
                }
                else{
                    $.ajax({
                        url:'/license/verify',
                        type:"GET",
                        data:{
                            license_key: $('#license_key').val()
                        },
                        success:function(data){
                            $('#subBtn').prop('disabled', false);
                            $('#upload').prop('disabled', false);
                            if (data == 'Invalid QR') {
                                Swal.fire({
                                    title: 'Invalid license key',
                                    icon: "error"
                                });
                                return false;
                            }else if (data == 'Invalid license key') {
                                Swal.fire({
                                    title: 'Invalid license key',
                                    icon: "error"
                                });
                                return false;
                            }
                            window.location.href = "/"
                        }
                    });
                }
            });
        });
    </script>

</body>
</html>
