var dataArray = [];
$(document).prop('title', $('#page-name').text());
$(document).ready(function(){
    $('#branch').chosen();
    $('#product').chosen();
    $('#combo').chosen();
    $('#promo').chosen();
    $('#transactiontype').chosen();
    $('#bytransactiontype').chosen();
    $('#tendertype').chosen();
    $('#discounttype').chosen();
    $('#custom_branch').chosen();
    $('#custom_product').chosen();
    $('#custom_transaction').chosen();
    $('#custom_discount').chosen();
    $('#branch_chosen').css({'width':'100%'});
    $('#product_chosen').css({'width':'100%'});
    $('#combo_chosen').css({'width':'100%'});
    $('#promo_chosen').css({'width':'100%'});
    $('#transactiontype_chosen').css({'width':'100%'});
    $('#bytransactiontype_chosen').css({'width':'100%'});
    $('#tendertype_chosen').css({'width':'100%'});
    $('#discounttype_chosen').css({'width':'100%'});
    $('#custom_branch_chosen').css({'width':'100%'});
    $('#custom_product_chosen').css({'width':'100%'});
    $('#custom_transaction_chosen').css({'width':'100%'});
    $('#custom_discount_chosen').css({'width':'100%'});

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
    if(current_server == 'LOCAL'){
        $('.debug-reports').click();
    }

    $.ajax({
        url: '/sales/reports/getStoreSetup',
        method: 'GET',
        success: function(response){
            for(var i = 0; i < response.length; i++){
              var item = response[i];
              var subArray = [item.id, item.setup];
              dataArray.push(subArray);
            }
          }
    });
});

$('.debug-reports').on('click', function(){
    $('#start_date').val('2023-03-01');
    $('#end_date').val('2023-03-31');
});

