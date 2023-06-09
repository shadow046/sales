@extends('layouts.app')
@section('content')
<script>accessibility('10');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">COMPANY MAINTENANCE</span></h4></div>
    </div>
    <div class="col-md form-group">
        @can('create')
            <button class="btn btn-custom addBtn float-end" data="company"><i class="fas fa-plus"></i> ADD NEW</button>
        @endcan
        @can('import')
            <button class="btn btn-custom float-end" data-bs-toggle="modal" data-bs-target="#importCompany"><i class="fas fa-file-import"></i> IMPORT</button>
        @endcan
        <button class="btn btn-custom btnExport float-end"><i class="fas fa-file-export"></i> EXPORT</button>
    </div>
</div>

<div class="ml-2">
    <a href="#" id="filter" class="text-default" title="Toggle Visible Columns" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-content='@include("inc.columnsCompany")'>
        <b class="mr-1">TOGGLE COLUMNS</b>
        <i class="fas fa-filter fa-lg" aria-hidden="true"></i>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </a>
</div>

<div class="table-responsive container-fluid pt-2">
    <table class="table table-hover table-bordered table-striped companyTable" id="companyTable" style="width:100%;">
        <thead style="font-weight:bolder" class="bg-default">
            <tr>
                <th class="always-default">
                    <input type="search" class="form-control filter-input" data-column="0" style="border:1px solid #808080"/><br>
                    COMPANY CODE
                </th>
                <th class="always-default">
                    <input type="search" class="form-control filter-input" data-column="1" style="border:1px solid #808080"/><br>
                    COMPANY NAME
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="2" style="border:1px solid #808080"/><br>
                    TRADE NAME
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="3" style="border:1px solid #808080"/><br>
                    TIN #
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="4" style="border:1px solid #808080"/><br>
                    ADDRESS
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="5" style="border:1px solid #808080"/><br>
                    PROVINCE
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="6" style="border:1px solid #808080"/><br>
                    CITY/MUNICIPALITY
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="7" style="border:1px solid #808080"/><br>
                    REGION
                </th>
                <th>
                    <select class="form-control filter-select form-select" data-column="9" style="border:1px solid #808080">
                        <option value="" selected></option>
                        <option value="ACTIVE" style="font-weight: bold; color: #2ab934;">ACTIVE</option>
                        <option value="INACTIVE" style="font-weight: bold; color: #ca2222;">INACTIVE</option>
                    </select><br>
                    STATUS
                </th>
                <th>
                    STATUS
                </th>
            </tr>
        </thead>
    </table>
    <br>
</div>
<hr>
<input type="hidden" name="company_id" id="company_id" class="modal_id">
@include('modals.addCompany')
@include('modals.importCompany')
<script src={{asset('js/maintenance/company.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection