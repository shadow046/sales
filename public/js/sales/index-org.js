var selected = 'date', dfrom, dto, mfrom, mto, yearstart = 2020, table,
dt = new Date(), curmonth = dt.getMonth()+1,curyear = dt.getFullYear();
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
$(document).ready(function(){
    $('#loading').show();
    setTimeout(() => {
        $('#daterange').show();
        dashboard(moment().subtract(365, 'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD'));
        // CategoryPiechart(moment().subtract(90, 'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD'));
        // TenderPiechart(moment().subtract(90, 'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD'));
    }, 500);
});

google.charts.load("current", {packages:["corechart"]});
$(function() {
    $('#daterange').daterangepicker({
        maxDate: new Date(),
        opens: 'right',
        startDate: moment().add(-365, 'day'),
    }, function(start, end, label) {
        dfrom = start.format('YYYY-MM-DD');
        dto = end.format('YYYY-MM-DD');
        $('#loading').show();
        setTimeout(() => {
            $('#daterange').show();
            $('table.dashboardTable').dataTable().fnDestroy();
            CategoryPiechart(dfrom,dto);
            TenderPiechart(dfrom,dto);
            dashboard(dfrom,dto);
        }, 500);
    });
});

$(document).on("click", "#dashboardTable tr", function () {
    data = table.row(this).data();
    console.log(data);
    $('#loading').show();
    setTimeout(() => {
        CategoryPiechart(moment().subtract(365, 'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD'), data.storecode);
        TenderPiechart(moment().subtract(365, 'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD'), data.storecode);
        $('#loading').hide();
    }, 300);
    var intervalID = setInterval(function() {
        if ($('#loading').is(':visible')) {
            console.log('visible');
        } else {
            $('html, body').animate({
                scrollTop: ($(window).height() / 2) + 100
            }, 500);
            $('#store_name').html(data.branch_name+'<span style="font-weight:normal"> SALES PERFORMANCE FOR: </span>');
            $('#DateRange').text(moment().subtract(365, 'days').format("MMMM D, YYYY")+' to '+moment().format("MMMM D, YYYY"));
            $('#store_name').show();
            $('#DateRange').show();
            clearInterval(intervalID);
        }
    }, 500);
      
});

$(document).on('keyup', '.dashboardTable thead .column_search', function () {
    table
        .column( $(this).parent().index() )
        .search( this.value )
        .draw();
});

function dashboard(df, dt) {
    table = $('table.dashboardTable').DataTable({
        processing: true,
        serverSide: false,
        "dom": 'rtp',
        order:[[1,"asc"],[0,"asc"]],
        ajax: {
            url:"/sales-data",
            type:"get",
            data:{
                type: 'ALL',
                dfrom: df,
                dto: dt
            }
        },
        columns: [
            { data: 'storecode' },
            { data: 'company_name' },
            { data: 'type' },
            { data: 'store_area' },
            { data: 'region' },
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
                console.log();
                $.each(data.data[0], function(k, v){
                    pieData.addRows([
                        [k, parseInt(v)]
                    ]);
                });
                var options = {
                    title: 'SALES BY TENDER TYPE',
                    pieHole: 0.4,
                    height: 350,
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
