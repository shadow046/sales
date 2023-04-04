$(document).prop('title', $('#page-name').text());
$('#btnReset').on('click', function(){
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
    if($('#report_type').val() == '2'){
        $('.divStandard').hide();
        $('.divComparative').show();
    }
});

$('#btnGenerate').on('click', function(){
    $('#reportsTable').empty();
    if($('#report_type').val() == '2'){
        Swal.fire('UNAVAILABLE', 'This Report Type is not yet available!', 'error');
        return false;
    }
    if($('#report_category').val() == 'AREA'){
        $('#loading').show();
        var htmlString = '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped byAreaTable" id="byAreaTable" style="width:100%;">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
                    '<tr>' +
                        '<th>STORE AREA</th>' +
                        '<th>GROSS SALES</th>' +
                        '<th>TOTAL SALES</th>' +
                        '<th>NET SALES</th>' +
                    '</tr>' +
                '</thead>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#reportsTable').append(htmlString);
        $('table.byAreaTable').DataTable({
            dom: 'lftrip',
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/reports/area',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val()
                }
            },
            columns: [
                { data: 'store_area' },
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
    else if($('#report_category').val() == 'REGION'){
        $('#loading').show();
        var htmlString = '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped byRegionTable" id="byRegionTable" style="width:100%;">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
                    '<tr>' +
                        '<th>REGION</th>' +
                        '<th>GROSS SALES</th>' +
                        '<th>TOTAL SALES</th>' +
                        '<th>NET SALES</th>' +
                    '</tr>' +
                '</thead>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#reportsTable').append(htmlString);
        $('table.byRegionTable').DataTable({
            dom: 'lftrip',
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/reports/region',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val()
                }
            },
            columns: [
                { data: 'region' },
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
    else if($('#report_category').val() == 'STORE GROUP'){
        $('#loading').show();
        var htmlString = '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped byGroupTable" id="byGroupTable" style="width:100%;">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
                    '<tr>' +
                        '<th>STORE GROUP</th>' +
                        '<th>GROSS SALES</th>' +
                        '<th>TOTAL SALES</th>' +
                        '<th>NET SALES</th>' +
                    '</tr>' +
                '</thead>' +
            '</table>' +
            '<br>' +
        '</div>';
        $('#reportsTable').append(htmlString);
        $('table.byGroupTable').DataTable({
            dom: 'lftrip',
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            processing: true,
            serverSide: false,
            ajax: {
                url: '/reports/group',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val()
                }
            },
            columns: [
                { data: 'subgroup' },
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
    else{
        Swal.fire('UNAVAILABLE', 'This Report Category is not yet available!', 'error');
    }
});

setInterval(() => {
    if($('#reportsTable').is(':empty')){
        $('#btnExport').prop('disabled', true);
    }
    else{
        $('#btnExport').prop('disabled', false);
    }
}, 0);