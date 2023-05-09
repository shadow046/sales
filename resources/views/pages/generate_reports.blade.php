@extends('layouts.app')
@section('content')
<script>accessibility('29');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">SALES ANALYSIS REPORTS</span></h4></div>
    </div>
</div>
<br>
<form id="formReports">
    <div class="row mb-3">
        <div class="col-md-4"></div>
        <div class="col-md-4 f-outline">
            <select id="report_type" name="report_type" class="forminput form-control form-select requiredField" style="color: black">
                <option value="" selected disabled>SELECT REPORT TYPE</option>
                <option value="STANDARD">STANDARD REPORT</option>
                <option value="COMPARATIVE">COMPARATIVE REPORT</option>
            </select>
            <label for="report_type" class="formlabels form-label">REPORT TYPE
        </div>
        <div class="col-md-4"></div>
    </div>
    <div class="row mb-3">
        <div class="col-md-4"></div>
        <div class="col-md-4 f-outline">
            <select id="report_category" name="report_category" class="forminput form-control form-select requiredField" style="color: black">
                <option value="" class="text-dark" selected disabled>SELECT SALES REPORT CATEGORY</option>
                <option value="STORE">STORE SALES</option>
                <option value="PRODUCT">PRODUCT SALES</option>
                <option value="COMBO MEAL">COMBO MEAL SALES</option>
                <option value="PROMO">PROMO SALES</option>
                <option value="TRANSACTION TYPE">TRANSACTION TYPE SALES</option>
                <option value="TENDER TYPE" class="text-secondary">TENDER TYPE SALES</option>
                <option value="DISCOUNT" class="text-secondary">DISCOUNT SALES</option>
                <option value="DELIVERY CHANNEL" class="text-secondary">DELIVERY CHANNEL SALES</option>
            </select>
            <label for="report_category" class="formlabels form-label">SALES REPORT CATEGORY
        </div>
        <div class="col-md-4"></div>
    </div>
    <div class="row mb-3 classBranch classComparative">
        <div class="col-md-4"></div>
        <div class="col-md-4 f-outline">
            <select id="branch" name="branch" class="selectComparative forminput form-control form-select requiredField multiple_field" style="color: black" data-placeholder="Select Product/s" multiple>
                @foreach($stores as $store)
                    <option value="{{$store->fcode}}" desc="{{$store->desc1}}">{{$store->fcode}}: {{$store->desc1}}</option>
                @endforeach
            </select>
            <label for="branch" class="formlabels form-label">BRANCH CODE / NAME
        </div>
        <div class="col-md-4"></div>
    </div>
    <div class="row mb-3 classProduct classComparative">
        <div class="col-md-4"></div>
        <div class="col-md-4 f-outline">
            <select id="product" name="product" class="selectComparative forminput form-control form-select requiredField multiple_field" style="color: black" data-placeholder="Select Product/s" multiple>
                @foreach($products as $product)
                    <option value="{{$product->fcode}}" desc="{{$product->desc1}}">{{$product->fcode}}: {{$product->desc1}}</option>
                @endforeach
            </select>
            <label for="product" class="formlabels form-label">PRODUCT CODE / DESCRIPTION
        </div>
        <div class="col-md-4"></div>
    </div>
    <div class="row mb-3 classCombo classComparative">
        <div class="col-md-4"></div>
        <div class="col-md-4 f-outline">
            <select id="combo" name="combo" class="selectComparative forminput form-control form-select requiredField multiple_field" style="color: black" data-placeholder="Select Combo Meal Product/s" multiple>
                @foreach($combos as $combo)
                    <option value="{{$combo->fcode}}" desc="{{$combo->desc1}}">{{$combo->fcode}}: {{$combo->desc1}}</option>
                @endforeach
            </select>
            <label for="combo" class="formlabels form-label">PRODUCT CODE / DESCRIPTION
        </div>
        <div class="col-md-4"></div>
    </div>
    <div class="row mb-3 classPromo classComparative">
        <div class="col-md-4"></div>
        <div class="col-md-4 f-outline">
            <select id="promo" name="promo" class="selectComparative forminput form-control form-select requiredField multiple_field" style="color: black" data-placeholder="Select Promo Product/s" multiple>
                @foreach($promos as $promo)
                    <option value="{{$promo->fcode}}" desc="{{$promo->desc1}}">{{$promo->fcode}}: {{$promo->desc1}}</option>
                @endforeach
            </select>
            <label for="promo" class="formlabels form-label">PRODUCT CODE / DESCRIPTION
        </div>
        <div class="col-md-4"></div>
    </div>
    <div class="row mb-3 classTransaction classComparative">
        <div class="col-md-4"></div>
        <div class="col-md-4 f-outline">
            <select id="transactiontype" name="transactiontype" class="selectComparative forminput form-control form-select requiredField multiple_field" style="color: black" data-placeholder="Select Transaction Type/s" multiple>
                @foreach($transactions as $transaction)
                    <option value="{{$transaction->trantype}}">{{$transaction->trantype}}</option>
                @endforeach
            </select>
            <label for="transactiontype" class="formlabels form-label">TRANSACTION TYPE
        </div>
        <div class="col-md-4"></div>
    </div>
    <div class="row mb-3">
        <div class="col-md-4"></div>
        <div class="col-md-2 f-outline">
            <input type="date" style="color: black" name="start_date" id="start_date" class="forminput form-control inputDates requiredField" placeholder=" " autocomplete="off">
            <label for="start_date" class="formlabels form-label">START DATE</label>
        </div>
        <div class="col-md-2 f-outline">
            <input type="date" style="color: black" name="end_date" id="end_date" class="forminput form-control inputDates requiredField" placeholder=" " autocomplete="off">
            <label for="end_date" class="formlabels form-label">END DATE</label>
        </div>
        <div class="col-md-4"></div>
    </div>
    <div class="row mb-3">
        <div class="col-md-4"></div>
        <div class="col-md-2 f-outline">
            <button type="button" id="btnReset" class="form-control btn btn-default float-end"><i class="fa-solid fa-eraser"></i> RESET FORM</button>
        </div>
        <div class="col-md-2 f-outline">
            <button type="button" id="btnGenerate" class="form-control btn btn-default float-end btnRequired"><i class="fa-solid fa-clipboard-check"></i> GENERATE REPORT</button>
        </div>
        <div class="col-md-4"></div>
    </div>
</form>
<div class="reportsTable1" style="display: none;">
    <hr>
    <h4 id="tblReports1Header"></h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button>
    <div class="ml-2">
        <a href="#" id="filter" class="text-default" title="Toggle Visible Columns" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-content='@include("inc.columnsReportsStore")'>
            <b class="mr-1">TOGGLE COLUMNS</b>
            <i class="fas fa-filter fa-lg" aria-hidden="true"></i>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </a>
    </div>
</div>
<div id="reportsTable1" style="min-height: 60vh;"></div>
<div id="reportsTable2"></div>
<div id="reportsTable4"></div>
<div id="reportsTable3"></div>
<hr>
<script src={{asset('js/generate_reports.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection