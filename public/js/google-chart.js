var selected = 'date', dfrom, dto, mfrom, mto, yearstart = 2020,
dt = new Date(), curmonth = dt.getMonth()+1,curyear = dt.getFullYear();

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function gchart(type, category, yfrom, yto, mfrom, mto, dfrom, dto) {
    category = typeof category !== 'undefined' ? category : '';
    yfrom = typeof yfrom !== 'undefined' ? yfrom : '';
    yto = typeof yto !== 'undefined' ? yto : '';
    mfrom = typeof mfrom !== 'undefined' ? mfrom : '';
    mto = typeof mto !== 'undefined' ? mto : '';
    dfrom = typeof dfrom !== 'undefined' ? dfrom : '';
    dto = typeof dto !== 'undefined' ? dto : '';

    google.charts.setOnLoadCallback(function () {
        $.ajax({
            url:"/sales-data",
            type:"get",
            async:false,
            data:{
                type: type,
                category: category,
                yfrom: yfrom,
                yto: yto,
                mfrom: mfrom,
                mto: mto,
                dfrom: dfrom,
                dto: dto
            },
            success:function(data){
                var pieData = google.visualization.arrayToDataTable([]);
                pieData.addColumn('string','Date');
                pieData.addColumn('number', 'Quantity');
                pieData.addColumn({type: 'number', role: 'annotation'});
                if (type == 'date') {
                    $.each(data.data, (i, data) => {
                        pieData.addRows([
                            [data.date, data.qty, data.qty]
                        ]);
                    });
                }
                else if (type == 'month') {
                    $.each(data.data, (i, data) => {
                        pieData.addRows([
                            [data.month, data.qty, data.qty]
                        ]);
                    });
                }
                
                var options = {
                    title: 'SALES BY '+type.toUpperCase(),
                    height: 350,
                    chartArea:{
                        top: 50,
                        height:'50%'
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
                    hAxis: {
                        title: $('#rangecategory').val(),
                        slantedText:true,
                        slantedTextAngle:45,
                        viewWindowMode: 'pretty',
                    }
                };
                
                var chart = new google.visualization.ColumnChart(document.getElementById('monthChart'));
                chart.draw(pieData, options);
            },
            error: function (data) {
                alert(data.responseText);
                return false;
            }
        });
    });
}

$(document).ready(function(){
    loading_show();
    setTimeout(() => {
        $('#daterange').show();
        gchart('date', '', '', '', '', '', moment().subtract(8, 'days').format("YYYY-MM-DD"),moment().subtract(1, 'days').format("YYYY-MM-DD"));
        var table = $('table.dashboardTable').DataTable({
            processing: true,
            serverSide: false,
            "dom": 'rtp',
            ajax: {
                url:"/sales-data",
                type:"get",
                data:{
                    type: 'ALL',
                    option: $('input[name=rOption]:checked').val()
                }
            },
            columns: [
                { data: 'storecode' },
                { data: 'tdate' },
                { data: null,
                    "render": function(data, type, row){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.totalsales).toFixed(2))}</span>`;
                    }
                }
            ],
            initComplete: function(){
                loading_hide();
            }
        });
    }, 500);
});

$(document).on('change', '#yearfrom', function(){
    var thisvalue = $(this).val();
    var monthfromopt = '<option value="" selected disabled>select month</option>';
    if ($(this).val() == yearstart) {
        for (let index = 11; index <= 12 ; index++) {
            monthfromopt += '<option value="'+index+'">'+months[index-1]+'</option>';
        }
    }
    else if ($(this).val() == curyear) {
        for (let index = 1; index <= curmonth ; index++) {
            monthfromopt += '<option value="'+index+'">'+months[index-1]+'</option>';
        }
    }
    else{
        for (let index = 1; index <= 12 ; index++) {
            monthfromopt += '<option value="'+index+'">'+months[index-1]+'</option>';
        }
    }
    $("#monthfrom").find('option').remove().end().append(monthfromopt);
    $('#yearto').find('option').remove();
    $('#yearfrom').find('option').clone().appendTo('#yearto');
    $('#yearto').val('');
    $('#monthfrom').prop('disabled', false);
    $('#yearto').prop('disabled', true);
    $('#monthto').prop('disabled', true);
    $('#monthto').val('');
    $('#monthfrom').val('');
    $("#rangecategory").prop('disabled', true);
    $('#rangecategory').val('');
    $('#yearto option').each(function() {
        if ($(this).val() != "") {
            if ($(this).val() < thisvalue) {
                $(this).remove();
            }
            console.log(parseInt($(this).val()));
            console.log('-');
            console.log(parseInt(thisvalue)+1);
            if (parseInt($(this).val()) > parseInt(thisvalue)+1) {
                $(this).remove();
            }
        }
    });
});

$(document).on('change', '#monthfrom', function(){
    $('#yearto').prop('disabled', false);
    $('#yearto').val('');
    $('#monthto').prop('disabled', true);
    $('#monthto').val('');
    $("#rangecategory").prop('disabled', true);
    $('#rangecategory').val('');
});

$(document).on('change', '#yearto', function(){
    var monthtoopt = '<option value="" selected disabled>select month</option>';
    if ($(this).val() == $('#yearfrom').val()) {
        for (let index = $('#monthfrom').val(); index <= 12 ; index++) {
            monthtoopt += `<option value="${index}">${months[index-1]}</option>`;
        }
    }
    else{
        for (let index = 1; index <= $('#monthfrom').val() ; index++) {
            monthtoopt += '<option value="'+index+'">'+months[index-1]+'</option>';
        }
    }
    $("#monthto").find('option').remove().end().append(monthtoopt);
    $("#monthto").prop('disabled', false);
    $("#rangecategory").prop('disabled', true);
    $('#rangecategory').val('');
});

$(document).on('change', '#monthto', function(){
    $('#rangecategory').find('option').remove();
    var rangecategory= '<option value="" selected disabled>select category</option><option value="ALL">ALL</option>';
    $.ajax({
        url:"/sales-data",
        type:"get",
        async:false,
        data:{
            type: 'category',
            yfrom: $('#yearfrom').val(),
            yto: $('#yearto').val(),
            mfrom: $('#monthfrom').val(),
            mto: $('#monthto').val()
        },
        success:function(data){
            $.each(data.data, (i, data) => {
                rangecategory += '<option value="'+data.itemcat+'">'+data.itemcat+'</option>';
            });
            $("#rangecategory").find('option').remove().end().append(rangecategory);
            $("#rangecategory").prop('disabled', false);
            $('#rangecategory').val('');
        },
        error: function (data) {
            alert(data.responseText);
            return false;
        }
    });
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
    if (selected == 'month') {
        gchart('month', $('#rangecategory').val(), $('#yearfrom').val(), $('#yearto').val(), $('#monthfrom').val(),$('#monthto').val());
    }
    else if (selected == 'date') {
        gchart('date', $('#rangecategory').val(), '', '', '', '', dfrom,dto);
    }
})

google.charts.load("current", {packages:["corechart"]});
$(function() {
    $('#daterange').daterangepicker({
        maxDate: new Date(),
        dateLimit: { days: 14 },
        opens: 'right'
    }, function(start, end, label) {
        dfrom = start.format('YYYY-MM-DD');
        dto = end.format('YYYY-MM-DD');
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
                $('#rangecategory').find('option').remove();
                var rangecategory= '<option value="" selected disabled>select category</option><option value="ALL">ALL</option>';
                $.each(data.data, (i, data) => {
                    rangecategory += '<option value="'+data.itemcat+'">'+data.itemcat+'</option>';
                });
                $("#rangecategory").find('option').remove().end().append(rangecategory);
                $("#rangecategory").prop('disabled', false);
                $('#rangecategory').val('');
            },
            error: function (data) {
                alert(data.responseText);
                return false;
            }
        });
        $('#rangecategory').show();
        $("#rangecategory").prop('disabled', false);
        $('#rangecategory').val('');
    });
});

// $('input[type=radio][name=rOption]').on('change', function() {
//     $('#chartStyle').change();
// });

$('input[type=radio][name=radioOption]').on('change', function() {
    $('#yearto').val('');
    $('#yearfrom').val('');
    $('#monthfrom').prop('disabled', true);
    $('#yearto').prop('disabled', true);
    $('#monthto').prop('disabled', true);
    $('#rangecategory').prop('disabled', true);
    $('#monthto').val('');
    $('#monthfrom').val('');
    $('#rangecategory').val('');
    selected = $(this).val();
    switch ($(this).val()) {
      case 'date':
        $('.monthrange').hide();
        $('#daterange').show();
        gchart('date', '', '', '', '', '',moment().subtract(8, 'days').format("YYYY-MM-DD"),moment().subtract(1, 'days').format("YYYY-MM-DD"));
        gchart('date', '', '', '', '', '','2022-10-01','2022-10-04');
        break;
      case 'month':
        $('.monthrange').show();
        $('#daterange').hide();
        gchart('month', '', '2022', '2022','09','10');
        break;
    }
});


google.charts.setOnLoadCallback(function () {
    $.ajax({
        url:"/sales-data",
        type:"get",
        async:false,
        data:{
            type: 'category'
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
                title: 'SHARES BY CATEGORY',
                height: 300
            };
            
            var chart = new google.visualization.PieChart(document.getElementById('categoryChart'));
            chart.draw(pieData, options);
        },
        error: function (data) {
            alert(data.responseText);
            return false;
        }
    });
});

$(document).on('change', '#chartStyle', function(){
    google.charts.setOnLoadCallback(function () {
        $.ajax({
            url:"/sales-data",
            type:"get",
            async:false,
            data:{
                type: 'category',
                // option: $('input[name=rOption]:checked').val();
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


google.charts.setOnLoadCallback(function () {
    $.ajax({
        url:"/sales-data",
        type:"get",
        async:false,
        data:{
            type: 'savory'
        },
        success:function(data){
            var pieData = google.visualization.arrayToDataTable([]);
            pieData.addColumn('string','Description');
            pieData.addColumn('number', 'Quantity');
            pieData.addColumn({type: 'number', role: 'annotation'});
            $.each(data.data, (i, data) => {
                pieData.addRows([
                    [data.desc1, data.qty, data.qty]
                ]);
            });
            var options = {
                title: 'SAVORY CATEGORY SALES',
                isStacked:true,
                height: pieData.getNumberOfRows() * 41 + 30,
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
                legend:'bottom',
            };
            
            var chart = new google.visualization.BarChart(document.getElementById('savorychart'));
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
        url:"/sales-data",
        type:"get",
        async:false,
        data:{
            type: 'tendertype'
        },
        success:function(data){
            var pieData = google.visualization.arrayToDataTable([]);
            pieData.addColumn('string','Date');
            pieData.addColumn('number', 'Quantity');
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
