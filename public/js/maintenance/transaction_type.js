$('.addBtn').on('click',function(){
    $('#transaction_type').val('');
    if(!current_permissions.includes('3')){
        $('#transactionTypeModal').find('input').prop('disabled', false);
    }
});

var table;

$(document).ready(function(){
    table = $('table.transactionTypeTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Transaction Type',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Transaction Types",
            lengthMenu: "Show _MENU_ Transaction Types",
            emptyTable: "No Transaction Types Data Found!",
        },
        processing: true,
        serverSide: false,
        ajax: {
            url: 'transaction_type_data'
        },
        order:[],
        columns: [
            { data: 'transaction_type', name:'transaction_type'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('#loading').hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/transaction_type_reload",
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
    var transaction_type = $.trim($('#transaction_type').val());
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
                url:'/saveTransactionType',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    transaction_type:transaction_type,
                },
                success:function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#transactionTypeModal').modal('hide');
                        Swal.fire({
                            title: 'TRANSACTION TYPE ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#transactionTypeModal').modal('hide');
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

var transaction_type_orig;
$(document).on('click','table.transactionTypeTable tbody tr',function(){
    current_modal = 'UPDATE';
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#transactionTypeModal').find('input').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#transaction_type_id').val(data.id);
    $('#transaction_type').val(data.transaction_type);
    transaction_type_orig = data.transaction_type;

    $('#transactionTypeModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var transaction_type_id = $('#transaction_type_id').val();
    var transaction_type = $('#transaction_type').val();

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
                url: '/editTransactionType',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    transaction_type_id:transaction_type_id,
                    transaction_type:transaction_type
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#transactionTypeModal').modal('hide');
                        Swal.fire({
                            title: 'TRANSACTION TYPE UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#transactionTypeModal').modal('hide');
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

$('.deleteBtn').on('click',function(){
    var transaction_type_id = $('#transaction_type_id').val();
    var transaction_type = $.trim($('#transaction_type').val());
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
                url: '/deleteTransactionType',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    transaction_type_id:transaction_type_id,
                    transaction_type:transaction_type
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#transactionTypeModal').modal('hide');
                        Swal.fire({
                            title: 'TRANSACTION TYPE DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#transactionTypeModal').modal('hide');
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
            $('#transactionTypeModal').modal('hide');
        }
    });
});

$('#transaction_type').on('keyup',function(){
    if(transaction_type_orig != $.trim($('#transaction_type').val()).toUpperCase()){
        $.ajax({
            url: "/transaction_type/checkDuplicate",
            data:{
                transaction_type : $.trim($('#transaction_type').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#transaction_type').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#transaction_type').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }
});