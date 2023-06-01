<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
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
    @include('cdn.head')
    @if(env('APP_SYS') == 'DD')
        <link href="/css/dd-styles.css?ver={{\Illuminate\Support\Str::random(50)}}" rel="stylesheet" type="text/css">
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
        <link href="/css/mg-styles.css?ver={{\Illuminate\Support\Str::random(50)}}" rel="stylesheet" type="text/css">
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
        <link href="/css/switch.css?ver={{\Illuminate\Support\Str::random(50)}}" rel="stylesheet">
    @endif
    @if(Request::is('maintenance-category'))
        <link href="/css/toggle.css?ver={{\Illuminate\Support\Str::random(50)}}" rel="stylesheet">
    @endif
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
        <script src="/js/functions.js?ver={{\Illuminate\Support\Str::random(50)}}"></script>
    @endif
    <main class="container-fluid content">
        @yield('content')
    </main>
    @include('cdn.body')
</body>
</html>