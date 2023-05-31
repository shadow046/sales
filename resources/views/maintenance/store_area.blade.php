@extends('layouts.app')
@section('content')
<script>accessibility('16');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">STORE AREA MAINTENANCE</span></h4></div>
    </div>
    <div class="col-md form-group">
        @can('create')
            <button class="form-control btn btn-custom addBtn float-end" data="storeArea"><i class="fas fa-plus"></i> ADD NEW</button>
        @endcan
            <button class="form-control btn btn-custom btnExport float-end"><i class="fas fa-file-export"></i> EXPORT</button>
    </div>
</div>
<div class="table-responsive container-fluid pt-2">
    <table class="table table-striped table-hover table-bordered w-100 align-middle storeAreaTable" id="storeAreaTable">
        <thead>
            <tr class="bg-default">
                <th>STORE AREA</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <br>
</div>
<hr>
<input type="hidden" id="store_area_id" class="modal_id">
@include('modals.addStoreArea')
<script src={{asset('js/maintenance/store_area.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection