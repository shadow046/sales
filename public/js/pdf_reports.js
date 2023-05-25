$('#date_submit').on('click',function(){
    var html ='<table class="table table-striped ebookTable w-100" tbl="ebookTable" id="ebookTable">' +
            '<thead style="font-weight:bolder" class="bg-default">' +
            '<tr>' +
            '<td>' +
            '<input type="search" class="form-control filter-input1" data-column="0" style="border:1px solid #808080"/>' +
            '</td>' +
            '<td>' +
            '<input type="search" class="form-control filter-input1" data-column="1" style="border:1px solid #808080"/>' +
            '</td>' +
            '<td>' +
            '<input type="search" class="form-control filter-input1" data-column="2" style="border:1px solid #808080"/>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<th>DATE</th>' +
            '<th>BRANCH</th>' +
            '<th>FILENAME</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody title="CLICK TO VIEW"></tbody>' +
            '</table>';

    $('#page_ebook').empty().append(html);
    displayUploads('ebookTable', 'EBOOK');

    var html = '<table class="table table-striped salesMixTable w-100" tbl="salesMixTable" id="salesMixTable">' +
            '<thead style="font-weight:bolder" class="bg-default">' +
            '<tr>' +
            '<td>' +
            '<input type="search" class="form-control filter-input2" data-column="0" style="border:1px solid #808080"/>' +
            '</td>' +
            '<td>' +
            '<input type="search" class="form-control filter-input2" data-column="1" style="border:1px solid #808080"/>' +
            '</td>' +
            '<td>' +
            '<input type="search" class="form-control filter-input2" data-column="2" style="border:1px solid #808080"/>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<th>DATE</th>' +
            '<th>BRANCH</th>' +
            '<th>FILENAME</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody title="CLICK TO VIEW"></tbody>' +
            '</table>';

    $('#page_sales_mix').empty().append(html);
    displayUploads('salesMixTable', 'SALESMIX');

    var html = '<table class="table table-striped endOfDayTable w-100" tbl="endOfDayTable" id="endOfDayTable">' +
                '<thead style="font-weight:bolder" class="bg-default">' +
                '<tr>' +
                '<td>' +
                '<input type="search" class="form-control filter-input3" data-column="0" style="border:1px solid #808080"/>' +
                '</td>' +
                '<td>' +
                '<input type="search" class="form-control filter-input3" data-column="1" style="border:1px solid #808080"/>' +
                '</td>' +
                '<td>' +
                '<input type="search" class="form-control filter-input3" data-column="2" style="border:1px solid #808080"/>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<th>DATE</th>' +
                '<th>BRANCH</th>' +
                '<th>FILENAME</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody title="CLICK TO VIEW"></tbody>' +
                '</table>';

    $('#page_end_of_day').empty().append(html);
    displayUploads('endOfDayTable', 'EOD');

    var html ='<table class="table table-striped terminalTable w-100" tbl="terminalTable" id="terminalTable">' +
            '<thead style="font-weight:bolder" class="bg-default">' +
            '<tr>' +
            '<td>' +
            '<input type="search" class="form-control filter-input4" data-column="0" style="border:1px solid #808080"/>' +
            '</td>' +
            '<td>' +
            '<input type="search" class="form-control filter-input4" data-column="1" style="border:1px solid #808080"/>' +
            '</td>' +
            '<td>' +
            '<input type="search" class="form-control filter-input4" data-column="2" style="border:1px solid #808080"/>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<th>DATE</th>' +
            '<th>BRANCH</th>' +
            '<th>FILENAME</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody title="CLICK TO VIEW"></tbody>' +
            '</table>';

    $('#page_terminal').empty().append(html);
    displayUploads('terminalTable', 'TERMINAL');

});

$('#btnReset').on('click',function(){
    $('#month_range').val('');
    $('.tab-pane').empty();
});

$('#tab_ebook').on('click',function(){
    $(this).blur();
    $('#tab_ebook').removeClass('bg-sub-light');
    $('#tab_ebook').addClass('bg-sub active');
    $('#tab_sales_mix').addClass('bg-sub-light');
    $('#tab_sales_mix').removeClass('bg-sub active');
    $('#tab_end_of_day').removeClass('bg-sub active');
    $('#tab_end_of_day').addClass('bg-sub-light');
    $('#tab_terminal').addClass('bg-sub-light');
    $('#tab_terminal').removeClass('bg-sub active');

    $('#tab_ebook').attr('aria-selected', true);
    $('#tab_sales_mix').attr('aria-selected', false);
    $('#tab_end_of_day').attr('aria-selected', false);
    $('#tab_terminal').attr('aria-selected', false);

    $('#page_ebook').addClass('active');
    $('#page_ebook').addClass('show');
    $('#page_sales_mix').removeClass('active');
    $('#page_sales_mix').removeClass('show');
    $('#page_end_of_day').removeClass('active');
    $('#page_end_of_day').removeClass('show');
    $('#page_terminal').removeClass('active');
    $('#page_terminal').removeClass('show');

    $('#page_ebook').show();
    $('#page_sales_mix').hide();
    $('#page_end_of_day').hide();
    $('#page_terminal').hide();
});

$('#tab_sales_mix').on('click',function(){
    $(this).blur();
    $('#tab_ebook').addClass('bg-sub-light');
    $('#tab_ebook').removeClass('bg-sub active');
    $('#tab_sales_mix').addClass('bg-sub active');
    $('#tab_sales_mix').removeClass('bg-sub-light');
    $('#tab_end_of_day').removeClass('bg-sub active');
    $('#tab_end_of_day').addClass('bg-sub-light');
    $('#tab_terminal').addClass('bg-sub-light');
    $('#tab_terminal').removeClass('bg-sub active');

    $('#tab_ebook').attr('aria-selected', false);
    $('#tab_sales_mix').attr('aria-selected', true);
    $('#tab_end_of_day').attr('aria-selected', false);
    $('#tab_terminal').attr('aria-selected', false);

    $('#page_ebook').removeClass('active');
    $('#page_ebook').removeClass('show');
    $('#page_sales_mix').addClass('active');
    $('#page_sales_mix').addClass('show');
    $('#page_end_of_day').removeClass('active');
    $('#page_end_of_day').removeClass('show');
    $('#page_terminal').removeClass('active');
    $('#page_terminal').removeClass('show');

    $('#page_ebook').hide();
    $('#page_sales_mix').show();
    $('#page_end_of_day').hide();
    $('#page_terminal').hide();
});

$('#tab_end_of_day').on('click',function(){
    $(this).blur();
    $('#tab_ebook').addClass('bg-sub-light');
    $('#tab_ebook').removeClass('bg-sub active');
    $('#tab_sales_mix').addClass('bg-sub-light');
    $('#tab_sales_mix').removeClass('bg-sub active');
    $('#tab_end_of_day').addClass('bg-sub active');
    $('#tab_end_of_day').removeClass('bg-sub-light');
    $('#tab_terminal').addClass('bg-sub-light');
    $('#tab_terminal').removeClass('bg-sub active');

    $('#tab_ebook').attr('aria-selected', false);
    $('#tab_sales_mix').attr('aria-selected', false);
    $('#tab_end_of_day').attr('aria-selected', true);
    $('#tab_terminal').attr('aria-selected', false);

    $('#page_ebook').removeClass('active');
    $('#page_ebook').removeClass('show');
    $('#page_sales_mix').removeClass('active');
    $('#page_sales_mix').removeClass('show');
    $('#page_end_of_day').addClass('active');
    $('#page_end_of_day').addClass('show');
    $('#page_terminal').removeClass('active');
    $('#page_terminal').removeClass('show');

    $('#page_ebook').hide();
    $('#page_sales_mix').hide();
    $('#page_end_of_day').show();
    $('#page_terminal').hide();
});

$('#tab_terminal').on('click',function(){
    $(this).blur();
    $('#tab_ebook').addClass('bg-sub-light');
    $('#tab_ebook').removeClass('bg-sub active');
    $('#tab_sales_mix').addClass('bg-sub-light');
    $('#tab_sales_mix').removeClass('bg-sub active');
    $('#tab_end_of_day').addClass('bg-sub-light');
    $('#tab_end_of_day').removeClass('bg-sub active');
    $('#tab_terminal').addClass('bg-sub active');
    $('#tab_terminal').removeClass('bg-sub-light');

    $('#tab_ebook').attr('aria-selected', false);
    $('#tab_sales_mix').attr('aria-selected', false);
    $('#tab_end_of_day').attr('aria-selected', false);
    $('#tab_terminal').attr('aria-selected', true);

    $('#page_ebook').removeClass('active');
    $('#page_ebook').removeClass('show');
    $('#page_sales_mix').removeClass('active');
    $('#page_sales_mix').removeClass('show');
    $('#page_end_of_day').removeClass('active');
    $('#page_end_of_day').removeClass('show');
    $('#page_terminal').addClass('active');
    $('#page_terminal').addClass('show');

    $('#page_ebook').hide();
    $('#page_sales_mix').hide();
    $('#page_end_of_day').hide();
    $('#page_terminal').show();
});

var table;
function displayUploads(upload_table, upload_name){
    table = $('table.'+upload_table).DataTable({
        dom: 'lftrip',
        autoWidth:false,
        processing: true,
        serverSide: false,
        ajax: {
            url: '/pdf_data',
            data:{
                pdf: upload_name,
                month_range: $('#month_range').val()
            }
        },
        language:{
            emptyTable: "NO DATA AVAILABLE",
        },
        columns: [
            {
                data: 'dt',
                "render":function(data,type,row){
                    return `<span class="d-none">${row.dt}</span><span">${row.date}</span>`;
                }
            },
            { data: 'branch', name:'branch'},
            { data: 'filename', name:'filename'}
        ]
    });
}

$(document).on('keyup search','.filter-input1', function(){
    var tbl1 = $('#ebookTable').DataTable();
    tbl1.column($(this).data('column')).search($(this).val()).draw();
});
$(document).on('keyup search','.filter-input2', function(){
    var tbl2 = $('#salesMixTable').DataTable();
    tbl2.column($(this).data('column')).search($(this).val()).draw();
});
$(document).on('keyup search','.filter-input3', function(){
    var tbl3 = $('#endOfDayTable').DataTable();
    tbl3.column($(this).data('column')).search($(this).val()).draw();
});
$(document).on('keyup search','.filter-input4', function(){
    var tbl4 = $('#terminalTable').DataTable();
    tbl4.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('click','table tbody tr',function(){
    var upl = $(this).parent().parent().attr('tbl');
    var tbl = $('table.'+upl).DataTable();
    if(!tbl.data().any()){ return false; }
    var data = tbl.row(this).data();
    window.open('/storage/uploads/' + data.filename, '_blank');
});


$(document).ready(function() {
    setInterval(function() {
        if($('table.table-striped').length == 0) {
            $('#pdf_tab').hide();
            $('#pdf_alert').show();
        }
        else{
            $('#pdf_tab').show();
            $('#pdf_alert').hide();
        }
    }, 0);
});

$('#month_range').on('focusout',function(){
    if(!$(this).val()){
        $(this).addClass('requiredInput')
    }
    else{
        $(this).removeClass('requiredInput')
    }
});

setInterval(() => {
    if(!$('#month_range').val()){
        $('#date_submit').prop('disabled', true);
    }
    else{
        $('#date_submit').prop('disabled', false);
    }
}, 0);