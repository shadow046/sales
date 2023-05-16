$(document).prop('title', $('#page-name').text());
$(document).ready(function(){
    $('#branch').chosen();
    $('#product').chosen();
    $('#combo').chosen();
    $('#promo').chosen();
    $('#transactiontype').chosen();
    $('#tendertype').chosen();
    $('#discounttype').chosen();
    $('#branch_chosen').css({'width':'100%'});
    $('#product_chosen').css({'width':'100%'});
    $('#combo_chosen').css({'width':'100%'});
    $('#promo_chosen').css({'width':'100%'});
    $('#transactiontype_chosen').css({'width':'100%'});
    $('#tendertype_chosen').css({'width':'100%'});
    $('#discounttype_chosen').css({'width':'100%'});

    changeComparative();

    var todayDay = new Date();
    var firstDay = new Date(todayDay.getFullYear(), todayDay.getMonth(), 1);
    var lastDay = new Date(todayDay.getFullYear(), todayDay.getMonth() + 1, 0);

    var month1 = firstDay.getMonth()+1;
    var month2 = lastDay.getMonth()+1;

    var date1 = firstDay.getDate();
    var date2 = lastDay.getDate();


    if(month1 < 10) month1 = '0' + month1.toString();
    if(month2 < 10) month2 = '0' + month2.toString();
    if(date1 < 10) date1 = '0' + date1.toString();
    if(date2 < 10) date2 = '0' + date2.toString();

    var startDateValue = firstDay.getFullYear() + '-' + month1 + '-' + date1;
    var endDateValue = lastDay.getFullYear() + '-' + month2 + '-' + date2;

    // $('#start_date').val(startDateValue);
    // $('#end_date').val(endDateValue);

    // $('#report_type').val('STANDARD');
    // $('#report_category').val('STORE');
    // $('#btnGenerate').click();
});

setInterval(() => {
    if($('#report_type').val() == 'STANDARD' || $('#report_type').val() == 'QUANTITATIVE'){
        $('.classComparative').hide();
    }
    else{
        if($('#report_category').val() == 'STORE'){
            $('.classBranch').show();
            $('.classProduct').hide();
            $('.classCombo').hide();
            $('.classPromo').hide();
            $('.classTransaction').hide();
            $('.classTender').hide();
            $('.classDiscount').hide();
        }
        else if($('#report_category').val() == 'PRODUCT'){
            $('.classBranch').hide();
            $('.classProduct').show();
            $('.classCombo').hide();
            $('.classPromo').hide();
            $('.classTransaction').hide();
            $('.classTender').hide();
            $('.classDiscount').hide();
        }
        else if($('#report_category').val() == 'COMBO MEAL'){
            $('.classBranch').hide();
            $('.classProduct').hide();
            $('.classCombo').show();
            $('.classPromo').hide();
            $('.classTransaction').hide();
            $('.classTender').hide();
            $('.classDiscount').hide();
        }
        else if($('#report_category').val() == 'PROMO'){
            $('.classBranch').hide();
            $('.classProduct').hide();
            $('.classCombo').hide();
            $('.classPromo').show();
            $('.classTransaction').hide();
            $('.classTender').hide();
            $('.classDiscount').hide();
        }
        else if($('#report_category').val() == 'TRANSACTION TYPE'){
            $('.classBranch').hide();
            $('.classProduct').hide();
            $('.classCombo').hide();
            $('.classPromo').hide();
            $('.classTransaction').show();
            $('.classTender').hide();
            $('.classDiscount').hide();
        }
        else if($('#report_category').val() == 'TENDER TYPE'){
            $('.classBranch').hide();
            $('.classProduct').hide();
            $('.classCombo').hide();
            $('.classPromo').hide();
            $('.classTransaction').hide();
            $('.classTender').show();
            $('.classDiscount').hide();
        }
        else if($('#report_category').val() == 'DISCOUNT'){
            $('.classBranch').hide();
            $('.classProduct').hide();
            $('.classCombo').hide();
            $('.classPromo').hide();
            $('.classTransaction').hide();
            $('.classTender').hide();
            $('.classDiscount').show();
        }
        else{
            $('.classComparative').hide();
        }
    }
}, 0);

setInterval(() => {
    if($('.classBranch').is(':hidden')){
        $('#branch').val('');
        $('#branch').trigger('chosen:updated');
    }
    if($('.classProduct').is(':hidden')){
        $('#product').val('');
        $('#product').trigger('chosen:updated');
    }
    if($('.classCombo').is(':hidden')){
        $('#combo').val('');
        $('#combo').trigger('chosen:updated');
    }
    if($('.classPromo').is(':hidden')){
        $('#promo').val('');
        $('#promo').trigger('chosen:updated');
    }
    if($('.classTransaction').is(':hidden')){
        $('#transactiontype').val('');
        $('#transactiontype').trigger('chosen:updated');
    }
    if($('.classTender').is(':hidden')){
        $('#tendertype').val('');
        $('#tendertype').trigger('chosen:updated');
    }
    if($('.classDiscount').is(':hidden')){
        $('#discounttype').val('');
        $('#discounttype').trigger('chosen:updated');
    }
}, 0);

$('#btnReset').on('click', function(){
    $('.req').hide();
    $('#start_date').val('');
    $('#end_date').val('');
    $('#end_date').attr('min', '');
    $('#formReports').trigger('reset');
    $('#formReportsQuantitative').trigger('reset');
    $('#report_type').val('')
    $('#report_type').change();
    changeComparative();
    $('#formReports').show();
    $('#formReportsQuantitative').hide();
    $('#reportsTable1').empty();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    emptyQuantitative();
});

$('#report_type').on('change', function(){
    $('#formReportsQuantitative').trigger('reset');
    if($('#report_type').val() == 'QUANTITATIVE'){
        $('#formReports').hide();
        $('#formReportsQuantitative').show();
    }
    else{
        $('#formReports').show();
        $('#formReportsQuantitative').hide();
    }
    changeComparative();
    $('#reportsTable1').empty();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    emptyQuantitative();
});

$('#report_category').on('change', function(){
    $('#formReportsQuantitative').trigger('reset');
    changeComparative();
    $('#reportsTable1').empty();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    emptyQuantitative();
});

$('#start_date').on('change', function(){
    $('#end_date').val('');
    if($(this).val()){
        $('#end_date').attr('min', $(this).val());
    }
    else{
        $('#end_date').attr('min', '');
    }
});

$('#end_date').on('change', function(){
    if($(this).val() < $('#start_date').val()){
        $(this).val('');
        Swal.fire('INVALID DATE', '', 'error');
    }
});

var table1, table2, table3, table4, table5, table6, table7, tableX, tableY, tableZ, tableA;
$('#btnGenerate').on('click', function(){
    $('#reportsTable1').empty();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    emptyQuantitative();

    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    if($('#report_filter').val()){
        var reports_header = $('#report_filter option:selected').text()+' ('+display_range+')';
        quantitative_report(reports_header);
        return false;
    }
    else{
        var reports_header = $('#report_category option:selected').text()+' ('+display_range+')';
    }

    if($('#report_category').val() == 'STORE'){
        $('#loading').show();
        $('#tblReports1Header').text(reports_header);
        var htmlString = `
        <div class="table-responsive container-fluid pt-2 w-100">
            <table class="table table-hover table-bordered table-striped tblReports1" id="tblReports1" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="1" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="2" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="3" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="4" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="5" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="6" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="7" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="8" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="9" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="10" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="11" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="12" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>STORE CODE</th>
                        <th>BRANCH NAME</th>
                        <th>COMPANY NAME</th>
                        <th>AREA MANAGER</th>
                        <th>STORE AREA</th>
                        <th>REGION</th>
                        <th>STORE TYPE</th>
                        <th>STORE GROUP</th>
                        <th>MALL SUB-GROUP</th>
                        <th>NETWORK SETUP</th>
                        <th class="sum">GROSS SALES</th>
                        <th class="sum">TOTAL SALES</th>
                        <th class="sum">NET SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right" colspan="10">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable1').append(htmlString);
        table1 = $('table.tblReports1').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: reports_header,
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/sales/reports/branch',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    included: $('#branch').val()
                }
            },
            columnDefs: [
                {
                    "targets": [2,3,6,7,8,9],
                    "visible": false,
                    "searchable": true
                },
            ],
            columns: [
                { data: 'branch_code' },
                { data: 'store_name' },
                { data: 'company_name' },
                { data: 'area_manager' },
                { data: 'store_area' },
                { data: 'region' },
                { data: 'type' },
                { data: 'store_group' },
                { data: 'subgroup' },
                { data: 'network_setup' },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
                    }
                }
            ],
            order: [],
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[^\d.-]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                api.columns('.sum',{page:'all'}).every(function(){
                var sum=this
                    .data()
                    .reduce(function(a,b){
                        return intVal(a)+intVal(b);
                    },0);
                    sum=Number(sum).toFixed(2);
                    sum=sum.toString();
                    var pattern=/(-?\d+)(\d{3})/;
                    while(pattern.test(sum))
                    sum=sum.replace(pattern,"$1,$2");
                    this.footer().innerHTML='₱ '+sum;
                });
            },
            initComplete: function(){
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports1';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
        setInterval(() => {
            if($('.popover-header').is(':visible')){
                for(var i=0; i<=12; i++){
                    if(table1.column(i).visible()){
                        $('#filter-'+i).prop('checked', true);
                    }
                    else{
                        $('#filter-'+i).prop('checked', false);
                    }
                }
            }
        }, 0);
    }
    else if($('#report_category').val() == 'PRODUCT' || $('#report_category').val() == 'COMBO MEAL' || $('#report_category').val() == 'PROMO'){
        $('#loading').show();
        if($('#report_category').val() == 'PRODUCT'){
            included = $('#product').val();
            byWhat = 'product';
        }
        if($('#report_category').val() == 'COMBO MEAL'){
            included = $('#combo').val();
            byWhat = 'combo';
        }
        if($('#report_category').val() == 'PROMO'){
            included = $('#promo').val();
            byWhat = 'promo';
        }
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReports1" id="tblReports1" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="1" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="2" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="3" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="4" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="5" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>CATEGORY</th>
                        <th>ITEM CODE</th>
                        <th>SHORT DESCRIPTION</th>
                        <th>LONG DESCRIPTION</th>
                        <th>QTY</th>
                        <th class="sum">GROSS SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right" colspan="5">TOTAL:</th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable1').append(htmlString);
        table1 = $('table.tblReports1').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: reports_header,
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/sales/reports/product',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    included: included,
                    byWhat: byWhat
                }
            },
            autoWidth: false,
            columns: [
                { data: 'itemcat' },
                { data: 'itemcode' },
                { data: 'desc1' },
                {
                    data: 'desc2',
                    "render": function(data, type, row, meta){
                        return `<div class="wrap-content" style="width: 300px !important;">${data}</div>`;
                    }
                },
                {
                    data: 'quantity',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${data.toLocaleString()}</span>`;
                    }
                },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                }
            ],
            order: [],
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[^\d.-]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                api.columns('.sum',{page:'all'}).every(function(){
                var sum=this
                    .data()
                    .reduce(function(a,b){
                        return intVal(a)+intVal(b);
                    },0);
                    sum=Number(sum).toFixed(2);
                    sum=sum.toString();
                    var pattern=/(-?\d+)(\d{3})/;
                    while(pattern.test(sum))
                    sum=sum.replace(pattern,"$1,$2");
                    this.footer().innerHTML='₱ '+sum;
                });
            },
            initComplete: function(){
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports1';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_category').val() == 'TRANSACTION TYPE'){
        $('#loading').show();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReports1" id="tblReports1" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="1" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="2" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="3" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>TRANSACTION TYPE</th>
                        <th class="sum">GROSS SALES</th>
                        <th class="sum">TOTAL SALES</th>
                        <th class="sum">NET SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable1').append(htmlString);
        table1 = $('table.tblReports1').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: reports_header,
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/sales/reports/transaction',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    included: $('#transactiontype').val()
                }
            },
            autoWidth: false,
            columns: [
                { data: 'transaction_name' },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
                    }
                }
            ],
            order: [],
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[^\d.-]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                api.columns('.sum',{page:'all'}).every(function(){
                var sum=this
                    .data()
                    .reduce(function(a,b){
                        return intVal(a)+intVal(b);
                    },0);
                    sum=Number(sum).toFixed(2);
                    sum=sum.toString();
                    var pattern=/(-?\d+)(\d{3})/;
                    while(pattern.test(sum))
                    sum=sum.replace(pattern,"$1,$2");
                    this.footer().innerHTML='₱ '+sum;
                });
            },
            initComplete: function(){
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports1';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_category').val() == 'TENDER TYPE'){
        $('#loading').show();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReports1" id="tblReports1" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="1" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>TENDER TYPE</th>
                        <th class="sum">GROSS SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable1').append(htmlString);
        table1 = $('table.tblReports1').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: reports_header,
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/sales/reports/tender',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    included: $('#tendertype').val()
                }
            },
            autoWidth: false,
            columns: [
                { data: 'tendname' },
                {
                    data: 'total',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                }
            ],
            order: [],
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[^\d.-]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                api.columns('.sum',{page:'all'}).every(function(){
                var sum=this
                    .data()
                    .reduce(function(a,b){
                        return intVal(a)+intVal(b);
                    },0);
                    sum=Number(sum).toFixed(2);
                    sum=sum.toString();
                    var pattern=/(-?\d+)(\d{3})/;
                    while(pattern.test(sum))
                    sum=sum.replace(pattern,"$1,$2");
                    this.footer().innerHTML='₱ '+sum;
                });
            },
            initComplete: function(){
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports1';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_category').val() == 'DISCOUNT'){
        $('#loading').show();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReports1" id="tblReports1" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="1" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="2" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="3" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>DISCOUNT TYPE</th>
                        <th class="sum">GROSS SALES</th>
                        <th class="sum">TOTAL SALES</th>
                        <th class="sum">NET SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable1').append(htmlString);
        table1 = $('table.tblReports1').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: reports_header,
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/sales/reports/discount',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    included: $('#discounttype').val()
                }
            },
            autoWidth: false,
            columns: [
                { data: 'discount_name' },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
                    }
                }
            ],
            order: [],
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[^\d.-]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                api.columns('.sum',{page:'all'}).every(function(){
                var sum=this
                    .data()
                    .reduce(function(a,b){
                        return intVal(a)+intVal(b);
                    },0);
                    sum=Number(sum).toFixed(2);
                    sum=sum.toString();
                    var pattern=/(-?\d+)(\d{3})/;
                    while(pattern.test(sum))
                    sum=sum.replace(pattern,"$1,$2");
                    this.footer().innerHTML='₱ '+sum;
                });
            },
            initComplete: function(){
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports1';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else{
        Swal.fire('UNAVAILABLE', 'This Report Category is not yet available!', 'error');
    }
});

