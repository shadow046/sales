@extends('layouts.app')
@section('content')
<script>accessibility('13');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">POS MAINTENANCE</span></h4></div>
    </div>
    <div class="col-md form-group">
        @can('create')
            <button class="form-control btn btn-custom addBtn float-end" data="pos"><i class="fas fa-plus"></i> ADD NEW</button>
        @endcan
            <button class="form-control btn btn-custom btnExport float-end"><i class="fas fa-file-export"></i> EXPORT</button>
    </div>
</div>
<div class="table-responsive container-fluid pt-2">
    <table class="table table-hover table-bordered posTable" id="posTable" style="width:100%;">
        <thead style="font-weight:bolder" class="bg-default">
            <tr>
                <td>
                    <input type="search" class="form-control filter-input" data-column="0" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="1" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="2" style="border:1px solid #808080"/>
                </td>
            </tr>
            <tr>
                <th>MODEL</th>
                <th>BRAND</th>
                <th>VENDOR</th>
            </tr>
        </thead>
    </table>
    <br>
</div>
<hr>
<input type="hidden" name="pos_id" id="pos_id" class="modal_id">
@include('modals.addPos')
<script src={{asset('js/maintenance/pos.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection