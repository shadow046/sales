<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @php //Version Control
        $version = \Illuminate\Support\Str::random(50);
        $sweetalert_version = '@11.7.3';
        $bootstrap_version = '@5.2.3';
        $datatables_version = '1.13.4';
        $jquery_version = '3.6.4';
        $jquery_ui_version = '1.13.2';
    @endphp
    <title>@if(Request::is('sales/*')) SALES PERFORMANCE @else {{ config('app.name', 'Laravel') }} @endif
    </title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @if(env('APP_SYS') == 'DD')
        <link href="/dd-logo.ico" rel="icon" type="image/x-icon"/>
        <link href="/dd-logo.ico" rel="shortcut icon" type="image/x-icon"/>
    @else
        <link href="/mg-logo.ico" rel="icon" type="image/x-icon"/>
        <link href="/mg-logo.ico" rel="shortcut icon" type="image/x-icon"/>
    @endif
    <link href="https://fonts.gstatic.com/" rel="preconnect" crossorigin>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/{{$jquery_version}}/jquery.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap{{$bootstrap_version}}/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/{{$datatables_version}}/css/jquery.dataTables.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/buttons/2.2.3/css/buttons.dataTables.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" rel="stylesheet" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2{{$sweetalert_version}}/dist/sweetalert2.min.css" rel='stylesheet'>
    <link href="https://unpkg.com/multiple-select@1.5.2/dist/multiple-select.min.css" rel="stylesheet">
    <link href="https://code.jquery.com/ui/{{$jquery_ui_version}}/themes/base/jquery-ui.css" rel="stylesheet">
    <link href="/css/inc/chosen.css" rel="stylesheet" type="text/css"/>

    @if(env('APP_SYS') == 'DD')
        <link href="/css/dd-styles.css?ver={{$version}}" rel="stylesheet" type="text/css">
        <script>
            const brown = '#683817';
            const orange = '#f5821f';
            const pink = '#e11383';
        </script>
        @php
            $brown = '#683817';
            $orange = '#f5821f';
            $pink = '#e11383';
        @endphp
    @else
        <link href="/css/mg-styles.css?ver={{$version}}" rel="stylesheet" type="text/css">
        <script>
            const brown = '#850708'; //Maroon
            const orange = '#fbb12d'; //Gold
            const pink = '#850708'; //Maroon
        </script>
        @php
            $brown = '#850708'; //Maroon
            $orange = '#fbb12d'; //Gold
            $pink = '#850708'; //Maroon
        @endphp
    @endif
    @if(Request::is('products') || Request::is('store') || Request::is('company') || Request::is('users'))
        <link href="/css/switch.css?ver={{$version}}" rel="stylesheet">
    @endif
    @if(Request::is('maintenance-category'))
        <link href="/css/toggle.css?ver={{$version}}" rel="stylesheet">
    @endif
    <script src="https://unpkg.com/multiple-select@1.5.2/dist/multiple-select.min.js"></script>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
</head>
<body>
    <div id="loading">
        <strong style="font-size: 40px;">PLEASE WAIT...</strong><br>
        <div style="zoom: 400%;" class="spinner-border"></div><br>
        <strong style="font-size: 25px;">
            <i class='fa fa-exclamation-triangle'></i>
            Please DO NOT interrupt or cancel this process.
        </strong>
    </div>
    @if(Auth::guest())
        @include('inc.guest')
    @else
        @if(auth()->user()->userlevel == '3' || Request::is('sales/*')) {{-- ROLES PENDING --}}
            @include('inc.sidebar')
        @endif
        @if(Request::is('products') || Request::is('store') || Request::is('company') || Request::is('promos') || Request::is('users') || Request::is('maintenance-*'))
            <script>$('#loading').show();</script>
        @endif
        @include('inc.navbar')
        @include('inc.include')
    @endif
    @if(!Auth::guest())
        <script src="/js/functions.js?ver={{$version}}"></script>
    @endif
    <script src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js" type="text/javascript"></script>

    <main class="container-fluid content">
        @yield('content')
    </main>
    <script src="//cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.js" type="text/javascript"></script>
    <link href="//cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.css" rel="stylesheet" type="text/css"/>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-Fy6S3B9q64WdZWQUiU+q4/2Lc9npb8tCaSX9FK7E8HnRr0Jz8D6OP9dO5Vg3Q9ct" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap{{$bootstrap_version}}/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.datatables.net/{{$datatables_version}}/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/fixedcolumns/4.2.2/js/dataTables.fixedColumns.min.js"></script>

    <script src="https://cdn.datatables.net/buttons/2.3.6/js/dataTables.buttons.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.3.6/js/buttons.html5.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.1/html2pdf.bundle.min.js" integrity="sha512-vDKWohFHe2vkVWXHp3tKvIxxXg0pJxeid5eo+UjdjME3DBFBn2F8yWOE0XmiFcFbXxrEOR1JriWEno5Ckpn15A==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2{{$sweetalert_version}}/dist/sweetalert2.all.min.js"></script>
    <script src="https://code.jquery.com/ui/{{$jquery_ui_version}}/jquery-ui.min.js"></script>
    <script src="/js/inc/chosen.jquery.js"></script>
    <script src="/js/inc/moment.js"></script>
    <script src="/js/inc/datetime.js"></script>
    <script src="/js/sales/function.js?ver={{\Illuminate\Support\Str::random(50)}}"></script>
</body>
</html>
