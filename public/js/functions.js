var current_location = $(location).attr('pathname')+window.location.search;
var current_user = $('#current_user').val();
var current_role = $('#current_role').val();
var current_permissions = (($('#current_permissions').val().replaceAll('[{"permission_id":', "")).replaceAll('{"permission_id":', ", ").replaceAll('},', "").replaceAll('}]', "")).split(', ').sort();
var current_date = $('#current_date').val();
var current_session = $('#current_session').val();
var current_token = $('#current_token').val();
var current_key = $('#current_key').val();
var current_server = $('#current_server').val();
var current_system = $('#current_system').val();
var current_timeout = $('#current_timeout').val();
var current_modal;
var data_update, standby = true;

setInterval(loadFunction, 0);
function loadFunction(){
    if($('#loading').is(':visible')){
        $('html, body').css({
            overflow: 'hidden',
            height: '100%'
        });
        $('#current_user').focus();
    }
    else{
        $('html, body').css({
            overflow: 'auto',
            height: 'auto'
        });
    }
}

function idleLogout(){
    var timer;
    window.onload = resetTimer;
    window.onmousedown = resetTimer;
    window.onmousemove = resetTimer;
    window.onclick = resetTimer;
    window.oncontextmenu = resetTimer;
    window.onwheel = resetTimer;
    window.onkeydown = resetTimer;
    function resetTimer(){
        clearTimeout(timer);
        timer = setTimeout(() => {
            $('#loading').show();
            window.location.href = '/logout';
        }, 3600000);
    }
}
if(current_server == 'BETA'){
    idleLogout();
}

function idleStandby(){
    var timeout;
    window.onmousemove = resetStandby;
    window.onclick = resetStandby;
    window.oncontextmenu = resetStandby;
    window.onwheel = resetStandby;
    window.onkeydown = resetStandby;
    function resetStandby(){
        standby = false;
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            if($('#loading').is(':hidden')){
                standby = true;
            }
        }, 3000);
    }
}
idleStandby();

$(document).on('click', '.openSideBar', function(){
    document.getElementById("sidebar").style.width = "240px";
    document.getElementById("sidehover").style.width = "0px";
    $(".content").css({"margin-left": "240px", "width": "100vw"});
    $("#toggleSideBar").removeClass("openSideBar");
    $("#toggleSideBar").addClass("closeSideBar");
});

$(document).on('click', '.closeSideBar', function(){
    document.getElementById("sidebar").style.width = "0px";
    document.getElementById("sidehover").style.width = "5px";
    $(".content").css({"margin-left": "0px", "width": "auto"});
    $("#toggleSideBar").addClass("openSideBar");
    $("#toggleSideBar").removeClass("closeSideBar");
});

$(document).on('mouseover', '#sidehover', function(){
    if($("#toggleSideBar").hasClass("openSideBar")){
        $("#toggleSideBar").click();
    }
});

$(document).on('click', '#dashboard', function(){
    $("#toggleSideBar").click();
});

$(document).ready(function(){
    if($('.mtn').length > 0){
        $('.maintenance_tab').show();
    }
    else{
        $('.maintenance_tab').hide();
    }

    $('#report').popover({
        html: true,
        sanitize: false
    });

    $('html').on('click', function(e){
        $('#report').each(function(){
            if(!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0){
                $('#report').popover('hide');
            }
        });
    });

    $('#maintenance').popover({
        html: true,
        sanitize: false
    });

    $('html').on('click', function(e){
        $('#maintenance').each(function(){
            if(!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0){
                $('#maintenance').popover('hide');
            }
        });
    });

    $('#navItemCategory').popover({
        html: true,
        sanitize: false
    });

    $('html').on('click', function(e){
        $('#navItemCategory').each(function(){
            if(!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0){
                $('#navItemCategory').popover('hide');
            }
        });
    });

    $('#navTenderType').popover({
        html: true,
        sanitize: false
    });

    $('html').on('click', function(e){
        $('#navTenderType').each(function(){
            if(!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0){
                $('#navTenderType').popover('hide');
            }
        });
    });

    $('#navStoreType').popover({
        html: true,
        sanitize: false
    });

    $('html').on('click', function(e){
        $('#navStoreType').each(function(){
            if(!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0){
                $('#navStoreType').popover('hide');
            }
        });
    });

    $('#navDiscount').popover({
        html: true,
        sanitize: false
    });

    $('html').on('click', function(e){
        $('#navDiscount').each(function(){
            if(!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0){
                $('#navDiscount').popover('hide');
            }
        });
    });

    $('#filter').popover({
        html: true,
        sanitize: false
    });

    $('html').on('click', function(e){
        $('#filter').each(function(){
            if(!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0){
                $('#filter').popover('hide');
            }
        });
    });
});

