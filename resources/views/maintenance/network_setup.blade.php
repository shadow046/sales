@extends('layouts.app')
@section('content')
<script>accessibility('21');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">STORE NETWORK SETUP MAINTENANCE</span></h4></div>
    </div>
    <div class="col-md form-group">
        @can('create')
            <button class="btn btn-custom addBtn float-end" data="network_setup"><i class="fas fa-plus"></i> ADD NEW</button>
        @endcan
            <button class="btn btn-custom btnExportMaintenance float-end"><i class="fas fa-file-export"></i> EXPORT</button>
    </div>
</div>
<div class="table-responsive container-fluid pt-2">
    <table class="table table-striped table-hover table-bordered w-100 align-middle network_setupTable" id="network_setupTable">
        <thead>
            <tr class="bg-default">
                <th>STORE NETWORK SETUP</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <br>
</div>
<hr>
<input type="hidden" id="network_setup_id" class="modal_id">
@include('modals.addNetworkSetup')
<script src={{asset('js/maintenance/network_setup.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection