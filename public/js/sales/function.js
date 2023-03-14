function tableToExcel(table, filename) {
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var output = d.getFullYear() + '-' +
    ((''+month).length<2 ? '0' : '') + month + '-' +
    ((''+day).length<2 ? '0' : '') + day;
    let uri = 'data:application/vnd.ms-excel;base64,', 
    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-16"/></head><body><table>{table}</table></body></html>', 
    base64 = function(s) { 
      return  window.btoa(unescape(encodeURIComponent(s)));
      // var str = decodeURIComponent(escape(window.atob( b64 )));
      // return window.btoa(decodeURIComponent(encodeURIComponent(str))); //orig
      // return 
    };// window.btoa(decodeURIComponent(encodeURIComponent(s))) },
    format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; })}
    
  
    if (!table.nodeType) table = document.getElementById(table)
    var ctx = {worksheet: 'sheet1' || 'Worksheet', table: table.innerHTML}
    var link = document.createElement('a');
    link.download = filename+output+'.xls';
    link.href = uri + base64(format(template, ctx));
    link.click();
}