function quantitative_report(reports_header){
    if($('#report_filter').val() == 'STORE' && $('#report_classification').val() == 'BY DAY'){
        loading_show();
        var reports_header5 = reports_header +' - '+ $('#sales_type').val();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header5}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsX')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsX" id="tblReportsX" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th class="always-default">STORE CODE</th>
                        <th class="always-default">BRANCH NAME</th>
                        <th class="sum">SUNDAY</th>
                        <th class="sum">MONDAY</th>
                        <th class="sum">TUESDAY</th>
                        <th class="sum">WEDNESDAY</th>
                        <th class="sum">THURSDAY</th>
                        <th class="sum">FRIDAY</th>
                        <th class="sum">SATURDAY</th>
                        <th class="sum">TOTAL</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right"></th>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableX').append(htmlString);
        tableX = $('table.tblReportsX').DataTable({
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
                    title: reports_header5,
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
                    title: reports_header5,
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
                url: '/sales/reports/day/branch',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val(),
                    included: $('#custom_branch').val()
                }
            },
            columns: [
                { data: 'branch_code' },
                { data: 'store_name' },
                {
                    data: 'sunday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'monday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'tuesday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'wednesday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'thursday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'friday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'saturday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
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
                tfoot_bugfix('tblReportsX');
                loading_hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReportsX';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_filter').val() == 'STORE' && $('#report_classification').val() == 'BY TIME'){
        loading_show();
        var reports_header5 = reports_header +' - '+ $('#sales_type').val();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header5}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsX')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsX" id="tblReportsX" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th class="always-default">STORE CODE</th>
                        <th class="always-default">BRANCH NAME</th>
                        <th class="sum">12:00AM - 12:59AM</th>
                        <th class="sum">1:00AM - 1:59AM</th>
                        <th class="sum">2:00AM - 2:59AM</th>
                        <th class="sum">3:00AM - 3:59AM</th>
                        <th class="sum">4:00AM - 4:59AM</th>
                        <th class="sum">5:00AM - 5:59AM</th>
                        <th class="sum">6:00AM - 6:59AM</th>
                        <th class="sum">7:00AM - 7:59AM</th>
                        <th class="sum">8:00AM - 8:59AM</th>
                        <th class="sum">9:00AM - 9:59AM</th>
                        <th class="sum">10:00AM - 10:59AM</th>
                        <th class="sum">11:00AM - 11:59AM</th>
                        <th class="sum">12:00PM - 12:59PM</th>
                        <th class="sum">1:00PM - 1:59PM</th>
                        <th class="sum">2:00PM - 2:59PM</th>
                        <th class="sum">3:00PM - 3:59PM</th>
                        <th class="sum">4:00PM - 4:59PM</th>
                        <th class="sum">5:00PM - 5:59PM</th>
                        <th class="sum">6:00PM - 6:59PM</th>
                        <th class="sum">7:00PM - 7:59PM</th>
                        <th class="sum">8:00PM - 8:59PM</th>
                        <th class="sum">9:00PM - 9:59PM</th>
                        <th class="sum">10:00PM - 10:59PM</th>
                        <th class="sum">11:00PM - 11:59PM</th>
                        <th class="sum">TOTAL</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right"></th>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableX').append(htmlString);
        tableX = $('table.tblReportsX').DataTable({
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
                    title: reports_header5,
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
                    title: reports_header5,
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
                url: '/sales/reports/time/branch',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val(),
                    included: $('#custom_branch').val()
                }
            },
            columns: [
                { data: 'branch_code' },
                { data: 'store_name' },
                {
                    data: 'sales0',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales1',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales2',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales3',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales4',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales5',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales6',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales7',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales8',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales9',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales10',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales11',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales12',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales13',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales14',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales15',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales16',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales17',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales18',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales19',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales20',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales21',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales22',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales23',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
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
                tfoot_bugfix('tblReportsX');
                loading_hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReportsX';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_filter').val() == 'STORE' && $('#report_classification').val() == 'BY TRANSACTION TYPE'){
        loading_show();
        var reports_headerQ = reports_header +' - '+ $('#sales_type').val();
        $('#reportsTableQ').empty().append(`
            <hr>
            <div class="mb-2 align-content">
                <h4 style="zoom:85%;">${reports_headerQ}</h4>
                <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsQ')"><i class="fas fa-file-export"></i> EXPORT</button>
                <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReportsQ" type="button"><span>PDF</span></button>
            </div>
            <table class="table table-striped table-hover table-bordered" id="tblReportsQ" style="width:100%">
                <thead class="bg-default" id="tblReportsHeadQ"></thead>
            </table>
        `);

        var transaction_type = $('#bytransactiontype').val();
        var trans_length = transaction_type.length;
        var defcol_length = 11;
        var total_col = trans_length + defcol_length;

        var columns = [
            { title: 'STORE CODE', sTitle: 'STORE CODE', data: 'branch_code' },
            { title: 'BRANCH NAME', sTitle: 'BRANCH NAME', data: 'store_name' },
            { title: 'COMPANY NAME', sTitle: 'COMPANY NAME', data: 'company_name' },
            { title: 'AREA MANAGER', sTitle: 'AREA MANAGER', data: 'area_manager' },
            { title: 'STORE AREA', sTitle: 'STORE AREA', data: 'store_area' },
            { title: 'REGION', sTitle: 'REGION', data: 'region' },
            { title: 'STORE TYPE', sTitle: 'STORE TYPE', data: 'type' },
            {
                title: 'STORE SETUP', sTitle: 'STORE SETUP',
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
            { title: 'STORE GROUP', sTitle: 'STORE GROUP', data: 'store_group' },
            { title: 'MALL SUB-GROUP', sTitle: 'MALL SUB-GROUP', data: 'subgroup' },
            { title: 'NETWORK SETUP', sTitle: 'NETWORK SETUP', data: 'network_setup' },

        ];

        for(var i = 0; i < trans_length; i++){
            columns.push({
                title: transaction_type[i],
                sTitle: transaction_type[i],
                data: (transaction_type[i].replace(/[^\w\s]/g, "_").replace(/\s/g, "_")).toLowerCase(),
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return amountType(data);
                }
            });
        }

        tableQ = $('#tblReportsQ').DataTable({
            scrollX:        true,
            scrollCollapse: true,
            fixedColumns:{
                left: 2,
            },
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    title: reports_headerQ,
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
                    title: reports_headerQ,
                    exportOptions: {
                        modifier: {
                        order: 'index',
                        page: 'all',
                        search: 'none'
                        }
                    }
                },
                'colvis'
            ],
            ajax: {
                url: '/sales/reports/trans/branch',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val(),
                    tblcolumns: $('#bytransactiontype').val(),
                    included: $('#custom_branch').val()
                }
            },
            columns: columns,
            initComplete: function(){
                $('#tblReportsHeadQ').append(`<tr></tr>`);
                for(var i = 0; i < total_col; i++){
                    $(`#tblReportsHeadQ tr:first-child th:contains("${columns[i].title}")`).append(`<br><input type="search" class="form-control filter-inputQ mt-1" data-column="${i}" style="border:1px solid #808080"/>`);
                }
                setInterval(() => {
                    for(var i = defcol_length; i < total_col; i++){
                        $(`button[data-cv-idx="${i}"]`).remove();
                    }
                    $('button[data-cv-idx="0"], button[data-cv-idx="1"]').remove();
                }, 0);
                $('.buttons-colvis').click();
                $('.dt-button-collection').hide();
                setTimeout(() => {
                    for(var i = 2; i < total_col - trans_length; i++){
                        $(`button[data-cv-idx="${i}"]`).click();
                    }
                    $('#current_server').click();
                    var spanElement = $('span:contains("Column visibility")');
                    spanElement.html('<b>TOGGLE COLUMNS</b>');
                    loading_hide();
                }, 500);
            }
        });
    }
    else if($('#report_filter').val() == 'PRODUCT' && $('#report_classification').val() == 'BY DAY'){
        loading_show();
        var reports_header5 = reports_header +' - '+ $('#sales_type').val();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header5}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsX')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsX" id="tblReportsX" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th class="always-default">PRODUCT CODE</th>
                        <th class="always-default">SHORT DESCRIPTION</th>
                        <th class="sum">SUNDAY</th>
                        <th class="sum">MONDAY</th>
                        <th class="sum">TUESDAY</th>
                        <th class="sum">WEDNESDAY</th>
                        <th class="sum">THURSDAY</th>
                        <th class="sum">FRIDAY</th>
                        <th class="sum">SATURDAY</th>
                        <th class="sum">TOTAL</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right"></th>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableX').append(htmlString);
        tableX = $('table.tblReportsX').DataTable({
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
                    title: reports_header5,
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
                    title: reports_header5,
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
                url: '/sales/reports/day/product',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val(),
                    included: $('#custom_product').val()
                }
            },
            columns: [
                { data: 'product_code' },
                { data: 'product_name' },
                {
                    data: 'sunday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'monday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'tuesday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'wednesday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'thursday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'friday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'saturday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
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
                tfoot_bugfix('tblReportsX');
                loading_hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReportsX';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_filter').val() == 'PRODUCT' && $('#report_classification').val() == 'BY TIME'){
        loading_show();
        var reports_header5 = reports_header +' - '+ $('#sales_type').val();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header5}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsX')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsX" id="tblReportsX" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th class="always-default">PRODUCT CODE</th>
                        <th class="always-default">SHORT DESCRIPTION</th>
                        <th class="sum">12:00AM - 12:59AM</th>
                        <th class="sum">1:00AM - 1:59AM</th>
                        <th class="sum">2:00AM - 2:59AM</th>
                        <th class="sum">3:00AM - 3:59AM</th>
                        <th class="sum">4:00AM - 4:59AM</th>
                        <th class="sum">5:00AM - 5:59AM</th>
                        <th class="sum">6:00AM - 6:59AM</th>
                        <th class="sum">7:00AM - 7:59AM</th>
                        <th class="sum">8:00AM - 8:59AM</th>
                        <th class="sum">9:00AM - 9:59AM</th>
                        <th class="sum">10:00AM - 10:59AM</th>
                        <th class="sum">11:00AM - 11:59AM</th>
                        <th class="sum">12:00PM - 12:59PM</th>
                        <th class="sum">1:00PM - 1:59PM</th>
                        <th class="sum">2:00PM - 2:59PM</th>
                        <th class="sum">3:00PM - 3:59PM</th>
                        <th class="sum">4:00PM - 4:59PM</th>
                        <th class="sum">5:00PM - 5:59PM</th>
                        <th class="sum">6:00PM - 6:59PM</th>
                        <th class="sum">7:00PM - 7:59PM</th>
                        <th class="sum">8:00PM - 8:59PM</th>
                        <th class="sum">9:00PM - 9:59PM</th>
                        <th class="sum">10:00PM - 10:59PM</th>
                        <th class="sum">11:00PM - 11:59PM</th>
                        <th class="sum">TOTAL</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right"></th>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableX').append(htmlString);
        tableX = $('table.tblReportsX').DataTable({
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
                    title: reports_header5,
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
                    title: reports_header5,
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
                url: '/sales/reports/time/product',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val(),
                    included: $('#custom_product').val()
                }
            },
            columns: [
                { data: 'product_code' },
                { data: 'product_name' },
                {
                    data: 'sales0',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales1',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales2',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales3',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales4',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales5',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales6',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales7',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales8',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales9',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales10',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales11',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales12',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales13',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales14',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales15',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales16',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales17',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales18',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales19',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales20',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales21',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales22',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales23',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
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
                tfoot_bugfix('tblReportsX');
                loading_hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReportsX';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_filter').val() == 'PRODUCT' && $('#report_classification').val() == 'BY TRANSACTION TYPE'){
        loading_show();
        var reports_headerQ = reports_header +' - '+ $('#sales_type').val();
        $('#reportsTableQ').empty().append(`
            <hr>
            <div class="mb-2 align-content">
                <h4 style="zoom:85%;">${reports_headerQ}</h4>
                <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsQ')"><i class="fas fa-file-export"></i> EXPORT</button>
                <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReportsQ" type="button"><span>PDF</span></button>
            </div>
            <table class="table table-striped table-hover table-bordered" id="tblReportsQ" style="width:100%">
                <thead class="bg-default" id="tblReportsHeadQ"></thead>
            </table>
        `);

        var transaction_type = $('#bytransactiontype').val();
        var trans_length = transaction_type.length;
        var defcol_length = 7;
        var total_col = trans_length + defcol_length;

        var columns = [
            { title: 'CATEGORY', sTitle: 'CATEGORY', data: 'itemcat' },
            { title: 'ITEM CODE', sTitle: 'ITEM CODE', data: 'itemcode' },
            { title: 'SHORT DESCRIPTION', sTitle: 'SHORT DESCRIPTION', data: 'desc1' },
            { title: 'LONG DESCRIPTION', sTitle: 'LONG DESCRIPTION', data: 'desc2' },
            { title: 'STORE SETUP', sTitle: 'STORE SETUP', data: 'setup_name' },
            { title: 'STORE AREA', sTitle: 'STORE AREA', data: 'area_name' },
            { title: 'STORE BRANCH', sTitle: 'STORE BRANCH', data: 'store_name' },
        ];

        for(var i = 0; i < trans_length; i++){
            columns.push({
                title: transaction_type[i],
                sTitle: transaction_type[i],
                data: (transaction_type[i].replace(/[^\w\s]/g, "_").replace(/\s/g, "_")).toLowerCase(),
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return sortAmount(data);
                    }
                    return amountType(data);
                }
            });
        }

        tableQ = $('#tblReportsQ').DataTable({
            scrollX:        true,
            scrollCollapse: true,
            fixedColumns:{
                left: 3,
            },
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    title: reports_headerQ,
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
                    title: reports_headerQ,
                    exportOptions: {
                        modifier: {
                        order: 'index',
                        page: 'all',
                        search: 'none'
                        }
                    }
                },
                'colvis'
            ],
            ajax: {
                url: '/sales/reports/trans/product',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val(),
                    tblcolumns: $('#bytransactiontype').val(),
                    included: $('#custom_product').val()
                }
            },
            columns: columns,
            initComplete: function(){
                $('#tblReportsHeadQ').append(`<tr></tr>`);
                for(var i = 0; i < total_col; i++){
                    $(`#tblReportsHeadQ tr:first-child th:contains("${columns[i].title}")`).append(`<br><input type="search" class="form-control filter-inputQ mt-1" data-column="${i}" style="border:1px solid #808080"/>`);
                }
                setInterval(() => {
                    for(var i = defcol_length; i < total_col; i++){
                        $(`button[data-cv-idx="${i}"]`).remove();
                    }
                    $('button[data-cv-idx="0"], button[data-cv-idx="1"], button[data-cv-idx="2"]').remove();
                }, 0);
                $('.buttons-colvis').click();
                $('.dt-button-collection').hide();
                setTimeout(() => {
                    for(var i = 3; i < total_col - trans_length; i++){
                        $(`button[data-cv-idx="${i}"]`).click();
                    }
                    $('#current_server').click();
                    var spanElement = $('span:contains("Column visibility")');
                    spanElement.html('<b>TOGGLE COLUMNS</b>');
                    loading_hide();
                }, 500);
            }
        });
    }
    else if($('#report_filter').val() == 'TRANSACTION TYPE' && $('#report_classification').val() == 'BY DAY'){
        loading_show();
        var reports_header5 = reports_header +' - '+ $('#sales_type').val();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header5}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsX')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsX" id="tblReportsX" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th class="always-default">TRANSACTION TYPE</th>
                        <th class="sum">SUNDAY</th>
                        <th class="sum">MONDAY</th>
                        <th class="sum">TUESDAY</th>
                        <th class="sum">WEDNESDAY</th>
                        <th class="sum">THURSDAY</th>
                        <th class="sum">FRIDAY</th>
                        <th class="sum">SATURDAY</th>
                        <th class="sum">TOTAL</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableX').append(htmlString);
        tableX = $('table.tblReportsX').DataTable({
            scrollX:        true,
            scrollCollapse: true,
            fixedColumns:{
                left: 1,
            },
            dom: 'Blftrip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    title: reports_header5,
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
                    title: reports_header5,
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
                url: '/sales/reports/day/transaction',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val(),
                    included: $('#custom_transaction').val()
                }
            },
            columns: [
                { data: 'trantype' },
                {
                    data: 'sunday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'monday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'tuesday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'wednesday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'thursday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'friday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'saturday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
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
                tfoot_bugfix('tblReportsX');
                loading_hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReportsX';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_filter').val() == 'TRANSACTION TYPE' && $('#report_classification').val() == 'BY TIME'){
        loading_show();
        var reports_header5 = reports_header +' - '+ $('#sales_type').val();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header5}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsX')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsX" id="tblReportsX" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th class="always-default">TRANSACTION TYPE</th>
                        <th class="sum">12:00AM - 12:59AM</th>
                        <th class="sum">1:00AM - 1:59AM</th>
                        <th class="sum">2:00AM - 2:59AM</th>
                        <th class="sum">3:00AM - 3:59AM</th>
                        <th class="sum">4:00AM - 4:59AM</th>
                        <th class="sum">5:00AM - 5:59AM</th>
                        <th class="sum">6:00AM - 6:59AM</th>
                        <th class="sum">7:00AM - 7:59AM</th>
                        <th class="sum">8:00AM - 8:59AM</th>
                        <th class="sum">9:00AM - 9:59AM</th>
                        <th class="sum">10:00AM - 10:59AM</th>
                        <th class="sum">11:00AM - 11:59AM</th>
                        <th class="sum">12:00PM - 12:59PM</th>
                        <th class="sum">1:00PM - 1:59PM</th>
                        <th class="sum">2:00PM - 2:59PM</th>
                        <th class="sum">3:00PM - 3:59PM</th>
                        <th class="sum">4:00PM - 4:59PM</th>
                        <th class="sum">5:00PM - 5:59PM</th>
                        <th class="sum">6:00PM - 6:59PM</th>
                        <th class="sum">7:00PM - 7:59PM</th>
                        <th class="sum">8:00PM - 8:59PM</th>
                        <th class="sum">9:00PM - 9:59PM</th>
                        <th class="sum">10:00PM - 10:59PM</th>
                        <th class="sum">11:00PM - 11:59PM</th>
                        <th class="sum">TOTAL</th>
                    </tr>
                </thead>
                <tfoot style="font-size: 14px;">
                    <tr>
                        <th class="text-right">TOTAL:</th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                        <th class="text-right sum ${sumamt}"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableX').append(htmlString);
        tableX = $('table.tblReportsX').DataTable({
            scrollX:        true,
            scrollCollapse: true,
            fixedColumns:{
                left: 1,
            },
            dom: 'Blftrip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    title: reports_header5,
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
                    title: reports_header5,
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
                url: '/sales/reports/time/transaction',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val(),
                    included: $('#custom_transaction').val()
                }
            },
            columns: [
                { data: 'trantype' },
                {
                    data: 'sales0',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales1',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales2',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales3',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales4',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales5',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales6',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales7',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales8',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales9',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales10',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales11',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales12',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales13',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales14',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales15',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales16',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales17',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales18',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales19',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales20',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales21',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales22',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'sales23',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
                    }
                },
                {
                    data: 'total_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return amountType(data);
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
                tfoot_bugfix('tblReportsX');
                loading_hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReportsX';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else{
        Swal.fire('UNAVAILABLE', 'This Report Filter is not yet available!', 'error');
    }
}

