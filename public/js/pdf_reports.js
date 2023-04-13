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

var ebook_table,sales_mix_table,end_of_day_table,terminal_table;
$(document).ready(function(){
    ebook_table = $('table.ebookTable').DataTable({
        autoWidth: false,
    });
    sales_mix_table = $('table.salesMixTable').DataTable({
        autoWidth: false,
    });
    end_of_day_table = $('table.endOfDayTable').DataTable({
        autoWidth: false,
    });
    terminal_table = $('table.terminalTable').DataTable({
        autoWidth: false,
    });
});

