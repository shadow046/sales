$(document).ready(function(){
    $('#company').chosen();
    $('#company_chosen').css('width','100%');

    $('#type').chosen();
    $('#type_chosen').css('width','100%');

    $('#setup').chosen();
    $('#setup_chosen').css('width','100%');

    $('#area').chosen();
    $('#area_chosen').css('width','100%');

    $('#store').chosen();
    $('#store_chosen').css('width','100%');

    $('#category').chosen();
    $('#category_chosen').css('width','100%');

    $('#sales_type').chosen();
    $('#sales_type_chosen').css('width','100%');
});

$('.addBtn').on('click',function(){
    area_all = [];
    stores_list = [];
    promo_id = [];
    suspend_id = [];
    $('#tab_regular').click();
    $('#set_meal_div').hide();
    $('#set_meal_table_orig_div').hide();

    if(!current_permissions.includes('3')){
        $('#productsModal').find('input').prop('disabled', false);
        $('#productsModal').find('select').prop('disabled', false);
        $('#productsModal').find('textarea').prop('disabled', false);
        $('#daily').change();
        setTimeout(() => {
            $('.notUpdate').show();
        }, current_timeout);
    }

    $('#setup_chosen').addClass('requiredField requiredInput redBorder');
    $('#area_chosen').addClass('requiredField requiredInput redBorder');
    $('#company_chosen').addClass('requiredField requiredInput redBorder');
    $('#type_chosen').addClass('requiredField requiredInput redBorder');
    $('#category_chosen').addClass('requiredField requiredInput redBorder');

    $('#setup').val('').trigger('chosen:updated');
    $('#area').val('').trigger('chosen:updated');
    $('#company').val('').trigger('chosen:updated');
    $('#type').val('').trigger('chosen:updated');
    $('#category').val('').trigger('chosen:updated');
    $('#sales_type').val('').trigger('chosen:updated');

    $('#company').change();
    $('#type').change();
    $('#setup').change();
    $('#area').change();
    $('#store').change();
    $('#category').change();
    $('#sales_type').change();
});
var table;
$(document).ready(function(){
    if(current_system == 'DD'){
        table = $('table.productsTable').DataTable({
            scrollY:        "500px",
            scrollX:        true,
            scrollCollapse: true,
            fixedColumns:{
                left: 3,
            },
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: 'Export - Products',
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            language: {
                info: "Showing _START_ to _END_ of _TOTAL_ Products",
                lengthMenu: "Show _MENU_ Products",
                emptyTable: "NO DATA AVAILABLE",
            },
            processing: true,
            serverSide: false,
            ajax: {
                "url": 'products_data'
            },
            columnDefs: [
                {
                    "targets": [3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,21],
                    "visible": false,
                    "searchable": true
                },
            ],
            order: [],
            columns: [
                { data: 'category_name', name: 'category_name'},
                { data: 'item_code', name: 'item_code'},
                { data: 'short_desc', name: 'short_desc'},
                { data: 'long_desc', name: 'long_desc'},
                {
                    data: 'intro_date', name: 'intro_date',
                    "render":function(data,type,row){
                        if(row.intro_date == '' || row.intro_date == null){
                            return '';
                        }
                        return "<span class='d-none'>"+row.intro_date+"</span>"+moment(row.intro_date).format('MMM. DD, YYYY');
                    }
                },
                { data: 'setup_name', name: 'setup_name'},
                {
                    data: 'area_name',
                    "render": function(data, type, row, meta){
                        if(row.area_name.split("|").length == 1){
                            var start = '';
                        }
                        else{
                            var start = '• ';
                        }
                        return `<div style="white-space:normal;">${start} ${row.area_name.split("|").join("<br/> • ")}</div>`;
                    }
                },
                {
                    data: 'store_name',
                    "render": function(data, type, row, meta){
                        if(row.store_name == 'N/A'){
                            return 'N/A';
                        }
                        else if(row.store_name == 'ALL BRANCHES'){
                            return 'ALL BRANCHES';
                        }
                        else{
                            if(row.store_name.split("|").length == 1){
                                var start = '';
                            }
                            else{
                                var start = '• ';
                            }
                            return `<div style="white-space:normal;">${start} ${row.store_name.split("|").join("<br/> • ")}</div>`;
                        }
                    }
                },
                {
                    data: 'dine_in', name: 'dine_in',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">REGULAR: ₱ ${formatNumber(parseFloat(row.dine_in).toFixed(2))} | AIRPORT: ₱ ${formatNumber(parseFloat(row.dine_in_airport).toFixed(2))} </span>`;
                    }
                },
                {
                    data: 'take_out', name: 'take_out',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">REGULAR: ₱ ${formatNumber(parseFloat(row.take_out).toFixed(2))} | AIRPORT: ₱ ${formatNumber(parseFloat(row.take_out_airport).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'pick_up', name: 'pick_up',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">REGULAR: ₱ ${formatNumber(parseFloat(row.pick_up).toFixed(2))} | AIRPORT: ₱ ${formatNumber(parseFloat(row.pick_up_airport).toFixed(2))}</span>`;

                    }
                },
                {
                    data: 'delivery', name: 'delivery',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">REGULAR: ₱ ${formatNumber(parseFloat(row.delivery).toFixed(2))} | AIRPORT: ₱ ${formatNumber(parseFloat(row.delivery_airport).toFixed(2))}</span>`;

                    }
                },
                {
                    data: 'bulk_order', name: 'bulk_order',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">REGULAR: ₱ ${formatNumber(parseFloat(row.bulk_order).toFixed(2))} | AIRPORT: ₱ ${formatNumber(parseFloat(row.bulk_order_airport).toFixed(2))}</span>`;

                    }
                },
                {
                    data: 'fds', name: 'fds',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">REGULAR: ₱ ${formatNumber(parseFloat(row.fds).toFixed(2))} | AIRPORT: ₱ ${formatNumber(parseFloat(row.fds_airport).toFixed(2))}</span>`;

                    }
                },
                {
                    data: 'drive_thru', name: 'drive_thru',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">REGULAR: ₱ ${formatNumber(parseFloat(row.drive_thru).toFixed(2))} | AIRPORT: ₱ ${formatNumber(parseFloat(row.drive_thru_airport).toFixed(2))}</span>`;

                    }
                },
                {
                    data: 'meal_type', name: 'meal_type',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">REGULAR: ₱ ${formatNumber(parseFloat(row.meal_type).toFixed(2))} | AIRPORT: ₱ ${formatNumber(parseFloat(row.meal_type_airport).toFixed(2))}</span>`;

                    }
                },
                { data: 'sku', name: 'sku'},
                { data: 'modifier_code', name: 'modifier_code'},
                { data: 'company_name', name: 'company_name'},
                { data: 'type_name', name: 'type_name'},
                {
                    data: 'status',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return data;
                        }
                        if(row.product_update_status == '0'){
                            var update_status = 'visible';
                        }
                        else{
                            var update_status = 'invisible';
                        }
                        if(current_permissions.includes('5')){
                            if(row.status == 'ACTIVE'){
                                return `<div style="width: 120px !important;"><center><label class="switch" style="zoom: 80%; margin-top: -5px; margin-bottom: -10px;"><input type="checkbox" class="togBtn" id="${meta.row}" checked><div class="slider round"><span style="font-size: 110%;" class="on">ACTIVE</span><span style="font-size: 100%;" class="off">INACTIVE</span></div></label><i class="ml-2 text-success fa-solid fa-circle-arrow-up fa-lg ${update_status}" title="For Update in POS"></i></center></div>`;
                            }
                            if(row.status == 'INACTIVE'){
                                return `<div style="width: 120px !important;"><center><label class="switch" style="zoom: 80%; margin-top: -5px; margin-bottom: -10px;"><input type="checkbox" class="togBtn" id="${meta.row}"><div class="slider round"><span style="font-size: 110%;" class="on">ACTIVE</span><span style="font-size: 100%;" class="off">INACTIVE</span></div></label><i class="ml-2 text-success fa-solid fa-circle-arrow-up fa-lg ${update_status}" title="For Update in POS"></i></center></div>`;
                            }
                        }
                        else{
                            if(row.status == 'ACTIVE'){
                                return `<div style="width: 120px !important;"><center class="text-success"><b>${row.status}</b><i class="ml-2 text-success fa-solid fa-circle-arrow-up fa-lg ${update_status}" title="For Update in POS"></i></center></div>`;
                            }
                            if(row.status == 'INACTIVE'){
                                return `<div style="width: 120px !important;"><center class="text-danger"><b>${row.status}</b><i class="ml-2 text-success fa-solid fa-circle-arrow-up fa-lg ${update_status}" title="For Update in POS"></i></center></div>`;
                            }
                        }
                    }
                },
                { data: 'status', name: 'status'}
            ],
            initComplete: function(){
                $(document).prop('title', $('#page-name').text());
                $('#loading').hide();
            }
        });
    }
    else{
        table = $('table.productsTable').DataTable({
            scrollY:        "500px",
            scrollX:        true,
            scrollCollapse: true,
            fixedColumns:{
                left: 3,
            },
            dom: 'Blftrip',
            buttons: [{
                extend: 'excelHtml5',
                title: 'Export - Products',
                exportOptions: {
                    modifier : {
                        order : 'index',
                        page : 'all',
                        search : 'none'
                    },
                },
            }],
            aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
            language: {
                info: "Showing _START_ to _END_ of _TOTAL_ Products",
                lengthMenu: "Show _MENU_ Products",
                emptyTable: "NO DATA AVAILABLE",
            },
            processing: true,
            serverSide: false,
            ajax: {
                "url": 'products_data'
            },
            columnDefs: [
                {
                    "targets": [3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,21],
                    "visible": false,
                    "searchable": true
                },
            ],
            order: [],
            columns: [
                { data: 'category_name', name: 'category_name'},
                { data: 'item_code', name: 'item_code'},
                { data: 'short_desc', name: 'short_desc'},
                { data: 'long_desc', name: 'long_desc'},
                {
                    data: 'intro_date', name: 'intro_date',
                    "render":function(data,type,row){
                        if(row.intro_date == '' || row.intro_date == null){
                            return '';
                        }
                        return "<span class='d-none'>"+row.intro_date+"</span>"+moment(row.intro_date).format('MMM. DD, YYYY');
                    }
                },
                { data: 'setup_name', name: 'setup_name'},
                {
                    data: 'area_name',
                    "render": function(data, type, row, meta){
                        if(row.area_name.split("|").length == 1){
                            var start = '';
                        }
                        else{
                            var start = '• ';
                        }
                        return `<div style="white-space:normal;">${start} ${row.area_name.split("|").join("<br/> • ")}</div>`;
                    }
                },
                {
                    data: 'store_name',
                    "render": function(data, type, row, meta){
                        if(row.store_name == 'N/A'){
                            return 'N/A';
                        }
                        else if(row.store_name == 'ALL BRANCHES'){
                            return 'ALL BRANCHES';
                        }
                        else{
                            if(row.store_name.split("|").length == 1){
                                var start = '';
                            }
                            else{
                                var start = '• ';
                            }
                            return `<div style="white-space:normal;">${start} ${row.store_name.split("|").join("<br/> • ")}</div>`;
                        }
                    }
                },
                {
                    data: 'dine_in', name: 'dine_in',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.dine_in).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'take_out', name: 'take_out',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.take_out).toFixed(2))}</span>`;
                    }
                },
                {
                    data: 'pick_up', name: 'pick_up',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.pick_up).toFixed(2))}</span>`;

                    }
                },
                {
                    data: 'delivery', name: 'delivery',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.delivery).toFixed(2))}</span>`;

                    }
                },
                {
                    data: 'bulk_order', name: 'bulk_order',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.bulk_order).toFixed(2))}</span>`;

                    }
                },
                {
                    data: 'fds', name: 'fds',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.fds).toFixed(2))}</span>`;

                    }
                },
                {
                    data: 'drive_thru', name: 'drive_thru',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.drive_thru).toFixed(2))}</span>`;

                    }
                },
                {
                    data: 'meal_type', name: 'meal_type',
                    "render": function(data, type, row, meta){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.meal_type).toFixed(2))}</span>`;

                    }
                },
                { data: 'sku', name: 'sku'},
                { data: 'modifier_code', name: 'modifier_code'},
                { data: 'company_name', name: 'company_name'},
                { data: 'type_name', name: 'type_name'},
                {
                    data: 'status',
                    "render": function(data, type, row, meta){
                        if(type === "sort" || type === 'type'){
                            return data;
                        }
                        if(row.product_update_status == '0'){
                            var update_status = 'visible';
                        }
                        else{
                            var update_status = 'invisible';
                        }
                        if(current_permissions.includes('5')){
                            if(row.status == 'ACTIVE'){
                                return `<div style="width: 120px !important;"><center><label class="switch" style="zoom: 80%; margin-top: -5px; margin-bottom: -10px;"><input type="checkbox" class="togBtn" id="${meta.row}" checked><div class="slider round"><span style="font-size: 110%;" class="on">ACTIVE</span><span style="font-size: 100%;" class="off">INACTIVE</span></div></label><i class="ml-2 text-success fa-solid fa-circle-arrow-up fa-lg ${update_status}" title="For Update in POS"></i></center></div>`;
                            }
                            if(row.status == 'INACTIVE'){
                                return `<div style="width: 120px !important;"><center><label class="switch" style="zoom: 80%; margin-top: -5px; margin-bottom: -10px;"><input type="checkbox" class="togBtn" id="${meta.row}"><div class="slider round"><span style="font-size: 110%;" class="on">ACTIVE</span><span style="font-size: 100%;" class="off">INACTIVE</span></div></label><i class="ml-2 text-success fa-solid fa-circle-arrow-up fa-lg ${update_status}" title="For Update in POS"></i></center></div>`;
                            }
                        }
                        else{
                            if(row.status == 'ACTIVE'){
                                return `<div style="width: 120px !important;"><center class="text-success"><b>${row.status}</b><i class="ml-2 text-success fa-solid fa-circle-arrow-up fa-lg ${update_status}" title="For Update in POS"></i></center></div>`;
                            }
                            if(row.status == 'INACTIVE'){
                                return `<div style="width: 120px !important;"><center class="text-danger"><b>${row.status}</b><i class="ml-2 text-success fa-solid fa-circle-arrow-up fa-lg ${update_status}" title="For Update in POS"></i></center></div>`;
                            }
                        }
                    }
                },
                { data: 'status', name: 'status'}
            ],
            initComplete: function(){
                $(document).prop('title', $('#page-name').text());
                $('#loading').hide();
            }
        });
    }

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/products_reload",
                success: function(data){
                    if(data != data_update){
                        data_update = data;
                        table.ajax.reload(null, false);
                    }
                }
            });
        }
    }, 1000);

    $('body').on('click', '.checkboxFilter', function(){
        var column = table.column($(this).attr('data-column'));
        var colnum = $(this).attr('data-column');
        column.visible(!column.visible());
        $('.fl-'+colnum).val('');
        table.column(colnum).search('').draw();
    });

    setInterval(() => {
        if($('.popover-header').is(':visible')){
            for(var i=0; i<=21; i++){
                if(table.column(i).visible()){
                    $('#filter-'+i).prop('checked', true);
                }
                else{
                    $('#filter-'+i).prop('checked', false);
                }
            }
        }
        $('th input').on('click', function(e){
            e.stopPropagation();
        });
    }, 0);
});

$('.filter-input').on('keyup search', function(){
    table.column($(this).data('column')).search($(this).val()).draw();
});

$('.filter-select').on('change', function(){
    table.column($(this).data('column')).search(!$(this).val()?'':'^'+$(this).val()+'$',true,false,true).draw();
});

$(document).on('change', '.togBtn', function(){
    Swal.fire({
        title: 'Change Status?',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',
        denyButton: 'order-3',
        }
    }).then((save) => {
        if(save.isConfirmed){
            var id = $(this).attr("id");
            var data = table.row(id).data();
            if($(this).is(':checked')){
                var status = 'ACTIVE';
            }
            else{
                var status = 'INACTIVE';
            }
            $.ajax({
                url: '/products_status',
                data:{
                    id: data.id,
                    item_code: data.item_code,
                    short_desc: data.short_desc,
                    status: status
                },
                success:function(){
                    window.location.reload();
                }
            });
        }
        else{
            if($(this).is(':checked')){
                $(this).prop('checked', false);
            }
            else{
                $(this).prop('checked', true);
            }
        }
    });
});

$(document).on('change', '.tglStatus', function(){
    Swal.fire({
        title: 'Change Status?',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',
        denyButton: 'order-3',
        }
    }).then((save) => {
        if(save.isConfirmed){
            var id = $(this).attr("id");
            var item_code = $(this).attr("tgl_item_code");
            var short_desc = $(this).attr("tgl_short_desc");
            if($(this).is(':checked')){
                var status = 'ACTIVE';
            }
            else{
                var status = 'INACTIVE';
            }
            $.ajax({
                url: '/products_status',
                data:{
                    id: id,
                    item_code: item_code,
                    short_desc: short_desc,
                    status: status
                }
            });
        }
        else{
            if($(this).is(':checked')){
                $(this).prop('checked', false);
            }
            else{
                $(this).prop('checked', true);
            }
        }
    });
});

$('#daily').on('change', function(){
    if($(this).prop('checked') == true){
        $('.days_available').prop('checked', true);
        $('.days_available').prop('disabled', true);
    }
    else{
        $('.days_available').prop('checked', false);
        $('.days_available').prop('disabled', false);
    }
});

var product_image;
function product_image_save() {
    var formData = new FormData();
    var file = $('#product_image').prop('files')[0];

    formData.append('product_image', file);
    $.ajax({
        url: '/products/insertImage',
        method: 'post',
        data: formData,
        contentType : false,
        processData : false,
        async: false,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response){
            product_image = response;
        }
    });
}

$('.saveBtn').on('click',function(){
    var id = $('#product_id').val();
    var item_code = $('#item_code').val();
    var category = $('#category').val();
    var intro_date = $('#intro_date').val();
    var short_desc = $('#short_desc').val();
    var long_desc = $('#long_desc').val();
    var sku = $('#sku').val();
    var modifier_code = $('#modifier_code').val();
    var company = $('#company').val();
    var type = $('#type').val();
    var setup = $('#setup').val();
    var area = $('#area').val();
    var store = $('#store').val();
    var dine_in = $('#dine_in').val();
    var take_out = $('#take_out').val();
    var pick_up = $('#pick_up').val();
    var delivery = $('#delivery').val();
    var bulk_order = $('#bulk_order').val();
    var fds = $('#fds').val();
    var drive_thru = $('#drive_thru').val();
    var meal_type = $('#meal_type').val();

    var dine_in_airport = $('#dine_in_airport').val();
    var take_out_airport = $('#take_out_airport').val();
    var pick_up_airport = $('#pick_up_airport').val();
    var delivery_airport = $('#delivery_airport').val();
    var bulk_order_airport = $('#bulk_order_airport').val();
    var fds_airport = $('#fds_airport').val();
    var drive_thru_airport = $('#drive_thru_airport').val();
    var meal_type_airport = $('#meal_type_airport').val();

    var senior = $('#senior').val();
    var pwd = $('#pwd').val();

    var max_modifier = $('#max_modifier').val();
    var seq = $('#seq').val();
    var kitchen_printer = $('#kitchen_printer').val();
    var promo_start = $('#promo_start').val();
    var promo_end = $('#promo_end').val();
    var promo_price = $('#promo_price').val();
    var promo_item_not_allow = $('#promo_item_not_allow').val();
    var sales_type = $('#sales_type').val();
    var start_date = $('#start_date').val();
    var start_time = $('#start_time').val();
    var end_date = $('#end_date').val();
    var end_time = $('#end_time').val();
    var dine_sml = $('#dine_sml').val();
    var dine_med = $('#dine_med').val();
    var dine_large = $('#dine_large').val();
    var dine_xl = $('#dine_xl').val();
    var dine_zero = $('#dine_zero').val();
    var takeout_sml = $('#takeout_sml').val();
    var takeout_med = $('#takeout_med').val();
    var takeout_large = $('#takeout_large').val();
    var takeout_xl = $('#takeout_xl').val();
    var takeout_zero = $('#takeout_zero').val();
    var pickup_sml = $('#pickup_sml').val();
    var pickup_med = $('#pickup_med').val();
    var pickup_large = $('#pickup_large').val();
    var pickup_xl = $('#pickup_xl').val();
    var pickup_zero = $('#pickup_zero').val();
    var delivery_sml = $('#delivery_sml').val();
    var delivery_med = $('#delivery_med').val();
    var delivery_large = $('#delivery_large').val();
    var delivery_xl = $('#delivery_xl').val();
    var delivery_zero = $('#delivery_zero').val();
    var days_available = new Array();
    $('.days_available').each(function(){
        if(this.checked) days_available.push($(this).val());
    });
    var pos_setup = new Array();
    $('.pos_setup').each(function(){
        if(this.checked) pos_setup.push($(this).val());
    });
    var promo_setup = new Array();
    $('.promo_setup').each(function(){
        if(this.checked) promo_setup.push($(this).val());
    });
    if(days_available.length == 0){
        var days_available_text = 'NONE';
    }
    else{
        var days_available_text = days_available.toString();
    }
    if(pos_setup.length == 0){
        var pos_setup_text = 'NONE';
    }
    else{
        var pos_setup_text = pos_setup.toString();
    }
    if(promo_setup.length == 0){
        var promo_setup_text = 'NONE';
    }
    else{
        var promo_setup_text = promo_setup.toString();
    }

    var store_code = new Array();
    $("#store option:selected").each(function(){
        var selectedText = $(this).text();
        var code = selectedText.split(":")[0];
        store_code.push(code);
    });

    if($('.saveBtn').attr('btntype') == 'SAVE'){
        Swal.fire({
            title: 'Do you want to save?',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
            actions: 'my-actions',
            confirmButton: 'order-2',
            denyButton: 'order-3',
            }
        }).then((save) => {
            if (save.isConfirmed) {
                $('#loading').show();
                if(!$('#filename').val() && $('#product_image').val()){
                    product_image_save();
                }
                else if(!$('#filename').val() && !$('#product_image').val()){
                    product_image = 'N/A';
                }
                else{
                    product_image = $('#filename').val();
                }
                $.ajax({
                    url:"/products/save",
                    type:"POST",
                    headers:{
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    data:{
                        product_image:product_image,
                        item_code:item_code,
                        category:category,
                        intro_date:intro_date,
                        short_desc:short_desc,
                        long_desc:long_desc,
                        sku:sku,
                        modifier_code:modifier_code,
                        company:company,
                        type:type,
                        setup:setup,
                        area:area,
                        store:store,
                        store_code:store_code,
                        dine_in:dine_in,
                        take_out:take_out,
                        pick_up:pick_up,
                        delivery:delivery,
                        bulk_order:bulk_order,
                        fds:fds,
                        drive_thru:drive_thru,
                        meal_type:meal_type,
                        dine_in_airport:dine_in_airport,
                        take_out_airport:take_out_airport,
                        pick_up_airport:pick_up_airport,
                        delivery_airport:delivery_airport,
                        bulk_order_airport:bulk_order_airport,
                        fds_airport:fds_airport,
                        drive_thru_airport:drive_thru_airport,
                        meal_type_airport:meal_type_airport,
                        senior:senior,
                        pwd:pwd,
                        pos_setup:pos_setup_text,
                        max_modifier:max_modifier,
                        seq:seq,
                        kitchen_printer:kitchen_printer,
                        promo_start:promo_start,
                        promo_end:promo_end,
                        promo_price:promo_price,
                        promo_item_not_allow:promo_item_not_allow,
                        sales_type:sales_type,
                        promo_setup:promo_setup_text,
                        start_date:start_date,
                        start_time:start_time,
                        end_date:end_date,
                        end_time:end_time,
                        days_available:days_available_text,
                        dine_sml:dine_sml,
                        dine_med:dine_med,
                        dine_large:dine_large,
                        dine_xl:dine_xl,
                        dine_zero:dine_zero,
                        takeout_sml:takeout_sml,
                        takeout_med:takeout_med,
                        takeout_large:takeout_large,
                        takeout_xl:takeout_xl,
                        takeout_zero:takeout_zero,
                        pickup_sml:pickup_sml,
                        pickup_med:pickup_med,
                        pickup_large:pickup_large,
                        pickup_xl:pickup_xl,
                        pickup_zero:pickup_zero,
                        delivery_sml:delivery_sml,
                        delivery_med:delivery_med,
                        delivery_large:delivery_large,
                        delivery_xl:delivery_xl,
                        delivery_zero:delivery_zero
                    },
                    success:function(data){
                        if(data.result == 'true'){
                            $('#promoProductCombination').DataTable().destroy();
                            var promoProductCombination_data  =  $('#promoProductCombination').DataTable().rows().data();
                            $.each(promoProductCombination_data, function(key, value){
                                var va = $.trim(value[0]);
                                if(suspend_id.includes(va.toString())){
                                    var suspend = 'INACTIVE';
                                }
                                else{
                                    var suspend = 'ACTIVE';
                                }
                                $.ajax({
                                    type: 'POST',
                                    url: '/savePromoProductCombination',
                                    async: false,
                                    headers:{
                                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                    },
                                    data:{
                                        promo_id : data.id,
                                        product : value[0],
                                        qty : value[4],
                                        promo_item_status: suspend
                                    },
                                });
                            });
                            $('#loading').hide();
                            $('#productsModal').modal('hide');
                            Swal.fire("SAVE SUCCESS", "", "success");
                            setTimeout(function(){window.location.reload();}, 2000);
                        }
                        else{
                            $('#loading').hide();
                            Swal.fire("SAVE FAILED", "", "error");
                        }
                    }
                });
            }
            else if (save.isDenied) {
                Swal.fire("SAVE CANCELLED", "", "info");
            }
        });
    }
    else{
        Swal.fire({
        title: 'Do you want to update?',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',
        denyButton: 'order-3',
        }
        }).then((save) => {
            if (save.isConfirmed) {
                $('#loading').show();
                if(!$('#filename').val() && $('#product_image').val()){
                    product_image_save();
                }
                else if(!$('#filename').val() && !$('#product_image').val()){
                    product_image = 'N/A';
                }
                else{
                    product_image = $('#filename').val();
                }
                $.ajax({
                    url:"/products/update",
                    type:"POST",
                    headers:{
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    data:{
                        id:id,
                        product_image:product_image,
                        filename_delete: $('#filename_delete').val(),
                        item_code:item_code,
                        category:category,
                        intro_date:intro_date,
                        short_desc:short_desc,
                        long_desc:long_desc,
                        sku:sku,
                        modifier_code:modifier_code,
                        company:company,
                        type:type,
                        setup:setup,
                        area:area,
                        store:store,
                        store_code:store_code,
                        dine_in:dine_in,
                        take_out:take_out,
                        pick_up:pick_up,
                        delivery:delivery,
                        bulk_order:bulk_order,
                        fds:fds,
                        drive_thru:drive_thru,
                        meal_type:meal_type,
                        dine_in_airport:dine_in_airport,
                        take_out_airport:take_out_airport,
                        pick_up_airport:pick_up_airport,
                        delivery_airport:delivery_airport,
                        bulk_order_airport:bulk_order_airport,
                        fds_airport:fds_airport,
                        drive_thru_airport:drive_thru_airport,
                        meal_type_airport:meal_type_airport,
                        senior:senior,
                        pwd:pwd,
                        pos_setup:pos_setup_text,
                        max_modifier:max_modifier,
                        seq:seq,
                        kitchen_printer:kitchen_printer,
                        promo_start:promo_start,
                        promo_end:promo_end,
                        promo_price:promo_price,
                        promo_item_not_allow:promo_item_not_allow,
                        sales_type:sales_type,
                        promo_setup:promo_setup_text,
                        start_date:start_date,
                        start_time:start_time,
                        end_date:end_date,
                        end_time:end_time,
                        days_available:days_available_text,
                        dine_sml:dine_sml,
                        dine_med:dine_med,
                        dine_large:dine_large,
                        dine_xl:dine_xl,
                        dine_zero:dine_zero,
                        takeout_sml:takeout_sml,
                        takeout_med:takeout_med,
                        takeout_large:takeout_large,
                        takeout_xl:takeout_xl,
                        takeout_zero:takeout_zero,
                        pickup_sml:pickup_sml,
                        pickup_med:pickup_med,
                        pickup_large:pickup_large,
                        pickup_xl:pickup_xl,
                        pickup_zero:pickup_zero,
                        delivery_sml:delivery_sml,
                        delivery_med:delivery_med,
                        delivery_large:delivery_large,
                        delivery_xl:delivery_xl,
                        delivery_zero:delivery_zero,
                        product_composition_change:product_composition_change,
                        product_image_change:product_image_change
                    },
                    success:function(data){
                        if(data.result == 'true'){
                            $('.promoProductCombination_tr').each(function(){
                                var va = $.trim($(this).children('.td_1').html());
                                if(suspend_id.includes(va.toString())){
                                    var suspend = 'INACTIVE';
                                }
                                else{
                                    var suspend = 'ACTIVE';
                                }
                                $.ajax({
                                    type: 'POST',
                                    url: '/savePromoProductCombination',
                                    async: false,
                                    headers:{
                                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                    },
                                    data:{
                                        promo_id : id,
                                        product : $(this).children('.td_1').html(),
                                        qty : $(this).children('.td_2').html(),
                                        promo_item_status: suspend
                                    },
                                });
                            });

                            $('#loading').hide();
                            $('#productsModal').modal('hide');
                            Swal.fire("UPDATE SUCCESS", "", "success");
                            setTimeout(function(){window.location.reload();}, 2000);
                        }
                        else{
                            $('#loading').hide();
                            Swal.fire("UPDATE FAILED", "", "error");
                        }
                    }
                });
            }
            else if (save.isDenied) {
                Swal.fire("UPDATE CANCELLED", "", "info");
            }
        });
    }
});

var promo_id = [];
$(document).on('click','table.productsTable tbody tr td',function(){
    if($(this).text() != 'ACTIVEINACTIVE'){
        current_modal = 'UPDATE';
        $('#loading').show();
        $('.req').hide();
        stores_list = [];
        promo_id = [];
        suspend_id = [];
        area_all = [];

        if(!current_permissions.includes('3')){
            $('#productsModal').find('input').prop('disabled', true);
            $('#productsModal').find('select').prop('disabled', true);
            $('#productsModal').find('textarea').prop('disabled', true);
        }
        $('.tab1').click();
        $('#tab_regular').click();
        $('.validation').hide();
        $('.forminput').removeClass('redBorder');

        var data = table.row(this).data();

        if(current_permissions.includes('5')){
            $('#tabContent').addClass('mt-8');
        }
        else{
            $('#tabContent').removeClass('mt-8');
        }

        if(data.status == 'ACTIVE'){
            $('#status').html('<label class="switch"><input type="checkbox" class="tglStatus" id="'+ data.id +'" tgl_item_code="'+data.item_code+'" tgl_short_desc="'+data.short_desc+'" checked><div class="slider round"><span style="font-size: 110%;" class="on">ACTIVE</span><span style="font-size: 100%;" class="off">INACTIVE</span></div></label>');
        }
        if(data.status == 'INACTIVE'){
            $('#status').html('<label class="switch"><input type="checkbox" class="tglStatus" id="'+ data.id +'" tgl_item_code="'+data.item_code+'" tgl_short_desc="'+data.short_desc+'"><div class="slider round"><span style="font-size: 110%;" class="on">ACTIVE</span><span style="font-size: 100%;" class="off">INACTIVE</span></div></label>');
        }

        if(!data.product_image){
            $('#filename').val('');
            $('#product_image_preview').attr('src','');
            $('#product_image_preview').hide();
        }
        else{
            $('#filename').val(data.product_image);
            $('#product_image_preview').prop('src',window.location.origin+'/storage/product_images/'+data.product_image);//Returns base URL/to get the current url (window.location.origin)
            $('#product_image_preview').show();
        }

        $('#filename_delete').val('');

        $('#product_id').val(data.id);
        $('#item_code').val(data.item_code);
        $('#category').val(data.category);
        $('#category').change();
        $('#intro_date').val(data.intro_date);
        $('#short_desc').val(data.short_desc);
        $('#long_desc').val(data.long_desc);
        $('#sku').val(data.sku);
        $('#modifier_code').val(data.modifier_code);
        $('#dine_in').val(parseFloat(data.dine_in).toFixed(2));
        $('#take_out').val(parseFloat(data.take_out).toFixed(2));
        $('#pick_up').val(parseFloat(data.pick_up).toFixed(2));
        $('#delivery').val(parseFloat(data.delivery).toFixed(2));
        $('#bulk_order').val(parseFloat(data.bulk_order).toFixed(2));
        $('#fds').val(parseFloat(data.fds).toFixed(2));
        $('#drive_thru').val(parseFloat(data.drive_thru).toFixed(2));
        $('#meal_type').val(parseFloat(data.meal_type).toFixed(2));
        $('#dine_in_airport').val(parseFloat(data.dine_in_airport).toFixed(2));
        $('#take_out_airport').val(parseFloat(data.take_out_airport).toFixed(2));
        $('#pick_up_airport').val(parseFloat(data.pick_up_airport).toFixed(2));
        $('#delivery_airport').val(parseFloat(data.delivery_airport).toFixed(2));
        $('#bulk_order_airport').val(parseFloat(data.bulk_order_airport).toFixed(2));
        $('#fds_airport').val(parseFloat(data.fds_airport).toFixed(2));
        $('#drive_thru_airport').val(parseFloat(data.drive_thru_airport).toFixed(2));
        $('#meal_type_airport').val(parseFloat(data.meal_type_airport).toFixed(2));
        $('#senior').val(parseFloat(data.senior).toFixed(2));
        $('#pwd').val(parseFloat(data.pwd).toFixed(2));
        $('#max_modifier').val(data.max_modifier);
        $('#seq').val(data.seq);
        $('#kitchen_printer').val(data.kitchen_printer);
        $('#promo_start').val(data.promo_start);
        $('#promo_end').val(data.promo_end);
        $('#promo_price').val(parseFloat(data.promo_price).toFixed(2));
        $('#promo_item_not_allow').val(data.promo_item_not_allow);
        $('#sales_type').val(data.sales_type);
        $('#start_date').val(data.start_date);
        $('#start_time').val(data.start_time);
        $('#end_date').val(data.end_date);
        $('#end_time').val(data.end_time);
        $('#dine_sml').val(parseFloat(data.dine_sml).toFixed(2));
        $('#dine_med').val(parseFloat(data.dine_med).toFixed(2));
        $('#dine_large').val(parseFloat(data.dine_large).toFixed(2));
        $('#dine_xl').val(parseFloat(data.dine_xl).toFixed(2));
        $('#dine_zero').val(parseFloat(data.dine_zero).toFixed(2));
        $('#takeout_sml').val(parseFloat(data.takeout_sml).toFixed(2));
        $('#takeout_med').val(parseFloat(data.takeout_med).toFixed(2));
        $('#takeout_large').val(parseFloat(data.takeout_large).toFixed(2));
        $('#takeout_xl').val(parseFloat(data.takeout_xl).toFixed(2));
        $('#takeout_zero').val(parseFloat(data.takeout_zero).toFixed(2));
        $('#pickup_sml').val(parseFloat(data.pickup_sml).toFixed(2));
        $('#pickup_med').val(parseFloat(data.pickup_med).toFixed(2));
        $('#pickup_large').val(parseFloat(data.pickup_large).toFixed(2));
        $('#pickup_xl').val(parseFloat(data.pickup_xl).toFixed(2));
        $('#pickup_zero').val(parseFloat(data.pickup_zero).toFixed(2));
        $('#delivery_sml').val(parseFloat(data.delivery_sml).toFixed(2));
        $('#delivery_med').val(parseFloat(data.delivery_med).toFixed(2));
        $('#delivery_large').val(parseFloat(data.delivery_large).toFixed(2));
        $('#delivery_xl').val(parseFloat(data.delivery_xl).toFixed(2));
        $('#delivery_zero').val(parseFloat(data.delivery_zero).toFixed(2));
        if(data.days_available == 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday'){
            $('#daily').prop('checked', true);
            setTimeout(() => {
                $('#daily').change();
            }, current_timeout);
        }
        else{
            $('#daily').prop('checked', false);
            $('.days_available').prop('checked', false);
            $('.days_available').prop('disabled', false);
            setTimeout(() => {
                $('.days_available').each(function(){
                    if(data.days_available.includes($(this).val())){
                        $(this).prop('checked', true);
                    }
                    else{
                        $(this).prop('checked', false);
                    }
                });
            }, current_timeout);
        }
        $('.pos_setup').prop('checked', false);
        setTimeout(() => {
            $('.pos_setup').each(function(){
                if(data.pos_setup.includes($(this).val())){
                    $(this).prop('checked', true);
                }
                else{
                    $(this).prop('checked', false);
                }
            });
        }, current_timeout);
        $('.promo_setup').prop('checked', false);
        setTimeout(() => {
            $('.promo_setup').each(function(){
                if(data.promo_setup.includes($(this).val())){
                    $(this).prop('checked', true);
                }
                else{
                    $(this).prop('checked', false);
                }
            });
        }, current_timeout);

        if(data.company){
            var company_array = data.company.split()[0].split('|');
            $("#company").children("option").each(function(){
                if(company_array.includes($(this).val().toString())){
                    $(this).prop("selected",true);
                }
                else{
                    $(this).prop("selected",false);
                }
            });

            setTimeout(() => {
                $('#company').change();
                $('#company').trigger('chosen:updated');
            }, current_timeout);
        }

        if(data.type){
            var type_array = data.type.split()[0].split('|');
            $("#type").children("option").each(function(){
                if(type_array.includes($(this).val().toString())){
                    $(this).prop("selected",true);
                }
                else{
                    $(this).prop("selected",false);
                }
            });

            setTimeout(() => {
                $('#type').change();
                $('#type').trigger('chosen:updated');
            }, current_timeout);
        }

        var setup_array = data.setup.split()[0].split(',');
        $("#setup").children("option").each(function(){
            if(setup_array.includes($(this).val().toString())){
                $(this).prop("selected",true);
            }
            else{
                $(this).prop("selected",false);
            }
        });

        setTimeout(() => {
            $('#setup').change();
            $('#setup').trigger('chosen:updated');
        }, current_timeout);

        $("#area").children("option").each(function(){
            if($.inArray($(this).val(),(data.area).split('|')) !== -1){
                $(this).prop("selected",true);
            }
            else{
                $(this).prop("selected",false);
            }
        });

        setTimeout(() => {
            $('#area').trigger('chosen:updated');
            $('#area').change();

            $('#category').trigger('chosen:updated');
            $('#category').change();

            setTimeout(() => {
                if(data.store == '0-0'){
                    $('#store').val(['0-0']);
                    $('#store').trigger('chosen:updated');
                    $('#store').change();
                }
                else{
                    $("#store").children("option").each(function(){
                        if($.inArray($(this).val(),(data.store).split('|')) !== -1){
                            $(this).prop("selected",true);
                        }
                        else{
                            $(this).prop("selected",false);
                        }
                    });
                    $('#store').trigger('chosen:updated');
                    $('#store').change();
                }
            }, current_timeout);
        }, current_timeout);

        //trclick table
        $('#promoProductCombination_tbody').empty();
        if($('#category option:selected').attr('combo') == 'Y'){
            $.ajax({
                url: '/promo_product_combination/data',
                async: false,
                data:{
                    id: data.id
                },
                success: function(data){
                    var array = $.map(data, function(value, index){
                        return [value];
                    });
                    array.forEach(value => {
                        if(value.promo_item_status == 'INACTIVE'){
                            suspend_id.push(value.product_id);
                        }
                        else{
                            var index = suspend_id.indexOf(value.product_id);
                            if(index !== -1){
                                suspend_id.splice(index, 1);
                            }
                        }
                        html = "<tr class='promoProductCombination_tr'>"+
                                    "<td class='td_1 d-none'>" + value.product_id + "</td>" +
                                    "<td>" + value.category_name + "</td>" +
                                    "<td>" + value.item_code +': '+ value.short_description + "</td>" +
                                    "<td class='text-right'>" +  formatNumber(parseFloat(value.dine_in).toFixed(2)) + "</td>" +
                                    "<td class='text-right td_2'>" + value.qty + "</td>" +
                                    "<td class='text-right td_Amount'>" +  formatNumber((parseFloat(value.dine_in) * parseFloat(value.qty)).toFixed(2)) + "</td>" +
                                    "<td> <center><input type='checkbox' class='checkbox cbx' style='zoom:180%;' value="+ value.product_id +"></center> </td>" +
                                    "<td> <center><button type='button' class='btn btn-danger btn-delete btn_promo center' title='DELETE'><i class='fas fa-trash-alt'></i></button></center> </td>" +
                                "</tr>";
                        $("#promoProductCombination_tbody").append(html);
                    });
                    $('.cbx').each(function() {
                        var va = parseInt($.trim($(this).val()));
                        if(suspend_id.includes(va.toString())){
                            $(this).prop('checked',true);
                        }
                        else{
                            $(this).prop('checked',false);
                        }
                    });
                }
            });
            var td_totalAmount = 0;
            $(".td_Amount").each(function(){
                td_totalAmount += parseFloat($(this).html().replace(/,/g,''));
            });
            $('.td_totalAmount').html(formatNumber(td_totalAmount.toFixed(2)));
        }
        $('#loading').hide();
        $('#productsModal').modal('show');
    }
});

setInterval(() => {
    if($('#productsModal').is(':visible') && $('#product_id').val()){
        $('.saveBtn').attr('btntype', 'UPDATE');
        $('.saveBtn').html('<i class="fas fa-save"></i> UPDATE');
    }
    else{
        $('.saveBtn').attr('btntype', 'SAVE');
        $('.saveBtn').html('<i class="fas fa-save"></i> SAVE');
    }

    if($('#page1').is(':visible')){
        $('.btnNextPage').show();
        $('.btnPrevPage').hide();
        if($(".requiredInput:visible").length > 0){
            $('.tab2').prop('disabled', true);
            $('.btnNextPage').prop('disabled', true);
        }
        else{
            $('.tab2').prop('disabled', false);
            $('.btnNextPage').prop('disabled', false);
        }
        if(!current_permissions.includes('3') && $('.notUpdate').is(':visible')){
            $('.notUpdate').hide();
        }
    }
    else{
        if(!current_permissions.includes('3') && $('.saveBtn').html() != '<i class="fas fa-save"></i> SAVE'){
            $('.notUpdate').hide();
        }
        else{
            $('.saveBtn').show();
        }
        $('.btnNextPage').hide();
        $('.btnPrevPage').show();
    }
}, 0);

$('.tab1').on('click',function(){
    $(this).blur();
    $('.tab2').addClass('bg-sub-light');
    $('.tab2').removeClass('bg-sub active');
    $('.tab1').removeClass('bg-sub-light');
    $('.tab1').addClass('bg-sub active');
    $('.tab1').attr('aria-selected', true);
    $('.tab2').attr('aria-selected', false);
    $('#page1').addClass('active');
    $('#page1').addClass('show');
    $('#page2').removeClass('active');
    $('#page2').removeClass('show');
    $('#page1').show();
    $('#page2').hide();
});

$('.tab2').on('click',function(){
    $(this).blur();
    if($('.tab2').prop('disabled')){
        return false;
    }
    $('.tab1').addClass('bg-sub-light');
    $('.tab1').removeClass('bg-sub active');
    $('.tab2').removeClass('bg-sub-light');
    $('.tab2').addClass('bg-sub active');
    $('.tab2').attr('aria-selected', true);
    $('.tab1').attr('aria-selected', false);
    $('#page2').addClass('active');
    $('#page2').addClass('show');
    $('#page1').removeClass('active');
    $('#page1').removeClass('show');
    $('#page2').show();
    $('#page1').hide();
});

$('#tab_regular').on('click',function(){
    $(this).blur();
    $('#tab_airport').addClass('bg-sub-light');
    $('#tab_airport').removeClass('bg-sub active');
    $('#tab_regular').removeClass('bg-sub-light');
    $('#tab_regular').addClass('bg-sub active');
    $('#tab_discount').addClass('bg-sub-light');
    $('#tab_discount').removeClass('bg-sub active');
    $('#tab_regular').attr('aria-selected', true);
    $('#tab_airport').attr('aria-selected', false);
    $('#tab_discount').attr('aria-selected', false);
    $('#page_regular').addClass('active');
    $('#page_regular').addClass('show');
    $('#page_airport').removeClass('active');
    $('#page_airport').removeClass('show');
    $('#page_discount').removeClass('active');
    $('#page_discount').removeClass('show');
    $('#page_regular').show();
    $('#page_airport').hide();
    $('#page_discount').hide();
});

$('#tab_airport').on('click',function(){
    $(this).blur();
    $('#tab_regular').addClass('bg-sub-light');
    $('#tab_regular').removeClass('bg-sub active');
    $('#tab_airport').removeClass('bg-sub-light');
    $('#tab_airport').addClass('bg-sub active');
    $('#tab_discount').addClass('bg-sub-light');
    $('#tab_discount').removeClass('bg-sub active');
    $('#tab_airport').attr('aria-selected', true);
    $('#tab_regular').attr('aria-selected', false);
    $('#tab_discount').attr('aria-selected', false);
    $('#page_airport').addClass('active');
    $('#page_airport').addClass('show');
    $('#page_regular').removeClass('active');
    $('#page_regular').removeClass('show');
    $('#page_discount').removeClass('active');
    $('#page_discount').removeClass('show');
    $('#page_airport').show();
    $('#page_regular').hide();
    $('#page_discount').hide();
});

$('#tab_discount').on('click',function(){
    $(this).blur();
    $('#tab_regular').addClass('bg-sub-light');
    $('#tab_regular').removeClass('bg-sub active');
    $('#tab_airport').addClass('bg-sub-light');
    $('#tab_airport').removeClass('bg-sub active');
    $('#tab_discount').removeClass('bg-sub-light');
    $('#tab_discount').addClass('bg-sub active');
    $('#tab_airport').attr('aria-selected', false);
    $('#tab_regular').attr('aria-selected', false);
    $('#tab_discount').attr('aria-selected', true);
    $('#page_airport').removeClass('active');
    $('#page_airport').removeClass('show');
    $('#page_regular').removeClass('active');
    $('#page_regular').removeClass('show');
    $('#page_discount').addClass('active');
    $('#page_discount').addClass('show');
    $('#page_airport').hide();
    $('#page_regular').hide();
    $('#page_discount').show();
});

$('.btnNextPage').on('click',function(){
    $('.tab2').click();
});

$('.btnPrevPage').on('click',function(){
    $('.tab1').click();
});

//Upload Image
function ProductImageValidation(product_image) {
    var productImageData = document.getElementById('product_image');
    var productImageUploadPath = productImageData.value;
    var productImageExtension = productImageUploadPath.substring(productImageUploadPath.lastIndexOf('.') + 1).toLowerCase();
    var productImageFileSize = $("#product_image").get(0).files[0].size;

    if ((productImageExtension != "jpg" && productImageExtension != "jpeg" && productImageExtension != "png" && productImageExtension != "gif") && productImageFileSize > 5242880) {
        Swal.fire({
            title: 'UNSUPPORTED FILE TYPE AND EXCEEDED MAXIMUM FILE SIZE (5MB)!',
            icon: 'error',
            text: 'Please upload file with an extension of (.jpg, .jpeg, .png, .gif) and with size not greater than 5MB.',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        $('#product_image').val('');
        $('#product_image_preview').attr('src','');
    }
    else if(productImageExtension != "jpg" && productImageExtension != "jpeg" && productImageExtension != "png" && productImageExtension != "gif"){
        Swal.fire({
            title: 'UNSUPPORTED FILE TYPE',
            icon: 'error',
            text: 'Please upload file with an extension of (.jpg, .jpeg, .png, .gif).',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        $('#product_image').val('');
        $('#product_image_preview').attr('src','');
    }
    else if(productImageFileSize > 5242880){
        Swal.fire({
            title: 'EXCEEDED MAXIMUM FILE SIZE (5MB)!',
            icon: 'error',
            text: 'Please upload valid file with size not greater than 5MB.',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        $('#product_image').val('');
        $('#product_image_preview').attr('src','');
    }
    else {
        if (productImageData.files && productImageData.files[0]) {
            var productImageReader = new FileReader();
                productImageReader.onload = function(e) {
                    $('#product_image_preview').attr('src', e.target.result);
                }
                productImageReader.readAsDataURL(productImageData.files[0]);
                $('#product_image_preview').show();
        }
    }
}

var product_image_change;
$('.remove_image').on('click',function(){
    Swal.fire({
        title: 'Do you want to remove image?',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',
        denyButton: 'order-3',
        }
    }).then((save) => {
        if (save.isConfirmed) {
            $('#filename_delete').val($('#filename').val());
            $('#filename').val('');
            $('#product_image').val('');
            $('#product_image_preview').attr('src','');
            $('#product_image_preview').hide();
            product_image_change = 'CHANGED';
        }
    });
});

setInterval(() => {
    if(!$('#product_image_preview').attr('src')){
        $('#span_upload_image').show();
        $('.remove_image').hide();
    }
    else{
        $('#span_upload_image').hide();
        $('.remove_image').show();
    }
}, 0);

function modal_product_image_preview(productImageSrc){
    var productImageSrc = productImageSrc.src;
    var productImage = document.getElementById('modal_product_image_display');
    productImage.src = productImageSrc;
}

$('#item_code').on('keyup',function(){
    $.ajax({
        url: "/item_code/checkDuplicate",
        data:{
            item_code : $('#item_code').val(),
        },
        success: function(data){
            if(data == 'duplicate_item_code'){
                $('#duplicate_item_code').show();
                $('#item_code').addClass('redBorder');
            }
            else{
                $('#duplicate_item_code').hide();
                $('#item_code').removeClass('redBorder');
            }
        }
    });
});

$('#sku').on('keyup',function(){
    $.ajax({
        url: "/sku/checkDuplicate",
        data:{
            sku : $('#sku').val(),
        },
        success: function(data){
            if(data == 'duplicate_sku'){
                $('#duplicate_sku').show();
                $('#sku').addClass('redBorder');
            }
            else{
                $('#duplicate_sku').hide();
                $('#sku').removeClass('redBorder');
            }
        }
    });
});

$('#modifier_code').on('keyup',function(){
    $.ajax({
        url: "/modifier_code/checkDuplicate",
        data:{
            modifier_code : $('#modifier_code').val(),
        },
        success: function(data){
            if(data == 'duplicate_modifier_code'){
                $('#duplicate_modifier_code').show();
                $('#modifier_code').addClass('redBorder');
            }
            else{
                $('#duplicate_modifier_code').hide();
                $('#modifier_code').removeClass('redBorder');
            }
        }
    });
});

$('#btnUpload').on('click', function(){
    if($('#xlsx')[0].files.length === 0){
        $('#btnSubmit').click();
    }
    else{
        Swal.fire({
            title: "UPLOAD FILE IMPORT?",
            html: "Click <b style='color: #d33;'>CONFIRM</b> button to ADD PRODUCTS via uploading import file; otherwise, click <b style='color: #3085d6;'>CANCEL</b> button to select a different file.",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Confirm',
            allowOutsideClick: false
        })
        .then((result) => {
            if(result.isConfirmed){
                $('#loading').show();
                $('#btnSubmit').click();
            }
        });
    }
});

// $(document).on('click','.btnSendUpdate',function(){
//     $('#sendUpdateModal').modal('show');
// });

// $(document).on('click','.sendUpdateBtn',function(){
//     Swal.fire({
//         title: 'Send All Product Updates?',
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//         showDenyButton: true,
//         confirmButtonText: 'Yes',
//         denyButtonText: 'No',
//         customClass: {
//         actions: 'my-actions',
//         confirmButton: 'order-2',
//         denyButton: 'order-3',
//         }
//     }).then((save) => {
//         if(save.isConfirmed){
//             $('#loading').show();
//             $.ajax({
//                 url:'/sendProductUpdate',
//                 type:"POST",
//                 headers:{
//                     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//                 },
//                 success:function(data){
//                     if(data == 'true'){
//                         $('#loading').hide();
//                         Swal.fire({
//                             title: 'PRODUCT UPDATES SENT SUCCESSFULLY',
//                             icon: 'success',
//                             timer: 2000
//                         });
//                         $('#sendUpdateModal').modal('hide');
//                         setTimeout(function(){window.location.reload();}, 2000);
//                     }
//                     else{
//                         $('#loading').hide();
//                         Swal.fire({
//                             title: 'SEND FAILED',
//                             icon: 'error',
//                             timer: 2000
//                         });
//                     }
//                 }
//             });
//         }
//         else if(save.isDenied){
//             Swal.fire('CANCELLED','','info');
//         }
//     });
// });

$(document).on('click', '.btnSendUpdate', function(){
    Swal.fire({
        title: 'Send All Product Updates?',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',
        denyButton: 'order-3',
        }
    }).then((save) => {
        if(save.isConfirmed){
            $('#loading').show();
            $.ajax({
                url:'/sendProductUpdate',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success:function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        Swal.fire({
                            title: 'PRODUCT UPDATES SENT SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                        setTimeout(function(){window.location.reload();}, 2000);
                    }
                    else{
                        $('#loading').hide();
                        Swal.fire({
                            title: 'SEND FAILED',
                            icon: 'error',
                            timer: 2000
                        });
                    }
                }
            });
        }
        else if(save.isDenied){
            Swal.fire('SEND CANCELLED','','info');
        }
    });
});

$(document).ready(function(){
    if(current_location == '/products?import=success_without_errors'){
        $('#loading').hide();
        Swal.fire("IMPORT SUCCESS", "ADD PRODUCTS via import file is successful without errors.", "success");
    }
    else if(current_location == '/products?import=success_with_errors'){
        $('#loading').hide();
        Swal.fire("IMPORT SUCCESS W/ ERRORS", "ADD PRODUCTS via import file is successful with some errors.", "warning");
    }
    else if(current_location == '/products?import=failed'){
        $('#loading').hide();
        Swal.fire("IMPORT FAILED", "ADD PRODUCTS via import file has failed.", "error");
    }
});

// SET MEAL JS
$(document).on('click', '.btndelItem', function(e){
    e.preventDefault();
    var id = $(this).attr("id");
    var data = $('table.promoProductCombination_orig').DataTable().row(id).data();
    promo_id.push((data.id).toString());
    $(this).parent().parent().parent().remove();
});

var product_composition_change;
$('.addPromoCombinationBtn').click(function(e){
    e.preventDefault();
    $('#promoProductCombination').show();
    $('.promoProductCombination').show();

    var product_category = $('#product_category option:selected').text();
    var item_id = $('#short_description').val();
    var short_description = $('#short_description option:selected').text();
    var price = parseFloat($('#price').val()).toFixed(2);
    var qty = $('#qty').val();
    var amount = parseFloat(parseFloat($('#price').val()) * parseFloat(qty)).toFixed(2);

    var ProductCombinationTable =   "<tr class='promoProductCombination_tr'>"+
                                            "<td class='td_1 d-none'>" + item_id + "</td>" +
                                            "<td>" + product_category + "</td>" +
                                            "<td>" + short_description + "</td>" +
                                            "<td class='text-right'>" + formatNumber(price) + "</td>" +
                                            "<td class='text-right td_2'>" + qty + "</td>" +
                                            "<td class='text-right td_Amount'>" + formatNumber(amount) + "</td>" +
                                            "<td> <center><input type='checkbox' class='checkbox' style='zoom:180%;' value="+ item_id +"></center> </td>" +
                                            "<td> <center><button type='button' class='btn btn-danger btn-delete btn_promo center' title='DELETE'><i class='fas fa-trash-alt'></i></button></center> </td>" +
                                    "</tr>";
    if($('.saveBtn').attr('btntype') == 'UPDATE'){
        $('#promoProductCombination_tbody').append(ProductCombinationTable);
        $('#promoProductCombination').hide();
        product_composition_change = 'CHANGED';
    }
    else{
        $('#promoProductCombination tbody').append(ProductCombinationTable);
        $('#promoProductCombination_orig').hide();
    }

    $('#product_category').val("");
    $('#product_category').change();
    $('#short_description').val("");
    $('#short_description').trigger('chosen:updated');
    $('#product_code').val("");
    $('#qty').val("");
    $('#price').val("");

    var td_totalAmount = 0;
    $(".td_Amount").each(function(){
        td_totalAmount += parseFloat($(this).html().replace(/,/g,''));
    });
    $('.td_totalAmount').html(formatNumber(td_totalAmount.toFixed(2)));
});

$(document).on('click', '.btn_promo', function(){
    $(this).parent().parent().parent().remove();
    var td_totalAmount = 0;
    $(".td_Amount").each(function(){
        td_totalAmount += parseFloat($(this).html().replace(/,/g,''));
    });
    $('.td_totalAmount').html(formatNumber(td_totalAmount.toFixed(2)));
    product_composition_change = 'CHANGED';
});

var suspend_id = [];
$(document).on('change', '.checkbox', function() {
    var va = $.trim($(this).val());
    if(suspend_id.includes(va.toString())){
        var index = suspend_id.indexOf(va);
        if(index !== -1){
            suspend_id.splice(index, 1);
        }
    }
    else{
        suspend_id.push(va);
    }
});

$(document).on('change','#category',function(){
    if($('#category option:selected').attr('combo') == 'Y'){
        $('#short_description').chosen();
        $('#short_description').trigger('chosen:updated');
        $('#short_description_chosen').css('width','100%');
        $('#set_meal_div').show();
        setTimeout(() => {
            if($('#productsModal').is(':visible') && $('#product_id').val()){
                $('#promoProductCombination').hide();
                $('#promoProductCombination_orig').show();
            }
            else{
                $('#promoProductCombination').show();
                $('#promoProductCombination_orig').hide();
            }
        }, current_timeout);
    }
    else{
        $('#set_meal_div').hide();
    }
});

$('#product_category').on('change', function(){
    $('#product_code').val('');
    $('#loading').show();
    var category_id = $(this).val();
        $.ajax({
            type: 'GET',
            url: '/setShortDescription',
            data:{
                'category_id': category_id,
            },
            success: function(data){
                $('#short_description').prop('disabled',false);
                $('#short_description').find('option').remove().end()
                $('#short_description').append($('<option value="" selected disabled>Select Short Description</option>'));
                var list = $.map(data, function(value, index){
                    return [value];
                });
                list.forEach(value => {
                    $('#short_description').append($('<option>', {
                        value: value.product_id,
                        text: value.item_code + ': ' + value.short_description.toUpperCase(),
                        code: value.item_code,
                        long: value.long_description.toUpperCase(),
                        price: value.dine_in
                    }));
                });
                $('#short_description').chosen();
                $('#short_description').trigger('chosen:updated');
                $('#short_description_chosen').css('width','100%');
                $('#loading').hide();
            }
        });
});

$('#short_description').on('change', function(){
    var product_code = $('#short_description option:selected').attr('code');
    var price = $('#short_description option:selected').attr('price');
    $('#product_code').val(product_code);
    $('#price').val(price);
});

setInterval(() => {
    if(!$('#product_category').val() || !$('#short_description').val() || !$('#product_code').val() || !$('#qty').val()){
        $('.addPromoCombinationBtn').prop('disabled',true);
    }
    else{
        $('.addPromoCombinationBtn').prop('disabled',false);
    }

    if($('.saveBtn').attr('btntype') == 'SAVE'){
        $('#promoProductCombination_orig').hide();
        if($('#promoProductCombination tbody').children().length > 0){
            $('#promoProductCombination').show();
            $('#product_category').removeClass('required_field redBorder');
            $('#short_description').removeClass('required_field redBorder');
            $('#product_code').removeClass('required_field redBorder');
        }
        else{
            $('#promoProductCombination').hide();
            $('#product_category').addClass('required_field');
            $('#short_description').addClass('required_field');
            $('#product_code').addClass('required_field');
        }

        if($('#promoProductCombination tbody').children().length > 0 && $(".requiredInput:visible").length == 0){
            $('#promosRequired').hide();
        }
        else{
            $('#promosRequired').show();
        }

        if($('#promoProductCombination td').length == 0) {
            $('#set_meal_table_div').hide();
            $('.promoProductCombination_thead').hide();
        }
        else{
            $('#set_meal_table_div').show();
            $('.promoProductCombination_thead').show();
        }
    }
    else{
        $('#promoProductCombination_orig').show();
    }

    if($('.saveBtn').attr('btntype') == 'UPDATE'){
        $('.dataTables_empty').closest('tr').remove();
        $('#promoProductCombination').hide();
        if($('#promoProductCombination_orig tbody').children().length > 0){
            $('#promoProductCombination_orig').show();
            $('#product_category').removeClass('required_field redBorder');
            $('#short_description').removeClass('required_field redBorder');
            $('#product_code').removeClass('required_field redBorder');
        }
        else{
            $('#promoProductCombination_orig').hide();
            $('#product_category').addClass('required_field');
            $('#short_description').addClass('required_field');
            $('#product_code').addClass('required_field');
        }

        if($('#promoProductCombination_orig tbody').children().length > 0 && $(".requiredInput:visible").length == 0){
            $('#promosRequired').hide();
        }
        else{
            $('#promosRequired').show();
        }

        if($('#promoProductCombination_orig td').length == 0) {
            $('#set_meal_table_orig_div').hide();
        }
        else{
            $('#set_meal_table_orig_div').show();
        }
    }
}, 0);

$(document).on('change', '#company, #type, #setup', function(){
    if($(this).val().includes('0')){
        $(this).val(['0']);
        $(this).trigger('chosen:updated');
    }
    $('#area').change();
});

$(document).on('change', '#store', function(){
    if($(this).val().includes('0-0')){
        $(this).val(['0-0']);
        $(this).trigger('chosen:updated');
    }
});

var area_all = [];
var stores_list = [];
$(document).on('change', '#area', function(){
    if($(this).val().includes('0')){
        $(this).val(['0']);
        $(this).trigger('chosen:updated');
    }
    if(!$('#area option:selected').length){
        $('#store').find('option').remove();
        $('#store').trigger('chosen:updated');
    }
    else{
        var storesOption = " ";
        $.ajax({
            url:"/products/stores",
            type:"get",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data:{
                company_id: $('#company').val(),
                type_id: $('#type').val(),
                setup_id: $('#setup').val(),
                area_id: $('#area').val(),
                area_all: area_all
            },
            success:function(data){
                var stores = $.map(data, function(value, index) {
                    return [value];
                });
                const selectedOptions = $('#area option:selected').map(function(){
                    return { value: this.value, text: this.text };
                }).get();
                for(let i = 0; i < selectedOptions.length; i++){
                    storesOption+='<option value="'+selectedOptions[i].value+'-0'+'">'+selectedOptions[i].text+' (ALL BRANCHES)</option>';
                }
                stores.forEach(value => {
                    storesOption+='<option value="'+value.id+'">'+value.branch_code+': '+value.branch_name+'</option>';
                });
                $('#store').find('option').remove().end().append(storesOption);
                $('#store').trigger('chosen:updated');
                $('.branchCount').html(stores.length);

                if(stores_list.length > 0){
                    $("#store").children("option").each(function(){
                        if($.inArray($(this).val(), stores_list) !== -1){
                            $(this).prop("selected",true);
                        }
                        else{
                            $(this).prop("selected",false);
                        }
                    });
                    $('#store').trigger('chosen:updated');
                }
                $('#store_count').html(stores.length);
            }
        });
    }
});

$(document).on('change', '#store', function(){
    area_all = [];
    stores_list = [];
    $.each($(this).val(), function(index, value){
        if(value.includes('-0')){
            area_all.push(value.substring(0, value.length - 2));
        }
        stores_list.push(value);
    });
    $('#area').change();
});


$(document).on('blur','#dine_in',function(){
    Swal.fire({
        title: 'Autofill other fields with same price?',
        width: 600,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showDenyButton: true,
        confirmButtonText: 'Autofill',
        denyButtonText: 'Manual',
        customClass: {
            actions: 'my-actions',
            confirmButton: 'order-2',
            denyButton: 'order-3',
        }
    }).then((save) => {
        if (save.isConfirmed) {
            var dine_in = parseFloat($(this).val());
            if(dine_in > 0){
                $('#take_out').val(dine_in);
                $('#pick_up').val(dine_in);
                $('#delivery').val(dine_in);
                $('#bulk_order').val(dine_in);
                $('#fds').val(dine_in);
                $('#drive_thru').val(dine_in);
                $('#meal_type').val(dine_in);

                $('#take_out').blur();
                $('#pick_up').blur();
                $('#delivery').blur();
                $('#bulk_order').blur();
                $('#fds').blur();
                $('#drive_thru').blur();
                $('#meal_type').blur();
            }
        }
    });

});

$(document).on('blur','#dine_in_airport',function(){
    Swal.fire({
        title: 'Autofill other fields with same price?',
        width: 600,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showDenyButton: true,
        confirmButtonText: 'Autofill',
        denyButtonText: 'Manual',
        customClass: {
            actions: 'my-actions',
            confirmButton: 'order-2',
        denyButton: 'order-3',
        }
    }).then((save) => {
        if (save.isConfirmed) {
            var dine_in_airport = parseFloat($(this).val());
            if(dine_in_airport > 0){
                $('#take_out_airport').val(dine_in_airport);
                $('#pick_up_airport').val(dine_in_airport);
                $('#delivery_airport').val(dine_in_airport);
                $('#bulk_order_airport').val(dine_in_airport);
                $('#fds_airport').val(dine_in_airport);
                $('#drive_thru_airport').val(dine_in_airport);
                $('#meal_type_airport').val(dine_in_airport);

                $('#take_out_airport').blur();
                $('#pick_up_airport').blur();
                $('#delivery_airport').blur();
                $('#bulk_order_airport').blur();
                $('#fds_airport').blur();
                $('#drive_thru_airport').blur();
                $('#meal_type_airport').blur();
            }
        }
    });
});

setInterval(() => {
    $('#area_chosen').css('width','100%');
    if($("#company").val().length != 0 && $("#type").val().length != 0 && $("#setup").val().length != 0 && $("#area").val().length != 0){
        $('.classStore').show();
    }
    else{
        $('.classStore').hide();
    }
}, 0);

$('#upload_image').on('click',function(){
    $('#product_image').click();
});