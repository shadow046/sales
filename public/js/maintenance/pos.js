$('.addBtn').on('click',function(){
    if(!current_permissions.includes('3')){
        $('#posModal').find('input').prop('disabled', false);
        $('.notUpdate').show();
    }
});

var table;
$(document).ready(function(){
    $('table.posTable').dataTable().fnDestroy();
    table = $('table.posTable').DataTable({
        dom: 'Blftrip',
        buttons: [{
            extend: 'excelHtml5',
            title: 'Export - POS',
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
            info: "Showing _START_ to _END_ of _TOTAL_ POS",
            lengthMenu: "Show _MENU_ POS",
            emptyTable: "No POS Data Found!",
        },
        processing: true,
        serverSide: false,
        ajax: {
            url: 'pos_data'
        },
        order: [],
        columns: [
            { data: 'model', name:'model'},
            { data: 'brand', name:'brand'},
            { data: 'vendor', name:'vendor'}
        ],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            $('#loading').hide();
        }
    });

    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/pos_reload",
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
    var model = $('#model').val();
    var brand = $('#brand').val();
    var vendor = $('#vendor').val();

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
                url:"/savePos",
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    model:model,
                    brand:brand,
                    vendor:vendor
                },
                success:function(data){
                    if(data.result == 'true'){
                        $.ajax({
                            type: 'POST',
                            url: '/syncPosSpecification',
                            async: false,
                            headers:{
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            data:{
                                pos_id : data.id,
                            }
                        });

                        var posSpecification_data = $('#posSpecification').DataTable().rows().data();
                        $.each(posSpecification_data, function(key, value){
                            $.ajax({
                                type: 'POST',
                                url: '/savePosSpecification',
                                async: false,
                                headers:{
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data:{
                                    pos_id : data.id,
                                    short_description : value[0],
                                    capacity : value[1],
                                    quantity: value[2]
                                },
                            });
                        });

                        $('#loading').hide();
                        Swal.fire("SAVE SUCCESS", "", "success");
                        $('#posModal').modal('hide');
                        setTimeout(function(){window.location.reload()}, 2000);
                    }
                    else{
                        $('#loading').hide();
                        Swal.fire("SAVE FAILED", "", "error");
                    }
                }
            });

        }
        else if (save.isDenied) {
            Swal.fire("SAVE CANCELLED", "", "info");
            $('#posModal').modal('hide');
        }
    });
});

$('.addPosSpecificationBtn').click(function(e){
    e.preventDefault();
    $('#posSpecification').show();
    $('.posSpecification').show();
    var short_description = $('#short_description').val();
    var capacity = $('#capacity').val();
    var quantity = $('#quantity').val();

    var posSpecificationTable =   "<tr class='posSpecification_tr'>"+
                                            "<td class='td_1 text-uppercase'>" + short_description + "</td>" +
                                            "<td class='td_2 text-uppercase'>" + capacity + "</td>" +
                                            "<td class='td_3'>" + quantity + "</td>" +
                                            "<td> <button class='btn btn-danger btn-delete btn_pos_specification center' title='DELETE'> <i class='fas fa-trash-alt'></i> DELETE </button> </td>" +
                                  "</tr>";
    if($('.updateBtn').is(":visible") || current_modal == 'UPDATE'){
        $('#posSpecification_tbody').append(posSpecificationTable);
    }
    else{
        $('#posSpecification tbody').append(posSpecificationTable);
    }

    $('#short_description').val("");
    $('#capacity').val("");
    $('#quantity').val("");

    $('.btn_pos_specification').click(function(){
        $(this).parent().parent().remove();
    });
});

var pos_id = [];
var model_orig;
$(document).on('click','table.posTable tbody tr',function(){
    current_modal = 'UPDATE';
    $('.req').hide();
    if(!current_permissions.includes('3')){
        $('#posModal').find('input').prop('disabled', true);
        $('.notUpdate').hide();
    }
    pos_id = [];
    if($(".btn-delete").length > 0){
        $('.btn-delete').each(function(){
            $(this).click();
        });
    }

    $('.validation').hide();
    $('.forminput').removeClass('redBorder');

    $('#short_description').val('');
    $('#capacity').val('');
    $('#quantity').val('');

    $('.saveBtn').hide();
    $('.updateBtn').show();
    var data = table.row(this).data();

    $('#pos_id').val(data.id);
    $('#model_orig').val(data.model);
    $('#brand_orig').val(data.brand);
    $('#vendor_orig').val(data.vendor);

    $('#model').val(data.model);
    model_orig = data.model;
    console.log(model_orig);
    $('#brand').val(data.brand);
    $('#vendor').val(data.vendor);

    if(current_permissions.includes('3')){
        $('table.posSpecification_orig').dataTable().fnDestroy();
        $('table.posSpecification_orig').DataTable({
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
                url: '/pos_specification/data',
                async: false,
                data:{
                    id: data.id,
                }
            },
            columns: [
                { data: 'short_description', name:'short_description', width:'375px'},
                { data: 'capacity', name:'capacity', width:'275px'},
                { data: 'quantity', name:'quantity', width:'275px'},
                { data: 'id', name:'id', width:'175px'}
            ]
        });
    }
    else{
        $('table.posSpecification_orig').dataTable().fnDestroy();
        $('table.posSpecification_orig').DataTable({
            columnDefs: [
                {
                    "targets": [3],
                    "visible": false,
                    "searchable": false
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
                url: '/pos_specification/data',
                async: false,
                data:{
                    id: data.id,
                }
            },
            columns: [
                { data: 'short_description', name:'short_description', width:'375px'},
                { data: 'capacity', name:'capacity', width:'275px'},
                { data: 'quantity', name:'quantity', width:'275px'},
                { data: 'id', name:'id', width:'175px'}
            ]
        });
    }
    $('#posModal').modal('show');
});


$(document).on('click', '.btndelItem', function(e){
    e.preventDefault();
    var id = $(this).attr("id");
    var data = $('table.posSpecification_orig').DataTable().row(id).data();
    pos_id.push(data.id);
    $(this).parent().parent().remove();
});

$('.updateBtn').on('click',function(){
    var id = $('#pos_id').val();
    var model = $('#model').val();
    var brand = $('#brand').val();
    var vendor = $('#vendor').val();

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
                url:"/editPos",
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    id:id,
                    model:model,
                    brand:brand,
                    vendor:vendor
                },
                success:function(data){
                    if(data.result == 'true'){
                        $.ajax({
                            type: 'POST',
                            url: '/syncPosSpecification',
                            async: false,
                            headers:{
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            data:{
                                pos_id : data.id,
                            }
                        });

                        $('.posSpecification_tr').each(function(){
                            $.ajax({
                                type: 'POST',
                                url: '/savePosSpecification',
                                async: false,
                                headers:{
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                data:{
                                    pos_id : data.id, //id to data.id
                                    short_description : $(this).children('.td_1').html(),
                                    capacity :  $(this).children('.td_2').html(),
                                    quantity:  $(this).children('.td_3').html()
                                },
                            });
                        });
                        $.ajax({
                            type: 'POST',
                            url: '/pos_specification/delete',
                            headers:{
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            data:{
                                id: pos_id.toString()
                            }
                        });

                        $('#loading').hide();
                        Swal.fire('UPDATE SUCCESS','','success');
                        $('#posModal').modal('hide');
                        setTimeout(function(){window.location.reload()}, 2000);
                    }
                    else{
                        $('#loading').hide();
                        Swal.fire('UPDATE FAILED','','error');
                    }
                }
            });
            Swal.fire("UPDATE SUCCESS", "", "success");
            $('#posModal').modal('hide');
        }
        else if (edit.isDenied) {
            Swal.fire("UPDATE CANCELLED", "", "info");
        }
    });
});

$('.deleteBtn').on('click',function(){
    var id = $('#pos_id').val();
    var model = $('#model').val();
    var brand = $('#brand').val();
    var vendor = $('#vendor').val();

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
        if (edit.isConfirmed) {
            $('#loading').show();
            $.ajax({
                url:"/deletePos",
                type:"POST",
                headers:{
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:{
                    id:id,
                    model:model,
                    brand:brand,
                    vendor:vendor
                },
                success:function(data){
                    if(data == 'true'){
                        $('#loading').hide();
                        Swal.fire('DELETE SUCCESS','','success');
                        $('#posModal').modal('hide');
                    }
                    else{
                        $('#loading').hide();
                        Swal.fire('DELETE FAILED','','error');
                    }
                }
            });
        }
        else if (edit.isDenied) {
            Swal.fire("UPDATE CANCELLED", "", "info");
            $('#posModal').modal('hide');
        }
    });
});

setInterval(() => {
    if(!$('#short_description').val() || !$('#capacity').val() || !$('#quantity').val()){
        $('.addPosSpecificationBtn').prop('disabled',true);
    }
    else{
        $('.addPosSpecificationBtn').prop('disabled',false);
    }

    if($('.saveBtn').is(":visible") || current_modal == 'SAVE'){
        $('#posSpecs_orig_div').hide();
        if($('#posSpecification tbody').children().length > 0){
            $('#posSpecification').show();
            $('#short_description').removeClass('required_field redBorder');
            $('#capacity').removeClass('required_field redBorder');
            $('#quantity').removeClass('required_field redBorder');
        }
        else{
            $('#posSpecification').hide();
            $('#short_description').addClass('required_field');
            $('#capacity').addClass('required_field');
            $('#quantity').addClass('required_field');
        }

        if($('#posSpecification tbody').children().length > 0 && $(".requiredInput:visible").length == 0){
            $('#posRequired').hide();
        }
        else{
            $('#posRequired').show();
        }

        if($('#posSpecification tbody').children().length > 0){
            $('#posSpecs_div').show();
        }
        else{
            $('#posSpecs_div').hide();
        }
    }
    else{
        $('#posSpecification_orig').show();
    }

    if($('.updateBtn').is(":visible") || current_modal == 'UPDATE'){
        $('#posSpecs_div').hide();
        if($('#posSpecification_orig tbody').children().length > 0){
            $('#posSpecification_orig').show();
            $('#short_description').removeClass('required_field redBorder');
            $('#capacity').removeClass('required_field redBorder');
            $('#quantity').removeClass('required_field redBorder');
        }
        else{
            $('#posSpecification_orig').hide();
            $('#short_description').addClass('required_field');
            $('#capacity').addClass('required_field');
            $('#quantity').addClass('required_field');
        }

        if($('#posSpecification_orig tbody').children().length > 0 && $(".requiredInput:visible").length == 0){
            $('#posRequired').hide();
        }
        else{
            $('#posRequired').show();
        }

        if($('#posSpecification_orig tbody').children().length > 0){
            $('#posSpecs_orig_div').show();
        }
        else{
            $('#posSpecs_orig_div').hide();
        }
    }
}, 0);

$('#model').on('keyup',function(){
    if(model_orig != $.trim($('#model').val()).toUpperCase()){
        $.ajax({
            url: "/model/checkDuplicate",
            data:{
                model : $.trim($('#model').val()).toUpperCase(),
            },
            success: function(data){
                if(data == 'duplicate_model'){
                    $('#duplicate_model').show();
                    $('#model').addClass('redBorder');
                }
                else{
                    $('#duplicate_model').hide();
                    $('#model').removeClass('redBorder');
                }
            }
        });
    }
});