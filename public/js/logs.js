$(document).ready(function(){
    var table = $('table.userlogsTable').DataTable({
        scrollY:        "500px",
        scrollCollapse: true,
        language: {
            info: "Showing _START_ to _END_ of _TOTAL_ Activities",
            lengthMenu: "Show _MENU_ Activities",
            emptyTable: "NO DATA AVAILABLE",
        },
        processing: true,
        serverSide: false,
        ajax:{
            url: '/index/data',
        },
        columnDefs: [
            {
                "targets": [0],
                "visible": false,
                "searchable": true
            },
        ],
        columns: [
            { data: 'datetime' },
            {
                data: null,
                "render": function(data, type, row){
                    return`<span class="d-none">${row.date}</span>`+moment(row.date, 'YYYY-MM-DD HH:mm:ss').format("MMM. DD, YYYY, h:mm A");
                }, width: '16vh'
            },
            { data: 'username', width: '22vh' },
            { data: 'role', width: '10vh' },
            {
                data: 'activity',
                "render":function(data,type,row){
                    activity = row.activity.replaceAll(" 【", "<br>【");
                    return(`<div style="white-space: normal; width: 52vw;">${activity}</div>`);;
                }
            },
        ],
        order: [],
        initComplete: function(){
            $(document).prop('title', $('#page-name').text());
            loading_hide();
        }
    });

    $('.filter-select').on('change', function(){
        table.column($(this).data('column')).search(!$(this).val()?'':'^'+$(this).val()+'$',true,false,true).draw();
    });

    $('.filter-input').on('keyup search', function(){
        table.column($(this).data('column')).search($(this).val()).draw();
    });

    var logs;
    setInterval(function(){
        if($('#loading').is(':hidden') && standby == false){
            $.ajax({
                url: "/index/logs/reload",
                success: function(data){
                    if(data != logs){
                        logs = data;
                        table.ajax.reload(null, false);
                    }
                }
            });
        }
    }, 1000);

    $('#userlogsTable tbody').on('click', 'tr', function(){
        if(!table.data().any()){ return false; }
        var value = table.row(this).data();
        Swal.fire({
            title: moment(value.date).format('dddd, MMMM DD, YYYY, h:mm:ss A'),
            html: `<h4>` + value.username + `[`+ value.role +`]` + `</h4>` + `<br>` + `<ol style="text-align: left !important;font-weight:600 !important;">` +  decodeHtml(value.activity).replaceAll(" 【", "<li>【") + `</li></ol>`,
            icon: 'info',
            customClass: 'swal-wide'
        });
    });

});