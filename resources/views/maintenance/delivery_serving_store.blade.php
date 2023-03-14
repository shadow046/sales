@extends('layouts.app')
@section('content')
<script>accessibility('21');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">DELIVERY CHANNEL MAINTENANCE</span></h4></div>
    </div>
    <div class="col-md form-group">
        @can('create')
            <button class="form-control btn btn-custom addBtn float-end" data="deliveryServingStore"><i class="fas fa-plus"></i> ADD NEW</button>
        @endcan
            <button class="form-control btn btn-custom btnExport float-end"><i class="fas fa-file-export"></i> EXPORT</button>
    </div>
</div>
<div class="table-responsive container-fluid pt-2">
    <table class="table table-striped table-hover table-bordered w-100 align-middle delivery_serving_storeTable" id="delivery_serving_storeTable">
        <thead>
            <tr class="bg-default">
                <th>DELIVERY CHANNEL</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <br>
</div>
<hr>
<input type="hidden" id="delivery_serving_store_id" class="modal_id">
@include('modals.addDeliveryServingStore')
<script src={{asset('js/maintenance/delivery_serving_store.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection