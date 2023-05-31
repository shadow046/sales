@extends('layouts.app')
@section('content')
    <br>
    <div class="container-fluid pt-3">
        <center>
            <div class="alert alert-primary my-0 p-1" style="width:500px" role="alert">
                <i class='fa fa-exclamation-triangle'></i>
                <b>NOTE:</b> Click a store from the list to view other sales details.
            </div>
        </center>
    </div>
    <div class="container-fluid pt-3 row">
        <div class="row col-md-12 pt-2 ml-2 mr-0 pb-1 responsive" style="border: 1px solid;">
            <div class="table-responsive">
                <h4>ALL STORES TOTAL SALES YTD</h4>
                <button class="form-control btn btn-custom btnExport float-end" style="margin-bottom: -35px"><i class="fas fa-file-export"></i> EXPORT</button>
                <table class="table table-hover table-bordered dashboardTable" id="dashboardTable" style="width:100%">
                    <thead style="font-weight:bolder" class="bg-default">
                        <tr>
                            <th class="dt-head-center"><input type="search" class="column_search" style="width:85%"/></th>
                            <th class="dt-head-center"><input type="search" class="column_search" style="width:85%"/></th>
                            <th class="dt-head-center"><input type="search" class="column_search" style="width:85%"/></th>
                            <th class="dt-head-center"><input type="search" class="column_search" style="width:85%"/></th>
                            <th class="dt-head-center"></th>
                        </tr>
                        <tr>
                            <th class="dt-head-center">BRANCH NAME</th> 
                            <th class="dt-head-center">MALL GROUP</th>
                            <th class="dt-head-center">CITY</th>
                            <th class="dt-head-center">STORE AREA</th>
                            <th class="dt-head-center">TOTAL SALES</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
        <div class="row col-md-12 ml-2 mr-0" id="barchartDiv" style="border: 1px solid;">
            <div class="pt-2">
                <div id="barChart" class="col-md-12"></div>
            </div>
        </div>
        <div class="row col-md-12 pt-2 ml-2 mr-0 pb-1 responsive" id="dailyTableDiv" style="border: 1px solid;display:none">
            <div class="table-responsive">
                <h4 id="dailyheader"></h4>
                <div class='row'>
                    <label for="daterange" style="font-weight:bold">Select date range:</label>
                    <div class="f-outline col-md-2 mt-1 mb-5" id="daterange" name="daterange">
                        <input class="forminput form-control" type="date" id="from" name="from" placeholder=" " value="{{Carbon\Carbon::now()->addMonth('-2')->format('Y-m-d')}}" onkeydown="return false">
                        <label for="from" class="formlabel form-label">Date FROM</label>
                    </div>
                    <div class="f-outline col-md-2 mt-1 mb-3">
                        <input class="forminput form-control" type="date" id="to" name="to" placeholder=" " value="{{Carbon\Carbon::now()->format('Y-m-d')}}" onkeydown="return false">
                        <label for="to" class="formlabel form-label">Date TO</label>
                    </div>
                </div>
                <table class="table table-hover table-bordered dailyTable" id="dailyTable" style="width:100%;display:none">
                    <thead style="font-weight:bolder" class="bg-default">
                        <tr>
                            <th></th>
                            <th class="dt-head-center">DATE</th>
                            <th class="dt-head-center">GROSS SALES</th>
                            <th class="dt-head-center">TOTAL SALES</th>
                            <th class="dt-head-center">NET SALES</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
        <div class="row col-md-12 pt-2 ml-2 mr-0 pb-1 responsive" id="categoryTableDiv" style="border: 1px solid;display:none">
            <div class="table-responsive">
                <h4 id="catheader"></h4>
                <table class="table table-hover table-bordered categoryTable" id="categoryTable" style="width:100%;display:none">
                    <thead style="font-weight:bolder" class="bg-default">
                        <tr>
                            <th class="dt-head-center">PRODUCT CATEGORY</th>
                            <th class="dt-head-center">PRODUCT DESCRIPTION</th>
                            <th class="dt-head-center">QUANTITY</th>
                            <th class="dt-head-center">SALES</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
        <div class="row col-md-12 ml-2 mr-0" id="categoryChartDiv" style="border: 1px solid;display:none">
            <div class="pt-2">
                <div id="categoryChart" class="col-md-12"></div>
            </div>
        </div>
        <div class="row col-md-12 pt-2 ml-2 mr-0 pb-1 responsive" id="tenderTableDiv" style="border: 1px solid;display:none">
        </div>
        <div class="row col-md-12 ml-2 mr-0" id="tenderchartDiv" style="border: 1px solid;display:none">
            <div class="col-md-12" id="tenderchart"></div>
        </div>
    </div>
    <div class="row col-md-12 pt-2 ml-2 mr-0 pb-1 responsive" id="discountTableDiv" style="border: 1px solid;display:none">
        <div class="table-responsive">
            <h4 id="catheader"></h4>
            <table class="table table-hover table-bordered discountTable" id="discountTable" style="width:100%;display:none">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th class="dt-head-center">DISCOUNT</th>
                        <th class="dt-head-center">AMOUNT</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
    <br><br>
    <script src={{asset('/js/sales/index.js?ver=')}}{{$random}}></script>
@endsection