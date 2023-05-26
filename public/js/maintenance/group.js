$('.addBtn').on('click',function(){
    $('#group').val('');
    if(!current_permissions.includes('3')){
        $('#groupModal').find('input').prop('disabled', false);
    }
});

var table;
$(document).ready(function(){
    table = $('table.groupTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Store Groups',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Groups",
            lengthMenu: "Show _MENU_ Groups",
            emptyTable: "NO DATA AVAILABLE",
        },
        processing: true,
        serverSide: false,
        ajax: {
            "url": 'group_data'
        },
        columns: [
            { data: 'group', name:'group'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('#loading').hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/group_reload",
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
    var group = $.trim($('#group').val());

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
                url:'/saveGroup',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    group:group,
                },
                success:function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#groupModal').modal('hide');
                        Swal.fire({
                            title: 'GROUP ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#groupModal').modal('hide');
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
            $('#groupModal').modal('hide');
        }
    });
});

var group_orig;
$(document).on('click','table.groupTable tbody tr',function(){
    current_modal = 'UPDATE';
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#groupModal').find('input').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#group_id').val(data.id);
    $('#group').val(data.group);
    group_orig = data.group;

    $('#groupModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var group_id = $('#group_id').val();
    var group = $.trim($('#group').val());

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
                url: '/editGroup',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    group_id:group_id,
                    group:group
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#groupModal').modal('hide');
                        Swal.fire({
                            title: 'GROUP UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#groupModal').modal('hide');
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
            Swal.fire('SAVE CANCELLED','','info');
            $('#groupModal').modal('hide');
        }
    });
});

$('.deleteBtn').on('click',function(){
    var group_id = $('#group_id').val();
    var group = $.trim($('#group').val());

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
                url: '/deleteGroup',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    group_id:group_id,
                    group:group
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#groupModal').modal('hide');
                        Swal.fire({
                            title: 'GROUP DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#groupModal').modal('hide');
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
            $('#groupModal').modal('hide');
        }
    });
});

$('#group').on('keyup',function(){
    if(group_orig != $.trim($('#group').val()).toUpperCase()){
        $.ajax({
            url: "/group/checkDuplicate",
            data:{
                group : $.trim($('#group').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#group').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#group').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }
});