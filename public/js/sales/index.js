var selected = 'date',branchcode, branchname, fromDate, toDate, dfrom, dto, mfrom, mto, yearstart = 2020, table, dashboardTable, dailyTable, categoryTable, dstart,dend,
dt = new Date(), curmonth = dt.getMonth()+1,curyear = dt.getFullYear();
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
google.charts.load("current", {packages:["corechart"]});


$(document).ready(function(){
    // Create date inputs
    $('#loading').show();
    setTimeout(() => {
        google.charts.setOnLoadCallback(function () {
            $.ajax({
                url:"/sales/barchart",
                type:"get",
                async:false,
                success:function(data){
                    var barData = google.visualization.arrayToDataTable([]);
                    barData.addColumn('string','AREA');
                    barData.addColumn('number', 'SALES');
                    barData.addColumn({type: 'number', role: 'annotation'});
                    $.each(data.data, (i, data) => {
                        if (data.totalsales != 'none') {
                            barData.addRows([
                                [data.store_area, parseFloat(data.totalsales), data.totalsales]
                            ]);
                        }
                    });
                    
                    var options = {
                        title: 'SALES BY STORE AREA',
                        isStacked:true,
                        height: barData.getNumberOfRows() * 60 + 30,
                        width: $(window).width() - 100,
                        chartArea:{
                            top: 50,
                        },
                        series: {
                            0: {
                                type: 'bars'
                            },
                            1: {
                                type: 'line',
                                color: 'grey',
                                lineWidth: 0,
                                pointSize: 0,
                                visibleInLegend: false
                            }
                        },
                        legend: { position: 'right', maxLines: 1 },
                        axes: {
                            x: {
                                0: { side: 'top'}
                            }
                        },
                        bars: 'horizontal'
                    };
                        
                    var chart = new google.visualization.BarChart(document.getElementById('barChart'));
                    chart.draw(barData, options);
                },
                error: function (data) {
                    alert(data.responseText);
                    return false;
                }
            });
        });

        dashboardTable = $('table.dashboardTable').DataTable({
            processing: true,
            serverSide: false,
            "dom": 'lrtp',
            order:[[4,"desc"]],
            // "ordering": false,
            ajax: {
                url:"/sales-data",
                type:"get",
                data:{
                    type: 'ALL'
                }
            },
            columns: [
                { data: 'branch_name' },
                { data: 'subgroup' },
                { data: 'city' },
                { data: 'store_area' },
                { data: null,
                    "render": function(data, type, row){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.totalsales).toFixed(2))}</span>`;
                    }
                }
            ],
            initComplete: function(){
                $('#loading').hide();
            }
        });

        
    }, 500);

});

// $(function() {
//     $('#daterange').daterangepicker({
//         maxDate: new Date(),
//         opens: 'right',
//         startDate: moment().add(-365, 'day'),
//     }, function(start, end, label) {
//         dfrom = start.format('YYYY-MM-DD');
//         dto = end.format('YYYY-MM-DD');
//         dstart = start;
//         dend = end;
//         $('#loading').show();
//         $('#labelDiv').hide();
//         $('#categoryTableDiv').hide();
//         $('#categoryChartDiv').hide();
//         $('#tenderchartDiv').hide();
//         $('#tenderTableDiv').hide();
//         $('#tenderTable').hide();
//         setTimeout(() => {
//             $('#daterange').show();
//             $('table.dashboardTable').dataTable().fnDestroy();
//             dashboard(dfrom,dto);
//             Barchart(dfrom,dto);
//             $('#sales_header_DateRange').text(start.format("MMMM D, YYYY")+' to '+end.format("MMMM D, YYYY"));
//             $('#sales_header_DateRange').show();
//         }, 500);
//     });
// });
$(document).on('change', '#from, #to', function () {
    dailyTable.draw();
});

$(document).on("click", "#dailyTable tbody tr", function () {
    var data = dailyTable.row(this).data();
    $('#catheader').text(branchname+' SALES BY PRODUCT CATEGORY '+ moment(data.tdate, 'YYYY-MM-DD').format("MMMM DD, YYYY"))
    $('table.categoryTable').dataTable().fnDestroy();
    $('table.discountTable').dataTable().fnDestroy();
    $('#categoryChartDiv').show();
    $('#loading').show();
    setTimeout(() => {   
        $.ajax({
            url:"/sales/tender_data",
            type:"get",
            async: false,
            data:{
                storecode: branchcode,
                date: data.tdate
            },
            success:function(response){
                $('#tenderTableDiv').html(response);
                $('#tenderTableDiv').show();
            }
        });
        $('#tenderchartDiv').show();
        google.charts.setOnLoadCallback(function () {
            $.ajax({
                url:"/sales/tender_pie_data",
                type:"get",
                async:false,
                data:{
                    storecode: branchcode,
                    date: data.tdate
                },
                success:function(data){
                    var pieData = google.visualization.arrayToDataTable([]);
                    pieData.addColumn('string','Date');
                    pieData.addColumn('number', 'Sales');
                    $.each(data.data[0], function(k, v){
                        pieData.addRows([
                            [k, parseFloat(v)]
                        ]);
                    });
                    
                    var options = {
                        title: 'SALES BY TENDER TYPE',
                        pieHole: 0.4,
                        height: 350
                    };
                    
                    var chart = new google.visualization.PieChart(document.getElementById('tenderchart'));
                    chart.draw(pieData, options);
                },
                error: function (data) {
                    alert(data.responseText);
                    return false;
                }
            });
        });
        
        google.charts.setOnLoadCallback(function () {
            $.ajax({
                url:"/sales/pie_data",
                type:"get",
                async:false,
                data:{
                    storecode: branchcode,
                    date: data.tdate
                },
                success:function(pie){
                    var pieData = google.visualization.arrayToDataTable([]);
                    pieData.addColumn('string','Category');
                    pieData.addColumn('number', 'Quantity');
                    $.each(pie.data, (i, pie) => {
                        pieData.addRows([
                            [pie.itemcat, pie.qty]
                        ]);
                    });
                    var options = {
                        title: 'SHARES BY PRODUCT CATEGORY',
                        height: 300
                    };
                    
                    var chart = new google.visualization.PieChart(document.getElementById('categoryChart'));
                    chart.draw(pieData, options);

                    google.visualization.events.addListener(chart, 'select', function() {
                        var selectedItem = chart.getSelection()[0];
                        if (selectedItem !== undefined) {
                            // console.log(selectedItem);
                            var value = pieData.getValue(selectedItem.row, 0);
                        }
                    });
                },
                error: function (data) {
                    alert(data.responseText);
                    return false;
                }
            });
        });
        categoryTable = $('table.categoryTable').DataTable({
            processing: true,
            serverSide: false,
            "dom": 'lrtp',
            // async: false,
            ajax: {
                url:"/sales/category_data",
                type:"get",
                data:{
                    storecode: branchcode,
                    date: data.tdate
                }
            },
            columns: [
                { data: 'category' },
                { data: 'long_desc' },
                { data: null,
                    "render": function(data, type, row){
                        return `<span class="float-end">${row.qty}</span>`;
                    }
                },
                { data: null,
                    "render": function(data, type, row){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.totalsales).toFixed(2))}</span>`;
                    }
                }
            ],
            initComplete: function(){
                $('#categoryTableDiv').show();
                $('#categoryTable').show();
            }
        });
        
        discountTable = $('table.discountTable').DataTable({
            processing: true,
            serverSide: false,
            "dom": 'lrtp',
            // async: false,
            ajax: {
                url:"/sales/discount_data",
                type:"get",
                data:{
                    storecode: branchcode,
                    date: data.tdate
                }
            },
            columns: [
                { data: 'discname' },
                { data: null,
                    "render": function(data, type, row){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.discamt).toFixed(2))}</span>`;
                    }
                }
            ],
            initComplete: function(){
                $('#loading').hide();
                $('#discountTableDiv').show();
                $('#discountTable').show();
            }
        });
        var intervalID = setInterval(function() {
            if ($('#loading').is(':visible')) {
            } 
            else {
                $("html, body").animate({ scrollTop: $(document).height()}, "slow",function() {
                    // animation complete
                });
                clearInterval(intervalID);
            }
        }, 500);
    }, 500);
    
});

$(document).on("click", "#dashboardTable tbody tr", function () {
    var data = dashboardTable.row(this).data();
    branchcode = data.branch_code;
    branchname = data.branch_name;
    $('#loading').show();
    setTimeout(() => {
        $('#dailyTableDiv').show();
        $('#dailyTable').show();
        $('#dailyheader').text(data.branch_name+' SALES FOR THE LAST 60 DAYS');
        $('table.dailyTable').dataTable().fnDestroy();
        dailyTable = $('table.dailyTable').DataTable({
            processing: true,
            serverSide: false,
            "dom": 'lrtp',
            async: false,
            ajax: {
                url:"/sales/daily_data",
                type:"get",
                data:{
                    storecode: data.branch_code
                }
            },
            columnDefs: [
                {
                    targets: 0,
                    visible: false
                }
            ],
            columns: [
                { data: 'tdate' },
                {
                    data: null,
                    "render": function(data, type, row){
                        return "<span class='d-none'>"+row.tdate+"</span>"+moment(row.tdate, 'YYYY-MM-DD').format("MMMM DD, YYYY");
                    }
                },
                { data: null,
                    "render": function(data, type, row){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.gross).toFixed(2))}</span>`;
                    }
                },
                { data: null,
                    "render": function(data, type, row){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.totalsales).toFixed(2))}</span>`;
                    }
                },
                { data: null,
                    "render": function(data, type, row){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.netsales).toFixed(2))}</span>`;
                    }
                }
            ],
            initComplete: function(){
                $('#loading').hide();
            }
        });
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                if ( settings.nTable.id !== 'dailyTable' ) { 
                    console.log(settings.nTable.id);
                    return true;
                }
                var min = new Date( $('#from').val() );
                var max = new Date( $('#to').val() );
                var date = new Date( data[0] );
                if (
                    ( min === null && max === null ) ||
                    ( min === null && date <= max ) ||
                    ( min <= date   && max === null ) ||
                    ( min <= date   && date <= max )
                ) {
                    console.log(settings.nTable.id);
                    console.log('true');
                    return true;
                }
                return false;
            }
        );
        var intervalID = setInterval(function() {
            if ($('#loading').is(':visible')) {
            } 
            else {
                $("html, body").animate({ scrollTop: $('#dashboardTable').height() + $('#dailyTable').height() - 100}, 500,function() {
                    // animation complete
                });
                clearInterval(intervalID);
            }
        }, 500);
    }, 500);
    

    // $('#labelDiv').show();
    // $('#dailyTableDiv').show();
    // $('#categoryChartDiv').show();
    // $('#tenderchartDiv').show();
    // $('#tenderTableDiv').show();
    // $('#tenderTable').show();
    // $('table.categoryTable').dataTable().fnDestroy();
    // $('table.tenderTable').dataTable().fnDestroy();
    // $('#loading').show();
    // setTimeout(() => {
    //     if (dstart) {
    //         CategoryPiechart(dstart.format('YYYY-MM-DD'),dend.format('YYYY-MM-DD'), dashboardTable.storecode);
    //         TenderPiechart(dstart.format('YYYY-MM-DD'),dend.format('YYYY-MM-DD'), dashboardTable.storecode);
    //     }
    //     else{
    //         CategoryPiechart(moment().subtract(365, 'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD'), dashboardTable.storecode);
    //         TenderPiechart(moment().subtract(365, 'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD'), dashboardTable.storecode);
    //     }
    //     $('#loading').hide();
    // }, 300);
    // var intervalID = setInterval(function() {
    //     if ($('#loading').is(':visible')) {
    //     } 
    //     else {
    //         $("html, body").animate({ scrollTop: $(document).height() }, 500,function() {
    //             // animation complete
    //         });
    //         $('#store_name').html(dashboardTable.branch_name+'<span style="font-weight:normal"> SALES BY PRODUCT CATEGORY</span>');
    //         $('#tender_store_name').html(dashboardTable.branch_name+'<span style="font-weight:normal"> SALES BY TENDER</span>');
    //         if (dstart) {
    //             $('.DateRange').text(dstart.format("MMMM D, YYYY")+' to '+dend.format("MMMM D, YYYY"));
    //         }
    //         else{
    //             $('.DateRange').text(moment().subtract(365, 'days').format("MMMM D, YYYY")+' to '+moment().format("MMMM D, YYYY"));
    //         }
    //         $('#store_name').show();
    //         $('#tender_store_name').show();
    //         $('.DateRange').show();
    //         clearInterval(intervalID);
    //     }
    // }, 500);

    // categoryTable = $('table.categoryTable').DataTable({
    //     processing: true,
    //     serverSide: false,
    //     "dom": 'lrtp',
    //     async: false,
    //     // order:[[1,"asc"],[0,"asc"]],
    //     ajax: {
    //         url:"/sales/category_data",
    //         type:"get",
    //         data:{
    //             storecode: dashboardTable.storecode,
    //             dfrom: dfrom,
    //             dto: dto
    //         }
    //     },
    //     columns: [
    //         { data: 'category' },
    //         { data: 'long_desc' },
    //         { data: null,
    //             "render": function(data, type, row){
    //                 return `<span class="float-end">${row.qty}</span>`;
    //             }
    //         },
    //         { data: null,
    //             "render": function(data, type, row){
    //                 return `<span class="float-end">₱ ${formatNumber(parseFloat(row.totalsales).toFixed(2))}</span>`;
    //             }
    //         }
    //     ],
    //     initComplete: function(){
    //         $('#loading').hide();
    //     }
    // });

    // $.ajax({
    //     url:"/sales/tender_data",
    //     type:"get",
    //     async: false,
    //     data:{
    //         storecode: dashboardTable.storecode,
    //         dfrom: dfrom,
    //         dto: dto
    //     },
    //     success:function(response){
    //         $('#tenderTableDiv').html(response)
    //     }
    // });

    // $('#categoryTable').show();
    // $('#tenderTable').show();
    
});

$(document).on('keyup', '.dashboardTable thead .column_search', function () {
    dashboardTable
        .column( $(this).parent().index() )
        .search( this.value )
        .draw();
});


// function Barchart(df, dt) {
//     google.charts.setOnLoadCallback(function () {
//         $.ajax({
//             url:"/sales/barchart",
//             type:"get",
//             async:false,
//             data:{
//                 dfrom: df,
//                 dto: dt,
//             },
//             success:function(data){
//                 var barData = google.visualization.arrayToDataTable([]);
//                 barData.addColumn('string','AREA');
//                 barData.addColumn('number', 'SALES');
//                 barData.addColumn({type: 'number', role: 'annotation'});
//                 $.each(data.data, (i, data) => {
//                     if (data.totalsales != 'none') {
//                         barData.addRows([
//                             [data.store_area, parseFloat(data.totalsales), data.totalsales]
//                         ]);
//                     }
//                 });
                
//                 var options = {
//                     title: 'SALES BY STORE AREA',
//                     isStacked:true,
//                     height: barData.getNumberOfRows() * 60 + 30,
//                     width: $(window).width() - 100,
//                     chartArea:{
//                         top: 50,
//                     },
//                     series: {
//                         0: {
//                             type: 'bars'
//                         },
//                         1: {
//                             type: 'line',
//                             color: 'grey',
//                             lineWidth: 0,
//                             pointSize: 0,
//                             visibleInLegend: false
//                         }
//                     },
//                     legend: { position: 'right', maxLines: 1 },
//                     axes: {
//                         x: {
//                             0: { side: 'top'}
//                         }
//                     },
//                     bars: 'horizontal',
//                     sort: 'enable',       // Enable sorting
//                     sortColumn: 1,        // Sort by the second column (sales)
//                     sortAscending: true  
//                 };
                    
//                 var chart = new google.visualization.BarChart(document.getElementById('barChart'));
//                 chart.draw(barData, options);
//             },
//             error: function (data) {
//                 alert(data.responseText);
//                 return false;
//             }
//         });
//     });
// }
function Barchart(df, dt) {

    google.charts.setOnLoadCallback(function () {
        $.ajax({
            url: "/sales/barchart",
            type: "get",
            async: false,
            data: {
                dfrom: df,
                dto: dt,
            },
            success: function (data) {
                var chartData = [];
                chartData.push(['AREA', 'SALES', { type: 'number', role: 'annotation' }]);
                $.each(data.data, (i, data) => {
                    if (data.totalsales != 'none') {
                        chartData.push([data.store_area, parseFloat(data.totalsales), data.totalsales]);
                    }
                });
        
                // Manually sort the chart data by the second column (sales) in ascending order
                chartData.sort(function (a, b) {
                    return a[1] - b[1];
                });
        
                var barData = google.visualization.arrayToDataTable(chartData);
        
                var options = {
                    title: 'SALES BY STORE AREA',
                    isStacked: true,
                    height: barData.getNumberOfRows() * 60 + 30,
                    width: $(window).width() - 100,
                    chartArea: {
                        top: 50,
                    },
                    series: {
                        0: {
                            type: 'bars'
                        },
                        1: {
                            type: 'line',
                            color: 'grey',
                            lineWidth: 0,
                            pointSize: 0,
                            visibleInLegend: false
                        }
                    },
                    legend: { position: 'right', maxLines: 1 },
                    axes: {
                        x: {
                            0: { side: 'top' }
                        }
                    },
                    bars: 'horizontal'
                };
                var chart = new google.visualization.BarChart(document.getElementById('barChart'));
                chart.draw(barData, options);
            },
            error: function (data) {
                alert(data.responseText);
                return false;
            }
        });
    });
}
  

function CategoryPiechart(df, dt, storecode) {
    google.charts.setOnLoadCallback(function () {
        $.ajax({
            url:"/sales-data",
            type:"get",
            async:false,
            data:{
                type: 'category',
                dfrom: df,
                dto: dt,
                storecode: storecode
            },
            success:function(data){
                var pieData = google.visualization.arrayToDataTable([]);
                pieData.addColumn('string','Category');
                pieData.addColumn('number', 'Quantity');
                $.each(data.data, (i, data) => {
                    pieData.addRows([
                        [data.itemcat, data.qty]
                    ]);
                });
                var options = {
                    title: 'SHARES BY PRODUCT CATEGORY',
                    height: 300
                };
                
                var chart = new google.visualization.PieChart(document.getElementById('categoryChart'));
                chart.draw(pieData, options);

                google.visualization.events.addListener(chart, 'select', function() {
                    var selectedItem = chart.getSelection()[0];
                    console.log(selectedItem);
                    if (selectedItem !== undefined) {
                        // console.log(selectedItem);
                        var value = pieData.getValue(selectedItem.row, 0);
                        console.log(value);
                    }
                });
            },
            error: function (data) {
                alert(data.responseText);
                return false;
            }
        });
    });
}

function TenderPiechart(df, dt, storecode) {
    google.charts.setOnLoadCallback(function () {
        $.ajax({
            url:"/sales-data",
            type:"get",
            async:false,
            data:{
                type: 'tendertype',
                dfrom: df,
                dto: dt,
                storecode: storecode
            },
            success:function(data){
                var pieData = google.visualization.arrayToDataTable([]);
                pieData.addColumn('string','Date');
                pieData.addColumn('number', 'Sales');
                $.each(data.data[0], function(k, v){
                    pieData.addRows([
                        [k, parseInt(v)]
                    ]);
                });
                var options = {
                    title: 'SALES BY TENDER TYPE',
                    pieHole: 0.4,
                    height: 350
                };
                
                var chart = new google.visualization.PieChart(document.getElementById('tenderchart'));
                chart.draw(pieData, options);
            },
            error: function (data) {
                alert(data.responseText);
                return false;
            }
        });
    });
    
}