setInterval(() => {
    if($('#report_type').val() == 'CUSTOM'){
        if(!$('#report_filter').val()){
            $('.classSales').hide();
            $('.salesStore').hide();
            $('.salesProduct').hide();
            $('#sales_type').val('');
        }
        else{
            $('.classSales').show();
            if($('#report_filter').val() == 'STORE' || $('#report_filter').val() == 'TRANSACTION TYPE'){
                $('.salesStore').show();
                $('.salesProduct').hide();
            }
            if($('#report_filter').val() == 'PRODUCT'){
                $('.salesStore').hide();
                $('.salesProduct').show();
            }
        }
    }
    else{
        $('.classSales').hide();
        $('#sales_type').val('');
    }
}, 0);

$('#report_filter').on('change', function(){
    $('#custom_branch').val('');
    $('#custom_branch').trigger('chosen:updated');
    $('#custom_product').val('');
    $('#custom_product').trigger('chosen:updated');
    $('#custom_transaction').val('');
    $('#custom_transaction').trigger('chosen:updated');

    if($(this).val() == 'STORE'){
        $('.classCustomBranch').show();
        $('.classCustomProduct').hide();
        $('.classCustomTransaction').hide();
    }
    else if($(this).val() == 'PRODUCT'){
        $('.classCustomBranch').hide();
        $('.classCustomProduct').show();
        $('.classCustomTransaction').hide();
    }
    else if($(this).val() == 'TRANSACTION TYPE'){
        $('.classCustomBranch').hide();
        $('.classCustomProduct').hide();
        $('.classCustomTransaction').show();
    }
    else{
        $('.classCustomBranch').hide();
        $('.classCustomProduct').hide();
        $('.classCustomTransaction').hide();
    }
    $('#sales_type').val('');
});

function amountType(data){
    if($('#sales_type').val() == 'SALES QUANTITY' || $('#sales_type').val() == 'NO. OF TRANSACTIONS'){
        return `<span class="float-end">${data.toLocaleString()}</span>`;
    }
    else{
        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
    }
}

$(document).on('click','table.tblReportsX tbody tr',function(){
    var data = tableX.row(this).data();
    var report_filter = $('#report_filter').val();
    loading_show();
    emptyStandard();
    if(report_filter == 'stores by day' || report_filter == 'stores by time'){
        $('#reportsTableY').empty();
        $('#reportsTableZ').empty();
        $('#reportsTableA').empty();
        datacode = data.branch_code;
        headername = data.branch_name;
        urlName = '/sales/reports/branch/date';
        colData = datacode;
        report_dates1(datacode, headername, urlName, colData);
    }
    else if(report_filter == 'products by day' || report_filter == 'products by time'){
        $('#reportsTableY').empty();
        $('#reportsTableZ').empty();
        $('#reportsTableA').empty();
        datacode = data.product_code;
        headername = data.product_code+': '+data.product_name;
        urlName = '/sales/reports/product/date';
        colData = datacode;
        report_dates2(datacode, headername, urlName, colData);
    }
    else if(report_filter == 'transactions by day' || report_filter == 'transactions by time'){
        $('#reportsTableY').empty();
        $('#reportsTableZ').empty();
        $('#reportsTableA').empty();
        datacode = data.trantype;
        headername = data.trantype;
        urlName = '/sales/reports/transaction/date';
        colData = datacode;
        report_dates1(datacode, headername, urlName, colData);
    }
    else{
        loading_hide();
        Swal.fire('UNAVAILABLE', 'This data breakdown is not yet available!', 'error');
        return false;
    }
});


