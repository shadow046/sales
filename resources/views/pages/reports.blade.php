@extends('layouts.app')
@section('content')
<script>accessibility('29');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">SALES REPORTS</span></h4></div>
    </div>
</div>
<br>
<div class="row mb-3">
    <div class="col-md-4 f-outline">
        <select id="report_type" name="report_type" class="forminput form-control form-select requiredField" style="color: black">
            <option value="" disabled>SELECT REPORT TYPE</option>
            <option value="1" selected>STANDARD REPORT</option>
            <option value="2">COMPARATIVE REPORT</option>
        </select>
        <label for="report_type" class="formlabels form-label">REPORT TYPE
    </div>
    <div class="col-md-4 f-outline">
        <input type="search" style="color: black" name="report_title" id="report_title" class="forminput form-control requiredField text-uppercase" placeholder=" " autocomplete="off" value="CUSTOM REPORT">
        <label for="report_title" class="formlabels form-label">REPORT TITLE</label>
    </div>
</div>
<div class="row mb-3">
    <div class="col-md-4 f-outline">
        <select id="report_category" name="report_category" class="forminput form-control form-select requiredField" style="color: black">
            <option value="" selected disabled>SELECT REPORT CATEGORY</option>
            <option value="AREA">AREA</option>
            <option value="REGION">REGION</option>
            <option value="AREA MANAGER">AREA MANAGER</option>
            <option value="DISTRICT MANAGER">DISTRICT MANAGER</option>
            <option value="STORE GROUP">STORE GROUP</option>
            <option value="STORE SETUP">STORE SETUP</option>
            <option value="DELIVERY CHANNEL">DELIVERY CHANNEL</option>
            <option value="TRANSACTION TYPE">TRANSACTION TYPE</option>
            <option value="TENDER TYPE">TENDER TYPE</option>
            <option value="DISCOUNT">DISCOUNT</option>
            <option value="PRODUCT CATEGORY">PRODUCT CATEGORY</option>
            <option value="COMBO CATEGORY">COMBO CATEGORY</option>
        </select>
        <label for="report_category" class="formlabels form-label">REPORT CATEGORY
    </div>
    <div class="col-md-2 f-outline">
        <input type="date" style="color: black" name="start_date" id="start_date" class="forminput form-control requiredField" placeholder=" " autocomplete="off">
        <label for="start_date" class="formlabels form-label">START DATE</label>
    </div>
    <div class="col-md-2 f-outline">
        <input type="date" style="color: black" name="end_date" id="end_date" class="forminput form-control requiredField" placeholder=" " autocomplete="off">
        <label for="end_date" class="formlabels form-label">END DATE</label>
    </div>
    <div class="col-md-2 f-outline">
        <button id="btnGenerate" class="form-control btn btn-default float-end btnRequired"><i class="fa-solid fa-clipboard-check"></i> GENERATE REPORT</button>
    </div>
</div>
<div id="reportsTable"></div>
<hr>
<script src={{asset('js/reports.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection