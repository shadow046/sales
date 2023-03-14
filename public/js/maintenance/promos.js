var table;
$(document).ready(function(){
    table = $('table.promoTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - Promos',
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
            info: "Showing _START_ to _END_ of _TOTAL_ Promos",
            lengthMenu: "Show _MENU_ Promos",
            emptyTable: "No Promos Data Found!",
        },
        processing: true,
        serverSide: false,
        ajax: {
            url: 'promo_data'
        },
        order: [],
        columns: [
            { data: 'promo_code', name:'promo_code'},
            { data: 'description', name:'description'},
            { data: 'price', name:'price'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('#loading').hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/promo_reload",
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

$('.filter-input').on('keyup search', function(){
    table.column($(this).data('column')).search($(this).val()).draw();
});

$('.saveBtn').on('click',function(){
    var promo_code = $('#promo_code').val();
    var description = $('#description').val();
    var price = $('#price').val();

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
        if (save.isConfirmed) {
            $('#loading').show();
            $.ajax({
                url:"/savePromo",
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    promo_code:promo_code,
                    description:description,
                    price:price
                },
                success:function(data){
                    if(data.result == 'true'){
                        var promoProductCombination_data  =  $('#promoProductCombination').DataTable().rows().data();
                        $.each(promoProductCombination_data, function(key, value){
                            $.ajax({
                                type: 'POST',
                                url: '/savePromoProductCombination',
                                async: false,
                                headers:{
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data:{
                                    promo_id : data.id,
                                    product : value[0]
                                },
                            });
                        });
                        $('#loading').hide();
                        Swal.fire('SAVE SUCCESS','','success');
                        $('#promosModal').modal('hide');
                    }
                    else{
                        $('#loading').hide();
                        Swal.fire('SAVE FAILED','','error');
                    }
                }
            });
        }
        else if(save.isDenied){
            Swal.fire('SAVE CANCELED','','success');
        }
    });
});

$('.addPromoCombinationBtn').click(function(e){
    e.preventDefault();
    $('#promoProductCombination').show();
    $('.promoProductCombination_thead').show();

    var product_id = $('#short_description').val();
    var category = $('#category option:selected').text();
    var short_description = $('#short_description option:selected').text();
    var item_code = $('#item_code').val();

    var ProductCombinationTable =   "<tr class='promoProductCombination_tr'>"+
                                            "<td class='td_1 d-none'>" + product_id + "</td>" +
                                            "<td>" + category + "</td>" +
                                            "<td>" + short_description + "</td>" +
                                            "<td>" + item_code + "</td>" +
                                            "<td> <button class='btn btn-danger btn-delete btn_promo center' title='DELETE'> <i class='fas fa-trash-alt'></i> DELETE </button> </td>" +
                                    "</tr>";
    if($('.updateBtn').is(":visible")){
        $('#promoProductCombination_tbody').append(ProductCombinationTable);
    }
    else{
        $('#promoProductCombination tbody').append(ProductCombinationTable);
    }

    $('#category').val("");
    $('#short_description').val("");
    $('#item_code').val("");

    $('.btn_promo').click(function(){
        $(this).parent().parent().remove();
    });
});

var promo_id = [];
$(document).on('click','table.promoTable tbody tr',function(){
    $('.req').hide();
    promo_id = [];
    if($(".btn-delete").length > 0){
        $('.btn-delete').each(function(){
            $(this).click();
        });
    }

    $('.saveBtn').hide();
    $('.updateBtn').show();

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    var data = table.row(this).data();

    $('#promo_id').val(data.id);
    // $('#promo_code_new').val(data.promo_code);
    $('#promo_code').val(data.promo_code);
    $('#description').val(data.description);
    $('#price').val(data.price);

    $('table.promoProductCombination_orig').dataTable().fnDestroy();
    $('table.promoProductCombination_orig').DataTable({
        columnDefs: [
            {
                "render": function(data, type, row, meta){
                        return '<button class="btn btn-danger btndelItem" id="'+ meta.row +'"><i class="fa-solid fa-trash-can"></i> DELETE </button>';
                },
                "defaultContent": '',
                "data": null,
                "targets": [3]
            }
        ],
        searching: false,
        paging: false,
        ordering: false,
        info: false,
        autoWidth: false,
        language:{
            emptyTable: "No data available in table",
            processing: "Loading...",
        },
        serverSide: true,
        ajax: {
            url: '/promo_product_combination/data',
            async: false,
            data:{
                id: data.id,
            }
        },
        columns: [
            { data: 'category_name', name:'category_name'},
            { data: 'short_description', name:'short_description'},
            { data: 'item_code', name:'item_code'}
        ]
    });

    $('#promosModal').modal('show');
    $('th').removeClass('sorting_asc');

});

$('.updateBtn').on('click',function(){
    var id = $('#promo_id').val();
    var promo_code = $('#promo_code').val();
    var description = $('#description').val();
    var price = $('#price').val();

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
        if (edit.isConfirmed) {
            $('#loading').show();
            $.ajax({
                url:"/editPromo",
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    id:id,
                    promo_code:promo_code,
                    description:description,
                    price:price
                },
                success:function(data){
                    if(data.result == 'true'){
                        $('.promoProductCombination_tr').each(function(){
                            $.ajax({
                                type: 'POST',
                                url: '/savePromoProductCombination',
                                async: false,
                                headers:{
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data:{
                                    promo_id : id,
                                    product : $(this).children('.td_1').html()
                                },
                            });
                        });
                        $.ajax({
                            type: 'POST',
                            url: '/promo_product_combination/delete',
                            headers:{
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            data:{
                                id: promo_id.toString()
                            }
                        });
                        $('#loading').hide();
                        Swal.fire('UPDATE SUCCESS','','success');
                        $('#promosModal').modal('hide');
                    }
                    else{
                        $('#loading').hide();
                        Swal.fire('UPDATE FAILED','','error');
                    }
                }
            });
        }
        else if(edit.isDenied){
            Swal.fire('UPDATE CANCELED','','info');
        }
    });
});

$(document).on('click', '.btndelItem', function(e){
    e.preventDefault();
    var id = $(this).attr("id");
    var data = $('table.promoProductCombination_orig').DataTable().row(id).data();
    promo_id.push(data.id);
    $(this).parent().parent().remove();
});

setInterval(() => {
    if(!$('#category').val() || !$('#short_description').val() || !$('#item_code').val()){
        $('.addPromoCombinationBtn').prop('disabled',true);
    }
    else{
        $('.addPromoCombinationBtn').prop('disabled',false);
    }

    if($('.saveBtn').is(":visible")){
        $('#promoProductCombination_orig').hide();
        if($('#promoProductCombination tbody').children().length > 0){
            $('#promoProductCombination').show();
            $('#category').removeClass('required_field redBorder');
            $('#short_description').removeClass('required_field redBorder');
            $('#item_code').removeClass('required_field redBorder');
        }
        else{
            $('#promoProductCombination').hide();
            $('#category').addClass('required_field');
            $('#short_description').addClass('required_field');
            $('#item_code').addClass('required_field');
        }

        if($('#promoProductCombination tbody').children().length > 0 && $(".requiredInput:visible").length == 0){
            $('#promosRequired').hide();
        }
        else{
            $('#promosRequired').show();
        }
    }
    else{
        $('#promoProductCombination_orig').show();
    }

    if($('.updateBtn').is(":visible")){
        $('#promoProductCombination').hide();
        if($('#promoProductCombination_orig tbody').children().length > 0){
            $('#promoProductCombination_orig').show();
            $('#category').removeClass('required_field redBorder');
            $('#short_description').removeClass('required_field redBorder');
            $('#item_code').removeClass('required_field redBorder');
        }
        else{
            $('#promoProductCombination_orig').hide();
            $('#category').addClass('required_field');
            $('#short_description').addClass('required_field');
            $('#item_code').addClass('required_field');
        }

        if($('#promoProductCombination_orig tbody').children().length > 0 && $(".requiredInput:visible").length == 0){
            $('#promosRequired').hide();
        }
        else{
            $('#promosRequired').show();
        }
    }

}, 0);

$('#category').on('change', function(){
    var category_id = $(this).val();
        $.ajax({
            type: 'GET',
            url: '/setShortDescription',
            data:{
                'category_id': category_id,
            },
            success: function(data){
                $('#short_description').prop('disabled',false);
                $('#short_description').find('option').remove().end()
                $('#short_description').append($('<option value="" selected disabled>Select Short Description</option>'));
                var list = $.map(data, function(value, index){
                    return [value];
                });
                list.forEach(value => {
                    $('#short_description').append($('<option>', {
                        value: value.product_id,
                        text: value.short_description.toUpperCase(),
                        code: value.item_code
                    }));
                });
            }
        });
});

$('#short_description').on('change', function(){
    var item_code = $('#short_description option:selected').attr('code');
    $('#item_code').val(item_code);
});


$('#promo_code').on('keyup',function(){
    $.ajax({
        url: "/promo_code/checkDuplicate",
        data:{
            promo_code : $('#promo_code').val(),
        },
        success: function(data){
            if(data == 'duplicate_promo_code'){
                $('#duplicate_promo_code').show();
                $('#promo_code').addClass('redBorder');
            }
            else{
                $('#duplicate_promo_code').hide();
                $('#promo_code').removeClass('redBorder');
            }
        }
    });
});

// setInterval(() => {
//         if($('#promo_code').val() == $('#promo_code_new').val()){
//             $('.editBtn').prop('disabled',false);
//         }
//         else{
//             $('.editBtn').prop('disabled',true);
//         }
// }, 0);