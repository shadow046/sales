$('.addBtn').on('click',function(){
    $('#discount').val('');
    if(!current_permissions.includes('3')){
        $('#discountModal').find('input').prop('disabled', false);
    }
});

var table;

$(document).ready(function(){
    table = $('table.discountTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Discount',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Discounts",
            lengthMenu: "Show _MENU_ Discounts",
            emptyTable: "NO DATA AVAILABLE",
        },
        processing: true,
        serverSide: false,
        ajax: {
            url: 'discount_data'
        },
        order:[],
        columns: [
            { data: 'discount', name:'discount'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            loading_hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/discount_reload",
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
    var discount = $.trim($('#discount').val());

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
                url:'/saveDiscount',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    discount:discount,
                },
                success:function(data){
                    if(data == 'true'){
                        loading_hide();
                        $('#discountModal').modal('hide');
                        Swal.fire({
                            title: 'DISCOUNT ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        loading_hide();
                        $('#discountModal').modal('hide');
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

var discount_orig;
$(document).on('click','table.discountTable tbody tr',function(){
    current_modal = 'UPDATE';
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#discountModal').find('input').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#discount_id').val(data.id);
    $('#discount').val(data.discount);
    discount_orig = data.discount;

    $('#discountModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var discount_id = $('#discount_id').val();
    var discount = $('#discount').val();

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
                url: '/editDiscount',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    discount_id:discount_id,
                    discount:discount
                },
                success: function(data){
                    if(data == 'true'){
                        loading_hide();
                        $('#discountModal').modal('hide');
                        Swal.fire({
                            title: 'DISCOUNT UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        loading_hide();
                        $('#discountModal').modal('hide');
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
    var discount_id = $('#discount_id').val();
    var discount = $.trim($('#discount').val());

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
                url: '/deleteDiscount',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    discount_id:discount_id,
                    discount:discount
                },
                success: function(data){
                    if(data == 'true'){
                        loading_hide();
                        $('#discountModal').modal('hide');
                        Swal.fire({
                            title: 'DISCOUNT DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        loading_hide();
                        $('#discountModal').modal('hide');
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
            $('#discountModal').modal('hide');
        }
    });
});

$('#discount').on('keyup',function(){
    if(discount_orig != $.trim($('#discount').val()).toUpperCase()){
        $.ajax({
            url: "/discount/checkDuplicate",
            data:{
                discount : $.trim($('#discount').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#discount').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#discount').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }
});