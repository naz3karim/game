window.onload = function () {
    $("#submit-login").click(function (){
        $.ajax('/api/users/login',{
            type: "POST",
            data: {
                username: $("#username-login").val(),
                password: $("#pass-login").val()
            },
            success: function (data){
                if(data.success){
                    toastr.success("Login SuccesFull")
                    window.sessionStorage.setItem("Authorization",data.token)
                    window.location.replace("/");
                }else{
                    $('.auth-error').text(data.message)

                    toastr.error(data.message)
                }
            },
            error: function (error) {
                console.log(error)
                $('.auth-error').text("Internal Error")

                window.sessionStorage.removeItem("Authorization")
                }  
        })
    })
    $("#submit-reg").click(function (){
        $.ajax('/api/users/register',{
            type: "POST",
            data: {
                username: $("#username-reg").val(),
                password: $("#pass-reg").val(),
                name: $("#name-reg").val()
            },
            success: function (data){
                if(data.success){
                    toastr.success("Registration SuccesFul")
                    window.sessionStorage.setItem("Authorization",data.token)
                    window.location.replace("/");
                    window.location.replace("/");
                }else{
                    $('.auth-error').text(data.message)
                    toastr.error(data.message)
                }
            },
            error: function (error) {
                console.log(error)
                $('.auth-error').text("Internal Error")

                window.sessionStorage.removeItem("Authorization")
                }  
        })
    })
    
  }