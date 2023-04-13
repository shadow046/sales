$('.addBtn').on('click',function(){
    $('#subgroup').val('');
    if(!current_permissions.includes('3')){
        $('#subgroupModal').find('input').prop('disabled', false);
    }
});

var table;
$(document).ready(function(){
    table = $('table.subgroupTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Mall Sub-Groups',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Mall Sub-Groups",
            lengthMenu: "Show _MENU_ Mall Sub-Groups",
            emptyTable: "No Mall Sub-Groups Data Found!",
        },
        processing: true,
        serverSide: false,
        ajax: {
            "url": 'subgroup_data'
        },
        columns: [
            { data: 'subgroup', name:'subgroup'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('#loading').hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/subgroup_reload",
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
    var subgroup = $('#subgroup').val();

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
                url:'/saveSubgroup',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    subgroup:subgroup,
                },
                success:function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#subgroupModal').modal('hide');
                        Swal.fire({
                            title: 'MALL SUB-GROUP ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else if(data == 'duplicate'){
                        $('#loading').hide();
                        Swal.fire({
                            title: 'MALL SUB-GROUP ALREADY EXIST',
                            icon: 'error',
                            timer: 2000
                        });
                        $('#subgroup').val('');
                        return false;
                    }
                    else{
                        $('#loading').hide();
                        $('#subgroupModal').modal('hide');
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
            $('#subgroupModal').modal('hide');
        }
    });
});
var sub_group_orig;
$(document).on('click','table.subgroupTable tbody tr',function(){
    current_modal = 'UPDATE';
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#subgroupModal').find('input').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#subgroup_id').val(data.id);
    $('#subgroup').val(data.subgroup);
    sub_group_orig = data.subgroup;

    $('#subgroupModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var subgroup_id = $('#subgroup_id').val();
    var subgroup = $('#subgroup').val();

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
                url: '/editSubgroup',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    subgroup_id:subgroup_id,
                    subgroup:subgroup
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#subgroupModal').modal('hide');
                        Swal.fire({
                            title: 'MALL SUB-GROUP UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#subgroupModal').modal('hide');
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
            $('#subgroupModal').modal('hide');
        }
    });
});

$('.deleteBtn').on('click',function(){
    var subgroup_id = $('#subgroup_id').val();
    var subgroup = $.trim($('#subgroup').val());

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
                url: '/deleteSubGroup',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    subgroup_id:subgroup_id,
                    subgroup:subgroup
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#subgroupModal').modal('hide');
                        Swal.fire({
                            title: 'MALL SUB-GROUP DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#subgroupModal').modal('hide');
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
            $('#subgroupModal').modal('hide');
        }
    });
});

$('#subgroup').on('keyup',function(){
    if(sub_group_orig != $.trim($('#subgroub').val()).toUpperCase()){
        $.ajax({
            url: "/subgroup/checkDuplicate",
            data:{
                subgroup : $.trim($('#subgroup').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#subgroup').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#subgroup').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }  
});