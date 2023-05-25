$(document).prop('title', $('#page-name').text());
$(document).ready(function(){
    if(current_server == 'LOCAL'){
        $('.debug-reports').click();
    }
});

$('.debug-reports').on('click', function(){
    $('#start_date').val('2023-01-01');
    $('#end_date').val('2023-01-31');
});

$('#start_date').on('change', function(){
    $('#end_date').val($(this).val());
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

$('#btnReset').on('click', function(){
    $('.req').hide();
    $('#end_date').attr('min', '');
    $('#reportsTable1').empty();
    $('#reportsTable2').empty();
});

var table1, table2;
$('#btnGenerate').on('click', function(){
    $('#reportsTable1').empty();
    $('#reportsTable2').empty();

    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();

    $('#loading').show();
    var htmlString = `<hr><div class="px-2 align-content"><h4 id=header1><span id="subheader1">${$('#report_category option:selected').text()}</span> (${display_range})</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports1')"><i class="fas fa-file-export"></i> EXPORT</button></div>
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
                    <th>DATE</th>
                    <th>REFERENCE NUMBER</th>
                    <th>BRANCH NAME</th>
                    <th class="sum">AMOUNT</th>
                </tr>
            </thead>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right" colspan="3">TOTAL:</th>
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable1').append(htmlString);
    table1 = $('table.tblReports1').DataTable({
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: $('#header1').text(),
                exportOptions: {
                    modifier: {
                    order: 'index',
                    page: 'all',
                    search: 'none'
                    }
                }
            },
            {
                extend: 'pdfHtml5',
                text: 'PDF',
                title: $('#header1').text(),
                exportOptions: {
                    modifier: {
                    order: 'index',
                    page: 'all',
                    search: 'none'
                    }
                }
            }
        ],
        language:{
            emptyTable: "NO DATA AVAILABLE",
        },
        aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
        processing: true,
        serverSide: false,
        ajax: {
            url: '/exemption/reports/transaction',
            data:{
                report_category: $('#report_category').val(),
                start_date: $('#start_date').val(),
                end_date: $('#end_date').val()
            }
        },
        autoWidth: false,
        columns: [
            {
                data: 'date',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return data;
                    }
                    return formatDate(data);
                }
            },
            {
                data: 'tnumber',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return data;
                    }
                    return data;
                }
            },
            { data: 'branch_name' },
            {
                data: 'amount',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                }
            },
        ],
        order: [],
        footerCallback: function (row, data, start, end, display){
            var api = this.api();
            var intVal = function(i){
              if(typeof i === 'string'){
                var cleanValue = i.replace(/[^\d.-]/g, '').replace(/,/g, '');
                if(/\.\d{2}$/.test(cleanValue)){
                  return parseFloat(cleanValue);
                }
                else{
                  return parseInt(cleanValue);
                }
              }
              else if(typeof i === 'number'){
                return i;
              }
              else{
                return 0;
              }
            };
            api.columns('.sum', { page: 'all' }).every(function(){
              var sum = this.data().reduce(function(a, b){
                return intVal(a) + intVal(b);
              }, 0);
              sum = !Number.isInteger(sum) ? Number(sum).toFixed(2) : sum;
              sum = sum.toString();
              var pattern = /(-?\d+)(\d{3})/;
              while (pattern.test(sum)) sum = sum.replace(pattern, "$1,$2");
              this.footer().innerHTML = sum;
            });
        },
        initComplete: function(){
            tfoot_bugfix('tblReports1');
            $('#loading').hide();
            setTimeout(() => {
                window.location.href = '/exemption/reports#tblReports1';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
});

$(document).on('click','table.tblReports1 tbody tr',function(){
    var data = table1.row(this).data();
    $('#loading').show();
    $('#reportsTable2').empty();

    $.ajax({
        url: "/sales/reports/reference",
        type: "get",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data:{
            tnumber: data.tnumber,
            datatype: $('#report_category').val()
        },
        success:function(response){
            var htmlString = `<hr><div class="px-2 align-content"><h4 id="header2"><span id="subheader2">${$('#subheader1').text()} (${formatDate(data.date).toUpperCase()}) (REF#: ${data.tnumber}) (${response})</span></h4>
            <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports2')"><i class="fas fa-file-export"></i> EXPORT</button></div>
            <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports2" type="button"><span>PDF</span></button>
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
                            <td>
                                <input type="search" class="form-control filter-input2" data-column="5" style="border:1px solid #808080"/>
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
                            <th class="text-right sum sumamt"></th>
                        </tr>
                    </tfoot>
                </table>
                <br>
            </div>`;
            $('#reportsTable2').append(htmlString);
            table2 = $('table.tblReports2').DataTable({
                dom: 'Blftrip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: 'Excel',
                        title: $('#header2').text(),
                        exportOptions: {
                            modifier: {
                            order: 'index',
                            page: 'all',
                            search: 'none'
                            }
                        }
                    },
                    {
                        extend: 'pdfHtml5',
                        text: 'PDF',
                        title: $('#header2').text(),
                        exportOptions: {
                            modifier: {
                            order: 'index',
                            page: 'all',
                            search: 'none'
                            }
                        }
                    }
                ],
                language:{
                    emptyTable: "NO DATA AVAILABLE",
                },
                aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
                processing: true,
                serverSide: false,
                ajax: {
                    url: '/exemption/reports/transaction_details',
                    data:{
                        transcode: data.tnumber,
                        report_category: $('#report_category').val(),
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
                            return `<span class="float-end">${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                        }
                    }
                ],
                footerCallback: function (row, data, start, end, display){
                    var api = this.api();
                    var intVal = function(i){
                      if(typeof i === 'string'){
                        var cleanValue = i.replace(/[^\d.-]/g, '').replace(/,/g, '');
                        if(/\.\d{2}$/.test(cleanValue)){
                          return parseFloat(cleanValue);
                        }
                        else{
                          return parseInt(cleanValue);
                        }
                      }
                      else if(typeof i === 'number'){
                        return i;
                      }
                      else{
                        return 0;
                      }
                    };
                    api.columns('.sum', { page: 'all' }).every(function(){
                      var sum = this.data().reduce(function(a, b){
                        return intVal(a) + intVal(b);
                      }, 0);
                      sum = !Number.isInteger(sum) ? Number(sum).toFixed(2) : sum;
                      sum = sum.toString();
                      var pattern = /(-?\d+)(\d{3})/;
                      while (pattern.test(sum)) sum = sum.replace(pattern, "$1,$2");
                      this.footer().innerHTML = sum;
                    });
                },
                initComplete: function(){
                    tfoot_bugfix('tblReports2');
                    $('#loading').hide();
                    setTimeout(() => {
                        window.location.href = '/exemption/reports#tblReports2';
                        $('html, body').animate({
                            scrollTop: $($.attr(this, 'href')).offset()
                        }, 1000);
                    }, 200);
                }
            });
        }
    });
});

$(document).on('keyup search','.filter-input1', function(){
    table1.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-input2', function(){
    table2.column($(this).data('column')).search($(this).val()).draw();
});