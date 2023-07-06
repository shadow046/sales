var dfrom, dto, dbefore;
google.charts.load("current", {packages:["corechart", "bar"]});
$(document).ready(function() {
    dbefore = $('#date').val();
    $('#date').datepicker( {
        onSelect: function(date) {
            var rangecategory= '<option value="" selected disabled>select category</option><option value="ALL">ALL</option>';
            $.ajax({
                url:"/sales-data",
                type:"get",
                async:false,
                data:{
                    type: 'category',
                    date: moment(date, 'MM/DD/YYYY').format("YYYY-MM-DD")
                },
                success:function(data){
                    if (data.data.length > 0) {
                        $.each(data.data, (i, data) => {
                            rangecategory += '<option value="'+data.itemcat+'">'+data.itemcat+'</option>';
                        });
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
                },
                error: function (data) {
                    alert(data.responseText);
                    return false;
                }
            });
            $('#rangecategory').prop('disabled', false);
        },
        selectWeek: true,
        inline: true,
        startDate: '01/01/2000',
        firstDay: 1
    });
});

$('input[type=radio][name=rOption]').on('change', function() {
    loading_show();
    $('#gOption').change();
    $('.option').html($('input[name=rOption]:checked').val().toUpperCase());
});

$(document).on('click', '#export_button', function(){
    // html_table_to_excel('xlsx');
    tableToExcel('dailyTable', 'Daily')
});

$(document).on('change', '#gOption', function(){
    if ($('#rangecategory').is(":hidden")) {
        return false;
    }
    if (!$('#rangecategory').val()) {
        return false;
    }
    $('#export_button').prop('disabled', false);
    loading_show();
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

$(document).on('change', '#rangecategory', function(){
    if ($('#gOption').val() == 'Table') {
        $('#dailyTableDiv').show();
        $('#dailyChart').hide();
    }
    else{
        $('#dailyTableDiv').hide();
        $('#dailyChart').show();
    }
    if ($(this).val() == "ALL") {
        $('#colhead').html('CATEGORY');
        var gtitle = "CATEGORY";
    }
    else{
        var gtitle = $('#rangecategory').val();
        $('#colhead').html('ITEM CODE');
    }
    loading_show();
    setTimeout(() => {
        var Data;
        google.charts.setOnLoadCallback(function () {
            $.ajax({
                url:"/sales-data",
                type:"get",
                async:false,
                data:{
                    type: 'daily',
                    category: $('#rangecategory').val(),
                    date: $('#date').val(),
                    option: $('input[name=rOption]:checked').val()
                },
                success:function(data){
                    Data = data;
                    var pieData = google.visualization.arrayToDataTable([]);
                    pieData.addColumn('string','Date');
                    pieData.addColumn('number', $('input[name=rOption]:checked').val().toUpperCase());
                    pieData.addColumn({type: 'number', role: 'annotation'});
                    $.each(data.data, (i, data) => {
                        pieData.addRows([
                            [data.desc1, parseFloat(data.totalsales), data.totalsales]
                        ]);
                    });
                    
                    var options = {
                        title: 'SALES BY DAILY',
                        isStacked:true,
                        height: pieData.getNumberOfRows() * 41 + 30,
                        chartArea:{
                            top: 50,
                            left: 250
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
                        vAxis: {
                            title: gtitle,
                            viewWindowMode: 'pretty',
                        },
                        axes: {
                            x: {
                                0: { side: 'top'}
                            }
                        },
                        bars: 'horizontal',
                        legend:'bottom'
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
                    type: 'daily',
                    category: $('#rangecategory').val(),
                    date: $('#date').val(),
                    option: $('input[name=rOption]:checked').val()
                }
            },
            columns: [
                { data: 'desc1' },
                { data: null,
                    "render": function(data, type, row){
                        if ($('input[name=rOption]:checked').val() == 'sales') {
                            return `₱ ${row.totalsales.toFixed(2)}`;
                        }
                        return `${row.totalsales}`;
                    }
                }
            ],
            initComplete: function(){
                loading_hide();
            }
        });
    }, 500);

})