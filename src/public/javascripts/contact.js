window.onload = function () {
    $("#send-mail").click(function (){
        $.ajax('/api/contact/',{
            type: "POST",
            data: {
                name:  $("#grid-first-name").val() + " " + $("#grid-last-name").val(),
                email: $("#email").val(),
                message: $("#message").val()
            },
            success: function (data){
                console.log(data)
                if(data.success){
                    toastr.success("Sent Mail Successfully")
                    window.location.replace("/contact-success")
                }else{
                    toastr.error("Mail Sending Failed")
                    window.location.replace("/contact-failure")

                }
            },
            error: function (error) {
                toastr.error("Mail Sending Failed")
                window.location.replace("/contact-failure")


                }  
        })
    })
    
  }