var headername, datacode, selected_date;
$(document).on('click','table.tblReports1 tbody tr',function(){
    $('#loading').show();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    emptyQuantitative();

    var report_category = $('#report_category').val();
    var data = table1.row(this).data();
    if(report_category == 'STORE'){
        datacode = data.branch_code;
        headername = data.branch_name;
        urlName = '/sales/reports/branch/date';
        colData = datacode;
        report_datesA(datacode, headername, urlName, colData);
    }
    else if(report_category == 'PRODUCT'){
        datacode = data.itemcode;
        headername = data.itemcode+': '+data.desc1;
        urlName = '/sales/reports/product/date';
        colData = datacode;
        report_datesB(datacode, headername, urlName, colData);
    }
    else if(report_category == 'COMBO MEAL'){
        datacode = data.itemcode;
        headername = data.itemcode+': '+data.desc1;
        urlName = '/sales/reports/product/date';
        colData = datacode;
        report_datesB(datacode, headername, urlName, colData);
    }
    else if(report_category == 'PROMO'){
        datacode = data.itemcode;
        headername = data.itemcode+': '+data.desc1;
        urlName = '/sales/reports/product/date';
        colData = datacode;
        report_datesB(datacode, headername, urlName, colData);
    }
    else if(report_category == 'TRANSACTION TYPE'){
        datacode = data.transaction_name;
        headername = data.transaction_name;
        urlName = '/sales/reports/transaction/date';
        colData = datacode;
        report_datesA(datacode, headername, urlName, colData);
    }
    else if(report_category == 'TENDER TYPE'){
        datacode = data.tendname;
        headername = data.tendname;
        urlName = '/sales/reports/tender/date';
        colData = datacode;
        report_datesC(datacode, headername, urlName, colData);
    }
    else if(report_category == 'DISCOUNT'){
        datacode = data.discount_name;
        headername = data.discount_name;
        urlName = '/sales/reports/discount/date';
        colData = datacode;
        report_datesA(datacode, headername, urlName, colData);
    }
    else{
        $('#loading').hide();
        Swal.fire('UNAVAILABLE', 'This data breakdown is not yet available!', 'error');
        return false;
    }
});

