@extends('layouts.app')
@section('content')
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">PROMOS MAINTENANCE</span></h4></div>
    </div>
    <div class="col-md form-group">
        <button class="form-control btn btn-custom addBtn float-end" data="promos"><i class="fas fa-plus"></i> ADD NEW</button>
        <button class="form-control btn btn-custom btnExport float-end"><i class="fas fa-file-export"></i> EXPORT</button>
    </div>
</div>
<div class="table-responsive container-fluid pt-2">
    <table class="table table-hover table-bordered table-striped promoTable" id="promoTable" style="width:100%;">
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
                <th>PROMO CODE</th>
                <th>DESCRIPTION</th>
                <th>PRICE</th>
            </tr>
        </thead>
    </table>
    <br>
</div>
<hr>
<input type="hidden" name="promo_id" id="promo_id" class="modal_id">
@include('modals.addPromos')
<script src={{asset('js/maintenance/promos.js?ver=')}}{{$random}}></script>
@endsection