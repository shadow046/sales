$('.addBtn').on('click',function(){
    $('#tender_type').val('');
    if(!current_permissions.includes('3')){
        $('#tenderTypeModal').find('input').prop('disabled', false);
    }
});

var table;
$(document).ready(function(){
    table = $('table.tenderTypeTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Tender Type',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Tender Types",
            lengthMenu: "Show _MENU_ Tender Types",
            emptyTable: "No Tender Types Data Found!",
        },
        processing: true,
        serverSide: false,
        ajax: {
            url: 'tender_type_data'
        },
        columns: [
            { data: 'tender_type', name:'tender_type'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('#loading').hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/tender_type_reload",
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
    var tender_type = $.trim($('#tender_type').val());

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
                url:'/saveTenderType',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    tender_type:tender_type,
                },
                success:function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#tenderTypeModal').modal('hide');
                        Swal.fire({
                            title: 'TENDER TYPE ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#tenderTypeModal').modal('hide');
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
            $('#tenderTypeModal').modal('hide');
        }
    });
});

var tender_type_orig;
$(document).on('click','table.tenderTypeTable tbody tr',function(){
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#tenderTypeModal').find('input').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#tender_type_id').val(data.id);
    $('#tender_type').val(data.tender_type);
    tender_type_orig = data.tender_type;

    $('#tenderTypeModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var tender_type_id = $('#tender_type_id').val();
    var tender_type = $.trim($('#tender_type').val());

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
                url: '/editTenderType',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    tender_type_id:tender_type_id,
                    tender_type:tender_type
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#tenderTypeModal').modal('hide');
                        Swal.fire({
                            title: 'TENDER TYPE UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#tenderTypeModal').modal('hide');
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
            $('#tenderTypeModal').modal('hide');
        }
    });
});

$('.deleteBtn').on('click',function(){
    var tender_type_id = $('#tender_type_id').val();
    var tender_type = $.trim($('#tender_type').val());

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
                url: '/deleteTenderType',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    tender_type_id:tender_type_id,
                    tender_type:tender_type
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#tenderTypeModal').modal('hide');
                        Swal.fire({
                            title: 'TENDER TYPE DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#tenderTypeModal').modal('hide');
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
            $('#tenderTypeModal').modal('hide');
        }
    });
});

$('#tender_type').on('keyup',function(){
    if(tender_type_orig != $.trim($('#tender_type').val()).toUpperCase()){
        $.ajax({
            url: "/tender_type/checkDuplicate",
            data:{
                tender_type : $.trim($('#tender_type').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#tender_type').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#tender_type').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }
});