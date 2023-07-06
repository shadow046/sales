var hasParam = window.location.search.length > 0;
function getUrlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
      return null;
    }
    return decodeURIComponent(results[1]) || 0;
}
$(function() {
    if (!hasParam) {
        loading_hide();
        swal.fire({
            title: 'STORE TYPE',
            html: '',
            confirmButtonText: "COMPANY OWNED",
            confirmButtonColor: orange,
            cancelButtonText: "FRANCHISE",
            cancelButtonColor: pink,
            showCancelButton: true,
            showConfirmButton:true,
            allowOutsideClick:false
        }).then((result) => {
            if (result['isConfirmed']){
                window.location.href='/sales/index?store=636f6d70616e79';
            }
            else{
                window.location.href='/sales/index?store=6672616e6368697365';
            };
        });
    }
    else{
        var hex = getUrlParam('store');
        var store = '';
        for (var i = 0; i < hex.length; i += 2) {
            store += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        if (store == "company") {
            console.log(store);
        }
        else if (str == "franchise") {
            console.log(store);
        }
        else{
            window.location.href='/sales/index';
        }
    }
    dashboard(store);
});

function dashboard(store) {
    if (store == "company") {
        var table = $('table.dashboardTable').DataTable({
            processing: true,
            serverSide: false,
            "dom": 'rtp',
            ajax: {
                url:"/sales-data",
                type:"get"
                // data:{
                //     type: 'ALL',
                //     dfrom: df,
                //     dto: dt
                // }
            },
            columns: [
                { data: 'storecode' },
                { data: 'tdate' },
                { data: null,
                    "render": function(data, type, row){
                        return `<span class="float-end">₱ ${formatNumber(parseFloat(row.totalsales).toFixed(2))}</span>`;
                    }
                }
            ],
            initComplete: function(){
                loading_hide();
            }
        });
    }
    else{

    }
    
};