$(document).ready(function(){
    setInterval(displayClock, 0);
    function displayClock(){
        var today_Date = new Date();
        var today_Month = today_Date.getMonth() + 1;
        var today_Day = today_Date.getDate();
        var today_Year = today_Date.getFullYear();
        var today_Time = new Date().toLocaleTimeString();

        if(today_Month < 10) today_Month = '0' + today_Month.toString();
        if(today_Day < 10) today_Day = '0' + today_Day.toString();

        var today_DateFormat = today_Year + '-' + today_Month + '-' + today_Day;
        today_DateFormat = moment(today_DateFormat, 'YYYY-MM-DD').format('dddd, MMMM DD, YYYY');
        current_datetime.textContent = today_DateFormat + ', ' + today_Time;
    }
});

$(document).on('click', '.page-reload', function(){
    window.location.href = window.location.href.split(/[?#]/)[0];
});

$('body').on('cut paste', function(){
    setTimeout(function(){
        $(':focus').keyup();
    }, current_timeout);
});

$(document).on('click', '.addBtn', function(){
    current_modal = 'SAVE';
    if($(".btn-delete").length > 0){
        $('.btn-delete').each(function(){
            $(this).click();
        });
    }
    $('#'+$(this).attr('data')+'Form').trigger("reset");
    $('#'+$(this).attr('data')+'Modal').modal('show');

    $('.req').hide();
    $('.tab1').click();
    $('#tabContent').removeClass('mt-8');
    $('.modal_id').val('');
    $('.validation').hide();
    $('.saveBtn').show();
    $('.updateBtn').hide();
    $('#status').html('');
    $('#filename').val('');
    $('#product_image').val('');
    $('#product_image_preview').attr('src','');
    $('#product_image_preview').hide();
});

$("input[type='number']").on('keydown', function(e){
    if(e.keyCode == 109 || e.keyCode == 189){
        return false;
    }
});

$("input[type='search']").on('keydown', function(e){
    if(e.keyCode == 188){
        return false;
    }
});

$("textarea").on('keydown', function(e){
    if(e.keyCode == 188){
        return false;
    }
});

$(document).on('keyup', '.number_limit', function(){
    var value_qty = parseInt($(this).val());
    var value_min = parseInt($(this).attr('min'));
    var value_max = parseInt($(this).attr('max'));
    if(value_qty < value_min && !value_qty){
        $(this).val(value_min);
    }
    if(value_qty > value_max){
        $(this).val(value_max);
    }
});

$(document).on('keypress', '.numbersOnly', function(event){
    return (event.charCode == 8 || event.charCode == 9 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57;
});

$(document).on('keyup', '.numbersOnly', function(){
    var value_qty = parseInt($(this).val());
    var value_min = parseInt($(this).attr('min'));
    if(value_qty < value_min && !value_qty){
        $(this).val(value_min);
    }
});

$(document).on('focusout', '.numbersOnly', function(){
    if(!$(this).val()){
        $(this).val($(this).attr('min'));
    }
});

function validate_xlsx(xlsx){
    var files_length = $("#xlsx").get(0).files.length;
    var error_ext = 0;
    var error_mb = 0;
    if(files_length > 1){
        Swal.fire('EXCEEDED allowed number of file upload!', 'Please upload only ONE (1) valid EXCEL file.', 'error');
        $('#xlsx').val('');
        $('#xlsx').focus();
        return false;
    }
    for(var i = 0; i < files_length; ++i) {
        var file1=$("#xlsx").get(0).files[i].name;
        var file_size = $("#xlsx").get(0).files[i].size;
        var ext = file1.split('.').pop().toLowerCase();
        if($.inArray(ext,['xls','xlsx'])===-1){
            error_ext++;
        }
        if(file_size > (5242880 * 2)){
            error_mb++;
        }
    }
    if(error_ext > 0 && error_mb > 0){
        Swal.fire('INVALID file type AND EXCEEDED maximum file size (10MB)!', 'Please upload an EXCEL file with valid file type like the following: xls or xlsx; AND with file size not greater than 10MB.', 'error');
        $('#xlsx').val('');
        $('#xlsx').focus();
        return false;
    }
    else if(error_ext > 0){
        Swal.fire('INVALID file type!', 'Please upload an EXCEL file with valid file type like the following: xls or xlsx.', 'error');
        $('#xlsx').val('');
        $('#xlsx').focus();
        return false;
    }
    else if(error_mb > 0){
        Swal.fire('EXCEEDED maximum file size (10MB)!', 'Please upload a valid EXCEL file with file size not greater than 10MB.', 'error');
        $('#xlsx').val('');
        $('#xlsx').focus();
        return false;
    }
    return true;
}

function decodeHtml(str){
    var map = {'&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'"};
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m){return map[m];});
}

function formatNumber(n){
    if(n.includes('.')){
        var decimal = n.substr(-3);
        n = n.replace(decimal,'');
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")+decimal;
    }
    else{
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

function sortAmount(num){
    let numStr = num.toFixed(2).toString();
    let [integerPart, decimalPart] = numStr.split('.');
    while(integerPart.length < 13){
        integerPart = '0' + integerPart;
    }
    return integerPart + '.' + decimalPart;
}

$(document).on('keypress', '.spChar', function(e){
    var k;
    document.all ? k = e.keyCode : k = e.which;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8  || k == 13 || (k >= 48 && k <= 57));
});

$(document).on('keypress', '.stringOnly', function(e){
    var key = e.keyCode;
    if (key >= 48 && key <= 57) {
        e.preventDefault();
    }
});

$(document).on('keypress', '.spacebar', function(e){
    var key = e.keyCode;
    if (key == 32) {
        e.preventDefault();
    }
});

$(document).on('keypress', '.numberOnly', function(e){
    if (e.which != 8 && e.which != 0 && e.which < 48 || e.which > 57)
    {
        e.preventDefault();
    }
});

$(document).on('keydown', '.formatTIN', function(e){
    return ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 109 || e.keyCode == 189 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 37  || e.keyCode == 39 || e.keyCode == 65 || e.keyCode == 67 || e.keyCode == 86 || e.keyCode == 88) ? true : false;
});


function validateEmail(email){
    var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function emailProvider(email){
    if(email.includes('@gmail.com') || email.includes('@yahoo.com')){
        return true;
    }
    return false;
}

var checkRequired = true, checkChanges = true;
setInterval(checkRequiredFields, 0);
function checkRequiredFields(){
    if($('#loading').is(':hidden')){
        if($(".optionalField:visible").length > 0){
            $('.optionalField').each(function(){
                if(!$.trim($(this).val()) && !$(this).is(':focus')){
                    $(this).val('N/A');
                }
            });
        }
        if($(".requiredField:visible").length > 0){
            $('.requiredField').each(function(){
                if(!$.trim($(this).val())){
                    $(this).addClass('requiredInput');
                }
                else{
                    $(this).removeClass('requiredInput');
                }
            });
        }
        if($(".requiredInput:visible").length > 0 || $(".requiredAlert:visible").length > 0){
            checkRequired = false;
            $('.requiredNote').show();
        }
        else{
            checkRequired = true;
            $('.requiredNote').hide();
        }
        if($(".changesNote:visible").length > 0){
            checkChanges = false;
        }
        else{
            checkChanges = true;
        }
        if(checkRequired == true && checkChanges == true){
            $('.btnRequired').prop('disabled', false);
        }
        else{
            $('.btnRequired').prop('disabled', true);
        }
    }
}

$(document).on('focusout', '.requiredField', function(){
    if(!$(this).val()){
        alertName = 'className'+$(this).attr('id');
        if($('.'+alertName+':visible').length == 0){
            $(this).after('<span class="'+alertName+' req"><div style="height: 18px !important;">&nbsp;</div><p class="requiredValidation"><i class="fas fa-exclamation-triangle"></i> Required Field</p></span>');
        }
        else if($('.'+alertName+':visible').length > 1){
            alertName = 'className'+$(this).attr('id');
            $('.'+alertName).remove();
        }
    }
    else{
        alertName = 'className'+$(this).attr('id');
        $('.'+alertName).remove();
    }
});

$(document).on('blur', '.priceField', function(){
    if(!$(this).val()){
        $(this).val('0.00');
    }
    else{
        var inputValue = $(this).val();
        if(inputValue.indexOf('.') === -1){
            $(this).val(inputValue + '.00');
        }
    }
});

$(document).on('focusout', '.priceField', function(){
    if(!$(this).val() || $(this).val() < 0 || $.isNumeric($(this).val()) == false){
        $(this).val($(this).attr('min'));
        $(this).blur();
    }
});

$(document).on('change', '#province', function(){
    if($(this).val()){
        var citiesOption = " ";
        $('#region').val('');
        $.ajax({
            url:"/getCities",
            type:"get",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data:{
                provCode:$(this).val(),
            },
            success:function(data){
                var cities = $.map(data, function(value, index) {
                    return [value];
                });
                citiesOption+='<option selected disabled>SELECT CITY/MUNICIPALITY</option>';
                cities.forEach(value => {
                    citiesOption+='<option class="city" value="'+value.citymunCode+'">'+value.citymunDesc+'</option>';
                });
                $("#city").find('option').remove().end().append(citiesOption);
            }
        });
        $("#city").prop('disabled', false);
    }
});

$(document).on('change', '#city', function(){
    if($(this).val()){
        $.ajax({
            url:"/getRegion",
            type:"get",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data:{
                citymunCode:$(this).val(),
            },
            success:function(data){
                $('#region').val(data[0].regDesc);
            }
        });
    }
});

setInterval(() => {
    if($('#changePassword').is(':visible')){
        if($('#pass2').val().length < 8){
            if(!$('#validation1').hasClass('text-default')){
                $('#validation1').addClass('text-default');
            }
            $('#validation1').removeClass('text-success');

            if(!$('#validicon1').hasClass('fa-circle-xmark')){
                $('#validicon1').addClass('fa-circle-xmark');
            }
            $('#validicon1').removeClass('fa-circle-check');
        }
        else{
            if(!$('#validation1').hasClass('text-success')){
                $('#validation1').addClass('text-success');
            }
            $('#validation1').removeClass('text-default');

            if(!$('#validicon1').hasClass('fa-circle-check')){
                $('#validicon1').addClass('fa-circle-check');
            }
            $('#validicon1').removeClass('fa-circle-xmark');
        }

        if(/\d/.test($('#pass2').val()) != true){
            if(!$('#validation2').hasClass('text-default')){
                $('#validation2').addClass('text-default');
            }
            $('#validation2').removeClass('text-success');

            if(!$('#validicon2').hasClass('fa-circle-xmark')){
                $('#validicon2').addClass('fa-circle-xmark');
            }
            $('#validicon2').removeClass('fa-circle-check');
        }
        else{
            if(!$('#validation2').hasClass('text-success')){
                $('#validation2').addClass('text-success');
            }
            $('#validation2').removeClass('text-default');

            if(!$('#validicon2').hasClass('fa-circle-check')){
                $('#validicon2').addClass('fa-circle-check');
            }
            $('#validicon2').removeClass('fa-circle-xmark');
        }

        if(/[A-Z]/.test($('#pass2').val()) != true){
            if(!$('#validation3').hasClass('text-default')){
                $('#validation3').addClass('text-default');
            }
            $('#validation3').removeClass('text-success');

            if(!$('#validicon3').hasClass('fa-circle-xmark')){
                $('#validicon3').addClass('fa-circle-xmark');
            }
            $('#validicon3').removeClass('fa-circle-check');
        }
        else{
            if(!$('#validation3').hasClass('text-success')){
                $('#validation3').addClass('text-success');
            }
            $('#validation3').removeClass('text-default');

            if(!$('#validicon3').hasClass('fa-circle-check')){
                $('#validicon3').addClass('fa-circle-check');
            }
            $('#validicon3').removeClass('fa-circle-xmark');
        }

        if(/[a-z]/.test($('#pass2').val()) != true){
            if(!$('#validation4').hasClass('text-default')){
                $('#validation4').addClass('text-default');
            }
            $('#validation4').removeClass('text-success');

            if(!$('#validicon4').hasClass('fa-circle-xmark')){
                $('#validicon4').addClass('fa-circle-xmark');
            }
            $('#validicon4').removeClass('fa-circle-check');
        }
        else{
            if(!$('#validation4').hasClass('text-success')){
                $('#validation4').addClass('text-success');
            }
            $('#validation4').removeClass('text-default');

            if(!$('#validicon4').hasClass('fa-circle-check')){
                $('#validicon4').addClass('fa-circle-check');
            }
            $('#validicon4').removeClass('fa-circle-xmark');
        }

        if(/[!@#$%^&*(),.?":{}|<>]/.test($('#pass2').val()) != true){
            if(!$('#validation5').hasClass('text-default')){
                $('#validation5').addClass('text-default');
            }
            $('#validation5').removeClass('text-success');

            if(!$('#validicon5').hasClass('fa-circle-xmark')){
                $('#validicon5').addClass('fa-circle-xmark');
            }
            $('#validicon5').removeClass('fa-circle-check');
        }
        else{
            if(!$('#validation5').hasClass('text-success')){
                $('#validation5').addClass('text-success');
            }
            $('#validation5').removeClass('text-default');

            if(!$('#validicon5').hasClass('fa-circle-check')){
                $('#validicon5').addClass('fa-circle-check');
            }
            $('#validicon5').removeClass('fa-circle-xmark');
        }

        if($('.fa-circle-xmark').is(':visible')){
            if(!$('#pass2').hasClass('invalidInput')){
                $('#pass2').addClass('invalidInput');
            }
            $('#pass2').removeClass('defaultInput');
        }
        else{
            if(!$('#pass2').hasClass('defaultInput')){
                $('#pass2').addClass('defaultInput');
            }
            $('#pass2').removeClass('invalidInput');
        }
    }
}, 0);

$('#pass3').on('keyup',function(){
    if($('#pass2').val() != $('#pass3').val()){
        $('#password_match').show();
        if(!$('#pass3').hasClass('invalidInput')){
            $('#pass3').addClass('invalidInput');
        }
        $('#pass3').removeClass('defaultInput');
    }
    else{
        $('#password_match').hide();
        if(!$('#pass3').hasClass('defaultInput')){
            $('#pass3').addClass('defaultInput');
        }
        $('#pass3').removeClass('invalidInput');
    }
});

$(document).ready(function(){
    $('#show_password_eye').click(function(){
        $('#show_password').click();
        if($('#show_password').is(':checked')){
            $('#show_password_text').text('HIDE PASSWORD');
            $('#show_password_eye').removeClass('fa-eye').addClass('fa-eye-slash');
            $('#pass1').attr('type', 'search');
            $('#pass2').attr('type', 'search');
            $('#pass3').attr('type', 'search');
        }
        else{
            $('#show_password_text').text('SHOW PASSWORD');
            $('#show_password_eye').addClass('fa-eye').removeClass('fa-eye-slash');
            $('#pass1').attr('type', 'password');
            $('#pass2').attr('type', 'password');
            $('#pass3').attr('type', 'password');
        }
    });
    $('#show_password_text').click(function(){
        $('#show_password_eye').click();
    });
});

$('#lblChangePassword').on('click', function(){
    $('#pass1').val('');
    $('#pass2').val('');
    $('#pass3').val('');
    $('#changePassword').modal('show');
});

$('#btnChangePassword').on('click', function(){
    var pass1 = $('#pass1').val();
    var pass2 = $('#pass2').val();
    var pass3 = $('#pass3').val();
    if(pass1 == "" || pass2 == "" || pass3 == ""){
        $('#form_changepassword')[0].reportValidity();
        return false;
    }
    else if(pass1.length < 8 || pass2.length < 8 || pass3.length < 8){
        $('#form_changepassword')[0].reportValidity();
        return false;
    }
    else{
        if(pass2 != pass3){
            Swal.fire('NEW PASSWORD MISMATCH','The password confirmation does not match!','error');
            return false;
        }
        else{
            $.ajax({
                url: "/change/validate",
                data:{
                    current: pass1
                },
                success: function(data){
                    if(data == 'true'){
                        Swal.fire({
                            title: "CHANGE PASSWORD?",
                            html: "You are about to CHANGE your current user account password!",
                            icon: "warning",
                            showCancelButton: true,
                            cancelButtonColor: '#3085d6',
                            confirmButtonColor: '#d33',
                            confirmButtonText: 'Confirm',
                            allowOutsideClick: false
                        })
                        .then((result) => {
                            if(result.isConfirmed){
                                $.ajax({
                                    url: "/change/password",
                                    data:{
                                        new: pass2
                                    },
                                    success: function(data){
                                        if(data == 'true'){
                                            $('.closePassword').click();
                                            Swal.fire("UPDATE SUCCESS", "User changed password successfully!", "success");
                                            return true;
                                        }
                                        else{
                                            Swal.fire("UPDATE FAILED", "User password change failed!", "error");
                                            return true;
                                        }
                                    }
                                });
                            }
                        });
                    }
                    else{
                        Swal.fire('INCORRECT','Incorrect Current Password!', 'error');
                        return false;
                    }
                }
            });
        }
    }
});

$(document).on('click','.btnExport',function(){
    $('.buttons-excel').click();
});

function alpha_numeric(input){
    var letters_only = /[^- ñ a-z _ (0-9)]/gi;
    input.value = input.value.replace(letters_only,"");
}
setInterval(() => {
    if($('.saveBtn').is(":visible")){
        $('.deleteBtn').hide();
    }
    else{
        $('.deleteBtn').show();
    }
}, 0);

function accessibility(id){
    if(!current_permissions.includes(id)){
        window.location.href = '/';
    }
}

function formatDate(dateString){
    const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
    var date = new Date(dateString);
    var month = months[date.getMonth()];
    var day = date.getDate();
    var year = date.getFullYear();

    if(month < 10) month = '0' + month.toString();
    if(day < 10) day = '0' + day.toString();

    var formattedDate = month + " " + day + ", " + year;
    return formattedDate;
}

$(document).on('change','.multiple_field', function(){
    if($(this).val().length == 0 && $(this).hasClass('requiredField')){
        $(this).next('.chosen-container').addClass('requiredField requiredInput redBorder');
    }
    else{
        $(this).next('.chosen-container').removeClass('requiredField requiredInput redBorder');
        var spanClass = $(this).attr('id') + '_chosen';
        $('.className' + spanClass).remove();
    }
});

$(document).on('change','.single_field', function(){
    console.log($(this).attr('id'));
    if(!$(this).val() && $(this).hasClass('requiredField')){
        console.log($(this).next('.chosen-container').attr('id'));
        $(this).next('.chosen-container').addClass('requiredField requiredInput redBorder');
    }
    else{
        console.log($(this).find('option:selected').text());
        $(this).next('.chosen-container').removeClass('requiredField requiredInput redBorder');
        var spanClass = $(this).attr('id') + '_chosen';
        $('.className' + spanClass).remove();
    }
});