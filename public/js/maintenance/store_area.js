$('.addBtn').on('click',function(){
    $('#store_area').val('');
    if(!current_permissions.includes('3')){
        $('#storeAreaModal').find('input').prop('disabled', false);
    }
});

var table;
$(document).ready(function(){
    table = $('table.storeAreaTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Store Areas',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Store Areas",
            lengthMenu: "Show _MENU_ Store Areas",
            emptyTable: "NO DATA AVAILABLE",
        },
        processing: true,
        serverSide: false,
        ajax: {
            url: 'store_area_data'
        },
        order: [],
        columns: [
            { data: 'store_area', name:'store_area'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('#loading').hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/store_area_reload",
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
    var store_area = $('#store_area').val();

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
                url:'/saveStoreArea',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    store_area:store_area,
                },
                success:function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#storeAreaModal').modal('hide');
                        Swal.fire({
                            title: 'STORE TYPE ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#storeAreaModal').modal('hide');
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
            $('#storeAreaModal').modal('hide');
        }
    });
});

var store_area_orig;
$(document).on('click','table.storeAreaTable tbody tr',function(){
    current_modal = 'UPDATE';
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#storeAreaModal').find('input').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#store_area_id').val(data.id);
    $('#store_area').val(data.store_area);
    store_area_orig = data.store_area;

    $('#storeAreaModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var store_area_id = $('#store_area_id').val();
    var store_area = $('#store_area').val();

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
                url: '/editStoreArea',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    store_area_id:store_area_id,
                    store_area:store_area
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#storeAreaModal').modal('hide');
                        Swal.fire({
                            title: 'STORE AREA UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#storeAreaModal').modal('hide');
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
            $('#storeAreaModal').modal('hide');
        }
    });
});

$('.deleteBtn').on('click',function(){
    var store_area_id = $('#store_area_id').val();
    var store_area = $.trim($('#store_area').val());

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
                url: '/deleteStoreArea',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    store_area_id:store_area_id,
                    store_area:store_area
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#storeAreaModal').modal('hide');
                        Swal.fire({
                            title: 'STORE AREA DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#storeAreaModal').modal('hide');
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
            $('#storeAreaModal').modal('hide');
        }
    });
});

$('#store_area').on('keyup',function(){
    if(store_area_orig != $.trim($('#store_area').val()).toUpperCase()){
        $.ajax({
            url: "/store_area/checkDuplicate",
            data:{
                store_area : $.trim($('#store_area').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#store_area').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#store_area').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }
});