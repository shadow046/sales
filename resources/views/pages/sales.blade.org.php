@extends('layouts.app')
@section('content')
    <br>
    <label>DATE: &nbsp;</label><input type="text" id="daterange" style="width:250px">
    <div class="container-fluid pt-3 row">
        <div class="row col-md-12 pt-2 ml-2 mr-0 pb-1 responsive" style="border: 1px solid;">
            <div class="table-responsive">
                <table class="table table-hover table-bordered dashboardTable" id="dashboardTable" style="width:100%">
                    <thead style="font-weight:bolder" class="bg-default">
                        <tr>
                            <th class="dt-head-center"><input type="search" class="column_search" style="width:85%"/></th>
                            <th class="dt-head-center"><input type="search" class="column_search" style="width:85%"/></th>
                            <th class="dt-head-center"><input type="search" class="column_search" style="width:85%"/></th>
                            <th class="dt-head-center"><input type="search" class="column_search" style="width:85%"/></th>
                            <th class="dt-head-center"><input type="search" class="column_search" style="width:85%"/></th>
                            <th class="dt-head-center"></th>
                        </tr>
                        <tr>
                            <th class="dt-head-center">STORE CODE</th>
                            <th class="dt-head-center">COMPANY NAME</th>
                            <th class="dt-head-center">STORE TYPE</th>
                            <th class="dt-head-center">STORE AREA</th>
                            <th class="dt-head-center">REGION</th>
                            <th class="dt-head-center">SALES</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
        <div class="row col-md-12 ml-2 mr-0" style="border: 1px solid;">
            <h4 id="store_name" style="display:none"></h4>
            <h5 id="DateRange" style="display:none"></h5>
        <div></div>
        <div class="row col-md-6 ml-2 mr-0" style="border: 1px solid;">
            <div class="pt-2">
                <div id="categoryChart" class="col-md-12"></div>
            </div>
        </div>
        <div class="row col-md-6 ml-0" style="border: 1px solid;">
            <div class="col-md-12"id="tenderchart"></div>
        </div>
        {{-- <div class="row col-md-6 ml-2 mr-0" style="border: 1px solid;">
            <div class="pt-2">
                <div id="categoryChart" class="col-md-12"></div>
            </div>
        </div>
        <div class="row col-md-6 ml-0" style="border: 1px solid;">
            <div class="col-md-12"id="tenderchart"></div>
        </div> --}}
        {{-- <div class="row col-md-6 ml-2 mr-0" style="border: 1px solid;">
            <div class="col-md-12">
                <input type="radio" id="rdate" name="radioOption" value="date" checked="checked">
                <label for="rdate">Date</label>&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="radio" id="rmonth" name="radioOption" value="month">
                <label for="rmonth">Month</label>
            </div>
            <div class="col-md-12">
                <input type="text" id="daterange" style="display:none;width:250px">
                <select id="yearfrom" class="monthrange" style="display:none;width:100px">
                    <option value="" selected disabled>select year</option>
                    @foreach(range(2020, strftime("%Y", time())) as $year)
                        <option value="{{$year}}">{{$year}}</option>
                    @endforeach
                </select>
                <select id="monthfrom" class="monthrange" style="display:none"disabled>
                    <option value="" selected disabled>select month</option>
                </select> <span class="monthrange" style="display:none">to</span>
                <select id="yearto" class="monthrange" style="display:none" disabled>
                    <option value="" selected disabled>select year</option>
                </select>
                <select id="monthto" class="monthrange" style="display:none" disabled>
                    <option value="" selected disabled>select month</option>
                </select>
                <select id="rangecategory" class="monthrange" style="display:none" disabled>
                    <option value="" selected disabled>select category</option>
                </select>
            </div> 
            <div id="tenderchart"></div>
        </div>
        <div class=" row col-md-6 ml-0" style="border: 1px solid;">
            <div id="savorychart"></div>
        </div>--}}
    </div>
    <br><br>
    <script src={{asset('/js/sales/index.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection