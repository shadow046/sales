@extends('layouts.app')
@section('content')
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">DOWNLOADS</span></h4></div>
    </div>
</div>

<div class="table-responsive container-fluid pt-2">
    <table class="table table-striped table-hover table-bordered w-100 align-middle updateListTable" id="updateListTable">
        <thead>
            <tr class="bg-default">
                <th>DATE</th>
                <th>FILENAME</th>
                <th>BRANCH CODE</th>
                <th>ACTION</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <br>
</div>

<script src={{asset('js/update_list.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection