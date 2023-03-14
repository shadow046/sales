@extends('layouts.app')
@section('content')
    <div class="container-fluid pt-3">
        <input type="text" id="daterange" style="width:250px">
        <select id="chartStyle" style="display:none;width:150px;height:30px">
            <option value="Pie" selected>Pie Chart</option>
            <option value="Donut" >Donut Chart</option>
            <option value="Line">Line Chart</option>
            <option value="Column">Column Chart</option>
        </select>
        <div id="categoryChart"></div>
    </div>
    <script src={{asset('/js/sales/category.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection