@extends('layouts.app')
@section('content')
    <div class="container-fluid pt-3" style="height: 80vh;">
        <div class="row">
            <div class="col-md-2 f-outline">
                <input type="text" style="color: black" name="date" id="date" class="forminput form-control" placeholder=" " autocomplete="off" readonly >
                <label for="date" class="formlabels form-label">Date</label>
            </div>
            <div class="col-md-1">
                <select id="gOption" style="height:37px">
                    <option value="Graph">GRAPH</option>
                    <option value="Table">TABLE</option>
                </select>
            </div>
            <div class="col-md-2">
                <select id="rangecategory" class="monthrange" style="height:37px;display:none" disabled>
                    <option value="" selected disabled>select category</option>
                </select>
            </div>
            <div class="col-md">
                <input type="radio" id="rsales" name="rOption" value="sales">
                <label for="rsales">SALES</label>&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="radio" id="rquantity" name="rOption" value="quantity" checked="checked">
                <label for="rquantity">QUANTITY</label>
            </div>
        </div>
        <div id="dailyChart"></div><hr>
        <div id="dailyTableDiv" style="display:none">
            <div class="row">
                <div class="col col-md-6"></div>
                <div class="col col-md-6 text-right">
                    <button id="export_button" class="form-control btn btn-custom float-end mb-2"><i class="fas fa-file-export"></i> EXPORT</button>
                </div>
            </div>
            <table class="table table-hover table-bordered dailyTable" id="dailyTable" style="width:100%">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th id="colhead">ITEM CODE</th>
                        <th class="option">QUANTITY</th>
                    </tr>
                </thead>
            </table>
        </div>
        <br><br>
    </div>
    <script src={{asset('/js/sales/daily.js?ver=')}}{{$random}}></script>
@endsection