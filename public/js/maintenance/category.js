$('.addBtn').on('click',function(){
    $('#category').val('');
    if(!current_permissions.includes('3')){
        $('#categoryModal').find('input').prop('disabled', false);
    }
});

var table;
$(document).ready(function(){
    table = $('table.categoryTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Product Categories',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Categories",
            lengthMenu: "Show _MENU_ Categories",
            emptyTable: "No Categories Data Found!",
        },
        processing: true,
        serverSide: false,
        ajax: {
            "url": 'category_data'
        },
        columns: [
            { data: 'category', name:'category'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('#loading').hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/category_reload",
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
    var category = $('#category').val();
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
                url:'/saveCategory',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    category:category,
                },
                success:function(data){
                    if(data == 'true'){
                        $('#categoryModal').modal('hide');
                        Swal.fire({
                            title: 'CATEGORY ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else if(data == 'duplicate'){
                        Swal.fire({
                            title: 'CATEGORY ALREADY EXIST',
                            icon: 'error',
                            timer: 2000
                        });
                        $('#category').val('');
                        return false;
                    }
                    else{
                        $('#categoryModal').modal('hide');
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
var category_orig;
$(document).on('click','table.categoryTable tbody tr',function(){
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#categoryModal').find('input').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#category_id').val(data.id);
    $('#category').val(data.category);

    category_orig = data.category;

    $('#categoryModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var category_id = $('#category_id').val();
    var category = $('#category').val();

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
                url: '/editCategory',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    category_id:category_id,
                    category:category
                },
                success: function(data){
                    if(data == 'true'){
                        $('#categoryModal').modal('hide');
                        Swal.fire({
                            title: 'CATEGORY UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#categoryModal').modal('hide');
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
    var category_id = $('#category_id').val();
    var category = $('#category').val();

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
            $.ajax({
                url: '/deleteCategory',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    category_id:category_id,
                    category:category
                },
                success: function(data){
                    if(data == 'true'){
                        $('#categoryModal').modal('hide');
                        Swal.fire({
                            title: 'CATEGORY DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#categoryModal').modal('hide');
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

$('#category').on('keyup',function(){
    if(category_orig != $.trim($('#category').val()).toUpperCase()){
        $.ajax({
            url: "/category/checkDuplicate",
            data:{
                category : $.trim($('#category').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#category').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#category').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }
});