function report_datesA(datacode, headername, urlName, colData){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var htmlString = `<hr><div class="px-2 align-content"><h4>${headername} (${display_range})</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(1).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReports2" id="tblReports2" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-input2" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2" data-column="2" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2" data-column="3" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2" data-column="4" style="border:1px solid #808080"/>
                    </td>
                </tr>
                <tr>
                    <th>DATE</th>
                    <th>DAY</th>
                    <th class="sum">GROSS SALES</th>
                    <th class="sum">TOTAL SALES</th>
                    <th class="sum">NET SALES</th>
                </tr>
            </thead>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right" colspan="2">TOTAL:</th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable2').append(htmlString);
    table2 = $('table.tblReports2').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: headername+' ('+display_range+')',
            exportOptions: {
                modifier : {
                    order : 'index',
                    page : 'all',
                    search : 'none'
                },
            },
        }],
        aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
        processing: true,
        serverSide: false,
        ajax: {
            url: urlName,
            data:{
                colData: colData,
                start_date: $('#start_date').val(),
                end_date: $('#end_date').val()
            }
        },
        columnDefs: [
            {
                "targets": [0],
                "render": $.fn.dataTable.render.moment('YYYY-MM-DD', 'MMMM DD, YYYY')
            },
            {
                "targets": [1],
                "render": $.fn.dataTable.render.moment('YYYY-MM-DD', 'dddd')
            }
        ],
        columns: [
            { data: 'date' },
            { data: 'date' },
            {
                data: 'gross_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                }
            },
            {
                data: 'total_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                }
            },
            {
                data: 'net_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
                }
            }
        ],
        footerCallback:function(row,data,start,end,display){
            var api=this.api(),data;
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[^\d.-]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            api.columns('.sum',{page:'all'}).every(function(){
            var sum=this
                .data()
                .reduce(function(a,b){
                    return intVal(a)+intVal(b);
                },0);
                sum=Number(sum).toFixed(2);
                sum=sum.toString();
                var pattern=/(-?\d+)(\d{3})/;
                while(pattern.test(sum))
                sum=sum.replace(pattern,"$1,$2");
                this.footer().innerHTML='₱ '+sum;
            });
        },
        initComplete: function(){
            $('#loading').hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports2';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

function report_datesB(datacode, headername, urlName, colData){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var htmlString = `<hr><div class="px-2 align-content"><h4>${headername} (${display_range})</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(1).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReports2" id="tblReports2" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-input2" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2" data-column="2" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2" data-column="3" style="border:1px solid #808080"/>
                    </td>
                </tr>
                <tr>
                    <th>DATE</th>
                    <th>DAY</th>
                    <th>QTY</th>
                    <th class="sum">GROSS SALES</th>
                </tr>
            </thead>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right" colspan="3">TOTAL:</th>
                    <th class="text-right sum"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable2').append(htmlString);
    table2 = $('table.tblReports2').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: headername+' ('+display_range+')',
            exportOptions: {
                modifier : {
                    order : 'index',
                    page : 'all',
                    search : 'none'
                },
            },
        }],
        aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
        processing: true,
        serverSide: false,
        ajax: {
            url: urlName,
            data:{
                colData: colData,
                start_date: $('#start_date').val(),
                end_date: $('#end_date').val()
            }
        },
        columnDefs: [
            {
                "targets": [0],
                "render": $.fn.dataTable.render.moment('YYYY-MM-DD', 'MMMM DD, YYYY')
            },
            {
                "targets": [1],
                "render": $.fn.dataTable.render.moment('YYYY-MM-DD', 'dddd')
            }
        ],
        columns: [
            { data: 'date' },
            { data: 'date' },
            {
                data: 'quantity',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${data.toLocaleString()}</span>`;
                }
            },
            {
                data: 'gross_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                }
            }
        ],
        footerCallback:function(row,data,start,end,display){
            var api=this.api(),data;
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[^\d.-]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            api.columns('.sum',{page:'all'}).every(function(){
            var sum=this
                .data()
                .reduce(function(a,b){
                    return intVal(a)+intVal(b);
                },0);
                sum=Number(sum).toFixed(2);
                sum=sum.toString();
                var pattern=/(-?\d+)(\d{3})/;
                while(pattern.test(sum))
                sum=sum.replace(pattern,"$1,$2");
                this.footer().innerHTML='₱ '+sum;
            });
        },
        initComplete: function(){
            $('#loading').hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports2';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

function report_datesC(datacode, headername, urlName, colData){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var htmlString = `<hr><div class="px-2 align-content"><h4>${headername} (${display_range})</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(1).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReports2" id="tblReports2" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-input2" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2" data-column="2" style="border:1px solid #808080"/>
                    </td>
                </tr>
                <tr>
                    <th>DATE</th>
                    <th>DAY</th>
                    <th class="sum">GROSS SALES</th>
                </tr>
            </thead>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right" colspan="2">TOTAL:</th>
                    <th class="text-right sum"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable2').append(htmlString);
    table2 = $('table.tblReports2').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: headername+' ('+display_range+')',
            exportOptions: {
                modifier : {
                    order : 'index',
                    page : 'all',
                    search : 'none'
                },
            },
        }],
        aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
        processing: true,
        serverSide: false,
        ajax: {
            url: urlName,
            data:{
                colData: colData,
                start_date: $('#start_date').val(),
                end_date: $('#end_date').val()
            }
        },
        columnDefs: [
            {
                "targets": [0],
                "render": $.fn.dataTable.render.moment('YYYY-MM-DD', 'MMMM DD, YYYY')
            },
            {
                "targets": [1],
                "render": $.fn.dataTable.render.moment('YYYY-MM-DD', 'dddd')
            }
        ],
        columns: [
            { data: 'tdate' },
            { data: 'tdate' },
            {
                data: 'total',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                }
            }
        ],
        footerCallback:function(row,data,start,end,display){
            var api=this.api(),data;
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[^\d.-]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            api.columns('.sum',{page:'all'}).every(function(){
            var sum=this
                .data()
                .reduce(function(a,b){
                    return intVal(a)+intVal(b);
                },0);
                sum=Number(sum).toFixed(2);
                sum=sum.toString();
                var pattern=/(-?\d+)(\d{3})/;
                while(pattern.test(sum))
                sum=sum.replace(pattern,"$1,$2");
                this.footer().innerHTML='₱ '+sum;
            });
        },
        initComplete: function(){
            $('#loading').hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports2';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

$(document).on('click','table.tblReports2 tbody tr',function(){
    var report_category = $('#report_category').val();
    var data = table2.row(this).data();
    selected_date = data.date;
    if(report_category == 'STORE'){
        $('#loading').show();
        $('#reportsTable3').empty();
        $('#reportsTable4').empty();
        $('#reportsTable5').empty();
        $('#reportsTable6').empty();
        $('#reportsTable7').empty();
        emptyQuantitative();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headername">${headername} <span id="headerdate">(${formatDate(data.date).toUpperCase()})</span> - Per Product</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(2).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReports3" id="tblReports3" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="1" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="2" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="3" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="4" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="5" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>CATEGORY</th>
                        <th>ITEM CODE</th>
                        <th>SHORT DESCRIPTION</th>
                        <th>LONG DESCRIPTION</th>
                        <th>QTY</th>
                        <th class="sum">GROSS SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right" colspan="5">TOTAL:</th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable3').append(htmlString);
        table3 = $('table.tblReports3').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#headername').text(),
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/sales/reports/branch/product',
                data:{
                    datacode: datacode,
                    selected_date: selected_date,
                }
            },
            autoWidth: false,
            columns: [
                { data: 'itemcat' },
                { data: 'itemcode' },
                { data: 'desc1' },
                {
                    data: 'desc2',
                    "render": function(data, type, row, meta){
                        return `<div class="wrap-content" style="width: 300px !important;">${data}</div>`;
                    }
                },
                {
                    data: 'quantity',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${data.toLocaleString()}</span>`;
                    }
                },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                }
            ],
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[^\d.-]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                api.columns('.sum',{page:'all'}).every(function(){
                var sum=this
                    .data()
                    .reduce(function(a,b){
                        return intVal(a)+intVal(b);
                    },0);
                    sum=Number(sum).toFixed(2);
                    sum=sum.toString();
                    var pattern=/(-?\d+)(\d{3})/;
                    while(pattern.test(sum))
                    sum=sum.replace(pattern,"$1,$2");
                    this.footer().innerHTML='₱ '+sum;
                });
            },
            initComplete: function(){
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports3';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                    urlName = '/sales/reports/time_A';
                    tblType = 'storecode';
                    colData = datacode;
                    selected_date = data.date;
                    report_hoursA(headername, urlName, tblType, colData, selected_date);
                }, 200);
            }
        });
    }
    else if(report_category == 'PRODUCT' || report_category == 'COMBO MEAL' || report_category == 'PROMO'){
        $('#loading').show();
        $('#reportsTable3').empty();
        $('#reportsTable4').empty();
        $('#reportsTable5').empty();
        $('#reportsTable6').empty();
        $('#reportsTable7').empty();
        emptyQuantitative();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headername">${headername} <span id="headerdate">(${formatDate(data.date).toUpperCase()})</span> - Per Store</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(2).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReports3" id="tblReports3" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="1" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="2" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>BRANCH NAME</th>
                        <th>QTY</th>
                        <th class="sum">GROSS SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right" colspan="2">TOTAL:</th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable3').append(htmlString);
        table3 = $('table.tblReports3').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#headername').text(),
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/sales/reports/product/branch',
                data:{
                    datacode: datacode,
                    selected_date: selected_date,
                }
            },
            autoWidth: false,
            columns: [
                { data: 'branch_name' },
                {
                    data: 'quantity',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${data.toLocaleString()}</span>`;
                    }
                },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                }
            ],
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[^\d.-]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                api.columns('.sum',{page:'all'}).every(function(){
                var sum=this
                    .data()
                    .reduce(function(a,b){
                        return intVal(a)+intVal(b);
                    },0);
                    sum=Number(sum).toFixed(2);
                    sum=sum.toString();
                    var pattern=/(-?\d+)(\d{3})/;
                    while(pattern.test(sum))
                    sum=sum.replace(pattern,"$1,$2");
                    this.footer().innerHTML='₱ '+sum;
                });
            },
            initComplete: function(){
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports3';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                    urlName = '/sales/reports/time_B';
                    tblType = 'itemcode';
                    colData = datacode;
                    selected_date = data.date;
                    report_hoursB(headername, urlName, tblType, colData, selected_date);
                }, 200);
            }
        });
    }
    else if(report_category == 'TRANSACTION TYPE'){
        $('#loading').show();
        $('#reportsTable3').empty();
        $('#reportsTable4').empty();
        $('#reportsTable5').empty();
        $('#reportsTable6').empty();
        $('#reportsTable7').empty();
        emptyQuantitative();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headername">${headername} <span id="headerdate">(${formatDate(data.date).toUpperCase()})</span> - Per Product</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(2).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReports3" id="tblReports3" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="1" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="2" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="3" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="4" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="5" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>CATEGORY</th>
                        <th>ITEM CODE</th>
                        <th>SHORT DESCRIPTION</th>
                        <th>LONG DESCRIPTION</th>
                        <th>QTY</th>
                        <th class="sum">GROSS SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right" colspan="5">TOTAL:</th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable3').append(htmlString);
        table3 = $('table.tblReports3').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#headername').text(),
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/sales/reports/transaction/product',
                data:{
                    datacode: datacode,
                    selected_date: selected_date,
                }
            },
            autoWidth: false,
            columns: [
                { data: 'itemcat' },
                { data: 'itemcode' },
                { data: 'desc1' },
                {
                    data: 'desc2',
                    "render": function(data, type, row, meta){
                        return `<div class="wrap-content" style="width: 300px !important;">${data}</div>`;
                    }
                },
                {
                    data: 'quantity',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${data.toLocaleString()}</span>`;
                    }
                },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                }
            ],
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[^\d.-]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                api.columns('.sum',{page:'all'}).every(function(){
                var sum=this
                    .data()
                    .reduce(function(a,b){
                        return intVal(a)+intVal(b);
                    },0);
                    sum=Number(sum).toFixed(2);
                    sum=sum.toString();
                    var pattern=/(-?\d+)(\d{3})/;
                    while(pattern.test(sum))
                    sum=sum.replace(pattern,"$1,$2");
                    this.footer().innerHTML='₱ '+sum;
                });
            },
            initComplete: function(){
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports3';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                    urlName = '/sales/reports/time_A';
                    tblType = 'trantype';
                    colData = datacode;
                    selected_date = data.date;
                    report_hoursA(headername, urlName, tblType, colData, selected_date);
                }, 200);
            }
        });
    }
    else if(report_category == 'TENDER TYPE'){
        $('#loading').show();
        $('#reportsTable3').empty();
        $('#reportsTable4').empty();
        $('#reportsTable5').empty();
        $('#reportsTable6').empty();
        $('#reportsTable7').empty();
        emptyQuantitative();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headername">${headername} <span id="headerdate">(${formatDate(data.tdate).toUpperCase()})</span> - Per Store</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(2).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReports3" id="tblReports3" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="1" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>BRANCH NAME</th>
                        <th class="sum">GROSS SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable3').append(htmlString);
        table3 = $('table.tblReports3').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#headername').text(),
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/sales/reports/tender/branch',
                data:{
                    datacode: datacode,
                    selected_date: data.tdate,
                }
            },
            autoWidth: false,
            columns: [
                { data: 'branch_name' },
                {
                    data: 'total',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                }
            ],
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[^\d.-]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                api.columns('.sum',{page:'all'}).every(function(){
                var sum=this
                    .data()
                    .reduce(function(a,b){
                        return intVal(a)+intVal(b);
                    },0);
                    sum=Number(sum).toFixed(2);
                    sum=sum.toString();
                    var pattern=/(-?\d+)(\d{3})/;
                    while(pattern.test(sum))
                    sum=sum.replace(pattern,"$1,$2");
                    this.footer().innerHTML='₱ '+sum;
                });
            },
            initComplete: function(){
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports3';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                    urlName = '/sales/reports/time_C';
                    tblType = 'tendname';
                    colData = datacode;
                    selected_date = data.tdate;
                    report_hoursC(headername, urlName, tblType, colData, selected_date);
                }, 200);
            }
        });
    }
    else if(report_category == 'DISCOUNT'){
        $('#loading').show();
        $('#reportsTable3').empty();
        $('#reportsTable4').empty();
        $('#reportsTable5').empty();
        $('#reportsTable6').empty();
        $('#reportsTable7').empty();
        emptyQuantitative();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headername">${headername} <span id="headerdate">(${formatDate(data.date).toUpperCase()})</span> - Per Store</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(2).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReports3" id="tblReports3" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="1" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="2" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="3" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>BRANCH NAME</th>
                        <th class="sum">GROSS SALES</th>
                        <th class="sum">TOTAL SALES</th>
                        <th class="sum">NET SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable3').append(htmlString);
        table3 = $('table.tblReports3').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#headername').text(),
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/sales/reports/discount/branch',
                data:{
                    datacode: datacode,
                    selected_date: selected_date,
                }
            },
            autoWidth: false,
            columns: [
                { data: 'branch_name' },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                }
            ],
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[^\d.-]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                api.columns('.sum',{page:'all'}).every(function(){
                var sum=this
                    .data()
                    .reduce(function(a,b){
                        return intVal(a)+intVal(b);
                    },0);
                    sum=Number(sum).toFixed(2);
                    sum=sum.toString();
                    var pattern=/(-?\d+)(\d{3})/;
                    while(pattern.test(sum))
                    sum=sum.replace(pattern,"$1,$2");
                    this.footer().innerHTML='₱ '+sum;
                });
            },
            initComplete: function(){
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports3';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                    urlName = '/sales/reports/time_A';
                    tblType = 'discname';
                    colData = datacode;
                    selected_date = data.date;
                    report_hoursA(headername, urlName, tblType, colData, selected_date);
                }, 200);
            }
        });
    }
    else{
        Swal.fire('UNAVAILABLE', 'This data breakdown is not yet available!', 'error');
        return false;
    }
});

function report_hoursA(headername, urlName, tblType, colData, selected_date){
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    emptyQuantitative();

    var htmlString = `<hr><div class="px-2 align-content"><h4 id="headerlast">${headername} ${$('#headerdate').text()} - Per Hour</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(3).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReports4" id="tblReports4" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-input4" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input4" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input4" data-column="2" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input4" data-column="3" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input4" data-column="4" style="border:1px solid #808080"/>
                    </td>
                </tr>
                <tr>
                    <th>TIME</th>
                    <th>NO. OF TRANSACTIONS</th>
                    <th class="sum">GROSS SALES</th>
                    <th class="sum">TOTAL SALES</th>
                    <th class="sum">NET SALES</th>
                </tr>
            </thead>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right" colspan="2">TOTAL:</th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable4').append(htmlString);
    table4 = $('table.tblReports4').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: $('#headerlast').text(),
            exportOptions: {
                modifier : {
                    order : 'index',
                    page : 'all',
                    search : 'none'
                },
            },
        }],
        aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
        iDisplayLength: -1,
        processing: true,
        serverSide: false,
        ajax: {
            url: urlName,
            data:{
                tblType: tblType,
                colData: colData,
                selected_date: selected_date
            }
        },
        columns: [
            {
                data: 'time_range_12hr',
                "render": function(data, type, row, meta){
                    return `<span class="d-none">${row.time_range_24hr}</span>`+row.time_range_12hr;
                }
            },
            {
                data: 'tno',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${data}</span>`;
                }
            },
            {
                data: 'gross_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                }
            },
            {
                data: 'total_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                }
            },
            {
                data: 'net_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
                }
            }
        ],
        footerCallback:function(row,data,start,end,display){
            var api=this.api(),data;
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[^\d.-]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            api.columns('.sum',{page:'all'}).every(function(){
            var sum=this
                .data()
                .reduce(function(a,b){
                    return intVal(a)+intVal(b);
                },0);
                sum=Number(sum).toFixed(2);
                sum=sum.toString();
                var pattern=/(-?\d+)(\d{3})/;
                while(pattern.test(sum))
                sum=sum.replace(pattern,"$1,$2");
                this.footer().innerHTML='₱ '+sum;
            });
        },
        initComplete: function(){
            $('#loading').hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports4';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

function report_hoursB(headername, urlName, tblType, colData, selected_date){
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    emptyQuantitative();

    var htmlString = `<hr><div class="px-2 align-content"><h4 id="headerlast">${headername} ${$('#headerdate').text()} - Per Hour</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(3).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReports4" id="tblReports4" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-input4" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input4" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input4" data-column="2" style="border:1px solid #808080"/>
                    </td>
                </tr>
                <tr>
                    <th>TIME</th>
                    <th>QTY</th>
                    <th class="sum">GROSS SALES</th>
                </tr>
            </thead>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right" colspan="2">TOTAL:</th>
                    <th class="text-right sum"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable4').append(htmlString);
    table4 = $('table.tblReports4').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: $('#headerlast').text(),
            exportOptions: {
                modifier : {
                    order : 'index',
                    page : 'all',
                    search : 'none'
                },
            },
        }],
        aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
        iDisplayLength: -1,
        processing: true,
        serverSide: false,
        ajax: {
            url: urlName,
            data:{
                tblType: tblType,
                colData: colData,
                selected_date: selected_date
            }
        },
        columns: [
            {
                data: 'time_range_12hr',
                "render": function(data, type, row, meta){
                    return `<span class="d-none">${row.time_range_24hr}</span>`+row.time_range_12hr;
                }
            },
            {
                data: 'quantity',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${data.toLocaleString()}</span>`;
                }
            },
            {
                data: 'gross_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                }
            }
        ],
        footerCallback:function(row,data,start,end,display){
            var api=this.api(),data;
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[^\d.-]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            api.columns('.sum',{page:'all'}).every(function(){
            var sum=this
                .data()
                .reduce(function(a,b){
                    return intVal(a)+intVal(b);
                },0);
                sum=Number(sum).toFixed(2);
                sum=sum.toString();
                var pattern=/(-?\d+)(\d{3})/;
                while(pattern.test(sum))
                sum=sum.replace(pattern,"$1,$2");
                this.footer().innerHTML='₱ '+sum;
            });
        },
        initComplete: function(){
            $('#loading').hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports4';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

function report_hoursC(headername, urlName, tblType, colData, selected_date){
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    emptyQuantitative();

    var htmlString = `<hr><div class="px-2 align-content"><h4 id="headerlast">${headername} ${$('#headerdate').text()} - Per Hour</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(3).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReports4" id="tblReports4" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-input4" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input4" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input4" data-column="2" style="border:1px solid #808080"/>
                    </td>
                </tr>
                <tr>
                    <th>TIME</th>
                    <th>NO. OF TRANSACTIONS</th>
                    <th class="sum">GROSS SALES</th>
                </tr>
            </thead>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right" colspan="2">TOTAL:</th>
                    <th class="text-right sum"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable4').append(htmlString);
    table4 = $('table.tblReports4').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: $('#headerlast').text(),
            exportOptions: {
                modifier : {
                    order : 'index',
                    page : 'all',
                    search : 'none'
                },
            },
        }],
        aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
        iDisplayLength: -1,
        processing: true,
        serverSide: false,
        ajax: {
            url: urlName,
            data:{
                tblType: tblType,
                colData: colData,
                selected_date: selected_date
            }
        },
        columns: [
            {
                data: 'time_range_12hr',
                "render": function(data, type, row, meta){
                    return `<span class="d-none">${row.time_range_24hr}</span>`+row.time_range_12hr;
                }
            },
            {
                data: 'tno',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${data}</span>`;
                }
            },
            {
                data: 'total',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                }
            }
        ],
        footerCallback:function(row,data,start,end,display){
            var api=this.api(),data;
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[^\d.-]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            api.columns('.sum',{page:'all'}).every(function(){
            var sum=this
                .data()
                .reduce(function(a,b){
                    return intVal(a)+intVal(b);
                },0);
                sum=Number(sum).toFixed(2);
                sum=sum.toString();
                var pattern=/(-?\d+)(\d{3})/;
                while(pattern.test(sum))
                sum=sum.replace(pattern,"$1,$2");
                this.footer().innerHTML='₱ '+sum;
            });
        },
        initComplete: function(){
            $('#loading').hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports4';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

$(document).on('click','table.tblReports4 tbody tr',function(){
    var report_category = $('#report_category').val();
    var data = table4.row(this).data();
    var selected_time = data.time_range_24hr.split(' - ');
    var start_hour = selected_time[0];
    var end_hour = selected_time[1];
    if(report_category == 'STORE'){
        $('#loading').show();
        $('#reportsTable5').empty();
        $('#reportsTable6').empty();
        $('#reportsTable7').empty();
        emptyQuantitative();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="header5">${headername} (${formatDate(selected_date).toUpperCase()}) (${data.time_range_12hr})</span> - Product Sales</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(4).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReports5" id="tblReports5" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-input5" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input5" data-column="1" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input5" data-column="2" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input5" data-column="3" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input5" data-column="4" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input5" data-column="5" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>CATEGORY</th>
                        <th>ITEM CODE</th>
                        <th>SHORT DESCRIPTION</th>
                        <th>LONG DESCRIPTION</th>
                        <th>QTY</th>
                        <th class="sum">GROSS SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right" colspan="5">TOTAL:</th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable5').append(htmlString);
        table5 = $('table.tblReports5').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#header5').text(),
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/sales/reports/branch/datetime/product',
                data:{
                    datacode: datacode,
                    selected_date: selected_date,
                    start_hour: start_hour,
                    end_hour: end_hour
                }
            },
            autoWidth: false,
            columns: [
                { data: 'itemcat' },
                { data: 'itemcode' },
                { data: 'desc1' },
                {
                    data: 'desc2',
                    "render": function(data, type, row, meta){
                        return `<div class="wrap-content" style="width: 300px !important;">${data}</div>`;
                    }
                },
                {
                    data: 'quantity',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${data.toLocaleString()}</span>`;
                    }
                },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                }
            ],
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[^\d.-]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                api.columns('.sum',{page:'all'}).every(function(){
                var sum=this
                    .data()
                    .reduce(function(a,b){
                        return intVal(a)+intVal(b);
                    },0);
                    sum=Number(sum).toFixed(2);
                    sum=sum.toString();
                    var pattern=/(-?\d+)(\d{3})/;
                    while(pattern.test(sum))
                    sum=sum.replace(pattern,"$1,$2");
                    this.footer().innerHTML='₱ '+sum;
                });
            },
            initComplete: function(){
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports5';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if(report_category == 'TRANSACTION TYPE'){
        $('#loading').show();
        $('#reportsTable5').empty();
        $('#reportsTable6').empty();
        $('#reportsTable7').empty();
        emptyQuantitative();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="header5">${headername} (${formatDate(selected_date).toUpperCase()}) (${data.time_range_12hr})</span> - Product Sales</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(4).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReports5" id="tblReports5" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-input5" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input5" data-column="1" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input5" data-column="2" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input5" data-column="3" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input5" data-column="4" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input5" data-column="5" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>CATEGORY</th>
                        <th>ITEM CODE</th>
                        <th>SHORT DESCRIPTION</th>
                        <th>LONG DESCRIPTION</th>
                        <th>QTY</th>
                        <th class="sum">GROSS SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right" colspan="5">TOTAL:</th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable5').append(htmlString);
        table5 = $('table.tblReports5').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#header5').text(),
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/sales/reports/transaction/datetime/product',
                data:{
                    datacode: datacode,
                    selected_date: selected_date,
                    start_hour: start_hour,
                    end_hour: end_hour
                }
            },
            autoWidth: false,
            columns: [
                { data: 'itemcat' },
                { data: 'itemcode' },
                { data: 'desc1' },
                {
                    data: 'desc2',
                    "render": function(data, type, row, meta){
                        return `<div class="wrap-content" style="width: 300px !important;">${data}</div>`;
                    }
                },
                {
                    data: 'quantity',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${data.toLocaleString()}</span>`;
                    }
                },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                }
            ],
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[^\d.-]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                api.columns('.sum',{page:'all'}).every(function(){
                var sum=this
                    .data()
                    .reduce(function(a,b){
                        return intVal(a)+intVal(b);
                    },0);
                    sum=Number(sum).toFixed(2);
                    sum=sum.toString();
                    var pattern=/(-?\d+)(\d{3})/;
                    while(pattern.test(sum))
                    sum=sum.replace(pattern,"$1,$2");
                    this.footer().innerHTML='₱ '+sum;
                });
            },
            initComplete: function(){
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports5';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
});

$(document).on('keyup search','.filter-input1', function(){
    table1.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-input2', function(){
    table2.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-input3', function(){
    table3.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-input4', function(){
    table4.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-input5', function(){
    table5.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-input6', function(){
    table6.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-input7', function(){
    table7.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-inputY', function(){
    tableY.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-inputZ', function(){
    tableZ.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-inputA', function(){
    tableA.column($(this).data('column')).search($(this).val()).draw();
});

setInterval(() => {
    if(!$('#reportsTable1').is(':empty') && $('#report_category').val() == 'STORE'){
        $('.reportsTable1').show();
    }
    else{
        $('.reportsTable1').hide();
    }
}, 0);

setInterval(() => {
    if(!$('#reportsTableX').is(':empty')){
        $('#reportsTableX').show();
        $('#reportsTypeA').hide();
    }
    else{
        $('#reportsTableX').hide();
        $('#reportsTypeA').show();
    }
}, 0);

$('a[href="#"]').click(function(event){
    event.preventDefault();
});

$('body').on('click', '.checkboxFilter', function(){
    var column = table1.column($(this).attr('data-column'));
    var colnum = $(this).attr('data-column');
    column.visible(!column.visible());
    $('.fl-'+colnum).val('');
    table1.column(colnum).search('').draw();
});

function changeComparative(){
    $('#branch').change();
    $('#product').change();
    $('#combo').change();
    $('#promo').change();
    $('#transactiontype').change();
    $('#tendertype').change();
    $('#discounttype').change();
}

function emptyQuantitative(){
    $('#reportsTableX').empty();
    $('#reportsTableY').empty();
    $('#reportsTableZ').empty();
    $('#reportsTableA').empty();
}

function emptyStandard(){
    $('#reportsTable1').empty();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
}