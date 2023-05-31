@extends('layouts.app')
@section('content')
<script>accessibility('19');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">STORE GROUP MAINTENANCE</span></h4></div>
    </div>
    <div class="col-md form-group">
        @can('create')
            <button class="form-control btn btn-custom addBtn float-end" data="group"><i class="fas fa-plus"></i> ADD NEW</button>
        @endcan
            <button class="form-control btn btn-custom btnExport float-end"><i class="fas fa-file-export"></i> EXPORT</button>
    </div>
</div>
<div class="table-responsive container-fluid pt-2">
    <table class="table table-striped table-hover table-bordered w-100 align-middle groupTable" id="groupTable">
        <thead>
            <tr class="bg-default">
                <th>STORE GROUP</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <br>
</div>
<hr>
<input type="hidden" id="group_id" class="modal_id">
@include('modals.addGroup')
<script src={{asset('js/maintenance/group.js?ver=')}}{{$random}}></script>
@endsection