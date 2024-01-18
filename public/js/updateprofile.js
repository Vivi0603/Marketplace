jQuery(function($) {

    let myForm = $("#updateprofile")
    if (myForm) {
      myForm.submit(function (event) {
        let name = $("#name").val();
        let address = $("#address").val();
        let password = $("#password").val();
        let email = $("#email").val();
        let phoneNumber = $("#phoneNumber").val();


        let error = $("#error");
        let errorList = $("#errorList");
        // let nameCheck = /(?:[\w\s][^!@#$%^&*()?//><,.;:'"\{\}\[\]=+~`\-_|\\0-9]+)/;
        // let check0 = phoneNumber_term;
        // let result = check0.slice(0, 1);
        
  
        errorList.empty();
        error.hide();
        if(name &&  name.trim().length == 0) errorList.append(`<li>Enter Name</li>`);
        if(address && address.trim().length == 0) errorList.append(`<li>Enter Address</li>`);
        if(password && password.trim().length == 0) errorList.append(`<li>Enter Password</li>`);
        if(email && email.trim().length == 0) errorList.append(`<li>Enter email </li>`);
  
  
        if(name && !(/[a-zA-Z0-9]/.test(name))) errorList.append(`<li>Name should only contain numbers and alphabets</li>`);
        if(phoneNumber && !/^\d{3}-?\d{3}-?\d{4}$/.test(phoneNumber)) errorList.append(`<li>Incorrect Phone Number</li>`);
        if(email && ! /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) errorList.append(`<li>Incorrect Email Id</li>`);
        if(password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) errorList.append(`<li>Password must have one lower case,one upper case alphabets, one number and one special character</li>`);
  
        if(errorList[0].childElementCount >0){
          error.show()
          event.preventDefault();
        }
        })
      }
    })