@extends('layouts.app')
@section('content')
<script>accessibility('15');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">PRODUCT SALES TYPE MAINTENANCE</span></h4></div>
    </div>
    <div class="col-md form-group">
        @can('create')
            <button class="btn btn-custom addBtn float-end" data="salesType"><i class="fas fa-plus"></i> ADD NEW</button>
        @endcan
            <button class="btn btn-custom btnExportMaintenance float-end"><i class="fas fa-file-export"></i> EXPORT</button>
    </div>
</div>
<div class="table-responsive container-fluid pt-2">
    <table class="table table-striped table-hover table-bordered w-100 align-middle sales_typeTable" id="sales_typeTable">
        <thead>
            <tr class="bg-default">
                <th>PRODUCT SALES TYPE</th>
            </tr>
        </thead>
        <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
    </table>
    <br>
</div>
<hr>
<input type="hidden" id="sales_type_id" class="modal_id">
@include('modals.addSalesType')
<script src={{asset('js/maintenance/sales_type.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection