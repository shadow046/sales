$(document).ready(function(){
    var table = $('table.updateListTable').DataTable({
        language: {
            info: "Showing _START_ to _END_ of _TOTAL_ Activities",
            lengthMenu: "Show _MENU_ Activities",
            emptyTable: "NO DATA AVAILABLE",
        },
        processing: true,
        serverSide: false,
        ajax:{
            url: '/update_list/data',
        },
        columns: [
            {
                data: 'datetime',
                "render": function(data, type, row){
                    if(type === "sort" || type === 'type'){
                        return row.date;
                    }
                    return data;
                }
            },
            { data: 'updated_by' },
            {
                data: 'filename' ,
                "render": function(data, type, row){
                    return row.filename+".sql";
                }
            },
            { data: 'branch_code' },
            {
                data: 'id',
                "render": function(data, type, row, meta){
                    return '<center><button type="button" class="btn btn-success btnDownload center" id="'+ data +'" filename="'+ row.filename +'" title="DOWNLOAD"><i class="fa-solid fa-download"></i> </button></center>';
                }
            },
        ],
        order: [],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            loading_hide();
        }
    });

    $(document).on('click','.btnDownload',function(){
        var filename = $(this).attr('filename')+'.sql';
        var sqlData = "data:text/sql;charset=utf-8,";

        $.ajax({
            url: '/update_data',
            type: 'GET',
            data:{
                id: $(this).attr('id'),
            },
            success: function(data){
                var update_data = $.map(data, function(value, index){
                    return [value];
                });

                let rowData = [];
                update_data.forEach(value => {
                    sqlData += value.data.replace(/\n/g, '').replace(/\s+/g, ' ')+'\n';
                })

                let encodedUri = encodeURI(sqlData);

                let link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', filename);
                document.body.appendChild(link);

                link.click();
            }
        });
    });
});