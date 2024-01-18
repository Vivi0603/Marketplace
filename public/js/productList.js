(function ($) {

    // Make rows clickable
    $(".clickable-row").mouseup((event) => {
        let href = event.currentTarget.getAttribute('data-href')
        console.log(href);
        console.log(window.location);
        window.location = href;
    });


})(jQuery);

$(document).on("click", "#login-sumbmit", function (event) {
    event.preventDefault();
    let password = $("#password");

    let email = $("#email");
    let error = $("#error");
    let errorList = $("#errorList");
    error.hide();

    var email_term = email.val();
    var password_term = password.val().trim();

    errorList.empty();
    error.hide();

    if (!password_term || password_term.trim().length == 0) errorList.append(`<li>Enter Password</li>`);
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password_term)) errorList.append(`<li>Password must have one lower case,one upper case alphabets, one number and one special character</li>`);


    if (!email_term || email_term.trim().length == 0) errorList.append(`<li>Enter email </li>`);
    else if (! /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email_term.toLowerCase())) errorList.append(`<li>Incorrect Email Id</li>`);

    if (errorList[0].childElementCount >0) {
        error.show()
    }
    else{
    let form = $("#login-form")
    let requestConfig = {
        method: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize()
    };
    $.ajax(requestConfig).then(function (response) {
        let result = $(response)
        if (result[0].login) {
            $('#login-div').hide()
            $('#update-profile-2').css("display", "");
            // let dropdown = $('#dropdown-2');
            $('#dropdown-2').css("display", "");
            $('#cart').css("display","");
        }
        else {
            $('#login-error').css("display","");
            $('#login-error1').css("display","");
        }
        
    })
}
})

function fName(id, col) {
    let input, filter, table, row, i, txtValue;
    input = document.getElementById(id);
    filter = input.value.toUpperCase();
    let rows = document.getElementsByClassName("clickable-row");
    let c = 0;
    for (i = 0; i < rows.length; i++) {
        row = rows[i];
        txtValue1 = row.cells[1].innerText;
        txtValue2 = row.cells[2].innerText;
        if (txtValue1.toUpperCase().indexOf(filter) > -1 || txtValue2.toUpperCase().indexOf(filter) > -1) {
            row.style.display = "";
            c = c + 1;
        } else {
            row.style.display = "none";
        }
    }
    table = document.getElementsByClassName("m-5")[1];
    no_table = document.getElementById("no-result");
    if (c == 0) {
        table.hidden = true;
        no_table.hidden = false;
    } else {
        table.hidden = false;
        no_table.hidden = true;
    }
}

function fCost(id, col, compareFn = (a, b) => a >= b) {
    let input, table, row, i, txtValue;
    input = document.getElementById(id);
    input = input.value
    let rows = document.getElementsByClassName("clickable-row");
    let c = 0;
    for (i = 0; i < rows.length; i++) {
        row = rows[i];
        txtValue = row.cells[col].innerText;
        let maxCost = parseFloat(txtValue)
        if (compareFn(parseFloat(input), maxCost)) {
            row.style.display = "";
            c = c + 1;
        } else {
            row.style.display = "none";
        }
    }
    table = document.getElementsByClassName("m-5")[1];
    no_table = document.getElementById("no-result");
    if (c == 0) {
        table.hidden = true;
        no_table.hidden = false;
    } else {
        table.hidden = false;
        no_table.hidden = true;
    }
}

var rsb = document.getElementById("rsb");
var rsd = document.getElementById("rsd");
var psb = document.getElementById("psb");
var psd = document.getElementById("psd");
rsd.innerHTML = rsb.value;
psd.innerHTML = psb.value;
rsb.oninput = function () {
    rsd.innerHTML = this.value;
}
psb.oninput = function () {
    psd.innerHTML = this.value;
}