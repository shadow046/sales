$('.addBtn').on('click',function(){
    $('#setup').val('');
    if(!current_permissions.includes('3')){
        $('#setupModal').find('input').prop('disabled', false);
    }
});

var table;
$(document).ready(function(){
    table = $('table.setupTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Store Setups',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Store Setups",
            lengthMenu: "Show _MENU_ Store Setups",
            emptyTable: "NO DATA AVAILABLE",
        },
        processing: true,
        serverSide: false,
        ajax: {
            "url": 'setup_data'
        },
        columns: [
            { data: 'setup', name:'setup'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            loading_hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/setup_reload",
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
    var setup = $('#setup').val();

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
                url:'/saveSetup',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    setup:setup,
                },
                success:function(data){
                    if(data == 'true'){
                        loading_hide();
                        $('#setupModal').modal('hide');
                        Swal.fire({
                            title: 'STORE SETUP ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        loading_hide();
                        $('#setupModal').modal('hide');
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
            $('#setupModal').modal('hide');
        }
    });
});

var setup_orig;
$(document).on('click','table.setupTable tbody tr',function(){
    current_modal = 'UPDATE';
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#setupModal').find('input').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#setup_id').val(data.id);
    $('#setup').val(data.setup);
    setup_orig = data.setup;

    $('#setupModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var setup_id = $('#setup_id').val();
    var setup = $('#setup').val();

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
                url: '/editSetup',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    setup_id:setup_id,
                    setup:setup
                },
                success: function(data){
                    if(data == 'true'){
                        $('#setupModal').modal('hide');
                        Swal.fire({
                            title: 'STORE SETUP UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#setupModal').modal('hide');
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
            $('#setupModal').modal('hide');
        }
    });
});

$('.deleteBtn').on('click',function(){
    var setup_id = $('#setup_id').val();
    var setup = $.trim($('#setup').val());

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
                url: '/deleteSetup',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    setup_id:setup_id,
                    setup:setup
                },
                success: function(data){
                    if(data == 'true'){
                        $('#setupModal').modal('hide');
                        Swal.fire({
                            title: 'STORE SETUP DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#setupModal').modal('hide');
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
            $('#setupModal').modal('hide');
        }
    });
});

$('#setup').on('keyup',function(){
    if(setup_orig != $.trim($('#setup').val()).toUpperCase()){
        $.ajax({
            url: "/setup/checkDuplicate",
            data:{
                setup : $.trim($('#setup').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#setup').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#setup').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }
});