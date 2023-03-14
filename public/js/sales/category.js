var dfrom, dto;
google.charts.load("current", {packages:["corechart"]});
// google.charts.setOnLoadCallback(function () {
//     $.ajax({
//         url:"/sales-data",
//         type:"get",
//         async:false,
//         data:{
//             type: 'category'
//         },
//         success:function(data){
//             var pieData = google.visualization.arrayToDataTable([]);
//             pieData.addColumn('string','Category');
//             pieData.addColumn('number', 'Quantity');
//             $.each(data.data, (i, data) => {
//                 pieData.addRows([
//                     [data.itemcat, data.qty]
//                 ]);
//             });
//             var options = {
//                 title: 'SHARES BY CATEGORY',
//                 height: 300
//             };
            
//             var chart = new google.visualization.PieChart(document.getElementById('categoryChart'));
//             chart.draw(pieData, options);
//         },
//         error: function (data) {
//             alert(data.responseText);
//             return false;
//         }
//     });
// });

$(document).on('change', '#chartStyle', function(){
    google.charts.setOnLoadCallback(function () {
        $.ajax({
            url:"/sales-data",
            type:"get",
            async:false,
            data:{
                type: 'category',
                dfrom: dfrom,
                dto: dto
            },
            success:function(data){
                var pieData = google.visualization.arrayToDataTable([]);
                pieData.addColumn('string','Category');
                pieData.addColumn('number', 'Quantity');
                if ($('#chartStyle').val() == "Donut") {
                    $.each(data.data, (i, data) => {
                        pieData.addRows([
                            [data.itemcat, data.qty]
                        ]);
                    });
                    var options = {
                        title: 'SHARES BY CATEGORY',
                        pieHole: 0.4,
                        height: 300
                    };
                    var chart = new google.visualization.PieChart(document.getElementById('categoryChart'));
                }
                else if ($('#chartStyle').val() == "Pie") {
                    $.each(data.data, (i, data) => {
                        pieData.addRows([
                            [data.itemcat, data.qty]
                        ]);
                    });
                    var options = {
                        title: 'SHARES BY CATEGORY',
                        height: 300
                    };
                    var chart = new google.visualization.PieChart(document.getElementById('categoryChart'));
                }
                else if ($('#chartStyle').val() == "Line") {
                    $.each(data.data, (i, data) => {
                        pieData.addRows([
                            [data.itemcat, data.qty]
                        ]);
                    });
                    var options = {
                        title: 'SHARES BY CATEGORY',
                        height: 300
                    };
                    var chart = new google.visualization.LineChart(document.getElementById('categoryChart'));
                }
                else if ($('#chartStyle').val() == "Bar") {
                    pieData.addColumn({type: 'number', role: 'annotation'});
                    $.each(data.data, (i, data) => {
                        pieData.addRows([
                            [data.itemcat, data.qty, data.qty]
                        ]);
                    });
                    var options = {
                        title: 'SHARES BY CATEGORY',
                        isStacked:true,
                        height: pieData.getNumberOfRows() * 41 + 30,
                        height: 300,
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
                        bars: 'horizontal'
                    };
                    var chart = new google.visualization.BarChart(document.getElementById('categoryChart'));
                }
                
                chart.draw(pieData, options);
            },
            error: function (data) {
                alert(data.responseText);
                return false;
            }
        });
    });
});

$(function() {
    $('#daterange').daterangepicker({
        maxDate: new Date(),
        // dateLimit: { days: 14 },
        opens: 'right'
    }, function(start, end, label) {
        dfrom = start.format('YYYY-MM-DD');
        dto = end.format('YYYY-MM-DD');
        var chartOption = '<option value="" selected disabled>select chart</option>'+
                '<option value="Pie">Pie Chart</option>'+
                '<option value="Donut" >Donut Chart</option>'+
                '<option value="Line">Line Chart</option>'+
                '<option value="Bar">Bar Chart</option>';
                $("#chartStyle").find('option').remove().end().append(chartOption);
                $('#chartStyle').show();
        // $.ajax({
        //     url:"/sales-data",
        //     type:"get",
        //     async:false,
        //     data:{
        //         type: 'category',
        //         dfrom: dfrom,
        //         dto: dto
        //     },
        //     success:function(data){
        //         var chartOption = '<option value="" selected disabled>select chart</option>'+
        //         '<option value="Pie" selected>Pie Chart</option>'+
        //         '<option value="Donut" >Donut Chart</option>'+
        //         '<option value="Line">Line Chart</option>'+
        //         '<option value="Column">Column Chart</option>';
        //         $("#chartStyle").find('option').remove().end().append(chartOption);
        //         $('#chartStyle').show();
        //     },
        //     error: function (data) {
        //         alert(data.responseText);
        //         return false;
        //     }
        // });
    });
});