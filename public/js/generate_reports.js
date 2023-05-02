$(document).prop('title', $('#page-name').text());
$(document).ready(function(){
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

    $('#start_date').val(startDateValue);
    $('#end_date').val(endDateValue);

    $('#report_category').val('STORE');
    $('#btnGenerate').click();
});


$('#btnReset').on('click', function(){
    $('.req').hide();
    $('#formReports').trigger('reset');
    $('#report_type').change();
    $('#reportsTable1').empty();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
});

$('#report_category').on('change', function(){
    $('#reportsTable1').empty();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
});

$('#start_date').on('change', function(){
    $('#end_date').val('');
    if($(this).val()){
        $('#end_date').attr('min', $(this).val());
    }
});

$('#end_date').on('change', function(){
    if($(this).val() < $('#start_date').val()){
        $(this).val('');
        Swal.fire('INVALID DATE', '', 'error');
    }
});

var table1, table2, table3;
$('#btnGenerate').on('click', function(){
    $('#reportsTable1').empty();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();

    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var reports_header = $('#report_category option:selected').text()+' ('+display_range+')';
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
                    </tr>
                    <tr>
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
                        <th class="text-right" colspan="9">TOTAL:</th>
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
                    end_date: $('#end_date').val()
                }
            },
            columnDefs: [
                {
                    "targets": [1,2,6,7,8],
                    "visible": false,
                    "searchable": true
                },
            ],
            columns: [
                { data: 'branch_name' },
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
                for(var i=0; i<=11; i++){
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
    else if($('#report_category').val() == 'PRODUCT'){
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
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="3" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="3" style="border:1px solid #808080"/>
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
                    end_date: $('#end_date').val()
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
    else if($('#report_category').val() == 'COMBO MEAL'){
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
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="3" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="3" style="border:1px solid #808080"/>
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
                url: '/sales/reports/combo',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val()
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
                    end_date: $('#end_date').val()
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
    else{
        Swal.fire('UNAVAILABLE', 'This Report Category is not yet available!', 'error');
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

var headername, datacode;
$(document).on('click','table.tblReports1 tbody tr',function(){
    $('#loading').show();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
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
        urlName = '/sales/reports/combo/date';
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
                </tr>
                <tr>
                    <th>DATE</th>
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
        ],
        columns: [
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
                </tr>
                <tr>
                    <th>DATE</th>
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
        ],
        columns: [
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

$(document).on('click','table.tblReports2 tbody tr',function(){
    var report_category = $('#report_category').val();
    var data = table2.row(this).data();
    if(report_category == 'STORE'){
        var headerdate = headername + ' ('+formatDate(data.date).toUpperCase()+')';
        $('#loading').show();
        $('#reportsTable3').empty();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${headerdate}</h4>
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
                            <input type="search" class="form-control filter-input3" data-column="3" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-input3" data-column="3" style="border:1px solid #808080"/>
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
                <!-- <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right" colspan="5">TOTAL:</th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>-->
            </table>
            <br>
        </div>`;
        $('#reportsTable3').append(htmlString);
        table3 = $('table.tblReports3').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: headerdate,
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
                    selected_date: data.date,
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
            // footerCallback:function(row,data,start,end,display){
            //     var api=this.api(),data;
            //     var intVal = function ( i ) {
            //         return typeof i === 'string' ?
            //             i.replace(/[^\d.-]/g, '')*1 :
            //             typeof i === 'number' ?
            //                 i : 0;
            //     };
            //     api.columns('.sum',{page:'all'}).every(function(){
            //     var sum=this
            //         .data()
            //         .reduce(function(a,b){
            //             return intVal(a)+intVal(b);
            //         },0);
            //         sum=Number(sum).toFixed(2);
            //         sum=sum.toString();
            //         var pattern=/(-?\d+)(\d{3})/;
            //         while(pattern.test(sum))
            //         sum=sum.replace(pattern,"$1,$2");
            //         this.footer().innerHTML='₱ '+sum;
            //     });
            // },
            initComplete: function(){
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports3';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if(report_category == 'PRODUCT'){
        var headerdate = headername + ' ('+formatDate(data.date).toUpperCase()+')';
        $('#loading').show();
        $('#reportsTable3').empty();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${headerdate}</h4>
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
                title: headerdate,
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
                    selected_date: data.date,
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
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports3';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if(report_category == 'COMBO MEAL'){
        var headerdate = headername + ' ('+formatDate(data.date).toUpperCase()+')';
        $('#loading').show();
        $('#reportsTable3').empty();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${headerdate}</h4>
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
                title: headerdate,
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
                url: '/sales/reports/combo/branch',
                data:{
                    datacode: datacode,
                    selected_date: data.date,
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
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports3';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if(report_category == 'TRANSACTION TYPE'){
        var headerdate = headername + ' ('+formatDate(data.date).toUpperCase()+')';
        $('#loading').show();
        $('#reportsTable3').empty();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${headerdate}</h4>
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
                title: headerdate,
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
                url: '/sales/reports/transaction/branch',
                data:{
                    datacode: datacode,
                    selected_date: data.date,
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
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports3';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else{
        Swal.fire('UNAVAILABLE', 'This data breakdown is not yet available!', 'error');
        return false;
    }
});

setInterval(() => {
    if(!$('#reportsTable1').is(':empty') && $('#report_category').val() == 'STORE'){
        $('.reportsTable1').show();
    }
    else{
        $('.reportsTable1').hide();
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