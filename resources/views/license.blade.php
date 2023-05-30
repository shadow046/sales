<!-- resources/views/license.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>License Page</title>
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
    <style>
        textarea {
            height: auto;
            resize: none;
            overflow-y: scroll;
            position: relative;
            padding-right: 10px; /* Add space for the button */
        }
    </style>
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
        <div class="bg-pink" style="height: 15px;"></div>
        <div class="bg-default py-2">
            <b style="font-size: 35px;">HEADQUARTERS CONSOLE SYSTEM</b><b class="ml-1"></b>
        </div>
        <p class="bg-orange py-1" style="font-size: 20px">Please e-mail the QR Code together with your Company Name, Full Name and Position to license@apsoft.com.ph.</p>
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
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jsqr/dist/jsQR.js"></script>
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
                        console.error(error);
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
