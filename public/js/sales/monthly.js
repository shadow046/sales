var month, dbefore, chart, table;
google.charts.load("current", {packages:["corechart", "bar"]});
$(function() {
    $('#date').datepicker( {
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'MM yy',
        onClose: function(dateText, inst) { 
            var rangecategory= '<option value="" selected disabled>select category</option>';
            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
            month = inst.selectedYear+'-'+(inst.selectedMonth+1)+'-'+'01';
            if (chart) {
                chart.clearChart();
                // $('table.monthlyTable').DataTable().destroy();
                $('table.monthlyTable').empty();
            }
            
            $.ajax({
                url:"/sales-data",
                type:"get",
                async:false,
                data:{
                    type: 'category',
                    month: month
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
                    }
                    else{
                        $('#rangecategory').hide();
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
        }
    });
});

$('input[type=radio][name=rOption]').on('change', function() {
    $('#gOption').change();
    $('.option').html($('input[name=rOption]:checked').val().toUpperCase());
});

$(document).on('click', '#export_button', function(){
    $('.buttons-excel').click();
});

$(document).on('change', '#gOption', function(){
    if ($('#rangecategory').is(":hidden")) {
        return false;
    }
    if (!$('#rangecategory').val()) {
        return false;
    }

    loading_show();
    $('#rangecategory').change();
    if ($(this).val() == 'Table') {
        $('#monthlyTableDiv').show();
        $('#dailyChart').hide();
    }
    else{
        $('#monthlyTableDiv').hide();
        $('#dailyChart').show();
    }
});

$(document).on('change', '#rangecategory', function(){
    if ($('#gOption').val() == 'Table') {
        $('#monthlyTableDiv').show();
        $('#dailyChart').hide();
    }
    else{
        $('#monthlyTableDiv').hide();
        $('#dailyChart').show();
    }
    var Data;
    if ($('#gOption').val() == 'Table') {
        $('#monthlyTableDiv').show();
        $('#dailyChart').hide();
    }
    else{
        $('#monthlyTableDiv').hide();
        $('#dailyChart').show();
    }
    google.charts.setOnLoadCallback(function () {
        $.ajax({
            url:"/sales-data",
            type:"get",
            async:false,
            data:{
                type: 'daily',
                range: 'month',
                category: $('#rangecategory').val(),
                date: month,
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
                        [data.desc1, parseFloat(data.qty), data.qty]
                    ]);
                });
                
                var options = {
                    title: 'SALES BY MONTHLY',
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
                        title: $('#rangecategory').val(),
                        viewWindowMode: 'pretty',
                    },
                    legend:'bottom',
                    bars: 'horizontal'
                };
                
                chart = new google.visualization.BarChart(document.getElementById('dailyChart'));
                chart.draw(pieData, google.charts.Bar.convertOptions(options));
            },
            error: function (data) {
                alert(data.responseText);
                return false;
            }
        });
    });

    $('table.monthlyTable').dataTable().fnDestroy();
    table = $('table.monthlyTable').DataTable({
        processing: true,
        serverSide: true,
        paging: false,
        "dom": 'Brtp',
        buttons: [{
            extend: 'excelHtml5', 
            title: 'Monthly - '+month,
            exportOptions: {
                modifier : {
                    order : 'index',
                    page : 'all',
                    search : 'none'
                },
            },
        }],
        ajax: {
            url:"/sales-data",
            type:"get",
            async:false,
            data:{
                type: 'daily',
                range: 'month',
                category: $('#rangecategory').val(),
                date: month,
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
                        return `<span class="float-end">₱ ${formatNumber(row.qty.toFixed(2))}</span>`;
                    }
                    return `${row.qty}`;
                }
            }
        ],
        initComplete: function(){
            loading_hide();
        }
    });
})