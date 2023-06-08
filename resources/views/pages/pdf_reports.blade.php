@extends('layouts.app')
@section('content')
<script>accessibility('29');</script>
<script>$('#loading').hide();</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">POS UPLOADED REPORTS</span></h4></div>
    </div>
</div>
<div class="row mb-3">
    <div class="col-md-3"></div>
    <div class="col-md-6">
        <div class="f-outline">
            <input type="month" class="forminput form-control" id="month_range" name="month_range" style="width: 58%;">
            <label for="month_range" class="formlabels form-label">MONTH</label>
        </div>
    </div>
    <div class="col-md-3"></div>
</div>
<div class="row">
    <div class="col-md-3"></div>
    <div class="col-md-6">
        <div style="margin-top: -55px; z-index: 100;">
            <button type="button" class="form-control btn btn-default float-end ml-1" id="btnReset" style="width: 20%;"><i class="fa-solid fa-eraser"></i> RESET</button>
            <button type="button" class="form-control btn btn-default float-end" id="date_submit" style="width: 20%;"><i class="fa-solid fa-clipboard-check"></i> SUBMIT</button>
        </div>
    </div>
    <div class="col-md-3"></div>
</div>
<div class="row">
    <div class="col-md-3"></div>
    <div class="col-md">
        <div id="pdf_alert" class="alert alert-primary mt-2" role="alert" style="display: none;">
            <i class='fa fa-exclamation-triangle'></i>
            <b>NOTE:</b> Please select month range for POS Uploaded Reports.
        </div>
    </div>
    <div class="col-md-3"></div>
</div>
<div id="pdf_tab" style="display:none;" class="mt-3">
    <ul class="nav nav-tabs" style="border: none;" role="tablist">
        <li class="nav-item" style="margin-right:5px">
            <a class="nav-link pill bg-sub tab_ebook active" style="text-decoration: none; color: white;" id="tab_ebook" data-bs-toggle="tab" href="#page_ebook"> E-BOOK REPORTS</a>
        </li>
        <li class="nav-item" style="margin-right:5px">
            <a class="nav-link pill bg-sub bg-sub-light tab_sales_mix active" style="text-decoration: none; color: white;" id="tab_sales_mix" data-bs-toggle="tab" href="#page_sales_mix"> SALES MIX REPORTS</a>
        </li>
        <li class="nav-item" style="margin-right:5px">
            <a class="nav-link pill bg-sub bg-sub-light tab_end_of_day active" style="text-decoration: none; color: white;" id="tab_end_of_day" data-bs-toggle="tab" href="#page_end_of_day"> END OF DAY REPORTS</a>
        </li>
        <li class="nav-item" style="margin-right:5px">
            <a class="nav-link pill bg-sub bg-sub-light tab_terminal active" style="text-decoration: none; color: white;" id="tab_terminal" data-bs-toggle="tab" href="#page_terminal"> TERMINAL REPORTS</a>
        </li>
    </ul>
    <div id="pdfContent">
        <br>
        <div id="page_ebook" class="tab-pane active">
        </div>
        <div id="page_sales_mix" class="tab-pane" style="display:none;">
        </div>
        <div id="page_end_of_day" class="tab-pane" style="display:none;">
        </div>
        <div id="page_terminal" class="tab-pane" style="display:none;">
        </div>
        <hr>
    </div>
</div>
<script src={{asset('js/pdf_reports.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection