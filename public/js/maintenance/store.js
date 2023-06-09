$(document).ready(function(){
    $('#company_name').chosen();
    $('#store_area').chosen();
    $('#type').chosen();
    $('#setup').chosen();
    $('#group').chosen();
    $('#sub_group').chosen();
    $('#network').chosen();
    $('#serving_store').chosen();
    $('#model').chosen();

    $('#company_name_chosen').css('width','100%');
    $('#store_area_chosen').css('width','100%');
    $('#type_chosen').css('width','100%');
    $('#setup_chosen').css('width','100%');
    $('#group_chosen').css('width','100%');
    $('#sub_group_chosen').css('width','100%');
    $('#network_chosen').css('width','100%');
    $('#serving_store_chosen').css('width','100%');
    $('#model_chosen').css('width','100%');

});

$('.addBtn').on('click',function(){
    $('#company_name_chosen').addClass('requiredField requiredInput redBorder');
    $('#store_area_chosen').addClass('requiredField requiredInput redBorder');
    $('#type_chosen').addClass('requiredField requiredInput redBorder');
    $('#setup_chosen').addClass('requiredField requiredInput redBorder');
    $('#group_chosen').addClass('requiredField requiredInput redBorder');
    $('#sub_group_chosen').addClass('requiredField requiredInput redBorder');
    $('#network_chosen').addClass('requiredField requiredInput redBorder');

    $('#company_name').val('').trigger('chosen:updated');
    $('#store_area').val('').trigger('chosen:updated');
    $('#type').val('').trigger('chosen:updated');
    $('#setup').val('').trigger('chosen:updated');
    $('#group').val('').trigger('chosen:updated');
    $('#sub_group').val('').trigger('chosen:updated');
    $('#network').val('').trigger('chosen:updated');
    $('#serving_store').val('').trigger('chosen:updated');
    $('#model').val('').trigger('chosen:updated');

    $('.req').hide();
    $('.sub_group_div').hide();

    if(!current_permissions.includes('3')){
        $('#storeModal').find('input').prop('disabled', false);
        $('#storeModal').find('select').prop('disabled', false);
        $('#region').prop('disabled', true);
        $('.notUpdate').show();
    }
});

var table,contact_person_change;
$(document).ready(function(){
    if(current_location == '/store?type=coowned'){
        var targets = [5,7,9,10,11,12,13,14,16];
        var filter = 'coowned';
        $('#post_title').html(' - CO-OWNED');
    }
    else if(current_location == '/store?type=franchise'){
        var targets = [5,7,9,10,11,12,13,14,16];
        var filter = 'franchise';
        $('#post_title').html(' - FRANCHISE');
    }
    else if(current_location == '/store?setup=full_store'){
        var targets = [5,7,8,10,11,12,13,14,16];
        var filter = 'full_store';
        $('#post_title').html(' - FULL STORES');
    }
    else if(current_location == '/store?setup=drive_thru'){
        var targets = [5,7,8,10,11,12,13,14,16];
        var filter = 'drive_thru';
        $('#post_title').html(' - DRIVE THRU');
    }
    else if(current_location == '/store?setup=kiosks'){
        var targets = [5,7,8,10,11,12,13,14,16];
        var filter = 'kiosks';
        $('#post_title').html(' - KIOSKS');
    }
    else{
        var targets = [5,7,8,9,10,11,12,13,14,16];
    }

    table = $('table.storeTable').DataTable({
        scrollY:        "500px",
        scrollX:        true,
        scrollCollapse: true,
        fixedColumns:{
            left: 3,
        },
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Stores',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Stores",
            lengthMenu: "Show _MENU_ Stores",
            emptyTable: "NO DATA AVAILABLE",
        },
        processing: true,
        // serverSide: false,
        ajax: {
            url: 'store_data',
            data: {
                filter: filter
            },
        },
        order: [],
        columnDefs: [
            {
                "targets": targets,
                "visible": false,
                "searchable": true
            },
        ],
        columns: [
            { data: 'branch_code', name:'branch_code'},
            { data: 'branch_name', name:'branch_name'},
            { data: 'comp_name', name:'comp_name'},
            { data: 'store_area_name', name:'store_area_name'},
            {
                data: 'address_name', name:'address_name',
                "render" : function(data, type, row, meta){
                    return decodeHtml(row.address_name);
                }
            },
            { data: 'province_name', name:'province_name'},
            { data: 'city_name', name:'city_name'},
            { data: 'region_name', name:'region_name'},
            { data: 'type_name', name:'type_name'},
            { data: 'setup_name', name:'setup_name'},
            { data: 'group_name', name:'group_name'},
            { data: 'subgroup_name', name:'subgroup_name'},
            { data: 'network_setup_name', name:'network_setup_name'},
            { data: 'delivery_serving_store_name', name:'delivery_serving_store_name'},
            { data: 'tin', name:'tin'},
            {
                data: 'status',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return data;
                    }
                    if(current_permissions.includes('5')){
                        if(row.status == 'ACTIVE'){
                            return '<div style="width: 120px !important;"><center><label class="switch" style="zoom: 80%; margin-top: -5px; margin-bottom: -10px;"><input type="checkbox" class="togBtn" id="'+ meta.row +'" checked><div class="slider round"><span style="font-size: 110%;" class="on">ACTIVE</span><span style="font-size: 100%;" class="off">INACTIVE</span></div></label></center></div>';
                        }
                        if(row.status == 'INACTIVE'){
                            return '<div style="width: 120px !important;"><center><label class="switch" style="zoom: 80%; margin-top: -5px; margin-bottom: -10px;"><input type="checkbox" class="togBtn" id="'+ meta.row +'"><div class="slider round"><span style="font-size: 110%;" class="on">ACTIVE</span><span style="font-size: 100%;" class="off">INACTIVE</span></div></label></center></div>';
                        }
                    }
                    else{
                        if(row.status == 'ACTIVE'){
                            return `<div style="width: 120px !important;"><center class="text-success"><b>${row.status}</b></center></div>`;
                        }
                        if(row.status == 'INACTIVE'){
                            return `<div style="width: 120px !important;"><center class="text-danger"><b>${row.status}</b></center></div>`;
                        }
                    }
                }
            },
            { data: 'status', name:'status'},
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('#loading').hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/store_reload",
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
            for(var i=0; i<=16; i++){
                if(table.column(i).visible()){
                    $('#filter-'+i).prop('checked', true);
                }
                else{
                    $('#filter-'+i).prop('checked', false);
                }
            }
        }
        $('.form-control').on('click', function(e){
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
    if($(this).is(':checked')){
        var status_html = `<span style="zoom: 120%;">FROM: <b class="text-danger">INACTIVE</b><br>TO: <b class="text-success">ACTIVE</b><br></span>`;
    }
    else{
        var status_html = `<span style="zoom: 120%;">FROM: <b class="text-success">ACTIVE</b><br>TO: <b class="text-danger">INACTIVE</b><br></span>`;
    }
    Swal.fire({
        title: '',
        html: '<b style="zoom: 120%;">Are you sure you want to change the status?</b><br><br>'+status_html,
        width: 650,
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
                url: '/store_status',
                data:{
                    id: data.id,
                    name: data.comp_name+' - '+data.branch_name,
                    branch_code: data.branch_code,
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

$(document).on('change', '.tglStatus', function(){
    if($(this).is(':checked')){
        var status_html = `<span style="zoom: 120%;">FROM: <b class="text-danger">INACTIVE</b><br>TO: <b class="text-success">ACTIVE</b><br></span>`;
    }
    else{
        var status_html = `<span style="zoom: 120%;">FROM: <b class="text-success">ACTIVE</b><br>TO: <b class="text-danger">INACTIVE</b><br></span>`;
    }
    Swal.fire({
        title: '',
        html: '<b style="zoom: 120%;">Are you sure you want to change the status?</b><br><br>'+status_html,
        width: 650,
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
            var name = $(this).attr("tgl_name");
            var branch_code = $(this).attr("tgl_branch_code");
            if($(this).is(':checked')){
                var status = 'ACTIVE';
            }
            else{
                var status = 'INACTIVE';
            }
            $.ajax({
                url: '/store_status',
                data:{
                    id: id,
                    name: name,
                    branch_code: branch_code,
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

$('.saveBtn').on('click',function(){
    var branch_code = $('#branch_code').val();
    var company_name = $('#company_name').val();
    var tin = $('#tin').val();
    var branch_name = $('#branch_name').val();
    var store_area = $('#store_area').val();
    var address = $('#address').val();
    var province = $('#province :selected').text();
    var city = $('#city :selected').text();
    var region = $('#region').val();
    var type = $('#type').val();
    var setup = $('#setup').val();
    var group = $('#group').val();
    var sub_group = $('#sub_group').val();
    var network = $('#network').val();
    var serving_store = $('#serving_store').val();

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
            $.ajax({
                url:"/saveStore",
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    branch_code:branch_code,
                    company_name:company_name,
                    tin:tin,
                    branch_name:branch_name,
                    store_area:store_area,
                    address:address,
                    province:province,
                    city:city,
                    region:region,
                    type:type,
                    setup:setup,
                    group:group,
                    sub_group:sub_group,
                    network:network,
                    serving_store:serving_store
                },
                success:function(data){
                    if(data.result == 'true'){
                        var storeContactDetails_data  = $('#storeContactDetails').DataTable().rows().data();
                        $.each(storeContactDetails_data, function(key, value){
                            $.ajax({
                                type: 'POST',
                                url: '/saveStoreContactDetails',
                                async: false,
                                headers:{
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data:{
                                    store_id : data.id,
                                    contact_person : value[0],
                                    position : value[1],
                                    email : value[2],
                                    telephone: value[3],
                                    mobile: value[4]
                                },
                            });
                        });

                        var storePosInformation_data  = $('#storePosInformation').DataTable().rows().data();
                        $.each(storePosInformation_data, function(key, value){
                            $.ajax({
                                type: 'POST',
                                url: '/saveStorePosInformation',
                                async: false,
                                headers:{
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data:{
                                    store_id : data.id,
                                    model : value[0],
                                    serial : value[2],
                                    min: value[3],
                                    ptu: value[4],
                                    date_issued: value[5]
                                },
                            });
                        });
                        $('#loading').hide();
                        Swal.fire('SAVE SUCCESS','','success');
                        $('#storeModal').modal('hide');
                    }
                    else{
                        $('#loading').hide();
                        Swal.fire('SAVE FAILED','','error');
                    }
                }
            });
        }
        else if(save.isDenied){
            Swal.fire('SAVE CANCELED','','info');
        }
    });
});

$('.addStoreContactDetailsBtn').click(function(e){
    e.preventDefault();
    $('#storeContactDetails').show();
    $('.storeContactDetails').show();
    var contact_person = $('#contact_person').val();
    var position = $('#position').val();
    var email = $('#email').val();
    var telephone = $('#telephone').val();
    var mobile = $('#mobile').val();

    var storeDetailsTable =   "<tr class='storeContactDetails_tr'>"+
                                    "<td class='td_1 text-uppercase'>" + contact_person + "</td>" +
                                    "<td class='td_2 text-uppercase'>" + position + "</td>" +
                                    "<td class='td_3 text-lowercase'>" + email + "</td>" +
                                    "<td class='td_4'>" + telephone + "</td>" +
                                    "<td class='td_5'>" + mobile + "</td>" +
                                    "<td> <button class='btn btn-danger btn-delete btn_store_details' title='DELETE'> <i class='fas fa-trash-alt'></i> DELETE </button> </td>" +
                                "</tr>";
    if($('.updateBtn').is(":visible") || current_modal == 'UPDATE'){
        $('#storeContactDetails_tbody').append(storeDetailsTable);

        contact_person_change = 'CHANGED';
    }
    else{
        $('#storeContactDetails tbody').append(storeDetailsTable);
    }

    $('#contact_person').val("");
    $('#position').val("");
    $('#email').val("");
    $('#telephone').val("");
    $('#mobile').val("");

    $('.btn_store_details').click(function(){
        $(this).parent().parent().remove();
    });
});

$('.addPosInformationBtn').click(function(e){
    e.preventDefault();

    $('.storePosInformation_thead').show();

    var model_id = $('#model').val();
    var model = $('#model option:selected').text();
    var serial = $('#serial').val();
    var min = $('#min').val();
    var ptu = $('#ptu').val();
    var date_issued = $('#date_issued').val();

    if($('.updateBtn').is(":visible") || current_modal == 'UPDATE'){
        var posInformationTable = "<tr class='storePosInformation_tr'>"+
                                        "<td class='td_1 d-none'>" + model_id + "</td>" +
                                        "<td class='td_2'>" + model + "</td>" +
                                        "<td class='td_3 text-uppercase'>" + serial + "</td>" +
                                        "<td class='td_4'>" + min + "</td>" +
                                        "<td class='td_5'>" + ptu + "</td>" +
                                        "<td class='td_6'>" + date_issued + "</td>" +
                                        "<td> <button class='btn btn-danger btn-delete btndelPos' title='DELETE'> <i class='fas fa-trash-alt'></i> DELETE </button> </td>" +
                                        "<td>ACTIVE</td>" +
                                        "<td></td>" +
                                 "</tr>";
        $('.dataTables_empty').closest('tr').remove();
        $('#storePosInformation_tbody').append(posInformationTable);
        $('#storePosInformation_orig').show();
    }
    else{
        var posInformationTable = "<tr class='storePosInformation_tr'>"+
                                        "<td class='td_1 d-none'>" + model_id + "</td>" +
                                        "<td class='td_2'>" + model + "</td>" +
                                        "<td class='td_3 text-uppercase'>" + serial + "</td>" +
                                        "<td class='td_4'>" + min + "</td>" +
                                        "<td class='td_5'>" + ptu + "</td>" +
                                        "<td class='td_6'>" + date_issued + "</td>" +
                                        "<td> <button class='btn btn-danger btn-delete btn_pos_information center' title='DELETE'> <i class='fas fa-trash-alt'></i> DELETE </button> </td>" +
                                 "</tr>";
        $('#storePosInformation tbody').append(posInformationTable);
        $('#storePosInformation').show();
    }
    $('#model').val('').trigger('chosen:updated');
    $('#serial').val("");
    $('#min').val("");
    $('#ptu').val("");
    $('#date_issued').val("");

    $('.btn_pos_information').click(function(){
        $(this).parent().parent().remove();
    });
});

var contact_id = [];
var pos_id = [];
var branch_code_orig,
    branch_name_orig,
    tin_orig;
$(document).on('click','table.storeTable tbody tr td',function(){
    current_modal = 'UPDATE';
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#storeModal').find('input').prop('disabled', true);
        $('#storeModal').find('select').prop('disabled', true);
        $('#province').prop('disabled', true);
        setInterval(() => {
            if($('#province').prop('disabled') == true){
                $('#city').prop('disabled', true);
            }
            else{
                $('#city').prop('disabled', false);
            }
        }, 0);
        $('.notUpdate').hide();
    }
    if($(this).text() != 'ACTIVEINACTIVE'){
        $('#loading').show();
        contact_id = [];
        pos_id = [];
        if($(".btn-delete").length > 0){
            $('.btn-delete').each(function(){
                $(this).click();
            });
        }

        $('.validation').hide();
        $('.forminput').removeClass('redBorder');

        $('.saveBtn').hide();
        $('.updateBtn').show();

        var data = table.row(this).data();

        if(data.status == 'ACTIVE'){
            $('#status').html('<label class="switch"><input type="checkbox" class="tglStatus" id="'+ data.id +'" tgl_branch_code="'+data.branch_code+'" tgl_name="'+data.comp_name+' - '+data.branch_name+'" checked><div class="slider round"><span style="font-size: 110%;" class="on">ACTIVE</span><span style="font-size: 100%;" class="off">INACTIVE</span></div></label>');
        }
        if(data.status == 'INACTIVE'){
            $('#status').html('<label class="switch"><input type="checkbox" class="tglStatus" id="'+ data.id +'" tgl_branch_code="'+data.branch_code+'" tgl_name="'+data.comp_name+' - '+data.branch_name+'"><div class="slider round"><span style="font-size: 110%;" class="on">ACTIVE</span><span style="font-size: 100%;" class="off">INACTIVE</span></div></label>');
        }

        $('#store_id').val(data.id);
        $('#company_name').val(decodeHtml(data.company_name));
        $('#tin').val(data.tin);
        tin_orig = data.tin;
        $('#branch_code').val(data.branch_code);
        branch_code_orig = data.branch_code;
        $('#branch_name').val(data.branch_name);
        branch_name_orig = data.branch_name;
        $('#address').val(data.address_name);
        $('#store_area').val(data.store_area);

        $('.province').each(function(){
            if($(this).html() == data.province_name){
                $(this).prop('selected', true);
            }
        });
        setTimeout(() => {
            $('#province').change();
            setTimeout(() => {
                $('.city').each(function(){
                    if($(this).html() == data.city_name){
                        $(this).prop('selected', true);
                    }
                });
                setTimeout(() => {
                    $('#city').change();
                    $('#loading').hide();
                }, current_timeout);
            }, current_timeout);
        }, current_timeout);

        $('#region').val(data.region_name);
        $('#type').val(data.type);

        var setup_array = data.setup.split()[0].split(',');
        $("#setup").children("option").each(function(){
            if(setup_array.includes($(this).val().toString())){
                $(this).prop("selected",true);
            }
            else{
                $(this).prop("selected",false);
            }
        });

        var serving_store_array = data.serving_store.split()[0].split(',');
        $("#serving_store").children("option").each(function(){
            if(serving_store_array.includes($(this).val().toString())){
                $(this).prop("selected",true);
            }
            else{
                $(this).prop("selected",false);
            }
        });

        setTimeout(() => {
            $('#company_name').change();
            $('#store_area').change();
            $('#type').change();
            $('#setup').change();
            $('#group').change();
            $('#sub_group').change();
            $('#network').change();
            $('#serving_store').change();

            $('#company_name').trigger('chosen:updated');
            $('#store_area').trigger('chosen:updated');
            $('#type').trigger('chosen:updated');
            $('#setup').trigger('chosen:updated');
            $('#group').trigger('chosen:updated');
            $('#sub_group').trigger('chosen:updated');
            $('#network').trigger('chosen:updated');
            $('#serving_store').trigger('chosen:updated');

        }, current_timeout);

        $('#group').val(data.group);
        $('#sub_group').val(data.sub_group);
        $('#network').val(data.network);

        contact_person_change = '';

        if(current_permissions.includes('3')){
            $('table.storeContactDetails_orig').dataTable().fnDestroy();
            $('table.storeContactDetails_orig').DataTable({
                columnDefs: [
                    {
                        "render": function(data, type, row, meta){
                                return `<center><button type="button" title="EDIT" class="btn btn-success btneditContact" contact_id="${row.id}" contact_person="${row.contact_person}" position="${row.position}" email="${row.email}" telephone="${row.telephone}" mobile="${row.mobile}"><i class="fa-solid fa-pen-to-square"></i></button><button class="btn btn-danger btndelContact ml-2" title="DELETE" id="${meta.row}"><i class="fa-solid fa-trash-can"></i></button></center>`;
                        },
                        "defaultContent": '',
                        "data": null,
                        "targets": [5],
                    }
                ],
                searching: false,
                paging: false,
                ordering: false,
                info: false,
                autoWidth: false,
                language:{
                    emptyTable: "NO DATA AVAILABLE",
                    processing: "Loading...",
                },
                serverSide: true,
                ajax: {
                    url: '/store_contact_details/data',
                    async: false,
                    data:{
                        id: data.id,
                    }
                },
                columns: [
                    { data: 'contact_person', name:'contact_person'},
                    { data: 'position', name:'position'},
                    { data: 'email', name:'email'},
                    { data: 'telephone', name:'telephone'},
                    { data: 'mobile', name:'mobile'},
                    { data: 'contact_person', name:'contact_person'}
                ]
            });

            $('table.storePosInformation_orig').dataTable().fnDestroy();
            $('table.storePosInformation_orig').DataTable({
                columnDefs: [
                    {
                        "targets": [0,1,2],
                        "visible": false,
                        "searchable": false
                    },
                    {
                        "render": function(data, type, row, meta){
                                return `<center><button type="button" title="EDIT" class="btn btn-success btneditPos" pos_id="${row.id}"  store_id="${row.store_id}"  model_id="${row.model}" serial="${row.serial}" min="${row.min}" ptu="${row.ptu}" date_issued="${row.date_issued}" status="${row.status}" remarks="${row.remarks}"><i class="fa-solid fa-pen-to-square"></i></button></center>`;
                        },
                        "defaultContent": '',
                        "data": null,
                        "targets": [8]
                    }
                ],
                searching: false,
                paging: false,
                ordering: false,
                info: false,
                autoWidth: false,
                language:{
                    emptyTable: "NO DATA AVAILABLE",
                    processing: "Loading...",
                },
                serverSide: true,
                ajax: {
                    url: '/store_pos_information/data',
                    async: false,
                    data:{
                        id: data.id,
                    }
                },
                columns: [
                    { data: 'id', name:'id'},
                    { data: 'store_id', name:'store_id'},
                    { data: 'model', name:'model'},
                    { data: 'model_name', name:'model_name'},
                    { data: 'serial', name:'serial'},
                    { data: 'min', name:'min'},
                    { data: 'ptu', name:'ptu'},
                    { data: 'date_issued', name:'date_issued'},
                    { data: 'id', name:'id'},
                    { data: 'status', name:'status'},
                    { data: 'remarks', name:'remarks'}
                ],
            });
        }
        else{
            $('table.storeContactDetails_orig').dataTable().fnDestroy();
            $('table.storeContactDetails_orig').DataTable({
                columnDefs: [
                    {
                        "targets": [5],
                        "visible": false,
                        "searchable": false
                    }
                ],
                searching: false,
                paging: false,
                ordering: false,
                info: false,
                autoWidth: false,
                language:{
                    emptyTable: "NO DATA AVAILABLE",
                    processing: "Loading...",
                },
                serverSide: true,
                ajax: {
                    url: '/store_contact_details/data',
                    async: false,
                    data:{
                        id: data.id,
                    }
                },
                columns: [
                    { data: 'contact_person', name:'contact_person'},
                    { data: 'position', name:'position'},
                    { data: 'email', name:'email'},
                    { data: 'telephone', name:'telephone'},
                    { data: 'mobile', name:'mobile'},
                    { data: 'contact_person', name:'contact_person'}
                ]
            });

            $('table.storePosInformation_orig').dataTable().fnDestroy();
            $('table.storePosInformation_orig').DataTable({
                columnDefs: [
                    {
                        "targets": [0,1,2],
                        "visible": false,
                        "searchable": false
                    },
                    {
                        "targets": [8],
                        "visible": false,
                        "searchable": false
                    }
                ],
                searching: false,
                paging: false,
                ordering: false,
                info: false,
                autoWidth: false,
                language:{
                    emptyTable: "NO DATA AVAILABLE",
                    processing: "Loading...",
                },
                serverSide: true,
                ajax: {
                    url: '/store_pos_information/data',
                    async: false,
                    data:{
                        id: data.id,
                    }
                },
                columns: [
                    { data: 'id', name:'id'},
                    { data: 'store_id', name:'store_id'},
                    { data: 'model', name:'model'},
                    { data: 'model_name', name:'model_name'},
                    { data: 'serial', name:'serial'},
                    { data: 'min', name:'min'},
                    { data: 'ptu', name:'ptu'},
                    { data: 'date_issued', name:'date_issued'},
                    { data: 'id', name:'id'},
                    { data: 'status', name:'status'},
                    { data: 'remarks', name:'remarks'}
                ],
            });
        }
        $('#storeModal').modal('show');
        $('th').removeClass('sorting_asc');
    }
});

var store_id_orig;
var pos_id_orig;
var model_id_orig;
var serial_orig;
var min_orig;
var ptu_orig;
var date_issued_orig;
var status_orig;
var remarks_orig;

$(document).on('click', '.btneditPos',function(){
    $('.req').hide();
    store_id_orig = $(this).attr('store_id');
    pos_id_orig = $(this).attr('pos_id');
    model_id_orig = $(this).attr('model_id');
    serial_orig = $(this).attr('serial');
    min_orig = $(this).attr('min');
    ptu_orig = $(this).attr('ptu');
    date_issued_orig = $(this).attr('date_issued');
    status_orig = $(this).attr('status');
    remarks_orig = $(this).attr('remarks');
    $('#posStore_id').val(store_id_orig);
    $('#posPos_id').val(pos_id_orig);
    $('#posModel').val(model_id_orig);
    $('#posSerial').val(serial_orig);
    $('#posMin').val(min_orig);
    $('#posPtu').val(ptu_orig);
    $('#posDateIssued').val(date_issued_orig);
    $('#posStatus').val(status_orig);
    $('#posRemarks').val(remarks_orig);

    $('#editPosModal').modal('show');
});

setInterval(() => {
    if($('#editContactModal').is(':visible')){
        if(
            $('#contact_person_edit').val() == contact_person_orig &&
            $('#position_edit').val() == position_orig &&
            $('#email_edit').val() == email_orig &&
            $('#telephone_edit').val() == telephone_orig &&
            $('#mobile_edit').val() == mobile_orig
        ){
            $('.changesNote1').show();
        }
        else{
            $('.changesNote1').hide();
        }
    }
    if($('#editPosModal').is(':visible')){
        if($('#posStatus').val() == 'TRANSFERRED'){
            $('.divPosRemarks').show();
        }
        else{
            $('.divPosRemarks').hide();
            $('#posRemarks').val('');
        }
        if(
            $('#posStore_id').val() == store_id_orig &&
            $('#posPos_id').val() == pos_id_orig &&
            $('#posModel').val() == model_id_orig &&
            $('#posSerial').val() == serial_orig &&
            $('#posMin').val() == min_orig &&
            $('#posPtu').val() == ptu_orig &&
            ($('#posDateIssued').val() == date_issued_orig || (!$('#posDateIssued').val() && date_issued_orig == 'YYYY-MM-DD')) &&
            $('#posStatus').val() == status_orig &&
            $('#posRemarks').val() == remarks_orig
        ){
            $('.changesNote2').show();
        }
        else{
            $('.changesNote2').hide();
        }
    }
}, 0);

$('#btnUpdateContact').on('click',function(){
    var contact = $('#contact_id').val();
    var contact_person = $('#contact_person_edit').val();
    var position = $('#position_edit').val();
    var email = $('#email_edit').val();
    var telephone = $('#telephone_edit').val();
    var mobile = $('#mobile_edit').val();

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
    }).then((edit) => {
        if (edit.isConfirmed) {
            $('#loading').show();
            $.ajax({
                type: 'POST',
                url: '/editStoreContactDetails',
                async: false,
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    contact_id: contact,
                    contact_person_orig: contact_person_orig,
                    position_orig: position_orig,
                    email_orig: email_orig,
                    telephone_orig: telephone_orig,
                    mobile_orig: mobile_orig,
                    contact_person: contact_person,
                    position: position,
                    email: email,
                    telephone: telephone,
                    mobile: mobile
                },
                success:function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        Swal.fire('UPDATE SUCCESS','','success');
                        $('table.storeContactDetails_orig').DataTable().ajax.reload();
                        $('#editContactModal').modal('hide');
                    }
                    else{
                        $('#loading').hide();
                        Swal.fire('UPDATE FAILED','','error');
                    }
                }
            });
        }
    })
});

$('#btnUpdatePosModel').on('click',function(){
    var store_id = $('#posStore_id').val();
    var pos_id = $('#posPos_id').val();
    var model_id = $('#posModel').val();
    var serial = $('#posSerial').val();
    var min = $('#posMin').val();
    var ptu = $('#posPtu').val();
    var date_issued = $('#posDateIssued').val();
    var status = $('#posStatus').val();
    var remarks = $('#posRemarks').val();
    var pos_warning = pos_info_added == 'true' ? '<b class="text-danger">WARNING: Currently addeed POS will be DELETED upon update!</b>' : '';

    Swal.fire({
        title: 'Do you want to update?',
        html: pos_warning,
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
    }).then((edit) => {
        if (edit.isConfirmed) {
            $('#loading').show();
            $.ajax({
                type: 'POST',
                url: '/editStorePosInformation',
                async: false,
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    store_id: store_id,
                    pos_id: pos_id,
                    model_id: model_id,
                    serial: serial,
                    min: min,
                    ptu: ptu,
                    date_issued: date_issued,
                    status: status,
                    remarks: remarks,
                    store_id_orig: store_id_orig,
                    pos_id_orig: pos_id_orig,
                    model_id_orig: model_id_orig,
                    serial_orig: serial_orig,
                    min_orig: min_orig,
                    ptu_orig: ptu_orig,
                    date_issued_orig: date_issued_orig,
                    status_orig: status_orig,
                    remarks_orig: remarks_orig
                },
                success:function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        Swal.fire('UPDATE SUCCESS','','success');
                        $('table.storePosInformation_orig').DataTable().ajax.reload();
                        $('#editPosModal').modal('hide');
                    }
                    else{
                        $('#loading').hide();
                        Swal.fire('UPDATE FAILED','','error');
                    }
                }
            });
        }
    })
});

var pos_info_added;
setInterval(() => {
    if($(".storePosInformation_tr:visible").length > 0){
        pos_info_added = 'true';
    }
    else{
        pos_info_added = 'false';
    }
}, 0);

$('.updateBtn').on('click',function(){
    var id = $('#store_id').val();
    var company_name = $('#company_name').val();
    var tin = $('#tin').val();
    var branch_code = $('#branch_code').val();
    var branch_name = $('#branch_name').val();
    var address = $('#address').val();
    var store_area = $('#store_area').val();
    var province = $('#province :selected').text();
    var city = $('#city :selected').text();
    var region = $('#region').val();
    var type = $('#type').val();
    var setup = $('#setup').val();
    var group = $('#group').val();
    var sub_group = group != '1' ? '0' : $('#sub_group').val();
    var network = $('#network').val();
    var serving_store = $('#serving_store').val();

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
    }).then((edit) => {
        if (edit.isConfirmed) {
            $('#loading').show();
            $.ajax({
                url:"/editStore",
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    id:id,
                    company_name:company_name,
                    tin:tin,
                    branch_code:branch_code,
                    branch_name:branch_name,
                    address:address,
                    store_area:store_area,
                    province:province,
                    city:city,
                    region:region,
                    type:type,
                    setup:setup,
                    group:group,
                    sub_group:sub_group,
                    network:network,
                    serving_store:serving_store,
                    contact_person_change:contact_person_change
                },
                success:function(data){
                    if(data.result == 'true'){
                        $('.storeContactDetails_tr').each(function(){
                            $.ajax({
                                type: 'POST',
                                url: '/saveStoreContactDetails',
                                async: false,
                                headers:{
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data:{
                                    store_id : id,
                                    contact_person : $(this).children('.td_1').html(),
                                    position : $(this).children('.td_2').html(),
                                    email :  $(this).children('.td_3').html(),
                                    telephone:  $(this).children('.td_4').html(),
                                    mobile:  $(this).children('.td_5').html()
                                },
                            });
                        });

                        $('.storePosInformation_tr').each(function(){
                            $.ajax({
                                type: 'POST',
                                url: '/saveStorePosInformation',
                                async: false,
                                headers:{
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data:{
                                    store_id : id,
                                    model : $(this).children('.td_1').html(),
                                    serial :  $(this).children('.td_3').html(),
                                    min:  $(this).children('.td_4').html(),
                                    ptu:  $(this).children('.td_5').html(),
                                    date_issued:  $(this).children('.td_6').html()
                                },
                            });
                        });

                        $.ajax({
                            type: 'POST',
                            url: '/StoreContactDetails/delete',
                            headers:{
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            data:{
                                id: contact_id.toString()
                            }
                        });
                        $.ajax({
                            type: 'POST',
                            url: '/StorePosInformation/delete',
                            headers:{
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            data:{
                                id: pos_id.toString()
                            }
                        });
                        $('#loading').hide();
                        Swal.fire('UPDATE SUCCESS','','success');
                        $('#storeModal').modal('hide');
                    }
                    else{
                        $('#loading').hide();
                        Swal.fire('UPDATE FAILED','','error');
                    }
                }
            });
        }
        else if(edit.isDenied){
            Swal.fire('UPDATE CANCELLED','','info');
        }
    });
});

var contact_person_orig;
var position_orig;
var email_orig;
var telephone_orig;
var mobile_orig;

$(document).on('click', '.btneditContact', function(e){
    e.preventDefault();
    $('.req').hide();
    contact_person_orig = $(this).attr('contact_person');
    position_orig = $(this).attr('position');
    email_orig = $(this).attr('email');
    telephone_orig = $(this).attr('telephone');
    mobile_orig = $(this).attr('mobile');
    $('#contact_id').val($(this).attr('contact_id'));
    $('#contact_person_edit').val(contact_person_orig);
    $('#position_edit').val(position_orig);
    $('#email_edit').val(email_orig);
    $('#telephone_edit').val(telephone_orig);
    $('#mobile_edit').val(mobile_orig);

    $('#editContactModal').modal('show');
});

$(document).on('click', '.btndelContact', function(e){
    e.preventDefault();
    var id = $(this).attr("id");
    var data = $('table.storeContactDetails_orig').DataTable().row(id).data();
    contact_id.push(data.id);
    $(this).parent().parent().parent().remove();
    contact_person_change = 'CHANGED';
});

$(document).on('click', '.btndelPos', function(e){
    e.preventDefault();
    if($(this).attr("id")){
        var id = $(this).attr("id");
        var data = $('table.storePosInformation_orig').DataTable().row(id).data();
        pos_id.push(data.id);
    }
    $(this).parent().parent().remove();

    if($('#storePosInformation_orig tbody').children().length > 0){
        $('#storePosInformation_orig').show();
    }
    else{
        $('#storePosInformation_orig').hide();
    }

});

setInterval(() => {
    if(!$('#contact_person').val() || !$('#position').val() || !$('#email').val() || !$('#mobile').val() || $(".validation:visible").length > 0){
        $('.addStoreContactDetailsBtn').prop('disabled',true);
    }
    else{
        $('.addStoreContactDetailsBtn').prop('disabled',false);
    }

    if(!$('#model').val() || !$('#serial').val() || !$('#min').val() || $(".validation:visible").length > 0){
        $('.addPosInformationBtn').prop('disabled',true);
    }
    else{
        $('.addPosInformationBtn').prop('disabled',false);
    }

    if($('.saveBtn').is(":visible") || current_modal == 'SAVE'){
        $('#storeContactDetails_orig_div').hide();
        $('#storePosInformation_orig_div').hide();
        if($('#storeContactDetails tbody').children().length > 0){
            $('#storeContactDetails').show();
        }
        else{
            $('#storeContactDetails').hide();
        }

        if($('#storePosInformation tbody').children().length > 0){
            $('#storePosInformation_div').show();
        }
        else{
            $('#storePosInformation_div').hide();
        }

        if($(".requiredInput:visible").length == 0){
            $('#storeRequired').hide();
        }
        else{
            $('#storeRequired').show();
        }

        if($('#storeContactDetails tbody').children().length > 0){
            $('#storeContactDetails_div').show();
        }
        else{
            $('#storeContactDetails_div').hide();
        }
    }

    if($('.updateBtn').is(":visible") || current_modal == 'UPDATE'){
        $('#storeContactDetails_div').hide();
        $('#storePosInformation_div').hide();
        if($('#storeContactDetails_orig tbody').children().length > 0){
            $('#storeContactDetails_orig').show();
        }
        else{
            $('#storeContactDetails_orig').hide();
        }

        if($('#storePosInformation_tbody').children().length > 0){
            $('#storePosInformation_orig_div').show();
            $('#storePosInformation_orig').show();
        }
        else{
            $('#storePosInformation_orig_div').hide();
            $('#storePosInformation_orig').hide();
        }

        if($(".requiredInput:visible").length == 0){
            $('#storeRequired').hide();
        }
        else{
            $('#storeRequired').show();
        }

        if($('#storeContactDetails_orig tbody').children().length > 0){
            $('#storeContactDetails_orig_div').show();
        }
        else{
            $('#storeContactDetails_orig_div').hide();
        }
    }
}, 0);

$('#branch_code').on('keyup',function(){
    if(branch_code_orig != $.trim($('#branch_code').val()).toUpperCase()){
        $.ajax({
            url: "/branch_code/checkDuplicate",
            data:{
                branch_code : $.trim($('#branch_code').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'duplicate_branch_code'){
                    $('#duplicate_branch_code').show();
                    $('#branch_code').addClass('redBorder');
                }
                else{
                    $('#duplicate_branch_code').hide();
                    $('#branch_code').removeClass('redBorder');
                }
            }
        });
    }
});

$('#tin').on('keyup',function(){
    if(tin_orig != $.trim($('#tin').val()).toUpperCase()){
        $.ajax({
            url: "/tin/checkDuplicate",
            data:{
                tin : $.trim($('#tin').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'duplicate_tin'){
                    $('#duplicate_tin').show();
                    $('#tin').addClass('redBorder');
                }
                else{
                    $('#duplicate_tin').hide();
                    $('#tin').removeClass('redBorder');
                }
            }
        });
    }
});

$('#branch_name').on('keyup',function(){
    if(branch_name_orig != $.trim($('#branch_name').val()).toUpperCase()){
        $.ajax({
            url: "/branch_name/checkDuplicate",
            data:{
                branch_name : $.trim($('#branch_name').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'duplicate_branch_name'){
                    $('#duplicate_branch_name').show();
                    $('#branch_name').addClass('redBorder');
                }
                else{
                    $('#duplicate_branch_name').hide();
                    $('#branch_name').removeClass('redBorder');
                }
            }
        });
    }
});

$('#btnUpload').on('click', function(){
    if($('#xlsx')[0].files.length === 0){
        $('#btnSubmit').click();
    }
    else{
        Swal.fire({
            title: "UPLOAD FILE IMPORT?",
            html: "Click <b style='color: #d33;'>CONFIRM</b> button to ADD STORE via uploading import file; otherwise, click <b style='color: #3085d6;'>CANCEL</b> button to select a different file.",
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

$(document).ready(function(){
    if(current_location == '/store?import=success_without_errors'){
        $('#loading').hide();
        Swal.fire("IMPORT SUCCESS", "ADD STORE via import file is successful without errors.", "success");
    }
    else if(current_location == '/store?import=success_with_errors'){
        $('#loading').hide();
        Swal.fire("IMPORT SUCCESS W/ ERRORS", "ADD STORE via import file is successful with some errors.", "warning");
    }
    else if(current_location == '/store?import=failed'){
        $('#loading').hide();
        Swal.fire("IMPORT FAILED", "ADD STORE via import file has failed.", "error");
    }
});

// $('#addStoreBtn').on('click', function(){
//     $('#setup').chosen();
//     $('#setup_chosen').css('width','100%');
//     $('#setup_chosen').addClass('requiredField requiredInput redBorder');

//     $('#company_name').chosen();
//     $('#company_name_chosen').css('width','100%');
//     $('#company_name_chosen').addClass('requiredField requiredInput redBorder');

//     $('#serving_store').chosen();
//     $('#serving_store_chosen').css('width','100%');

//     $('#company_name').val('').trigger('chosen:updated');
//     $('#serving_store').val('').trigger('chosen:updated');
//     $('#setup').val('').trigger('chosen:updated');

//     $('.req').hide();
// });

setInterval(() => {
    if($('#group').val()){
        if($('#group option:selected').text() == 'MALL'){
            $('.sub_group_div').show();
        }
        else{
            $('#sub_group').val('').trigger('chosen:updated');
            $('.sub_group_div').hide();
        }
    }
}, 0);

