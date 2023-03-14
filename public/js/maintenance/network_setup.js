$('.addBtn').on('click',function(){
    $('#network_setup').val('');
    if(!current_permissions.includes('3')){
        $('#network_setupModal').find('input').prop('disabled', false);
    }
});

var table;
$(document).ready(function(){
    table = $('table.network_setupTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Store Network Setups',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Network Setups",
            lengthMenu: "Show _MENU_ Network Setups",
            emptyTable: "No Network Setups Data Found!",
        },
        processing: true,
        serverSide: false,
        ajax: {
            url: 'network_setup_data'
        },
        columns: [
            { data: 'network_setup', name:'network_setup'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('#loading').hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/network_setup_reload",
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
    var network_setup = $('#network_setup').val();

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
                url:'/saveNetworkSetup',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    network_setup:network_setup,
                },
                success:function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#network_setupModal').modal('hide');
                        Swal.fire({
                            title: 'NETWORK SETUP ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else if(data == 'duplicate'){
                        $('#loading').hide();
                        Swal.fire({
                            title: 'NETWORK SETUP ALREADY EXIST',
                            icon: 'error',
                            timer: 2000
                        });
                        $('#network_setup').val('');
                        return false;
                    }
                    else{
                        $('#loading').hide();
                        $('#network_setupModal').modal('hide');
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
            $('#network_setupModal').modal('hide');
        }
    });
});

var network_setup_orig;
$(document).on('click','table.network_setupTable tbody tr',function(){
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#network_setupModal').find('input').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#network_setup_id').val(data.id);
    $('#network_setup').val(data.network_setup);
    network_setup_orig = data.network_setup;

    $('#network_setupModal').modal('show');
});

$('.updateBtn').on('click',function(){
    var network_setup_id = $('#network_setup_id').val();
    var network_setup = $('#network_setup').val();

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
                url: '/editNetworkSetup',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    network_setup_id:network_setup_id,
                    network_setup:network_setup
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#network_setupModal').modal('hide');
                        Swal.fire({
                            title: 'NETWORK SETUP UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#network_setupModal').modal('hide');
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
            $('#network_setupModal').modal('hide');
        }
    });
});

$('.deleteBtn').on('click',function(){
    var network_setup_id = $('#network_setup_id').val();
    var network_setup = $.trim($('#network_setup').val());

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
                url: '/deleteNetworkSetup',
                type: "POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    network_setup_id:network_setup_id,
                    network_setup:network_setup
                },
                success: function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        $('#network_setupModal').modal('hide');
                        Swal.fire({
                            title: 'NETWORK SETUP DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#network_setupModal').modal('hide');
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
            $('#network_setupModal').modal('hide');
        }
    });
});

$('#network_setup').on('keyup',function(){
    if(network_setup_orig != $.trim($('#network_setup').val()).toUpperCase()){
        $.ajax({
            url: "/network_setup/checkDuplicate",
            data:{
                network_setup : $.trim($('#network_setup').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'true'){
                    $('.validation').show();
                    $('#network_setup').addClass('redBorder');
                    $('.saveBtn').prop('disabled',true);
                    $('.updateBtn').prop('disabled',true);
                }
                else{
                    $('.validation').hide();
                    $('#network_setup').removeClass('redBorder');
                    $('.saveBtn').prop('disabled',false);
                    $('.updateBtn').prop('disabled',false);
                }
            }
        });
    }
});