function report_dates1(datacode, headername, urlName, colData){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var htmlString = `<hr><div class="px-2 align-content"><h4>${headername} (${display_range})</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsY')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReportsY" type="button"><span>PDF</span></button>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReportsY" id="tblReportsY" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-inputY" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputY" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputY" data-column="2" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputY" data-column="3" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputY" data-column="4" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputY" data-column="5" style="border:1px solid #808080"/>
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
    $('#reportsTableY').append(htmlString);
    tableY = $('table.tblReportsY').DataTable({
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
            tfoot_bugfix('tblReportsY');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReportsY';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

function report_dates2(datacode, headername, urlName, colData){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var htmlString = `<hr><div class="px-2 align-content"><h4>${headername} (${display_range})</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsY')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReportsY" type="button"><span>PDF</span></button>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReportsY" id="tblReportsY" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-inputY" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputY" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputY" data-column="2" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputY" data-column="3" style="border:1px solid #808080"/>
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
                    <th class="text-right sum sumamt"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTableY').append(htmlString);
    tableY = $('table.tblReportsY').DataTable({
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
            tfoot_bugfix('tblReportsY');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReportsY';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

$(document).on('click','table.tblReportsY tbody tr',function(){
    var report_filter = $('#report_filter').val();
    var data = tableY.row(this).data();
    selected_date = data.date;
    loading_show();
    if(report_filter == 'stores by day' || report_filter == 'stores by time'){
        urlName = '/sales/reports/time_A';
        tblType = 'storecode';
        colData = datacode;
        selected_date = data.date;
        report_hoursX(headername, urlName, tblType, colData, selected_date);
    }
    if(report_filter == 'products by day' || report_filter == 'products by time'){
        urlName = '/sales/reports/time_B';
        tblType = 'itemcode';
        colData = datacode;
        selected_date = data.date;
        report_hoursY(headername, urlName, tblType, colData, selected_date);
    }
    if(report_filter == 'transactions by day' || report_filter == 'transactions by time'){
        urlName = '/sales/reports/time_A';
        tblType = 'trantype';
        colData = datacode;
        selected_date = data.date;
        report_hoursX(headername, urlName, tblType, colData, selected_date);
    }
});

function report_hoursX(headername, urlName, tblType, colData, selected_date){
    emptyStandard();
    $('#reportsTableZ').empty();
    $('#reportsTableA').empty();
    var htmlString = `<hr><div class="px-2 align-content"><h4 id="headerlast">${headername} (${moment(selected_date, 'YYYY-MM-DD').format('MMM. DD, YYYY').toUpperCase()}) ${$('#headerdate').text()} - Per Hour</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsZ')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReportsZ" type="button"><span>PDF</span></button>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReportsZ" id="tblReportsZ" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-inputZ" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputZ" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputZ" data-column="2" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputZ" data-column="3" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputZ" data-column="4" style="border:1px solid #808080"/>
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
    $('#reportsTableZ').append(htmlString);
    tableZ = $('table.tblReportsZ').DataTable({
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
            tfoot_bugfix('tblReportsZ');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReportsZ';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

function report_hoursY(headername, urlName, tblType, colData, selected_date){
    emptyStandard();
    $('#reportsTableZ').empty();
    $('#reportsTableA').empty();
    var htmlString = `<hr><div class="px-2 align-content"><h4 id="headerlast">${headername} (${moment(selected_date, 'YYYY-MM-DD').format('MMM. DD, YYYY').toUpperCase()}) ${$('#headerdate').text()} - Per Hour</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsZ')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReportsZ" type="button"><span>PDF</span></button>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReportsZ" id="tblReportsZ" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-inputZ" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputZ" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputZ" data-column="2" style="border:1px solid #808080"/>
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
    $('#reportsTableZ').append(htmlString);
    tableZ = $('table.tblReportsZ').DataTable({
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
            tfoot_bugfix('tblReportsZ');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReportsZ';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}

$(document).on('click','table.tblReportsZ tbody tr',function(){
    var report_filter = $('#report_filter').val();
    var data = tableZ.row(this).data();
    var selected_time = data.time_range_24hr.split(' - ');
    var start_hour = selected_time[0];
    var end_hour = selected_time[1];
    if(report_filter == 'stores by day' || report_filter == 'stores by time'){
        loading_show();
        $('#reportsTableA').empty();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headerA"><span id="subheaderA">${headername} (${formatDate(selected_date).toUpperCase()}) (${data.time_range_12hr})</span> - Product Sales</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsA')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReportsA" type="button"><span>PDF</span></button>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsA" id="tblReportsA" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-inputA" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-inputA" data-column="1" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-inputA" data-column="2" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-inputA" data-column="3" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-inputA" data-column="4" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-inputA" data-column="5" style="border:1px solid #808080"/>
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
        $('#reportsTableA').append(htmlString);
        tableA = $('table.tblReportsA').DataTable({
            dom: 'Blftrip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    title: $('#headerA').text(),
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
                    title: $('#headerA').text(),
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
                    tblType: 'storecode'
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
                tfoot_bugfix('tblReportsA');
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReportsA';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                    headerA = $('#subheaderA').text();
                    urlName = '/sales/reports/transaction_A';
                    tblType = 'storecode';
                    colData = datacode;
                    selected_date = selected_date;
                    start_hour = start_hour;
                    end_hour = end_hour;
                    report_transactionsX(headerA, urlName, tblType, colData, selected_date, start_hour, end_hour);
                }, 200);
            }
        });
    }

    if(report_filter == 'transactions by day' || report_filter == 'transactions by time'){
        loading_show();
        $('#reportsTableA').empty();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headerA"><span id="subheaderA">${headername} (${formatDate(selected_date).toUpperCase()}) (${data.time_range_12hr})</span> - Product Sales</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsA')"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReportsA" type="button"><span>PDF</span></button>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsA" id="tblReportsA" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr class="tbsearch">
                        <td>
                            <input type="search" class="form-control filter-inputA" data-column="0" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-inputA" data-column="1" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-inputA" data-column="2" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-inputA" data-column="3" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-inputA" data-column="4" style="border:1px solid #808080"/>
                        </td>
                        <td>
                            <input type="search" class="form-control filter-inputA" data-column="5" style="border:1px solid #808080"/>
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
        $('#reportsTableA').append(htmlString);
        tableA = $('table.tblReportsA').DataTable({
            dom: 'Blftrip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    title: $('#headerA').text(),
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
                    title: $('#headerA').text(),
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
                    tblType: 'trantype'
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
                tfoot_bugfix('tblReportsA');
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReportsA';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                    headerA = $('#subheaderA').text();
                    urlName = '/sales/reports/transaction_A';
                    tblType = 'trantype';
                    colData = datacode;
                    selected_date = selected_date;
                    start_hour = start_hour;
                    end_hour = end_hour;
                    report_transactionsX(headerA, urlName, tblType, colData, selected_date, start_hour, end_hour);
                }, 200);
            }
        });
    }
});

