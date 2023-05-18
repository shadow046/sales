function quantitative_report(reports_header){
    if($('#report_filter').val() == 'stores by day'){
        $('#loading').show();
        var reports_header5 = reports_header +' - '+ $('#sales_type').val();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header5}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsX" id="tblReportsX" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th>STORE CODE</th>
                        <th>BRANCH NAME</th>
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
                        <th class="text-right" colspan="2">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableX').append(htmlString);
        tableX = $('table.tblReportsX').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: reports_header5,
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
                url: '/sales/reports/day/branch',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val()
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
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'monday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'tuesday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'wednesday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'thursday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'friday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'saturday_sales',
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
                    window.location.href = '/sales/reports#tblReportsX';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_filter').val() == 'stores by time'){
        $('#loading').show();
        var reports_header5 = reports_header +' - '+ $('#sales_type').val();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header5}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsX" id="tblReportsX" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th>STORE CODE</th>
                        <th>BRANCH NAME</th>
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
                        <th class="text-right" colspan="2">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableX').append(htmlString);
        tableX = $('table.tblReportsX').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: reports_header5,
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
                url: '/sales/reports/time/branch',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val()
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
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales1',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales2',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales3',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales4',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales5',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales6',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales7',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales8',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales9',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales10',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales11',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales12',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales13',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales14',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales15',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales16',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales17',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales18',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales19',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales20',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales21',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales22',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales23',
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
                    window.location.href = '/sales/reports#tblReportsX';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_filter').val() == 'products by day'){
        $('#loading').show();
        var reports_header5 = reports_header +' - '+ $('#sales_type').val();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header5}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsX" id="tblReportsX" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th>PRODUCT CODE</th>
                        <th>SHORT DESCRIPTION</th>
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
                        <th class="text-right" colspan="2">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableX').append(htmlString);
        tableX = $('table.tblReportsX').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: reports_header5,
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
                url: '/sales/reports/day/product',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val()
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
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function (i) {
                    if($('#sales_type').val() == 'SALES QUANTITY'){
                        return typeof i === 'string' ?
                        i.match(/-?\d+(?:\.\d+)?/)[0] * 1 :
                        typeof i === 'number' ?
                            i : 0;
                    }
                    else{
                        return typeof i === 'string' ?
                            i.replace(/[^\d.-]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    }
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
                    if($('#sales_type').val() == 'SALES QUANTITY'){
                        this.footer().innerHTML=sum;
                    }
                    else{
                        this.footer().innerHTML='₱ '+sum;
                    }
                });
            },
            initComplete: function(){
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReportsX';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_filter').val() == 'products by time'){
        $('#loading').show();
        var reports_header5 = reports_header +' - '+ $('#sales_type').val();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header5}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsX" id="tblReportsX" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th>PRODUCT CODE</th>
                        <th>SHORT DESCRIPTION</th>
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
                        <th class="text-right" colspan="2">TOTAL:</th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableX').append(htmlString);
        tableX = $('table.tblReportsX').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: reports_header5,
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
                url: '/sales/reports/time/product',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val()
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
            footerCallback:function(row,data,start,end,display){
                var api=this.api(),data;
                var intVal = function (i) {
                    if($('#sales_type').val() == 'SALES QUANTITY'){
                        return typeof i === 'string' ?
                        i.match(/-?\d+(?:\.\d+)?/)[0] * 1 :
                        typeof i === 'number' ?
                            i : 0;
                    }
                    else{
                        return typeof i === 'string' ?
                            i.replace(/[^\d.-]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    }
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
                    if($('#sales_type').val() == 'SALES QUANTITY'){
                        this.footer().innerHTML=sum;
                    }
                    else{
                        this.footer().innerHTML='₱ '+sum;
                    }
                });
            },
            initComplete: function(){
                $('#loading').hide();
                setTimeout(() => {
                    window.location.href = '/sales/reports#tblReportsX';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_filter').val() == 'transactions by day'){
        $('#loading').show();
        var reports_header5 = reports_header +' - '+ $('#sales_type').val();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header5}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsX" id="tblReportsX" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th>TRANSACTION TYPE</th>
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
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableX').append(htmlString);
        tableX = $('table.tblReportsX').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: reports_header5,
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
                url: '/sales/reports/day/transaction',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val()
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
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'monday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'tuesday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'wednesday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'thursday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'friday_sales',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'saturday_sales',
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
                    window.location.href = '/sales/reports#tblReportsX';
                    $('html, body').animate({
                        scrollTop: $($.attr(this, 'href')).offset()
                    }, 1000);
                }, 200);
            }
        });
    }
    else if($('#report_filter').val() == 'transactions by time'){
        $('#loading').show();
        var reports_header5 = reports_header +' - '+ $('#sales_type').val();
        var htmlString = `<hr><div class="px-2 align-content"><h4>${reports_header5}</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(0).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
        <div class="table-responsive container-fluid pt-2">
            <table class="table table-hover table-bordered table-striped tblReportsX" id="tblReportsX" style="width:100%;">
                <thead style="font-weight:bolder" class="bg-default">
                    <tr>
                        <th>TRANSACTION TYPE</th>
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
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableX').append(htmlString);
        tableX = $('table.tblReportsX').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: reports_header5,
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
                url: '/sales/reports/time/transaction',
                data:{
                    start_date: $('#start_date').val(),
                    end_date: $('#end_date').val(),
                    sales_type: $('#sales_type').val()
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
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales1',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales2',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales3',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales4',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales5',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales6',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales7',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales8',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales9',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales10',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales11',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales12',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales13',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales14',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales15',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales16',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales17',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales18',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales19',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales20',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales21',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales22',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return sortAmount(data);
                        }
                        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'sales23',
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
    if($('#report_type').val() == 'QUANTITATIVE'){
        if(!$('#report_filter').val()){
            $('.classSales').hide();
            $('.salesStore').hide();
            $('.salesProduct').hide();
            $('#sales_type').val('');
        }
        else{
            $('.classSales').show();
            if(['stores by day', 'stores by time', 'transactions by day', 'transactions by time'].includes($('#report_filter').val())){
                $('.salesStore').show();
                $('.salesProduct').hide();
            }
            if($('#report_filter').val() == 'products by day' || $('#report_filter').val() == 'products by time'){
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
    $('#sales_type').val('');
});

function amountType(data){
    if($('#sales_type').val() == 'SALES QUANTITY'){
        return `<span class="float-end">${data.toLocaleString()}</span>`;
    }
    else{
        return `<span class="float-end">${formatNumber(parseFloat(data).toFixed(2))}</span>`;
    }
}

$(document).on('click','table.tblReportsX tbody tr',function(){
    var data = tableX.row(this).data();
    var report_filter = $('#report_filter').val();
    $('#loading').show();
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
    if(report_filter == 'transactions by day' || report_filter == 'transactions by time'){
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
        $('#loading').hide();
        Swal.fire('UNAVAILABLE', 'This data breakdown is not yet available!', 'error');
        return false;
    }
});


function report_dates1(datacode, headername, urlName, colData){
    var display_range = (moment($('#start_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')+' TO '+moment($('#end_date').val(), 'YYYY-MM-DD').format('MMM. DD, YYYY')).toUpperCase();
    var htmlString = `<hr><div class="px-2 align-content"><h4>${headername} (${display_range})</h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(1).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
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
    $('#reportsTableY').append(htmlString);
    tableY = $('table.tblReportsY').DataTable({
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
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(1).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
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
                    <th class="text-right sum"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTableY').append(htmlString);
    tableY = $('table.tblReportsY').DataTable({
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
                    return `<span class="float-end">${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
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
    $('#loading').show();
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
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(2).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
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
    $('#reportsTableZ').append(htmlString);
    tableZ = $('table.tblReportsZ').DataTable({
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
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(2).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
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
                    <th class="text-right sum"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTableZ').append(htmlString);
    tableZ = $('table.tblReportsZ').DataTable({
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
                    return `<span class="float-end">${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
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
        $('#loading').show();
        $('#reportsTableA').empty();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headerA"><span id="subheaderA">${headername} (${formatDate(selected_date).toUpperCase()}) (${data.time_range_12hr})</span> - Product Sales</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(3).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
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
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableA').append(htmlString);
        tableA = $('table.tblReportsA').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#headerA').text(),
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
                        return `<span class="float-end">${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
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
        $('#loading').show();
        $('#reportsTableA').empty();

        var htmlString = `<hr><div class="px-2 align-content"><h4 id="headerA"><span id="subheaderA">${headername} (${formatDate(selected_date).toUpperCase()}) (${data.time_range_12hr})</span> - Product Sales</h4>
        <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(3).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
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
                        <th class="text-right sum"></th>
                    </tr>
                </tfoot>
            </table>
            <br>
        </div>`;
        $('#reportsTableA').append(htmlString);
        tableA = $('table.tblReportsA').DataTable({
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: $('#headerA').text(),
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
                        return `<span class="float-end">${formatNumber(parseFloat(row.gross_sales).toFixed(2))}</span>`;
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
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(4).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
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
                    <th class="text-right sum"></th>
                    <th class="text-right sum"></th>
                    <th class="text-right sum"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTableB').append(htmlString);
    tableB = $('table.tblReportsB').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: $('#headerB').text(),
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
    $('#loading').show();
    $('#reportsTableC').empty();
    emptyStandard();

    var htmlString = `<hr><div class="px-2 align-content"><h4 id="headerC"><span id="subheaderC">${headername} (${formatDate(selected_date).toUpperCase()}) (REF#: ${data.transcode})</span></h4>
    <button type="button" class="form-control btn btn-custom btn-default float-end" onclick="$('.buttons-excel').eq(5).click();"><i class="fas fa-file-export"></i> EXPORT</button></div>
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
                    <th class="text-right sum"></th>
                </tr>
            </tfoot>
        </table>
        <br>
    </div>`;
    $('#reportsTableC').append(htmlString);
    tableC = $('table.tblReportsC').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: $('#headerC').text(),
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
                window.location.href = '/sales/reports#tblReportsC';
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset()
                }, 1000);
            }, 200);
        }
    });
});