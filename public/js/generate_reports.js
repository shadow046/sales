$(document).prop('title', $('#page-name').text());
$('#btnReset').on('click', function(){
    $('.req').hide();
    $('#formReports').trigger('reset');
    $('#report_type').change();
    $('#reportsTable').empty();
    $('#subreportsTable').empty();
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

var table, subtable;
$('#btnGenerate').on('click', function(){
    $('#reportsTable').empty();
    $('#subreportsTable').empty();

    if($('#report_category').val() == 'STORE'){
        $('#loading').show();
        var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
        var reports_header = $('#report_category option:selected').text()+' ('+display_range+')';
        $('#tblReportsHeader').text(reports_header);
        var htmlString = `
        <div class="table-responsive container-fluid pt-2 w-100">
            <table class="table table-hover table-bordered table-striped tblReports" id="tblReports" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
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
                    </tr>
                    <tr>
                        <th>BRANCH NAME</th>
                        <th>COMPANY NAME</th>
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
                        <th class="text-right" colspan="8">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable').append(htmlString);
        table = $('table.tblReports').DataTable({
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
                    "targets": [1,5,6,7],
                    "visible": false,
                    "searchable": true
                },
            ],
            columns: [
                { data: 'branch_name' },
                { data: 'company_name' },
                { data: 'store_area' },
                { data: 'region' },
                { data: 'type' },
                { data: 'store_group' },
                { data: 'subgroup' },
                { data: 'network_setup' },
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
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
        $('body').on('click', '.checkboxFilter', function(){
            var column = table.column($(this).attr('data-column'));
            var colnum = $(this).attr('data-column');
            column.visible(!column.visible());
            $('.fl-'+colnum).val('');
            table.column(colnum).search('').draw();
        });
        setInterval(() => {
            if($('.popover-header').is(':visible')){
                for(var i=0; i<=10; i++){
                    if(table.column(i).visible()){
                        $('#filter-'+i).prop('checked', true);
                    }
                    else{
                        $('#filter-'+i).prop('checked', false);
                    }
                }
            }
        }, 0);
    }
    else{
        Swal.fire('UNAVAILABLE', 'This Report Category is not yet available!', 'error');
    }
});

$(document).on('keyup search','.filter-input', function(){
    table.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-input1', function(){
    subtable.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('click','table.tblReports tbody tr',function(){
    var report_category = $('#report_category').val();
    var data = table.row(this).data();
    if(report_category == 'STORE'){
        alert(data.branch_code);
    }
});

setInterval(() => {
    if($('#reportsTable').is(':empty')){
        $('.reportsTable').hide();
    }
    else{
        $('.reportsTable').show();
    }
}, 0);

$('a[href="#"]').click(function(event){
    event.preventDefault();
});