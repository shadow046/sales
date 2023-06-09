@extends('layouts.app')
@section('content')
<script>accessibility('24');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">USER ROLES MANAGEMENT</span></h4></div>
    </div>
    <div class="col-md form-group">
        <button class="btn btn-custom addBtn float-end" data="role"><i class="fas fa-plus"></i> ADD NEW</button>
    </div>
</div>
<div class="table-responsive container-fluid pt-2">
    <table class="table table-striped table-hover table-bordered w-100 align-middle roleTable" id="roleTable">
        <thead>
            <tr class="bg-default">
                <th>USER ROLE</th>
                <th>USER PERMISSIONS / ACCOUNT</th>
                <th>USER ACCESSIBILITY</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <br>
</div>
<hr>
<input type="hidden" id="role_id" class="role_id">
@include('modals.addRole')
<script src={{asset('js/roles.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection