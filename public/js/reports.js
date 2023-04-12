$(document).prop('title', $('#page-name').text());
$('#btnReset').on('click', function(){
    $('.req').hide();
    $('#formReports').trigger('reset');
    $('#report_type').change();
    $('#reportsTable').empty();
});

$('#report_type').on('change', function(){
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
    
    const alpha_test = ['AREA', 'REGION', 'STORE GROUP', 'STORE SETUP', 'DELIVERY CHANNEL', 'TRANSACTION TYPE'];
    if($('#report_type').val() == '2' && !alpha_test.includes($('#report_category').val())){
        Swal.fire('UNAVAILABLE', 'This Report Type is not yet available!', 'error');
        return false;
    }
    if($('#report_category').val() == 'AREA'){
        var byTable = 'byAreaTable';
        var thTitle = 'STORE AREA';
        var urlName = '/reports/area';
        var colName = 'store_area';
        display_report(byTable, thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'REGION'){
        var byTable = 'byRegionTable';
        var thTitle = 'REGION';
        var urlName = '/reports/region';
        var colName = 'region';
        display_report(byTable, thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'STORE GROUP'){
        var byTable = 'byGroupTable';
        var thTitle = 'STORE GROUP';
        var urlName = '/reports/group';
        var colName = 'subgroup';
        display_report(byTable, thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'STORE SETUP'){
        var byTable = 'bySetupTable';
        var thTitle = 'STORE SETUP';
        var urlName = '/reports/setup';
        var colName = 'setup_name';
        display_report(byTable, thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'DELIVERY CHANNEL'){
        var byTable = 'byDeliveryTable';
        var thTitle = 'DELIVERY CHANNEL';
        var urlName = '/reports/delivery';
        var colName = 'delivery_name';
        display_report(byTable, thTitle, urlName, colName);
    }
    else if($('#report_category').val() == 'TRANSACTION TYPE'){
        var byTable = 'byTransactionTable';
        var thTitle = 'TRANSACTION TYPE';
        var urlName = '/reports/transaction';
        var colName = 'transaction_name';
        display_report(byTable, thTitle, urlName, colName);
    }
    else{
        Swal.fire('UNAVAILABLE', 'This Report Category is not yet available!', 'error');
    }
});

function display_report(byTable, thTitle, urlName, colName){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMMM DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMMM DD, YYYY')).toUpperCase();
    var compare_range1 = (moment($('#date1A').val(), 'YYYY-MM-DD').format('MMMM DD, YYYY')+' TO '+moment($('#date1B').val(), 'YYYY-MM-DD').format('MMMM DD, YYYY')).toUpperCase();
    var compare_range2 = (moment($('#date2A').val(), 'YYYY-MM-DD').format('MMMM DD, YYYY')+' TO '+moment($('#date2B').val(), 'YYYY-MM-DD').format('MMMM DD, YYYY')).toUpperCase();
    $('#loading').show();
    if($('#report_type').val() == '1'){
        var htmlString = '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped '+byTable+'" id="'+byTable+'" style="width:100%;">' +
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
                        '<th>GROSS SALES</th>' +
                        '<th>TOTAL SALES</th>' +
                        '<th>NET SALES</th>' +
                    '</tr>' +
                '</thead>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#reportsTable').append(htmlString);
        $('table.'+byTable).DataTable({
            dom: 'lftrip',
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
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
                    }
                }
            ],
            initComplete: function(){
                $('#loading').hide();
            }
        });
    }
    if($('#report_type').val() == '2'){
        var htmlString = '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped '+byTable+'" id="'+byTable+'" style="width:100%;">' +
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
                        '<th>GROSS SALES</th>' +
                        '<th>TOTAL SALES</th>' +
                        '<th>NET SALES</th>' +
                        '<th>GROSS SALES</th>' +
                        '<th>TOTAL SALES</th>' +
                        '<th>NET SALES</th>' +
                    '</tr>' +
                '</thead>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#reportsTable').append(htmlString);
        $('table.'+byTable).DataTable({
            dom: 'lftrip',
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
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales1).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales1',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales1).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales1',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales1).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'gross_sales2',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross_sales2).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales2',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.total_sales2).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales2',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.net_sales2).toFixed(2))}</span>`;
                    }
                }
            ],
            initComplete: function(){
                $('#loading').hide();
            }
        });
    }
}

setInterval(() => {
    if($('#reportsTable').is(':empty')){
        $('#btnExport').prop('disabled', true);
    }
    else{
        $('#btnExport').prop('disabled', false);
    }
}, 0);