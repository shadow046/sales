@extends('layouts.app')
@section('content')
<script>accessibility('12');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">PRICE UPDATE</span></h4></div>
    </div>
    <div class="col-md form-group">
        @can('create')
            <button class="form-control btn btn-custom addBtn float-end" data="priceUpdate"><i class="fas fa-plus"></i> ADD NEW</button>
        @endcan
        @role('ADMIN')
            <button class="form-control btn btn-custom btnSendUpdate float-end" style="width: auto;"><i class="fa-solid fa-upload"></i> SEND UPDATE</button>
        @endrole
    </div>
</div>
<div class="table-responsive container-fluid pt-2">
    <table class="table table-striped table-hover table-bordered w-100 align-middle priceUpdateTable" id="priceUpdateTable">
        <thead style="font-weight:bolder" class="bg-default">
            <tr>
                <th class="always-default">
                    <input type="search" class="form-control filter-input" data-column="0" style="border:1px solid #850708"/>
                    PRODUCT CODE
                </th>
                <th class="always-default">
                    <input type="search" class="form-control filter-input" data-column="1" style="border:1px solid #850708"/>
                    DESCRIPTION
                </th>
                <th class="always-default">
                    <input type="search" class="form-control filter-input" data-column="2" style="border:1px solid #850708"/>
                    EFFECTIVITY DATE
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="3" style="border:1px solid #850708"/>
                    DINE IN
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="4" style="border:1px solid #850708"/>
                    TAKE-OUT PRICE
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="5" style="border:1px solid #850708"/>
                    PICK-UP PRICE
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="6" style="border:1px solid #850708"/>
                    DELIVERY PRICE
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="7" style="border:1px solid #850708"/>
                    BULK ORDER
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="8" style="border:1px solid #850708"/>
                    FDS PRICE
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="9" style="border:1px solid #850708"/>
                    DRIVE-THRU
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="10" style="border:1px solid #850708"/>
                    ADD. MEAL TYPE
                </th>
                <th>
                    <center><i class="fa-solid fa-triangle-exclamation fa-2x"></i></center><br>
                    DELETE
                </th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <br>
</div>
<hr>
<input type="hidden" id="category_id" class="modal_id">
@include('modals.addPriceUpdate')
<script src={{asset('js/maintenance/price_update.js?ver=')}}{{$random}}></script>
@endsection