function report_transactionsX(headerA, urlName, tblType, colData, selected_date, start_hour, end_hour){
    $('#reportsTableB').empty();
    $('#reportsTableC').empty();
    emptyStandard();

    var htmlString = `<hr><div class="px-2 align-content"><h4 id="headerB">${headerA} - Per Transaction</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsB')"><i class="fas fa-file-export"></i> EXPORT</button></div>
    <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReportsB" type="button"><span>PDF</span></button>
    <div class="table-responsive container-fluid pt-2">
        <table class="table table-hover table-bordered table-striped tblReportsB" id="tblReportsB" style="width:100%;">
            <thead style="font-weight:bolder" class="bg-default">
                <tr class="tbsearch">
                    <td>
                        <input type="search" class="form-control filter-inputB" data-column="0" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputB" data-column="1" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputB" data-column="2" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputB" data-column="3" style="border:1px solid #808080"/>
                    </td>
                    <td>
                        <input type="search" class="form-control filter-inputB" data-column="4" style="border:1px solid #808080"/>
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
    $('#reportsTableB').append(htmlString);
    tableB = $('table.tblReportsB').DataTable({
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                title: $('#headerB').text(),
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
                title: $('#headerB').text(),
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
            tfoot_bugfix('tblReportsB');
            loading_hide();
            setTimeout(() => {
                window.location.href = '/sales/reports#tblReportsB';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
}


$(document).on('click','table.tblReportsB tbody tr',function(){
    var data = tableB.row(this).data();
    loading_show();
    $('#reportsTableC').empty();
    emptyStandard();

    $.ajax({
        url: "/sales/reports/reference",
        type: "get",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data:{
            tnumber: data.transcode,
            datatype: $('#report_filter').val().toUpperCase()
        },
        success:function(response){
            var htmlString = `<hr><div class="px-2 align-content"><h4 id="headerC"><span id="subheaderC">${headername} (${formatDate(selected_date).toUpperCase()}) (REF#: ${data.transcode}) (${response})</span></h4>
            <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="btnExportClick('tblReportsC')"><i class="fas fa-file-export"></i> EXPORT</button></div>
            <button class="dt-button buttons-pdf buttons-html5 d-none" tabindex="0" aria-controls="tblReportsC" type="button"><span>PDF</span></button>
            <div class="table-responsive container-fluid pt-2">
                <table class="table table-hover table-bordered table-striped tblReportsC" id="tblReportsC" style="width:100%;">
                    <thead style="font-weight:bolder" class="bg-default">
                        <tr class="tbsearch">
                            <td>
                                <input type="search" class="form-control filter-inputC" data-column="0" style="border:1px solid #808080"/>
                            </td>
                            <td>
                                <input type="search" class="form-control filter-inputC" data-column="1" style="border:1px solid #808080"/>
                            </td>
                            <td>
                                <input type="search" class="form-control filter-inputC" data-column="2" style="border:1px solid #808080"/>
                            </td>
                            <td>
                                <input type="search" class="form-control filter-inputC" data-column="3" style="border:1px solid #808080"/>
                            </td>
                            <td>
                                <input type="search" class="form-control filter-inputC" data-column="4" style="border:1px solid #808080"/>
                            </td>
                            <td>
                                <input type="search" class="form-control filter-inputC" data-column="5" style="border:1px solid #808080"/>
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
            $('#reportsTableC').append(htmlString);
            tableC = $('table.tblReportsC').DataTable({
                dom: 'Blftrip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: 'Excel',
                        title: $('#headerC').text(),
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
                        title: $('#headerC').text(),
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
                    tfoot_bugfix('tblReportsC');
                    loading_hide();
                    setTimeout(() => {
                        window.location.href = '/sales/reports#tblReportsC';
                        $('html, body').animate({
                            scrollTop: $($.attr(this, 'href')).offset()
                        }, 1000);
                    }, 200);
                }
            });
        }
    });
});

