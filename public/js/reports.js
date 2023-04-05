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
    if($('#report_type').val() == '2' && $('#report_category').val() != 'AREA'){
        Swal.fire('UNAVAILABLE', 'This Report Type is not yet available!', 'error');
        return false;
    }
    if($('#report_category').val() == 'AREA'){
        $('#loading').show();
        if($('#report_type').val() == '1'){
            var htmlString = '<div class="table-responsive container-fluid pt-2">' +
                '<table class="table table-hover table-bordered table-striped byAreaTable" id="byAreaTable" style="width:100%;">' +
                    '<thead style="font-weight:bolder" class="bg-default">' +
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
                        type: 'standard',
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
        if($('#report_type').val() == '2'){
            var htmlString = '<div class="table-responsive container-fluid pt-2">' +
                '<table class="table table-hover table-bordered table-striped byAreaTable" id="byAreaTable" style="width:100%;">' +
                    '<thead style="font-weight:bolder" class="bg-default">' +
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
                            '<th>STORE AREA</th>' +
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
            $('table.byAreaTable').DataTable({
                dom: 'lftrip',
                aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
                processing: true,
                serverSide: false,
                ajax: {
                    url: '/reports/area',
                    data:{
                        type: 'comparative',
                        date1A: $('#date1A').val(),
                        date1B: $('#date1B').val(),
                        date2A: $('#date2A').val(),
                        date2B: $('#date2B').val()
                    }
                },
                columns: [
                    { data: 'store_area' },
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
    else if($('#report_category').val() == 'REGION'){
        $('#loading').show();
        var htmlString = '<div class="table-responsive container-fluid pt-2">' +
            '<table class="table table-hover table-bordered table-striped byRegionTable" id="byRegionTable" style="width:100%;">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
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