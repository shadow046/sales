@extends('layouts.app')
@section('content')
<script>accessibility('9');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">STORE MAINTENANCE</span><span id="post_title" class="page-reload"></span></h4></div>
    </div>
    <div class="col-md form-group">
        @can('create')
            <button class="form-control btn btn-custom addBtn float-end" data="store" id="addStoreBtn"><i class="fas fa-plus"></i> ADD NEW</button>
        @endcan
        @can('import')
            <button class="form-control btn btn-custom float-end" data-bs-toggle="modal" data-bs-target="#importStore"><i class="fas fa-file-import"></i> IMPORT</button>
        @endcan
            <button class="form-control btn btn-custom btnExport float-end"><i class="fas fa-file-export"></i> EXPORT</button>
    </div>
</div>

<div class="ml-2">
    <a href="#" id="filter" class="text-default" title="Toggle Visible Columns" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-content='@include("inc.columnsStore")'>
        <b class="mr-1">TOGGLE COLUMNS</b>
        <i class="fas fa-filter fa-lg" aria-hidden="true"></i>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </a>
</div>

<div class="table-responsive container-fluid pt-2">
    <table class="table table-hover table-bordered table-striped storeTable" id="storeTable" style="width:100%;">
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
                <td>
                    <input type="search" class="form-control filter-input" data-column="3" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="4" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="5" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="6" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="7" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="8" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="9" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="10" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="11" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="12" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="13" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="14" style="border:1px solid #808080"/>
                </td>
                <td>
                    <select class="form-control filter-select form-select" data-column="16" style="border:1px solid #808080">
                        <option value="" selected></option>
                        <option value="ACTIVE" style="font-weight: bold; color: #2ab934;">ACTIVE</option>
                        <option value="INACTIVE" style="font-weight: bold; color: #ca2222;">INACTIVE</option>
                    </select>
                </td>
                <td></td>
            </tr>
            <tr>
                <th>STORE CODE</th>
                <th>COMPANY NAME</th>
                <th>TIN #</th>
                <th>BRANCH NAME</th>
                <th>STORE AREA</th>
                <th>ADDRESS</th>
                <th>PROVINCE</th>
                <th>CITY/MUNICIPALITY</th>
                <th>REGION</th>
                <th>STORE TYPE</th>
                <th>STORE SETUP</th>
                <th>STORE GROUP</th>
                <th>MALL SUB-GROUP</th>
                <th>STORE NETWORK SETUP</th>
                <th>DELIVERY CHANNEL</th>
                <th>STATUS</th>
                <th>STATUS</th>
            </tr>
        </thead>
    </table>
    <br>
</div>
<hr>
<input type="hidden" name="store_id" id="store_id" class="modal_id">
@include('modals.addStore')
@include('modals.importStore')
@include('modals.editPos')
<script src={{asset('js/maintenance/store.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection