@extends('layouts.app')
@section('content')
<script>accessibility('11');</script>
<br>
<div class="row">
    <div class="col">
        <div id="page-name"><h4><span class="page-reload">PRODUCTS MAINTENANCE</span></h4></div>
    </div>
    <div class="col-md form-group">
        @can('create')
            <button class="form-control btn btn-custom addBtn float-end" data="products"><i class="fas fa-plus"></i> ADD NEW</button>
        @endcan
        @can('import')
            <button class="form-control btn btn-custom float-end" data-bs-toggle="modal" data-bs-target="#importProducts"><i class="fas fa-file-import"></i> IMPORT</button>
        @endcan
            <button class="form-control btn btn-custom btnExport float-end" on><i class="fas fa-file-export"></i> EXPORT</button>
        @role('ADMIN')
            <button class="form-control btn btn-custom btnSendUpdate float-end" style="width: auto;"><i class="fa-solid fa-upload"></i> SEND UPDATE</button>
        @endrole
    </div>
</div>
<div class="ml-2">
    <a href="#" id="filter" class="text-default" title="Toggle Visible Columns" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-content='@include("inc.columnsProducts")'>
        <b class="mr-1">TOGGLE COLUMNS</b>
        <i class="fas fa-filter fa-lg" aria-hidden="true"></i>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </a>
</div>
<div class="table-responsive container-fluid pt-2">
    <table class="table table-hover table-bordered table-striped productsTable" id="productsTable" style="width:100%;">
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
                <td>
                    <input type="search" class="form-control filter-input" data-column="3" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="4" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="5" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="6" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="7" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="8" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="9" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="10" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="11" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="12" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="13" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="14" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="15" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="16" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="17" style="border:1px solid #808080"/>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="18" style="border:1px solid #808080"/>
                </td>
                <td>
                    <select class="form-control filter-select form-select" data-column="20" style="border:1px solid #808080">
                        <option value="" selected></option>
                        <option value="ACTIVE" style="font-weight: bold; color: #2ab934;">ACTIVE</option>
                        <option value="INACTIVE" style="font-weight: bold; color: #ca2222;">INACTIVE</option>
                    </select>
                </td>
                <td>
                    <input type="search" class="form-control filter-input" data-column="20" style="border:1px solid #808080"/>
                </td>
            </tr>
            <tr>
                <th>CATEGORY</th>
                <th>ITEM CODE</th>
                <th>INTRO DATE</th>
                <th>SHORT DESCRIPTION</th>
                <th>LONG DESCRIPTION</th>
                <th>STORE SETUP</th>
                <th>COMPANY</th>
                <th>STORE AREA</th>
                <th>STORE BRANCH</th>
                <th>DINE-IN PRICE</th>
                <th>TAKE-OUT PRICE</th>
                <th>PICK-UP PRICE</th>
                <th>DELIVERY PRICE</th>
                <th>BULK ORDER PRICE</th>
                <th>FDS PRICE</th>
                <th>DRIVE-THRU</th>
                <th>ADD MEAL TYPE</th>
                <th>SKU</th>
                <th>SI / MODIFIER CODE</th>
                <th>STATUS</th>
                <th>STATUS</th>
            </tr>
        </thead>
    </table>
    <br>
</div>
<hr>
@include('modals.addProducts')
@include('modals.importProducts')
<div class="modal fade" id="modal_product_image_preview" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-default">
                <h5 class="modal-title w-100 text-center"> PRODUCT IMAGE </h5>
                <button type="button" class="btn border-white" data-bs-target="#productsModal" data-bs-toggle="modal" title="BACK"><i class="fas fa-arrow-left text-white" title="BACK"></i></button>
            </div>
            <div class="modal-body">
                <img src="" alt="" id="modal_product_image_display" style="width:100%;height:100%;">
            </div>
        </div>
    </div>
</div>
<script src={{asset('js/maintenance/products.js?ver=')}}{{\Illuminate\Support\Str::random(50)}}></script>
@endsection