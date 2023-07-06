var dfrom, dto, dbefore;
google.charts.load("current", {packages:["corechart", "bar"]});
$(function() {
    $('#date').daterangepicker({
        maxDate: new Date(),
        // dateLimit: { days: 14 },
        opens: 'right'
    }, function(start, end, label) {
        dfrom = start.format('YYYY-MM-DD');
        dto = end.format('YYYY-MM-DD');
        $('#gOption').change();
    });
});


// $(document).ready(function() {
//     dbefore = $('#date').val();
//     $('#date').datepicker( {
//         onSelect: function(date) {
//             var rangecategory= '<option value="" selected disabled>select category</option>';
//             $.ajax({
//                 url:"/sales-data",
//                 type:"get",
//                 async:false,
//                 data:{
//                     type: 'category',
//                     transtype: 'DINE-IN',
//                     date: moment(date, 'MM/DD/YYYY').format("YYYY-MM-DD")
//                 },
//                 success:function(data){
//                     if (data.data.length > 0) {
//                         $.each(data.data, (i, data) => {
//                             rangecategory += '<option value="'+data.trantype+'">'+data.trantype+'</option>';
//                         });
//                         $("#rangecategory").find('option').remove().end().append(rangecategory);
//                         $("#rangecategory").prop('disabled', false);
//                         $('#rangecategory').val('');
//                         $('#rangecategory').show();
//                         dbefore = date;
//                     }
//                     else{
//                         Swal.fire(
//                             'NO DATA FOUND!',
//                             '',
//                             'error'
//                         )
//                         $('#date').val(dbefore);
//                     }
//                 },
//                 error: function (data) {
//                     alert(data.responseText);
//                     return false;
//                 }
//             });
//             $('#rangecategory').prop('disabled', false);
//         },
//         selectWeek: true,
//         inline: true,
//         startDate: '01/01/2000',
//         firstDay: 1
//     });
// });

$(document).on('click', '#export_button', function(){
    // html_table_to_excel('xlsx');
    tableToExcel('dailyTable', 'Transaction')
});

$(document).on('change', '#gOption', function(){
    if ($(this).val() == 'Table') {
        $('#dailyTableDiv').show();
        $('#dailyChart').hide();
    }
    else{
        $('#dailyTableDiv').hide();
        $('#dailyChart').show();
    }
    if (!dfrom) {
        $('#export_button').prop('disabled', true);
    return false;
    }
    if (!dto) {
        $('#export_button').prop('disabled', true);
    return false;
    }
    $('#export_button').prop('disabled', false);
    $.ajax({
        url:"/sales-data",
        type:"get",
        async:false,
        data:{
            type: 'category',
            transtype: 'transaction',
            dfrom: dfrom,
            dto: dto,
            option: $('input[name=rOption]:checked').val()
        },
        success:function(data){
            var pieData = google.visualization.arrayToDataTable([]);
            pieData.addColumn('string','Category');
            pieData.addColumn('number', 'Quantity');
            if ($('input[name=rOption]:checked').val() == 'sales') {
                $.each(data.data, (i, data) => {
                    pieData.addRows([
                        [data.trantype, data.totalsales]
                    ]);
                });
            }
            else{
                $.each(data.data, (i, data) => {
                    pieData.addRows([
                        [data.trantype, data.qty]
                    ]);
                });
            }
           
            var options = {
                title: $('input[name=rOption]:checked').val().toUpperCase(),
                height: 300
            };
            
            var chart = new google.visualization.PieChart(document.getElementById('dailyChart'));
            chart.draw(pieData, options);

        },
        error: function (data) {
            alert(data.responseText);
            return false;
        }
    });

    $('table.dailyTable').dataTable().fnDestroy();
    var table = $('table.dailyTable').DataTable({
        processing: true,
        serverSide: true,
        "dom": 'rtp',
        ajax: {
            url:"/sales-data",
            type:"get",
            async:false,
            data:{
                type: 'category',
                transtype: 'transaction',
                dfrom: dfrom,
                dto: dto,
                option: $('input[name=rOption]:checked').val()
            }
        },
        columns: [
            { data: 'trantype' },
            { data: null,
                "render": function(data, type, row){
                    if ($('input[name=rOption]:checked').val() == 'sales') {
                        return `₱ ${parseFloat(row.totalsales).toFixed(2)}`;
                    }
                    return `${row.qty}`;
                }
            }
        ],
        initComplete: function(){
            loading_hide();
        }
    });
});

$('input[type=radio][name=rOption]').on('change', function() {
    $('#gOption').change();
    $('.option').html($('input[name=rOption]:checked').val().toUpperCase());
});


$(document).on('change', '#rangecategory', function(){
    if ($('#gOption').val() == 'Table') {
        $('#dailyTableDiv').show();
        $('#dailyChart').hide();
    }
    else{
        $('#dailyTableDiv').hide();
        $('#dailyChart').show();
    }
    loading_show();
    setTimeout(() => {
        google.charts.setOnLoadCallback(function () {
            $.ajax({
                url:"/sales-data",
                type:"get",
                async:false,
                data:{
                    trantype: 'transaction',
                    category: $('#rangecategory').val(),
                    dfrom: dfrom,
                    dto: dto,
                    option: $('input[name=rOption]:checked').val()
                },
                success:function(data){
                    var pieData = google.visualization.arrayToDataTable([]);
                    pieData.addColumn('string','Date');
                    pieData.addColumn('number', 'Sales');
                    pieData.addColumn({type: 'number', role: 'annotation'});
                    if ($('input[name=rOption]:checked').val() == 'sales') {
                        $.each(data.data, (i, data) => {
                            pieData.addRows([
                                [data.desc1, parseFloat(data.totalsales), data.totalsales]
                            ]);
                        });
                    }
                    else{
                        $.each(data.data, (i, data) => {
                            pieData.addRows([
                                [data.desc1, parseFloat(data.qty), data.qty]
                            ]);
                        });
                    }
                    
                    var options = {
                        title: 'DINE-IN',
                        isStacked:true,
                        height: pieData.getNumberOfRows() * 41 + 30,
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
                        legend: { position: 'bottom' },
                        hAxis: {
                            title: 'Sales',
                        },
                        axes: {
                            x: {
                                0: { side: 'top'}
                            }
                        },
                        bars: 'horizontal'
                    };
                    
                    var chart = new google.visualization.BarChart(document.getElementById('dailyChart'));
                    chart.draw(pieData, options);
                },
                error: function (data) {
                    alert(data.responseText);
                    return false;
                }
            });
        });

        $('table.dailyTable').dataTable().fnDestroy();
        var table = $('table.dailyTable').DataTable({
            processing: true,
            serverSide: true,
            "dom": 'rtp',
            ajax: {
                url:"/sales-data",
                type:"get",
                async:false,
                data:{
                    trantype: 'DINE-IN',
                    category: $('#rangecategory').val(),
                    date: $('#date').val(),
                    option: $('input[name=rOption]:checked').val()
                }
            },
            columns: [
                {
                    data: null,
                    "render": function(data, type, row){
                        return $('#rangecategory').val();
                    }
                },
                { data: 'desc1' },
                { data: null,
                    "render": function(data, type, row){
                        if ($('input[name=rOption]:checked').val() == 'sales') {
                            return `₱ ${parseFloat(row.totalsales).toFixed(2)}`;
                        }
                        return `${row.qty}`;
                    }
                }
            ],
            initComplete: function(){
                loading_hide();
            }
        });
        
    }, 500);

})