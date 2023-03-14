@extends('layouts.app')
@section('content')
<br><br>
<div class="row" style="text-align: center; height: 200px;">
    <div class="col-2"></div>
    <div class="col">
        <a class="dashhover" href="/products" style="text-decoration: none;">
            <img class="dashicon" style="height: 100px;" src="{{ asset('/inc/Product-Icon.png') }}">
            <div class="dashbox container mt-1 bg-default" style="z-index: 100; margin-bottom: 5px; line-height: 48px; height: 48px; width: 150px; text-align: center; font-size: 26px; border-radius: 30px;">
                {{number_format($products)}}
            </div>
            <b class="dashlabel text-default" style="font-size: 20px; padding-top: 10px;">PRODUCTS</b>
        </a>
    </div>
    <div class="col">
        <a class="dashhover" href="/store?type=coowned" style="text-decoration: none;">
            <img class="dashicon" style="height: 100px;" src="{{ asset('/inc/Owned-Icon.png') }}">
            <div class="dashbox container mt-1 bg-default" style="z-index: 100; margin-bottom: 5px; line-height: 48px; height: 48px; width: 150px; text-align: center; font-size: 26px; border-radius: 30px;">
                {{number_format($coowned)}}
            </div>
            <b class="dashlabel text-default" style="font-size: 20px; padding-top: 10px;">CO-OWNED</b>
        </a>
    </div>
    <div class="col">
        <a class="dashhover" href="/store?type=franchise" style="text-decoration: none;">
            <img class="dashicon" style="height: 100px;" src="{{ asset('/inc/Franchise-Icon.png') }}">
            <div class="dashbox container mt-1 bg-default" style="z-index: 100; margin-bottom: 5px; line-height: 48px; height: 48px; width: 150px; text-align: center; font-size: 26px; border-radius: 30px;">
                {{number_format($franchise)}}
            </div>
            <b class="dashlabel text-default" style="font-size: 20px; padding-top: 10px;">FRANCHISE</b>
        </a>
    </div>
    <div class="col-2"></div>
</div>
<br><br>
<div class="row" style="text-align: center; height: 200px;">
    <div class="col-2"></div>
    <div class="col">
        <a class="dashhover" href="/store?setup=full_store" style="text-decoration: none;">
            <img class="dashicon" style="height: 100px;" src="{{ asset('/inc/Store-Icon.png') }}">
            <div class="dashbox container mt-1 bg-default" style="z-index: 100; margin-bottom: 5px; line-height: 48px; height: 48px; width: 150px; text-align: center; font-size: 26px; border-radius: 30px;">
                {{number_format($fullstores)}}
            </div>
            <b class="dashlabel text-default" style="font-size: 20px; padding-top: 10px;">FULL STORES</b>
        </a>
    </div>
    <div class="col">
        <a class="dashhover" href="/store?setup=drive_thru" style="text-decoration: none;">
            <img class="dashicon" style="height: 100px;" src="{{ asset('/inc/Drive-Thru-Icon.png') }}">
            <div class="dashbox container mt-1 bg-default" style="z-index: 100; margin-bottom: 5px; line-height: 48px; height: 48px; width: 150px; text-align: center; font-size: 26px; border-radius: 30px;">
                {{number_format($drivethru)}}
            </div>
            <b class="dashlabel text-default" style="font-size: 20px; padding-top: 10px;">DRIVE-THRU</b>
        </a>
    </div>
    <div class="col">
        <a class="dashhover" href="/store?setup=kiosks" style="text-decoration: none;">
            <img class="dashicon" style="height: 100px;" src="{{ asset('/inc/Kiosk-Icon.png') }}">
            <div class="dashbox container mt-1 bg-default" style="z-index: 100; margin-bottom: 5px; line-height: 48px; height: 48px; width: 150px; text-align: center; font-size: 26px; border-radius: 30px;">
                {{number_format($kiosks)}}
            </div>
            <b class="dashlabel text-default" style="font-size: 20px; padding-top: 10px;">KIOSKS</b>
        </a>
    </div>
    <div class="col-2"></div>
</div>
<script>
$('.dashhover').hover(
    function(){
        $(this).children('.dashicon').css({"zoom": "110%"});
        $(this).children('.dashbox').css({"zoom": "82%", "background-color": pink+" !important"});
        $(this).children('.dashlabel').css({"color": pink+" !important"});
    },
    function(){
        $(this).children('.dashicon').css({"zoom": "100%"});
        $(this).children('.dashbox').css({"zoom": "100%", "background-color": brown+" !important"});
        $(this).children('.dashlabel').css({"color": brown+" !important"});
    }
);
</script>
@endsection