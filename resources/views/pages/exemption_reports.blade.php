@extends('layouts.app')
@section('content')
<script>accessibility('29');</script>
<script>$('#loading').hide();</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">EXEMPTION REPORTS</span></h4></div>
    </div>
    <div class="col">
        <h4 class="debug-reports text-white float-end" style="cursor: pointer;">DEBUGGER</h4>
    </div>
</div>
<br>
<form>
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
            <button type="reset" id="btnReset" class="form-control btn btn-default float-end"><i class="fa-solid fa-eraser"></i> RESET FORM</button>
        </div>
        <div class="col-md-2 f-outline">
            <button type="button" id="btnGenerate" class="form-control btn btn-default float-end btnRequired"><i class="fa-solid fa-clipboard-check"></i> GENERATE REPORT</button>
        </div>
        <div class="col-md-4"></div>
    </div>
</form>
<div id="reportsTable1"></div>
<div id="reportsTable2"></div>
<div id="reportsTable3"></div>
<hr>
<script src={{asset('js/exemption_reports.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection