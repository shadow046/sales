<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @php //Version Control
        $version = \Illuminate\Support\Str::random(50);
        $sweetalert_version = '@11.7.5';
        $bootstrap_version = '@5.2.3';
        $datatables_version = '1.13.4';
        $jquery_version = '3.7.0';
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
    <script src="/js/inc/jquery.min.js"></script>
    <link rel="stylesheet" href="/css/inc/bootstrap4.min.css">
    <link rel="stylesheet" href="/css/inc/bootstrap5.min.css">
    <link rel="stylesheet" href="/css/inc/bootstrap-icons.css">
    <link rel="stylesheet" href="/css/inc/jquery.dataTables.min.css">
    <link rel="stylesheet" href="/css/inc/buttons.dataTables.min.css">
    <link href="/fontawesome-free-6.2.0-web/css/all.min.css" rel="stylesheet" type="text/css"/>
    <link href="/font-awesome-4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" href="/css/inc/sweetalert2.min.css">
    <link rel="stylesheet" href="/css/inc/multiple-select.min.css">
    <link rel="stylesheet" href="/css/inc/jquery-ui.css">
    <link rel="stylesheet" href="/css/inc/daterangepicker.css">
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
    <script src="/js/inc/multiple-select.min.js"></script>
    <script src="/js/inc/loader.js"></script>
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
    <script src="/js/inc/moment.min.js"></script>
    <main class="container-fluid content">
        @yield('content')
    </main>
    <script src="/js/inc/daterangepicker.js"></script>
    <script src="/js/inc/bootstrap4.bundle.min.js"></script>
    <script src="/js/inc/bootstrap5.bundle.min.js"></script>
    <script src="/js/inc/jquery.dataTables.min.js"></script>
    <script src="/js/inc/dataTables.fixedColumns.min.js"></script>
    <script src="/js/inc/dataTables.buttons.min.js"></script>
    <script src="/js/inc/pdfmake.min.js"></script>
    <script src="/js/inc/vfs_fonts.js"></script>
    <script src="/js/inc/buttons.html5.min.js"></script>
    <script src="/js/inc/jszip.min.js"></script>
    <script src="/js/inc/html2pdf.bundle.min.js"></script>
    <script src="/js/inc/sweetalert2.all.min.js"></script>
    <script src="/js/inc/jquery-ui.min.js"></script>
    <script src="/js/inc/chosen.jquery.js"></script>
    <script src="/js/inc/moment.js"></script>
    <script src="/js/inc/datetime.js"></script>
    <script src="/js/sales/function.js?ver={{\Illuminate\Support\Str::random(50)}}"></script>
</body>
</html>