setInterval(() => {
    if($('#report_type').val() == 'CUSTOM'){
        if($('#report_filter').val()){
            if($('#report_filter').val() == 'TRANSACTION TYPE' && $('#report_classification').val() == 'BY TRANSACTION TYPE'){
                $('#report_classification').val('');
            }
            if($('#report_filter').val() != 'TRANSACTION TYPE'){
                $('.forAll').show();
                $('.forTrans').show();
            }
            else{
                $('.forAll').show();
                $('.forTrans').hide();
            }
        }
        else{
            $('.forAll').show();
            $('.forTrans').hide();
        }
    }

    if($('#report_type').val() == 'CUSTOM'){
        if($('#report_classification').val() == 'BY TRANSACTION TYPE'){
            $('.classByTransactionType').show();
        }
        else{
            $('#bytransactiontype').val('');
            $('#bytransactiontype').trigger('chosen:updated');
            $('.classByTransactionType').hide();
        }
    }
}, 0);

setInterval(() => {
    $('.form-control').on('click', function(e){
        e.stopPropagation();
    });
}, 0);

setInterval(() => {
    if($('#bytransactiontype').val().length == 0){
        $('#bytransactiontype_chosen').addClass('requiredField requiredInput redBorder');
    }
    else{
        $('#bytransactiontype_chosen').removeClass('requiredField requiredInput redBorder');
        var spanClass = $('#bytransactiontype').attr('id') + '_chosen';
        $('.className' + spanClass).remove();
    }
}, 0);