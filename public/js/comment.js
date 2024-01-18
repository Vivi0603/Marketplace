
jQuery(function($){
    //let category = $("#product-select").val();
  
    //let price = $("#price").val();
  
    let myForm = $("#commentForm");
  
    let error = $("#error");
    let errorList = $("#errorList");
    error.hide();
    errorList.empty()
    if (myForm) {
      myForm.submit(function (event) {
        let comments= $("#phrase").val();
      
        errorList.empty();
        error.hide();
        if(comments && comments.trim().length == 0) errorList.append(`<li>Enter Comment</li>`);        
        //if(! /?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]/.test(email_term)) errorList.append(`<li>Incorrect Email Id</li>`);
        
  
        if(errorList[0].childElementCount >0){
          error.show()
          event.preventDefault();
        }
        })
      }
    })