$('.addBtn').on('click',function(){
    $('#delivery_serving_store').val('');
    if(!current_permissions.includes('3')){
        $('#deliveryServingStoreModal').find('input').prop('disabled', false);
    }
});

var table;
$(document).ready(function(){
    table = $('table.delivery_serving_storeTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Delivery Channels',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Delivery Channels",
            lengthMenu: "Show _MENU_ Delivery Channels",
            emptyTable: "NO DATA AVAILABLE",
        },
        processing: true,
        serverSide: false,
        ajax: {
            url: 'delivery_serving_store_data'
        },
        order:[],
        columns: [
            { data: 'delivery_serving_store', name:'delivery_serving_store'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            loading_hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/serving_store_reload",
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
    var delivery_serving_store = $('#delivery_serving_store').val();

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
                url:'/saveDeliveryServingStore',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    delivery_serving_store:delivery_serving_store,
                },
                success:function(data){
                    if(data == 'true'){
                        loading_hide();
                        $('#deliveryServingStoreModal').modal('hide');
                        Swal.fire({
                            title: 'DELIVERY CHANNEL ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else if(data == 'duplicate'){
                        loading_hide();
                        Swal.fire({
                            title: 'DELIVERY CHANNEL ALREADY EXIST',
                            icon: 'error',
                            timer: 2000
                        });
                        $('#delivery_serving_store').val('');
                        return false;
                    }
                    else{
                        loading_hide();
                        $('#deliveryServingStoreModal').modal('hide');
                        Swal.fire({
                            title: 'SAVE FAILED',
                            icon: 'error',
                            timer: 2000
                        });
                    }
                }
            });
        }
        else if (save.isDenied){
            Swal.fire('SAVE CANCELLED','','info');
            $('#deliverServingStoreModal').modal('hide');
        }
    });
});

var delivery_serving_store_orig;
$(document).on('click','table.delivery_serving_storeTable tbody tr',function(){
    current_modal = 'UPDATE';
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#deliveryServingStoreModal').find('input').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#delivery_serving_store_id').val(data.id);
    $('#delivery_serving_store').val(data.delivery_serving_store);
    delivery_serving_store_orig = data.delivery_serving_store;

    $('#deliveryServingStoreModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var delivery_serving_store_id = $('#delivery_serving_store_id').val();
    var delivery_serving_store = $('#delivery_serving_store').val();

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
                url: '/editDeliveryServingStore',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    delivery_serving_store_id:delivery_serving_store_id,
                    delivery_serving_store:delivery_serving_store
                },
                success: function(data){
                    if(data == 'true'){
                        loading_hide();
                        $('#deliveryServingStoreModal').modal('hide');
                        Swal.fire({
                            title: 'DELIVERY CHANNEL UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        loading_hide();
                        $('#deliveryServingStoreModal').modal('hide');
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
            $('#deliverServingStoreModal').modal('hide');
        }
    });
});

$('.deleteBtn').on('click',function(){
    var delivery_serving_store_id = $('#delivery_serving_store_id').val();
    var delivery_serving_store = $.trim($('#delivery_serving_store').val());

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
                url: '/deleteDeliveryServingStore',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    delivery_serving_store_id:delivery_serving_store_id,
                    delivery_serving_store:delivery_serving_store
                },
                success: function(data){
                    if(data == 'true'){
                        loading_hide();
                        $('#deliveryServingStoreModal').modal('hide');
                        Swal.fire({
                            title: 'DELIVERY CHANNEL DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        loading_hide();
                        $('#deliveryServingStoreModal').modal('hide');
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
            $('#deliverServingStoreModal').modal('hide');
        }
    });
});

$('#delivery_serving_store').on('keyup',function(){
    if(delivery_serving_store_orig != $.trim($('#delivery_serving_store').val()).toUpperCase()){
        $.ajax({
            url: "/delivery_serving_store/checkDuplicate",
            data:{
                delivery_serving_store : $.trim($('#delivery_serving_store').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#delivery_serving_store').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#delivery_serving_store').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }
});