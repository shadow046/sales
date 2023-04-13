@extends('layouts.app')
@section('content')
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">POS UPLOADED REPORTS</span></h4></div>
    </div>
</div>

<div class="row mb-5">
    <div class="col-md-3"></div>
    <div class="col-md-4 f-outline">
        <input type="month" class="forminput form-control">
    </div>
    <div class="col-md-2 f-outline">
        <button type="button" class="form-control btn btn-default float-end"> SUBMIT</button>
    </div>
    <div class="col-md-3"></div>
</div>

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
        <table class="table table-striped ebookTable">
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
                </tr>
                <tr>
                    <th>FILE NAME</th>
                    <th>BRANCH</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div id="page_sales_mix" class="tab-pane" style="display:none;">
        {{-- <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped salesMixTable" id="salesMixTable" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
            <thead>
                <tr class="bg-default">
                    <td>
                        <input type="search" class="form-control filter-input" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input" data-column="2" style="border:1px solid #808080"/>
                    </td>
                </tr>
                <tr class="bg-default">
                    <th>FILENAME</th>
                    <th>BRANCH</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
            </table>
        </div> --}}
        <table class="table table-striped salesMixTable">
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
                </tr>
                <tr>
                    <th>FILE NAME</th>
                    <th>BRANCH</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div id="page_end_of_day" class="tab-pane" style="display:none;">
        <table class="table table-striped endOfDayTable">
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
                </tr>
                <tr>
                    <th>FILE NAME</th>
                    <th>BRANCH</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div id="page_terminal" class="tab-pane" style="display:none;">
        <table class="table table-striped terminalTable">
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
                </tr>
                <tr>
                    <th>FILE NAME</th>
                    <th>BRANCH</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

<script src={{asset('js/pdf_reports.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection