$('.addBtn').on('click',function(){
    $('.req').hide();
    $('#role').val('');
    $('#radio1').prop("checked", true);
    $('.permission').prop('checked', false);
    $('#deleteBtn').hide();
});

var table;
$(document).ready(function(){
    table = $('table.roleTable').DataTable({
        dom: 'lftrip',
        aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
        language: {
            info: "Showing _START_ to _END_ of _TOTAL_ User Roles",
            lengthMenu: "Show _MENU_ User Roles",
            emptyTable: "No User Roles Data Found!",
        },
        processing: true,
        serverSide: false,
        ajax: {
            "url": 'roles_data'
        },
        columns: [
            { data: 'name' },
            {
                data: 'permissions',
                "render":function(data,type,row){
                    permissions = (row.permissions.replaceAll('[{\"desc\":\"', "• ")).replaceAll('{\"desc\":\"', "<br>• ").replaceAll('\"},', "").replaceAll('\"}]', "").replaceAll('\\\/', "/");
                    return(`<div style="white-space: normal; width: 100%;">${permissions}</div>`);
                }
            },
            {
                data: 'access',
                "render":function(data,type,row){
                    access = (row.access.replaceAll('[{\"desc\":\"', "• ")).replaceAll('{\"desc\":\"', "<br>• ").replaceAll('\"},', "").replaceAll('\"}]', "").replaceAll('\\\/', "/");
                    return(`<div style="white-space: normal; width: 300px;">${access}</div>`);
                }
            }
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('#loading').hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/roles_reload",
                success: function(data){
                    if(data != data_update){
                        data_update = data;
                        table.ajax.reload(null, false);
                    }
                }
            });
        }
    }, 1000);
});

$('.saveBtn').on('click',function(){
    var role = $.trim($('#role').val()).toUpperCase();
    var permission = new Array();
    $('.permission').each(function(){
        if(this.checked) permission.push($(this).val());
    });
    $('.assignment').each(function(){
        if(this.checked) permission.push($(this).val());
    });

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
        if(save.isConfirmed){
            $('#loading').show();
            $.ajax({
                url:'/saveRole',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    role: role,
                    permission: permission
                },
                success:function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#roleModal').modal('hide');
                        Swal.fire({
                            title: 'ROLE ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#roleModal').modal('hide');
                        Swal.fire({
                            title: 'SAVE FAILED',
                            icon: 'error',
                            timer: 2000
                        });
                    }
                }
            });
        }
        else if(save.isDenied){
            Swal.fire('SAVE CANCELLED','','info');
        }
    });
});

var role_orig, j=[];
$(document).on('click','table.roleTable tbody tr',function(){
    j=[];
    $('.req').hide();
    $('#radio1').prop("checked", true);
    var data = table.row(this).data();
    // if(current_server != 'LOCAL'){
    //     if(data.id < 5){
    //         Swal.fire('RESTRICTED', 'Default User Roles cannot be modified!', 'error');
    //         return false;
    //     }
    // }
    $('.permission').prop('checked', false);

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#role_id').val(data.id);
    $('#role').val(data.name);
    role_orig = data.name;

    $.ajax({
        url: "/roles/permissions",
        data:{
            role_id: data.id,
        },
        success: function(data){
            for(var i=0; i < data.length; i++){
                j.push(data[i].permission_id);
            }
            $(".permission").each(function(){
                if(j.includes(parseInt($(this).val()))){
                    $(this).prop("checked", true);
                }
                else{
                    $(this).prop("checked", false);
                }
            });
            if(j.includes(parseInt(7))){
                $('#radio2').prop("checked", true);
            }
            else if(j.includes(parseInt(28))){
                $('#radio3').prop("checked", true);
            }
            else{
                $('#radio1').prop("checked", true);
            }
        }
    });

    $.ajax({
        url: "/roles/users",
        data:{
            role_id: data.id,
        },
        success: function(data){
            if(data == 0){
                $('#deleteBtn').show();
            }
            else{
                $('#deleteBtn').hide();
            }
        }
    });

    $('#roleModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var role_id = $('#role_id').val();
    var role = $.trim($('#role').val()).toUpperCase();
    var permission = new Array();
    $('.permission').each(function(){
        if(this.checked) permission.push($(this).val());
    });
    $('.assignment').each(function(){
        if(this.checked) permission.push($(this).val());
    });

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
        if(edit.isConfirmed){
            $('#loading').show();

            $.ajax({
                url: '/editRole',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    role_id: role_id,
                    role: role,
                    permission: permission
                },
                success: function(data){
                    if(data == 'true'){
                        table.ajax.reload(null, false);
                        $('#loading').hide();
                        $('#roleModal').modal('hide');
                        Swal.fire({
                            title: 'ROLE UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#roleModal').modal('hide');
                        Swal.fire({
                            title: 'UPDATE FAILED',
                            icon: 'error',
                            timer: 2000
                        });
                    }
                }
            });
        }
        else if(edit.isDenied){
            Swal.fire('UPDATE CANCELLED','','info');
        }
    });
});

$('#deleteBtn').on('click',function(){
    var role_id = $('#role_id').val();
    var role = $.trim($('#role').val()).toUpperCase();

    Swal.fire({
        title: 'Do you want to delete?',
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
        if(edit.isConfirmed){
            $('#loading').show();

            $.ajax({
                url: '/deleteRole',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    role_id: role_id,
                    role: role
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#roleModal').modal('hide');
                        Swal.fire({
                            title: 'ROLE DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#roleModal').modal('hide');
                        Swal.fire({
                            title: 'DELETE FAILED',
                            icon: 'error',
                            timer: 2000
                        });
                    }
                }
            });
        }
        else if(edit.isDenied){
            Swal.fire('DELETE CANCELLED','','info');
        }
    });
});

$('#role').on('keyup',function(){
    if(role_orig != $.trim($('#role').val()).toUpperCase()){
        $.ajax({
            url: "/roles/checkDuplicate",
            data:{
                role : $.trim($('#role').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#role').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#role').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }
});