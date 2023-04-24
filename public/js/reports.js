$(document).prop('title', $('#page-name').text());
$('#btnReset').on('click', function(){
    $('.req').hide();
    $('#formReports').trigger('reset');
    $('#report_type').change();
    $('#reportsTable').empty();
    $('#subreportsTable').empty();
});

$('#report_type').on('change', function(){
    $('#reportsTable').empty();
    $('#subreportsTable').empty();
    $('.inputDates').val('');
    if($('#report_type').val() == '1'){
        $('.divStandard').show();
        $('.divComparative').hide();
    }
    else if($('#report_type').val() == '2'){
        $('.divStandard').hide();
        $('.divComparative').show();
    }
    else{
        $('.divStandard').hide();
        $('.divComparative').hide();
    }
});

$('#report_category').on('change', function(){
    $('#reportsTable').empty();
    $('#subreportsTable').empty();
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

$('#date1A').on('change', function(){
    $('#date1B').val('');
    if($(this).val()){
        $('#date1B').attr('min', $(this).val());
    }
});

$('#date1B').on('change', function(){
    if($(this).val() < $('#date1A').val()){
        $(this).val('');
        Swal.fire('INVALID DATE', '', 'error');
    }
});

$('#date2A').on('change', function(){
    $('#date2B').val('');
    if($(this).val()){
        $('#date2B').attr('min', $(this).val());
    }
});

$('#date2B').on('change', function(){
    if($(this).val() < $('#date2A').val()){
        $(this).val('');
        Swal.fire('INVALID DATE', '', 'error');
    }
});

$('#btnGenerate').on('click', function(){
    $('#reportsTable').empty();
    $('#subreportsTable').empty();

    if($('#report_category').val() == 'BRANCH'){
        var thTitle = 'BRANCH';
        var urlName = '/reports/branch';
        var colName = 'branch';
        display_report_A(thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'AREA'){
        var thTitle = 'STORE AREA';
        var urlName = '/reports/area';
        var colName = 'store_area';
        display_report_A(thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'REGION'){
        var thTitle = 'REGION';
        var urlName = '/reports/region';
        var colName = 'region';
        display_report_A(thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'AREA MANAGER'){
        var thTitle = 'AREA MANAGER';
        var urlName = '/reports/area_manager';
        var colName = 'area_manager';
        display_report_A(thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'STORE GROUP'){
        var thTitle = 'STORE GROUP';
        var urlName = '/reports/group';
        var colName = 'subgroup';
        display_report_A(thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'STORE SETUP'){
        var thTitle = 'STORE SETUP';
        var urlName = '/reports/setup';
        var colName = 'setup_name';
        display_report_A(thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'DELIVERY CHANNEL'){
        var thTitle = 'DELIVERY CHANNEL';
        var urlName = '/reports/delivery';
        var colName = 'delivery_name';
        display_report_A(thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'TRANSACTION TYPE'){
        var thTitle = 'TRANSACTION TYPE';
        var urlName = '/reports/transaction';
        var colName = 'transaction_name';
        display_report_A(thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'TENDER TYPE'){
        var thTitle = 'TENDER TYPE';
        var urlName = '/reports/tender';
        var colName = 'tendname';
        display_report_C(thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'DISCOUNT'){
        var thTitle = 'DISCOUNT';
        var urlName = '/reports/discount';
        var colName = 'discount_name';
        display_report_C(thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'PRODUCT CATEGORY'){
        var urlName = '/reports/product';
        display_report_B(urlName);
    }
    else if($('#report_category').val() == 'COMBO CATEGORY'){
        var urlName = '/reports/combo';
        display_report_B(urlName);
    }
    else{
        Swal.fire('UNAVAILABLE', 'This Report Category is not yet available!', 'error');
    }
});

var table, subtable;
function display_report_A(thTitle, urlName, colName){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var compare_range1 = (moment($('#date1A').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#date1B').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var compare_range2 = (moment($('#date2A').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#date2B').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    $('#loading').show();
    if($('#report_type').val() == '1'){
        var htmlString = `<hr><div class="px-2 align-content"><h4>${$('#report_type option:selected').text()} - ${$('#report_category').val()}</h4>` +
        `<button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>` +
        '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped tblReports" id="tblReports" style="width:100%;">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
                    '<tr>' +
                        '<th></th>' +
                        '<th colspan="3">'+display_range+'</th>' +
                    '</tr>' +
                    '<tr class="tbsearch">' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="0" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="1" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="2" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="3" style="border:1px solid #808080"/>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<th>'+thTitle+'</th>' +
                        '<th class="sum">GROSS SALES</th>' +
                        '<th class="sum">TOTAL SALES</th>' +
                        '<th class="sum">NET SALES</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot style="font-size: 14px;">' +
                    '<tr>' +
                        '<th class="text-right">TOTAL:</th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                    '</tr>' +
                '</tfoot>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#reportsTable').append(htmlString);
        table = $('table.tblReports').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#report_type option:selected').text() + ' - ' + $('#report_category option:selected').text(),
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
                    type: 'standard',
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val()
                }
            },
            columns: [
                { data: colName },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
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
                api.columns('.sum',{page:'current'}).every(function(){
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
            }
        });
    }
    if($('#report_type').val() == '2'){
        var htmlString = `<hr><div class="px-2 align-content"><h4>${$('#report_type option:selected').text()} - ${$('#report_category').val()}</h4>` +
        `<button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>` +
        '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped tblReports" id="tblReports" style="width:100%;">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
                    '<tr>' +
                        '<th></th>' +
                        '<th colspan="3">'+compare_range1+'</th>' +
                        '<th colspan="3">'+compare_range2+'</th>' +
                    '</tr>' +
                    '<tr class="tbsearch">' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="0" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="1" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="2" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="3" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="4" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="5" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="6" style="border:1px solid #808080"/>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<th>'+thTitle+'</th>' +
                        '<th class="sum">GROSS SALES</th>' +
                        '<th class="sum">TOTAL SALES</th>' +
                        '<th class="sum">NET SALES</th>' +
                        '<th class="sum">GROSS SALES</th>' +
                        '<th class="sum">TOTAL SALES</th>' +
                        '<th class="sum">NET SALES</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot style="font-size: 14px;">' +
                    '<tr>' +
                        '<th class="text-right">TOTAL:</th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                    '</tr>' +
                '</tfoot>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#reportsTable').append(htmlString);
        table = $('table.tblReports').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#report_type option:selected').text() + ' - ' + $('#report_category option:selected').text(),
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
                    type: 'comparative',
                    date1A: $('#date1A').val(),
                    date1B: $('#date1B').val(),
                    date2A: $('#date2A').val(),
                    date2B: $('#date2B').val()
                }
            },
            columns: [
                { data: colName },
                {
                    data: 'gross_sales1',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales1).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales1',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales1).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales1',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales1).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'gross_sales2',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales2).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales2',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales2).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales2',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales2).toFixed(2))}</span>`;
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
                api.columns('.sum',{page:'current'}).every(function(){
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
            }
        });
    }
}

function display_report_B(urlName){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var compare_range1 = (moment($('#date1A').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#date1B').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var compare_range2 = (moment($('#date2A').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#date2B').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    $('#loading').show();
    if($('#report_type').val() == '1'){
        var htmlString = `<hr><div class="px-2 align-content"><h4>${$('#report_type option:selected').text()} - ${$('#report_category').val()}</h4>` +
        `<button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>` +
        '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped tblReports" id="tblReports" style="width:100%;">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
                    '<tr>' +
                        '<th colspan="3"></th>' +
                        '<th>'+display_range+'</th>' +
                    '</tr>' +
                    '<tr class="tbsearch">' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="0" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="1" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="2" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="3" style="border:1px solid #808080"/>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<th>ITEM CODE</th>' +
                        '<th>SHORT DESCRIPTION</th>' +
                        '<th>LONG DESCRIPTION</th>' +
                        '<th class="sum">GROSS SALES</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot style="font-size: 14px;">' +
                    '<tr>' +
                        '<th class="text-right" colspan="3">TOTAL:</th>' +
                        '<th class="text-right sum"></th>' +
                    '</tr>' +
                '</tfoot>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#reportsTable').append(htmlString);
        table = $('table.tblReports').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#report_type option:selected').text() + ' - ' + $('#report_category option:selected').text(),
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
                    type: 'standard',
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val()
                }
            },
            columns: [
                { data: 'item_code' },
                { data: 'short_desc' },
                { data: 'long_desc' },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
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
                api.columns('.sum',{page:'current'}).every(function(){
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
            }
        });
    }
    if($('#report_type').val() == '2'){
        var htmlString = `<hr><div class="px-2 align-content"><h4>${$('#report_type option:selected').text()} - ${$('#report_category').val()}</h4>` +
        `<button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>` +
        '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped tblReports" id="tblReports" style="width:100%;">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
                    '<tr>' +
                        '<th colspan="3"></th>' +
                        '<th>'+compare_range1+'</th>' +
                        '<th>'+compare_range2+'</th>' +
                    '</tr>' +
                    '<tr class="tbsearch">' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="0" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="1" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="2" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="3" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="4" style="border:1px solid #808080"/>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<th>ITEM CODE</th>' +
                        '<th>SHORT DESCRIPTION</th>' +
                        '<th>LONG DESCRIPTION</th>' +
                        '<th class="sum">GROSS SALES</th>' +
                        '<th class="sum">GROSS SALES</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot style="font-size: 14px;">' +
                    '<tr>' +
                        '<th class="text-right" colspan="3">TOTAL:</th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                    '</tr>' +
                '</tfoot>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#reportsTable').append(htmlString);
        table = $('table.tblReports').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#report_type option:selected').text() + ' - ' + $('#report_category option:selected').text(),
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
                    type: 'comparative',
                    date1A: $('#date1A').val(),
                    date1B: $('#date1B').val(),
                    date2A: $('#date2A').val(),
                    date2B: $('#date2B').val()
                }
            },
            columns: [
                { data: 'item_code' },
                { data: 'short_desc' },
                { data: 'long_desc' },
                {
                    data: 'gross_sales1',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales1).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'gross_sales2',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales2).toFixed(2))}</span>`;
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
                api.columns('.sum',{page:'current'}).every(function(){
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
            }
        });
    }
}

function display_report_C(thTitle, urlName, colName){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var compare_range1 = (moment($('#date1A').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#date1B').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var compare_range2 = (moment($('#date2A').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#date2B').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    $('#loading').show();
    if($('#report_type').val() == '1'){
        var htmlString = `<hr><div class="px-2 align-content"><h4>${$('#report_type option:selected').text()} - ${$('#report_category').val()}</h4>` +
        `<button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>` +
        '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped tblReports" id="tblReports" style="width:100%;">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
                    '<tr>' +
                        '<th></th>' +
                        '<th>'+display_range+'</th>' +
                    '</tr>' +
                    '<tr class="tbsearch">' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="0" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="1" style="border:1px solid #808080"/>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<th>'+thTitle+' NAME</th>' +
                        '<th class="sum">TOTAL '+thTitle+'</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot style="font-size: 14px;">' +
                    '<tr>' +
                        '<th class="text-right">TOTAL:</th>' +
                        '<th class="text-right sum"></th>' +
                    '</tr>' +
                '</tfoot>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#reportsTable').append(htmlString);
        table = $('table.tblReports').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#report_type option:selected').text() + ' - ' + $('#report_category option:selected').text(),
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
                    type: 'standard',
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val()
                }
            },
            columns: [
                { data: colName },
                {
                    data: 'total',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.total).toFixed(2))}</span>`;
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
                api.columns('.sum',{page:'current'}).every(function(){
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
            }
        });
    }
    if($('#report_type').val() == '2'){
        var htmlString = `<hr><div class="px-2 align-content"><h4>${$('#report_type option:selected').text()} - ${$('#report_category').val()}</h4>` +
        `<button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>` +
        '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped tblReports" id="tblReports" style="width:100%;">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
                    '<tr>' +
                        '<th></th>' +
                        '<th>'+compare_range1+'</th>' +
                        '<th>'+compare_range2+'</th>' +
                    '</tr>' +
                    '<tr class="tbsearch">' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="0" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="1" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input" data-column="2" style="border:1px solid #808080"/>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<th>'+thTitle+' NAME</th>' +
                        '<th class="sum">TOTAL '+thTitle+'</th>' +
                        '<th class="sum">TOTAL '+thTitle+'</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot style="font-size: 14px;">' +
                    '<tr>' +
                        '<th class="text-right">TOTAL:</th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                    '</tr>' +
                '</tfoot>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#reportsTable').append(htmlString);
        table = $('table.tblReports').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#report_type option:selected').text() + ' - ' + $('#report_category option:selected').text(),
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
                    type: 'comparative',
                    date1A: $('#date1A').val(),
                    date1B: $('#date1B').val(),
                    date2A: $('#date2A').val(),
                    date2B: $('#date2B').val()
                }
            },
            columns: [
                { data: colName },
                {
                    data: 'total1',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.total1).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total2',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.total2).toFixed(2))}</span>`;
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
                api.columns('.sum',{page:'current'}).every(function(){
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
            }
        });
    }
}

