document.getElementById('sendEmail').addEventListener('click',function(e){
    e.preventDefault()
   
    const email = document.getElementById("email").value;
    const message = document.getElementById('error-message');

    $.ajax({
        url:'/forget',
        data:{
            email:email
        },
        method:"post",
        success: (response)=>{

             if(response.emailPatt){

                message.style.display = "block";
                message.textContent = "Enter the valid email address."
              }else if(response.mailverify){
                message.style.display = "block";
                message.textContent = "Given mail is not verified."
              }else if(response.wrong){
                message.style.display = "block";
                message.textContent = "Wrong Email Id."
              }else{
                // window.location.href = "/forgetpage"
                message.style.display = "block";
                message.textContent = "please check your mail."
              }

        },
    })

})