setInterval(() => {
    if($('#report_type').val() == 'STANDARD' || $('#report_type').val() == 'CUSTOM'){
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
    $('#reportsTable2A').empty();
    $('#reportsTable2B').empty();
    $('#reportsTable2C').empty();
    $('#reportsTable2D').empty();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    $('#report_classification').val('');
    $('#bytransactiontype').val('');
    $('#bytransactiontype').trigger('chosen:updated');
    emptyQuantitative();
});

$('#report_type').on('change', function(){
    $('#formReportsQuantitative').trigger('reset');
    if($('#report_type').val() == 'CUSTOM'){
        $('#formReports').hide();
        $('#formReportsQuantitative').show();
    }
    else{
        $('#formReports').show();
        $('#formReportsQuantitative').hide();
    }
    changeComparative();
    $('#reportsTable1').empty();
    $('#reportsTable2A').empty();
    $('#reportsTable2B').empty();
    $('#reportsTable2C').empty();
    $('#reportsTable2D').empty();
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
    $('#reportsTable2A').empty();
    $('#reportsTable2B').empty();
    $('#reportsTable2C').empty();
    $('#reportsTable2D').empty();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    emptyQuantitative();
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

var table1, table2A, table2B, table2C, table2D, table2, table3, table4, table5, table6, table7,
tableX, tableY, tableZ, tableA, tableB, tableC, sumamt;
$('#btnGenerate').on('click', function(){
    $('.req').hide();
    $('#reportsTable1').empty();
    $('#reportsTable2A').empty();
    $('#reportsTable2B').empty();
    $('#reportsTable2C').empty();
    $('#reportsTable2D').empty();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    emptyQuantitative();

    if($('#sales_type').val() != 'NO. OF TRANSACTIONS' && $('#sales_type').val() != 'SALES QUANTITY'){
        sumamt = 'sumamt';
    }
    else{
        sumamt = '';
    }

    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    if($('#report_filter').val()){
        var reports_header = $('#report_filter option:selected').text()+' '+$('#report_classification').val()+' ('+display_range+')';
        quantitative_report(reports_header);
        return false;
    }
    else{
        var reports_header = $('#report_category option:selected').text()+' ('+display_range+')';
    }

    if($('#report_category').val() == 'STORE'){
        loading_show();
        $('#tblReports1Header').text(reports_header);
        var htmlString = `
        <div class="table-responsive container-fluid pt-2 w-100">
            <table class="table table-hover table-bordered table-striped tblReports1" id="tblReports1" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th class="always-default">
                            <input type="search" class="form-control filter-input1" data-column="0" style="border:1px solid #808080"/><br>
                            STORE CODE
                        </th>
                        <th class="always-default">
                            <input type="search" class="form-control filter-input1" data-column="1" style="border:1px solid #808080"/><br>
                            BRANCH NAME
                        </th>
                        <th>
                            <input type="search" class="form-control filter-input1" data-column="2" style="border:1px solid #808080"/><br>
                            COMPANY NAME
                        </th>
                        <th>
                            <input type="search" class="form-control filter-input1" data-column="3" style="border:1px solid #808080"/><br>
                            AREA MANAGER
                        </th>
                        <th>
                            <input type="search" class="form-control filter-input1" data-column="4" style="border:1px solid #808080"/><br>
                            STORE AREA
                        </th>
                        <th>
                            <input type="search" class="form-control filter-input1" data-column="5" style="border:1px solid #808080"/><br>
                            REGION
                        </th>
                        <th>
                            <input type="search" class="form-control filter-input1" data-column="6" style="border:1px solid #808080"/><br>
                            STORE TYPE
                        </th>
                        <th>
                            <input type="search" class="form-control filter-input1" data-column="7" style="border:1px solid #808080"/><br>
                            STORE SETUP
                        </th>
                        <th>
                            <input type="search" class="form-control filter-input1" data-column="8" style="border:1px solid #808080"/><br>
                            STORE GROUP
                        </th>
                        <th>
                            <input type="search" class="form-control filter-input1" data-column="9" style="border:1px solid #808080"/><br>
                            MALL SUB-GROUP
                        </th>
                        <th>
                            <input type="search" class="form-control filter-input1" data-column="10" style="border:1px solid #808080"/><br>
                            NETWORK SETUP
                        </th>
                        <th class="sum">
                            <input type="search" class="form-control filter-input1" data-column="11" style="border:1px solid #808080"/><br>
                            NO. OF TRANSACTIONS
                        </th>
                        <th class="sum">
                            <input type="search" class="form-control filter-input1" data-column="12" style="border:1px solid #808080"/><br>
                            GROSS SALES
                        </th>
                        <th class="sum">
                            <input type="search" class="form-control filter-input1" data-column="13" style="border:1px solid #808080"/><br>
                            TOTAL SALES
                        </th>
                        <th class="sum">
                            <input type="search" class="form-control filter-input1" data-column="14" style="border:1px solid #808080"/><br>
                            NET SALES
                        </th>
                    </tr>
                </thead>
                <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum sumamt"></th>
                        <th class="text-right sum sumamt"></th>
                        <th class="text-right sum sumamt"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable1').append(htmlString);
        table1 = $('table.tblReports1').DataTable({
            scrollX:        true,
            scrollCollapse: true,
            fixedColumns:{
                left: 2,
            },
            language:{
                emptyTable: "NO DATA AVAILABLE",
            },
            dom: 'Blftrip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    title: reports_header,
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
                    title: reports_header,
                    exportOptions: {
                        modifier: {
                        order: 'index',
                        page: 'all',
                        search: 'none'
                        }
                    }
                }
            ],
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
                    "targets": [2,3,6,7,8,9,10],
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
                {
                    data: 'setup',
                    render: function(data, type, row, meta){
                        var setups = data.split(',');
                        var setupEnumeration = [];
                        for(var i = 0; i < setups.length; i++){
                            var setup = setups[i];
                            var setupName = '';

                            for(var j = 0; j < dataArray.length; j++){
                                if(dataArray[j][0] == setup){
                                    setupName = dataArray[j][1];
                                    setupEnumeration.push(setupName);
                                    break;
                                }
                            }
                        }
                        return `<div style="white-space: normal; width: 400px;">${setupEnumeration.join(', ')}</div>`;
                    }
                },
                { data: 'store_group' },
                { data: 'subgroup' },
                { data: 'network_setup' },
                {
                    data: 'tno',
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
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
                    }
                }
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
                loading_hide();
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
                for(var i=0; i<=14; i++){
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
        loading_show();
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
                <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right" colspan="5">TOTAL:</th>
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
                    title: reports_header,
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
                    title: reports_header,
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
                        return `<span class="float-end">${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                    }
                }
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
                loading_hide();
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
        loading_show();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header}</h4>
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
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="4" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>TRANSACTION TYPE</th>
                        <th class="sum">NO. OF TRANSACTIONS</th>
                        <th class="sum">GROSS SALES</th>
                        <th class="sum">TOTAL SALES</th>
                        <th class="sum">NET SALES</th>
                    </tr>
                </thead>
                <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum sumamt"></th>
                        <th class="text-right sum sumamt"></th>
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
                    title: reports_header,
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
                    title: reports_header,
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
                    data: 'tno',
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
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
                    }
                }
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
                loading_hide();
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
        loading_show();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header}</h4>
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
                    </tr>
                    <tr>
                        <th>TENDER TYPE</th>
                        <th class="sum">NO. OF TRANSACTIONS</th>
                        <th class="sum">GROSS SALES</th>
                    </tr>
                </thead>
                <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum"></th>
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
                    title: reports_header,
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
                    title: reports_header,
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
                    data: 'tno',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${data.toLocaleString()}</span>`;
                    }
                },
                {
                    data: 'total',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                }
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
                loading_hide();
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
        loading_show();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header}</h4>
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
                        <td>
                            <input type="search" class="form-control filter-input1" data-column="4" style="border:1px solid #808080"/>
                        </td>
                    </tr>
                    <tr>
                        <th>DISCOUNT TYPE</th>
                        <th class="sum">NO. OF TRANSACTIONS</th>
                        <th class="sum">GROSS SALES</th>
                        <th class="sum">TOTAL SALES</th>
                        <th class="sum">NET SALES</th>
                    </tr>
                </thead>
                <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum sumamt"></th>
                        <th class="text-right sum sumamt"></th>
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
                    title: reports_header,
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
                    title: reports_header,
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
                    data: 'tno',
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
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
                    }
                }
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
                loading_hide();
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
    if(!table1.data().any()){ return false; }
    loading_show();
    $('#reportsTable2A').empty();
    $('#reportsTable2B').empty();
    $('#reportsTable2C').empty();
    $('#reportsTable2D').empty();
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
        report_products(datacode, headername, 'storecode');
        report_trantypeA(datacode, headername, 'storecode');
        report_hourlyA(datacode, headername, 'storecode');
        report_datesA(datacode, headername, urlName, colData);
    }
    else if(report_category == 'PRODUCT'){
        datacode = data.itemcode;
        headername = data.itemcode+': '+data.desc1;
        urlName = '/sales/reports/product/date';
        colData = datacode;
        report_storesB(datacode, headername, 'itemcode');
        report_trantypeB(datacode, headername, 'itemcode');
        report_hourlyB(datacode, headername, 'itemcode');
        report_datesB(datacode, headername, urlName, colData);
    }
    else if(report_category == 'COMBO MEAL'){
        datacode = data.itemcode;
        headername = data.itemcode+': '+data.desc1;
        urlName = '/sales/reports/product/date';
        colData = datacode;
        report_storesB(datacode, headername, 'itemcode');
        report_trantypeB(datacode, headername, 'itemcode');
        report_hourlyB(datacode, headername, 'itemcode');
        report_datesB(datacode, headername, urlName, colData);
    }
    else if(report_category == 'PROMO'){
        datacode = data.itemcode;
        headername = data.itemcode+': '+data.desc1;
        urlName = '/sales/reports/product/date';
        colData = datacode;
        report_storesB(datacode, headername, 'itemcode');
        report_trantypeB(datacode, headername, 'itemcode');
        report_hourlyB(datacode, headername, 'itemcode');
        report_datesB(datacode, headername, urlName, colData);
    }
    else if(report_category == 'TRANSACTION TYPE'){
        datacode = data.transaction_name;
        headername = data.transaction_name;
        urlName = '/sales/reports/transaction/date';
        colData = datacode;
        report_products(datacode, headername, 'trantype');
        report_storesA(datacode, headername, 'trantype');
        report_hourlyA(datacode, headername, 'trantype');
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
        loading_hide();
        Swal.fire('UNAVAILABLE', 'This data breakdown is not yet available!', 'error');
        return false;
    }
});

function report_storesA(datacode, headername, tblType){
    loading_show();
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var reports_header = headername+' ('+display_range+') - Per Store';
    $('#tblReports2AHeader').text(reports_header);
    var htmlString = `
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports2A" type="button"><span>PDF</span></button>
    <div class="table-responsive container-fluid pt-2 w-100">
        <table class="table table-hover table-bordered table-striped tblReports2A" id="tblReports2A" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr>
                    <th class="always-default">
                        <input type="search" class="form-control filter-input2A" data-column="0" style="border:1px solid #808080"/><br>
                        STORE CODE
                    </th>
                    <th class="always-default">
                        <input type="search" class="form-control filter-input2A" data-column="1" style="border:1px solid #808080"/><br>
                        BRANCH NAME
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="2" style="border:1px solid #808080"/><br>
                        COMPANY NAME
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="3" style="border:1px solid #808080"/><br>
                        AREA MANAGER
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="4" style="border:1px solid #808080"/><br>
                        STORE AREA
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="5" style="border:1px solid #808080"/><br>
                        REGION
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="6" style="border:1px solid #808080"/><br>
                        STORE TYPE
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="7" style="border:1px solid #808080"/><br>
                        STORE SETUP
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="8" style="border:1px solid #808080"/><br>
                        STORE GROUP
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="9" style="border:1px solid #808080"/><br>
                        MALL SUB-GROUP
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="10" style="border:1px solid #808080"/><br>
                        NETWORK SETUP
                    </th>
                    <th class="sum">
                        <input type="search" class="form-control filter-input2A" data-column="11" style="border:1px solid #808080"/><br>
                        NO. OF TRANSACTIONS
                    </th>
                    <th class="sum">
                        <input type="search" class="form-control filter-input2A" data-column="12" style="border:1px solid #808080"/><br>
                        GROSS SALES
                    </th>
                    <th class="sum">
                        <input type="search" class="form-control filter-input2A" data-column="13" style="border:1px solid #808080"/><br>
                        TOTAL SALES
                    </th>
                    <th class="sum">
                        <input type="search" class="form-control filter-input2A" data-column="14" style="border:1px solid #808080"/><br>
                        NET SALES
                    </th>
                </tr>
            </thead>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum sumamt"></th>
                    <th class="text-right sum sumamt"></th>
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable2A').append(htmlString);
    table2A = $('table.tblReports2A').DataTable({
        scrollX:        true,
        scrollCollapse: true,
        fixedColumns:{
            left: 2,
        },
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: reports_header,
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
                title: reports_header,
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
            url: '/sales/reports/sub/branch_A',
            data:{
                start_date: $('#start_date').val(),
                end_date: $('#end_date').val(),
                tblType: tblType,
                datacode: datacode
            }
        },
        columnDefs: [
            {
                "targets": [2,3,6,7,8,9,10],
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
            {
                data: 'setup',
                render: function(data, type, row, meta){
                    var setups = data.split(',');
                    var setupEnumeration = [];
                    for(var i = 0; i < setups.length; i++){
                        var setup = setups[i];
                        var setupName = '';

                        for(var j = 0; j < dataArray.length; j++){
                            if(dataArray[j][0] == setup){
                                setupName = dataArray[j][1];
                                setupEnumeration.push(setupName);
                                break;
                            }
                        }
                    }
                    return `<div style="white-space: normal; width: 400px;">${setupEnumeration.join(', ')}</div>`;
                }
            },
            { data: 'store_group' },
            { data: 'subgroup' },
            { data: 'network_setup' },
            {
                data: 'tno',
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
            },
            {
                data: 'total_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                }
            },
            {
                data: 'net_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
                }
            }
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
            tfoot_bugfix('tblReports2A');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports2A';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
    setInterval(() => {
        if($('.popover-header').is(':visible')){
            for(var i=0; i<=14; i++){
                if(table2A.column(i).visible()){
                    $('#filter2-'+i).prop('checked', true);
                }
                else{
                    $('#filter2-'+i).prop('checked', false);
                }
            }
        }
    }, 0);
}

function report_storesB(datacode, headername, tblType){
    loading_show();
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var reports_header = headername+' ('+display_range+') - Per Store';
    $('#tblReports2AHeader').text(reports_header);
    var htmlString = `
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports2A" type="button"><span>PDF</span></button>
    <div class="table-responsive container-fluid pt-2 w-100">
        <table class="table table-hover table-bordered table-striped tblReports2A" id="tblReports2A" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr>
                    <th class="always-default">
                        <input type="search" class="form-control filter-input2A" data-column="0" style="border:1px solid #808080"/><br>
                        STORE CODE
                    </th>
                    <th class="always-default">
                        <input type="search" class="form-control filter-input2A" data-column="1" style="border:1px solid #808080"/><br>
                        BRANCH NAME
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="2" style="border:1px solid #808080"/><br>
                        COMPANY NAME
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="3" style="border:1px solid #808080"/><br>
                        AREA MANAGER
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="4" style="border:1px solid #808080"/><br>
                        STORE AREA
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="5" style="border:1px solid #808080"/><br>
                        REGION
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="6" style="border:1px solid #808080"/><br>
                        STORE TYPE
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="7" style="border:1px solid #808080"/><br>
                        STORE SETUP
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="8" style="border:1px solid #808080"/><br>
                        STORE GROUP
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="9" style="border:1px solid #808080"/><br>
                        MALL SUB-GROUP
                    </th>
                    <th>
                        <input type="search" class="form-control filter-input2A" data-column="10" style="border:1px solid #808080"/><br>
                        NETWORK SETUP
                    </th>
                    <th class="sum">
                        <input type="search" class="form-control filter-input2A" data-column="11" style="border:1px solid #808080"/><br>
                        QTY
                    </th>
                    <th class="sum">
                        <input type="search" class="form-control filter-input2A" data-column="12" style="border:1px solid #808080"/><br>
                        GROSS SALES
                    </th>
                </tr>
            </thead>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable2A').append(htmlString);
    table2A = $('table.tblReports2A').DataTable({
        scrollX:        true,
        scrollCollapse: true,
        fixedColumns:{
            left: 2,
        },
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: reports_header,
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
                title: reports_header,
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
            url: '/sales/reports/sub/branch_B',
            data:{
                start_date: $('#start_date').val(),
                end_date: $('#end_date').val(),
                tblType: tblType,
                datacode: datacode
            }
        },
        columnDefs: [
            {
                "targets": [2,3,6,7,8,9,10],
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
            {
                data: 'setup',
                render: function(data, type, row, meta){
                    var setups = data.split(',');
                    var setupEnumeration = [];
                    for(var i = 0; i < setups.length; i++){
                        var setup = setups[i];
                        var setupName = '';

                        for(var j = 0; j < dataArray.length; j++){
                            if(dataArray[j][0] == setup){
                                setupName = dataArray[j][1];
                                setupEnumeration.push(setupName);
                                break;
                            }
                        }
                    }
                    return `<div style="white-space: normal; width: 400px;">${setupEnumeration.join(', ')}</div>`;
                }
            },
            { data: 'store_group' },
            { data: 'subgroup' },
            { data: 'network_setup' },
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
            tfoot_bugfix('tblReports2A');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports2A';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
    setInterval(() => {
        if($('.popover-header').is(':visible')){
            for(var i=0; i<=14; i++){
                if(table2A.column(i).visible()){
                    $('#filter2-'+i).prop('checked', true);
                }
                else{
                    $('#filter2-'+i).prop('checked', false);
                }
            }
        }
    }, 0);
}

function report_products(datacode, headername, tblType){
    loading_show();
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var reports_header = headername+' ('+display_range+') - Per Product';
    var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header}</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports2B')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReports2B" id="tblReports2B" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-input2B" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2B" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2B" data-column="2" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2B" data-column="3" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2B" data-column="4" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2B" data-column="5" style="border:1px solid #808080"/>
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
    $('#reportsTable2B').append(htmlString);
    table2B = $('table.tblReports2B').DataTable({
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: reports_header,
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
                title: reports_header,
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
            url: '/sales/reports/sub/product',
            data:{
                start_date: $('#start_date').val(),
                end_date: $('#end_date').val(),
                tblType: tblType,
                datacode: datacode
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
            tfoot_bugfix('tblReports2B');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports2B';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

function report_trantypeA(datacode, headername, tblType){
    loading_show();
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var reports_header = `${headername} (${display_range}) - Per Transaction Type`;
    var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header}</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports2C')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReports2C" id="tblReports2C" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-input2C" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2C" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2C" data-column="2" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2C" data-column="3" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2C" data-column="4" style="border:1px solid #808080"/>
                    </td>
                </tr>
                <tr>
                    <th>TRANSACTION TYPE</th>
                    <th class="sum">NO. OF TRANSACTIONS</th>
                    <th class="sum">GROSS SALES</th>
                    <th class="sum">TOTAL SALES</th>
                    <th class="sum">NET SALES</th>
                </tr>
            </thead>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right">TOTAL:</th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum sumamt"></th>
                    <th class="text-right sum sumamt"></th>
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable2C').append(htmlString);
    table2C = $('table.tblReports2C').DataTable({
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: reports_header,
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
                title: reports_header,
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
            url: '/sales/reports/sub/transaction_A',
            data:{
                start_date: $('#start_date').val(),
                end_date: $('#end_date').val(),
                tblType: tblType,
                datacode: datacode
            }
        },
        autoWidth: false,
        columns: [
            { data: 'transaction_name' },
            {
                data: 'tno',
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
            },
            {
                data: 'total_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                }
            },
            {
                data: 'net_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
                }
            }
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
            tfoot_bugfix('tblReports2C');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports2C';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

function report_trantypeB(datacode, headername, tblType){
    loading_show();
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var reports_header = `${headername} (${display_range}) - Per Transaction Type`;
    var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header}</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports2C')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReports2C" id="tblReports2C" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-input2C" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2C" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2C" data-column="2" style="border:1px solid #808080"/>
                    </td>
                </tr>
                <tr>
                    <th>TRANSACTION TYPE</th>
                    <th class="sum">QTY</th>
                    <th class="sum">GROSS SALES</th>
                </tr>
            </thead>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right">TOTAL:</th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable2C').append(htmlString);
    table2C = $('table.tblReports2C').DataTable({
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: reports_header,
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
                title: reports_header,
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
            url: '/sales/reports/sub/transaction_B',
            data:{
                start_date: $('#start_date').val(),
                end_date: $('#end_date').val(),
                tblType: tblType,
                datacode: datacode
            }
        },
        autoWidth: false,
        columns: [
            { data: 'transaction_name' },
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
            tfoot_bugfix('tblReports2C');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports2C';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

function report_hourlyA(datacode, headername, tblType){
    loading_show();
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var reports_header = `${headername} (${display_range}) - Per Hour`;
    var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header}</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports2D')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports2D" type="button"><span>PDF</span></button>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReports2D" id="tblReports2D" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-input2D" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2D" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2D" data-column="2" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2D" data-column="3" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2D" data-column="4" style="border:1px solid #808080"/>
                    </td>
                </tr>
                <tr>
                    <th>TIME</th>
                    <th class="sum">NO. OF TRANSACTIONS</th>
                    <th class="sum">GROSS SALES</th>
                    <th class="sum">TOTAL SALES</th>
                    <th class="sum">NET SALES</th>
                </tr>
            </thead>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right">TOTAL:</th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum sumamt"></th>
                    <th class="text-right sum sumamt"></th>
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable2D').append(htmlString);
    table2D = $('table.tblReports2D').DataTable({
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: reports_header,
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
                title: reports_header,
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
        iDisplayLength: -1,
        processing: true,
        serverSide: false,
        ajax: {
            url: '/sales/reports/sub/time_A',
            data:{
                start_date: $('#start_date').val(),
                end_date: $('#end_date').val(),
                tblType: tblType,
                datacode: datacode
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
            },
            {
                data: 'total_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                }
            },
            {
                data: 'net_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
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
            tfoot_bugfix('tblReports2D');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports2D';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

function report_hourlyB(datacode, headername, tblType){
    loading_show();
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var reports_header = `${headername} (${display_range}) - Per Hour`;
    var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header}</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports2D')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports2D" type="button"><span>PDF</span></button>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReports2D" id="tblReports2D" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-input2D" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2D" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input2D" data-column="2" style="border:1px solid #808080"/>
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
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable2D').append(htmlString);
    table2D = $('table.tblReports2D').DataTable({
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: reports_header,
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
                title: reports_header,
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
        iDisplayLength: -1,
        processing: true,
        serverSide: false,
        ajax: {
            url: '/sales/reports/sub/time_B',
            data:{
                start_date: $('#start_date').val(),
                end_date: $('#end_date').val(),
                tblType: tblType,
                datacode: datacode
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
            tfoot_bugfix('tblReports2D');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports2D';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

function report_datesA(datacode, headername, urlName, colData){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var htmlString = `<hr><div class="px-2 align-content"><h4>${headername} (${display_range})</h4>
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
                    <th>DATE</th>
                    <th>DAY</th>
                    <th class="sum">NO. OF TRANSACTIONS</th>
                    <th class="sum">GROSS SALES</th>
                    <th class="sum">TOTAL SALES</th>
                    <th class="sum">NET SALES</th>
                </tr>
            </thead>
            <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right" colspan="2">TOTAL:</th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum sumamt"></th>
                    <th class="text-right sum sumamt"></th>
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
                title: headername+' ('+display_range+')',
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
                title: headername+' ('+display_range+')',
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
                data: 'tno',
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
            },
            {
                data: 'total_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                }
            },
            {
                data: 'net_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
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
            if($('#report_category').val() == 'STORE'){
                $('#reportsTable1A').empty();
                subreport_product($('#report_category').val());
                subreport_transaction($('#report_category').val());
                loading_hide();
            }
            else if($('#report_category').val() == 'PRODUCT'){
                $('#reportsTable1A').empty();
                subreport_store($('#report_category').val());
                subreport_transaction($('#report_category').val());
                loading_hide();
            }
            else if($('#report_category').val() == 'TRANSACTION TYPE'){
                $('#reportsTable1A').empty();
                subreport_store($('#report_category').val());
                subreport_product($('#report_category').val());
                loading_hide();
            }
            else{
                loading_hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports2';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        }
    });
}

function report_datesB(datacode, headername, urlName, colData){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var htmlString = `<hr><div class="px-2 align-content"><h4>${headername} (${display_range})</h4>
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
                </tr>
                <tr>
                    <th>DATE</th>
                    <th>DAY</th>
                    <th>QTY</th>
                    <th class="sum">GROSS SALES</th>
                </tr>
            </thead>
            <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right" colspan="3">TOTAL:</th>
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
                title: headername+' ('+display_range+')',
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
                title: headername+' ('+display_range+')',
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
            if($('#report_category').val() == 'STORE'){
                $('#reportsTable1A').empty();
                subreport_product($('#report_category').val());
                subreport_transaction($('#report_category').val());
                loading_hide();
            }
            else if($('#report_category').val() == 'PRODUCT'){
                $('#reportsTable1A').empty();
                subreport_store($('#report_category').val());
                subreport_transaction($('#report_category').val());
                loading_hide();
            }
            else if($('#report_category').val() == 'TRANSACTION TYPE'){
                $('#reportsTable1A').empty();
                subreport_store($('#report_category').val());
                subreport_product($('#report_category').val());
                loading_hide();
            }
            else{
                loading_hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReports2';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        }
    });
}

function report_datesC(datacode, headername, urlName, colData){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var htmlString = `<hr><div class="px-2 align-content"><h4>${headername} (${display_range})</h4>
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
                </tr>
                <tr>
                    <th>DATE</th>
                    <th>DAY</th>
                    <th class="sum">NO. OF TRANSACTIONS</th>
                    <th class="sum">GROSS SALES</th>
                </tr>
            </thead>
            <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right" colspan="2">TOTAL:</th>
                    <th class="text-right sum"></th>
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
                title: headername+' ('+display_range+')',
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
                title: headername+' ('+display_range+')',
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
                data: 'tno',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${data.toLocaleString()}</span>`;
                }
            },
            {
                data: 'total',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
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
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports2';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

function subreport_store(report_category){
    console.log('SHOW STORES OF '+report_category);
}
function subreport_product(report_category){
    console.log('SHOW PRODUCTS OF '+report_category);
}
function subreport_transaction(report_category){
    console.log('SHOW TRANSACTIONS OF '+report_category);
}

$(document).on('click','table.tblReports2 tbody tr',function(){
    if(!table2.data().any()){ return false; }
    var report_category = $('#report_category').val();
    var data = table2.row(this).data();
    selected_date = data.date;
    if(report_category == 'STORE'){
        loading_show();
        $('#reportsTable3').empty();
        $('#reportsTable4').empty();
        $('#reportsTable5').empty();
        $('#reportsTable6').empty();
        $('#reportsTable7').empty();
        emptyQuantitative();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headername">${headername} <span id="headerdate">(${formatDate(data.date).toUpperCase()})</span> - Per Product</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports3')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports3" type="button"><span>PDF</span></button>
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
                        <th class="text-right sum sumamt"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable3').append(htmlString);
        table3 = $('table.tblReports3').DataTable({
            dom: 'Blftrip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    title: $('#headername').text(),
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
                    title: $('#headername').text(),
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
                tfoot_bugfix('tblReports3');
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
        loading_show();
        $('#reportsTable3').empty();
        $('#reportsTable4').empty();
        $('#reportsTable5').empty();
        $('#reportsTable6').empty();
        $('#reportsTable7').empty();
        emptyQuantitative();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headername">${headername} <span id="headerdate">(${formatDate(data.date).toUpperCase()})</span> - Per Store</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports3')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports3" type="button"><span>PDF</span></button>
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
                        <th class="text-right sum sumamt"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable3').append(htmlString);
        table3 = $('table.tblReports3').DataTable({
            dom: 'Blftrip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    title: $('#headername').text(),
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
                    title: $('#headername').text(),
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
                tfoot_bugfix('tblReports3');
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
        loading_show();
        $('#reportsTable3').empty();
        $('#reportsTable4').empty();
        $('#reportsTable5').empty();
        $('#reportsTable6').empty();
        $('#reportsTable7').empty();
        emptyQuantitative();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headername">${headername} <span id="headerdate">(${formatDate(data.date).toUpperCase()})</span> - Per Product</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports3')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports3" type="button"><span>PDF</span></button>
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
                        <th class="text-right sum sumamt"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable3').append(htmlString);
        table3 = $('table.tblReports3').DataTable({
            dom: 'Blftrip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    title: $('#headername').text(),
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
                    title: $('#headername').text(),
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
                tfoot_bugfix('tblReports3');
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
        loading_show();
        $('#reportsTable3').empty();
        $('#reportsTable4').empty();
        $('#reportsTable5').empty();
        $('#reportsTable6').empty();
        $('#reportsTable7').empty();
        emptyQuantitative();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headername">${headername} <span id="headerdate">(${formatDate(data.tdate).toUpperCase()})</span> - Per Store</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports3')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports3" type="button"><span>PDF</span></button>
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
                        <th class="sum">NO. OF TRANSACTIONS</th>
                        <th class="sum">GROSS SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum sumamt"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable3').append(htmlString);
        table3 = $('table.tblReports3').DataTable({
            dom: 'Blftrip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    title: $('#headername').text(),
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
                    title: $('#headername').text(),
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
                    data: 'tno',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${data.toLocaleString()}</span>`;
                    }
                },
                {
                    data: 'total',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
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
                tfoot_bugfix('tblReports3');
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
        loading_show();
        $('#reportsTable3').empty();
        $('#reportsTable4').empty();
        $('#reportsTable5').empty();
        $('#reportsTable6').empty();
        $('#reportsTable7').empty();
        emptyQuantitative();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headername">${headername} <span id="headerdate">(${formatDate(data.date).toUpperCase()})</span> - Per Store</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports3')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports3" type="button"><span>PDF</span></button>
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
                    </tr>
                    <tr>
                        <th>BRANCH NAME</th>
                        <th class="sum">NO. OF TRANSACTIONS</th>
                        <th class="sum">GROSS SALES</th>
                        <th class="sum">TOTAL SALES</th>
                        <th class="sum">NET SALES</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum sumamt"></th>
                        <th class="text-right sum sumamt"></th>
                        <th class="text-right sum sumamt"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTable3').append(htmlString);
        table3 = $('table.tblReports3').DataTable({
            dom: 'Blftrip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    title: $('#headername').text(),
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
                    title: $('#headername').text(),
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
                    data: 'tno',
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
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'net_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
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
                tfoot_bugfix('tblReports3');
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
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports4')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports4" type="button"><span>PDF</span></button>
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
                    <th class="sum">NO. OF TRANSACTIONS</th>
                    <th class="sum">GROSS SALES</th>
                    <th class="sum">TOTAL SALES</th>
                    <th class="sum">NET SALES</th>
                </tr>
            </thead>
            <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right">TOTAL:</th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum sumamt"></th>
                    <th class="text-right sum sumamt"></th>
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable4').append(htmlString);
    table4 = $('table.tblReports4').DataTable({
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: $('#headerlast').text(),
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
                title: $('#headerlast').text(),
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
            },
            {
                data: 'total_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                }
            },
            {
                data: 'net_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
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
            tfoot_bugfix('tblReports4');
            loading_hide();
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
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports4')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports4" type="button"><span>PDF</span></button>
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
            <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right" colspan="2">TOTAL:</th>
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable4').append(htmlString);
    table4 = $('table.tblReports4').DataTable({
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: $('#headerlast').text(),
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
                title: $('#headerlast').text(),
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
            tfoot_bugfix('tblReports4');
            loading_hide();
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
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports4')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports4" type="button"><span>PDF</span></button>
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
                    <th class="sum">NO. OF TRANSACTIONS</th>
                    <th class="sum">GROSS SALES</th>
                </tr>
            </thead>
            <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right">TOTAL:</th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable4').append(htmlString);
    table4 = $('table.tblReports4').DataTable({
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: $('#headerlast').text(),
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
                title: $('#headerlast').text(),
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
                    return `<span class="float-end">${data.toLocaleString()}</span>`;
                }
            },
            {
                data: 'total',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
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
            tfoot_bugfix('tblReports4');
            loading_hide();
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
    if(!table3.data().any()){ return false; }
    var report_category = $('#report_category').val();
    var data = table4.row(this).data();
    var selected_time = data.time_range_24hr.split(' - ');
    var start_hour = selected_time[0];
    var end_hour = selected_time[1];
    if(report_category == 'STORE'){
        tblType5 = 'storecode';
    }
    else if(report_category == 'TRANSACTION TYPE'){
        tblType5 = 'trantype';
    }
    else if(report_category == 'DISCOUNT'){
        tblType5 = 'discname';
    }
    else{
        return false;
    }
    loading_show();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    emptyQuantitative();

    var htmlString = `<hr><div class="px-2 align-content"><h4 id="header5"><span id="subheader5">${headername} (${formatDate(selected_date).toUpperCase()}) (${data.time_range_12hr})</span> - Product Sales</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports5')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports5" type="button"><span>PDF</span></button>
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
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable5').append(htmlString);
    table5 = $('table.tblReports5').DataTable({
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: $('#header5').text(),
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
                title: $('#header5').text(),
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
            url: '/sales/reports/datetime_A',
            data:{
                datacode: datacode,
                selected_date: selected_date,
                start_hour: start_hour,
                end_hour: end_hour,
                tblType: tblType5
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
            tfoot_bugfix('tblReports5');
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports5';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
                header6 = $('#subheader5').text();
                urlName = '/sales/reports/transaction_A';
                tblType = tblType5;
                colData = datacode;
                selected_date = selected_date;
                start_hour = start_hour;
                end_hour = end_hour;
                report_transactionsA(header6, urlName, tblType, colData, selected_date, start_hour, end_hour);
            }, 200);
        }
    });
});

function report_transactionsA(header6, urlName, tblType, colData, selected_date, start_hour, end_hour){
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
    emptyQuantitative();

    var htmlString = `<hr><div class="px-2 align-content"><h4 id="header6">${header6} - Per Transaction</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports6')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports6" type="button"><span>PDF</span></button>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReports6" id="tblReports6" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-input6" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input6" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input6" data-column="2" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input6" data-column="3" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-input6" data-column="4" style="border:1px solid #808080"/>
                    </td>
                </tr>
                <tr>
                    <th>TIME</th>
                    <th>REFERENCE NUMBER</th>
                    <th class="sum">GROSS SALES</th>
                    <th class="sum">TOTAL SALES</th>
                    <th class="sum">NET SALES</th>
                </tr>
            </thead>
            <tbody title="CLICK TO SHOW MORE INFORMATION"></tbody>
            <tfoot style="font-size: 14px;">
                <tr>
                    <th class="text-right" colspan="2">TOTAL:</th>
                    <th class="text-right sum sumamt"></th>
                    <th class="text-right sum sumamt"></th>
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTable6').append(htmlString);
    table6 = $('table.tblReports6').DataTable({
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: $('#header6').text(),
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
                title: $('#header6').text(),
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
        iDisplayLength: -1,
        processing: true,
        serverSide: false,
        ajax: {
            url: urlName,
            data:{
                tblType: tblType,
                colData: colData,
                selected_date: selected_date,
                start_hour: start_hour,
                end_hour: end_hour,
            }
        },
        columns: [
            {
                data: 'ttime',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return data;
                    }
                    return `<span>${moment(data, 'HH:mm:ss').format('hh:mm:ss A')}</span>`;
                }
            },
            {
                data: 'transcode',
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
                    return `<span class="float-end">${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
                }
            },
            {
                data: 'total_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(row.total_sales).toFixed(2))}</span>`;
                }
            },
            {
                data: 'net_sales',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return `<span class="float-end">${formatNumber(parseFloat(row.net_sales).toFixed(2))}</span>`;
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
            tfoot_bugfix('tblReports6');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReports6';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

$(document).on('click','table.tblReports6 tbody tr',function(){
    if(!table6.data().any()){ return false; }
    var data = table6.row(this).data();
    loading_show();
    $('#reportsTable7').empty();
    emptyQuantitative();

    $.ajax({
        url: "/sales/reports/reference",
        type: "get",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data:{
            tnumber: data.transcode,
            datatype: $('#report_category').val().toUpperCase()
        },
        success:function(response){
            var htmlString = `<hr><div class="px-2 align-content"><h4 id="header7"><span id="subheader7">${headername} (${formatDate(selected_date).toUpperCase()}) (REF#: ${data.transcode}) (${response})</span></h4>
            <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReports7')"><i class="fas fa-file-export"></i> EXPORT</button></div>
            <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReports7" type="button"><span>PDF</span></button>
            <div class="table-responsive container-fluid pt-2">
                <table class="table table-hover table-bordered table-striped tblReports7" id="tblReports7" style="width:100%;">
                    <thead style="font-weight:bolder" class="bg-default">
                        <tr class="tbsearch">
                            <td>
                                <input type="search" class="form-control filter-input7" data-column="0" style="border:1px solid #808080"/>
                            </td>
                            <td>
                                <input type="search" class="form-control filter-input7" data-column="1" style="border:1px solid #808080"/>
                            </td>
                            <td>
                                <input type="search" class="form-control filter-input7" data-column="2" style="border:1px solid #808080"/>
                            </td>
                            <td>
                                <input type="search" class="form-control filter-input7" data-column="3" style="border:1px solid #808080"/>
                            </td>
                            <td>
                                <input type="search" class="form-control filter-input7" data-column="4" style="border:1px solid #808080"/>
                            </td>
                            <td>
                                <input type="search" class="form-control filter-input7" data-column="5" style="border:1px solid #808080"/>
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
            $('#reportsTable7').append(htmlString);
            table7 = $('table.tblReports7').DataTable({
                dom: 'Blftrip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: 'Excel',
                        title: $('#header7').text(),
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
                        title: $('#header7').text(),
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
                    url: '/sales/reports/transaction_details',
                    data:{
                        transcode: data.transcode
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
                    tfoot_bugfix('tblReports7');
                    loading_hide();
                    setTimeout(() => {
                        window.location.href = '/sales/reports#tblReports7';
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

$(document).on('keyup search','.filter-input2A', function(){
    table2A.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-input2B', function(){
    table2B.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-input2C', function(){
    table2C.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-input2D', function(){
    table2D.column($(this).data('column')).search($(this).val()).draw();
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

$(document).on('keyup search','.filter-inputX', function(){
    tableX.column($(this).data('column')).search($(this).val()).draw();
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

$(document).on('keyup search','.filter-inputB', function(){
    tableB.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('keyup search','.filter-inputC', function(){
    tableC.column($(this).data('column')).search($(this).val()).draw();
});

setInterval(() => {
    if(!$('#reportsTable1').is(':empty') && $('#report_category').val() == 'STORE'){
        $('.reportsTable1').show();
    }
    else{
        $('.reportsTable1').hide();
    }

    if(!$('#reportsTable2A').is(':empty')){
        $('.reportsTable2A').show();
    }
    else{
        $('.reportsTable2A').hide();
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

$('body').on('click', '.checkboxFilter2', function(){
    var column = table2A.column($(this).attr('data-column'));
    var colnum = $(this).attr('data-column');
    column.visible(!column.visible());
    $('.fl-'+colnum).val('');
    table2A.column(colnum).search('').draw();
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
    $('#reportsTableB').empty();
    $('#reportsTableC').empty();
}

function emptyStandard(){
    $('#reportsTable1').empty();
    $('#reportsTable2A').empty();
    $('#reportsTable2B').empty();
    $('#reportsTable2C').empty();
    $('#reportsTable2D').empty();
    $('#reportsTable2').empty();
    $('#reportsTable3').empty();
    $('#reportsTable4').empty();
    $('#reportsTable5').empty();
    $('#reportsTable6').empty();
    $('#reportsTable7').empty();
}

$(document).on('change', '#custom_branch, #custom_product, #custom_transaction, #custom_discount, #bytransactiontype', function(){
    if($(this).val().includes('ALL')){
        $(this).val(['ALL']);
        $(this).trigger('chosen:updated');
    }
});