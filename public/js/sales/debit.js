var dfrom, dto, dbefore;
google.charts.load("current", {packages:["corechart", "bar"]});
$(document).ready(function() {
    dbefore = $('#date').val();
    $('#date').datepicker( {
        onSelect: function(date) {
            var rangecategory= '<option value="" selected disabled>select category</option>';
            $('#loading').show();
            setTimeout(() => {
                $.ajax({
                    url:"/sales-data",
                    type:"get",
                    async:false,
                    data:{
                        type: 'tender',
                        tender: 'DEBIT',
                        date: moment(date, 'MM/DD/YYYY').format("YYYY-MM-DD")
                    },
                    success:function(data){
                        if (data.data.length > 0) {
                            $.each(data.data, (i, data) => {
                                rangecategory += '<option value="'+data.itemcat+'">'+data.itemcat+'</option>';
                            });
                            // $.each(data.data[0], function(k, v){
                            // // $.each(data.data, (i, data) => {
                            //     rangecategory += '<option value="'+v+'">'+v+'</option>';
                            // });
                            $("#rangecategory").find('option').remove().end().append(rangecategory);
                            $("#rangecategory").prop('disabled', false);
                            $('#rangecategory').val('');
                            $('#rangecategory').show();
                            dbefore = date;
                        }
                        else{
                            Swal.fire(
                                'NO DATA FOUND!',
                                '',
                                'error'
                            )
                            $('#date').val(dbefore);
                        }
                        $('#loading').hide();
                    },
                    error: function (data) {
                        alert(data.responseText);
                        $('#loading').hide();
                        return false;
                    }
                });
                $('#rangecategory').prop('disabled', false);
            }, 200);
        },
        selectWeek: true,
        inline: true,
        startDate: '01/01/2000',
        firstDay: 1
    });
});

$(document).on('click', '#export_button', function(){
    // html_table_to_excel('xlsx');
    tableToExcel('dailyTable', 'Debit')
});

$(document).on('change', '#gOption', function(){
    if ($('#rangecategory').is(":hidden")) {
        return false;
    }
    if (!$('#rangecategory').val()) {
        return false;
    }
    $('#loading').show();
    $('#rangecategory').change();
    if ($(this).val() == 'Table') {
        $('#dailyTableDiv').show();
        $('#dailyChart').hide();
    }
    else{
        $('#dailyTableDiv').hide();
        $('#dailyChart').show();
    }
});

$('input[type=radio][name=rOption]').on('change', function() {
    if ($('#rangecategory').is(":hidden")) {
        return false;
    }
    if (!$('#rangecategory').val()) {
        return false;
    }
    $('#loading').show();
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
    $('#loading').show();
    setTimeout(() => {
        google.charts.setOnLoadCallback(function () {
            $.ajax({
                url:"/sales-data",
                type:"get",
                async:false,
                data:{
                    type: 'tender',
                    tender: 'DEBIT',
                    category: $('#rangecategory').val(),
                    date: $('#date').val(),
                    option: $('input[name=rOption]:checked').val()

                },
                success:function(data){
                    var pieData = google.visualization.arrayToDataTable([]);
                    pieData.addColumn('string','Date');
                    pieData.addColumn('number', $('input[name=rOption]:checked').val().toUpperCase());
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
                        title: $('#rangecategory').val(),
                        isStacked:true,
                        height: pieData.getNumberOfRows() * 41 + 30,
                        chartArea:{
                            top: 50
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
                        hAxis: {
                            title: 'SALES',
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
                    type: 'tender',
                    tender:'DEBIT',
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
                $('#loading').hide();
            }
        });
    }, 500);
})