$(document).on('keyup search','.filter-input', function(){
    table.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-input1', function(){
    subtable.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('click','table.tblReports tbody tr',function(){
    var report_category = $('#report_category').val();
    var data = table.row(this).data();
    if(report_category == 'AREA MANAGER'){
        $.ajax({
            url: '/users/areas',
            data:{
                user_id: data.user_id
            },
            success: function(areas){
                var h4Title = 'AREA MANAGER: '+data.area_manager+' - '+(areas.join(', '));
                var thTitle = 'BRANCH';
                var urlName = '/subreports/area_manager';
                var colData = data.branch_codes;
                var colName = 'branch';
                display_subreport_A(h4Title, thTitle, urlName, colData, colName);
            }
        });
    }
});

function display_subreport_A(h4Title, thTitle, urlName, colData, colName){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var compare_range1 = (moment($('#date1A').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#date1B').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var compare_range2 = (moment($('#date2A').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#date2B').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    $('#subreportsTable').empty();
    $('#loading').show();
    if($('#report_type').val() == '1'){
        var htmlString = `<hr><div class="px-2 align-content"><h4>${h4Title}</h4>` +
        `<button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(1).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>` +
        '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped tblSubReports" id="tblSubReports" style="width:100%;">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
                    '<tr>' +
                        '<th></th>' +
                        '<th colspan="3">'+display_range+'</th>' +
                    '</tr>' +
                    '<tr class="tbsearch">' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input1" data-column="0" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input1" data-column="1" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input1" data-column="2" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input1" data-column="3" style="border:1px solid #808080"/>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<th>'+thTitle+'</th>' +
                        '<th class="sum">GROSS SALES</th>' +
                        '<th class="sum">TOTAL SALES</th>' +
                        '<th class="sum">NET SALES</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot style="font-size: 14px;">' +
                    '<tr>' +
                        '<th class="text-right">TOTAL:</th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                    '</tr>' +
                '</tfoot>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#subreportsTable').append(htmlString);
        subtable = $('table.tblSubReports').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: h4Title,
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
                    type: 'standard',
                    colData: colData,
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val()
                }
            },
            columns: [
                { data: colName },
                {
                    data: 'gross_sales',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
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
                api.columns('.sum',{page:'current'}).every(function(){
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
                    window.location.href = '/reports#tblSubReports';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset().top
                    }, 1000);
                }, 200);
            }
        });
    }
    if($('#report_type').val() == '2'){
        var htmlString = `<hr><div class="px-2 align-content"><h4>${h4Title}</h4>` +
        `<button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(1).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>` +
        '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped tblSubReports" id="tblSubReports" style="width:100%;">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
                    '<tr>' +
                        '<th></th>' +
                        '<th colspan="3">'+compare_range1+'</th>' +
                        '<th colspan="3">'+compare_range2+'</th>' +
                    '</tr>' +
                    '<tr class="tbsearch">' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input1" data-column="0" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input1" data-column="1" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input1" data-column="2" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input1" data-column="3" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input1" data-column="4" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input1" data-column="5" style="border:1px solid #808080"/>' +
                        '</td>' +
                        '<td>' +
                            '<input type="search" class="form-control filter-input1" data-column="6" style="border:1px solid #808080"/>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<th>'+thTitle+'</th>' +
                        '<th class="sum">GROSS SALES</th>' +
                        '<th class="sum">TOTAL SALES</th>' +
                        '<th class="sum">NET SALES</th>' +
                        '<th class="sum">GROSS SALES</th>' +
                        '<th class="sum">TOTAL SALES</th>' +
                        '<th class="sum">NET SALES</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot style="font-size: 14px;">' +
                    '<tr>' +
                        '<th class="text-right">TOTAL:</th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                        '<th class="text-right sum"></th>' +
                    '</tr>' +
                '</tfoot>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#subreportsTable').append(htmlString);
        subtable = $('table.tblSubReports').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: h4Title,
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
                    type: 'comparative',
                    colData: colData,
                    date1A: $('#date1A').val(),
                    date1B: $('#date1B').val(),
                    date2A: $('#date2A').val(),
                    date2B: $('#date2B').val()
                }
            },
            columns: [
                { data: colName },
                {
                    data: 'gross_sales1',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales1).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales1',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales1).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales1',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales1).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'gross_sales2',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales2).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales2',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales2).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales2',
                    "render": function(data, type, row, meta){
                        return `<span class="d-none">${sortAmount(data)}</span><span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales2).toFixed(2))}</span>`;
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
                api.columns('.sum',{page:'current'}).every(function(){
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
                    window.location.href = '/reports#tblSubReports';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset().top
                    }, 1000);
                }, 200);
            }
        });
    }
}