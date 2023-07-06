$('.addBtn').on('click',function(){
    $('#sales_type').val('');
    if(!current_permissions.includes('3')){
        $('#salesTypeModal').find('input').prop('disabled', false);
    }
});

var table;
$(document).ready(function(){
    table = $('table.sales_typeTable').DataTable({
        dom: 'Blftrip',
        buttons: [{extend: 'excelHtml5', title: 'Export - Product Sales Types'}],
        aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
        language: {
            info: "Showing _START_ to _END_ of _TOTAL_ Sales Types",
            lengthMenu: "Show _MENU_ Sales Types",
            emptyTable: "NO DATA AVAILABLE",
        },
        processing: true,
        serverSide: true,
        ajax: {
            url: 'sales_type_data'
        },
        columns: [
            { data: 'sales_type', name:'sales_type'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            loading_hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/sales_type_reload",
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
    var sales_type = $('#sales_type').val();

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
            $.ajax({
                url:'/saveSalesType',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    sales_type:sales_type,
                },
                success:function(data){
                    if(data == 'true'){
                        $('#salesTypeModal').modal('hide');
                        Swal.fire({
                            title: 'SALES TYPE ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#salesTypeModal').modal('hide');
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

var sales_type_orig;
$(document).on('click','table.sales_typeTable tbody tr',function(){
    current_modal = 'UPDATE';
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#salesTypeModal').find('input').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#sales_type_id').val(data.id);
    $('#sales_type').val(data.sales_type);
    sales_type_orig = data.sales_type;

    $('#salesTypeModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var sales_type_id = $('#sales_type_id').val();
    var sales_type = $('#sales_type').val();

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
            $.ajax({
                url: '/editSalesType',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    sales_type_id:sales_type_id,
                    sales_type:sales_type
                },
                success: function(data){
                    if(data == 'true'){
                        $('#salesTypeModal').modal('hide');
                        Swal.fire({
                            title: 'SALES TYPE UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#salesTypeModal').modal('hide');
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
    var sales_type_id = $('#sales_type_id').val();
    var sales_type = $('#sales_type').val();

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
            $.ajax({
                url: '/deleteSalesType',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    sales_type_id:sales_type_id,
                    sales_type:sales_type
                },
                success: function(data){
                    if(data == 'true'){
                        $('#salesTypeModal').modal('hide');
                        Swal.fire({
                            title: 'SALES TYPE DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#salesTypeModal').modal('hide');
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

$('#sales_type').on('keyup',function(){
    if(sales_type_orig != $.trim($('#sales_type').val()).toUpperCase()){
        $.ajax({
            url: "/sales_type/checkDuplicate",
            data:{
                sales_type : $.trim($('#sales_type').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#sales_type').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#sales_type').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }
});