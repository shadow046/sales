@extends('layouts.app')
@section('content')
    <br>
    <div class="container-fluid" id="main_div">
        <table class="table table-hover table-bordered dashboardTable" id="dashboardTable" style="width:100%">
            <thead style="font-weight:bolder" class="bg-default">
                <tr>
                    <th class="dt-head-center">STORE CODE</th>
                    <th class="dt-head-center"></th>
                    <th class="dt-head-center"></th>
                </tr>
            </thead>
        </table>
    </div>
    <br><br>
    <script src={{asset('/js/sales/index.js?ver=')}}{{$random}}></script>
@endsection