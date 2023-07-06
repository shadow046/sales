@extends('layouts.app')
@section('content')
<script>accessibility('14');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">PRODUCT CATEGORY MAINTENANCE</span></h4></div>
    </div>
    <div class="col-md form-group">
        @can('create')
            <button class="btn btn-custom addBtn float-end" data="category"><i class="fas fa-plus"></i> ADD NEW</button>
        @endcan
            <button class="btn btn-custom btnExportMaintenance float-end"><i class="fas fa-file-export"></i> EXPORT</button>
    </div>
</div>
<div class="table-responsive container-fluid pt-2">
    <table class="table table-striped table-hover table-bordered w-100 align-middle categoryTable" id="categoryTable">
        <thead>
            <tr class="bg-default">
                <th>PRODUCT CATEGORIES</th>
                <th style="width: 120px;">COMBO ON/OFF</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <br>
</div>
<hr>
<input type="hidden" id="category_id" class="modal_id">
@include('modals.addCategory')
<script src={{asset('js/maintenance/category.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection