$('.addBtn').on('click',function(){
    if(!current_permissions.includes('3')){
        $('#companyModal').find('input').prop('disabled', false);
        $('#companyModal').find('select').prop('disabled', false);
        $('#region').prop('disabled', true);
        $('.notUpdate').show();
    }
});

var table, contact_person_change;
$(document).ready(function(){
    table = $('table.companyTable').DataTable({
        scrollY:        "500px",
        scrollX:        true,
        scrollCollapse: true,
        fixedColumns:{
            left: 2,
        },
        dom: 'Blftrip',
        buttons: [
            {
                extend: 'excelHtml5',
                title: 'Export - Companies',
                exportOptions:{
                    modifier: {
                        search: 'applied'
                    },
                },
                className: 'export-button-companies'
            },
            {
                extend: 'excelHtml5',
                title: 'Export - All',
                exportOptions:{
                    modifier:{
                        search: 'none',
                        page: 'all'
                    }
                },
                className: 'export-button-all'
            }
        ],
        aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
        language: {
            info: "Showing _START_ to _END_ of _TOTAL_ Companies",
            lengthMenu: "Show _MENU_ Companies",
            emptyTable: "NO DATA AVAILABLE",
        },
        processing: true,
        serverSide: false,
        order: [],
        ajax: {
            "url": 'company_data'
        },
        columnDefs: [
            {
                "targets": [3,5,7,9],
                "visible": false,
                "searchable": true
            },
        ],
        columns: [
            { data: 'company_code', name:'company_code'},
            { data: 'company_name', name:'company_name'},
            { data: 'trade_name', name:'trade_name'},
            { data: 'tax', name:'tax'},
            { data: 'address', name:'address'},
            { data: 'province', name:'province'},
            { data: 'city', name:'city'},
            { data: 'region', name:'region'},
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
            loading_hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/company_reload",
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
            for(var i=0; i<=8; i++){
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
                url: '/company_status',
                data:{
                    id: data.id,
                    company_name: data.company_name,
                    company_code: data.company_code,
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
    var company_name = $('#company_name').val();
    var company_code = $('#company_code').val();
    var trade_name = $('#trade_name').val();
    var tax = $('#tax').val();
    var address = $('#address').val();
    var province = $('#province :selected').text();
    var city = $('#city :selected').text();
    var region = $('#region').val();

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
            loading_show();
            $.ajax({
                url:"/saveCompany",
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    company_name:company_name,
                    company_code:company_code,
                    trade_name:trade_name,
                    address:address,
                    tax:tax,
                    province:province,
                    city:city,
                    region:region
                },
                success:function(data){
                    if(data.result == 'true'){
                        var companyContactPerson_data  = $('#companyContactPerson').DataTable().rows().data();
                        $.each(companyContactPerson_data, function(key, value){
                            $.ajax({
                                type: 'POST',
                                url: '/saveCompanyContactPerson',
                                async: false,
                                headers:{
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data:{
                                    company_id : data.id,
                                    person : value[0],
                                    position : value[1],
                                    email_address: value[2],
                                    telephone: value[3],
                                    mobile: value[4]
                                },
                            });
                        });
                        loading_hide();
                        Swal.fire('SAVE SUCCESS','','success');
                        $('#companyModal').modal('hide');
                    }
                    else{
                        loading_hide();
                        Swal.fire('SAVE FAILED','','error');
                    }
                }
            });
        }
        else if(save.isDenied){
            Swal.fire('SAVE CANCELED','','success');
        }
    });
});

$('.addCompanyContactPersonBtn').click(function(e){
    e.preventDefault();
    $('#companyContactPerson').show();
    $('.companyContactPerson').show();
    var person = $('#person').val();
    var position = $('#position').val();
    var email_address = $('#email_address').val();
    var telephone = $('#telephone').val();
    var mobile = $('#mobile').val();

    var companyContactPersonTable = "<tr class='companyContactPerson_tr'>"+
                                            "<td class='td_1 text-uppercase'>" + person + "</td>" +
                                            "<td class='td_2'>" + position + "</td>" +
                                            "<td class='td_3'>" + email_address + "</td>" +
                                            "<td class='td_4'>" + telephone + "</td>" +
                                            "<td class='td_5'>" + mobile + "</td>" +
                                            "<td> <button class='btn btn-danger btn-delete btn_company_contact_person center' title='DELETE'> <i class='fas fa-trash-alt'></i> DELETE </button> </td>" +
                                    "</tr>";
    if($('.updateBtn').is(":visible") || current_modal == 'UPDATE'){
        $('#companyContactPerson_tbody').append(companyContactPersonTable);
        contact_person_change = 'CHANGED';
    }
    else{
        $('#companyContactPerson tbody').append(companyContactPersonTable);
    }

    $('#person').val("");
    $('#position').val("");
    $('#email_address').val("");
    $('#telephone').val("");
    $('#mobile').val("");

    $('.btn_company_contact_person').click(function(){
        $(this).parent().parent().remove();
    });
});

var company_id = [];
var company_code_orig, company_name_orig;
$(document).on('click','table.companyTable tbody tr td',function(){
    if(!$(this).text().includes('ACTIVEINACTIVE')){
        current_modal = 'UPDATE';
        $('.req').hide();
        if(!current_permissions.includes('3')){
            $('#companyModal').find('input').prop('disabled', true);
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
        company_id = [];
        if($(".btn-delete").length > 0){
            $('.btn-delete').each(function(){
                $(this).click();
            });
        }

        $('.saveBtn').hide();
        $('.updateBtn').show();

        var data = table.row(this).data();
        $('#company_id').val(data.id);
        $('#company_name').val(decodeHtml(data.company_name));
        company_name_orig = data.company_name;
        $('#company_code').val(data.company_code);
        company_code_orig = data.company_code;
        $('#trade_name').val(data.trade_name);
        $('#address').val(data.address);
        $('#tax').val(data.tax);
        $('.province').each(function(){
            if($(this).html() == data.province){
                $(this).prop('selected', true);
            }
        });
        setTimeout(() => {
            $('#province').change();
            setTimeout(() => {
                $('.city').each(function(){
                    if($(this).html() == data.city){
                        $(this).prop('selected', true);
                    }
                });
                setTimeout(() => {
                    $('#city').change();
                }, current_timeout);
            }, current_timeout);
        }, current_timeout);

        contact_person_change = '';

        if(current_permissions.includes('3')){
            $('table.companyContactPerson_orig').dataTable().fnDestroy();
            $('table.companyContactPerson_orig').DataTable({
                columnDefs: [
                    {
                        "render": function(data, type, row, meta){
                                return '<button class="btn btn-danger btndelItem" id="'+ meta.row +'"><i class="fa-solid fa-trash-can"></i> DELETE </button>';
                        },
                        "defaultContent": '',
                        "data": null,
                        "targets": [5]
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
                    url: '/company_contact_person/data',
                    async: false,
                    data:{
                        id: data.id,
                    }
                },
                columns: [
                    { data: 'person', name:'person'},
                    { data: 'position', name:'position'},
                    { data: 'email_address', name:'email_address'},
                    { data: 'telephone', name:'telephone'},
                    { data: 'mobile', name:'mobile'},
                    { data: 'person', name:'person'},
                ]
            });
        }
        else{
            $('table.companyContactPerson_orig').dataTable().fnDestroy();
            $('table.companyContactPerson_orig').DataTable({
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
                    url: '/company_contact_person/data',
                    async: false,
                    data:{
                        id: data.id,
                    }
                },
                columns: [
                    { data: 'person', name:'person'},
                    { data: 'position', name:'position'},
                    { data: 'email_address', name:'email_address'},
                    { data: 'telephone', name:'telephone'},
                    { data: 'mobile', name:'mobile'},
                    { data: 'person', name:'person'}
                ]
            });
        }
        $('#companyModal').modal('show');
        $('th').removeClass('sorting_asc');
    }
});

$('.updateBtn').on('click',function(){
    var id = $('#company_id').val();
    var company_name = $('#company_name').val();
    var company_code = $('#company_code').val();
    var trade_name = $('#trade_name').val();
    var address = $('#address').val();
    var tax = $('#tax').val();
    var province = $('#province :selected').text();
    var city = $('#city :selected').text();
    var region = $('#region').val();

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
            loading_show();
            $.ajax({
                url:"/editCompany",
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    id:id,
                    company_name:company_name,
                    company_code:company_code,
                    trade_name:trade_name,
                    address:address,
                    tax:tax,
                    province:province,
                    city:city,
                    region:region,
                    contact_person_change:contact_person_change
                },
                success:function(data){
                    if(data.result == 'true'){
                        $('.companyContactPerson_tr').each(function(){
                            $.ajax({
                                type: 'POST',
                                url: '/saveCompanyContactPerson',
                                async: false,
                                headers:{
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data:{
                                    company_id : id,
                                    person : $(this).children('.td_1').html(),
                                    position :  $(this).children('.td_2').html(),
                                    email_address:  $(this).children('.td_3').html(),
                                    telephone:  $(this).children('.td_4').html(),
                                    mobile:  $(this).children('.td_5').html()
                                },
                            });
                        });

                        $.ajax({
                            type: 'POST',
                            url: '/company_contact_person/delete',
                            headers:{
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            data:{
                                id: company_id.toString()
                            }
                        });
                        loading_hide();
                        Swal.fire('UPDATE SUCCESS','','success');
                        $('#companyModal').modal('hide');
                    }
                    else{
                        loading_hide();
                        Swal.fire('UPDATE FAILED','','error');
                    }
                }
            });
        }
        else if(edit.isDenied){
            Swal.fire('UPDATE CANCELED','','info');
        }
    });
});

$(document).on('click', '.btndelItem', function(e){
    e.preventDefault();
    var id = $(this).attr("id");
    var data = $('table.companyContactPerson_orig').DataTable().row(id).data();
    company_id.push(data.id);
    $(this).parent().parent().remove();
    contact_person_change = 'CHANGED';
    // if($('#companyContactPerson_orig tbody').children().length == 0){
    //     contact_person_change = 'DELETED';
    // }
});

setInterval(() => {
    if(!$('#person').val() || !$('#position').val() || !$('#email_address').val() || !$('#mobile').val() || $(".validation:visible").length > 0){
        $('.addCompanyContactPersonBtn').prop('disabled',true);
    }
    else{
        $('.addCompanyContactPersonBtn').prop('disabled',false);
    }

    if($('.updateBtn').is(":visible") && $('#companyContactPerson_orig tbody').children().length != 0){
        $('#companyContactPerson_orig').show();
    }
    else{
        $('#companyContactPerson_orig').hide();
    }

    if($('.saveBtn').is(":visible") || current_modal == 'SAVE'){
        $('#company_orig_div').hide();
        if($('#companyContactPerson tbody').children().length > 0){
            $('#companyContactPerson').show();
            $('#person').removeClass('requiredField requiredInput redBorder');
            $('#position').removeClass('requiredField requiredInput redBorder');
            $('#email_address').removeClass('requiredField requiredInput redBorder');
            $('#mobile').removeClass('requiredField requiredInput redBorder');
        }
        else{
            $('#companyContactPerson').hide();
            $('#person').addClass('requiredField');
            $('#position').addClass('requiredField');
            $('#email_address').addClass('requiredField');
            $('#mobile').addClass('requiredField');
        }

        if($('#companyContactPerson tbody').children().length > 0 && $(".requiredInput:visible").length == 0){
            $('#companyRequired').hide();
        }
        else{
            $('#companyRequired').show();
        }

        if($('#companyContactPerson tbody').children().length > 0){
            $('#company_div').show();
        }
        else{
            $('#company_div').hide();
        }
    }
    else{
        $('#companyContactPerson_orig').show();
    }

    if($('.updateBtn').is(":visible") || current_modal == 'UPDATE'){
        $('#company_div').hide();
        if($('#companyContactPerson_orig tbody').children().length > 0){
            $('#companyContactPerson_orig').show();
            $('#person').removeClass('requiredField requiredInput redBorder');
            $('#position').removeClass('requiredField requiredInput redBorder');
            $('#email_address').removeClass('requiredField requiredInput redBorder');
            // $('#telephone').removeClass('required_field redBorder');
            $('#mobile').removeClass('requiredField requiredInput redBorder');
        }
        else{
            $('#companyContactPerson_orig').hide();
            $('#person').addClass('requiredField');
            $('#position').addClass('requiredField');
            $('#email_address').addClass('requiredField');
            // $('#telephone').addClass('required_field');
            $('#mobile').addClass('requiredField');
        }

        if($('#companyContactPerson_orig tbody').children().length > 0 && $(".requiredInput:visible").length == 0){
            $('#companyRequired').hide();
        }
        else{
            $('#companyRequired').show();
        }

        if($('#companyContactPerson_orig tbody').children().length > 0){
            $('#company_orig_div').show();
        }
        else{
            $('#company_orig_div').hide();
        }
    }
}, 0);

$('#company_code').on('keyup',function(){
    if(company_code_orig!= $.trim($('#company_code').val()).toUpperCase()){
        $.ajax({
            url: "/company_code/checkDuplicate",
            data:{
                company_code : $.trim($('#company_code').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'duplicate_company_code'){
                    $('#duplicate_company_code').show();
                    $('#company_code').addClass('redBorder');
                }
                else{
                    $('#duplicate_company_code').hide();
                    $('#company_code').removeClass('redBorder');
                }
            }
        });
    }
});

$('#company_name').on('keyup',function(){
    if(company_name_orig != $.trim($('#company_name').val()).toUpperCase()){
        $.ajax({
            url: "/company_name/checkDuplicate",
            data:{
                company_name : $.trim($('#company_name').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'duplicate_company_name'){
                    $('#duplicate_company_name').show();
                    $('#company_name').addClass('redBorder');
                }
                else{
                    $('#duplicate_company_name').hide();
                    $('#company_name').removeClass('redBorder');
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
            html: "Click <b style='color: #d33;'>CONFIRM</b> button to ADD COMPANY via uploading import file; otherwise, click <b style='color: #3085d6;'>CANCEL</b> button to select a different file.",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Confirm',
            allowOutsideClick: false
        })
        .then((result) => {
            if(result.isConfirmed){
                loading_show();
                $('#btnSubmit').click();
            }
        });
    }
});

$(document).ready(function(){
    if(current_location == '/company?import=success_without_errors'){
        loading_hide();
        Swal.fire("IMPORT SUCCESS", "ADD COMPANY via import file is successful without errors.", "success");
    }
    else if(current_location == '/company?import=success_with_errors'){
        loading_hide();
        Swal.fire("IMPORT SUCCESS W/ ERRORS", "ADD COMPANY via import file is successful with some errors.", "warning");
    }
    else if(current_location == '/company?import=failed'){
        loading_hide();
        Swal.fire("IMPORT FAILED", "ADD COMPANY via import file has failed.", "error");
    }
});