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
    <table id="userTable" class="table userTable table-bordered table-striped table-hover display" style="cursor: pointer; width: 100%; zoom: 80%;">
        <thead style="font-weight:bolder" class="bg-default">
            <tr>
                <th class="always-default">
                    <input type="search" class="form-control filter-input" data-column="0" style="border:1px solid #808080"/>
                    FULL NAME
                </th>
                <th class="always-default">
                    <input type="search" class="form-control filter-input" data-column="1" style="border:1px solid #808080"/>
                    EMAIL ADDRESS
                </th>
                <th class="always-default">
                    <select class="form-control filter-select form-select" data-column="2" style="border:1px solid #808080">
                        <option value="" selected></option>
                        @foreach($role as $roles)
                            <option value="{{strtoupper($roles->name)}}">{{strtoupper($roles->name)}}</option>
                        @endforeach
                    </select>
                    USER LEVEL
                </th>
                <th style="font-weight: normal !important;">
                    <select id="search_branch" class="form-control form-select filter-type" style="border:1px solid #808080;">
                        <option value="" selected>&nbsp;</option>
                        @foreach($branches as $branch)
                        <option value="{{$branch->company_name}}">{{$branch->company_name}}</option>
                        @endforeach
                    </select>
                    <input type="search" id="filter-type" class="form-control filter-input d-none" data-column="3"/>
                    <p class="mt-3"><b>COMPANY NAME</b></p>
                </th>
                <th style="font-weight: normal !important;">
                    <select id="search_area" class="form-control form-select filter-type2 mt-2" style="border:1px solid #808080">
                        <option value="" selected>&nbsp;</option>
                        @foreach($areas as $area)
                            <option value="{{$area->store_area}}">{{$area->store_area}}</option>
                        @endforeach
                    </select>
                    <input type="search" id="filter-type2" class="form-control filter-input d-none" data-column="4"/>
                    <p class="mt-3"><b>STORE AREA</b></p>
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="5" style="border:1px solid #808080"/>
                    BRANCH NAME
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="6" style="border:1px solid #808080"/>
                    PROVINCE
                </th>
                <th>
                    <input type="search" class="form-control filter-input" data-column="7" style="border:1px solid #808080"/>
                    DISTRICT
                </th>
                <th>
                    <select class="form-control form-select filter-select" data-column="9" style="border:1px solid #808080">
                        <option value="" selected></option>
                        <option value="ACTIVE" style="font-weight: bold; color: #2ab934;">ACTIVE</option>
                        <option value="INACTIVE" style="font-weight: bold; color: #ca2222;">INACTIVE</option>
                    </select>
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
@include('modals/addUser')
@include('modals/updateUser')
<script src={{asset('js/users.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection