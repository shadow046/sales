@extends('layouts.app')
@section('content')
<script>accessibility('25');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">USER ACCOUNTS</span></h4></div>
    </div>
    <div class="col-md form-group">
        <button class="form-control btn btn-custom addBtn float-end" id="btnAddUser" style="float: left;"><i class="fas fa-plus"></i> ADD NEW</button>
    </div>
</div>
<div class="table-responsive container-fluid pt-2">
    <table id="userTable" class="table userTable table-bordered table-striped table-hover display" style="cursor: pointer; width: 100%;">
        <thead style="font-weight:bolder" class="bg-default">
            <tr class="tbsearch">
                <td>
                    <input type="search" class="form-control filter-input" data-column="0" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="1" style="border:1px solid #808080"/>
                </td>
                <td>
                    <select class="form-control filter-select form-select" data-column="2" style="border:1px solid #808080">
                        <option value="" selected></option>
                        @foreach($role as $roles)
                            <option value="{{strtoupper($roles->name)}}">{{strtoupper($roles->name)}}</option>
                        @endforeach
                    </select>
                </td>
                <td style="font-weight: normal !important;">
                    <select id="search_branch" class="form-control form-select filter-type" style="border:1px solid #808080">
                        <option value="" selected>&nbsp;</option>
                        @foreach($branches as $branch)
                            <option value="{{$branch->company_name}}">{{$branch->company_name}}</option>
                        @endforeach
                    </select>
                    <input type="search" id="filter-type" class="form-control filter-input d-none" data-column="3"/>
                </td>
                <td style="font-weight: normal !important;">
                    <select id="search_area" class="form-control form-select filter-type2" style="border:1px solid #808080">
                        <option value="" selected>&nbsp;</option>
                        @foreach($areas as $area)
                            <option value="{{$area->store_area}}">{{$area->store_area}}</option>
                        @endforeach
                    </select>
                    <input type="search" id="filter-type2" class="form-control filter-input d-none" data-column="4"/>
                </td>
                <td>
                    <select class="form-control form-select filter-select" data-column="6" style="border:1px solid #808080">
                        <option value="" selected></option>
                        <option value="ACTIVE" style="font-weight: bold; color: #2ab934;">ACTIVE</option>
                        <option value="INACTIVE" style="font-weight: bold; color: #ca2222;">INACTIVE</option>
                    </select>
                </td>
                <td></td>
            </tr>
            <tr>
                <th>FULL NAME</th>
                <th>EMAIL ADDRESS</th>
                <th>USER LEVEL</th>
                <th>COMPANY NAME</th>
                <th>STORE AREA</th>
                <th style="width: 120px;">STATUS</th>
                <th>STATUS</th>
            </tr>
        </thead>
    </table>
    <br>
</div>
<hr>
@include('modals/addUser')
@include('modals/updateUser')
<script src={{asset('js/users.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection