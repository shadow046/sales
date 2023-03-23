$('.addBtn').on('click', function(){
    if(!current_permissions.includes('3')){
        $('#priceUpdateModal').find('input').prop('disabled', false);
        $('#priceUpdateModal').find('select').prop('disabled', false);
    }
    $('.inputFields').val('');
    $('.decimalNumber').val('0.00');
    $('#product').val('');
    $('#product').chosen();
    $('#product').trigger('chosen:updated');
    $('#product_chosen').css({'width': '100%', 'margin-bottom': '-22px'});
    $('label[for="product"]').css({'margin-top': '-18px', 'margin-right': '-20px'});
});

var table;
$(document).ready(function(){
    table = $('table.priceUpdateTable').DataTable({
        dom: 'lftrip',
        aLengthMenu:[[10,25,50,100,500,1000,-1], [10,25,50,100,500,1000,"All"]],
        language: {
            info: "Showing _START_ to _END_ of _TOTAL_ Price Updates",
            lengthMenu: "Show _MENU_ Price Updates",
            emptyTable: "No Price Updates Data Found!",
        },
        processing: true,
        serverSide: false,
        ajax: {
            url: 'price_update_data'
        },
        columns: [
            { data: 'fcode', name:'fcode'},
            { data: 'desc1', name:'desc1'},
            { 
                data: 'effdate', name:'effdate',
                "render":function(data,type,row){
                    return "<span class='d-none'>"+row.effdate+"</span>"+moment(row.effdate).format('LL');
                },
            },
            { 
                data: 'upa1', name:'upa1',
                "render":function(data,type,row){
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.upa1).toFixed(2))}</span>`;
                },
            },
            { 
                data: 'upa2', name:'upa2',
                "render":function(data,type,row){
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.upa2).toFixed(2))}</span>`;
                },
            },
            { 
                data: 'upa3', name:'upa3',
                "render":function(data,type,row){
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.upa3).toFixed(2))}</span>`;
                },
            },
            { 
                data: 'upa4', name:'upa4',
                "render":function(data,type,row){
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.upa4).toFixed(2))}</span>`;
                },
            },
            { 
                data: 'upa5', name:'upa5',
                "render":function(data,type,row){
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.upa5).toFixed(2))}</span>`;
                },
            },
            { 
                data: 'upa6', name:'upa6',
                "render":function(data,type,row){
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.upa6).toFixed(2))}</span>`;
                },
            },
            { 
                data: 'upa7', name:'upa7',
                "render":function(data,type,row){
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.upa7).toFixed(2))}</span>`;
                },
            },
            { 
                data: 'upa8', name:'upa8',
                "render":function(data,type,row){
                    return `<span class="float-end">₱ ${formatNumber(parseFloat(row.upa8).toFixed(2))}</span>`;
                },
            },
            { 
                data: 'recid', name:'recid',
                "render":function(data,type,row){
                    return '<center><button class="btn btn-danger deleteBtn" id="'+row.recid+'"><i class="fa-solid fa-trash-can"></i></button></center>';
                },
            },
           
        ],
        order: [],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('.decimalNumber').addClass('text-right')
            $('#loading').hide();
        }
    });
});

$('.filter-input').on('keyup search', function(){
    table.column($(this).data('column')).search($(this).val()).draw();
});

$(document).on('change','#product', function(){
    $.ajax({
        url:'/fetchCurrentPrices',
        type:"POST",
        headers:{
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data:{
            item_code: $('#product').val()
        },
        success:function(data){
            $('#upa1').val(data.dine_in);
            $('#upa2').val(data.take_out);
            $('#upa3').val(data.pick_up);
            $('#upa4').val(data.delivery);
            $('#upa5').val(data.bulk_order);
            $('#upa6').val(data.fds);
            $('#upa7').val(data.drive_thru);
            $('#upa8').val(data.meal_type);
            $('#upa1').attr('price', data.dine_in);
            $('#upa2').attr('price', data.take_out);
            $('#upa3').attr('price', data.pick_up);
            $('#upa4').attr('price', data.delivery);
            $('#upa5').attr('price', data.bulk_order);
            $('#upa6').attr('price', data.fds);
            $('#upa7').attr('price', data.drive_thru);
            $('#upa8').attr('price', data.meal_type);
        }
    });
});

setInterval(() => {
    if($('#product_chosen').is(':visible')){
        if(!$('#product').val()){
            $('#product_chosen').removeClass('select-active0');
            $('#product_chosen').removeClass('select-active1');
            $('#product_chosen').removeClass('defaultInput');
            $('#product_chosen').addClass('requiredInput');
            if($('#product_chosen').hasClass('chosen-container-active')){
                $('#product_chosen').removeClass('requiredInput');
                $('#product_chosen').removeClass('select-border');
                $('#product_chosen').removeClass('select-active1');
                $('#product_chosen').addClass('select-active0');
            }
            else{
                $('#product_chosen').addClass('select-border');
                $('#product_chosen').addClass('requiredInput');
            }
        }
        else{
            $('#product_chosen').removeClass('select-active0');
            $('#product_chosen').removeClass('select-active1');
            $('#product_chosen').removeClass('requiredInput');
            $('#product_chosen').addClass('defaultInput');
            if($('#product_chosen').hasClass('chosen-container-active')){
                $('#product_chosen').removeClass('defaultInput');
                $('#product_chosen').removeClass('select-border');
                $('#product_chosen').removeClass('select-active0');
                $('#product_chosen').addClass('select-active1');
            }
            else{
                $('#product_chosen').addClass('select-border');
                $('#product_chosen').addClass('defaultInput');
            }
        }
    }
}, 0);

$('.saveBtn').on('click', function(){
    var fcode = $('#product').val();
    var desc1 = $('#product option:selected').attr('desc');
    var effdate = $('#effdate').val();
    var upa1 = $('#upa1').val();
    var upa2 = $('#upa2').val();
    var upa3 = $('#upa3').val();
    var upa4 = $('#upa4').val();
    var upa5 = $('#upa5').val();
    var upa6 = $('#upa6').val();
    var upa7 = $('#upa7').val();
    var upa8 = $('#upa8').val();
    if(
        parseFloat(upa1) == parseFloat($('#upa1').attr('price')) &&
        parseFloat(upa2) == parseFloat($('#upa2').attr('price')) &&
        parseFloat(upa3) == parseFloat($('#upa3').attr('price')) &&
        parseFloat(upa4) == parseFloat($('#upa4').attr('price')) &&
        parseFloat(upa5) == parseFloat($('#upa5').attr('price')) &&
        parseFloat(upa6) == parseFloat($('#upa6').attr('price')) &&
        parseFloat(upa7) == parseFloat($('#upa7').attr('price')) &&
        parseFloat(upa8) == parseFloat($('#upa8').attr('price'))
    ){
        Swal.fire('NO CHANGES FOUND', '', 'error');
        return false;
    }
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
                url:'/savePriceUpdate',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    fcode: fcode,
                    desc1: desc1,
                    effdate: effdate,
                    upa1: upa1,
                    upa2: upa2,
                    upa3: upa3,
                    upa4: upa4,
                    upa5: upa5,
                    upa6: upa6,
                    upa7: upa7,
                    upa8: upa8,
                },
                success:function(data){
                    if(data == 'true'){
                        table.ajax.reload()
                        $('#loading').hide();
                        $('#priceUpdateModal').modal('hide');
                        Swal.fire({
                            title: 'PRICE UPDATE ADDED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else if(data == 'pending'){
                        $('#loading').hide();
                        Swal.fire({
                            title: 'PRICE CHANGE ALREADY PENDING',
                            icon: 'error',
                            timer: 3000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#priceUpdateModal').modal('hide');
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

var recid;
$('#priceUpdateTable tbody').on('click', 'tr td:not(:nth-child(12))', function(){
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#priceUpdateModal').find('input').prop('disabled', true);
        $('#priceUpdateModal').find('select').prop('disabled', true);
    }
    var data = table.row(this).data();

    $('.saveBtn').hide();
    $('.updateBtn').show();

    recid = data.recid;
    $('#product').val(data.fcode);
    $('#effdate').val(data.effdate);
    $('#upa1').val(data.upa1);
    $('#upa2').val(data.upa2);
    $('#upa3').val(data.upa3);
    $('#upa4').val(data.upa4);
    $('#upa5').val(data.upa5);
    $('#upa6').val(data.upa6);
    $('#upa7').val(data.upa7);
    $('#upa8').val(data.upa8);
    $('.decimalNumber').attr('price', '0.00');

    $('#product').chosen();
    $('#product').trigger('chosen:updated');
    $('#product_chosen').css({'width': '100%', 'margin-bottom': '-22px'});
    $('label[for="product"]').css({'margin-top': '-18px', 'margin-right': '-20px'});

    $('#priceUpdateModal').modal('show');
});

$('.updateBtn').on('click', function(){
    var fcode = $('#product').val();
    var desc1 = $('#product option:selected').attr('desc');
    var effdate = $('#effdate').val();
    var upa1 = $('#upa1').val();
    var upa2 = $('#upa2').val();
    var upa3 = $('#upa3').val();
    var upa4 = $('#upa4').val();
    var upa5 = $('#upa5').val();
    var upa6 = $('#upa6').val();
    var upa7 = $('#upa7').val();
    var upa8 = $('#upa8').val();
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
    }).then((update) => {
        if(update.isConfirmed){
            $('#loading').show();
            $.ajax({
                url:'/editPriceUpdate',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    id: recid,
                    fcode: fcode,
                    desc1: desc1,
                    effdate: effdate,
                    upa1: upa1,
                    upa2: upa2,
                    upa3: upa3,
                    upa4: upa4,
                    upa5: upa5,
                    upa6: upa6,
                    upa7: upa7,
                    upa8: upa8
                },
                success:function(data){
                    if(data == 'true'){
                        table.ajax.reload()
                        $('#loading').hide();
                        $('#priceUpdateModal').modal('hide');
                        Swal.fire({
                            title: 'PRICE UPDATE UPDATED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else if(data == 'pending'){
                        $('#loading').hide();
                        Swal.fire({
                            title: 'PRICE CHANGE ALREADY PENDING',
                            icon: 'error',
                            timer: 2000
                        });
                    }
                    else if(data == 'nochanges'){
                        $('#loading').hide();
                        Swal.fire({
                            title: 'NO CHANGES FOUND',
                            icon: 'error',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        $('#priceUpdateModal').modal('hide');
                        Swal.fire({
                            title: 'UPDATE FAILED',
                            icon: 'error',
                            timer: 2000
                        });
                    }
                }
            });
        }
        else if(update.isDenied){
            Swal.fire('UPDATE CANCELLED','','info');
        }
    });
});

$(document).on('click', '.deleteBtn', function(){
    var id = $(this).attr('id');
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
    }).then((save) => {
        if(save.isConfirmed){
            $('#loading').show();
            $.ajax({
                url:'/deletePriceUpdate',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    id: id
                },
                success:function(data){
                    if(data == 'true'){
                        table.ajax.reload()
                        $('#loading').hide();
                        Swal.fire({
                            title: 'PRICE UPDATE DELETED SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                    }
                    else{
                        $('#loading').hide();
                        Swal.fire({
                            title: 'DELETE FAILED',
                            icon: 'error',
                            timer: 2000
                        });
                    }
                }
            });
        }
        else if(save.isDenied){
            Swal.fire('DELETE CANCELLED','','info');
        }
    });
});

$(document).on('click', '.btnSendUpdate', function(){
    Swal.fire({
        title: 'Send All Price Updates?',
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
                url:'/sendPriceUpdate',
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success:function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        Swal.fire({
                            title: 'PRICE UPDATES SENT SUCCESSFULLY',
                            icon: 'success',
                            timer: 2000
                        });
                        setTimeout(function(){window.location.reload();}, 2000);
                    }
                    else{
                        $('#loading').hide();
                        Swal.fire({
                            title: 'SEND FAILED',
                            icon: 'error',
                            timer: 2000
                        });
                    }
                }
            });
        }
        else if(save.isDenied){
            Swal.fire('SEND CANCELLED','','info');
        }
    });
});

$('.decimalNumber').on('focusout', function(){
    !$(this).val() ? $(this).val('0.00') : $(this).val(parseFloat($(this).val()).toFixed(2))
});

$(document).on('blur','#upa1',function(){
    var dine_in = parseFloat($(this).val());
    if(dine_in > 0){
        $('#upa2').val(dine_in);
        $('#upa3').val(dine_in);
        $('#upa4').val(dine_in);
        $('#upa5').val(dine_in);
        $('#upa6').val(dine_in);
        $('#upa7').val(dine_in);
        $('#upa8').val(dine_in);

        $('#upa2').blur();
        $('#upa3').blur();
        $('#upa4').blur();
        $('#upa5').blur();
        $('#upa6').blur();
        $('#upa7').blur();
        $('#upa8').blur();
    }
});