var table;
$(document).ready(function(){
    $('table.userTable').dataTable().fnDestroy();
    table = $('table.userTable').DataTable({
        scrollY:        "500px",
        scrollX:        true,
        scrollCollapse: true,
        fixedColumns:{
            left: 3,
        },
        dom: 'ltrip',
        aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
        language: {
            info: "Showing _START_ to _END_ of _TOTAL_ Users",
            lengthMenu: "Show _MENU_ Users",
            emptyTable: "NO DATA AVAILABLE",
        },
        processing: true,
        serverSide: false,
        ajax:{
            url: '/users/data',
        },
        columnDefs: [
            {
                "targets": [9],
                "visible": false,
                "searchable": true
            },
        ],
        columns: [
            { data: 'user_name' },
            { data: 'user_email' },
            { data: 'role_name' },
            {
                data: 'branch_name',
                "render": function(data, type, row, meta){
                    if(row.branch == '0' && row.company == '0'){
                        return 'N/A';
                    }
                    else if(row.branch != '0'){
                        return row.branch_name;
                    }
                    else if((row.company).includes('|')){
                        if(row.company_name.split("|").length == 1){
                            var start = '';
                        }
                        else{
                            var start = '• ';
                        }
                        return `<div style="white-space:normal;">${start} ${row.company_name.split("|").join("<br/> • ")}</div>`;
                    }
                    else{
                        return row.company_name;
                    }
                }
            },
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
                data: 'province',
                "render": function(data, type, row, meta){
                    if(!row.province){
                        return 'N/A';
                    }
                    else{
                        return row.province;
                    }
                }
            },
            {
                data: 'district',
                "render": function(data, type, row, meta){
                    if(!row.district){
                        return 'N/A';
                    }
                    else{
                        return row.district;
                    }
                }
            },
            {
                data: 'user_status',
                "render": function(data, type, row, meta){
                    if(type === "sort" || type === 'type'){
                        return data;
                    }
                    if(row.user_status == 'ACTIVE'){
                        return '<label class="switch" style="zoom: 80%; margin-top: -5px; margin-bottom: -10px;"><input type="checkbox" class="togBtn" id="'+ meta.row +'" checked><div class="slider round"><span style="font-size: 110%;" class="on">ACTIVE</span><span style="font-size: 100%;" class="off">INACTIVE</span></div></label>';
                    }
                    if(row.user_status == 'INACTIVE'){
                        return '<label class="switch" style="zoom: 80%; margin-top: -5px; margin-bottom: -10px;"><input type="checkbox" class="togBtn" id="'+ meta.row +'"><div class="slider round"><span style="font-size: 110%;" class="on">ACTIVE</span><span style="font-size: 100%;" class="off">INACTIVE</span></div></label>';
                    }
                }
            },
            { data: 'user_status' }
        ],
        order: [],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('#search_area').val('');
            $('#search_area').chosen();
            $('#search_area').trigger('chosen:updated');
            $('#search_area_chosen').css({'width': '100%'});
            $('#loading').hide();
        }
    });

    $('.filter-select').on('change', function(){
        table.column($(this).data('column')).search(!$(this).val()?'':'^'+$(this).val()+'$',true,false,true).draw();
    });

    $('.filter-type').on('change', function(){
        $('#filter-type').val($(this).val());
        $('#filter-type').keyup();
    });

    $('.filter-type2').on('change', function(){
        $('#filter-type2').val($(this).val());
        $('#filter-type2').keyup();
    });

    $('.filter-input').on('keyup search', function(){
        table.column($(this).data('column')).search($(this).val()).draw();
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/users/reload",
                success: function(data){
                    if(data != data_update){
                        data_update = data;
                        table.ajax.reload(null, false);
                    }
                }
            });
        }
    }, 1000);

    setInterval(() => {
        $('.form-control').on('click', function(e){
            e.stopPropagation();
        });
    }, 0);

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
                    url: '/users/status',
                    data:{
                        id: data.user_id,
                        name: data.user_name,
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
});

$(document).on('click', '#userTable tbody tr td:not(:nth-child(9))', function(){
    if(!table.data().any()){ return false; }
    area1_all = [];
    stores1_list = [];
    var data = table.row(this).data();
    if (data.role == 1) {
        return false;
    }
    $('.req').hide();
    $('#id1').val(data.user_id);
    $('#name1').val(data.user_name);
    $('#name2').val(data.user_name);
    $('#email1').val(data.user_email);
    $('#email2').val(data.user_email);
    $('#role1').val(data.role);
    $('#role2').val(data.role);
    $('#role1').change();
    $('#branch1').val(data.branch);
    $('#branch2').val(data.branch);
    $('#province1').val(data.province);
    $('#province2').val(data.province);
    $('#district1').val(data.district);
    $('#district2').val(data.district);
    $('#company2').val(data.company);
    $('#area2').val(data.area);
    $('#store2').val(data.store);
    $('#branch1').chosen();
    $('#branch1').trigger('chosen:updated');
    $('#branch1_chosen').css({'width': '100%', 'margin-bottom': '-22px'});
    $('label[for="branch1"]').css({'margin-top': '-15px', 'margin-right': '-20px'});

    $("#company1").children("option").each(function(){
        if($.inArray($(this).val(),(data.company).split('|')) !== -1){
            $(this).prop("selected",true);
        }
        else{
            $(this).prop("selected",false);
        }
    });

    $("#area1").children("option").each(function(){
        if($.inArray($(this).val(),(data.area).split('|')) !== -1){
            $(this).prop("selected",true);
        }
        else{
            $(this).prop("selected",false);
        }
    });

    setTimeout(() => {
        $('#company1').chosen();
        $('#company1').trigger('chosen:updated');
        $('#company1_chosen').css({'width': '100%', 'margin-top': '-15px'});
        $('label[for="company1"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
        $('#company1').change();

        $('#area1').chosen();
        $('#area1').trigger('chosen:updated');
        $('#area1_chosen').css({'width': '100%', 'margin-top': '-15px'});
        $('label[for="area1"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
        $('#area1').change();

        setTimeout(() => {
            if(data.store != 'X' && data.store != '0'){
                $("#store1").children("option").each(function(){
                    if($.inArray($(this).val(),(data.store).split('|')) !== -1){
                        $(this).prop("selected",true);
                    }
                    else{
                        $(this).prop("selected",false);
                    }
                });
                setTimeout(() => {
                    $('#store1').chosen();
                    $('#store1').trigger('chosen:updated');
                    $('#store1_chosen').css({'width': '100%', 'margin-top': '-15px'});
                    $('label[for="store1"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
                    $('#store1').change();
                    $('.hideStore1').show();
                }, current_timeout);
            }
        }, current_timeout);
        if(data.store == '0'){
            $('#branchAll1').prop('checked', true);
            $('#branchAll1').change();
        }
    }, current_timeout);
    // $('#role1 option:contains("ADMIN")').remove();
    $('#updateUser').modal('show');
});

function btnAddUser(){
    area_all = [];
    stores_list = [];
    $('.req').hide();
    $('#name').val('');
    $('#pass').val('');
    $('#email').val('');
    $('#role').val('');
    $('#role').change();
    $('#branch').val('');
    $('#branch').chosen();
    $('#branch').trigger('chosen:updated');
    $('#branch_chosen').css({'width': '100%', 'margin-bottom': '-22px'});
    $('label[for="branch"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
    $('#company').chosen();
    $('#company').val('').trigger('chosen:updated');
    $('#company1').val('').trigger('chosen:updated');
    $('#company_chosen').css({'width': '100%', 'margin-top': '-15px'});
    $('#company_chosen').addClass('requiredField requiredInput redBorder');
    $("#company_chosen input").attr("id", "company_input");
    $('label[for="company"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
    $('#area').chosen();
    $('#area').val('').trigger('chosen:updated');
    $('#area1').val('').trigger('chosen:updated');
    $('#area_chosen').css({'width': '100%', 'margin-top': '-15px'});
    $('#area_chosen').addClass('requiredField requiredInput redBorder');
    $("#area_chosen input").attr("id", "area_input");
    $('label[for="area"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
    $('#area').change();
    $('#store').change();
}

$('#btnClear').on('click', function(){
    btnAddUser();
});

$('#btnAddUser').on('click', function(){
    btnAddUser();
    // var currentURL = window.location.href;
    // Check if the 'admin' parameter exists in the current URL
    // if (currentURL.includes('admin=1')) {
    //     $('#pass').show();
    // }else{
    //     $('#role option:contains("ADMIN")').remove();
    // }
    $('#addUser').modal('show');
});

setInterval(() => {
    if($('#branch_chosen').is(':visible')){
        if(!$('#branch').val()){
            $('#branch_chosen').removeClass('select-active0');
            $('#branch_chosen').removeClass('select-active1');
            $('#branch_chosen').removeClass('defaultInput');
            $('#branch_chosen').addClass('requiredInput');
            if($('#branch_chosen').hasClass('chosen-container-active')){
                $('#branch_chosen').removeClass('requiredInput');
                $('#branch_chosen').removeClass('select-border');
                $('#branch_chosen').removeClass('select-active1');
                $('#branch_chosen').addClass('select-active0');
            }
            else{
                $('#branch_chosen').addClass('select-border');
                $('#branch_chosen').addClass('requiredInput');
            }
        }
        else{
            $('#branch_chosen').removeClass('select-active0');
            $('#branch_chosen').removeClass('select-active1');
            $('#branch_chosen').removeClass('requiredInput');
            $('#branch_chosen').addClass('defaultInput');
            if($('#branch_chosen').hasClass('chosen-container-active')){
                $('#branch_chosen').removeClass('defaultInput');
                $('#branch_chosen').removeClass('select-border');
                $('#branch_chosen').removeClass('select-active0');
                $('#branch_chosen').addClass('select-active1');
            }
            else{
                $('#branch_chosen').addClass('select-border');
                $('#branch_chosen').addClass('defaultInput');
            }
        }
    }
    if($('#branch1_chosen').is(':visible')){
        if(!$('#branch1').val()){
            $('#branch1_chosen').removeClass('select-active0');
            $('#branch1_chosen').removeClass('select-active1');
            $('#branch1_chosen').removeClass('defaultInput');
            $('#branch1_chosen').addClass('requiredInput');
            if($('#branch1_chosen').hasClass('chosen-container-active')){
                $('#branch1_chosen').removeClass('requiredInput');
                $('#branch1_chosen').removeClass('select-border');
                $('#branch1_chosen').removeClass('select-active1');
                $('#branch1_chosen').addClass('select-active0');
            }
            else{
                $('#branch1_chosen').addClass('select-border');
                $('#branch1_chosen').addClass('requiredInput');
            }
        }
        else{
            $('#branch1_chosen').removeClass('select-active0');
            $('#branch1_chosen').removeClass('select-active1');
            $('#branch1_chosen').removeClass('requiredInput');
            $('#branch1_chosen').addClass('defaultInput');
            if($('#branch1_chosen').hasClass('chosen-container-active')){
                $('#branch1_chosen').removeClass('defaultInput');
                $('#branch1_chosen').removeClass('select-border');
                $('#branch1_chosen').removeClass('select-active0');
                $('#branch1_chosen').addClass('select-active1');
            }
            else{
                $('#branch1_chosen').addClass('select-border');
                $('#branch1_chosen').addClass('defaultInput');
            }
        }
    }
}, 0);

$(document).on('change', '#company', function(){
    if(!$('#company option:selected').length || !$('#area option:selected').length){
        $('.classStore').hide();
        $('#store').find('option').remove();
        $('#store').chosen();
        $('#store').trigger('chosen:updated');
        $('#store_chosen').css({'width': '100%', 'margin-top': '-15px'});
        $("#store_chosen input").attr("id", "store_input");
        $('label[for="store"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
    }
    $('#area').change();
});

var area_all = [];
var stores_list = [];
$(document).on('change', '#area', function(){
    if(!$('#company option:selected').length || !$('#area option:selected').length){
        $('.classStore').hide();
        $('#store').find('option').remove();
        $('#store').chosen();
        $('#store').trigger('chosen:updated');
        $('#store_chosen').css({'width': '100%', 'margin-top': '-15px'});
        $('label[for="store"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
    }
    else{
        var storesOption = " ";
        $.ajax({
            url:"/users/stores",
            type:"get",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data:{
                setup_id: [],
                company_id: $('#company').val(),
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
                $('#store').chosen();
                $('#store').trigger('chosen:updated');
                $('#store_chosen').css({'width': '100%', 'margin-top': '-15px'});
                $('label[for="store"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
                $('.branchCount').html(stores.length);
                $('.classStore').show();

                if(stores_list.length > 0){
                    $("#store").children("option").each(function(){
                        if($.inArray($(this).val(), stores_list) !== -1){
                            $(this).prop("selected",true);
                        }
                        else{
                            $(this).prop("selected",false);
                        }
                    });
                    $('#store').chosen();
                    $('#store').trigger('chosen:updated');
                    $('#store_chosen').css({'width': '100%', 'margin-top': '-15px'});
                    $('label[for="store"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
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

$(document).on('change', '#branchAll', function(){
    if($('#branchAll').is(':checked')){
        $('.hideStore').hide();
    }
    else{
        $('.hideStore').show();
    }
    $('#area').change();
});

$(document).on('change', '#company1', function(){
    if(!$('#company1 option:selected').length || !$('#area1 option:selected').length){
        $('.classStore').hide();
        $('#store1').find('option').remove();
        $('#store1').chosen();
        $('#store1').trigger('chosen:updated');
        $('#store1_chosen').css({'width': '100%', 'margin-top': '-15px'});
        $('label[for="store1"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
    }
    $('#area1').change();
});

var area1_all = [];
var stores1_list = [];
$(document).on('change', '#area1', function(){
    if(!$('#company1 option:selected').length || !$('#area1 option:selected').length){
        $('.classStore').hide();
        $('#store1').find('option').remove();
        $('#store1').chosen();
        $('#store1').trigger('chosen:updated');
        $('#store1_chosen').css({'width': '100%', 'margin-top': '-15px'});
        $('label[for="store1"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
    }
    else{
        var storesOption = " ";
        $.ajax({
            url:"/users/stores",
            type:"get",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data:{
                company_id: $('#company1').val(),
                area_id: $('#area1').val(),
                area_all: area1_all
            },
            success:function(data){
                var stores = $.map(data, function(value, index) {
                    return [value];
                });
                const selectedOptions = $('#area1 option:selected').map(function(){
                    return { value: this.value, text: this.text };
                }).get();
                for(let i = 0; i < selectedOptions.length; i++){
                    storesOption+='<option value="'+selectedOptions[i].value+'-0'+'">'+selectedOptions[i].text+' (ALL BRANCHES)</option>';
                }
                stores.forEach(value => {
                    storesOption+='<option value="'+value.id+'">'+value.branch_code+': '+value.branch_name+'</option>';
                });
                $('#store1').find('option').remove().end().append(storesOption);
                $('#store1').chosen();
                $('#store1').trigger('chosen:updated');
                $('#store1_chosen').css({'width': '100%', 'margin-top': '-15px'});
                $('label[for="store1"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
                $('.branchCount1').html(stores.length);
                $('.classStore').show();

                if(stores1_list.length > 0){
                    $("#store1").children("option").each(function(){
                        if($.inArray($(this).val(), stores1_list) !== -1){
                            $(this).prop("selected",true);
                        }
                        else{
                            $(this).prop("selected",false);
                        }
                    });
                    $('#store1').chosen();
                    $('#store1').trigger('chosen:updated');
                    $('#store1_chosen').css({'width': '100%', 'margin-top': '-15px'});
                    $('label[for="store1"]').css({'margin-top': '-15px', 'margin-right': '-20px'});
                }
                $('#store1_count').html(stores.length);
            }
        });
    }
});

$(document).on('change', '#store1', function(){
    area1_all = [];
    stores1_list = [];
    $.each($(this).val(), function(index, value){
        if(value.includes('-0')){
            area1_all.push(value.substring(0, value.length - 2));
        }
        stores1_list.push(value);
    });
    $('#area1').change();
});

$(document).on('change', '#branchAll1', function(){
    if($('#branchAll1').is(':checked')){
        $('.hideStore1').hide();
    }
    else{
        $('.hideStore1').show();
    }
    $('#area1').change();
});

$('#btnSave').on('click', function(){
    var warntext = '';
    var emailv1 = true;
    var emailv2 = true;
    var name = $.trim($('#name').val());
    var email = $.trim($('#email').val());
    var role = $('#role').val();
    if($('.classDistrictManager').is(':visible')){
        var branch = '0';
        var company = $('#company').val();
        var area = '0';
        var store = 'X';
        var province = $('#province').val();
        var district = $('#district').val();
    }
    else{
        var province = '';
        var district = '';
        if($('#branch_chosen').is(':visible')){
            var branch = $('#branch').val();
            var store = '0';
        }
        else{
            var branch = '0';
        }
        if($('#company_chosen').is(':visible')){
            var company = $('#company').val();
        }
        else{
            var company = '0';
        }
        if($('#area_chosen').is(':visible')){
            var area = $('#area').val();
            var store = $('#store').val();
        }
        else{
            var area = '0';
            var store = 'X';
        }
        if($('#branchAll').is(':visible') && $('#branchAll').is(':checked')){
            var store = '0';
        }
    }
    $('#loading').show();
    setTimeout(function(){
        if(!validateEmail(email)){
            $('#loading').hide();
            Swal.fire("INVALID EMAIL", "Enter a valid email address format!", "error");
            return false;
        }
        // if(emailProvider(email)){
        //     $.ajax({
        //         headers:{
        //             Authorization: "Bearer " + current_key
        //         },
        //         async: false,
        //         type: 'GET',
        //         url: 'https://isitarealemail.com/api/email/validate?email='+email,
        //         success: function(data){
        //             if(data.status == 'invalid'){
        //                 emailv1 = false;
        //             }
        //             else{
        //                 emailv1 = true;
        //             }
        //         }
        //     });
        //     $('#loading').hide();
        //     if(emailv1 == false){
        //         Swal.fire('NON-EXISTENT EMAIL','User Email Address does not exist!','error');
        //         return false;
        //     }
        // }
        // else{
        //     warntext = ' <br><strong style="color: red;">WARNING: Email Address cannot be verified by the system! CONTINUE?</strong>';
        // }
        $('#loading').hide();
        $.ajax({
            url: "/users/validate/save",
            type: "POST",
            headers:{
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data:{
                name: name,
                email: email,
                role: role,
                branch: branch,
                company: company,
                area: area,
                store: store,
                province: province,
                district: district
            },
            success: function(data){
                if(data.result == 'true'){
                    Swal.fire({
                        title: "ADD NEW USER?",
                        html: "You are about to ADD a new user!"+warntext,
                        icon: "warning",
                        showCancelButton: true,
                        cancelButtonColor: '#3085d6',
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'Confirm',
                        allowOutsideClick: false
                    })
                    .then((result) => {
                        if(result.isConfirmed){
                            $('#addUser').modal('hide');
                            $('#loading').show();
                            $.ajax({
                                url: "/users/save",
                                headers:{
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data:{
                                    name: name,
                                    email: email,
                                    role: role,
                                    branch: branch,
                                    company: company,
                                    area: area,
                                    store: store,
                                    province: province,
                                    district: district,
                                    password: $('#pass').val()
                                },
                                success: function(data){
                                    if(data == 'true'){
                                        $('#loading').hide();
                                        Swal.fire("SAVE SUCCESS", "New user saved successfully!", "success");
                                    }
                                    else{
                                        $('#loading').hide();
                                        Swal.fire("SAVE FAILED", "New user save failed!", "error");
                                    }
                                }
                            });
                        }
                    });
                }
                else if(data.result == 'invalid'){
                    Swal.fire("INVALID EMAIL", "Enter a valid email address format!", "error");
                    return false;
                }
                else if(data.result == 'duplicate'){
                    Swal.fire("DUPLICATE EMAIL", "Email address already exists!", "error");
                    return false;
                }
                else{
                    $('#addUser').hide();
                    Swal.fire("SAVE FAILED", "USER ACCOUNT", "error");
                    setTimeout(function(){window.location.href="/users"}, 2000);
                }
            },
            error: function(data){
                if(data.status == 401){
                    window.location.href = '/users';
                }
            }
        });
    }, 0);
});

$('#btnReset').on('click', function(){
    $('.req').hide();
    $('#name1').val($('#name2').val());
    $('#email1').val($('#email2').val());
    $('#role1').val($('#role2').val());
    $('#role1').change();
    $('#branch1').val($('#branch2').val());
    $('#branch1').chosen();
    $('#branch1').trigger('chosen:updated');
    $('#company1').val($('#company2').val().split("|"));
    $('#company1').chosen();
    $('#company1').trigger('chosen:updated');
    $('#province1').val($('#province2').val());
    $('#district1').val($('#district2').val());
    $('#area1').val($('#area2').val().split("|"));
    $('#area1').chosen();
    $('#area1').trigger('chosen:updated');
    $('#area1').change();
    setTimeout(() => {
        if($('#store2').val() != 'X' && $('#store2').val() != '0'){
            $("#store1").children("option").each(function(){
                if($.inArray($(this).val(),($('#store2').val()).split('|')) !== -1){
                    $(this).prop("selected",true);
                }
                else{
                    $(this).prop("selected",false);
                }
            });
            setTimeout(() => {
                $('#store1').chosen();
                $('#store1').trigger('chosen:updated');
            }, current_timeout);
        }
    }, current_timeout);
    if($('#store2').val() == '0'){
        $('#branchAll1').prop('checked', true);
        $('#branchAll1').change();
    }
});

$('#btnUpdate').on('click', function(){
    var warntext = '';
    var emailv1 = true;
    var emailv2 = true;
    var id1 = $('#id1').val();
    var name1 = $.trim($('#name1').val());
    var name2 = $('#name2').val();
    var email1 = $.trim($('#email1').val());
    var email2 = $('#email2').val();
    var role1 = $('#role1').val();
    var role2 = $('#role2').val();
    var branch2 = $('#branch2').val();
    var company2 = $('#company2').val();
    var area2 = $('#area2').val();
    var store2 = $('#store2').val();
    var province2 = $('#province2').val();
    var district2 = $('#district2').val();
    if($('.classDistrictManager').is(':visible')){
        var branch1 = '0';
        var company1 = $('#company1').val();
        var area1 = '0';
        var store1 = 'X';
        var province1 = $('#province1').val();
        var district1 = $('#district1').val();
    }
    else{
        var province1 = '';
        var district1 = '';
        if($('#branch1_chosen').is(':visible')){
            var branch1 = $('#branch1').val();
            var store1 = '0';
        }
        else{
            var branch1 = '0';
        }
        if($('#company1_chosen').is(':visible')){
            var company1 = $('#company1').val();
        }
        else{
            var company1 = '0';
        }
        if($('#area1_chosen').is(':visible')){
            var area1 = $('#area1').val();
            var store1 = $('#store1').val();
        }
        else{
            var area1 = '0';
            var store1 = 'X';
        }
        if($('#branchAll1').is(':visible') && $('#branchAll1').is(':checked')){
            var store1 = '0';
        }
    }
    $('#loading').show();
    setTimeout(function(){
        if(role1 != role2){
            if(name1.toUpperCase() == name2.toUpperCase() && email1.toUpperCase() == email2.toUpperCase() && role1 == role2){
                $('#loading').hide();
                Swal.fire("NO CHANGES FOUND", "User Details are all still the same!", "error");
                return false;
            }
        }
        else{
            if(name1.toUpperCase() == name2.toUpperCase() && email1.toUpperCase() == email2.toUpperCase() && role1 == role2){
                if(role1 == '1' || role1 == '2'){
                    $('#loading').hide();
                    Swal.fire("NO CHANGES FOUND", "User Details are all still the same!", "error");
                    return false;
                }
                else if(role1 == '3' && branch1 == branch2){
                    $('#loading').hide();
                    Swal.fire("NO CHANGES FOUND", "User Details are all still the same!", "error");
                    return false;
                }
                else if(role1 == '4' && JSON.stringify(company1) === JSON.stringify(company2.split('|')) && JSON.stringify(area1) === JSON.stringify(area2.split('|')) && JSON.stringify(store1) === JSON.stringify(store2.split('|'))){
                    $('#loading').hide();
                    Swal.fire("NO CHANGES FOUND", "User Details are all still the same!", "error");
                    return false;
                }
                else if(role1 == '6' && JSON.stringify(company1) === JSON.stringify(company2.split('|')) && province1 == province2 && district1 == district2){
                    $('#loading').hide();
                    Swal.fire("NO CHANGES FOUND", "User Details are all still the same!", "error");
                    return false;
                }
            }
        }
        if(!validateEmail(email1)){
            $('#loading').hide();
            Swal.fire("INVALID EMAIL", "Enter a valid email address format!", "error");
            return false;
        }
        // if(emailProvider(email1)){
        //     $.ajax({
        //         headers:{
        //             Authorization: "Bearer " + current_key
        //         },
        //         async: false,
        //         type: 'GET',
        //         url: 'https://isitarealemail.com/api/email/validate?email='+email1,
        //         success: function(data){
        //             if(data.status == 'invalid'){
        //                 emailv2 = false;
        //             }
        //             else{
        //                 emailv2 = true;
        //             }
        //         }
        //     });
        //     $('#loading').hide();
        //     if(emailv2 == false){
        //         Swal.fire('NON-EXISTENT EMAIL','User Email Address does not exist!','error');
        //         return false;
        //     }
        // }
        // else{
        //     warntext = ' <br><strong style="color: red;">WARNING: Email Address cannot be verified by the system! CONTINUE?</strong>';
        // }
        $('#loading').hide();
        $.ajax({
            url: "/users/validate/update",
            type: "PUT",
            headers:{
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data:{
                id1: id1,
                name1: name1,
                name2: name2,
                email1: email1,
                email2: email2,
                role1: role1,
                role2: role2,
                branch1: branch1,
                branch2: branch2,
                company1: company1,
                company2: company2,
                area1: area1,
                area2: area2,
                store1: store1,
                store2: store2,
                province1: province1,
                province2: province2,
                district1: district1,
                district2: district2
            },
            success: function(data){
                if(data == 'true'){
                    Swal.fire({
                        title: "UPDATE USER DETAILS?",
                        html: "You are about to UPDATE this user!"+warntext,
                        icon: "warning",
                        showCancelButton: true,
                        cancelButtonColor: '#3085d6',
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'Confirm',
                        allowOutsideClick: false
                    })
                    .then((result) => {
                        if(result.isConfirmed){
                            $.ajax({
                                url: "/users/update",
                                headers:{
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data:{
                                    id1: id1,
                                    name1: name1,
                                    name2: name2,
                                    email1: email1,
                                    email2: email2,
                                    role1: role1,
                                    role2: role2,
                                    branch1: branch1,
                                    branch2: branch2,
                                    company1: company1,
                                    company2: company2,
                                    area1: area1,
                                    area2: area2,
                                    store1: store1,
                                    store2: store2,
                                    province1: province1,
                                    province2: province2,
                                    district1: district1,
                                    district2: district2
                                },
                                success: function(data){
                                    if(data == 'true'){
                                        $('#updateUser').modal('hide');
                                        Swal.fire("UPDATE SUCCESS", "User details updated successfully!", "success");
                                    }
                                    else{
                                        $('#updateUser').modal('hide');
                                        Swal.fire("UPDATE FAILED", "User details update failed!", "error");
                                    }
                                }
                            });
                        }
                    });
                }
                else if(data == 'invalid'){
                    Swal.fire("INVALID EMAIL", "Enter a valid email address format!", "error");
                }
                else if(data == 'duplicate'){
                    Swal.fire("DUPLICATE EMAIL", "Email address already exists!", "error");
                }
                else{
                    $('#updateUser').hide();
                    Swal.fire("UPDATE FAILED", "USER ACCOUNT", "error");
                    setTimeout(function(){window.location.href="/users"}, 2000);
                }
            },
            error: function(data){
                if(data.status == 401){
                    window.location.href = '/users';
                }
            }
        });
    }, 0);
});

var permissions=[];
$(document).on('change', '#role',function(){
    permissions=[];
    $('#province').val('');
    $('#district').val('');
    $('#branch').val('');
    $('#branch').trigger('chosen:updated');
    $('#company').val('');
    $('#company').trigger('chosen:updated');
    $('#area').val('');
    $('#area').trigger('chosen:updated');
    $('#branchAll').prop('checked', false);
    $('#store').val('');
    $('#store').trigger('chosen:updated');
    if($(this).val() == '1'){
        $('#pass').show();
    }
    else{
        $('#pass').hide();
    }

    if($(this).val() == '6'){
        $('.classFranchisee').hide();
        $('.classAreaManager').hide();
        $('.classCompany').show();
        $('.classDistrictManager').show();
    }
    else{
        $('#loading').show();
        $('.classDistrictManager').hide();
        $.ajax({
            url: '/users/permissions',
            data:{
                role_id: $(this).val() ? $(this).val() : 'X'
            },
            success: function(data){
                for(var i=0; i < data.length; i++){
                    permissions.push(data[i].permission_id);
                }
                permissions.sort();
                if(permissions.includes(28)){
                    $('.classBranch').show();
                }
                else{
                    $('.classBranch').hide();
                }
                if(permissions.includes(7)){
                    $('.classCompany').show();
                    $('.classArea').show();
                }
                else{
                    $('.classCompany').hide();
                    $('.classArea').hide();
                }
                if($('.classCompany').is(':hidden') && $('.classArea').is(':hidden')){
                    $('.classStore').hide();
                }
                $('#loading').hide();
            }
        });
    }
});

$(document).on('change', '#role1',function(){
    permissions=[];
    if($(this).val() == '1'){
        $('#verification').show();
    }
    else{
        $('#verification').hide();
    }
    $('#province1').val('');
    $('#district1').val('');
    $('#branch1').val('');
    $('#branch1').trigger('chosen:updated');
    $('#company1').val('');
    $('#company1').trigger('chosen:updated');
    $('#area1').val('');
    $('#area1').trigger('chosen:updated');
    $('#branchAll1').prop('checked', false);
    $('#store1').val('');
    $('#store1').trigger('chosen:updated');
    if($(this).val() == '6'){
        $('.classFranchisee').hide();
        $('.classAreaManager').hide();
        $('.classCompany').show();
        $('.classDistrictManager').show();
    }
    else{
        $('#loading').show();
        $('.classDistrictManager').hide();
        $.ajax({
            url: '/users/permissions',
            data:{
                role_id: $(this).val() ? $(this).val() : 'X'
            },
            success: function(data){
                for(var i=0; i < data.length; i++){
                    permissions.push(data[i].permission_id);
                }
                permissions.sort();
                if(permissions.includes(28)){
                    $('.classBranch').show();
                }
                else{
                    $('.classBranch').hide();
                }
                if(permissions.includes(7)){
                    $('.classCompany').show();
                    $('.classArea').show();
                }
                else{
                    $('.classCompany').hide();
                    $('.classArea').hide();
                }
                if($('.classCompany').is(':hidden') && $('.classArea').is(':hidden')){
                    $('.classStore').hide();
                }
                $('#loading').hide();
            }
        });
    }
});

setInterval(() => {
    if($('#id1').val() == current_user){
        $('#role1').prop('disabled', true);
    }
    else{
        $('#role1').prop('disabled', false);
    }
}, 0);

$(document).on('click', '#store_input, #company_chosen, #area_chosen, #store_chosen', function() {
    $(this).focusout();
});

$(document).on('click', '#company1_chosen, #area1_chosen, #store1_chosen', function() {
    $(this).focusout();
});
