$('.addBtn').on('click',function(){
    $('#type').val('');
    if(!current_permissions.includes('3')){
        $('#typeModal').find('input').prop('disabled', false);
    }
});

var table;
$(document).ready(function(){
    table = $('table.typeTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Store Types',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Store Types",
            lengthMenu: "Show _MENU_ Store Types",
            emptyTable: "NO DATA AVAILABLE",
        },
        processing: true,
        serverSide: false,
        ajax: {
            url: 'type_data'
        },
        columns: [
            { data: 'type', name:'type'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            loading_hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/type_reload",
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
    var type = $('#type').val();

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
            loading_show();
            $.ajax({
                url:'/saveType',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    type:type,
                },
                success:function(data){
                    if(data == 'true'){
                        loading_hide();
                        $('#typeModal').modal('hide');
                        Swal.fire({
                            title: 'STORE TYPE ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        loading_hide();
                        $('#typeModal').modal('hide');
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
            $('#typeModal').modal('hide');
        }
    });
});

var type_orig;
$(document).on('click','table.typeTable tbody tr',function(){
    current_modal = 'UPDATE';
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#typeModal').find('input').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#type_id').val(data.id);
    $('#type').val(data.type);
    type_orig = data.type;

    $('#typeModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var type_id = $('#type_id').val();
    var type = $('#type').val();

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
            loading_show();
            $.ajax({
                url: '/editType',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    type_id:type_id,
                    type:type
                },
                success: function(data){
                    if(data == 'true'){
                        loading_hide();
                        $('#typeModal').modal('hide');
                        Swal.fire({
                            title: 'STORE TYPE UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        loading_hide();
                        $('#typeModal').modal('hide');
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
            $('#typeModal').modal('hide');
        }
    });
});

$('.deleteBtn').on('click',function(){
    var type_id = $('#type_id').val();
    var type = $.trim($('#type').val());

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
            loading_show();
            $.ajax({
                url: '/deleteType',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    type_id:type_id,
                    type:type
                },
                success: function(data){
                    if(data == 'true'){
                        loading_hide();
                        $('#typeModal').modal('hide');
                        Swal.fire({
                            title: 'STORE TYPE DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        loading_hide();
                        $('#typeModal').modal('hide');
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
            $('#typeModal').modal('hide');
        }
    });
});

$('#type').on('keyup',function(){
    if(type_orig != $.trim($('#type').val()).toUpperCase()){
        $.ajax({
            url: "/type/checkDuplicate",
            data:{
                type : $.trim($('#type').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#type').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#type').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }
});